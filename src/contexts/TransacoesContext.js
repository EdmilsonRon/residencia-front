import React, {
  createContext,
  useContext,
  useState,
} from 'react';

const TransacoesContext = createContext(null);

const transacoesIniciais = [
  {
    id: '1',
    descricao: 'Salário',
    categoria: 'Salário',
    data: '2026-10-30',
    valor: 3500,
    tipo: 'Receita',
    icone: 'wallet-outline',
    corFundo: '#E4F5E9',
    corIcone: '#238B45',
  },
  {
    id: '2',
    descricao: 'Supermercado',
    categoria: 'Alimentação',
    data: '2026-10-29',
    valor: 245.80,
    tipo: 'Despesa',
    icone: 'cart-outline',
    corFundo: '#FCE8E6',
    corIcone: '#D92344',
  },
  {
    id: '3',
    descricao: 'Academia',
    categoria: 'Saúde',
    data: '2026-10-29',
    valor: 89.90,
    tipo: 'Despesa',
    icone: 'fitness-outline',
    corFundo: '#F0E9FF',
    corIcone: '#7950C7',
  },
  {
    id: '4',
    descricao: 'Freelance',
    categoria: 'Trabalho',
    data: '2026-10-28',
    valor: 450,
    tipo: 'Receita',
    icone: 'laptop-outline',
    corFundo: '#E7F0FF',
    corIcone: '#3574C8',
  },
  {
    id: '5',
    descricao: 'Conta de internet',
    categoria: 'Moradia',
    data: '2026-10-27',
    valor: 99.90,
    tipo: 'Despesa',
    icone: 'wifi-outline',
    corFundo: '#FFF0DD',
    corIcone: '#C47A16',
  },
  {
    id: '6',
    descricao: 'Conta de energia',
    categoria: 'Moradia',
    data: '2026-10-26',
    valor: 135.40,
    tipo: 'Despesa',
    icone: 'flash-outline',
    corFundo: '#FFF4CC',
    corIcone: '#B58A00',
  },
  {
    id: '7',
    descricao: 'Venda de produto',
    categoria: 'Vendas',
    data: '2026-10-25',
    valor: 180,
    tipo: 'Receita',
    icone: 'cash-outline',
    corFundo: '#E4F5E9',
    corIcone: '#238B45',
  },
];

export function TransacoesProvider({ children }) {
  const [transacoes, setTransacoes] = useState(
    transacoesIniciais
  );

  function adicionarTransacao(novaTransacao) {
    const transacaoCriada = {
      ...novaTransacao,
      id: `${Date.now()}-${Math.random()}`,
      criadoEm: new Date().toISOString(),
    };

    setTransacoes((atuais) => [
      transacaoCriada,
      ...atuais,
    ]);
  }

  // excluído para "Outros".
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
        adicionarTransacao,
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