  import React, { useState } from 'react';

import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import { useTransacoes } from '../../contexts/TransacoesContext';
import { useCategorias } from '../../contexts/CategoriasContext';

export default function Relatorios() {
  const { transacoes } = useTransacoes();
  const { categorias } = useCategorias();

  const [periodo, setPeriodo] = useState('Mes atual');
  const [tipoCategoria, setTipoCategoria] = useState('Despesa');

  const hoje = new Date();
  const anoAtual = hoje.getFullYear();
  const mesAtual = hoje.getMonth();

  function formatarMoeda(valor) {
    return Number(valor).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  }

  function formatarData(data) {
    if (!data) return 'Sem data';

    const partes = data.split('-');

    if (partes.length !== 3) return data;

    return `${partes[2]}/${partes[1]}/${partes[0]}`;
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
    .filter((item) => item.tipo === 'Receita')
    .reduce((total, item) => total + Number(item.valor || 0), 0);

  const despesas = transacoesFiltradas
    .filter((item) => item.tipo === 'Despesa')
    .reduce((total, item) => total + Number(item.valor || 0), 0);

  const saldo = receitas - despesas;

  const quantidadeReceitas = transacoesFiltradas.filter(
    (item) => item.tipo === 'Receita'
  ).length;

  const quantidadeDespesas = transacoesFiltradas.filter(
    (item) => item.tipo === 'Despesa'
  ).length;

  const maiorDespesa = transacoesFiltradas
    .filter((item) => item.tipo === 'Despesa')
    .reduce(
      (maior, item) =>
        Number(item.valor || 0) > Number(maior?.valor || 0)
          ? item
          : maior,
      null
    );

  const maiorReceita = transacoesFiltradas
    .filter((item) => item.tipo === 'Receita')
    .reduce(
      (maior, item) =>
        Number(item.valor || 0) > Number(maior?.valor || 0)
          ? item
          : maior,
      null
    );

  const mediaDespesas =
    quantidadeDespesas > 0 ? despesas / quantidadeDespesas : 0;

  const transacoesRecentes = [...transacoesFiltradas]
    .sort((a, b) => (b.data || '').localeCompare(a.data || ''))
    .slice(0, 5);

  const categoriasDoTipo = categorias.filter(
    (item) => item.tipo === tipoCategoria
  );

  const totalDoTipo = tipoCategoria === 'Despesa' ? despesas : receitas;

  const valoresPorCategoria = categoriasDoTipo
    .map((categoria) => {
      const movimentacoes = transacoesFiltradas.filter(
        (transacao) =>
          transacao.categoria === categoria.nome &&
          transacao.tipo === tipoCategoria
      );

      const total = movimentacoes.reduce(
        (soma, item) => soma + Number(item.valor || 0),
        0
      );

      return {
        ...categoria,
        total,
        quantidade: movimentacoes.length,
        percentual:
          totalDoTipo > 0 ? (total / totalDoTipo) * 100 : 0,
      };
    })
    .sort((a, b) => b.total - a.total);

  const maiorCategoria = valoresPorCategoria.reduce(
    (maior, item) => (item.total > (maior?.total || 0) ? item : maior),
    null
  );

  const maiorValorCategoria = Math.max(
    ...valoresPorCategoria.map((item) => item.total),
    0
  );

  const maximoGrafico = Math.max(receitas, despesas, 1);

  return (
    <View style={estilos.container}>
      <ScrollView
        contentContainerStyle={estilos.conteudo}
        showsVerticalScrollIndicator={false}
      >
        {/* CABEÇALHO */}

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
            <Text style={estilos.titulo}>Relatórios</Text>
            <Text style={estilos.subtitulo}>
              Uma visão completa das suas finanças
            </Text>
          </View>

          <View style={estilos.iconeCabecalho}>
            <Ionicons
              name="bar-chart-outline"
              size={23}
              color="#D92344"
            />
          </View>
        </View>

        {/* FILTRO DE PERÍODO */}

        <Text style={estilos.rotuloSecao}>Período analisado</Text>

        <View style={estilos.filtros}>
          {['Mes atual', 'Ano atual', 'Geral'].map((item) => {
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

        {/* SALDO */}

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
                  backgroundColor:
                    saldo >= 0 ? '#E4F5E9' : '#FCE8E6',
                },
              ]}
            >
              <Ionicons
                name={
                  saldo >= 0
                    ? 'trending-up-outline'
                    : 'trending-down-outline'
                }
                size={26}
                color={saldo >= 0 ? '#238B45' : '#D92344'}
              />
            </View>
          </View>

          <View style={estilos.divisorSaldo} />

          <View style={estilos.linhaIndicador}>
            <Ionicons
              name="calendar-outline"
              size={15}
              color="#777777"
            />
            <Text style={estilos.textoIndicador}>
              {periodo === 'Mes atual'
                ? 'Movimentações deste mês'
                : periodo === 'Ano atual'
                ? 'Movimentações deste ano'
                : 'Todas as movimentações registradas'}
            </Text>
          </View>
        </View>

        {/* RECEITAS E DESPESAS */}

        <View style={estilos.gradeResumo}>
          <View style={estilos.cartaoResumo}>
            <View style={estilos.linhaResumo}>
              <View
                style={[
                  estilos.iconeResumo,
                  { backgroundColor: '#E4F5E9' },
                ]}
              >
                <Ionicons
                  name="arrow-down-outline"
                  size={20}
                  color="#238B45"
                />
              </View>

              <Text style={estilos.rotuloResumo}>Receitas</Text>
            </View>

            <Text
              style={[estilos.valorResumo, { color: '#238B45' }]}
              adjustsFontSizeToFit
              numberOfLines={1}
            >
              {formatarMoeda(receitas)}
            </Text>

            <Text style={estilos.legendaResumo}>
              {quantidadeReceitas}{' '}
              {quantidadeReceitas === 1
                ? 'movimentação'
                : 'movimentações'}
            </Text>
          </View>

          <View style={estilos.cartaoResumo}>
            <View style={estilos.linhaResumo}>
              <View
                style={[
                  estilos.iconeResumo,
                  { backgroundColor: '#FCE8E6' },
                ]}
              >
                <Ionicons
                  name="arrow-up-outline"
                  size={20}
                  color="#D92344"
                />
              </View>

              <Text style={estilos.rotuloResumo}>Despesas</Text>
            </View>

            <Text
              style={[estilos.valorResumo, { color: '#D92344' }]}
              adjustsFontSizeToFit
              numberOfLines={1}
            >
              {formatarMoeda(despesas)}
            </Text>

            <Text style={estilos.legendaResumo}>
              {quantidadeDespesas}{' '}
              {quantidadeDespesas === 1
                ? 'movimentação'
                : 'movimentações'}
            </Text>
          </View>
        </View>

        {/* GRÁFICO DE COMPARAÇÃO */}

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
                <Text style={estilos.rotuloGrafico}>Receitas</Text>
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

            <View style={[estilos.linhaGrafico, { marginTop: 22 }]}>
              <View style={estilos.infoGrafico}>
                <View
                  style={[
                    estilos.ponto,
                    { backgroundColor: '#D92344' },
                  ]}
                />
                <Text style={estilos.rotuloGrafico}>Despesas</Text>
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

            <View style={estilos.resumoGrafico}>
              <Text style={estilos.textoResumoGrafico}>
                {receitas + despesas > 0
                  ? `As despesas representam ${(
                      (despesas / (receitas + despesas)) *
                      100
                    ).toLocaleString('pt-BR', {
                      maximumFractionDigits: 1,
                    })}% do total movimentado.`
                  : 'Registre transações para visualizar a comparação.'}
              </Text>
            </View>
          </View>
        </View>

        {/* CATEGORIAS */}

        <View style={estilos.secao}>
          <Text style={estilos.tituloSecao}>
            Análise por categoria
          </Text>

          <Text style={estilos.descricaoSecao}>
            Confira como seu dinheiro está distribuído.
          </Text>

          <View style={estilos.filtrosCategoria}>
            {['Despesa', 'Receita'].map((item) => {
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
                  ? 'Categorias de despesas'
                  : 'Categorias de receitas'}
              </Text>

              <Text style={estilos.totalCategorias}>
                {formatarMoeda(totalDoTipo)}
              </Text>
            </View>

            {valoresPorCategoria.length === 0 ? (
              <View style={estilos.vazio}>
                <Ionicons
                  name="pricetags-outline"
                  size={30}
                  color="#AAAAAA"
                />

                <Text style={estilos.textoVazio}>
                  Nenhuma categoria deste tipo foi criada.
                </Text>
              </View>
            ) : (
              valoresPorCategoria.map((item) => {
                const largura =
                  maiorValorCategoria > 0
                    ? (item.total / maiorValorCategoria) * 100
                    : 0;

                return (
                  <View key={item.id} style={estilos.itemCategoria}>
                    <View style={estilos.linhaCategoria}>
                      <View style={estilos.infoCategoria}>
                        <View
                          style={[
                            estilos.iconeCategoria,
                            { backgroundColor: item.corFundo },
                          ]}
                        >
                          <Ionicons
                            name={item.icone}
                            size={19}
                            color={item.cor}
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
                            {item.quantidade}{' '}
                            {item.quantidade === 1
                              ? 'transação'
                              : 'transações'}
                            {' · '}
                            {item.percentual.toLocaleString('pt-BR', {
                              maximumFractionDigits: 1,
                            })}
                            %
                          </Text>
                        </View>
                      </View>

                      <Text
                        style={[
                          estilos.valorCategoria,
                          {
                            color:
                              tipoCategoria === 'Despesa'
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
                            backgroundColor: item.cor,
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

        {/* INDICADORES */}

        <View style={estilos.secao}>
          <Text style={estilos.tituloSecao}>
            Indicadores financeiros
          </Text>

          <Text style={estilos.descricaoSecao}>
            Outros dados importantes do período.
          </Text>

          <View style={estilos.cartaoIndicadores}>
            <View style={estilos.itemIndicador}>
              <View
                style={[
                  estilos.iconeIndicador,
                  { backgroundColor: '#E7F0FF' },
                ]}
              >
                <Ionicons
                  name="swap-vertical-outline"
                  size={20}
                  color="#3574C8"
                />
              </View>

              <View style={estilos.textoIndicadorArea}>
                <Text style={estilos.nomeIndicador}>
                  Total de transações
                </Text>
                <Text style={estilos.valorIndicador}>
                  {transacoesFiltradas.length}
                </Text>
              </View>
            </View>

            <View style={estilos.separadorIndicador} />

            <View style={estilos.itemIndicador}>
              <View
                style={[
                  estilos.iconeIndicador,
                  { backgroundColor: '#FCE8E6' },
                ]}
              >
                <Ionicons
                  name="trending-down-outline"
                  size={20}
                  color="#D92344"
                />
              </View>

              <View style={estilos.textoIndicadorArea}>
                <Text style={estilos.nomeIndicador}>
                  Maior despesa
                </Text>
                <Text style={estilos.valorIndicador}>
                  {maiorDespesa
                    ? formatarMoeda(maiorDespesa.valor)
                    : formatarMoeda(0)}
                </Text>
                <Text style={estilos.detalheIndicador}>
                  {maiorDespesa
                    ? maiorDespesa.descricao
                    : 'Sem despesas no período'}
                </Text>
              </View>
            </View>

            <View style={estilos.separadorIndicador} />

            <View style={estilos.itemIndicador}>
              <View
                style={[
                  estilos.iconeIndicador,
                  { backgroundColor: '#E4F5E9' },
                ]}
              >
                <Ionicons
                  name="trending-up-outline"
                  size={20}
                  color="#238B45"
                />
              </View>

              <View style={estilos.textoIndicadorArea}>
                <Text style={estilos.nomeIndicador}>
                  Maior receita
                </Text>
                <Text style={estilos.valorIndicador}>
                  {maiorReceita
                    ? formatarMoeda(maiorReceita.valor)
                    : formatarMoeda(0)}
                </Text>
                <Text style={estilos.detalheIndicador}>
                  {maiorReceita
                    ? maiorReceita.descricao
                    : 'Sem receitas no período'}
                </Text>
              </View>
            </View>

            <View style={estilos.separadorIndicador} />

            <View style={estilos.itemIndicador}>
              <View
                style={[
                  estilos.iconeIndicador,
                  { backgroundColor: '#FFF0DD' },
                ]}
              >
                <Ionicons
                  name="calculator-outline"
                  size={20}
                  color="#C47A16"
                />
              </View>

              <View style={estilos.textoIndicadorArea}>
                <Text style={estilos.nomeIndicador}>
                  Média por despesa
                </Text>
                <Text style={estilos.valorIndicador}>
                  {formatarMoeda(mediaDespesas)}
                </Text>
                <Text style={estilos.detalheIndicador}>
                  Valor médio de cada despesa registrada.
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* MAIOR CATEGORIA */}

        <View style={estilos.secao}>
          <Text style={estilos.tituloSecao}>
            Destaque do período
          </Text>

          <View style={estilos.cartaoDestaque}>
            <View style={estilos.iconeDestaque}>
              <Ionicons
                name="star-outline"
                size={24}
                color="#C47A16"
              />
            </View>

            <View style={estilos.conteudoDestaque}>
              <Text style={estilos.tituloDestaque}>
                {maiorCategoria && maiorCategoria.total > 0
                  ? maiorCategoria.nome
                  : 'Sem movimentações por categoria'}
              </Text>

              <Text style={estilos.descricaoDestaque}>
                {maiorCategoria && maiorCategoria.total > 0
                  ? `Categoria com maior valor em ${
                      tipoCategoria === 'Despesa'
                        ? 'despesas'
                        : 'receitas'
                    } neste período.`
                  : 'Registre uma transação para gerar este destaque.'}
              </Text>
            </View>

            <Text style={estilos.valorDestaque}>
              {formatarMoeda(maiorCategoria?.total || 0)}
            </Text>
          </View>
        </View>

        {/* ÚLTIMAS TRANSAÇÕES */}

        <View style={estilos.secao}>
          <View style={estilos.cabecalhoRecentes}>
            <View>
              <Text style={estilos.tituloSecao}>
                Últimas movimentações
              </Text>

              <Text style={estilos.descricaoSecao}>
                Registros incluídos neste relatório.
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => router.navigate('/transacoes')}
            >
              <Text style={estilos.linkVerTodas}>
                Ver todas
              </Text>
            </TouchableOpacity>
          </View>

          <View style={estilos.cartao}>
            {transacoesRecentes.length === 0 ? (
              <View style={estilos.vazio}>
                <Ionicons
                  name="receipt-outline"
                  size={30}
                  color="#AAAAAA"
                />

                <Text style={estilos.textoVazio}>
                  Nenhuma transação neste período.
                </Text>
              </View>
            ) : (
              transacoesRecentes.map((item) => (
                <View key={item.id} style={estilos.transacao}>
                  <View
                    style={[
                      estilos.iconeTransacao,
                      {
                        backgroundColor:
                          item.corFundo ||
                          (item.tipo === 'Receita'
                            ? '#E4F5E9'
                            : '#FCE8E6'),
                      },
                    ]}
                  >
                    <Ionicons
                      name={item.icone || 'swap-horizontal-outline'}
                      size={20}
                      color={
                        item.corIcone ||
                        (item.tipo === 'Receita'
                          ? '#238B45'
                          : '#D92344')
                      }
                    />
                  </View>

                  <View style={estilos.infoTransacao}>
                    <Text
                      style={estilos.nomeTransacao}
                      numberOfLines={1}
                    >
                      {item.descricao}
                    </Text>

                    <Text style={estilos.detalheTransacao}>
                      {item.categoria} · {formatarData(item.data)}
                    </Text>
                  </View>

                  <Text
                    style={[
                      estilos.valorTransacao,
                      {
                        color:
                          item.tipo === 'Receita'
                            ? '#238B45'
                            : '#D92344',
                      },
                    ]}
                  >
                    {item.tipo === 'Receita' ? '+' : '-'}
                    {formatarMoeda(item.valor)}
                  </Text>
                </View>
              ))
            )}
          </View>
        </View>

        {/* OBSERVAÇÃO */}

        <View style={estilos.aviso}>
          <Ionicons
            name="information-circle-outline"
            size={20}
            color="#777777"
          />

          <Text style={estilos.textoAviso}>
            Os relatórios são calculados com base nas transações
            registradas no aplicativo. Os dados ainda não são salvos
            permanentemente.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },

  conteudo: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 35,
  },

  cabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 27,
    gap: 12,
  },

  botaoVoltar: {
    width: 43,
    height: 43,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  cabecalhoTexto: {
    flex: 1,
  },

  titulo: {
    fontSize: 25,
    fontWeight: '800',
    color: '#252525',
  },

  subtitulo: {
    fontSize: 12,
    color: '#888888',
    marginTop: 5,
  },

  iconeCabecalho: {
    width: 43,
    height: 43,
    borderRadius: 14,
    backgroundColor: '#FCE8E6',
    alignItems: 'center',
    justifyContent: 'center',
  },

  rotuloSecao: {
    fontSize: 13,
    fontWeight: '700',
    color: '#444444',
    marginBottom: 10,
  },

  filtros: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },

  filtro: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },

  filtroAtivo: {
    backgroundColor: '#D92344',
    borderColor: '#D92344',
  },

  textoFiltro: {
    color: '#666666',
    fontSize: 12,
    fontWeight: '600',
  },

  textoFiltroAtivo: {
    color: '#FFFFFF',
  },

  cartaoSaldo: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },

  linhaSaldo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  rotuloSaldo: {
    color: '#777777',
    fontSize: 13,
  },

  valorSaldo: {
    color: '#252525',
    fontSize: 29,
    fontWeight: '800',
    marginTop: 8,
  },

  iconeSaldo: {
    width: 50,
    height: 50,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },

  divisorSaldo: {
    height: 1,
    backgroundColor: '#EEEEEE',
    marginVertical: 17,
  },

  linhaIndicador: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },

  textoIndicador: {
    color: '#777777',
    fontSize: 12,
  },

  gradeResumo: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 25,
  },

  cartaoResumo: {
    flex: 1,
    minWidth: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 17,
    padding: 15,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },

  linhaResumo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },

  iconeResumo: {
    width: 32,
    height: 32,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },

  rotuloResumo: {
    fontSize: 12,
    fontWeight: '600',
    color: '#555555',
  },

  valorResumo: {
    fontSize: 18,
    fontWeight: '800',
  },

  legendaResumo: {
    fontSize: 11,
    color: '#999999',
    marginTop: 7,
  },

  secao: {
    marginBottom: 26,
  },

  tituloSecao: {
    fontSize: 18,
    fontWeight: '800',
    color: '#252525',
  },

  descricaoSecao: {
    fontSize: 12,
    color: '#888888',
    marginTop: 5,
    marginBottom: 13,
  },

  cartao: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 17,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },

  linhaGrafico: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },

  infoGrafico: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  ponto: {
    width: 9,
    height: 9,
    borderRadius: 5,
  },

  rotuloGrafico: {
    color: '#555555',
    fontSize: 13,
    fontWeight: '600',
  },

  valorGrafico: {
    color: '#252525',
    fontSize: 13,
    fontWeight: '700',
  },

  fundoBarra: {
    width: '100%',
    height: 10,
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    overflow: 'hidden',
  },

  barra: {
    height: '100%',
    borderRadius: 10,
  },

  resumoGrafico: {
    backgroundColor: '#F8F8F8',
    padding: 12,
    borderRadius: 11,
    marginTop: 20,
  },

  textoResumoGrafico: {
    color: '#777777',
    fontSize: 12,
    lineHeight: 18,
  },

  filtrosCategoria: {
    flexDirection: 'row',
    backgroundColor: '#EEEEEE',
    borderRadius: 12,
    padding: 4,
    marginBottom: 14,
  },

  botaoTipoCategoria: {
    flex: 1,
    paddingVertical: 11,
    alignItems: 'center',
    borderRadius: 9,
  },

  tipoDespesaAtivo: {
    backgroundColor: '#D92344',
  },

  tipoReceitaAtivo: {
    backgroundColor: '#238B45',
  },

  textoTipoCategoria: {
    color: '#666666',
    fontSize: 13,
    fontWeight: '700',
  },

  textoTipoCategoriaAtivo: {
    color: '#FFFFFF',
  },

  cabecalhoCategorias: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 22,
    gap: 8,
  },

  totalCategorias: {
    color: '#252525',
    fontSize: 14,
    fontWeight: '800',
  },

  itemCategoria: {
    marginBottom: 21,
  },

  linhaCategoria: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 10,
  },

  infoCategoria: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    minWidth: 0,
  },

  iconeCategoria: {
    width: 39,
    height: 39,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },

  nomeCategoriaArea: {
    flex: 1,
    minWidth: 0,
  },

  nomeCategoria: {
    fontSize: 13,
    fontWeight: '700',
    color: '#333333',
  },

  detalheCategoria: {
    fontSize: 11,
    color: '#999999',
    marginTop: 4,
  },

  valorCategoria: {
    fontSize: 12,
    fontWeight: '800',
  },

  fundoBarraCategoria: {
    height: 6,
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    overflow: 'hidden',
  },

  barraCategoria: {
    height: '100%',
    borderRadius: 8,
  },

  vazio: {
    alignItems: 'center',
    paddingVertical: 25,
    gap: 10,
  },

  textoVazio: {
    color: '#999999',
    fontSize: 12,
    textAlign: 'center',
  },

  cartaoIndicadores: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },

  itemIndicador: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 17,
    gap: 13,
  },

  iconeIndicador: {
    width: 43,
    height: 43,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },

  textoIndicadorArea: {
    flex: 1,
  },

  nomeIndicador: {
    fontSize: 12,
    color: '#777777',
  },

  valorIndicador: {
    fontSize: 16,
    fontWeight: '800',
    color: '#252525',
    marginTop: 4,
  },

  detalheIndicador: {
    fontSize: 11,
    color: '#999999',
    marginTop: 4,
  },

  separadorIndicador: {
    height: 1,
    backgroundColor: '#F0F0F0',
  },

  cartaoDestaque: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 17,
    padding: 15,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    gap: 11,
  },

  iconeDestaque: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: '#FFF0DD',
    alignItems: 'center',
    justifyContent: 'center',
  },

  conteudoDestaque: {
    flex: 1,
  },

  tituloDestaque: {
    fontSize: 13,
    fontWeight: '800',
    color: '#333333',
  },

  descricaoDestaque: {
    fontSize: 11,
    color: '#888888',
    marginTop: 5,
    lineHeight: 16,
  },

  valorDestaque: {
    fontSize: 12,
    fontWeight: '800',
    color: '#C47A16',
  },

  cabecalhoRecentes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
    marginBottom: 13,
  },

  linkVerTodas: {
    color: '#D92344',
    fontSize: 12,
    fontWeight: '700',
  },

  transacao: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F2',
  },

  iconeTransacao: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },

  infoTransacao: {
    flex: 1,
    minWidth: 0,
  },

  nomeTransacao: {
    fontSize: 13,
    fontWeight: '700',
    color: '#333333',
  },

  detalheTransacao: {
    fontSize: 11,
    color: '#999999',
    marginTop: 5,
  },

  valorTransacao: {
    fontSize: 12,
    fontWeight: '800',
  },

  aviso: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 9,
    padding: 14,
    backgroundColor: '#EEEEEE',
    borderRadius: 13,
    marginBottom: 15,
  },

  textoAviso: {
    flex: 1,
    fontSize: 11,
    lineHeight: 17,
    color: '#777777',
  },
});
