import React, { useMemo } from 'react';

import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';

import { useTransacoes } from '../../contexts/TransacoesContext';
import { useOrcamentos } from '../../contexts/OrcamentosContext';

import {
  calcularSaude,
  chaveMes,
  deslocarMes,
  historicoDePontuacao,
  nomeMes,
  statusDaNota,
} from '../../utils/saudeFinanceira';

import { montarTextos } from '../../utils/saudeFinanceiraTextos';

import estilos from '../../styles/saudeFinanceiraStyles';

function formatarNumero(valor, casas = 1) {
  return Number(valor).toFixed(casas).replace('.', ',');
}

export default function SaudeFinanceiraDetalhes() {
  const { transacoes } = useTransacoes();
  const { orcamentos } = useOrcamentos();
  const parametros = useLocalSearchParams();

  const mes = parametros.mes || chaveMes(new Date());

  const resultado = useMemo(
    () => calcularSaude({ transacoes, orcamentos, mes }),
    [transacoes, orcamentos, mes]
  );

  const anterior = useMemo(
    () => calcularSaude({ transacoes, orcamentos, mes: deslocarMes(mes, -1) }),
    [transacoes, orcamentos, mes]
  );

  const historico = useMemo(
    () => historicoDePontuacao({ transacoes, orcamentos, mes, quantidade: 4 }),
    [transacoes, orcamentos, mes]
  );

  const textos = montarTextos(resultado, anterior);

  function Cabecalho() {
    return (
      <View style={estilos.cabecalho}>
        <TouchableOpacity
          style={estilos.botaoVoltar}
          onPress={() => router.back()}
          accessibilityLabel="Voltar"
        >
          <Ionicons name="arrow-back" size={22} color="#252525" />
        </TouchableOpacity>

        <View style={estilos.cabecalhoTexto}>
          <Text style={estilos.titulo}>Detalhes da pontuação</Text>
          <Text style={estilos.subtitulo}>{nomeMes(mes)}</Text>
        </View>
      </View>
    );
  }

  if (!resultado.temDados) {
    return (
      <View style={estilos.container}>
        <ScrollView contentContainerStyle={estilos.conteudo}>
          {Cabecalho()}

          <View style={estilos.cartao}>
            <Text style={estilos.textoVazio}>
              Não há lançamentos em {nomeMes(mes)} para detalhar.
            </Text>
          </View>
        </ScrollView>

        <View style={estilos.rodape}>
          <TouchableOpacity
            style={estilos.botaoPrincipal}
            onPress={() => router.back()}
          >
            <Text style={estilos.textoBotaoPrincipal}>Voltar ao diagnóstico</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const notasValidas = historico
    .map((item) => item.nota)
    .filter((nota) => nota !== null);

  const maiorNota = Math.max(...notasValidas, 1);
  const ALTURA_MAXIMA = 80;

  const dimensoesComDados = resultado.dimensoes.filter((item) => !item.semDados);
  const dimensoesSemDados = resultado.dimensoes.filter((item) => item.semDados);

  return (
    <View style={estilos.container}>
      <ScrollView
        contentContainerStyle={estilos.conteudo}
        showsVerticalScrollIndicator={false}
      >
        {Cabecalho()}

        <View
          style={[
            estilos.cartaoPontuacao,
            {
              backgroundColor: resultado.status.fundo,
              alignItems: 'flex-start',
            },
          ]}
        >
          <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
            <Text
              style={[estilos.notaGrande, { color: resultado.status.texto }]}
            >
              {resultado.nota}
            </Text>

            <Text style={[estilos.notaDe, { marginBottom: 8, marginLeft: 4 }]}>
              /100
            </Text>
          </View>

          <Text
            style={[
              estilos.rotuloStatus,
              { fontSize: 17, marginTop: 6, color: resultado.status.texto },
            ]}
          >
            {resultado.status.rotulo}
          </Text>
        </View>

        <View style={estilos.cartao}>
          <Text style={estilos.tituloCartao}>
            Como chegamos a {resultado.nota}
          </Text>

          <Text style={estilos.subtituloCartao}>
            Nota × peso de cada dimensão (pesos iniciais, ainda em validação)
          </Text>

          {dimensoesComDados.map((item) => (
            <View key={item.chave} style={estilos.linhaTabela}>
              <Text style={estilos.textoTabela}>{item.titulo}</Text>

              <Text
                style={[
                  estilos.valorTabela,
                  item.nota < 40 && { color: '#D92344', fontWeight: '800' },
                ]}
              >
                {item.nota} × {Math.round(item.peso * 100)}% ={' '}
                {formatarNumero(item.pontos)}
              </Text>
            </View>
          ))}

          <View style={estilos.linhaTabela}>
            <Text style={estilos.textoTotal}>Total</Text>

            <Text
              style={[
                estilos.textoTotal,
                { color: resultado.status.texto },
              ]}
            >
              {formatarNumero(resultado.totalExato)} → {resultado.nota}
            </Text>
          </View>

          {dimensoesSemDados.length > 0 && (
            <Text style={[estilos.aviso, { marginTop: 8, marginBottom: 0 }]}>
              Sem dados neste mês (peso redistribuído):{' '}
              {dimensoesSemDados.map((item) => item.titulo).join(', ')}.
            </Text>
          )}
        </View>

        {textos.positivos.length > 0 && (
          <View style={estilos.cartao}>
            <Text style={estilos.tituloPositivo}>Pontos positivos</Text>

            {textos.positivos.map((texto) => (
              <Text key={texto} style={estilos.itemTexto}>
                {texto}
              </Text>
            ))}
          </View>
        )}

        {textos.atencao.length > 0 && (
          <View style={estilos.cartao}>
            <Text style={estilos.tituloAtencao}>Pontos de atenção</Text>

            {textos.atencao.map((texto) => (
              <Text key={texto} style={estilos.itemTexto}>
                {texto}
              </Text>
            ))}
          </View>
        )}

        {textos.recomendacoes.length > 0 && (
          <View style={estilos.cartao}>
            <Text style={estilos.tituloCartao}>Recomendações práticas</Text>

            {textos.recomendacoes.map((item, indice) => (
              <View key={item.titulo} style={estilos.itemRecomendacao}>
                <Text style={estilos.tituloRecomendacao}>
                  {indice + 1}. {item.titulo}
                </Text>

                <Text style={estilos.detalheRecomendacao}>{item.detalhe}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={estilos.cartao}>
          <Text style={estilos.tituloCartao}>Evolução da pontuação</Text>

          <View style={estilos.graficoBarras}>
            {historico.map((item, indice) => {
              const ultimo = indice === historico.length - 1;
              const altura =
                item.nota === null
                  ? 4
                  : Math.max(6, (item.nota / maiorNota) * ALTURA_MAXIMA);

              const status = item.nota === null ? null : statusDaNota(item.nota);

              return (
                <View key={item.mes} style={estilos.colunaBarra}>
                  <Text style={estilos.valorBarra}>
                    {item.nota === null ? '–' : item.nota}
                  </Text>

                  <View
                    style={[
                      estilos.barraHistorico,
                      {
                        height: altura,
                        backgroundColor:
                          status === null
                            ? '#E6E6E6'
                            : ultimo
                            ? status.cor
                            : status.fundo,
                        borderWidth: status !== null && !ultimo ? 1 : 0,
                        borderColor: status ? status.cor : 'transparent',
                      },
                    ]}
                  />

                  <Text style={estilos.nomeBarra}>{item.nome}</Text>
                </View>
              );
            })}
          </View>
        </View>

        <Text style={estilos.aviso}>
          Orientação educativa, não substitui aconselhamento profissional.
        </Text>
      </ScrollView>

      <View style={estilos.rodape}>
        <TouchableOpacity
          style={estilos.botaoPrincipal}
          activeOpacity={0.85}
          onPress={() => router.back()}
        >
          <Text style={estilos.textoBotaoPrincipal}>Voltar ao diagnóstico</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
