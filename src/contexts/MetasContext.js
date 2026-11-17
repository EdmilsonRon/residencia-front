
import React, {
  createContext,
  useContext,
  useState,
} from 'react';

const MetasContext = createContext(null);

export function MetasProvider({ children }) {
  const [metas, setMetas] = useState([]);

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
      (meta) => meta.id !== id
    );

    setMetas(novasMetas);

    await AsyncStorage.setItem(
      '@metas',
      JSON.stringify(novasMetas)
    );

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
