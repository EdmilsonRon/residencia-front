
import React, { useState } from 'react';

import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import { useTransacoes } from '../../contexts/TransacoesContext';
import { useCategorias } from '../../contexts/CategoriasContext';

import estilos from '../../styles/relatoriosStyles';

export default function Relatorios() {
  const { transacoes } = useTransacoes();
  const { categorias } = useCategorias();

  const [periodo, setPeriodo] = useState('Mes atual');
  const [tipoCategoria, setTipoCategoria] = useState('Despesa');

  const hoje = new Date();
  const anoAtual = hoje.getFullYear();
  const mesAtual = hoje.getMonth();

  function formatarMoeda(valor) {
    return Number(valor || 0).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  }

  function transacaoNoPeriodo(transacao) {
    if (periodo === 'Geral') return true;

    if (!transacao.data) return false;

    const partes = transacao.data.split('-');

    if (partes.length !== 3) return false;

    const ano = Number(partes[0]);
    const mes = Number(partes[1]) - 1;

    if (periodo === 'Mes atual') {
      return ano === anoAtual && mes === mesAtual;
    }

    if (periodo === 'Ano atual') {
      return ano === anoAtual;
    }

    return true;
  }

  const transacoesFiltradas = transacoes.filter(transacaoNoPeriodo);

  const receitas = transacoesFiltradas
    .filter(item => item.tipo === 'Receita')
    .reduce(
      (total, item) => total + Number(item.valor || 0),
      0
    );

  const despesas = transacoesFiltradas
    .filter(item => item.tipo === 'Despesa')
    .reduce(
      (total, item) => total + Number(item.valor || 0),
      0
    );

  const saldo = receitas - despesas;

  const maximoGrafico = Math.max(receitas, despesas, 1);

  const categoriasDoTipo = categorias.filter(
    item => item.tipo === tipoCategoria
  );

  const totalDoTipo = tipoCategoria === 'Despesa'
    ? despesas
    : receitas;

  const valoresPorCategoria = categoriasDoTipo
    .map(categoria => {
      const movimentacoes = transacoesFiltradas.filter(
        transacao =>
          transacao.categoria === categoria.nome &&
          transacao.tipo === tipoCategoria &&
          !transacao.metaId
      );

      const total = movimentacoes.reduce(
        (soma, item) => soma + Number(item.valor || 0),
        0
      );

      return {
        ...categoria,
        total,
        percentual: totalDoTipo > 0
          ? (total / totalDoTipo) * 100
          : 0,
      };
    })
    .filter(item => item.total > 0);

  const totalGastosMetas = tipoCategoria === 'Despesa'
    ? transacoesFiltradas
        .filter(
          transacao =>
            transacao.tipo === 'Despesa' &&
            transacao.metaId
        )
        .reduce(
          (total, transacao) =>
            total + Number(transacao.valor || 0),
          0
        )
    : 0;

  if (totalGastosMetas > 0) {
    valoresPorCategoria.push({
      id: 'categoria-metas',
      nome: 'Metas',
      icone: 'flag-outline',
      cor: '#7950C7',
      corFundo: '#F0E9FF',
      total: totalGastosMetas,
      percentual: totalDoTipo > 0
        ? (totalGastosMetas / totalDoTipo) * 100
        : 0,
    });
  }

  valoresPorCategoria.sort(
    (a, b) => b.total - a.total
  );

  const maiorValorCategoria = Math.max(
    ...valoresPorCategoria.map(item => item.total),
    0
  );

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
          >
            <Ionicons
              name="arrow-back"
              size={22}
              color="#252525"
            />
          </TouchableOpacity>

          <View style={estilos.cabecalhoTexto}>
            <Text style={estilos.titulo}>
              Relatórios
            </Text>

            <Text style={estilos.subtitulo}>
              Resumo das suas movimentações
            </Text>
          </View>
        </View>

        <Text style={estilos.rotuloSecao}>
          Período
        </Text>

        <View style={estilos.filtros}>
          {['Mes atual', 'Ano atual', 'Geral'].map(item => {
            const selecionado = periodo === item;

            return (
              <TouchableOpacity
                key={item}
                style={[
                  estilos.filtro,
                  selecionado && estilos.filtroAtivo,
                ]}
                onPress={() => setPeriodo(item)}
              >
                <Text
                  style={[
                    estilos.textoFiltro,
                    selecionado && estilos.textoFiltroAtivo,
                  ]}
                >
                  {item === 'Mes atual'
                    ? 'Este mês'
                    : item === 'Ano atual'
                    ? 'Este ano'
                    : 'Geral'}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={estilos.cartaoSaldo}>
          <View style={estilos.linhaSaldo}>
            <View>
              <Text style={estilos.rotuloSaldo}>
                Saldo do período
              </Text>

              <Text style={estilos.valorSaldo}>
                {formatarMoeda(saldo)}
              </Text>
            </View>

            <View
              style={[
                estilos.iconeSaldo,
                {
                  backgroundColor: saldo >= 0
                    ? '#E4F5E9'
                    : '#FCE8E6',
                },
              ]}
            >
              <Ionicons
                name={
                  saldo >= 0
                    ? 'trending-up-outline'
                    : 'trending-down-outline'
                }
                size={25}
                color={saldo >= 0 ? '#238B45' : '#D92344'}
              />
            </View>
          </View>

          <Text style={estilos.descricaoSaldo}>
            {periodo === 'Mes atual'
              ? 'Resultado das movimentações deste mês'
              : periodo === 'Ano atual'
              ? 'Resultado das movimentações deste ano'
              : 'Resultado de todas as movimentações'}
          </Text>
        </View>

        <View style={estilos.gradeResumo}>
          <View style={estilos.cartaoResumo}>
            <View style={estilos.linhaResumo}>
              <Ionicons
                name="arrow-down-circle"
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
              {formatarMoeda(receitas)}
            </Text>
          </View>

          <View style={estilos.cartaoResumo}>
            <View style={estilos.linhaResumo}>
              <Ionicons
                name="arrow-up-circle"
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
              {formatarMoeda(despesas)}
            </Text>
          </View>
        </View>

        <View style={estilos.secao}>
          <Text style={estilos.tituloSecao}>
            Receitas x despesas
          </Text>

          <Text style={estilos.descricaoSecao}>
            Comparação dos valores no período selecionado.
          </Text>

          <View style={estilos.cartao}>
            <View style={estilos.linhaGrafico}>
              <View style={estilos.infoGrafico}>
                <View
                  style={[
                    estilos.ponto,
                    { backgroundColor: '#238B45' },
                  ]}
                />

                <Text style={estilos.rotuloGrafico}>
                  Receitas
                </Text>
              </View>

              <Text style={estilos.valorGrafico}>
                {formatarMoeda(receitas)}
              </Text>
            </View>

            <View style={estilos.fundoBarra}>
              <View
                style={[
                  estilos.barra,
                  {
                    width: `${(receitas / maximoGrafico) * 100}%`,
                    backgroundColor: '#238B45',
                  },
                ]}
              />
            </View>

            <View
              style={[
                estilos.linhaGrafico,
                { marginTop: 20 },
              ]}
            >
              <View style={estilos.infoGrafico}>
                <View
                  style={[
                    estilos.ponto,
                    { backgroundColor: '#D92344' },
                  ]}
                />

                <Text style={estilos.rotuloGrafico}>
                  Despesas
                </Text>
              </View>

              <Text style={estilos.valorGrafico}>
                {formatarMoeda(despesas)}
              </Text>
            </View>

            <View style={estilos.fundoBarra}>
              <View
                style={[
                  estilos.barra,
                  {
                    width: `${(despesas / maximoGrafico) * 100}%`,
                    backgroundColor: '#D92344',
                  },
                ]}
              />
            </View>
          </View>
        </View>

        <View style={estilos.secao}>
          <Text style={estilos.tituloSecao}>
            Gastos por categoria
          </Text>

          <Text style={estilos.descricaoSecao}>
            Veja quais categorias concentram suas movimentações.
          </Text>

          <View style={estilos.filtrosCategoria}>
            {['Despesa', 'Receita'].map(item => {
              const selecionado = tipoCategoria === item;

              return (
                <TouchableOpacity
                  key={item}
                  style={[
                    estilos.botaoTipoCategoria,
                    selecionado &&
                      (item === 'Despesa'
                        ? estilos.tipoDespesaAtivo
                        : estilos.tipoReceitaAtivo),
                  ]}
                  onPress={() => setTipoCategoria(item)}
                >
                  <Text
                    style={[
                      estilos.textoTipoCategoria,
                      selecionado && estilos.textoTipoCategoriaAtivo,
                    ]}
                  >
                    {item === 'Despesa'
                      ? 'Despesas'
                      : 'Receitas'}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={estilos.cartao}>
            <View style={estilos.cabecalhoCategorias}>
              <Text style={estilos.rotuloGrafico}>
                {tipoCategoria === 'Despesa'
                  ? 'Total em despesas'
                  : 'Total em receitas'}
              </Text>

              <Text style={estilos.totalCategorias}>
                {formatarMoeda(totalDoTipo)}
              </Text>
            </View>

            {valoresPorCategoria.length === 0 ? (
              <View style={estilos.vazio}>
                <Ionicons
                  name="pricetags-outline"
                  size={28}
                  color="#AAAAAA"
                />

                <Text style={estilos.textoVazio}>
                  Nenhuma movimentação encontrada neste período.
                </Text>
              </View>
            ) : (
              valoresPorCategoria.map(item => {
                const largura = maiorValorCategoria > 0
                  ? (item.total / maiorValorCategoria) * 100
                  : 0;

                return (
                  <View
                    key={item.id}
                    style={estilos.itemCategoria}
                  >
                    <View style={estilos.linhaCategoria}>
                      <View style={estilos.infoCategoria}>
                        <View
                          style={[
                            estilos.iconeCategoria,
                            {
                              backgroundColor:
                                item.corFundo || '#EEEEEE',
                            },
                          ]}
                        >
                          <Ionicons
                            name={item.icone || 'pricetag-outline'}
                            size={18}
                            color={item.cor || '#666666'}
                          />
                        </View>

                        <View style={estilos.nomeCategoriaArea}>
                          <Text
                            style={estilos.nomeCategoria}
                            numberOfLines={1}
                          >
                            {item.nome}
                          </Text>

                          <Text style={estilos.detalheCategoria}>
                            {item.percentual.toLocaleString('pt-BR', {
                              maximumFractionDigits: 1,
                            })}
                            % do total
                          </Text>
                        </View>
                      </View>

                      <Text
                        style={[
                          estilos.valorCategoria,
                          {
                            color: tipoCategoria === 'Despesa'
                              ? '#D92344'
                              : '#238B45',
                          },
                        ]}
                      >
                        {formatarMoeda(item.total)}
                      </Text>
                    </View>

                    <View style={estilos.fundoBarraCategoria}>
                      <View
                        style={[
                          estilos.barraCategoria,
                          {
                            width: `${largura}%`,
                            backgroundColor: item.cor || '#777777',
                          },
                        ]}
                      />
                    </View>
                  </View>
                );
              })
            )}
          </View>
        </View>

        <View style={estilos.aviso}>
          <Ionicons
            name="information-circle-outline"
            size={19}
            color="#777777"
          />

          <Text style={estilos.textoAviso}>
            Relatório baseado nas movimentações registradas no aplicativo.
            A integração com o backend ainda precisa ser realizada.
          </Text>
        </View>

      </ScrollView>
    </View>
  );
}
