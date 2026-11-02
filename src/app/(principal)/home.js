import React, { useState } from 'react';

import estilos from '../../styles/homeStyles';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';

import { useTransacoes } from '../../contexts/TransacoesContext';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function Home() {
  const [saldoVisivel, setSaldoVisivel] = useState(true);

  const { transacoes: transacoesContexto } = useTransacoes();

  const receitas = transacoesContexto
    .filter((transacao) => transacao.tipo === 'Receita')
    .reduce(
      (total, transacao) => total + Number(transacao.valor),
      0
    );


  const despesas = transacoesContexto
    .filter((transacao) => transacao.tipo === 'Despesa')
    .reduce(
      (total, transacao) => total + Number(transacao.valor),
      0
    );


  const saldoTotal = receitas - despesas;

  function formatarDataTransacao(data) {
    if (!data) {
      return '';
    }

    const [ano, mes, dia] = data.split('-');

    if (!ano || !mes || !dia) {
      return data;
    }

    return `${dia}/${mes}/${ano}`;
  }

  const transacoesRecentes = [...transacoesContexto]
    .sort((a, b) => {
      const dataA = `${a.data || ''}`;
      const dataB = `${b.data || ''}`;

      return dataB.localeCompare(dataA);
    })
    .slice(0, 4)
    .map((transacao) => ({
      id: transacao.id,
      titulo: transacao.descricao,
      categoria: transacao.categoria,
      data: formatarDataTransacao(transacao.data),

      valor:
        transacao.tipo === 'Despesa'
          ? -Math.abs(Number(transacao.valor))
          : Math.abs(Number(transacao.valor)),

      icone:
        transacao.icone ||
        (transacao.tipo === 'Receita'
          ? 'wallet-outline'
          : 'receipt-outline'),

      cor:
        transacao.corFundo ||
        (transacao.tipo === 'Receita'
          ? '#E4F5E9'
          : '#FCE8E6'),

      corIcone:
        transacao.corIcone ||
        (transacao.tipo === 'Receita'
          ? '#238B45'
          : '#D92344'),
    }));

  function formatarMoeda(valor) {
    return Number(valor).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  }

  function navegarParaTransacoes() {
    router.navigate('/transacoes');
  }

  function navegarParaNovaTransacao() {
    router.push('/nova-transacao');
  }

  function navegarParaCategorias() {
    router.navigate('/categorias');
  }

  function renderizarTransacao(transacao) {
    const entrada = transacao.valor > 0;

    return (
      <View
        key={transacao.id}
        style={estilos.transacao}
      >
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
              onPress={() =>
                setSaldoVisivel(!saldoVisivel)
              }
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
          {/* RECEITAS */}

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
              style={[
                estilos.valorResumo,
                estilos.valorEntrada,
              ]}
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              {formatarMoeda(receitas)}
            </Text>
          </View>

          {/* DESPESAS */}

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
              style={[
                estilos.valorResumo,
                estilos.valorSaida,
              ]}
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
              <View
                key={item.mes}
                style={estilos.colunaGrafico}
              >
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
          {transacoesRecentes.length > 0 ? (
            transacoesRecentes.map(renderizarTransacao)
          ) : (
            <Text style={estilos.mensagemVazia}>
              Nenhuma transação cadastrada.
            </Text>
          )}
        </View>

        {/* ACESSO RÁPIDO */}

        <Text style={estilos.tituloSecaoTexto}>
          Acesso rápido
        </Text>

        <View style={estilos.acessosRapidos}>
          <TouchableOpacity
            style={estilos.botaoRapido}
            activeOpacity={0.7}
            onPress={navegarParaNovaTransacao}
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

