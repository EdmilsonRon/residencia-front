
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';

const OrcamentosContext = createContext(null);

const CHAVE_ORCAMENTOS = '@orcamentos';

export function OrcamentosProvider({ children }) {
  const [orcamentos, setOrcamentos] = useState([]);
  const [carregado, setCarregado] = useState(false);

  // Recupera os orçamentos salvos.
  useEffect(() => {
    async function carregarOrcamentos() {
      try {
        const dadosSalvos = await AsyncStorage.getItem(
          CHAVE_ORCAMENTOS
        );

        if (dadosSalvos !== null) {
          setOrcamentos(JSON.parse(dadosSalvos));
        }
      } catch (error) {
        console.error('Erro ao carregar orçamentos:', error);
      } finally {
        setCarregado(true);
      }
    }

    carregarOrcamentos();
  }, []);

  // Salva automaticamente as alterações.
  useEffect(() => {
    async function salvarOrcamentos() {
      try {
        await AsyncStorage.setItem(
          CHAVE_ORCAMENTOS,
          JSON.stringify(orcamentos)
        );
      } catch (error) {
        console.error('Erro ao salvar orçamentos:', error);
      }
    }

    if (carregado) {
      salvarOrcamentos();
    }
  }, [orcamentos, carregado]);

  function adicionarOrcamento(novoOrcamento) {
    const orcamento = {
      id: Date.now().toString(),
      ...novoOrcamento,
    };

    setOrcamentos((anteriores) => [...anteriores, orcamento]);

    return orcamento;
  }

  function editarOrcamento(id, dadosAtualizados) {
    setOrcamentos((anteriores) =>
      anteriores.map((item) =>
        item.id === id ? { ...item, ...dadosAtualizados } : item
      )
    );
  }

  function excluirOrcamento(id) {
    setOrcamentos((anteriores) =>
      anteriores.filter((item) => item.id !== id)
    );
  }

  return (
    <OrcamentosContext.Provider
      value={{
        orcamentos,
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
