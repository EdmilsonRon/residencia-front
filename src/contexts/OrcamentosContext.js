
import React, { createContext, useContext, useState } from 'react';

const OrcamentosContext = createContext();

export function OrcamentosProvider({ children }) {
  const [orcamentos, setOrcamentos] = useState([]);

  function adicionarOrcamento(novoOrcamento) {
    const orcamento = {
      id: Date.now().toString(),
      ...novoOrcamento,
    };

    setOrcamentos((anteriores) => [...anteriores, orcamento]);
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
  return useContext(OrcamentosContext);
}
