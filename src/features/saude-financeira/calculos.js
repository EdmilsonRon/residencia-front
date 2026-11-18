
/**
 * MOTOR DE CÁLCULOS — SAÚDE FINANCEIRA
 *
 * Análise local, sem API externa ou inteligência artificial.
 *
 * Dimensões:
 * 1. Controle de gastos
 * 2. Capacidade de poupança
 * 3. Organização financeira
 */

const PESOS = {
  controleGastos: 40,
  capacidadePoupanca: 35,
  organizacao: 25,
};

/**
 * Converte um valor em número.
 */
function numero(valor) {
  const resultado = Number(valor || 0);

  return Number.isFinite(resultado) ? resultado : 0;
}

/**
 * Verifica se a transação representa uma movimentação realizada.
 *
 * Transações antigas sem status são consideradas válidas.
 */
function transacaoRealizada(transacao) {
  if (!transacao.status) {
    return true;
  }

  const status = String(transacao.status)
    .trim()
    .toLowerCase();

  const statusIgnorados = [
    'pendente',
    'cancelado',
    'cancelada',
    'excluido',
    'excluida',
  ];

  return !statusIgnorados.includes(status);
}

/**
 * Extrai ano e mês de uma data no formato YYYY-MM-DD.
 */
function extrairAnoMes(data) {
  if (!data || typeof data !== 'string') {
    return null;
  }

  const partes = data.split('-');

  if (partes.length < 3) {
    return null;
  }

  const ano = Number(partes[0]);
  const mes = Number(partes[1]);
  const dia = Number(partes[2]);

  if (
    !Number.isInteger(ano) ||
    !Number.isInteger(mes) ||
    !Number.isInteger(dia) ||
    mes < 1 ||
    mes > 12 ||
    dia < 1 ||
    dia > 31
  ) {
    return null;
  }

  return { ano, mes };
}

/**
 * Verifica se a transação pertence ao mês analisado.
 */
function pertenceAoMes(transacao, ano, mes) {
  const data = extrairAnoMes(transacao.data);

  if (!data) {
    return false;
  }

  return data.ano === ano && data.mes === mes;
}

/**
 * Verifica se uma categoria está preenchida.
 */
function possuiCategoria(transacao) {
  return (
    typeof transacao.categoria === 'string' &&
    transacao.categoria.trim().length > 0
  );
}

/**
 * Calcula a pontuação de controle de gastos.
 *
 * Só considera categorias que possuem orçamento
 * e apresentam despesas de consumo no mês.
 */
function calcularControleGastos(despesas, orcamentos) {
  if (!Array.isArray(orcamentos) || orcamentos.length === 0) {
    return null;
  }

  const gastosPorCategoria = {};

  despesas.forEach((transacao) => {
    const categoria = transacao.categoria;

    if (!categoria) return;

    const chave = categoria.trim().toLowerCase();

    gastosPorCategoria[chave] =
      (gastosPorCategoria[chave] || 0) +
      numero(transacao.valor);
  });

  const avaliacoes = [];

  orcamentos.forEach((orcamento) => {
    const limite = numero(orcamento.limite);

    if (limite <= 0 || !orcamento.categoria) {
      return;
    }

    const chave = String(orcamento.categoria)
      .trim()
      .toLowerCase();

    const gasto = gastosPorCategoria[chave] || 0;

    // Não avaliar categorias sem movimentação.
    if (gasto <= 0) {
      return;
    }

    const percentual = (gasto / limite) * 100;

    let pontuacao;

    if (percentual <= 70) {
      pontuacao = 100;
    } else if (percentual <= 100) {
      pontuacao =
        100 - ((percentual - 70) / 30) * 40;
    } else if (percentual <= 120) {
      pontuacao =
        60 - ((percentual - 100) / 20) * 60;
    } else {
      pontuacao = 0;
    }

    avaliacoes.push({
      categoria: orcamento.categoria,
      gasto,
      limite,
      percentual: Math.round(percentual),
      pontuacao: Math.round(pontuacao),
    });
  });

  if (avaliacoes.length === 0) {
    return null;
  }

  const somaPesos = avaliacoes.reduce(
    (total, item) => total + item.limite,
    0
  );

  const resultado = avaliacoes.reduce(
    (total, item) =>
      total + item.pontuacao * item.limite,
    0
  );

  return {
    pontuacao: Math.round(resultado / somaPesos),
    categoriasAvaliadas: avaliacoes,
  };
}

/**
 * Calcula a capacidade de poupança.
 *
 * A margem financeira é calculada considerando
 * receitas menos despesas de consumo.
 *
 * Aportes às metas são apresentados separadamente.
 */
function calcularCapacidadePoupanca(
  receitas,
  despesas,
  aportes
) {
  if (receitas <= 0) {
    return null;
  }

  const margem = receitas - despesas;

  const percentualMargem = (margem / receitas) * 100;

  let pontuacao;

  if (percentualMargem <= 0) {
    pontuacao = 0;
  } else if (percentualMargem >= 20) {
    pontuacao = 100;
  } else {
    pontuacao = (percentualMargem / 20) * 100;
  }

  return {
    pontuacao: Math.round(pontuacao),
    receitas,
    despesas,
    margem,
    percentualMargem: Math.round(percentualMargem * 100) / 100,
    aportes,
  };
}

/**
 * Calcula o nível de organização financeira.
 *
 * Avalia quantas transações possuem categoria.
 */
function calcularOrganizacao(transacoes) {
  if (transacoes.length === 0) {
    return null;
  }

  const categorizadas = transacoes.filter(
    possuiCategoria
  ).length;

  const percentual =
    (categorizadas / transacoes.length) * 100;

  return {
    pontuacao: Math.round(percentual),
    totalTransacoes: transacoes.length,
    transacoesCategorizadas: categorizadas,
    percentualCategorizado: Math.round(percentual),
  };
}

/**
 * Calcula a pontuação geral.
 *
 * As dimensões indisponíveis não entram no cálculo.
 * Se menos de duas dimensões estiverem disponíveis,
 * a pontuação geral não será apresentada.
 */
function calcularPontuacaoGeral(dimensoes) {
  const disponiveis = Object.entries(dimensoes)
    .filter(([, dimensao]) => dimensao !== null);

  if (disponiveis.length < 2) {
    return null;
  }

  let somaPontuacoes = 0;
  let somaPesos = 0;

  disponiveis.forEach(([chave, dimensao]) => {
    const peso = PESOS[chave];

    somaPontuacoes += dimensao.pontuacao * peso;
    somaPesos += peso;
  });

  return Math.round(somaPontuacoes / somaPesos);
}

/**
 * Gera pontos positivos, alertas e recomendações.
 */
function gerarRecomendacoes(dimensoes, dados) {
  const pontosPositivos = [];
  const alertas = [];
  const recomendacoes = [];

  const controle = dimensoes.controleGastos;
  const poupanca = dimensoes.capacidadePoupanca;
  const organizacao = dimensoes.organizacao;

  if (controle) {
    if (controle.pontuacao >= 80) {
      pontosPositivos.push(
        'Você está mantendo os gastos dentro de bons níveis nos orçamentos avaliados.'
      );
    }

    if (controle.pontuacao < 60) {
      alertas.push(
        'Existem categorias com gastos próximos ou acima dos limites definidos.'
      );

      recomendacoes.push(
        'Revise os gastos das categorias que estão comprometendo seus orçamentos.'
      );
    }
  } else {
    alertas.push(
      'Ainda não existem dados suficientes de orçamentos com movimentações para avaliar o controle de gastos.'
    );

    recomendacoes.push(
      'Cadastre orçamentos para as categorias em que deseja acompanhar os gastos.'
    );
  }

  if (poupanca) {
    if (poupanca.margem > 0) {
      pontosPositivos.push(
        'Suas receitas superaram as despesas de consumo no período analisado.'
      );
    }

    if (poupanca.margem < 0) {
      alertas.push(
        'As despesas de consumo ultrapassaram as receitas neste mês.'
      );

      recomendacoes.push(
        'Analise suas despesas e identifique oportunidades de reduzir gastos.'
      );
    }

    if (poupanca.aportes > 0) {
      pontosPositivos.push(
        'Você realizou aportes em suas metas financeiras.'
      );
    }
  } else {
    alertas.push(
      'Não há receitas suficientes registradas neste mês para avaliar a capacidade de poupança.'
    );
  }

  if (organizacao) {
    if (organizacao.pontuacao >= 90) {
      pontosPositivos.push(
        'Suas transações estão bem organizadas por categoria.'
      );
    }

    if (organizacao.pontuacao < 80) {
      alertas.push(
        'Existem transações sem categoria definida.'
      );

      recomendacoes.push(
        'Revise suas transações e atribua categorias para melhorar o acompanhamento financeiro.'
      );
    }
  } else {
    alertas.push(
      'Ainda não existem transações suficientes para avaliar sua organização financeira.'
    );
  }

  if (recomendacoes.length === 0) {
    recomendacoes.push(
      'Continue registrando suas movimentações e acompanhando seus orçamentos e metas.'
    );
  }

  return {
    pontosPositivos,
    alertas,
    recomendacoes,
  };
}

/**
 * FUNÇÃO PRINCIPAL
 *
 * Uso:
 *
 * const resultado = calcularSaudeFinanceira({
 *   transacoes,
 *   orcamentos,
 *   hoje: new Date(),
 * });
 */
export function calcularSaudeFinanceira({
  transacoes = [],
  orcamentos = [],
  hoje = new Date(),
} = {}) {
  const ano = hoje.getFullYear();
  const mes = hoje.getMonth() + 1;

  // Considera apenas transações realizadas no mês atual.
  const transacoesMes = transacoes.filter(
    (transacao) =>
      transacaoRealizada(transacao) &&
      pertenceAoMes(transacao, ano, mes)
  );

  const receitas = transacoesMes
    .filter((t) => t.tipo === 'Receita')
    .reduce(
      (total, t) => total + numero(t.valor),
      0
    );

  // Aportes de metas não são despesas de consumo.
  const aportes = transacoesMes
    .filter(
      (t) =>
        t.tipo === 'Despesa' &&
        t.metaId
    )
    .reduce(
      (total, t) => total + numero(t.valor),
      0
    );

  const despesasConsumo = transacoesMes.filter(
    (t) =>
      t.tipo === 'Despesa' &&
      !t.metaId
  );

  const totalDespesas = despesasConsumo.reduce(
    (total, t) => total + numero(t.valor),
    0
  );

  const dimensoes = {
    controleGastos: calcularControleGastos(
      despesasConsumo,
      orcamentos
    ),

    capacidadePoupanca: calcularCapacidadePoupanca(
      receitas,
      totalDespesas,
      aportes
    ),

    organizacao: calcularOrganizacao(
      transacoesMes
    ),
  };

  const pontuacao = calcularPontuacaoGeral(
    dimensoes
  );

  const recomendacoes = gerarRecomendacoes(
    dimensoes,
    {
      receitas,
      despesas: totalDespesas,
      aportes,
    }
  );

  return {
    periodo: {
      ano,
      mes,
    },

    pontuacao,

    analiseParcial:
      Object.values(dimensoes).filter(
        (dimensao) => dimensao !== null
      ).length < 3,

    dimensoes,

    resumo: {
      receitas,
      despesas: totalDespesas,
      aportes,
      margem: receitas - totalDespesas,
    },

    ...recomendacoes,
  };
}
