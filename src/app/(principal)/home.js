import React, { useState } from 'react';

import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function Home() {
  const [saldoVisivel, setSaldoVisivel] = useState(true);

  // Dados fictícios para desenvolver a interface.
  // Posteriormente, eles virão do backend.

  const saldoTotal = 4250.75;
  const receitas = 5200.00;
  const despesas = 1849.25;

  const transacoes = [
    {
      id: '1',
      titulo: 'Supermercado',
      categoria: 'Alimentação',
      data: 'Hoje, 10:30',
      valor: -245.80,
      icone: 'cart-outline',
      cor: '#FCE8E6',
      corIcone: '#D92344',
    },
    {
      id: '2',
      titulo: 'Salário',
      categoria: 'Renda',
      data: 'Hoje, 08:00',
      valor: 3500.00,
      icone: 'wallet-outline',
      cor: '#E4F5E9',
      corIcone: '#238B45',
    },
    {
      id: '3',
      titulo: 'Academia',
      categoria: 'Saúde',
      data: 'Ontem, 16:45',
      valor: -89.90,
      icone: 'fitness-outline',
      cor: '#F0E9FF',
      corIcone: '#7950C7',
    },
    {
      id: '4',
      titulo: 'Conta de internet',
      categoria: 'Moradia',
      data: 'Ontem, 09:15',
      valor: -99.90,
      icone: 'wifi-outline',
      cor: '#E7F0FF',
      corIcone: '#3574C8',
    },
  ];

  function formatarMoeda(valor) {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  }

  function navegarParaTransacoes() {
    router.navigate('/transacoes');
  }

  function navegarParaCategorias() {
    router.navigate('/categorias');
  }

  function renderizarTransacao(transacao) {
    const entrada = transacao.valor > 0;

    return (
      <View key={transacao.id} style={estilos.transacao}>
        <View
          style={[
            estilos.iconeTransacao,
            { backgroundColor: transacao.cor },
          ]}
        >
          <Ionicons
            name={transacao.icone}
            size={22}
            color={transacao.corIcone}
          />
        </View>

        <View style={estilos.detalhesTransacao}>
          <Text style={estilos.tituloTransacao}>
            {transacao.titulo}
          </Text>

          <Text style={estilos.categoriaTransacao}>
            {transacao.categoria} • {transacao.data}
          </Text>
        </View>

        <Text
          style={[
            estilos.valorTransacao,
            entrada
              ? estilos.valorEntrada
              : estilos.valorSaida,
          ]}
        >
          {entrada ? '+' : '-'}
          {formatarMoeda(Math.abs(transacao.valor))}
        </Text>
      </View>
    );
  }

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
            <Text style={estilos.saudacao}>
              Olá, seja bem-vindo!
            </Text>

            <Text style={estilos.nomeAplicativo}>
              Meu Financeiro
            </Text>
          </View>

          <TouchableOpacity
            style={estilos.botaoNotificacao}
            activeOpacity={0.7}
            onPress={() => {}}
            accessibilityLabel="Notificações"
          >
            <Ionicons
              name="notifications-outline"
              size={24}
              color="#333333"
            />

            <View style={estilos.indicadorNotificacao} />
          </TouchableOpacity>
        </View>

        {/* CARTÃO DE SALDO */}

        <View style={estilos.cartaoSaldo}>
          <View style={estilos.linhaSaldo}>
            <Text style={estilos.rotuloSaldo}>
              Saldo disponível
            </Text>

            <TouchableOpacity
              onPress={() => setSaldoVisivel(!saldoVisivel)}
              accessibilityRole="button"
              accessibilityLabel={
                saldoVisivel
                  ? 'Ocultar saldo'
                  : 'Mostrar saldo'
              }
            >
              <Ionicons
                name={
                  saldoVisivel
                    ? 'eye-outline'
                    : 'eye-off-outline'
                }
                size={22}
                color="#FFFFFF"
              />
            </TouchableOpacity>
          </View>

          <Text style={estilos.valorSaldo}>
            {saldoVisivel
              ? formatarMoeda(saldoTotal)
              : 'R$ ••••••'}
          </Text>

          <View style={estilos.divisorSaldo} />

          <View style={estilos.rodapeSaldo}>
            <View>
              <Text style={estilos.rotuloCartao}>
                <Ionicons
                  name="trending-up-outline"
                  size={14}
                  color="#FFFFFF"
                />{' '}
                Visão geral
              </Text>

              <Text style={estilos.textoCartao}>
                Seu dinheiro em um só lugar
              </Text>
            </View>

            <View style={estilos.iconeCarteira}>
              <Ionicons
                name="wallet-outline"
                size={28}
                color="#FFFFFF"
              />
            </View>
          </View>
        </View>

        {/* RESUMO DO MÊS */}

        <View style={estilos.tituloSecao}>
          <Text style={estilos.tituloSecaoTexto}>
            Resumo do mês
          </Text>

          <Text style={estilos.mesAtual}>
            Outubro 2026
          </Text>
        </View>

        <View style={estilos.resumoContainer}>
          <View style={estilos.cartaoResumo}>
            <View style={estilos.cabecalhoResumo}>
              <View
                style={[
                  estilos.iconeResumo,
                  { backgroundColor: '#E4F5E9' },
                ]}
              >
                <Ionicons
                  name="arrow-down-outline"
                  size={19}
                  color="#238B45"
                />
              </View>

              <Text style={estilos.rotuloResumo}>
                Receitas
              </Text>
            </View>

            <Text
              style={[estilos.valorResumo, estilos.valorEntrada]}
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              {formatarMoeda(receitas)}
            </Text>
          </View>

          <View style={estilos.cartaoResumo}>
            <View style={estilos.cabecalhoResumo}>
              <View
                style={[
                  estilos.iconeResumo,
                  { backgroundColor: '#FCE8E6' },
                ]}
              >
                <Ionicons
                  name="arrow-up-outline"
                  size={19}
                  color="#D92344"
                />
              </View>

              <Text style={estilos.rotuloResumo}>
                Despesas
              </Text>
            </View>

            <Text
              style={[estilos.valorResumo, estilos.valorSaida]}
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              {formatarMoeda(despesas)}
            </Text>
          </View>
        </View>

        {/* EVOLUÇÃO FINANCEIRA */}

        <View style={estilos.tituloSecao}>
          <Text style={estilos.tituloSecaoTexto}>
            Evolução financeira
          </Text>

          <TouchableOpacity
            onPress={() => router.navigate('/relatorios')}
          >
            <Text style={estilos.linkVerTodos}>
              Ver relatório
            </Text>
          </TouchableOpacity>
        </View>

        <View style={estilos.cartaoGrafico}>
          <Text style={estilos.descricaoGrafico}>
            Saldo ao longo dos últimos 6 meses
          </Text>

          <View style={estilos.grafico}>
            {[
              { mes: 'Mai', valor: 35 },
              { mes: 'Jun', valor: 50 },
              { mes: 'Jul', valor: 42 },
              { mes: 'Ago', valor: 68 },
              { mes: 'Set', valor: 58 },
              { mes: 'Out', valor: 85 },
            ].map((item) => (
              <View key={item.mes} style={estilos.colunaGrafico}>
                <View style={estilos.areaBarra}>
                  <View
                    style={[
                      estilos.barraGrafico,
                      { height: `${item.valor}%` },
                      item.mes === 'Out' &&
                        estilos.barraGraficoAtiva,
                    ]}
                  />
                </View>

                <Text
                  style={[
                    estilos.textoMes,
                    item.mes === 'Out' &&
                      estilos.textoMesAtivo,
                  ]}
                >
                  {item.mes}
                </Text>
              </View>
            ))}
          </View>

          <View style={estilos.legendaGrafico}>
            <View style={estilos.pontoLegenda} />

            <Text style={estilos.textoLegenda}>
              Evolução do saldo
            </Text>
          </View>
        </View>

        {/* TRANSAÇÕES RECENTES */}

        <View style={estilos.tituloSecao}>
          <Text style={estilos.tituloSecaoTexto}>
            Transações recentes
          </Text>

          <TouchableOpacity
            onPress={navegarParaTransacoes}
          >
            <Text style={estilos.linkVerTodos}>
              Ver todas
            </Text>
          </TouchableOpacity>
        </View>

        <View style={estilos.cartaoTransacoes}>
          {transacoes.map(renderizarTransacao)}
        </View>

        {/* ACESSO RÁPIDO */}

        <Text style={estilos.tituloSecaoTexto}>
          Acesso rápido
        </Text>

        <View style={estilos.acessosRapidos}>
          <TouchableOpacity
            style={estilos.botaoRapido}
            activeOpacity={0.7}
            onPress={navegarParaTransacoes}
          >
            <View style={estilos.iconeRapido}>
              <Ionicons
                name="add-circle-outline"
                size={25}
                color="#D92344"
              />
            </View>

            <Text style={estilos.textoRapido}>
              Nova transação
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={estilos.botaoRapido}
            activeOpacity={0.7}
            onPress={navegarParaCategorias}
          >
            <View style={estilos.iconeRapido}>
              <Ionicons
                name="grid-outline"
                size={25}
                color="#D92344"
              />
            </View>

            <Text style={estilos.textoRapido}>
              Categorias
            </Text>
          </TouchableOpacity>
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
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 24,
  },

  cabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },

  saudacao: {
    fontSize: 14,
    color: '#777777',
    marginBottom: 5,
  },

  nomeAplicativo: {
    fontSize: 23,
    fontWeight: '800',
    color: '#222222',
  },

  botaoNotificacao: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#F7F7F7',
    alignItems: 'center',
    justifyContent: 'center',
  },

  indicadorNotificacao: {
    position: 'absolute',
    top: 9,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D92344',
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },

  cartaoSaldo: {
    backgroundColor: '#D92344',
    borderRadius: 22,
    padding: 22,
    marginBottom: 28,
  },

  linhaSaldo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  rotuloSaldo: {
    color: '#FFFFFF',
    fontSize: 14,
    opacity: 0.9,
  },

  valorSaldo: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '800',
    marginTop: 12,
    marginBottom: 20,
  },

  divisorSaldo: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginBottom: 17,
  },

  rodapeSaldo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  rotuloCartao: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },

  textoCartao: {
    color: '#FFFFFF',
    opacity: 0.85,
    fontSize: 11,
    marginTop: 5,
  },

  iconeCarteira: {
    width: 46,
    height: 46,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  tituloSecao: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
    marginTop: 2,
  },

  tituloSecaoTexto: {
    fontSize: 18,
    fontWeight: '800',
    color: '#252525',
    marginBottom: 14,
  },

  mesAtual: {
    fontSize: 12,
    color: '#888888',
    marginBottom: 14,
  },

  resumoContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 28,
  },

  cartaoResumo: {
    flex: 1,
    minWidth: 0,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EEEEEE',
    borderRadius: 18,
    padding: 14,
  },

  cabecalhoResumo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 13,
  },

  iconeResumo: {
    width: 34,
    height: 34,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },

  rotuloResumo: {
    fontSize: 12,
    color: '#777777',
  },

  valorResumo: {
    fontSize: 17,
    fontWeight: '800',
  },

  valorEntrada: {
    color: '#238B45',
  },

  valorSaida: {
    color: '#D92344',
  },

  linkVerTodos: {
    color: '#D92344',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 14,
  },

  cartaoGrafico: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EEEEEE',
    borderRadius: 20,
    padding: 18,
    marginBottom: 28,
  },

  descricaoGrafico: {
    fontSize: 12,
    color: '#888888',
    marginBottom: 18,
  },

  grafico: {
    height: 145,
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'space-around',
  },

  colunaGrafico: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },

  areaBarra: {
    height: 120,
    width: 24,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },

  barraGrafico: {
    width: 18,
    backgroundColor: '#F4C3CC',
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },

  barraGraficoAtiva: {
    backgroundColor: '#D92344',
  },

  textoMes: {
    fontSize: 11,
    color: '#888888',
    marginTop: 8,
  },

  textoMesAtivo: {
    color: '#D92344',
    fontWeight: '800',
  },

  legendaGrafico: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
    gap: 7,
  },

  pontoLegenda: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D92344',
  },

  textoLegenda: {
    fontSize: 11,
    color: '#777777',
  },

  cartaoTransacoes: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EEEEEE',
    borderRadius: 20,
    paddingHorizontal: 14,
    marginBottom: 28,
  },

  transacao: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F2',
    gap: 11,
  },

  iconeTransacao: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },

  detalhesTransacao: {
    flex: 1,
    minWidth: 0,
  },

  tituloTransacao: {
    fontSize: 13,
    fontWeight: '700',
    color: '#303030',
  },

  categoriaTransacao: {
    fontSize: 10,
    color: '#888888',
    marginTop: 5,
  },

  valorTransacao: {
    fontSize: 12,
    fontWeight: '800',
    flexShrink: 0,
  },

  acessosRapidos: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 0,
  },

  botaoRapido: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 14,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    borderRadius: 16,
    marginBottom: 10,
  },

  iconeRapido: {
    width: 36,
    height: 36,
    borderRadius: 11,
    backgroundColor: '#FCE8E6',
    alignItems: 'center',
    justifyContent: 'center',
  },

  textoRapido: {
    flex: 1,
    flexShrink: 1,
    fontSize: 11,
    fontWeight: '700',
    color: '#333333',
  },
});