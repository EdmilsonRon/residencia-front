import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { request } from '../services/api';
import { useCategorias } from './CategoriasContext';

const TransacoesContext = createContext(null);

function normalizarTipoParaFront(tipoApi) {
  if (!tipoApi) return 'Despesa';
  const upper = String(tipoApi).toUpperCase();
  if (upper === 'RECEITA') return 'Receita';
  if (upper === 'DESPESA') return 'Despesa';
  return tipoApi;
}

function normalizarTipoParaApi(tipoFront) {
  if (!tipoFront) return 'DESPESA';
  const upper = String(tipoFront).toUpperCase();
  if (upper === 'RECEITA') return 'RECEITA';
  if (upper === 'DESPESA') return 'DESPESA';
  return upper;
}

function obterEstiloPorCategoria(nomeCategoria, tipoFront) {
  const nome = (nomeCategoria || '').toLowerCase();

  if (nome.includes('salário') || nome.includes('salario')) {
    return { icone: 'wallet-outline', corFundo: '#E4F5E9', corIcone: '#238B45' };
  }
  if (nome.includes('alimenta') || nome.includes('mercado')) {
    return { icone: 'cart-outline', corFundo: '#FCE8E6', corIcone: '#D92344' };
  }
  if (nome.includes('saúde') || nome.includes('saude') || nome.includes('academia')) {
    return { icone: 'fitness-outline', corFundo: '#F0E9FF', corIcone: '#7950C7' };
  }
  if (nome.includes('trabalho') || nome.includes('freelance')) {
    return { icone: 'laptop-outline', corFundo: '#E7F0FF', corIcone: '#3574C8' };
  }
  if (nome.includes('moradia') || nome.includes('internet')) {
    return { icone: 'wifi-outline', corFundo: '#FFF0DD', corIcone: '#C47A16' };
  }
  if (nome.includes('energia') || nome.includes('luz') || nome.includes('contas')) {
    return { icone: 'flash-outline', corFundo: '#FFF4CC', corIcone: '#B58A00' };
  }
  if (nome.includes('venda')) {
    return { icone: 'cash-outline', corFundo: '#E4F5E9', corIcone: '#238B45' };
  }
  if (nome.includes('transporte')) {
    return { icone: 'car-outline', corFundo: '#E7F0FF', corIcone: '#3574C8' };
  }
  if (nome.includes('lazer')) {
    return { icone: 'game-controller-outline', corFundo: '#F0E9FF', corIcone: '#7950C7' };
  }

  if (tipoFront === 'Receita') {
    return { icone: 'trending-up-outline', corFundo: '#E4F5E9', corIcone: '#238B45' };
  }

  return { icone: 'receipt-outline', corFundo: '#FCE8E6', corIcone: '#D92344' };
}

function formatarTransacaoDaApi(item) {
  const tipoFront = normalizarTipoParaFront(item.tipo);
  const categoriaNome =
    typeof item.categoria === 'string'
      ? item.categoria
      : item.categoria?.nome || 'Outros';
  const estilo = obterEstiloPorCategoria(categoriaNome, tipoFront);

  return {
    id: String(item.idTransacao ?? item.id),
    descricao: item.descricao,
    categoria: categoriaNome,
    data: item.data,
    valor: Number(item.valor),
    tipo: tipoFront,
    icone: estilo.icone,
    corFundo: estilo.corFundo,
    corIcone: estilo.corIcone,
  };
}

export function TransacoesProvider({ children }) {
  const { categorias } = useCategorias();
  const [transacoes, setTransacoes] = useState([]);
  const [carregando, setCarregando] = useState(false);

  const carregarTransacoes = useCallback(async (dataInicio, dataFim) => {
    setCarregando(true);
    try {
      const params = new URLSearchParams();
      if (dataInicio) params.append('dataInicio', dataInicio);
      if (dataFim) params.append('dataFim', dataFim);

      const query = params.toString();
      const endpoint = query ? `/transacoes?${query}` : '/transacoes';

      const dados = await request(endpoint);
      const lista = Array.isArray(dados) ? dados : [];
      setTransacoes(lista.map(formatarTransacaoDaApi));
    } catch (error) {
      console.error('Erro ao carregar transações:', error);
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregarTransacoes();
  }, [carregarTransacoes]);

  async function adicionarTransacao(novaTransacao) {
    const categoriaEncontrada = categorias.find(
      (cat) =>
        cat.nome?.toLowerCase() === (novaTransacao.categoria || '').trim().toLowerCase()
    );

    const payload = {
      descricao: novaTransacao.descricao?.trim(),
      valor: Number(novaTransacao.valor),
      data: novaTransacao.data,
      tipo: normalizarTipoParaApi(novaTransacao.tipo),
      categoriaId: categoriaEncontrada ? Number(categoriaEncontrada.id) : null,
    };

    const criada = await request('/transacoes', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    const formatada = formatarTransacaoDaApi({
      ...criada,
      categoria: criada?.categoria || novaTransacao.categoria || 'Outros',
      data: criada?.data || novaTransacao.data,
      tipo: criada?.tipo || payload.tipo,
      valor: criada?.valor ?? payload.valor,
      descricao: criada?.descricao || payload.descricao,
    });

    setTransacoes((atuais) => [formatada, ...atuais]);
    return formatada;
  }

  async function excluirTransacao(id) {
    await request(`/transacoes/${id}`, {
      method: 'DELETE',
    });
    setTransacoes((atuais) => atuais.filter((t) => String(t.id) !== String(id)));
  }

  function atualizarCategoriaTransacoes(
    categoriaAntiga,
    categoriaNova,
    tipo
  ) {
    setTransacoes((transacoesAtuais) =>
      transacoesAtuais.map((transacao) => {
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
  }

  return (
    <TransacoesContext.Provider
      value={{
        transacoes,
        carregando,
        carregarTransacoes,
        adicionarTransacao,
        excluirTransacao,
        atualizarCategoriaTransacoes,
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