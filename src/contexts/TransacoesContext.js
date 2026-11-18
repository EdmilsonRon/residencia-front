
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';

const TransacoesContext = createContext(null);

const CHAVE_TRANSACOES = '@financeiro_transacoes';
const CHAVE_PENDENTES = '@financeiro_pendentes';
const CHAVE_RECORRENCIAS = '@financeiro_recorrencias';

const LIMITE_TRANSACOES = 100;
const LIMITE_PARCELAS = 24;

function gerarId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function obterDataHoje() {
  const hoje = new Date();

  const ano = hoje.getFullYear();
  const mes = String(hoje.getMonth() + 1).padStart(2, '0');
  const dia = String(hoje.getDate()).padStart(2, '0');

  return `${ano}-${mes}-${dia}`;
}

function adicionarMeses(dataISO, quantidade) {
  const [ano, mes, dia] = dataISO.split('-').map(Number);

  const primeiroDia = new Date(
    ano,
    mes - 1 + quantidade,
    1
  );

  const ultimoDia = new Date(
    primeiroDia.getFullYear(),
    primeiroDia.getMonth() + 1,
    0
  ).getDate();

  const diaFinal = Math.min(dia, ultimoDia);

  const novoAno = primeiroDia.getFullYear();
  const novoMes = String(
    primeiroDia.getMonth() + 1
  ).padStart(2, '0');
  const novoDia = String(diaFinal).padStart(2, '0');

  return `${novoAno}-${novoMes}-${novoDia}`;
}

/*
 * Mantém no máximo 100 transações desarquivadas.
 * Não remove nenhum registro do histórico.
 */
function aplicarLimiteTransacoes(lista) {
  const atualizadas = lista.map((item) => ({
    ...item,
    arquivada: Boolean(item.arquivada),
  }));

  const ativas = atualizadas
    .filter((item) => !item.arquivada)
    .sort((a, b) => {
      const comparacaoData = (b.data || '').localeCompare(a.data || '');

      if (comparacaoData !== 0) {
        return comparacaoData;
      }

      return (b.criadoEm || '').localeCompare(a.criadoEm || '');
    });

  const idsAtivas = new Set(
    ativas
      .slice(0, LIMITE_TRANSACOES)
      .map((item) => item.id)
  );

  return atualizadas.map((item) => {
    if (item.arquivada) return item;

    return {
      ...item,
      arquivada: !idsAtivas.has(item.id),
    };
  });
}

/*
 * Gera somente até 24 parcelas.
 */
function gerarLancamentos(
  recorrencia,
  pendentesAtuais = []
) {
  const novosPendentes = [...pendentesAtuais];

  if (!recorrencia.ativa) {
    return {
      recorrenciaAtualizada: recorrencia,
      novosPendentes,
    };
  }

  const quantidade = Number(recorrencia.quantidade);

  if (
    !Number.isInteger(quantidade) ||
    quantidade < 1 ||
    quantidade > LIMITE_PARCELAS
  ) {
    return {
      recorrenciaAtualizada: {
        ...recorrencia,
        ativa: false,
      },
      novosPendentes,
    };
  }

  let gerados = recorrencia.gerados || 0;

  while (gerados < quantidade) {
    const dataLancamento = adicionarMeses(
      recorrencia.dataInicial,
      gerados
    );

    const parcela = gerados + 1;

    const jaExiste = novosPendentes.some(
      (item) =>
        item.recorrenciaId === recorrencia.id &&
        item.parcela === parcela
    );

    if (!jaExiste) {
      novosPendentes.push({
        id: gerarId(),
        recorrenciaId: recorrencia.id,
        descricao: recorrencia.descricao,
        categoria: recorrencia.categoria,
        valor: recorrencia.valor,
        tipo: recorrencia.tipo,
        data: dataLancamento,
        parcela,
        totalParcelas: quantidade,
        status: 'pendente',
        icone: recorrencia.icone,
        corFundo: recorrencia.corFundo,
        corIcone: recorrencia.corIcone,
        criadoEm: new Date().toISOString(),
      });
    }

    gerados++;
  }

  return {
    recorrenciaAtualizada: {
      ...recorrencia,
      gerados,
      ativa: false,
    },
    novosPendentes,
  };
}

export function TransacoesProvider({ children }) {
  const [transacoes, setTransacoes] = useState([]);
  const [lancamentosPendentes, setLancamentosPendentes] = useState([]);
  const [recorrencias, setRecorrencias] = useState([]);
  const [carregado, setCarregado] = useState(false);

  // CARREGAR DADOS
  useEffect(() => {
    async function carregarDados() {
      try {
        const [
          transacoesSalvas,
          pendentesSalvos,
          recorrenciasSalvas,
        ] = await Promise.all([
          AsyncStorage.getItem(CHAVE_TRANSACOES),
          AsyncStorage.getItem(CHAVE_PENDENTES),
          AsyncStorage.getItem(CHAVE_RECORRENCIAS),
        ]);

        // Começa com uma lista vazia quando não existem dados salvos.
        const transacoesCarregadas = transacoesSalvas
          ? JSON.parse(transacoesSalvas)
          : [];

        /*
         * Aplica o limite na inicialização.
         * As transações antigas continuam armazenadas,
         * apenas recebem arquivada: true.
         */
        setTransacoes(
          aplicarLimiteTransacoes(transacoesCarregadas)
        );

        let pendentesCarregados = pendentesSalvos
          ? JSON.parse(pendentesSalvos)
          : [];

        /*
         * Migração dos parcelamentos antigos:
         * parcelas pendentes acima de 24 são retiradas.
         * Parcelas já confirmadas não são modificadas.
         */
        pendentesCarregados = pendentesCarregados
          .filter((item) => {
            if (!item.recorrenciaId) return true;

            return Number(item.parcela || 0) <= LIMITE_PARCELAS;
          })
          .map((item) => {
            if (!item.recorrenciaId) return item;

            return {
              ...item,
              totalParcelas: Math.min(
                Number(item.totalParcelas || LIMITE_PARCELAS),
                LIMITE_PARCELAS
              ),
            };
          });

        setLancamentosPendentes(pendentesCarregados);

        const recorrenciasCarregadas = recorrenciasSalvas
          ? JSON.parse(recorrenciasSalvas)
          : [];

        const recorrenciasConvertidas = recorrenciasCarregadas.map(
          (item) => {
            const quantidadeAntiga = Number(
              item.quantidade || LIMITE_PARCELAS
            );

            const quantidadeNova = Math.min(
              quantidadeAntiga,
              LIMITE_PARCELAS
            );

            const gerados = Math.min(
              Number(item.gerados || 0),
              LIMITE_PARCELAS
            );

            return {
              ...item,
              ilimitada: false,
              quantidade: quantidadeNova,
              gerados,
              ativa:
                Boolean(item.ativa) &&
                gerados < quantidadeNova,
            };
          }
        );

        setRecorrencias(recorrenciasConvertidas);
      } catch (erro) {
        console.log('Erro ao carregar transações:', erro);

        setTransacoes([]);
        setLancamentosPendentes([]);
        setRecorrencias([]);
      } finally {
        setCarregado(true);
      }
    }

    carregarDados();
  }, []);

  // SALVAR DADOS
  useEffect(() => {
    if (!carregado) return;

    async function salvarDados() {
      try {
        await Promise.all([
          AsyncStorage.setItem(
            CHAVE_TRANSACOES,
            JSON.stringify(transacoes)
          ),
          AsyncStorage.setItem(
            CHAVE_PENDENTES,
            JSON.stringify(lancamentosPendentes)
          ),
          AsyncStorage.setItem(
            CHAVE_RECORRENCIAS,
            JSON.stringify(recorrencias)
          ),
        ]);
      } catch (erro) {
        console.log('Erro ao salvar dados:', erro);
      }
    }

    salvarDados();
  }, [
    transacoes,
    lancamentosPendentes,
    recorrencias,
    carregado,
  ]);

  // ADICIONAR TRANSAÇÃO ÚNICA
  function adicionarTransacao(novaTransacao) {
    const transacaoCriada = {
      ...novaTransacao,
      id: gerarId(),
      status: 'confirmada',
      arquivada: false,
      criadoEm: new Date().toISOString(),
    };

    setTransacoes((atuais) =>
      aplicarLimiteTransacoes([
        transacaoCriada,
        ...atuais,
      ])
    );

    return transacaoCriada;
  }

  // ADICIONAR PROGRAMAÇÃO
  function adicionarRecorrencia(dados) {
    const quantidade = Number(dados.quantidade);
    const valor = Number(dados.valor);

    if (
      !dados.descricao ||
      !dados.data ||
      !['Receita', 'Despesa'].includes(dados.tipo)
    ) {
      return false;
    }

    if (
      !Number.isInteger(quantidade) ||
      quantidade < 2 ||
      quantidade > LIMITE_PARCELAS
    ) {
      return false;
    }

    if (!Number.isFinite(valor) || valor <= 0) {
      return false;
    }

    const novaRecorrencia = {
      id: gerarId(),
      descricao: dados.descricao,
      categoria: dados.categoria || null,
      valor,
      tipo: dados.tipo,
      dataInicial: dados.data,
      quantidade,
      ilimitada: false,
      gerados: 0,
      ativa: true,
      icone: dados.icone,
      corFundo: dados.corFundo,
      corIcone: dados.corIcone,
      criadoEm: new Date().toISOString(),
    };

    const resultado = gerarLancamentos(
      novaRecorrencia,
      lancamentosPendentes
    );

    setRecorrencias((atuais) => [
      ...atuais,
      resultado.recorrenciaAtualizada,
    ]);

    setLancamentosPendentes(resultado.novosPendentes);

    return resultado.recorrenciaAtualizada;
  }

  // ATUALIZAR PROGRAMAÇÕES ATIVAS
  function atualizarProgramacoes() {
    let pendentesAtualizados = [...lancamentosPendentes];

    const recorrenciasAtualizadas = recorrencias.map(
      (recorrencia) => {
        if (!recorrencia.ativa) return recorrencia;

        const resultado = gerarLancamentos(
          recorrencia,
          pendentesAtualizados
        );

        pendentesAtualizados = resultado.novosPendentes;

        return resultado.recorrenciaAtualizada;
      }
    );

    setRecorrencias(recorrenciasAtualizadas);
    setLancamentosPendentes(pendentesAtualizados);
  }

  // CONFIRMAR LANÇAMENTO PENDENTE
  function confirmarLancamento(id) {
    const lancamento = lancamentosPendentes.find(
      (item) => item.id === id
    );

    if (!lancamento) return false;

    if (lancamento.data > obterDataHoje()) {
      return false;
    }

    const transacaoConfirmada = {
      ...lancamento,
      status: 'confirmada',
      arquivada: false,
      confirmadoEm: new Date().toISOString(),
    };

    setTransacoes((atuais) =>
      aplicarLimiteTransacoes([
        transacaoConfirmada,
        ...atuais,
      ])
    );

    setLancamentosPendentes((atuais) =>
      atuais.filter((item) => item.id !== id)
    );

    return true;
  }

  // EDITAR LANÇAMENTO PENDENTE
  function editarLancamento(id, novosDados, escopo = 'unico') {
    const lancamento = lancamentosPendentes.find(
      (item) => item.id === id
    );

    if (!lancamento) return false;

    const valor = Number(novosDados.valor);

    if (
      !novosDados.descricao?.trim() ||
      !novosDados.categoria ||
      !Number.isFinite(valor) ||
      valor <= 0
    ) {
      return false;
    }

    const dadosAtualizados = {
      descricao: novosDados.descricao.trim(),
      categoria: novosDados.categoria,
      valor,
      icone: novosDados.icone || lancamento.icone,
      corFundo: novosDados.corFundo || lancamento.corFundo,
      corIcone: novosDados.corIcone || lancamento.corIcone,
    };

    if (escopo === 'unico' || !lancamento.recorrenciaId) {
      setLancamentosPendentes((atuais) =>
        atuais.map((item) =>
          item.id === id
            ? { ...item, ...dadosAtualizados }
            : item
        )
      );

      return true;
    }

    if (escopo === 'proximos') {
      const recorrenciaId = lancamento.recorrenciaId;
      const parcelaSelecionada = lancamento.parcela;

      setLancamentosPendentes((atuais) =>
        atuais.map((item) => {
          if (
            item.recorrenciaId === recorrenciaId &&
            item.parcela >= parcelaSelecionada
          ) {
            return {
              ...item,
              ...dadosAtualizados,
            };
          }

          return item;
        })
      );

      setRecorrencias((atuais) =>
        atuais.map((item) =>
          item.id === recorrenciaId
            ? { ...item, ...dadosAtualizados }
            : item
        )
      );

      return true;
    }

    return false;
  }

  // EXCLUIR PARCELA PENDENTE E AS SEGUINTES
  function excluirLancamentosFuturos(id) {
    const lancamento = lancamentosPendentes.find(
      (item) => item.id === id
    );

    if (!lancamento) return false;

    if (!lancamento.recorrenciaId) {
      setLancamentosPendentes((atuais) =>
        atuais.filter((item) => item.id !== id)
      );

      return true;
    }

    const recorrenciaId = lancamento.recorrenciaId;
    const parcelaSelecionada = lancamento.parcela;

    setLancamentosPendentes((atuais) =>
      atuais.filter((item) => {
        if (item.recorrenciaId !== recorrenciaId) {
          return true;
        }

        return item.parcela < parcelaSelecionada;
      })
    );

    setRecorrencias((atuais) =>
      atuais.map((item) =>
        item.id === recorrenciaId
          ? { ...item, ativa: false }
          : item
      )
    );

    return true;
  }

  // ARQUIVAR UMA TRANSAÇÃO CONFIRMADA MANUALMENTE
  function arquivarTransacao(id) {
    const existe = transacoes.some(
      (item) => item.id === id && !item.arquivada
    );

    if (!existe) return false;

    setTransacoes((atuais) =>
      atuais.map((item) =>
        item.id === id
          ? { ...item, arquivada: true }
          : item
      )
    );

    return true;
  }

  // RESTAURAR UMA TRANSAÇÃO ARQUIVADA
  function restaurarTransacao(id) {
    const existe = transacoes.some(
      (item) => item.id === id && item.arquivada
    );

    if (!existe) return false;

    setTransacoes((atuais) => {
      const atualizadas = atuais.map((item) =>
        item.id === id
          ? { ...item, arquivada: false }
          : item
      );

      /*
       * Se já houver 100 registros ativos,
       * o mais antigo será arquivado para abrir espaço.
       */
      return aplicarLimiteTransacoes(atualizadas);
    });

    return true;
  }

  // ATUALIZAR CATEGORIAS
  function atualizarCategoriaTransacoes(
    categoriaAntiga,
    categoriaNova,
    tipo
  ) {
    setTransacoes((atuais) =>
      atuais.map((transacao) => {
        if (
          transacao.categoria === categoriaAntiga &&
          transacao.tipo === tipo
        ) {
          return {
            ...transacao,
            categoria: categoriaNova,
          };
        }

        return transacao;
      })
    );

    setLancamentosPendentes((atuais) =>
      atuais.map((item) => {
        if (
          item.categoria === categoriaAntiga &&
          item.tipo === tipo
        ) {
          return {
            ...item,
            categoria: categoriaNova,
          };
        }

        return item;
      })
    );

    setRecorrencias((atuais) =>
      atuais.map((item) => {
        if (
          item.categoria === categoriaAntiga &&
          item.tipo === tipo
        ) {
          return {
            ...item,
            categoria: categoriaNova,
          };
        }

        return item;
      })
    );
  }

  // CANCELAR PROGRAMAÇÃO INTEIRA
  function cancelarRecorrencia(id) {
    setRecorrencias((atuais) =>
      atuais.map((item) =>
        item.id === id
          ? { ...item, ativa: false }
          : item
      )
    );

    setLancamentosPendentes((atuais) =>
      atuais.filter((item) => item.recorrenciaId !== id)
    );

    return true;
  }

  return (
    <TransacoesContext.Provider
      value={{
        transacoes,
        lancamentosPendentes,
        recorrencias,
        carregado,
        adicionarTransacao,
        adicionarRecorrencia,
        confirmarLancamento,
        editarLancamento,
        excluirLancamentosFuturos,
        cancelarRecorrencia,
        atualizarCategoriaTransacoes,
        atualizarProgramacoes,
        arquivarTransacao,
        restaurarTransacao,
      }}
    >
      {children}
    </TransacoesContext.Provider>
  );
}

export function useTransacoes() {
  const contexto = useContext(TransacoesContext);

  if (!contexto) {
    throw new Error(
      'useTransacoes precisa ser utilizado dentro de TransacoesProvider.'
    );
  }

  return contexto;
}
