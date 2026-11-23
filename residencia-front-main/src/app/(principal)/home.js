
import React, { useState } from 'react';

import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';

import estilos from '../../styles/homeStyles';

import { useTransacoes } from '../../contexts/TransacoesContext';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function Home() {
  const [saldoVisivel, setSaldoVisivel] = useState(true);

  const { transacoes: transacoesContexto } = useTransacoes();

  // RECEITAS E DESPESAS GERAIS

  const receitas = transacoesContexto
    .filter((transacao) => transacao.tipo === 'Receita')
    .reduce(
      (total, transacao) => total + Number(transacao.valor || 0),
      0
    );

  const despesas = transacoesContexto
    .filter((transacao) => transacao.tipo === 'Despesa')
    .reduce(
      (total, transacao) => total + Number(transacao.valor || 0),
      0
    );

  const saldoTotal = receitas - despesas;

  // FORMATAÇÃO DE VALORES

  function formatarMoeda(valor) {
    return Number(valor || 0).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  }

  // FORMATAÇÃO DE DATA

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

  // GRÁFICO DOS ÚLTIMOS 6 MESES

  const dataAtual = new Date();

  const mesesGrafico = Array.from({ length: 6 }, (_, indice) => {
    const dataMes = new Date(
      dataAtual.getFullYear(),
      dataAtual.getMonth() - 5 + indice,
      1
    );

    const ano = dataMes.getFullYear();
    const mes = dataMes.getMonth();

    const receitasMes = transacoesContexto
      .filter((transacao) => {
        if (transacao.tipo !== 'Receita' || !transacao.data) {
          return false;
        }

        const [anoTransacao, mesTransacao] = transacao.data.split('-');

        return (
          Number(anoTransacao) === ano &&
          Number(mesTransacao) === mes + 1
        );
      })
      .reduce(
        (total, transacao) => total + Number(transacao.valor || 0),
        0
      );

    const despesasMes = transacoesContexto
      .filter((transacao) => {
        if (transacao.tipo !== 'Despesa' || !transacao.data) {
          return false;
        }

        const [anoTransacao, mesTransacao] = transacao.data.split('-');

        return (
          Number(anoTransacao) === ano &&
          Number(mesTransacao) === mes + 1
        );
      })
      .reduce(
        (total, transacao) => total + Number(transacao.valor || 0),
        0
      );

    const nomesMeses = [
      'Jan',
      'Fev',
      'Mar',
      'Abr',
      'Mai',
      'Jun',
      'Jul',
      'Ago',
      'Set',
      'Out',
      'Nov',
      'Dez',
    ];

    return {
      mes: nomesMeses[mes],
      ano,
      receitas: receitasMes,
      despesas: despesasMes,
      saldo: receitasMes - despesasMes,
    };
  });

  const [mesSelecionado, setMesSelecionado] = useState(5);

  const dadosMesSelecionado = mesesGrafico[mesSelecionado];

  const maiorValorGrafico = Math.max(
    1,
    ...mesesGrafico.map((item) =>
      Math.max(item.receitas, item.despesas)
    )
  );

  // TRANSAÇÕES RECENTES

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

  // NAVEGAÇÃO

  function navegarParaTransacoes() {
    router.navigate('/transacoes');
  }

  function navegarParaNovaTransacao() {
    router.push('/nova-transacao');
  }

  function navegarParaCategorias() {
    router.navigate('/categorias');
  }

  // COMPONENTE DE TRANSAÇÃO

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

  // TELA

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


        <View style={estilos.cartaoSaldo}>
          <View style={estilos.linhaSaldo}>
            <Text style={estilos.rotuloSaldo}>
              Saldo disponível
            </Text>

            <TouchableOpacity
              onPress={() => setSaldoVisivel(!saldoVisivel)}
              accessibilityRole="button"
              accessibilityLabel={
                saldoVisivel ? 'Ocultar saldo' : 'Mostrar saldo'
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


        <View style={estilos.tituloSecao}>
          <Text style={estilos.tituloSecaoTexto}>
            Resumo do mês
          </Text>

          <Text style={estilos.mesAtual}>
            {dataAtual.toLocaleDateString('pt-BR', {
              month: 'long',
              year: 'numeric',
            })}
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
            Receitas e despesas dos últimos 6 meses
          </Text>


          <View style={estilos.resumoMesGrafico}>
            <Text style={estilos.nomeMesGrafico}>
              {dadosMesSelecionado.mes} {dadosMesSelecionado.ano}
            </Text>

            <Text style={estilos.rotuloSaldoGrafico}>
              Resultado do mês
            </Text>

            <Text
              style={[
                estilos.valorSaldoGrafico,
                {
                  color:
                    dadosMesSelecionado.saldo >= 0
                      ? '#238B45'
                      : '#D92344',
                },
              ]}
            >
              {formatarMoeda(dadosMesSelecionado.saldo)}
            </Text>
          </View>


          <View style={estilos.grafico}>
            {mesesGrafico.map((item, indice) => {
              const selecionado = indice === mesSelecionado;

              const alturaReceita =
                (item.receitas / maiorValorGrafico) * 100;

              const alturaDespesa =
                (item.despesas / maiorValorGrafico) * 100;

              return (
                <TouchableOpacity
                  key={`${item.mes}-${item.ano}`}
                  style={estilos.colunaGrafico}
                  onPress={() => setMesSelecionado(indice)}
                  activeOpacity={0.7}
                >
                  <View style={estilos.areaBarrasDuplas}>
                    <View
                      style={[
                        estilos.barraGrafico,
                        estilos.barraReceitaGrafico,
                        {
                          height:
                            item.receitas > 0
                              ? Math.max(alturaReceita, 4)
                              : 0,
                        },
                        selecionado &&
                          estilos.barraSelecionada,
                      ]}
                    />

                    <View
                      style={[
                        estilos.barraGrafico,
                        estilos.barraDespesaGrafico,
                        {
                          height:
                            item.despesas > 0
                              ? Math.max(alturaDespesa, 4)
                              : 0,
                        },
                        selecionado &&
                          estilos.barraSelecionada,
                      ]}
                    />
                  </View>

                  <Text
                    style={[
                      estilos.textoMes,
                      selecionado && estilos.textoMesAtivo,
                    ]}
                  >
                    {item.mes}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>


          <View style={estilos.legendaGrafico}>
            <View style={estilos.itemLegendaGrafico}>
              <View style={estilos.pontoReceitaGrafico} />

              <Text style={estilos.textoLegenda}>
                Receitas
              </Text>
            </View>

            <View style={estilos.itemLegendaGrafico}>
              <View style={estilos.pontoDespesaGrafico} />

              <Text style={estilos.textoLegenda}>
                Despesas
              </Text>
            </View>
          </View>


          <View style={estilos.detalhesGrafico}>
            <View style={estilos.linhaDetalheGrafico}>
              <Text style={estilos.textoDetalheGrafico}>
                Total de receitas
              </Text>

              <Text style={estilos.valorReceitaDetalhe}>
                {formatarMoeda(dadosMesSelecionado.receitas)}
              </Text>
            </View>

            <View style={estilos.linhaDetalheGrafico}>
              <Text style={estilos.textoDetalheGrafico}>
                Total de despesas
              </Text>

              <Text style={estilos.valorDespesaDetalhe}>
                {formatarMoeda(dadosMesSelecionado.despesas)}
              </Text>
            </View>
          </View>

          <Text style={estilos.instrucaoGrafico}>
            Toque em um mês para consultar os valores.
          </Text>
        </View>


        <View style={estilos.tituloSecao}>
          <Text style={estilos.tituloSecaoTexto}>
            Transações recentes
          </Text>

          <TouchableOpacity onPress={navegarParaTransacoes}>
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
