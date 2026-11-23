import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { request } from '../services/api';
import { useCategorias } from './CategoriasContext';

const OrcamentosContext = createContext(null);

function obterMesAnoAtual() {
  const agora = new Date();
  const ano = agora.getFullYear();
  const mes = String(agora.getMonth() + 1).padStart(2, '0');
  return `${ano}-${mes}`;
}

function formatarOrcamentoDaApi(item, mesAnoFallback) {
  const nomeCategoria = item.nomeCategoria || item.categoria?.nome || 'Outros';
  const valorLimite = Number(item.valorLimite ?? 0);
  const valorGasto = Number(item.valorGasto ?? 0);
  const valorRestante =
    item.valorRestante !== undefined && item.valorRestante !== null
      ? Number(item.valorRestante)
      : valorLimite - valorGasto;

  return {
    id: String(item.id),
    mesAno: item.mesAno || mesAnoFallback,
    categoria: nomeCategoria,
    nomeCategoria,
    categoriaId: item.categoriaId ?? item.categoria?.id ?? null,
    valorLimite,
    valorGasto,
    valorRestante,
    percentualUtilizado: Number(item.percentualUtilizado ?? 0),
    statusConsumo: item.statusConsumo || 'NORMAL',
  };
}

export function OrcamentosProvider({ children }) {
  const { categorias } = useCategorias();
  const [mesAnoAtual, setMesAnoAtual] = useState(obterMesAnoAtual);
  const [orcamentos, setOrcamentos] = useState([]);
  const [carregando, setCarregando] = useState(false);

  const carregarOrcamentos = useCallback(
    async (mesAno = mesAnoAtual) => {
      const alvo = mesAno || obterMesAnoAtual();
      setCarregando(true);
      try {
        const dados = await request(`/orcamentos/${encodeURIComponent(alvo)}`);
        const lista = Array.isArray(dados) ? dados : [];
        setOrcamentos(lista.map((item) => formatarOrcamentoDaApi(item, alvo)));
      } catch (error) {
        console.error('Erro ao carregar orçamentos:', error);
      } finally {
        setCarregando(false);
      }
    },
    [mesAnoAtual]
  );

  useEffect(() => {
    carregarOrcamentos(mesAnoAtual);
  }, [carregarOrcamentos, mesAnoAtual]);

  async function adicionarOrcamento(novoOrcamento) {
    const mesAno = novoOrcamento.mesAno || mesAnoAtual;
    const nomeCat = (
      novoOrcamento.categoria ||
      novoOrcamento.nomeCategoria ||
      ''
    )
      .trim()
      .toLowerCase();

    const categoriaEncontrada = categorias.find(
      (cat) =>
        String(cat.id) === String(novoOrcamento.categoriaId) ||
        cat.nome?.trim().toLowerCase() === nomeCat
    );

    const categoriaId = categoriaEncontrada
      ? Number(categoriaEncontrada.id)
      : novoOrcamento.categoriaId
        ? Number(novoOrcamento.categoriaId)
        : null;

    const payload = {
      mesAno,
      valorLimite: Number(novoOrcamento.valorLimite ?? novoOrcamento.valor ?? 0),
      categoria: categoriaId ? { id: categoriaId } : null,
    };

    await request('/orcamentos', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    await carregarOrcamentos(mesAno);
  }

  function editarOrcamento(id, dadosAtualizados) {
    setOrcamentos((anteriores) =>
      anteriores.map((item) =>
        String(item.id) === String(id) ? { ...item, ...dadosAtualizados } : item
      )
    );
  }

  function excluirOrcamento(id) {
    setOrcamentos((anteriores) =>
      anteriores.filter((item) => String(item.id) !== String(id))
    );
  }

  return (
    <OrcamentosContext.Provider
      value={{
        orcamentos,
        mesAnoAtual,
        setMesAnoAtual,
        carregando,
        carregarOrcamentos,
        adicionarOrcamento,
        editarOrcamento,
        excluirOrcamento,
      }}
    >
      {children}
    </OrcamentosContext.Provider>
  );
}

export function useOrcamentos() {
  const contexto = useContext(OrcamentosContext);

  if (!contexto) {
    throw new Error(
      'useOrcamentos precisa ser utilizado dentro de OrcamentosProvider.'
    );
  }

  return contexto;
}