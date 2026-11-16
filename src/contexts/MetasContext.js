
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';

const MetasContext = createContext(null);

export function MetasProvider({ children }) {
  const [metas, setMetas] = useState([]);
  const [carregadas, setCarregadas] = useState(false);

  useEffect(() => {
    async function carregarMetas() {
      try {
        const dados = await AsyncStorage.getItem('@metas');

        if (dados) {
          setMetas(JSON.parse(dados));
        }
      } catch (error) {
        console.error('Erro ao carregar metas:', error);
      } finally {
        setCarregadas(true);
      }
    }

    carregarMetas();
  }, []);

  useEffect(() => {
    if (!carregadas) return;

    async function salvarMetas() {
      try {
        await AsyncStorage.setItem(
          '@metas',
          JSON.stringify(metas)
        );
      } catch (error) {
        console.error('Erro ao salvar metas:', error);
      }
    }

    salvarMetas();
  }, [metas, carregadas]);

  function adicionarMeta(novaMeta) {
    const metaCriada = {
      ...novaMeta,
      id: `${Date.now()}-${Math.random()}`,
    };

    setMetas(atuais => [
      ...atuais,
      metaCriada,
    ]);

    return metaCriada;
  }

  function editarMeta(id, dadosAtualizados) {
    setMetas(atuais =>
      atuais.map(meta =>
        meta.id === id
          ? { ...meta, ...dadosAtualizados }
          : meta
      )
    );
  }

  async function excluirMeta(id) {
    try {
      const novasMetas = metas.filter(
        meta => meta.id !== id
      );

      await AsyncStorage.setItem(
        '@metas',
        JSON.stringify(novasMetas)
      );

      setMetas(novasMetas);

      return {
        sucesso: true,
      };
    } catch (error) {
      console.error('Erro ao excluir meta:', error);

      return {
        sucesso: false,
      };
    }
  }

  return (
    <MetasContext.Provider
      value={{
        metas,
        adicionarMeta,
        editarMeta,
        excluirMeta,
      }}
    >
      {children}
    </MetasContext.Provider>
  );
}

export function useMetas() {
  const contexto = useContext(MetasContext);

  if (!contexto) {
    throw new Error(
      'useMetas precisa ser utilizado dentro de MetasProvider.'
    );
  }

  return contexto;
}
