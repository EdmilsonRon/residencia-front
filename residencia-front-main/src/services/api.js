const BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080/v1';

export async function request(endpoint, options = {}) {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    const erroTexto = await response.text();
    throw new Error(erroTexto || `Erro HTTP ${response.status}`);
  }

  if (response.status === 204) return null;
  return response.json();
}

export const financeiroApi = {
  // Categorias
  listarCategorias: () => request('/categorias'),
  criarCategoria: (dados) =>
    request('/categorias', { method: 'POST', body: JSON.stringify(dados) }),
  excluirCategoria: (id) =>
    request(`/categorias/${id}`, { method: 'DELETE' }),

  // Transações
  listarTransacoes: () => request('/transacoes'),
  criarTransacao: (dados) =>
    request('/transacoes', { method: 'POST', body: JSON.stringify(dados) }),
  excluirTransacao: (id) =>
    request(`/transacoes/${id}`, { method: 'DELETE' }),

  // Orçamentos
  listarOrcamentos: (mesAno) =>
    request(mesAno ? `/orcamentos?mesAno=${mesAno}` : '/orcamentos'),
  criarOrcamento: (dados) =>
    request('/orcamentos', { method: 'POST', body: JSON.stringify(dados) }),

  // Metas Financeiras
  listarMetas: () => request('/metas'),
  criarMeta: (dados) =>
    request('/metas', { method: 'POST', body: JSON.stringify(dados) }),
  depositarMeta: (id, valor) =>
    request(`/metas/${id}/depositar`, {
      method: 'PATCH',
      body: JSON.stringify({ valor }),
    }),

  // Módulos Analíticos
  getRelatorio: (inicio, fim) =>
    request(`/relatorios?inicio=${inicio}&fim=${fim}`),
  getAlertas: () => request('/alertas-insights'),
  getRecomendacoes: () => request('/recomendacoes-financeiras'),
  getSaudeFinanceira: () => request('/saude-financeira'),
  recalcularSaudeFinanceira: () =>
    request('/saude-financeira/recalcular', { method: 'PUT' }),
};