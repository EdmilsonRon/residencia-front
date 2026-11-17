const arredondar = (valor) => Math.round((Number(valor) || 0) * 100) / 100;

export function obterResumoFinanceiro(transacoes = [], orcamentos = [], categorias = [], agora = new Date()) {
  const mes = agora.getMonth();
  const ano = agora.getFullYear();
  const doMes = transacoes.filter((item) => {
    if (!item.data) return false;
    const [anoItem, mesItem] = item.data.split('-').map(Number);
    return anoItem === ano && mesItem === mes + 1;
  });

  const receitas = arredondar(doMes.filter((item) => item.tipo === 'Receita')
    .reduce((soma, item) => soma + Number(item.valor || 0), 0));
  const despesas = arredondar(doMes.filter((item) => item.tipo === 'Despesa')
    .reduce((soma, item) => soma + Number(item.valor || 0), 0));
  const saldo = arredondar(receitas - despesas);
  const taxaPoupanca = receitas > 0 ? arredondar((saldo / receitas) * 100) : null;
  const categorizadas = doMes.filter((item) => Boolean(item.categoria && String(item.categoria).trim())).length;
  const organizacao = doMes.length ? Math.round((categorizadas / doMes.length) * 100) : null;

  const gastosPorCategoria = doMes.filter((item) => item.tipo === 'Despesa').reduce((mapa, item) => {
    const chave = item.categoria || 'Sem categoria';
    mapa[chave] = (mapa[chave] || 0) + Number(item.valor || 0);
    return mapa;
  }, {});

  const orcamentosAtivos = orcamentos.map((orcamento) => {
    const gasto = arredondar(gastosPorCategoria[orcamento.categoria] || 0);
    const limite = Number(orcamento.limite || 0);
    return { categoria: orcamento.categoria, gasto, limite, percentual: limite > 0 ? arredondar((gasto / limite) * 100) : null };
  }).filter((item) => item.limite > 0);

  const totalLimites = arredondar(orcamentosAtivos.reduce((soma, item) => soma + item.limite, 0));
  const totalGastoOrcado = arredondar(orcamentosAtivos.reduce((soma, item) => soma + item.gasto, 0));
  const controle = totalLimites > 0 ? Math.max(0, Math.min(100, Math.round((1 - totalGastoOrcado / totalLimites) * 100))) : null;

  const categoriasComGasto = Object.entries(gastosPorCategoria)
    .map(([nome, valor]) => ({ nome, valor: arredondar(valor), percentual: despesas > 0 ? arredondar((valor / despesas) * 100) : 0 }))
    .sort((a, b) => b.valor - a.valor);

  return {
    mesReferencia: `${String(mes + 1).padStart(2, '0')}/${ano}`,
    quantidadeLancamentos: doMes.length,
    receitas,
    despesas,
    saldo,
    taxaPoupanca,
    organizacao,
    lancamentosCategorizados: categorizadas,
    orcamentosAtivos,
    totalLimites,
    totalGastoOrcado,
    controle,
    categoriasComGasto,
    temDados: doMes.length > 0,
    dimensoesDisponiveis: [
      { id: 'controle', titulo: 'Controle de gastos', valor: controle, descricao: totalLimites > 0 ? `${orcamentosAtivos.length} orçamento(s) comparado(s) aos gastos do mês.` : 'Cadastre orçamentos para avaliar o controle dos gastos.' },
      { id: 'poupanca', titulo: 'Capacidade de poupança', valor: taxaPoupanca, descricao: receitas > 0 ? `${Math.max(0, taxaPoupanca)}% da renda permaneceu após as despesas registradas.` : 'Registre receitas para calcular sua capacidade de poupança.' },
      { id: 'organizacao', titulo: 'Organização', valor: organizacao, descricao: doMes.length ? `${categorizadas} de ${doMes.length} lançamentos possuem categoria.` : 'Ainda não há lançamentos neste mês.' },
    ],
  };
}

export function gerarTextosLocais(resumo) {
  if (!resumo.temDados) return ['Ainda não há movimentações neste mês. Registre receitas e despesas para começar sua análise.'];
  const textos = [];
  if (resumo.saldo > 0) textos.push(`Seu saldo do mês está positivo em ${formatarMoeda(resumo.saldo)}.`);
  else if (resumo.saldo < 0) textos.push(`As despesas superam as receitas em ${formatarMoeda(Math.abs(resumo.saldo))}. Revise os gastos antes de assumir novos compromissos.`);
  else textos.push('Até agora, receitas e despesas estão no mesmo valor.');
  if (resumo.taxaPoupanca !== null) {
    if (resumo.taxaPoupanca >= 20) textos.push(`Você manteve ${resumo.taxaPoupanca}% da renda após as despesas registradas.`);
    else if (resumo.taxaPoupanca > 0) textos.push(`Sua margem atual é de ${resumo.taxaPoupanca}%. Avalie se há despesas variáveis que podem ser reduzidas.`);
    else textos.push('Não houve sobra financeira nas movimentações registradas até agora.');
  }
  if (resumo.organizacao !== null && resumo.organizacao < 100) textos.push(`${resumo.quantidadeLancamentos - resumo.lancamentosCategorizados} lançamento(s) ainda estão sem categoria.`);
  if (resumo.orcamentosAtivos.length === 0) textos.push('Cadastre orçamentos por categoria para acompanhar os limites de gastos.');
  else {
    const acima = resumo.orcamentosAtivos.filter((item) => item.percentual > 100);
    if (acima.length) textos.push(`Você ultrapassou o limite em: ${acima.map((item) => item.categoria).join(', ')}.`);
    else textos.push('Nenhum dos orçamentos cadastrados ultrapassou o limite até o momento.');
  }
  return textos;
}

export function formatarMoeda(valor) {
  return Number(valor || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}
