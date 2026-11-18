
import React from 'react';

import {
  View,
  Text,
  ScrollView,
  StatusBar,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { useTransacoes } from '../../contexts/TransacoesContext';
import { useOrcamentos } from '../../contexts/OrcamentosContext';

import { calcularSaudeFinanceira } from '../../features/saude-financeira/calculos';

import estilos from '../../features/saude-financeira/styles';

export default function SaudeFinanceira() {
  const { transacoes = [] } = useTransacoes();
  const { orcamentos = [] } = useOrcamentos();

  // ANÁLISE FINANCEIRA

  const resultado = calcularSaudeFinanceira({
    transacoes,
    orcamentos,
  });

  const {
    pontuacao,
    analiseParcial,
    dimensoes,
    resumo,
    pontosPositivos,
    alertas,
    recomendacoes,
  } = resultado;

  // FORMATAÇÃO DE MOEDA

  function formatarMoeda(valor) {
    return Number(valor || 0).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  }

  // FORMATAÇÃO DO PERÍODO

  const nomeMes = new Date(
    resultado.periodo.ano,
    resultado.periodo.mes - 1,
    1
  ).toLocaleDateString('pt-BR', {
    month: 'long',
    year: 'numeric',
  });

  // CLASSIFICAÇÃO DA PONTUAÇÃO

  function obterDescricaoPontuacao(valor) {
    if (valor === null) {
      return 'Dados insuficientes para calcular sua pontuação.';
    }

    if (valor >= 80) {
      return 'Sua saúde financeira apresenta bons indicadores.';
    }

    if (valor >= 60) {
      return 'Sua situação financeira merece alguns cuidados.';
    }

    if (valor >= 40) {
      return 'Existem pontos importantes que precisam de atenção.';
    }

    return 'É hora de revisar sua organização financeira.';
  }

  // DIMENSÕES

  const listaDimensoes = [
    {
      chave: 'controleGastos',
      nome: 'Controle de gastos',
      icone: 'wallet-outline',
    },
    {
      chave: 'capacidadePoupanca',
      nome: 'Capacidade de poupança',
      icone: 'trending-up-outline',
    },
    {
      chave: 'organizacao',
      nome: 'Organização financeira',
      icone: 'grid-outline',
    },
  ];

  // COMPONENTE DE INFORMAÇÃO

  function renderizarInformacoes(lista, tipo) {
    const configuracoes = {
      positivo: {
        icone: 'checkmark-circle-outline',
        estilo: estilos.iconePositivo,
      },
      alerta: {
        icone: 'alert-circle-outline',
        estilo: estilos.iconeAlerta,
      },
      recomendacao: {
        icone: 'bulb-outline',
        estilo: estilos.iconeRecomendacao,
      },
    };

    const configuracao = configuracoes[tipo];

    if (!lista || lista.length === 0) {
      return (
        <Text style={estilos.mensagemVazia}>
          Nenhuma informação disponível neste momento.
        </Text>
      );
    }

    return lista.map((item, indice) => (
      <View
        key={`${tipo}-${indice}`}
        style={estilos.cartaoInformacao}
      >
        <View style={estilos.linhaInformacao}>
          <View
            style={[
              estilos.iconeInformacao,
              configuracao.estilo,
            ]}
          >
            <Ionicons
              name={configuracao.icone}
              size={20}
              color={
                tipo === 'positivo'
                  ? '#238B45'
                  : tipo === 'alerta'
                    ? '#D58A19'
                    : '#D92344'
              }
            />
          </View>

          <Text style={estilos.textoInformacao}>
            {item}
          </Text>
        </View>
      </View>
    ));
  }

  // TELA

  return (
    <View style={estilos.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#F7F8FA"
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={estilos.conteudo}
      >

        {/* CABEÇALHO */}

        <View style={estilos.cabecalho}>
          <Text style={estilos.titulo}>
            Saúde Financeira
          </Text>

          <Text style={estilos.subtitulo}>
            Acompanhe sua situação financeira e descubra
            como melhorar sua relação com o dinheiro.
          </Text>

          <Text style={estilos.subtitulo}>
            Período analisado: {nomeMes}
          </Text>
        </View>

        {/* PONTUAÇÃO GERAL */}

        <View style={estilos.cartaoPontuacao}>
          <Text style={estilos.rotuloPontuacao}>
            Sua pontuação financeira
          </Text>

          <View style={estilos.linhaPontuacao}>
            <Text style={estilos.valorPontuacao}>
              {pontuacao !== null ? pontuacao : '--'}
            </Text>

            <Text style={estilos.pontuacaoMaxima}>
              / 100
            </Text>
          </View>

          <Text style={estilos.descricaoPontuacao}>
            {obterDescricaoPontuacao(pontuacao)}
          </Text>

          {pontuacao !== null && (
            <View style={estilos.barraFundo}>
              <View
                style={[
                  estilos.barraProgresso,
                  {
                    width: `${pontuacao}%`,
                  },
                ]}
              />
            </View>
          )}

          {analiseParcial && (
            <View style={estilos.avisoAnaliseParcial}>
              <Text style={estilos.textoAvisoAnaliseParcial}>
                Sua análise está parcial. Algumas dimensões
                ainda não possuem dados suficientes para
                receber uma avaliação.
              </Text>
            </View>
          )}
        </View>

        {/* DIMENSÕES FINANCEIRAS */}

        <View style={estilos.secao}>
          <Text style={estilos.tituloSecao}>
            Dimensões financeiras
          </Text>

          <Text style={estilos.descricaoSecao}>
            Veja como estão os principais aspectos da
            sua vida financeira.
          </Text>

          {listaDimensoes.map((item) => {
            const dimensao = dimensoes[item.chave];

            return (
              <View
                key={item.chave}
                style={estilos.cartaoDimensao}
              >
                <View style={estilos.linhaDimensao}>
                  <Text style={estilos.nomeDimensao}>
                    {item.nome}
                  </Text>

                  <Text style={estilos.valorDimensao}>
                    {dimensao
                      ? `${dimensao.pontuacao}/100`
                      : '--'}
                  </Text>
                </View>

                {dimensao ? (
                  <View style={estilos.barraDimensaoFundo}>
                    <View
                      style={[
                        estilos.barraDimensao,
                        {
                          width: `${dimensao.pontuacao}%`,
                        },
                      ]}
                    />
                  </View>
                ) : (
                  <Text style={estilos.textoDimensaoIndisponivel}>
                    Dados insuficientes para avaliação.
                  </Text>
                )}
              </View>
            );
          })}
        </View>

        {/* RESUMO FINANCEIRO */}

        <View style={estilos.secao}>
          <Text style={estilos.tituloSecao}>
            Resumo financeiro
          </Text>

          <Text style={estilos.descricaoSecao}>
            Movimentações realizadas no mês analisado.
          </Text>

          <View style={estilos.resumoContainer}>
            <View style={estilos.cartaoResumo}>
              <Text style={estilos.rotuloResumo}>
                Receitas
              </Text>

              <Text
                style={[
                  estilos.valorResumo,
                  estilos.valorReceita,
                ]}
                adjustsFontSizeToFit
                numberOfLines={1}
              >
                {formatarMoeda(resumo.receitas)}
              </Text>
            </View>

            <View style={estilos.cartaoResumo}>
              <Text style={estilos.rotuloResumo}>
                Despesas de consumo
              </Text>

              <Text
                style={[
                  estilos.valorResumo,
                  estilos.valorDespesa,
                ]}
                adjustsFontSizeToFit
                numberOfLines={1}
              >
                {formatarMoeda(resumo.despesas)}
              </Text>
            </View>
          </View>

          <View
            style={[
              estilos.cartaoResumo,
              { marginTop: 12 },
            ]}
          >
            <Text style={estilos.rotuloResumo}>
              Aportes realizados nas metas
            </Text>

            <Text
              style={[
                estilos.valorResumo,
                estilos.valorAporte,
              ]}
            >
              {formatarMoeda(resumo.aportes)}
            </Text>
          </View>
        </View>

        {/* PONTOS POSITIVOS */}

        <View style={estilos.secao}>
          <Text style={estilos.tituloSecao}>
            Pontos positivos
          </Text>

          <Text style={estilos.descricaoSecao}>
            Aspectos favoráveis identificados na análise.
          </Text>

          {renderizarInformacoes(
            pontosPositivos,
            'positivo'
          )}
        </View>

        {/* PONTOS DE ATENÇÃO */}

        <View style={estilos.secao}>
          <Text style={estilos.tituloSecao}>
            Pontos de atenção
          </Text>

          <Text style={estilos.descricaoSecao}>
            Aspectos que merecem acompanhamento.
          </Text>

          {renderizarInformacoes(
            alertas,
            'alerta'
          )}
        </View>

        {/* RECOMENDAÇÕES */}

        <View style={estilos.secao}>
          <Text style={estilos.tituloSecao}>
            Recomendações
          </Text>

          <Text style={estilos.descricaoSecao}>
            Sugestões para melhorar sua organização financeira.
          </Text>

          {renderizarInformacoes(
            recomendacoes,
            'recomendacao'
          )}
        </View>

        {/* HISTÓRICO */}

        <View style={estilos.secao}>
          <Text style={estilos.tituloSecao}>
            Histórico da pontuação
          </Text>

          <Text style={estilos.descricaoSecao}>
            A evolução mensal será apresentada conforme
            as avaliações forem sendo registradas.
          </Text>

          <View style={estilos.cartaoHistorico}>
            <Text style={estilos.mensagemVazia}>
              Ainda não existe histórico de pontuações.
              Sua evolução começará a ser registrada
              nas próximas avaliações.
            </Text>
          </View>
        </View>

      </ScrollView>
    </View>
  );
}
