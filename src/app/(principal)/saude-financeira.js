import React from 'react';

import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { useTransacoes } from '../../contexts/TransacoesContext';
import { useOrcamentos } from '../../contexts/OrcamentosContext';
import { useMetas } from '../../contexts/MetasContext';

import {
  calcularSaudeFinanceira,
} from '../../utils/saudeFinanceira';

function formatarMoeda(valor) {
  return Number(valor || 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

function formatarPercentual(valor) {
  if (valor === null || valor === undefined) {
    return 'Sem dados';
  }

  return `${valor.toFixed(1).replace('.', ',')}%`;
}

function obterNomeMes(chaveMes) {
  const [ano, mes] = chaveMes.split('-').map(Number);

  const nome = new Date(ano, mes - 1, 1)
    .toLocaleDateString('pt-BR', {
      month: 'long',
    });

  return nome.charAt(0).toUpperCase() + nome.slice(1);
}

function BarraProgresso({
  percentual,
  cor = '#238B45',
  altura = 8,
}) {
  const largura = Math.min(
    Math.max(Number(percentual || 0), 0),
    100
  );

  return (
    <View
      style={[
        estilos.fundoBarra,
        { height: altura },
      ]}
    >
      <View
        style={[
          estilos.barra,
          {
            width: `${largura}%`,
            backgroundColor: cor,
            height: altura,
          },
        ]}
      />
    </View>
  );
}

function CartaoIndicador({
  titulo,
  descricao,
  pontuacao,
  icone,
}) {
  const possuiDados = pontuacao !== null;

  let cor = '#238B45';

  if (possuiDados && pontuacao < 50) {
    cor = '#D92344';
  } else if (possuiDados && pontuacao < 70) {
    cor = '#D69A27';
  }

  return (
    <View style={estilos.cartaoIndicador}>
      <View style={estilos.linhaIndicador}>
        <View style={estilos.iconeIndicador}>
          <Ionicons
            name={icone}
            size={21}
            color="#555555"
          />
        </View>

        <View style={estilos.informacaoIndicador}>
          <Text style={estilos.tituloIndicador}>
            {titulo}
          </Text>

          <Text style={estilos.descricaoIndicador}>
            {descricao}
          </Text>
        </View>

        <Text
          style={[
            estilos.valorIndicador,
            {
              color: possuiDados ? cor : '#999999',
            },
          ]}
        >
          {possuiDados
            ? `${Math.round(pontuacao)}/100`
            : 'N/D'}
        </Text>
      </View>

      {possuiDados && (
        <BarraProgresso
          percentual={pontuacao}
          cor={cor}
        />
      )}
    </View>
  );
}

export default function SaudeFinanceira() {
  const {
    transacoes,
    carregado: transacoesCarregadas,
  } = useTransacoes();

  const {
    orcamentos,
    carregado: orcamentosCarregados,
  } = useOrcamentos();

  const {
    metas,
    carregado: metasCarregadas,
  } = useMetas();

  const carregando =
    !transacoesCarregadas ||
    !orcamentosCarregados ||
    !metasCarregadas;

  if (carregando) {
    return (
      <View style={estilos.carregando}>
        <ActivityIndicator
          size="large"
          color="#238B45"
        />

        <Text style={estilos.textoCarregando}>
          Analisando seus dados...
        </Text>
      </View>
    );
  }

  const dados = calcularSaudeFinanceira({
    transacoes,
    orcamentos,
    metas,
  });

  const hoje = new Date();

  const mesAtual = hoje.toLocaleDateString('pt-BR', {
    month: 'long',
    year: 'numeric',
  });

  const indicadores = [
    {
      titulo: 'Equilíbrio mensal',
      descricao: 'Relação entre receitas e despesas.',
      pontuacao: dados.componentes.find(
        (item) => item.nome === 'Equilíbrio mensal'
      )?.pontuacao ?? null,
      icone: 'scale-outline',
    },
    {
      titulo: 'Capacidade de economia',
      descricao: 'Quanto da renda sobrou após os gastos de consumo.',
      pontuacao: dados.componentes.find(
        (item) => item.nome === 'Capacidade de economia'
      )?.pontuacao ?? null,
      icone: 'wallet-outline',
    },
    {
      titulo: 'Controle de orçamentos',
      descricao: 'Respeito aos limites que você definiu.',
      pontuacao: dados.pontuacaoOrcamentos,
      icone: 'pie-chart-outline',
    },
    {
      titulo: 'Progresso das metas',
      descricao: 'Avanço médio dos seus objetivos.',
      pontuacao: dados.pontuacaoMetas,
      icone: 'flag-outline',
    },
    {
      titulo: 'Consistência',
      descricao: 'Meses com saldo igual ou superior a zero.',
      pontuacao: dados.pontuacaoConsistencia,
      icone: 'calendar-outline',
    },
  ];

  const historico = [
    ...dados.historicoMensal,
  ].reverse();

  const maiorMovimentacao = Math.max(
    ...historico.map((item) =>
      Math.max(item.receitas, item.despesas)
    ),
    1
  );

  return (
    <View style={estilos.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#FFFFFF"
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={estilos.conteudo}
      >
        {/* CABEÇALHO */}
        <View style={estilos.cabecalho}>
          <View>
            <Text style={estilos.subtitulo}>
              Acompanhe seus hábitos
            </Text>

            <Text style={estilos.titulo}>
              Saúde financeira
            </Text>
          </View>

          <View style={estilos.iconeCabecalho}>
            <Ionicons
              name="heart-outline"
              size={25}
              color="#238B45"
            />
          </View>
        </View>

        <Text style={estilos.periodo}>
          Análise de {mesAtual}
        </Text>

        {/* ÍNDICE GERAL */}
        <View
          style={[
            estilos.cartaoPontuacao,
            {
              borderColor: dados.corClassificacao,
            },
          ]}
        >
          <View style={estilos.cabecalhoPontuacao}>
            <View style={estilos.informacaoPontuacao}>
              <Text style={estilos.rotuloPontuacao}>
                Seu índice financeiro
              </Text>

              <Text
                style={[
                  estilos.classificacao,
                  {
                    color: dados.corClassificacao,
                  },
                ]}
              >
                {dados.classificacao}
              </Text>
            </View>

            <View
              style={[
                estilos.circuloPontuacao,
                {
                  borderColor: dados.corClassificacao,
                },
              ]}
            >
              <Text
                style={[
                  estilos.numeroPontuacao,
                  {
                    color: dados.corClassificacao,
                  },
                ]}
              >
                {dados.pontuacao !== null
                  ? dados.pontuacao
                  : '--'}
              </Text>

              <Text style={estilos.textoDe}>
                de 100
              </Text>
            </View>
          </View>

          <Text style={estilos.descricaoPontuacao}>
            {dados.descricaoClassificacao}
          </Text>

          {dados.pontuacao !== null && (
            <BarraProgresso
              percentual={dados.pontuacao}
              cor={dados.corClassificacao}
              altura={10}
            />
          )}

          <Text style={estilos.observacaoPontuacao}>
            {dados.pontuacao === null
              ? 'Ainda não há movimentações neste mês para calcular o índice.'
              : dados.indiceParcial
                ? `Índice parcial: ${dados.indicadoresDisponiveis} de 5 indicadores disponíveis.`
                : 'Índice interno baseado nos dados registrados no aplicativo.'}
          </Text>
        </View>

        {/* RESUMO DO MÊS */}
        <View style={estilos.secao}>
          <Text style={estilos.tituloSecao}>
            Resumo do mês
          </Text>

          <View style={estilos.gradeResumo}>
            <View style={estilos.cartaoResumo}>
              <View style={estilos.linhaResumo}>
                <Ionicons
                  name="arrow-down-circle-outline"
                  size={20}
                  color="#238B45"
                />

                <Text style={estilos.rotuloResumo}>
                  Receitas
                </Text>
              </View>

              <Text
                style={[
                  estilos.valorResumo,
                  { color: '#238B45' },
                ]}
                numberOfLines={1}
                adjustsFontSizeToFit
              >
                {formatarMoeda(dados.receitas)}
              </Text>
            </View>

            <View style={estilos.cartaoResumo}>
              <View style={estilos.linhaResumo}>
                <Ionicons
                  name="arrow-up-circle-outline"
                  size={20}
                  color="#D92344"
                />

                <Text style={estilos.rotuloResumo}>
                  Despesas
                </Text>
              </View>

              <Text
                style={[
                  estilos.valorResumo,
                  { color: '#D92344' },
                ]}
                numberOfLines={1}
                adjustsFontSizeToFit
              >
                {formatarMoeda(dados.despesas)}
              </Text>
            </View>
          </View>

          <View style={estilos.cartaoSaldo}>
            <View style={estilos.informacaoSaldo}>
              <Text style={estilos.rotuloSaldo}>
                Saldo do mês
              </Text>

              <Text style={estilos.descricaoSaldo}>
                Receitas menos despesas registradas
              </Text>
            </View>

            <Text
              style={[
                estilos.valorSaldo,
                {
                  color:
                    dados.saldo >= 0
                      ? '#238B45'
                      : '#D92344',
                },
              ]}
            >
              {formatarMoeda(dados.saldo)}
            </Text>
          </View>

          <View style={estilos.cartaoEconomia}>
            <View style={estilos.linhaEconomia}>
              <View style={estilos.informacaoEconomia}>
                <Text style={estilos.tituloEconomia}>
                  Capacidade de economia
                </Text>

                <Text style={estilos.descricaoEconomia}>
                  Receitas menos gastos de consumo
                </Text>
              </View>

              <Text
                style={[
                  estilos.valorEconomia,
                  {
                    color:
                      dados.valorEconomizado >= 0
                        ? '#238B45'
                        : '#D92344',
                  },
                ]}
              >
                {formatarPercentual(
                  dados.percentualEconomizado
                )}
              </Text>
            </View>

            <Text
              style={[
                estilos.valorEconomizado,
                {
                  color:
                    dados.valorEconomizado >= 0
                      ? '#238B45'
                      : '#D92344',
                },
              ]}
            >
              {formatarMoeda(dados.valorEconomizado)}
            </Text>
          </View>
        </View>

        {/* INDICADORES */}
        <View style={estilos.secao}>
          <Text style={estilos.tituloSecao}>
            Seus indicadores
          </Text>

          <Text style={estilos.descricaoSecao}>
            Veja como cada área contribui para sua avaliação.
          </Text>

          {indicadores.map((item) => (
            <CartaoIndicador
              key={item.titulo}
              titulo={item.titulo}
              descricao={item.descricao}
              pontuacao={item.pontuacao}
              icone={item.icone}
            />
          ))}
        </View>

        {/* ORÇAMENTOS */}
        <View style={estilos.secao}>
          <Text style={estilos.tituloSecao}>
            Controle de orçamentos
          </Text>

          {dados.analiseOrcamentos.length === 0 ? (
            <View style={estilos.cartaoVazio}>
              <Ionicons
                name="wallet-outline"
                size={27}
                color="#888888"
              />

              <Text style={estilos.textoVazio}>
                Você ainda não possui orçamentos cadastrados.
              </Text>
            </View>
          ) : (
            dados.analiseOrcamentos.map((item) => (
              <View
                key={item.id}
                style={estilos.cartaoDetalhe}
              >
                <View style={estilos.linhaDetalhe}>
                  <Text style={estilos.nomeDetalhe}>
                    {item.categoria}
                  </Text>

                  <Text
                    style={[
                      estilos.valorDetalhe,
                      {
                        color: item.ultrapassou
                          ? '#D92344'
                          : '#238B45',
                      },
                    ]}
                  >
                    {Math.round(item.percentual)}%
                  </Text>
                </View>

                <BarraProgresso
                  percentual={item.percentual}
                  cor={
                    item.ultrapassou
                      ? '#D92344'
                      : item.proximoDoLimite
                        ? '#D69A27'
                        : '#238B45'
                  }
                />

                <Text style={estilos.textoDetalhe}>
                  {formatarMoeda(item.gasto)} de{' '}
                  {formatarMoeda(item.limite)}
                </Text>

                {item.ultrapassou && (
                  <Text style={estilos.alertaDetalhe}>
                    Limite ultrapassado em{' '}
                    {formatarMoeda(
                      item.gasto - item.limite
                    )}
                  </Text>
                )}

                {item.proximoDoLimite && (
                  <Text style={estilos.avisoDetalhe}>
                    Você está próximo do limite.
                  </Text>
                )}
              </View>
            ))
          )}
        </View>

        {/* METAS */}
        <View style={estilos.secao}>
          <Text style={estilos.tituloSecao}>
            Progresso das metas
          </Text>

          {dados.analiseMetas.length === 0 ? (
            <View style={estilos.cartaoVazio}>
              <Ionicons
                name="flag-outline"
                size={27}
                color="#888888"
              />

              <Text style={estilos.textoVazio}>
                Você ainda não possui metas cadastradas.
              </Text>
            </View>
          ) : (
            dados.analiseMetas.map((item) => (
              <View
                key={item.id}
                style={estilos.cartaoDetalhe}
              >
                <View style={estilos.linhaDetalhe}>
                  <Text
                    style={estilos.nomeDetalhe}
                    numberOfLines={1}
                  >
                    {item.nome}
                  </Text>

                  <Text style={estilos.valorDetalhe}>
                    {Math.round(item.percentual)}%
                  </Text>
                </View>

                <BarraProgresso
                  percentual={item.percentual}
                  cor="#7950C7"
                />

                <Text style={estilos.textoDetalhe}>
                  {formatarMoeda(item.guardado)} de{' '}
                  {formatarMoeda(item.objetivo)}
                </Text>
              </View>
            ))
          )}
        </View>

        {/* HISTÓRICO */}
        <View style={estilos.secao}>
          <Text style={estilos.tituloSecao}>
            Consistência financeira
          </Text>

          <Text style={estilos.descricaoSecao}>
            Comparação dos últimos três meses.
          </Text>

          <View style={estilos.cartaoHistorico}>
            {historico.map((item) => (
              <View
                key={item.mes}
                style={estilos.itemHistorico}
              >
                <Text style={estilos.nomeMes}>
                  {obterNomeMes(item.mes)}
                </Text>

                <View style={estilos.barrasHistorico}>
                  <View style={estilos.linhaHistorico}>
                    <View
                      style={[
                        estilos.barraHistorico,
                        {
                          width: `${
                            (item.receitas / maiorMovimentacao) * 100
                          }%`,
                          backgroundColor: '#238B45',
                        },
                      ]}
                    />
                  </View>

                  <View style={estilos.linhaHistorico}>
                    <View
                      style={[
                        estilos.barraHistorico,
                        {
                          width: `${
                            (item.despesas / maiorMovimentacao) * 100
                          }%`,
                          backgroundColor: '#D92344',
                        },
                      ]}
                    />
                  </View>
                </View>

                <Text
                  style={[
                    estilos.saldoHistorico,
                    {
                      color:
                        item.saldo >= 0
                          ? '#238B45'
                          : '#D92344',
                    },
                  ]}
                >
                  {formatarMoeda(item.saldo)}
                </Text>
              </View>
            ))}

            <View style={estilos.legendaHistorico}>
              <View style={estilos.itemLegenda}>
                <View
                  style={[
                    estilos.pontoLegenda,
                    { backgroundColor: '#238B45' },
                  ]}
                />

                <Text style={estilos.textoLegenda}>
                  Receitas
                </Text>
              </View>

              <View style={estilos.itemLegenda}>
                <View
                  style={[
                    estilos.pontoLegenda,
                    { backgroundColor: '#D92344' },
                  ]}
                />

                <Text style={estilos.textoLegenda}>
                  Despesas
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* PONTOS POSITIVOS */}
        {dados.pontosPositivos.length > 0 && (
          <View style={estilos.secao}>
            <Text style={estilos.tituloSecao}>
              Pontos positivos
            </Text>

            <View style={estilos.cartaoPositivo}>
              {dados.pontosPositivos.map((item, index) => (
                <View
                  key={index}
                  style={estilos.linhaMensagem}
                >
                  <Ionicons
                    name="checkmark-circle"
                    size={21}
                    color="#238B45"
                  />

                  <Text style={estilos.textoMensagem}>
                    {item}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* RECOMENDAÇÕES */}
        <View style={estilos.secao}>
          <Text style={estilos.tituloSecao}>
            Pontos de atenção
          </Text>

          {dados.recomendacoes.length === 0 ? (
            <View style={estilos.cartaoPositivo}>
              <Text style={estilos.textoMensagem}>
                Nenhum alerta identificado com os dados disponíveis.
              </Text>
            </View>
          ) : (
            <View style={estilos.cartaoAtencao}>
              {dados.recomendacoes.map((item, index) => (
                <View
                  key={index}
                  style={estilos.linhaMensagem}
                >
                  <Ionicons
                    name="alert-circle-outline"
                    size={21}
                    color="#D69A27"
                  />

                  <Text style={estilos.textoMensagem}>
                    {item}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* AVISO */}
        <View style={estilos.avisoFinal}>
          <Ionicons
            name="information-circle-outline"
            size={20}
            color="#777777"
          />

          <Text style={estilos.textoAvisoFinal}>
            Esta análise considera somente as informações registradas
            no aplicativo. Ela não considera automaticamente dívidas,
            investimentos externos, patrimônio ou reserva financeira.
            O índice é uma referência interna para acompanhamento.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  conteudo: {
    padding: 20,
    paddingBottom: 35,
  },

  carregando: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },

  textoCarregando: {
    marginTop: 12,
    fontSize: 14,
    color: '#777777',
  },

  cabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  subtitulo: {
    fontSize: 13,
    color: '#777777',
  },

  titulo: {
    fontSize: 26,
    fontWeight: '700',
    color: '#252525',
    marginTop: 3,
  },

  iconeCabecalho: {
    width: 48,
    height: 48,
    borderRadius: 15,
    backgroundColor: '#EAF5ED',
    alignItems: 'center',
    justifyContent: 'center',
  },

  periodo: {
    fontSize: 13,
    color: '#777777',
    marginTop: 15,
    marginBottom: 17,
    textTransform: 'capitalize',
  },

  cartaoPontuacao: {
    padding: 19,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    marginBottom: 25,
  },

  cabecalhoPontuacao: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  informacaoPontuacao: {
    flex: 1,
    paddingRight: 10,
  },

  rotuloPontuacao: {
    fontSize: 14,
    color: '#666666',
  },

  classificacao: {
    fontSize: 25,
    fontWeight: '700',
    marginTop: 6,
  },

  circuloPontuacao: {
    width: 82,
    height: 82,
    borderRadius: 41,
    borderWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },

  numeroPontuacao: {
    fontSize: 25,
    fontWeight: '800',
  },

  textoDe: {
    fontSize: 10,
    color: '#777777',
  },

  descricaoPontuacao: {
    fontSize: 13,
    lineHeight: 19,
    color: '#555555',
    marginTop: 15,
    marginBottom: 15,
  },

  observacaoPontuacao: {
    fontSize: 11,
    lineHeight: 16,
    color: '#888888',
    marginTop: 11,
  },

  secao: {
    marginBottom: 26,
  },

  tituloSecao: {
    fontSize: 18,
    fontWeight: '700',
    color: '#252525',
    marginBottom: 13,
  },

  descricaoSecao: {
    fontSize: 13,
    color: '#777777',
    marginTop: -7,
    marginBottom: 14,
    lineHeight: 19,
  },

  gradeResumo: {
    flexDirection: 'row',
    gap: 12,
  },

  cartaoResumo: {
    flex: 1,
    padding: 14,
    borderRadius: 14,
    backgroundColor: '#F7F8F7',
  },

  linhaResumo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },

  rotuloResumo: {
    fontSize: 12,
    color: '#777777',
  },

  valorResumo: {
    fontSize: 17,
    fontWeight: '700',
    marginTop: 12,
  },

  cartaoSaldo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    marginTop: 12,
    borderRadius: 14,
    backgroundColor: '#F7F8F7',
  },

  informacaoSaldo: {
    flex: 1,
    paddingRight: 8,
  },

  rotuloSaldo: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333333',
  },

  descricaoSaldo: {
    fontSize: 11,
    color: '#888888',
    marginTop: 4,
  },

  valorSaldo: {
    fontSize: 16,
    fontWeight: '700',
  },

  cartaoEconomia: {
    padding: 16,
    borderRadius: 14,
    backgroundColor: '#F0F7F1',
    marginTop: 12,
  },

  linhaEconomia: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  informacaoEconomia: {
    flex: 1,
    paddingRight: 8,
  },

  tituloEconomia: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333333',
  },

  descricaoEconomia: {
    fontSize: 11,
    color: '#777777',
    marginTop: 4,
  },

  valorEconomia: {
    fontSize: 17,
    fontWeight: '700',
  },

  valorEconomizado: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 13,
  },

  cartaoIndicador: {
    padding: 15,
    borderRadius: 14,
    backgroundColor: '#F7F8F7',
    marginBottom: 10,
  },

  linhaIndicador: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  iconeIndicador: {
    width: 39,
    height: 39,
    borderRadius: 12,
    backgroundColor: '#EAECEA',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },

  informacaoIndicador: {
    flex: 1,
    paddingRight: 7,
  },

  tituloIndicador: {
    fontSize: 13,
    fontWeight: '700',
    color: '#333333',
  },

  descricaoIndicador: {
    fontSize: 11,
    color: '#888888',
    marginTop: 4,
  },

  valorIndicador: {
    fontSize: 14,
    fontWeight: '700',
  },

  fundoBarra: {
    width: '100%',
    backgroundColor: '#E7E9E7',
    borderRadius: 10,
    overflow: 'hidden',
  },

  barra: {
    borderRadius: 10,
  },

  cartaoDetalhe: {
    padding: 15,
    borderRadius: 14,
    backgroundColor: '#F7F8F7',
    marginBottom: 10,
  },

  linhaDetalhe: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 11,
  },

  nomeDetalhe: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    marginRight: 10,
  },

  valorDetalhe: {
    fontSize: 13,
    fontWeight: '700',
    color: '#238B45',
  },

  textoDetalhe: {
    fontSize: 12,
    color: '#777777',
    marginTop: 9,
  },

  alertaDetalhe: {
    fontSize: 12,
    color: '#D92344',
    marginTop: 7,
    fontWeight: '600',
  },

  avisoDetalhe: {
    fontSize: 12,
    color: '#B17B16',
    marginTop: 7,
    fontWeight: '600',
  },

  cartaoVazio: {
    padding: 22,
    borderRadius: 14,
    backgroundColor: '#F7F8F7',
    alignItems: 'center',
    gap: 9,
  },

  textoVazio: {
    fontSize: 13,
    color: '#777777',
    textAlign: 'center',
    lineHeight: 19,
  },

  cartaoHistorico: {
    padding: 15,
    borderRadius: 14,
    backgroundColor: '#F7F8F7',
  },

  itemHistorico: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
    gap: 10,
  },

  nomeMes: {
    width: 75,
    fontSize: 12,
    fontWeight: '600',
    color: '#555555',
    textTransform: 'capitalize',
  },

  barrasHistorico: {
    flex: 1,
    gap: 5,
  },

  linhaHistorico: {
    width: '100%',
    height: 7,
    borderRadius: 8,
    backgroundColor: '#E6E8E6',
    overflow: 'hidden',
  },

  barraHistorico: {
    height: 7,
    borderRadius: 8,
  },

  saldoHistorico: {
    width: 88,
    textAlign: 'right',
    fontSize: 11,
    fontWeight: '700',
  },

  legendaHistorico: {
    flexDirection: 'row',
    gap: 18,
    borderTopWidth: 1,
    borderTopColor: '#E8E8E8',
    paddingTop: 13,
  },

  itemLegenda: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  pontoLegenda: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },

  textoLegenda: {
    fontSize: 11,
    color: '#777777',
  },

  cartaoPositivo: {
    padding: 15,
    borderRadius: 14,
    backgroundColor: '#F0F7F1',
    gap: 13,
  },

  cartaoAtencao: {
    padding: 15,
    borderRadius: 14,
    backgroundColor: '#FFF8EA',
    gap: 13,
  },

  linhaMensagem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 9,
  },

  textoMensagem: {
    flex: 1,
    fontSize: 13,
    lineHeight: 19,
    color: '#555555',
  },

  avisoFinal: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 9,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },

  textoAvisoFinal: {
    flex: 1,
    fontSize: 11,
    lineHeight: 17,
    color: '#888888',
  },
});