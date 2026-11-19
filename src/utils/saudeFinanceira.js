// Cálculo da pontuação de saúde financeira (0 a 100).
// Usa só o que o app já tem: transações (receitas/despesas com categoria e data)
// e orçamentos. Nada aqui depende de tela, então os pesos e faixas
// podem ser mudados neste arquivo sem mexer nas telas.

const NOMES_MESES = [
  'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
  'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez',
];

// Pesos iniciais (ainda em validação). A soma é 1.
// Dimensões sem dados no mês ficam de fora e o peso das outras é reajustado.
export const DIMENSOES = [
  { chave: 'controleGastos', titulo: 'Controle de gastos', peso: 0.15 },
  { chave: 'poupanca', titulo: 'Poupança', peso: 0.2 },
  { chave: 'endividamento', titulo: 'Endividamento', peso: 0.2 },
  { chave: 'reserva', titulo: 'Reserva de emergência', peso: 0.2 },
  { chave: 'organizacao', titulo: 'Organização', peso: 0.15 },
  { chave: 'evolucao', titulo: 'Evolução patrimonial', peso: 0.1 },
];

// Faixas de cor: vermelho 0-39, amarelo 40-69, verde 70-100.
export const FAIXA_AMARELO = 40;
export const FAIXA_VERDE = 70;

export const CORES_STATUS = {
  ruim: { cor: '#D92344', texto: '#D92344', fundo: '#FCE8E6' },
  medio: { cor: '#F2B600', texto: '#9A7400', fundo: '#FFF4CC' },
  bom: { cor: '#238B45', texto: '#238B45', fundo: '#E4F5E9' },
};

export function statusDaNota(nota) {
  if (nota >= FAIXA_VERDE) {
    return { chave: 'bom', rotulo: 'Situação saudável', ...CORES_STATUS.bom };
  }

  if (nota >= FAIXA_AMARELO) {
    return { chave: 'medio', rotulo: 'Situação razoável', ...CORES_STATUS.medio };
  }

  return { chave: 'ruim', rotulo: 'Situação delicada', ...CORES_STATUS.ruim };
}

function numero(valor) {
  return Number(valor || 0);
}

function limitar(valor, minimo = 0, maximo = 100) {
  return Math.min(maximo, Math.max(minimo, valor));
}

function soma(lista) {
  return lista.reduce((total, item) => total + numero(item.valor), 0);
}

// ---------- meses (chave no formato "AAAA-MM") ----------

export function chaveMes(data) {
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, '0');

  return `${ano}-${mes}`;
}

export function deslocarMes(chave, quantidade) {
  const [ano, mes] = chave.split('-').map(Number);
  const nova = new Date(ano, mes - 1 + quantidade, 1);

  return chaveMes(nova);
}

export function nomeMes(chave, curto = false) {
  const [ano, mes] = chave.split('-').map(Number);
  const nome = NOMES_MESES[mes - 1];

  return curto ? nome : `${nome} ${ano}`;
}

export function mesesComDados(transacoes) {
  const chaves = new Set();

  transacoes.forEach((transacao) => {
    if (transacao.data && transacao.data.length >= 7) {
      chaves.add(transacao.data.slice(0, 7));
    }
  });

  return [...chaves].sort();
}

// ---------- dimensões ----------

// Controle de gastos: respeita os orçamentos; sem orçamento, olha despesa / receita.
function calcularControle(doMes, orcamentos, receitas, despesas) {
  const gastos = {};

  doMes
    .filter((item) => item.tipo === 'Despesa')
    .forEach((item) => {
      gastos[item.categoria] =
        (gastos[item.categoria] || 0) + numero(item.valor);
    });

  const lista = (orcamentos || []).filter((item) => numero(item.limite) > 0);

  if (lista.length > 0) {
    const estourados = [];

    const notas = lista.map((orcamento) => {
      const gasto = gastos[orcamento.categoria] || 0;
      const limite = numero(orcamento.limite);

      if (gasto <= limite) return 100;

      estourados.push({
        categoria: orcamento.categoria,
        gasto,
        limite,
      });

      return (limite / gasto) * 100;
    });

    const media = notas.reduce((total, nota) => total + nota, 0) / notas.length;

    return { nota: media, estourados, usouOrcamentos: true };
  }

  if (receitas <= 0) {
    return {
      nota: despesas > 0 ? 0 : null,
      estourados: [],
      usouOrcamentos: false,
    };
  }

  // Gastar até 50% da renda = 100; gastar 100% ou mais = 0.
  const proporcao = despesas / receitas;

  return {
    nota: limitar(((1 - proporcao) / 0.5) * 100),
    estourados: [],
    usouOrcamentos: false,
  };
}

// Poupança: taxa de poupança do mês. Poupar 30% da renda ou mais = 100.
function calcularPoupanca(receitas, despesas) {
  if (receitas <= 0) return { nota: 0, taxa: 0 };

  const taxa = (receitas - despesas) / receitas;

  return { nota: limitar((taxa / 0.3) * 100), taxa };
}

// Reserva (estimada): saldo acumulado até o mês, em meses de gasto médio.
// Meta de 6 meses = 100. Não há cadastro de reserva no app, por isso é estimativa.
function calcularReserva(transacoes, mes) {
  const ate = transacoes.filter(
    (item) => item.data && item.data.slice(0, 7) <= mes
  );

  const receitas = soma(ate.filter((item) => item.tipo === 'Receita'));
  const despesasLista = ate.filter((item) => item.tipo === 'Despesa');
  const despesas = soma(despesasLista);

  const mesesComDespesa = new Set(
    despesasLista.map((item) => item.data.slice(0, 7))
  ).size;

  if (mesesComDespesa === 0 || despesas <= 0) {
    return { nota: null, meses: 0 };
  }

  const gastoMedio = despesas / mesesComDespesa;
  const acumulado = Math.max(receitas - despesas, 0);
  const meses = acumulado / gastoMedio;

  return { nota: limitar((meses / 6) * 100), meses };
}

// Organização: parte dos lançamentos do mês que têm categoria própria (fora de "Outros").
function calcularOrganizacao(doMes) {
  if (doMes.length === 0) return { nota: null, semCategoria: 0 };

  const semCategoria = doMes.filter(
    (item) =>
      !item.categoria ||
      item.categoria.trim().toLowerCase() === 'outros'
  ).length;

  return {
    nota: ((doMes.length - semCategoria) / doMes.length) * 100,
    semCategoria,
  };
}

// Evolução: compara o saldo do mês com o do mês anterior.
// Sem lançamentos no mês anterior não há como comparar.
function calcularEvolucao(transacoes, mes, receitas, saldo) {
  const anterior = deslocarMes(mes, -1);

  const doAnterior = transacoes.filter(
    (item) => item.data && item.data.slice(0, 7) === anterior
  );

  if (doAnterior.length === 0) return { nota: null, variacao: 0 };

  const receitasAnterior = soma(doAnterior.filter((item) => item.tipo === 'Receita'));
  const despesasAnterior = soma(doAnterior.filter((item) => item.tipo === 'Despesa'));
  const saldoAnterior = receitasAnterior - despesasAnterior;

  const base = Math.max(receitas, receitasAnterior, 1);
  const variacao = saldo - saldoAnterior;

  return {
    nota: limitar(50 + 50 * limitar(variacao / base, -1, 1)),
    variacao,
  };
}

// ---------- resultado completo ----------

export function calcularSaude({ transacoes, orcamentos, mes }) {
  const doMes = transacoes.filter(
    (item) => item.data && item.data.slice(0, 7) === mes
  );

  if (doMes.length === 0) {
    return { temDados: false, mes };
  }

  const receitas = soma(doMes.filter((item) => item.tipo === 'Receita'));
  const despesas = soma(doMes.filter((item) => item.tipo === 'Despesa'));
  const saldo = receitas - despesas;

  const controle = calcularControle(doMes, orcamentos, receitas, despesas);
  const poupanca = calcularPoupanca(receitas, despesas);
  const reserva = calcularReserva(transacoes, mes);
  const organizacao = calcularOrganizacao(doMes);
  const evolucao = calcularEvolucao(transacoes, mes, receitas, saldo);

  const notas = {
    controleGastos: controle.nota,
    poupanca: poupanca.nota,
    // O app ainda não tem cadastro de dívidas e parcelas.
    endividamento: null,
    reserva: reserva.nota,
    organizacao: organizacao.nota,
    evolucao: evolucao.nota,
  };

  const pesoTotal = DIMENSOES.reduce(
    (total, item) => total + (notas[item.chave] === null ? 0 : item.peso),
    0
  );

  const dimensoes = DIMENSOES.map((item) => {
    const nota = notas[item.chave];
    const semDados = nota === null;
    const pesoEfetivo = semDados || pesoTotal === 0 ? 0 : item.peso / pesoTotal;

    return {
      chave: item.chave,
      titulo: item.titulo,
      semDados,
      nota: semDados ? null : Math.round(nota),
      peso: pesoEfetivo,
      pontos: semDados ? 0 : nota * pesoEfetivo,
    };
  });

  const total = dimensoes.reduce((soma_, item) => soma_ + item.pontos, 0);
  const nota = Math.round(total);

  return {
    temDados: true,
    mes,
    nota,
    totalExato: total,
    status: statusDaNota(nota),
    dimensoes,
    receitas,
    despesas,
    saldo,
    taxaPoupanca: poupanca.taxa,
    mesesReserva: reserva.meses,
    estourados: controle.estourados,
    usouOrcamentos: controle.usouOrcamentos,
    semCategoria: organizacao.semCategoria,
    totalLancamentos: doMes.length,
    variacaoSaldo: evolucao.variacao,
  };
}

// Pontuação dos últimos meses, do mais antigo ao mais novo (null = sem lançamentos).
export function historicoDePontuacao({ transacoes, orcamentos, mes, quantidade = 4 }) {
  const lista = [];

  for (let i = quantidade - 1; i >= 0; i -= 1) {
    const chave = deslocarMes(mes, -i);
    const resultado = calcularSaude({ transacoes, orcamentos, mes: chave });

    lista.push({
      mes: chave,
      nome: nomeMes(chave, true),
      nota: resultado.temDados ? resultado.nota : null,
    });
  }

  return lista;
}

export function formatarMoeda(valor) {
  return Number(valor || 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}
