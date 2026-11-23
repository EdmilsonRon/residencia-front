import React, { createContext, useContext, useState, useEffect } from 'react';
import { financeiroApi } from '../services/api';

const CategoriasContext = createContext(null);

function normalizarTipoParaFront(tipo) {
  if (!tipo) return 'Despesa';
  return String(tipo).toUpperCase() === 'RECEITA' ? 'Receita' : 'Despesa';
}

function normalizarTipoParaBack(tipo) {
  return String(tipo).toUpperCase() === 'RECEITA' ? 'RECEITA' : 'DESPESA';
}

function adaptarCategoriaDoBack(cat, extrasVisuais = {}) {
  const tipoFront = normalizarTipoParaFront(cat.tipo);
  return {
    id: String(cat.id),
    nome: cat.nome,
    tipo: tipoFront,
    icone:
      extrasVisuais.icone ||
      cat.icone ||
      (tipoFront === 'Receita' ? 'wallet-outline' : 'pricetag-outline'),
    cor:
      extrasVisuais.cor ||
      cat.cor ||
      (tipoFront === 'Receita' ? '#238B45' : '#D92344'),
    corFundo:
      extrasVisuais.corFundo ||
      cat.corFundo ||
      (tipoFront === 'Receita' ? '#E4F5E9' : '#FCE8E6'),
  };
}

export function CategoriasProvider({ children }) {
  const [categorias, setCategorias] = useState([]);
  const [carregando, setCarregando] = useState(true);

  function ordenarCategorias(lista) {
    return [...lista].sort((a, b) => {
      const aOutros = a.nome.trim().toLowerCase() === 'outros';
      const bOutros = b.nome.trim().toLowerCase() === 'outros';
      if (aOutros && !bOutros) return 1;
      if (!aOutros && bOutros) return -1;
      return 0;
    });
  }

  async function carregarCategorias() {
    try {
      setCarregando(true);
      const dados = await financeiroApi.listarCategorias();
      const adaptadas = (dados || []).map((c) => adaptarCategoriaDoBack(c));
      setCategorias(ordenarCategorias(adaptadas));
    } catch (erro) {
      console.error('Erro ao carregar categorias:', erro.message);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarCategorias();
  }, []);

  async function adicionarCategoria(novaCategoria) {
    const nomeLimpo = novaCategoria.nome.trim();
    const nomeNormalizado = nomeLimpo.toLowerCase();

    if (!nomeNormalizado) {
      return { sucesso: false, mensagem: 'Informe o nome da categoria.' };
    }

    const jaExiste = categorias.some(
      (c) =>
        c.nome.trim().toLowerCase() === nomeNormalizado &&
        c.tipo === novaCategoria.tipo
    );

    if (jaExiste) {
      return {
        sucesso: false,
        mensagem: 'Já existe uma categoria com esse nome para esse tipo.',
      };
    }

    try {
      const payload = {
        nome: nomeLimpo,
        tipo: normalizarTipoParaBack(novaCategoria.tipo),
      };

      const criadaNoBack = await financeiroApi.criarCategoria(payload);
      const categoriaCriada = adaptarCategoriaDoBack(criadaNoBack, {
        icone: novaCategoria.icone,
        cor: novaCategoria.cor,
        corFundo: novaCategoria.corFundo,
      });

      setCategorias((atuais) =>
        ordenarCategorias([...atuais, categoriaCriada])
      );

      return {
        sucesso: true,
        mensagem: 'Categoria criada com sucesso!',
        categoria: categoriaCriada,
      };
    } catch (erro) {
      return {
        sucesso: false,
        mensagem: erro.message || 'Erro ao salvar categoria no servidor.',
      };
    }
  }

  async function removerCategoria(id) {
    const categoriaEncontrada = categorias.find((c) => c.id === String(id));

    if (!categoriaEncontrada) {
      return { sucesso: false, mensagem: 'Categoria não encontrada.' };
    }

    if (categoriaEncontrada.nome.trim().toLowerCase() === 'outros') {
      return {
        sucesso: false,
        mensagem: 'A categoria Outros não pode ser excluída.',
      };
    }

    try {
      await financeiroApi.excluirCategoria(id);
      setCategorias((atuais) =>
        ordenarCategorias(atuais.filter((c) => c.id !== String(id)))
      );
      return { sucesso: true, mensagem: 'Categoria removida com sucesso!' };
    } catch (erro) {
      return {
        sucesso: false,
        mensagem: erro.message || 'Erro ao excluir categoria no servidor.',
      };
    }
  }

  function obterCategoriasPorTipo(tipo) {
    return ordenarCategorias(categorias.filter((c) => c.tipo === tipo));
  }

  return (
    <CategoriasContext.Provider
      value={{
        categorias: ordenarCategorias(categorias),
        carregando,
        carregarCategorias,
        adicionarCategoria,
        removerCategoria,
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