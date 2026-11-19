import React, { useEffect, useMemo, useState } from 'react';

import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import { useTransacoes } from '../../contexts/TransacoesContext';
import { useOrcamentos } from '../../contexts/OrcamentosContext';

import GraficoPontuacao from '../../components/GraficoPontuacao';

import {
  calcularSaude,
  chaveMes,
  deslocarMes,
  mesesComDados,
  nomeMes,
  statusDaNota,
} from '../../utils/saudeFinanceira';

import {
  descricaoDimensao,
  mensagemDaNota,
  montarTextos,
} from '../../utils/saudeFinanceiraTextos';

import estilos from '../../styles/saudeFinanceiraStyles';

export default function SaudeFinanceira() {
  const { transacoes } = useTransacoes();
  const { orcamentos } = useOrcamentos();

  const mesAtual = chaveMes(new Date());
  const meses = useMemo(() => mesesComDados(transacoes), [transacoes]);

  // Começa no mês atual; se ele não tiver lançamentos, no último mês com dados.
  const [mes, setMes] = useState(() =>
    meses.includes(mesAtual) ? mesAtual : meses[meses.length - 1] || mesAtual
  );

  // Os dados são carregados do armazenamento após a primeira renderização.
  // Se o mês atual estiver vazio, seleciona o mês mais recente com lançamentos.
  useEffect(() => {
    if (meses.length > 0 && mes === mesAtual && !meses.includes(mesAtual)) {
      setMes(meses[meses.length - 1]);
    }
  }, [meses, mes, mesAtual]);

  const resultado = useMemo(
    () => calcularSaude({ transacoes, orcamentos, mes }),
    [transacoes, orcamentos, mes]
  );

  const anterior = useMemo(
    () => calcularSaude({ transacoes, orcamentos, mes: deslocarMes(mes, -1) }),
    [transacoes, orcamentos, mes]
  );

  const podeVoltar = meses.length > 0 && mes > meses[0];
  const podeAvancar = mes < mesAtual;

  const diferenca =
    resultado.temDados && anterior.temDados
      ? resultado.nota - anterior.nota
      : null;

  function abrirDetalhes() {
    router.push({
      pathname: '/saude-financeira-detalhes',
      params: { mes },
    });
  }

  function textoVariacao() {
    if (diferenca === null) return 'Sem pontuação do mês anterior para comparar';

    const nomeAnterior = nomeMes(deslocarMes(mes, -1), true);

    if (diferenca === 0) return `Mesma pontuação de ${nomeAnterior}`;

    const sinal = diferenca > 0 ? '+' : '';

    return `${sinal}${diferenca} ponto${Math.abs(diferenca) === 1 ? '' : 's'} em relação a ${nomeAnterior}`;
  }

  function corDaDimensao(nota) {
    return statusDaNota(nota).cor;
  }

  const textos = montarTextos(resultado, anterior);

  return (
    <View style={estilos.container}>
      <ScrollView
        contentContainerStyle={estilos.conteudo}
        showsVerticalScrollIndicator={false}
      >
        <View style={estilos.cabecalho}>
          <TouchableOpacity
            style={estilos.botaoVoltar}
            onPress={() => router.back()}
            accessibilityLabel="Voltar"
          >
            <Ionicons name="arrow-back" size={22} color="#252525" />
          </TouchableOpacity>

          <View style={estilos.cabecalhoTexto}>
            <Text style={estilos.titulo}>Saúde financeira</Text>
            <Text style={estilos.subtitulo}>
              Veja como estão suas finanças
            </Text>
          </View>
        </View>

        <View style={estilos.seletorMes}>
          <TouchableOpacity
            style={estilos.botaoMes}
            disabled={!podeVoltar}
            onPress={() => setMes(deslocarMes(mes, -1))}
            accessibilityLabel="Mês anterior"
          >
            <Ionicons
              name="chevron-back"
              size={20}
              color={podeVoltar ? '#252525' : '#CCCCCC'}
            />
          </TouchableOpacity>

          <Text style={estilos.textoMes}>{nomeMes(mes)}</Text>

          <TouchableOpacity
            style={estilos.botaoMes}
            disabled={!podeAvancar}
            onPress={() => setMes(deslocarMes(mes, 1))}
            accessibilityLabel="Próximo mês"
          >
            <Ionicons
              name="chevron-forward"
              size={20}
              color={podeAvancar ? '#252525' : '#CCCCCC'}
            />
          </TouchableOpacity>
        </View>

        {!resultado.temDados ? (
          <View style={estilos.cartao}>
            <View style={estilos.vazio}>
              <Ionicons name="heart-outline" size={42} color="#D92344" />

              <Text style={estilos.textoVazio}>
                Não há lançamentos em {nomeMes(mes)}.{'\n'}
                Registre receitas e despesas para ver sua pontuação.
              </Text>
            </View>
          </View>
        ) : (
          <>
            <View
              style={[
                estilos.cartaoPontuacao,
                { backgroundColor: resultado.status.fundo },
              ]}
            >
              <GraficoPontuacao
                nota={resultado.nota}
                cor={resultado.status.cor}
                tamanho={180}
              >
                <Text
                  style={[
                    estilos.notaGrande,
                    { color: resultado.status.texto },
                  ]}
                >
                  {resultado.nota}
                </Text>

                <Text style={estilos.notaDe}>de 100</Text>
              </GraficoPontuacao>

              <Text
                style={[
                  estilos.rotuloStatus,
                  { color: resultado.status.texto },
                ]}
              >
                {resultado.status.rotulo}
              </Text>

              <Text style={estilos.mensagemStatus}>
                {mensagemDaNota(resultado.nota, diferenca)}
              </Text>

              <Text style={estilos.variacao}>{textoVariacao()}</Text>
            </View>

            <View style={estilos.cartao}>
              <Text style={estilos.tituloCartao}>Diagnóstico por dimensão</Text>

              {resultado.dimensoes.map((item) => (
                <View key={item.chave} style={estilos.linhaDimensao}>
                  <View style={estilos.topoDimensao}>
                    <Text style={estilos.nomeDimensao}>{item.titulo}</Text>

                    <Text
                      style={[
                        estilos.notaDimensao,
                        {
                          color: item.semDados
                            ? '#999999'
                            : statusDaNota(item.nota).texto,
                        },
                      ]}
                    >
                      {item.semDados ? 'Sem dados' : `${item.nota}/100`}
                    </Text>
                  </View>

                  <View style={estilos.trilhaBarra}>
                    {!item.semDados && (
                      <View
                        style={[
                          estilos.barra,
                          {
                            width: `${item.nota}%`,
                            backgroundColor: corDaDimensao(item.nota),
                          },
                        ]}
                      />
                    )}
                  </View>

                  <Text style={estilos.descricaoDimensao}>
                    {descricaoDimensao(item)}
                  </Text>
                </View>
              ))}
            </View>

            <View style={estilos.cartao}>
              <Text style={estilos.tituloCartao}>Como melhorar</Text>

              {textos.positivos[0] && (
                <Text style={estilos.itemTexto}>
                  <Text style={{ color: '#238B45', fontWeight: '800' }}>
                    Bom:{' '}
                  </Text>
                  {textos.positivos[0]}
                </Text>
              )}

              {textos.atencao[0] && (
                <Text style={estilos.itemTexto}>
                  <Text style={{ color: '#D92344', fontWeight: '800' }}>
                    Atenção:{' '}
                  </Text>
                  {textos.atencao[0]}
                </Text>
              )}

              {textos.recomendacoes[0] && (
                <Text style={estilos.itemTexto}>
                  <Text style={{ fontWeight: '800' }}>Sugestão: </Text>
                  {textos.recomendacoes[0].titulo}.{' '}
                  {textos.recomendacoes[0].detalhe}
                </Text>
              )}

              <Text style={estilos.aviso}>
                Orientação educativa, não substitui aconselhamento profissional.
              </Text>
            </View>
          </>
        )}
      </ScrollView>

      <View style={estilos.rodape}>
        {resultado.temDados ? (
          <TouchableOpacity
            style={estilos.botaoPrincipal}
            activeOpacity={0.85}
            onPress={abrirDetalhes}
          >
            <Text style={estilos.textoBotaoPrincipal}>Ver recomendações</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={estilos.botaoPrincipal}
            activeOpacity={0.85}
            onPress={() => router.push('/nova-transacao')}
          >
            <Text style={estilos.textoBotaoPrincipal}>Nova transação</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
