// Textos da tela de saúde financeira.
// Estão em um arquivo só para você reescrever depois sem mexer na lógica.
// Os textos abaixo são provisórios.

import { formatarMoeda } from './saudeFinanceira';

// Descrição de cada dimensão conforme a nota: [faixa vermelha, amarela, verde].
const DESCRICOES = {
  controleGastos: [
    'Os gastos passaram do planejado. Vale revisar as categorias que mais pesam.',
    'Você está perto do limite em alguns gastos. Dá para melhorar.',
    'Seus gastos estão dentro do planejado.',
  ],
  poupanca: [
    'Pouca ou nenhuma parte da renda foi guardada neste mês.',
    'Você guarda parte da renda, mas ainda dá para aumentar.',
    'Você está guardando uma boa parte da renda.',
  ],
  endividamento: [
    'As dívidas pesam bastante no orçamento.',
    'Há dívidas, mas elas ainda cabem no orçamento.',
    'Suas dívidas estão sob controle.',
  ],
  reserva: [
    'A reserva cobre poucos meses de gastos. A meta é chegar a 6 meses.',
    'A reserva já ajuda, mas ainda está abaixo da meta de 6 meses.',
    'Sua reserva está perto ou acima da meta de 6 meses.',
  ],
  organizacao: [
    'Muitos lançamentos estão sem categoria específica.',
    'A maior parte dos lançamentos está categorizada.',
    'Todos os lançamentos do mês estão categorizados.',
  ],
  evolucao: [
    'O saldo deste mês ficou abaixo do mês anterior.',
    'O saldo está parecido com o do mês anterior.',
    'O saldo cresceu em relação ao mês anterior.',
  ],
};

const SEM_DADOS = {
  endividamento: 'O app ainda não tem cadastro de dívidas e parcelas.',
  reserva: 'Sem gastos registrados para estimar a reserva.',
  evolucao: 'Sem lançamentos no mês anterior para comparar.',
  controleGastos: 'Sem receitas ou despesas para avaliar.',
  poupanca: 'Sem receitas ou despesas para avaliar.',
  organizacao: 'Sem lançamentos para avaliar.',
};

export function descricaoDimensao(dimensao) {
  if (dimensao.semDados) return SEM_DADOS[dimensao.chave];

  const lista = DESCRICOES[dimensao.chave];

  if (dimensao.nota >= 70) return lista[2];
  if (dimensao.nota >= 40) return lista[1];

  return lista[0];
}

function percentual(valor) {
  return `${Math.round(valor * 100)}%`;
}

function textoMeses(meses) {
  return meses.toFixed(1).replace('.', ',');
}

// Monta pontos positivos, pontos de atenção e recomendações a partir do resultado.
export function montarTextos(resultado, anterior) {
  const positivos = [];
  const atencao = [];
  const recomendacoes = [];

  if (!resultado.temDados) {
    return { positivos, atencao, recomendacoes };
  }

  if (resultado.taxaPoupanca >= 0.2) {
    positivos.push(
      `Você poupou ${percentual(resultado.taxaPoupanca)} da renda (${formatarMoeda(
        resultado.saldo
      )} de ${formatarMoeda(resultado.receitas)}).`
    );
  }

  if (anterior && anterior.temDados && resultado.despesas < anterior.despesas) {
    const queda = 1 - resultado.despesas / anterior.despesas;

    positivos.push(`Despesas ${percentual(queda)} menores que no mês anterior.`);
  }

  if (resultado.totalLancamentos > 0 && resultado.semCategoria === 0) {
    positivos.push('Todos os lançamentos do mês estão categorizados.');
  }

  if (resultado.estourados.length === 0 && resultado.usouOrcamentos) {
    positivos.push('Nenhum orçamento foi ultrapassado neste mês.');
  }

  if (resultado.saldo < 0) {
    atencao.push(
      `As despesas passaram das receitas em ${formatarMoeda(Math.abs(resultado.saldo))}.`
    );
  }

  if (resultado.mesesReserva > 0 && resultado.mesesReserva < 3) {
    atencao.push(
      `O saldo acumulado cobre só ${textoMeses(
        resultado.mesesReserva
      )} mês de gastos; a meta é 6 meses.`
    );
  }

  resultado.estourados.forEach((item) => {
    atencao.push(
      `${item.categoria}: ${formatarMoeda(item.gasto)} gastos, limite de ${formatarMoeda(
        item.limite
      )}.`
    );
  });

  if (resultado.semCategoria > 0) {
    atencao.push(
      `${resultado.semCategoria} lançamento(s) estão em "Outros" ou sem categoria.`
    );
  }

  // Recomendações: as duas dimensões com menor nota (entre as que têm dados).
  const piores = resultado.dimensoes
    .filter((item) => !item.semDados && item.nota < 70)
    .sort((a, b) => a.nota - b.nota)
    .slice(0, 3);

  piores.forEach((item) => {
    recomendacoes.push({
      titulo: item.titulo,
      detalhe: descricaoDimensao(item),
    });
  });

  return { positivos, atencao, recomendacoes };
}

// Frase curta de incentivo sob a nota, na tela principal.
export function mensagemDaNota(nota, diferenca) {
  if (diferenca === null || diferenca === undefined) {
    return 'Veja abaixo onde você está bem e onde pode melhorar.';
  }

  if (diferenca > 0) return 'Você está evoluindo!';
  if (diferenca < 0) return 'Atenção: a pontuação caiu.';

  return 'Pontuação igual à do mês anterior.';
}
