function obterChaveMes(data) {
  if (typeof data !== 'string') {
    return null;
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(data)) {
    return null;
  }

  return data.substring(0, 7);
}

function obterMesesRecentes(quantidade = 3) {
  const hoje = new Date();
  const meses = [];

  for (let i = 0; i < quantidade; i++) {
    const data = new Date(
      hoje.getFullYear(),
      hoje.getMonth() - i,
      1
    );

    const ano = data.getFullYear();
    const mes = String(
      data.getMonth() + 1
    ).padStart(2, '0');

    meses.push(`${ano}-${mes}`);
  }

  return meses;
}

function limitar(valor, minimo = 0, maximo = 100) {
  return Math.min(
    Math.max(valor, minimo),
    maximo
  );
}

function converterValor(valor) {
  const numero = Number(valor);

  return Number.isFinite(numero) && numero > 0
    ? numero
    : 0;
}

function calcularPontuacaoEquilibrio(
  receitas,
  despesas
) {
  if (receitas <= 0) {
    return null;
  }

  const percentualDespesas =
    (despesas / receitas) * 100;

  if (percentualDespesas <= 50) return 100;
  if (percentualDespesas <= 70) return 90;
  if (percentualDespesas <= 85) return 80;
  if (percentualDespesas <= 100) return 65;
  if (percentualDespesas <= 120) return 40;

  return 20;
}

function calcularPontuacaoEconomia(
  receitas,
  despesasConsumo
) {
  if (receitas <= 0) {
    return null;
  }

  const valorEconomizado =
    receitas - despesasConsumo;

  const percentual =
    (valorEconomizado / receitas) * 100;

  return limitar(
    percentual <= 0 ? 0 : percentual * (100 / 30)
  );
}

function calcularPontuacaoOrcamentos(
  analiseOrcamentos
) {
  if (analiseOrcamentos.length === 0) {
    return null;
  }

  const soma = analiseOrcamentos.reduce(
    (total, item) => {
      if (item.percentual <= 80) {
        return total + 100;
      }

      if (item.percentual <= 100) {
        return total + 75;
      }

      const excesso = item.percentual - 100;

      return total + limitar(50 - excesso);
    },
    0
  );

  return soma / analiseOrcamentos.length;
}

function calcularPontuacaoMetas(analiseMetas) {
  if (analiseMetas.length === 0) {
    return null;
  }

  const soma = analiseMetas.reduce(
    (total, meta) => total + meta.percentual,
    0
  );

  return soma / analiseMetas.length;
}

function calcularSaudeFinanceira({
  transacoes = [],
  orcamentos = [],
  metas = [],
}) {
  const hoje = new Date();

  const anoAtual = hoje.getFullYear();

  const mesAtual = String(
    hoje.getMonth() + 1
  ).padStart(2, '0');

  const chaveMesAtual =
    `${anoAtual}-${mesAtual}`;

  const mesesRecentes = obterMesesRecentes(3);

  /*
   * As transações arquivadas também são consideradas.
   * Arquivar não apaga uma movimentação do histórico financeiro.
   */
  const transacoesValidas = transacoes.filter(
    (item) =>
      item &&
      obterChaveMes(item.data) !== null &&
      ['Receita', 'Despesa'].includes(item.tipo)
  );

  const transacoesMes = transacoesValidas.filter(
    (item) =>
      obterChaveMes(item.data) === chaveMesAtual
  );

  const receitas = transacoesMes
    .filter((item) => item.tipo === 'Receita')
    .reduce(
      (total, item) =>
        total + converterValor(item.valor),
      0
    );

  const despesas = transacoesMes
    .filter((item) => item.tipo === 'Despesa')
    .reduce(
      (total, item) =>
        total + converterValor(item.valor),
      0
    );

  /*
   * Aportes em metas são despesas no fluxo de caixa,
   * mas não são tratados como gastos de consumo.
   */
  const despesasConsumo = transacoesMes
    .filter(
      (item) =>
        item.tipo === 'Despesa' &&
        !item.metaId
    )
    .reduce(
      (total, item) =>
        total + converterValor(item.valor),
      0
    );

  const saldo = receitas - despesas;

  const valorEconomizado =
    receitas - despesasConsumo;

  const percentualEconomizado =
    receitas > 0
      ? (valorEconomizado / receitas) * 100
      : null;

  // ORÇAMENTOS
  const analiseOrcamentos = orcamentos.map(
    (orcamento) => {
      const limite = converterValor(
        orcamento.limite
      );

      const gasto = transacoesMes
        .filter(
          (item) =>
            item.tipo === 'Despesa' &&
            !item.metaId &&
            item.categoria === orcamento.categoria
        )
        .reduce(
          (total, item) =>
            total + converterValor(item.valor),
          0
        );

      const percentual =
        limite > 0
          ? (gasto / limite) * 100
          : 0;

      return {
        id: orcamento.id,
        categoria: orcamento.categoria,
        limite,
        gasto,
        percentual,
        ultrapassou: gasto > limite,
        proximoDoLimite:
          percentual >= 80 && percentual <= 100,
      };
    }
  );

  const orcamentosUltrapassados =
    analiseOrcamentos.filter(
      (item) => item.ultrapassou
    );

  const pontuacaoOrcamentos =
    calcularPontuacaoOrcamentos(
      analiseOrcamentos
    );

  // METAS
  const analiseMetas = metas.map((meta) => {
    const objetivo = converterValor(
      meta.objetivo
    );

    /*
     * A tela de metas registra cada aporte como
     * uma despesa com o campo metaId.
     */
    const guardado = transacoesValidas
      .filter(
        (item) =>
          item.metaId === meta.id &&
          item.tipo === 'Despesa'
      )
      .reduce(
        (total, item) =>
          total + converterValor(item.valor),
        0
      );

    const percentual =
      objetivo > 0
        ? limitar((guardado / objetivo) * 100)
        : 0;

    return {
      id: meta.id,
      nome: meta.nome,
      objetivo,
      guardado,
      percentual,
    };
  });

  const pontuacaoMetas =
    calcularPontuacaoMetas(analiseMetas);

  // HISTÓRICO DOS ÚLTIMOS TRÊS MESES
  const historicoMensal = mesesRecentes.map(
    (mes) => {
      const movimentacoes = transacoesValidas.filter(
        (item) =>
          obterChaveMes(item.data) === mes
      );

      const totalReceitas = movimentacoes
        .filter((item) => item.tipo === 'Receita')
        .reduce(
          (total, item) =>
            total + converterValor(item.valor),
          0
        );

      const totalDespesas = movimentacoes
        .filter((item) => item.tipo === 'Despesa')
        .reduce(
          (total, item) =>
            total + converterValor(item.valor),
          0
        );

      return {
        mes,
        receitas: totalReceitas,
        despesas: totalDespesas,
        saldo: totalReceitas - totalDespesas,
        possuiMovimentacao:
          movimentacoes.length > 0,
      };
    }
  );

  const mesesComMovimentacao =
    historicoMensal.filter(
      (item) => item.possuiMovimentacao
    );

  const mesesPositivos =
    mesesComMovimentacao.filter(
      (item) => item.saldo >= 0
    );

  const pontuacaoConsistencia =
    mesesComMovimentacao.length >= 2
      ? (
          mesesPositivos.length /
          mesesComMovimentacao.length
        ) * 100
      : null;

  // INDICADORES E PESOS
  const componentes = [
    {
      nome: 'Equilíbrio mensal',
      peso: 30,
      pontuacao: calcularPontuacaoEquilibrio(
        receitas,
        despesas
      ),
    },
    {
      nome: 'Capacidade de economia',
      peso: 25,
      pontuacao: calcularPontuacaoEconomia(
        receitas,
        despesasConsumo
      ),
    },
    {
      nome: 'Controle de orçamentos',
      peso: 20,
      pontuacao: pontuacaoOrcamentos,
    },
    {
      nome: 'Progresso das metas',
      peso: 15,
      pontuacao: pontuacaoMetas,
    },
    {
      nome: 'Consistência',
      peso: 10,
      pontuacao: pontuacaoConsistencia,
    },
  ];

  const componentesDisponiveis =
    componentes.filter(
      (item) => item.pontuacao !== null
    );

  const pesoDisponivel =
    componentesDisponiveis.reduce(
      (total, item) => total + item.peso,
      0
    );

  const temMovimentacaoNoMes =
    transacoesMes.length > 0;

  /*
   * Não mostra uma nota geral quando não há
   * movimentações no mês atual.
   */
  const pontuacao =
    temMovimentacaoNoMes && pesoDisponivel > 0
      ? Math.round(
          componentesDisponiveis.reduce(
            (total, item) =>
              total +
              item.pontuacao * item.peso,
            0
          ) / pesoDisponivel
        )
      : null;

  const indiceParcial =
    pesoDisponivel < 100;

  // CLASSIFICAÇÃO
  let classificacao = 'Dados insuficientes';

  let descricaoClassificacao =
    'Registre suas movimentações para começar a acompanhar sua saúde financeira.';

  let corClassificacao = '#777777';

  if (pontuacao !== null) {
    if (pontuacao >= 85) {
      classificacao = 'Excelente';

      descricaoClassificacao =
        'Seus indicadores apresentam resultados positivos.';

      corClassificacao = '#238B45';
    } else if (pontuacao >= 70) {
      classificacao = 'Boa';

      descricaoClassificacao =
        'Você apresenta bons resultados, com alguns pontos para acompanhar.';

      corClassificacao = '#4A9B70';
    } else if (pontuacao >= 50) {
      classificacao = 'Regular';

      descricaoClassificacao =
        'Alguns hábitos financeiros merecem mais atenção.';

      corClassificacao = '#D69A27';
    } else if (pontuacao >= 30) {
      classificacao = 'Atenção';

      descricaoClassificacao =
        'Existem pontos importantes que precisam ser acompanhados.';

      corClassificacao = '#E47A35';
    } else {
      classificacao = 'Crítica';

      descricaoClassificacao =
        'Seus indicadores mostram a necessidade de reorganizar as finanças.';

      corClassificacao = '#D92344';
    }
  }

  // PONTOS POSITIVOS
  const pontosPositivos = [];

  if (receitas > 0 && saldo >= 0) {
    pontosPositivos.push(
      'Suas receitas foram suficientes para cobrir as despesas registradas neste mês.'
    );
  }

  if (
    percentualEconomizado !== null &&
    percentualEconomizado >= 10
  ) {
    pontosPositivos.push(
      'Você conseguiu manter uma parte da renda sem comprometer os gastos de consumo.'
    );
  }

  if (
    analiseOrcamentos.length > 0 &&
    orcamentosUltrapassados.length === 0
  ) {
    pontosPositivos.push(
      'Todos os seus orçamentos estão dentro dos limites definidos.'
    );
  }

  if (
    analiseMetas.some(
      (item) => item.percentual > 0
    )
  ) {
    pontosPositivos.push(
      'Você já começou a registrar aportes nas suas metas.'
    );
  }

  // RECOMENDAÇÕES
  const recomendacoes = [];

  if (!temMovimentacaoNoMes) {
    recomendacoes.push(
      'Registre suas receitas e despesas do mês para receber uma análise atualizada.'
    );
  }

  if (receitas === 0 && despesas > 0) {
    recomendacoes.push(
      'Você registrou despesas, mas ainda não possui receitas neste mês. Registre suas entradas para obter uma análise mais completa.'
    );
  }

  if (receitas > 0 && saldo < 0) {
    recomendacoes.push(
      'Neste mês, as despesas superaram as receitas. Revise os gastos e identifique o que pode ser reorganizado.'
    );
  }

  if (
    percentualEconomizado !== null &&
    percentualEconomizado < 10
  ) {
    recomendacoes.push(
      'Sua capacidade de economia está baixa. Observe quais gastos podem ser reorganizados sem comprometer necessidades importantes.'
    );
  }

  if (orcamentosUltrapassados.length > 0) {
    recomendacoes.push(
      `Você ultrapassou ${orcamentosUltrapassados.length} orçamento(s). Vale revisar os limites e os gastos dessas categorias.`
    );
  }

  if (
    analiseOrcamentos.some(
      (item) => item.proximoDoLimite
    )
  ) {
    recomendacoes.push(
      'Alguns orçamentos estão próximos do limite. Acompanhe essas categorias durante o restante do mês.'
    );
  }

  if (metas.length === 0) {
    recomendacoes.push(
      'Você ainda não possui metas cadastradas. Criar um objetivo pode ajudar a organizar seus planos.'
    );
  }

  if (
    temMovimentacaoNoMes &&
    componentesDisponiveis.length < 5
  ) {
    recomendacoes.push(
      'Cadastre orçamentos e metas, e acompanhe mais meses para ampliar os indicadores disponíveis.'
    );
  }

  return {
    pontuacao,
    classificacao,
    descricaoClassificacao,
    corClassificacao,

    indiceParcial,
    indicadoresDisponiveis:
      componentesDisponiveis.length,

    temMovimentacaoNoMes,

    receitas,
    despesas,
    despesasConsumo,
    saldo,

    valorEconomizado,
    percentualEconomizado,

    analiseOrcamentos,
    orcamentosUltrapassados,
    pontuacaoOrcamentos,

    analiseMetas,
    pontuacaoMetas,

    historicoMensal,
    pontuacaoConsistencia,

    componentes,
    pontosPositivos,
    recomendacoes,
  };
}

export {
  calcularSaudeFinanceira,
};