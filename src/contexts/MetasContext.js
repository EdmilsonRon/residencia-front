import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';

const MetasContext = createContext(null);

const CHAVE_METAS = '@metas';

export function MetasProvider({ children }) {
  const [metas, setMetas] = useState([]);
  const [carregado, setCarregado] = useState(false);

  useEffect(() => {
    async function carregarMetas() {
      try {
        const dadosSalvos = await AsyncStorage.getItem(
          CHAVE_METAS
        );

        if (dadosSalvos !== null) {
          const dados = JSON.parse(dadosSalvos);

          setMetas(
            Array.isArray(dados) ? dados : []
          );
        }
      } catch (error) {
        console.error('Erro ao carregar metas:', error);
        setMetas([]);
      } finally {
        setCarregado(true);
      }
    }

    carregarMetas();
  }, []);

  useEffect(() => {
    async function salvarMetas() {
      try {
        await AsyncStorage.setItem(
          CHAVE_METAS,
          JSON.stringify(metas)
        );
      } catch (error) {
        console.error('Erro ao salvar metas:', error);
      }
    }

    if (carregado) {
      salvarMetas();
    }
  }, [metas, carregado]);

  function adicionarMeta(novaMeta) {
    const metaCriada = {
      ...novaMeta,
      id: `${Date.now()}-${Math.random()}`,
    };

    setMetas((atuais) => [
      ...atuais,
      metaCriada,
    ]);

    return metaCriada;
  }

  function editarMeta(id, dadosAtualizados) {
    setMetas((atuais) =>
      atuais.map((meta) =>
        meta.id === id
          ? { ...meta, ...dadosAtualizados }
          : meta
      )
    );
  }

  function excluirMeta(id) {
    setMetas((atuais) =>
      atuais.filter((meta) => meta.id !== id)
    );

    return {
      sucesso: true,
    };
  }

  return (
    <MetasContext.Provider
      value={{
        metas,
        carregado,
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