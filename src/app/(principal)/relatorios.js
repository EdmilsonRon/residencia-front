
import React, { useMemo, useState } from 'react';

import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import { useTransacoes } from '../../contexts/TransacoesContext';
import { useCategorias } from '../../contexts/CategoriasContext';
import { useOrcamentos } from '../../contexts/OrcamentosContext';
import { useMetas } from '../../contexts/MetasContext';

const CORES = {
  vermelho: '#D92344',
  vermelhoClaro: '#FCE8E6',
  verde: '#238B45',
  verdeClaro: '#E4F5E9',
  roxo: '#7950C7',
  roxoClaro: '#F0E9FF',
  texto: '#252525',
  secundario: '#888888',
  borda: '#EEEEEE',
  fundo: '#FFFFFF',
  cinza: '#F7F7F7',
};

function formatarMoeda(valor) {
  return Number(valor || 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

function formatarPercentual(valor) {
  return `${Number(valor || 0).toLocaleString('pt-BR', {
    maximumFractionDigits: 1,
  })}%`;
}

function converterData(data) {
  if (!data || typeof data !== 'string') {
    return null;
  }

  const partes = data.split('-');

  if (partes.length !== 3) {
    return null;
  }

  const ano = Number(partes[0]);
  const mes = Number(partes[1]);
  const dia = Number(partes[2]);

  if (
    !Number.isInteger(ano) ||
    !Number.isInteger(mes) ||
    !Number.isInteger(dia)
  ) {
    return null;
  }

  const dataConvertida = new Date(ano, mes - 1, dia);

  if (
    dataConvertida.getFullYear() !== ano ||
    dataConvertida.getMonth() !== mes - 1 ||
    dataConvertida.getDate() !== dia
  ) {
    return null;
  }

  return dataConvertida;
}

function obterChaveMes(data) {
  return `${data.getFullYear()}-${String(
    data.getMonth() + 1
  ).padStart(2, '0')}`;
}

function obterNomeMes(data) {
  return data.toLocaleDateString('pt-BR', {
    month: 'short',
  }).replace('.', '');
}

function inicioDoDia(data) {
  return new Date(
    data.getFullYear(),
    data.getMonth(),
    data.getDate()
  );
}

function adicionarDias(data, quantidade) {
  const novaData = new Date(data);
  novaData.setDate(novaData.getDate() + quantidade);
  return novaData;
}

function obterLimitesPeriodo(periodo, hoje) {
  const ano = hoje.getFullYear();
  const mes = hoje.getMonth();

  if (periodo === 'mes') {
    return {
      inicio: new Date(ano, mes, 1),
      fim: inicioDoDia(hoje),
      anteriorInicio: new Date(ano, mes - 1, 1),
      anteriorFim: new Date(ano, mes, 0),
    };
  }

  if (periodo === 'seis') {
    return {
      inicio: new Date(ano, mes - 5, 1),
      fim: inicioDoDia(hoje),
      anteriorInicio: new Date(ano, mes - 11, 1),
      anteriorFim: new Date(ano, mes - 5, 0),
    };
  }

  if (periodo === 'ano') {
    return {
      inicio: new Date(ano, 0, 1),
      fim: inicioDoDia(hoje),
      anteriorInicio: new Date(ano - 1, 0, 1),
      anteriorFim: new Date(
        ano - 1,
        mes,
        hoje.getDate()
      ),
    };
  }

  return {
    inicio: null,
    fim: inicioDoDia(hoje),
    anteriorInicio: null,
    anteriorFim: null,
  };
}

function BarraProgresso({
  percentual,
  cor = CORES.vermelho,
}) {
  const largura = Math.min(
    Math.max(Number(percentual || 0), 0),
    100
  );

  return (
    <View style={estilos.fundoBarra}>
      <View
        style={[
          estilos.preenchimentoBarra,
          {
            width: `${largura}%`,
            backgroundColor: cor,
          },
        ]}
      />
    </View>
  );
}

function CartaoSecao({
  titulo,
  descricao,
  children,
}) {
  return (
    <View style={estilos.secao}>
      <View style={estilos.cabecalhoSecao}>
        <Text style={estilos.tituloSecao}>
          {titulo}
        </Text>

        {descricao ? (
          <Text style={estilos.descricaoSecao}>
            {descricao}
          </Text>
        ) : null}
      </View>

      <View style={estilos.cartao}>
        {children}
      </View>
    </View>
  );
}

function IndicadorComparacao({
  atual,
  anterior,
  inverso = false,
}) {
  if (anterior === 0) {
    return (
      <Text style={estilos.textoComparacao}>
        {atual > 0 ? 'Sem comparação anterior' : 'Sem movimentações'}
      </Text>
    );
  }

  const variacao = ((atual - anterior) / anterior) * 100;

  const melhorou = inverso
    ? variacao <= 0
    : variacao >= 0;

  const icone = variacao > 0
    ? 'arrow-up'
    : variacao < 0
    ? 'arrow-down'
    : 'remove';

  return (
    <View style={estilos.comparacao}>
      <Ionicons
        name={icone}
        size={13}
        color={melhorou ? CORES.verde : CORES.vermelho}
      />

      <Text
        style={[
          estilos.textoComparacao,
          {
            color: melhorou ? CORES.verde : CORES.vermelho,
          },
        ]}
      >
        {formatarPercentual(Math.abs(variacao))}
        {' em relação ao período anterior'}
      </Text>
    </View>
  );
}

export default function Relatorios() {
  const { transacoes } = useTransacoes();
  const { categorias } = useCategorias();
  const { orcamentos } = useOrcamentos();
  const { metas } = useMetas();

  const [periodo, setPeriodo] = useState('mes');
  const [tipoCategoria, setTipoCategoria] = useState('Despesa');

  const hoje = useMemo(
    () => inicioDoDia(new Date()),
    []
  );

  const limitesPeriodo = useMemo(
    () => obterLimitesPeriodo(periodo, hoje),
    [periodo, hoje]
  );

  /*
   * Considera apenas movimentações efetivamente realizadas.
   *
   * Transações arquivadas continuam participando
   * dos relatórios históricos.
   */
  const transacoesValidas = useMemo(() => {
    return transacoes.filter(transacao => {
      if (transacao.status === 'pendente') {
        return false;
      }

      if (
        transacao.status &&
        transacao.status !== 'confirmada'
      ) {
        return false;
      }

      const data = converterData(transacao.data);

      if (!data || data > hoje) {
        return false;
      }

      const valor = Number(transacao.valor);

      if (!Number.isFinite(valor) || valor <= 0) {
        return false;
      }

      return (
        transacao.tipo === 'Receita' ||
        transacao.tipo === 'Despesa'
      );
    });
  }, [transacoes, hoje]);

  function estaNoPeriodo(transacao, inicio, fim) {
    const data = converterData(transacao.data);

    if (!data || !fim) {
      return false;
    }

    if (inicio && data < inicio) {
      return false;
    }

    return data <= fim;
  }

  const transacoesFiltradas = useMemo(() => {
    return transacoesValidas.filter(transacao =>
      estaNoPeriodo(
        transacao,
        limitesPeriodo.inicio,
        limitesPeriodo.fim
      )
    );
  }, [transacoesValidas, limitesPeriodo]);

  const transacoesAnteriores = useMemo(() => {
    if (!limitesPeriodo.anteriorInicio) {
      return [];
    }

    return transacoesValidas.filter(transacao =>
      estaNoPeriodo(
        transacao,
        limitesPeriodo.anteriorInicio,
        limitesPeriodo.anteriorFim
      )
    );
  }, [transacoesValidas, limitesPeriodo]);

  function calcularResumo(lista) {
    const receitas = lista
      .filter(item => item.tipo === 'Receita')
      .reduce(
        (total, item) => total + Number(item.valor),
        0
      );

    const despesas = lista
      .filter(item => item.tipo === 'Despesa')
      .reduce(
        (total, item) => total + Number(item.valor),
        0
      );

    return {
      receitas,
      despesas,
      saldo: receitas - despesas,
      quantidade: lista.length,
    };
  }

  const resumo = useMemo(
    () => calcularResumo(transacoesFiltradas),
    [transacoesFiltradas]
  );

  const resumoAnterior = useMemo(
    () => calcularResumo(transacoesAnteriores),
    [transacoesAnteriores]
  );

  const comprometimento = resumo.receitas > 0
    ? (resumo.despesas / resumo.receitas) * 100
    : 0;

  const percentualReceitas = resumo.receitas > 0
    ? (resumo.saldo / resumo.receitas) * 100
    : 0;

  /*
   * Evolução dos últimos seis meses.
   */
  const evolucaoMensal = useMemo(() => {
    const meses = [];

    for (let i = 5; i >= 0; i--) {
      const data = new Date(
        hoje.getFullYear(),
        hoje.getMonth() - i,
        1
      );

      const chave = obterChaveMes(data);

      const movimentacoes = transacoesValidas.filter(item => {
        const dataItem = converterData(item.data);

        return dataItem &&
          obterChaveMes(dataItem) === chave;
      });

      const receitas = movimentacoes
        .filter(item => item.tipo === 'Receita')
        .reduce(
          (total, item) => total + Number(item.valor),
          0
        );

      const despesas = movimentacoes
        .filter(item => item.tipo === 'Despesa')
        .reduce(
          (total, item) => total + Number(item.valor),
          0
        );

      meses.push({
        chave,
        nome: obterNomeMes(data),
        receitas,
        despesas,
        saldo: receitas - despesas,
      });
    }

    return meses;
  }, [transacoesValidas, hoje]);

  const maiorValorMensal = Math.max(
    1,
    ...evolucaoMensal.flatMap(item => [
      item.receitas,
      item.despesas,
    ])
  );

  /*
   * Categorias.
   *
   * Aportes de metas ficam separados das despesas comuns.
   */
  const valoresPorCategoria = useMemo(() => {
    const categoriasDoTipo = categorias.filter(
      item => item.tipo === tipoCategoria
    );

    const totalDoTipo = tipoCategoria === 'Despesa'
      ? resumo.despesas
      : resumo.receitas;

    const resultado = categoriasDoTipo.map(categoria => {
      const movimentacoes = transacoesFiltradas.filter(
        transacao =>
          transacao.categoria === categoria.nome &&
          transacao.tipo === tipoCategoria &&
          !transacao.metaId
      );

      const total = movimentacoes.reduce(
        (soma, item) => soma + Number(item.valor),
        0
      );

      return {
        ...categoria,
        total,
        quantidade: movimentacoes.length,
        percentual: totalDoTipo > 0
          ? (total / totalDoTipo) * 100
          : 0,
      };
    }).filter(item => item.total > 0);

    if (tipoCategoria === 'Despesa') {
      const aportes = transacoesFiltradas.filter(
        item =>
          item.tipo === 'Despesa' &&
          item.metaId
      );

      const totalAportes = aportes.reduce(
        (total, item) => total + Number(item.valor),
        0
      );

      if (totalAportes > 0) {
        resultado.push({
          id: 'categoria-metas',
          nome: 'Aportes em metas',
          icone: 'flag-outline',
          cor: CORES.roxo,
          corFundo: CORES.roxoClaro,
          total: totalAportes,
          quantidade: aportes.length,
          percentual: totalDoTipo > 0
            ? (totalAportes / totalDoTipo) * 100
            : 0,
        });
      }
    }

    return resultado.sort(
      (a, b) => b.total - a.total
    );
  }, [
    categorias,
    tipoCategoria,
    transacoesFiltradas,
    resumo,
  ]);

  const totalCategoria = tipoCategoria === 'Despesa'
    ? resumo.despesas
    : resumo.receitas;

  /*
   * Orçamentos: os limites são mensais.
   * Por isso, sempre analisamos o mês atual,
   * independentemente do filtro dos relatórios.
   */
  const analiseOrcamentos = useMemo(() => {
    return orcamentos.map(orcamento => {
      const movimentacoes = transacoesValidas.filter(
        transacao => {
          const data = converterData(transacao.data);

          return (
            transacao.tipo === 'Despesa' &&
            !transacao.metaId &&
            transacao.categoria === orcamento.categoria &&
            data &&
            data.getMonth() === hoje.getMonth() &&
            data.getFullYear() === hoje.getFullYear()
          );
        }
      );

      const gasto = movimentacoes.reduce(
        (total, item) => total + Number(item.valor),
        0
      );

      const limite = Number(orcamento.limite || 0);

      const percentual = limite > 0
        ? (gasto / limite) * 100
        : 0;

      return {
        ...orcamento,
        gasto,
        limite,
        percentual,
        restante: limite - gasto,
        quantidade: movimentacoes.length,
      };
    }).sort(
      (a, b) => b.percentual - a.percentual
    );
  }, [orcamentos, transacoesValidas, hoje]);

  const totalLimites = analiseOrcamentos.reduce(
    (total, item) => total + item.limite,
    0
  );

  const totalGastoOrcamentos = analiseOrcamentos.reduce(
    (total, item) => total + item.gasto,
    0
  );

  /*
   * Metas: utiliza todos os aportes confirmados.
   * Excluir uma meta não apaga os registros financeiros antigos.
   */
  const analiseMetas = useMemo(() => {
    return metas.map(meta => {
      const aportes = transacoesValidas.filter(
        transacao =>
          transacao.metaId === meta.id &&
          transacao.tipo === 'Despesa'
      );

      const guardado = aportes.reduce(
        (total, item) => total + Number(item.valor),
        0
      );

      const objetivo = Number(meta.objetivo || 0);

      const percentual = objetivo > 0
        ? Math.min((guardado / objetivo) * 100, 100)
        : 0;

      return {
        ...meta,
        guardado,
        objetivo,
        percentual,
        restante: Math.max(objetivo - guardado, 0),
        concluida: objetivo > 0 && guardado >= objetivo,
      };
    });
  }, [metas, transacoesValidas]);

  const totalObjetivos = analiseMetas.reduce(
    (total, item) => total + item.objetivo,
    0
  );

  const totalGuardado = analiseMetas.reduce(
    (total, item) => total + item.guardado,
    0
  );

  const metasConcluidas = analiseMetas.filter(
    item => item.concluida
  ).length;

  const percentualMetas = totalObjetivos > 0
    ? Math.min((totalGuardado / totalObjetivos) * 100, 100)
    : 0;

  /*
   * Destaques do período.
   */
  const despesasComuns = transacoesFiltradas.filter(
    item =>
      item.tipo === 'Despesa' &&
      !item.metaId
  );

  const receitasDoPeriodo = transacoesFiltradas.filter(
    item => item.tipo === 'Receita'
  );

  const maiorDespesa = [...despesasComuns].sort(
    (a, b) => Number(b.valor) - Number(a.valor)
  )[0];

  const maiorReceita = [...receitasDoPeriodo].sort(
    (a, b) => Number(b.valor) - Number(a.valor)
  )[0];

  const mediaDiaria = resumo.despesas > 0
    ? resumo.despesas / (
        Math.max(
          1,
          Math.floor(
            (inicioDoDia(hoje) - (
              limitesPeriodo.inicio || (
                converterData(
                  transacoesFiltradas
                    .map(item => item.data)
                    .sort()[0]
                ) || hoje
              )
            )) / 86400000
          ) + 1
        )
      )
    : 0;

  const descricaoPeriodo = {
    mes: 'em comparação ao mês anterior',
    seis: 'em comparação aos seis meses anteriores',
    ano: 'em comparação ao ano anterior',
    geral: 'histórico completo',
  };

  const rotuloPeriodo = {
    mes: 'Este mês',
    seis: 'Últimos 6 meses',
    ano: 'Este ano',
    geral: 'Todo o período',
  };

  return (
    <View style={estilos.container}>
      <ScrollView
        contentContainerStyle={estilos.conteudo}
        showsVerticalScrollIndicator={false}
      >
        {/* CABEÇALHO */}

        <View style={estilos.cabecalho}>
          <TouchableOpacity
            style={estilos.botaoVoltar}
            onPress={() => router.back()}
          >
            <Ionicons
              name="arrow-back"
              size={22}
              color={CORES.texto}
            />
          </TouchableOpacity>

          <View style={estilos.cabecalhoTexto}>
            <Text style={estilos.titulo}>
              Relatórios
            </Text>

            <Text style={estilos.subtitulo}>
              Acompanhe sua vida financeira
            </Text>
          </View>
        </View>

        {/* FILTRO DE PERÍODO */}

        <Text style={estilos.rotuloPeriodo}>
          Período de análise
        </Text>

        <View style={estilos.filtros}>
          {[
            { id: 'mes', nome: 'Este mês' },
            { id: 'seis', nome: '6 meses' },
            { id: 'ano', nome: 'Este ano' },
            { id: 'geral', nome: 'Geral' },
          ].map(item => {
            const selecionado = periodo === item.id;

            return (
              <TouchableOpacity
                key={item.id}
                style={[
                  estilos.filtro,
                  selecionado && estilos.filtroAtivo,
                ]}
                onPress={() => setPeriodo(item.id)}
              >
                <Text
                  style={[
                    estilos.textoFiltro,
                    selecionado && estilos.textoFiltroAtivo,
                  ]}
                >
                  {item.nome}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* RESUMO FINANCEIRO */}

        <View style={estilos.cartaoSaldo}>
          <View style={estilos.linhaSaldo}>
            <View style={estilos.informacaoSaldo}>
              <Text style={estilos.rotuloSaldo}>
                SALDO DO PERÍODO
              </Text>

              <Text
                style={[
                  estilos.valorSaldo,
                  {
                    color: resumo.saldo >= 0
                      ? '#FFFFFF'
                      : '#FFE0E0',
                  },
                ]}
                adjustsFontSizeToFit
                numberOfLines={1}
              >
                {formatarMoeda(resumo.saldo)}
              </Text>
            </View>

            <View style={estilos.iconeSaldo}>
              <Ionicons
                name={
                  resumo.saldo >= 0
                    ? 'trending-up-outline'
                    : 'trending-down-outline'
                }
                size={26}
                color="#FFFFFF"
              />
            </View>
          </View>

          <Text style={estilos.descricaoSaldo}>
            Resultado de {rotuloPeriodo[periodo].toLowerCase()}
          </Text>

          <View style={estilos.divisorSaldo} />

          <View style={estilos.linhaResumoSaldo}>
            <View>
              <Text style={estilos.rotuloBranco}>
                Receitas
              </Text>

              <Text style={estilos.valorBranco}>
                {formatarMoeda(resumo.receitas)}
              </Text>
            </View>

            <View>
              <Text style={estilos.rotuloBranco}>
                Despesas
              </Text>

              <Text style={estilos.valorBranco}>
                {formatarMoeda(resumo.despesas)}
              </Text>
            </View>
          </View>
        </View>

        {/* INDICADORES */}

        <View style={estilos.gradeIndicadores}>
          <View style={estilos.cartaoIndicador}>
            <View style={estilos.linhaIndicador}>
              <Ionicons
                name="arrow-down-circle-outline"
                size={19}
                color={CORES.verde}
              />

              <Text style={estilos.rotuloIndicador}>
                Receitas
              </Text>
            </View>

            <Text
              style={[estilos.valorIndicador, { color: CORES.verde }]}
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              {formatarMoeda(resumo.receitas)}
            </Text>

            {periodo !== 'geral' && (
              <IndicadorComparacao
                atual={resumo.receitas}
                anterior={resumoAnterior.receitas}
              />
            )}
          </View>

          <View style={estilos.cartaoIndicador}>
            <View style={estilos.linhaIndicador}>
              <Ionicons
                name="arrow-up-circle-outline"
                size={19}
                color={CORES.vermelho}
              />

              <Text style={estilos.rotuloIndicador}>
                Despesas
              </Text>
            </View>

            <Text
              style={[estilos.valorIndicador, { color: CORES.vermelho }]}
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              {formatarMoeda(resumo.despesas)}
            </Text>

            {periodo !== 'geral' && (
              <IndicadorComparacao
                atual={resumo.despesas}
                anterior={resumoAnterior.despesas}
                inverso
              />
            )}
          </View>
        </View>

        <View style={estilos.cartaoInformacao}>
          <View style={estilos.itemInformacao}>
            <Ionicons
              name="receipt-outline"
              size={19}
              color={CORES.secundario}
            />

            <Text style={estilos.textoInformacao}>
              {resumo.quantidade} movimentações
            </Text>
          </View>

          <View style={estilos.itemInformacao}>
            <Ionicons
              name="wallet-outline"
              size={19}
              color={CORES.secundario}
            />

            <Text style={estilos.textoInformacao}>
              {formatarPercentual(comprometimento)} da receita comprometida
            </Text>
          </View>
        </View>

        {/* EVOLUÇÃO MENSAL */}

        <CartaoSecao
          titulo="Evolução financeira"
          descricao="Comparação das receitas e despesas nos últimos seis meses."
        >
          <View style={estilos.legenda}>
            <View style={estilos.itemLegenda}>
              <View style={[estilos.pontoLegenda, { backgroundColor: CORES.verde }]} />
              <Text style={estilos.textoLegenda}>Receitas</Text>
            </View>

            <View style={estilos.itemLegenda}>
              <View style={[estilos.pontoLegenda, { backgroundColor: CORES.vermelho }]} />
              <Text style={estilos.textoLegenda}>Despesas</Text>
            </View>
          </View>

          {evolucaoMensal.map(item => (
            <View
              key={item.chave}
              style={estilos.linhaMes}
            >
              <Text style={estilos.nomeMes}>
                {item.nome}
              </Text>

              <View style={estilos.areaBarras}>
                <View style={estilos.linhaBarraMes}>
                  <View
                    style={[
                      estilos.barraMensal,
                      {
                        width: `${(item.receitas / maiorValorMensal) * 100}%`,
                        backgroundColor: CORES.verde,
                      },
                    ]}
                  />
                </View>

                <View style={estilos.linhaBarraMes}>
                  <View
                    style={[
                      estilos.barraMensal,
                      {
                        width: `${(item.despesas / maiorValorMensal) * 100}%`,
                        backgroundColor: CORES.vermelho,
                      },
                    ]}
                  />
                </View>
              </View>

              <View style={estilos.valoresMes}>
                <Text style={estilos.valorMesReceita}>
                  {formatarMoeda(item.receitas)}
                </Text>

                <Text style={estilos.valorMesDespesa}>
                  {formatarMoeda(item.despesas)}
                </Text>
              </View>
            </View>
          ))}

          <View style={estilos.resultadoMensal}>
            <Text style={estilos.textoResultadoMensal}>
              Resultado dos últimos seis meses
            </Text>

            <Text style={estilos.valorResultadoMensal}>
              {formatarMoeda(
                evolucaoMensal.reduce(
                  (total, item) => total + item.saldo,
                  0
                )
              )}
            </Text>
          </View>
        </CartaoSecao>

        {/* CATEGORIAS */}

        <CartaoSecao
          titulo="Distribuição por categorias"
          descricao="Veja onde suas receitas e despesas estão concentradas."
        >
          <View style={estilos.filtrosCategoria}>
            {['Despesa', 'Receita'].map(tipo => {
              const selecionado = tipoCategoria === tipo;

              return (
                <TouchableOpacity
                  key={tipo}
                  style={[
                    estilos.botaoTipoCategoria,
                    selecionado && estilos.botaoTipoAtivo,
                  ]}
                  onPress={() => setTipoCategoria(tipo)}
                >
                  <Text
                    style={[
                      estilos.textoTipoCategoria,
                      selecionado && estilos.textoTipoAtivo,
                    ]}
                  >
                    {tipo === 'Despesa' ? 'Despesas' : 'Receitas'}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={estilos.totalCategoria}>
            <Text style={estilos.rotuloTotalCategoria}>
              Total de {tipoCategoria.toLowerCase()}s
            </Text>

            <Text style={estilos.valorTotalCategoria}>
              {formatarMoeda(totalCategoria)}
            </Text>
          </View>

          {valoresPorCategoria.length === 0 ? (
            <View style={estilos.estadoVazio}>
              <Ionicons
                name="pie-chart-outline"
                size={30}
                color="#AAAAAA"
              />

              <Text style={estilos.textoVazio}>
                Nenhuma movimentação encontrada neste período.
              </Text>
            </View>
          ) : (
            valoresPorCategoria.map(item => (
              <View
                key={item.id}
                style={estilos.itemCategoria}
              >
                <View style={estilos.linhaCategoria}>
                  <View style={estilos.infoCategoria}>
                    <View
                      style={[
                        estilos.iconeCategoria,
                        {
                          backgroundColor:
                            item.corFundo || CORES.cinza,
                        },
                      ]}
                    >
                      <Ionicons
                        name={item.icone || 'pricetag-outline'}
                        size={19}
                        color={item.cor || CORES.secundario}
                      />
                    </View>

                    <View style={estilos.nomeCategoriaArea}>
                      <Text style={estilos.nomeCategoria}>
                        {item.nome}
                      </Text>

                      <Text style={estilos.detalheCategoria}>
                        {item.quantidade} movimentações
                      </Text>
                    </View>
                  </View>

                  <View style={estilos.valoresCategoria}>
                    <Text style={estilos.valorCategoria}>
                      {formatarMoeda(item.total)}
                    </Text>

                    <Text style={estilos.percentualCategoria}>
                      {formatarPercentual(item.percentual)}
                    </Text>
                  </View>
                </View>

                <BarraProgresso
                  percentual={item.percentual}
                  cor={item.cor || CORES.vermelho}
                />
              </View>
            ))
          )}
        </CartaoSecao>

        {/* ORÇAMENTOS */}

        <CartaoSecao
          titulo="Acompanhamento de orçamentos"
          descricao="Seus limites e gastos do mês atual."
        >
          {analiseOrcamentos.length === 0 ? (
            <View style={estilos.estadoVazio}>
              <Ionicons
                name="wallet-outline"
                size={30}
                color="#AAAAAA"
              />

              <Text style={estilos.textoVazio}>
                Você ainda não possui orçamentos cadastrados.
              </Text>
            </View>
          ) : (
            <>
              <View style={estilos.resumoOrcamentos}>
                <View>
                  <Text style={estilos.rotuloTotalCategoria}>
                    Limites definidos
                  </Text>

                  <Text style={estilos.valorTotalCategoria}>
                    {formatarMoeda(totalLimites)}
                  </Text>
                </View>

                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={estilos.rotuloTotalCategoria}>
                    Total utilizado
                  </Text>

                  <Text style={estilos.valorTotalCategoria}>
                    {formatarMoeda(totalGastoOrcamentos)}
                  </Text>
                </View>
              </View>

              {analiseOrcamentos.map(item => {
                const ultrapassou =
                  item.gasto > item.limite;

                const percentual = Math.min(
                  item.percentual,
                  100
                );

                return (
                  <View
                    key={item.id}
                    style={estilos.itemOrcamento}
                  >
                    <View style={estilos.linhaCategoria}>
                      <View style={estilos.nomeCategoriaArea}>
                        <Text style={estilos.nomeCategoria}>
                          {item.categoria}
                        </Text>

                        <Text style={estilos.detalheCategoria}>
                          {formatarMoeda(item.gasto)} de{' '}
                          {formatarMoeda(item.limite)}
                        </Text>
                      </View>

                      <Text
                        style={[
                          estilos.percentualOrcamento,
                          {
                            color: ultrapassou
                              ? CORES.vermelho
                              : CORES.texto,
                          },
                        ]}
                      >
                        {formatarPercentual(item.percentual)}
                      </Text>
                    </View>

                    <BarraProgresso
                      percentual={percentual}
                      cor={
                        ultrapassou
                          ? CORES.vermelho
                          : item.percentual >= 80
                          ? '#D99A32'
                          : CORES.verde
                      }
                    />

                    <Text
                      style={[
                        estilos.textoRestante,
                        {
                          color: ultrapassou
                            ? CORES.vermelho
                            : CORES.secundario,
                        },
                      ]}
                    >
                      {ultrapassou
                        ? `Limite ultrapassado em ${formatarMoeda(
                            Math.abs(item.restante)
                          )}`
                        : `Ainda disponível: ${formatarMoeda(
                            item.restante
                          )}`}
                    </Text>
                  </View>
                );
              })}
            </>
          )}
        </CartaoSecao>

        {/* METAS */}

        <CartaoSecao
          titulo="Progresso das metas"
          descricao="Acompanhe o dinheiro destinado aos seus objetivos."
        >
          {analiseMetas.length === 0 ? (
            <View style={estilos.estadoVazio}>
              <Ionicons
                name="flag-outline"
                size={30}
                color="#AAAAAA"
              />

              <Text style={estilos.textoVazio}>
                Você ainda não possui metas cadastradas.
              </Text>
            </View>
          ) : (
            <>
              <View style={estilos.resumoMetas}>
                <Text style={estilos.rotuloTotalCategoria}>
                  Total acumulado nas metas
                </Text>

                <Text style={estilos.valorMetaAcumulado}>
                  {formatarMoeda(totalGuardado)}
                </Text>

                <BarraProgresso
                  percentual={percentualMetas}
                  cor={CORES.roxo}
                />

                <View style={estilos.linhaResumoMetas}>
                  <Text style={estilos.textoMetaSecundario}>
                    Objetivo: {formatarMoeda(totalObjetivos)}
                  </Text>

                  <Text style={estilos.textoMetaSecundario}>
                    {formatarPercentual(percentualMetas)}
                  </Text>
                </View>

                <Text style={estilos.textoMetaSecundario}>
                  {metasConcluidas} de {analiseMetas.length} metas concluídas
                </Text>
              </View>

              {analiseMetas.map(meta => (
                <View
                  key={meta.id}
                  style={estilos.itemMeta}
                >
                  <View style={estilos.linhaCategoria}>
                    <View style={estilos.nomeCategoriaArea}>
                      <Text style={estilos.nomeCategoria}>
                        {meta.nome}
                      </Text>

                      <Text style={estilos.detalheCategoria}>
                        {formatarMoeda(meta.guardado)} de{' '}
                        {formatarMoeda(meta.objetivo)}
                      </Text>
                    </View>

                    <Text style={estilos.percentualMeta}>
                      {formatarPercentual(meta.percentual)}
                    </Text>
                  </View>

                  <BarraProgresso
                    percentual={meta.percentual}
                    cor={CORES.roxo}
                  />

                  <Text style={estilos.textoRestante}>
                    {meta.concluida
                      ? 'Objetivo alcançado!'
                      : `Faltam ${formatarMoeda(meta.restante)}`}
                  </Text>
                </View>
              ))}
            </>
          )}
        </CartaoSecao>

        {/* DESTAQUES */}

        <CartaoSecao
          titulo="Destaques do período"
          descricao="Alguns indicadores das suas movimentações."
        >
          <View style={estilos.destaque}>
            <View style={estilos.iconeDestaque}>
              <Ionicons
                name="trending-down-outline"
                size={21}
                color={CORES.vermelho}
              />
            </View>

            <View style={estilos.infoDestaque}>
              <Text style={estilos.rotuloDestaque}>
                Maior despesa comum
              </Text>

              <Text style={estilos.nomeDestaque}>
                {maiorDespesa?.descricao || 'Nenhuma despesa'}
              </Text>
            </View>

            <Text style={estilos.valorDestaque}>
              {formatarMoeda(maiorDespesa?.valor)}
            </Text>
          </View>

          <View style={estilos.divisorDestaque} />

          <View style={estilos.destaque}>
            <View style={estilos.iconeDestaqueVerde}>
              <Ionicons
                name="trending-up-outline"
                size={21}
                color={CORES.verde}
              />
            </View>

            <View style={estilos.infoDestaque}>
              <Text style={estilos.rotuloDestaque}>
                Maior receita
              </Text>

              <Text style={estilos.nomeDestaque}>
                {maiorReceita?.descricao || 'Nenhuma receita'}
              </Text>
            </View>

            <Text style={[estilos.valorDestaque, { color: CORES.verde }]}>
              {formatarMoeda(maiorReceita?.valor)}
            </Text>
          </View>

          <View style={estilos.divisorDestaque} />

          <View style={estilos.destaque}>
            <View style={estilos.iconeDestaqueNeutra}>
              <Ionicons
                name="calendar-outline"
                size={21}
                color={CORES.secundario}
              />
            </View>

            <View style={estilos.infoDestaque}>
              <Text style={estilos.rotuloDestaque}>
                Média diária de despesas
              </Text>

              <Text style={estilos.nomeDestaque}>
                Considerando o período selecionado
              </Text>
            </View>

            <Text style={estilos.valorDestaque}>
              {formatarMoeda(mediaDiaria)}
            </Text>
          </View>
        </CartaoSecao>

        {/* RODAPÉ */}

        <View style={estilos.aviso}>
          <Ionicons
            name="information-circle-outline"
            size={20}
            color={CORES.secundario}
          />

          <Text style={estilos.textoAviso}>
            Os relatórios utilizam as movimentações armazenadas
            localmente no aplicativo. A integração com o backend
            ainda deverá ser realizada.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CORES.fundo,
  },

  conteudo: {
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 45,
  },

  cabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
    marginBottom: 25,
  },

  botaoVoltar: {
    width: 43,
    height: 43,
    borderRadius: 14,
    backgroundColor: CORES.cinza,
    alignItems: 'center',
    justifyContent: 'center',
  },

  cabecalhoTexto: {
    flex: 1,
  },

  titulo: {
    fontSize: 24,
    fontWeight: '800',
    color: CORES.texto,
  },

  subtitulo: {
    fontSize: 12,
    color: CORES.secundario,
    marginTop: 4,
  },

  rotuloPeriodo: {
    fontSize: 13,
    fontWeight: '700',
    color: CORES.texto,
    marginBottom: 11,
  },

  filtros: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 22,
  },

  filtro: {
    flex: 1,
    minWidth: '20%',
    paddingVertical: 11,
    paddingHorizontal: 5,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: CORES.borda,
    alignItems: 'center',
  },

  filtroAtivo: {
    backgroundColor: CORES.vermelho,
    borderColor: CORES.vermelho,
  },

  textoFiltro: {
    fontSize: 11,
    fontWeight: '700',
    color: CORES.secundario,
  },

  textoFiltroAtivo: {
    color: '#FFFFFF',
  },

  cartaoSaldo: {
    backgroundColor: CORES.vermelho,
    borderRadius: 20,
    padding: 21,
    marginBottom: 15,
  },

  linhaSaldo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  informacaoSaldo: {
    flex: 1,
    marginRight: 10,
  },

  rotuloSaldo: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFFCC',
    letterSpacing: 0.5,
  },

  valorSaldo: {
    fontSize: 29,
    fontWeight: '800',
    marginTop: 10,
  },

  iconeSaldo: {
    width: 45,
    height: 45,
    borderRadius: 14,
    backgroundColor: '#FFFFFF30',
    alignItems: 'center',
    justifyContent: 'center',
  },

  descricaoSaldo: {
    color: '#FFFFFFCC',
    fontSize: 12,
    marginTop: 8,
  },

  divisorSaldo: {
    height: 1,
    backgroundColor: '#FFFFFF40',
    marginVertical: 19,
  },

  linhaResumoSaldo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  rotuloBranco: {
    color: '#FFFFFFCC',
    fontSize: 11,
  },

  valorBranco: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    marginTop: 5,
  },

  gradeIndicadores: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },

  cartaoIndicador: {
    flex: 1,
    minWidth: 0,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: CORES.borda,
    borderRadius: 16,
    padding: 13,
  },

  linhaIndicador: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  rotuloIndicador: {
    fontSize: 11,
    color: CORES.secundario,
    fontWeight: '600',
  },

  valorIndicador: {
    fontSize: 16,
    fontWeight: '800',
    marginTop: 12,
  },

  comparacao: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 3,
    marginTop: 8,
  },

  textoComparacao: {
    fontSize: 9,
    color: CORES.secundario,
    lineHeight: 14,
  },

  cartaoInformacao: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 12,
    padding: 14,
    backgroundColor: CORES.cinza,
    borderRadius: 13,
    marginBottom: 28,
  },

  itemInformacao: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    flexShrink: 1,
  },

  textoInformacao: {
    fontSize: 11,
    color: CORES.secundario,
    flexShrink: 1,
  },

  secao: {
    marginBottom: 28,
  },

  cabecalhoSecao: {
    marginBottom: 14,
  },

  tituloSecao: {
    fontSize: 18,
    fontWeight: '800',
    color: CORES.texto,
  },

  descricaoSecao: {
    fontSize: 12,
    color: CORES.secundario,
    lineHeight: 18,
    marginTop: 5,
  },

  cartao: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: CORES.borda,
    borderRadius: 18,
    padding: 16,
  },

  legenda: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 22,
  },

  itemLegenda: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },

  pontoLegenda: {
    width: 9,
    height: 9,
    borderRadius: 5,
  },

  textoLegenda: {
    fontSize: 11,
    color: CORES.secundario,
  },

  linhaMes: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    marginBottom: 19,
  },

  nomeMes: {
    width: 32,
    fontSize: 11,
    fontWeight: '700',
    color: CORES.texto,
    textTransform: 'capitalize',
  },

  areaBarras: {
    flex: 1,
    gap: 6,
  },

  linhaBarraMes: {
    height: 8,
    backgroundColor: CORES.cinza,
    borderRadius: 10,
    overflow: 'hidden',
  },

  barraMensal: {
    height: '100%',
    borderRadius: 10,
  },

  valoresMes: {
    width: 85,
    alignItems: 'flex-end',
  },

  valorMesReceita: {
    fontSize: 9,
    color: CORES.verde,
    fontWeight: '700',
  },

  valorMesDespesa: {
    fontSize: 9,
    color: CORES.vermelho,
    fontWeight: '700',
    marginTop: 3,
  },

  resultadoMensal: {
    borderTopWidth: 1,
    borderTopColor: CORES.borda,
    paddingTop: 15,
    marginTop: 3,
  },

  textoResultadoMensal: {
    fontSize: 11,
    color: CORES.secundario,
  },

  valorResultadoMensal: {
    fontSize: 19,
    fontWeight: '800',
    color: CORES.texto,
    marginTop: 5,
  },

  filtrosCategoria: {
    flexDirection: 'row',
    backgroundColor: CORES.cinza,
    padding: 4,
    borderRadius: 12,
    marginBottom: 19,
  },

  botaoTipoCategoria: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 9,
  },

  botaoTipoAtivo: {
    backgroundColor: CORES.vermelho,
  },

  textoTipoCategoria: {
    color: CORES.secundario,
    fontSize: 12,
    fontWeight: '700',
  },

  textoTipoAtivo: {
    color: '#FFFFFF',
  },

  totalCategoria: {
    marginBottom: 19,
  },

  rotuloTotalCategoria: {
    fontSize: 11,
    color: CORES.secundario,
  },

  valorTotalCategoria: {
    fontSize: 19,
    fontWeight: '800',
    color: CORES.texto,
    marginTop: 5,
  },

  itemCategoria: {
    marginBottom: 19,
  },

  linhaCategoria: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 11,
  },

  infoCategoria: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 10,
  },

  iconeCategoria: {
    width: 39,
    height: 39,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  nomeCategoriaArea: {
    flex: 1,
  },

  nomeCategoria: {
    fontSize: 12,
    fontWeight: '800',
    color: CORES.texto,
  },

  detalheCategoria: {
    fontSize: 10,
    color: CORES.secundario,
    marginTop: 4,
  },

  valoresCategoria: {
    alignItems: 'flex-end',
  },

  valorCategoria: {
    fontSize: 12,
    fontWeight: '800',
    color: CORES.texto,
  },

  percentualCategoria: {
    fontSize: 10,
    color: CORES.secundario,
    marginTop: 4,
  },

  fundoBarra: {
    height: 8,
    backgroundColor: '#EEEEEE',
    borderRadius: 10,
    overflow: 'hidden',
  },

  preenchimentoBarra: {
    height: '100%',
    borderRadius: 10,
  },

  estadoVazio: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 25,
  },

  textoVazio: {
    color: CORES.secundario,
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 19,
    marginTop: 10,
  },

  resumoOrcamentos: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 22,
  },

  itemOrcamento: {
    marginBottom: 23,
  },

  percentualOrcamento: {
    fontSize: 12,
    fontWeight: '800',
  },

  textoRestante: {
    fontSize: 10,
    marginTop: 8,
    color: CORES.secundario,
  },

  resumoMetas: {
    backgroundColor: CORES.roxoClaro,
    padding: 15,
    borderRadius: 13,
    marginBottom: 22,
  },

  valorMetaAcumulado: {
    fontSize: 23,
    fontWeight: '800',
    color: CORES.roxo,
    marginVertical: 10,
  },

  linhaResumoMetas: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 9,
    marginBottom: 7,
  },

  textoMetaSecundario: {
    fontSize: 10,
    color: CORES.secundario,
  },

  itemMeta: {
    marginBottom: 22,
  },

  percentualMeta: {
    fontSize: 12,
    fontWeight: '800',
    color: CORES.roxo,
  },

  destaque: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  iconeDestaque: {
    width: 39,
    height: 39,
    borderRadius: 12,
    backgroundColor: CORES.vermelhoClaro,
    alignItems: 'center',
    justifyContent: 'center',
  },

  iconeDestaqueVerde: {
    width: 39,
    height: 39,
    borderRadius: 12,
    backgroundColor: CORES.verdeClaro,
    alignItems: 'center',
    justifyContent: 'center',
  },

  iconeDestaqueNeutra: {
    width: 39,
    height: 39,
    borderRadius: 12,
    backgroundColor: CORES.cinza,
    alignItems: 'center',
    justifyContent: 'center',
  },

  infoDestaque: {
    flex: 1,
  },

  rotuloDestaque: {
    fontSize: 10,
    color: CORES.secundario,
  },

  nomeDestaque: {
    fontSize: 11,
    color: CORES.texto,
    fontWeight: '700',
    marginTop: 4,
  },

  valorDestaque: {
    fontSize: 11,
    fontWeight: '800',
    color: CORES.vermelho,
  },

  divisorDestaque: {
    height: 1,
    backgroundColor: CORES.borda,
    marginVertical: 16,
  },

  aviso: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 9,
    padding: 14,
    backgroundColor: CORES.cinza,
    borderRadius: 13,
  },

  textoAviso: {
    flex: 1,
    color: CORES.secundario,
    fontSize: 10,
    lineHeight: 17,
  },
});
