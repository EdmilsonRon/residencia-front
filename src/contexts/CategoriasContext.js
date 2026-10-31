import React, { createContext, useContext, useState } from 'react';

const CategoriasContext = createContext(null);

// Categorias que já estarão disponíveis inicialmente.
const categoriasIniciais = [
  {
    id: '1',
    nome: 'Alimentação',
    tipo: 'Despesa',
    icone: 'cart-outline',
    cor: '#D92344',
    corFundo: '#FCE8E6',
  },
  {
    id: '2',
    nome: 'Moradia',
    tipo: 'Despesa',
    icone: 'home-outline',
    cor: '#C47A16',
    corFundo: '#FFF0DD',
  },
  {
    id: '3',
    nome: 'Transporte',
    tipo: 'Despesa',
    icone: 'car-outline',
    cor: '#3574C8',
    corFundo: '#E7F0FF',
  },
  {
    id: '4',
    nome: 'Saúde',
    tipo: 'Despesa',
    icone: 'fitness-outline',
    cor: '#7950C7',
    corFundo: '#F0E9FF',
  },
  {
    id: '5',
    nome: 'Lazer',
    tipo: 'Despesa',
    icone: 'game-controller-outline',
    cor: '#C47A16',
    corFundo: '#FFF0DD',
  },
  {
    id: '6',
    nome: 'Educação',
    tipo: 'Despesa',
    icone: 'book-outline',
    cor: '#3574C8',
    corFundo: '#E7F0FF',
  },
  {
    id: '7',
    nome: 'Salário',
    tipo: 'Receita',
    icone: 'wallet-outline',
    cor: '#238B45',
    corFundo: '#E4F5E9',
  },
  {
    id: '8',
    nome: 'Trabalho',
    tipo: 'Receita',
    icone: 'laptop-outline',
    cor: '#238B45',
    corFundo: '#E4F5E9',
  },
  {
    id: '9',
    nome: 'Vendas',
    tipo: 'Receita',
    icone: 'cash-outline',
    cor: '#238B45',
    corFundo: '#E4F5E9',
  },
  {
    id: '10',
    nome: 'Outros',
    tipo: 'Despesa',
    icone: 'ellipsis-horizontal-circle-outline',
    cor: '#777777',
    corFundo: '#F0F0F0',
  },
];

export function CategoriasProvider({ children }) {
  const [categorias, setCategorias] = useState(categoriasIniciais);

  function adicionarCategoria(novaCategoria) {
    const nomeNormalizado = novaCategoria.nome.trim().toLowerCase();

    if (!nomeNormalizado) {
      return {
        sucesso: false,
        mensagem: 'Informe o nome da categoria.',
      };
    }

    const jaExiste = categorias.some(
      (categoria) =>
        categoria.nome.trim().toLowerCase() === nomeNormalizado &&
        categoria.tipo === novaCategoria.tipo
    );

    if (jaExiste) {
      return {
        sucesso: false,
        mensagem: 'Já existe uma categoria com esse nome para esse tipo.',
      };
    }

    const categoriaCriada = {
      ...novaCategoria,
      id: `${Date.now()}-${Math.random()}`,
      nome: novaCategoria.nome.trim(),
    };

    setCategorias((atuais) => [...atuais, categoriaCriada]);

    return {
      sucesso: true,
      mensagem: 'Categoria criada com sucesso!',
      categoria: categoriaCriada,
    };
  }

  function obterCategoriasPorTipo(tipo) {
    return categorias.filter((categoria) => categoria.tipo === tipo);
  }

  return (
    <CategoriasContext.Provider
      value={{
        categorias,
        adicionarCategoria,
        obterCategoriasPorTipo,
      }}
    >
      {children}
    </CategoriasContext.Provider>
  );
}

export function useCategorias() {
  const contexto = useContext(CategoriasContext);

  if (!contexto) {
    throw new Error(
      'useCategorias precisa ser utilizado dentro de CategoriasProvider.'
    );
  }

  return contexto;
}