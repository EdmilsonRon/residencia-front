import React, { useMemo, useState } from 'react';

import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import { useTransacoes } from '../../contexts/TransacoesContext';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function Transacoes() {
  const [filtroAtivo, setFiltroAtivo] = useState('Todas');
  const [busca, setBusca] = useState('');

  // Dados fictícios para desenvolver a interface.
  // Posteriormente, serão carregados do back-end.

  const { transacoes } = useTransacoes();

  function formatarMoeda(valor) {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  }

  // Calcula os totais a partir das transações fictícias.

  const totalReceitas = transacoes
    .filter((item) => item.tipo === 'Receita')
    .reduce((total, item) => total + item.valor, 0);

  const totalDespesas = transacoes
    .filter((item) => item.tipo === 'Despesa')
    .reduce((total, item) => total + item.valor, 0);

  const saldoPeriodo = totalReceitas - totalDespesas;

  // Aplica o filtro e a pesquisa.

  const transacoesFiltradas = useMemo(() => {
    return transacoes.filter((item) => {
      const correspondeAoFiltro =
        filtroAtivo === 'Todas' ||
        item.tipo === filtroAtivo;

      const textoBusca = busca.trim().toLowerCase();

      const correspondeABusca =
        item.descricao.toLowerCase().includes(textoBusca) ||
        item.categoria.toLowerCase().includes(textoBusca);

      return correspondeAoFiltro && correspondeABusca;
    });
  }, [filtroAtivo, busca]);

  // Agrupa as movimentações por data.

  const gruposPorData = useMemo(() => {
    const grupos = {};

    transacoesFiltradas.forEach((item) => {
      if (!grupos[item.data]) {
        grupos[item.data] = [];
      }

      grupos[item.data].push(item);
    });

    return Object.entries(grupos);
  }, [transacoesFiltradas]);

  function abrirNovaTransacao() {
    router.push('/nova-transacao');
  }

  function renderizarTransacao(item) {
    const receita = item.tipo === 'Receita';

    return (
      <View key={item.id} style={estilos.transacao}>
        <View
          style={[
            estilos.iconeTransacao,
            { backgroundColor: item.corFundo },
          ]}
        >
          <Ionicons
            name={item.icone}
            size={22}
            color={item.corIcone}
          />
        </View>

        <View style={estilos.detalhesTransacao}>
          <Text style={estilos.descricaoTransacao}>
            {item.descricao}
          </Text>

          <Text style={estilos.categoriaTransacao}>
            {item.categoria}
          </Text>
        </View>

        <View style={estilos.areaValor}>
          <Text
            style={[
              estilos.valorTransacao,
              receita
                ? estilos.valorReceita
                : estilos.valorDespesa,
            ]}
          >
            {receita ? '+' : '-'}
            {formatarMoeda(item.valor)}
          </Text>

          <Text style={estilos.tipoTransacao}>
            {item.tipo}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={estilos.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={estilos.conteudo}
        keyboardShouldPersistTaps="handled"
      >
        {/* CABEÇALHO */}

        <View style={estilos.cabecalho}>
          <View>
            <Text style={estilos.subtitulo}>
              Acompanhe suas movimentações
            </Text>

            <Text style={estilos.titulo}>
              Transações
            </Text>
          </View>

          <TouchableOpacity
            style={estilos.botaoAdicionar}
            activeOpacity={0.8}
            onPress={abrirNovaTransacao}
            accessibilityRole="button"
            accessibilityLabel="Adicionar transação"
          >
            <Ionicons
              name="add"
              size={27}
              color="#FFFFFF"
            />
          </TouchableOpacity>
        </View>

        {/* RESUMO FINANCEIRO */}

        <View style={estilos.cartaoSaldo}>
          <Text style={estilos.rotuloSaldo}>
            Saldo das movimentações
          </Text>

          <Text style={estilos.valorSaldo}>
            {formatarMoeda(saldoPeriodo)}
          </Text>

          <View style={estilos.linhaResumo}>
            <View style={estilos.itemResumo}>
              <View style={estilos.iconeResumoReceita}>
                <Ionicons
                  name="arrow-down"
                  size={17}
                  color="#FFFFFF"
                />
              </View>

              <View>
                <Text style={estilos.rotuloResumo}>
                  Receitas
                </Text>

                <Text style={estilos.valorResumo}>
                  {formatarMoeda(totalReceitas)}
                </Text>
              </View>
            </View>

            <View style={estilos.itemResumo}>
              <View style={estilos.iconeResumoDespesa}>
                <Ionicons
                  name="arrow-up"
                  size={17}
                  color="#FFFFFF"
                />
              </View>

              <View>
                <Text style={estilos.rotuloResumo}>
                  Despesas
                </Text>

                <Text style={estilos.valorResumo}>
                  {formatarMoeda(totalDespesas)}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* PERÍODO */}

        <View style={estilos.cabecalhoLista}>
          <Text style={estilos.tituloSecao}>
            Movimentações
          </Text>

          <View style={estilos.seletorPeriodo}>
            <Ionicons
              name="calendar-outline"
              size={16}
              color="#D92344"
            />

            <Text style={estilos.textoPeriodo}>
              Outubro 2026
            </Text>
          </View>
        </View>

        {/* PESQUISA */}

        <View style={estilos.campoBusca}>
          <Ionicons
            name="search-outline"
            size={21}
            color="#888888"
          />

          <TextInput
            style={estilos.inputBusca}
            placeholder="Buscar transação ou categoria"
            placeholderTextColor="#999999"
            value={busca}
            onChangeText={setBusca}
            autoCapitalize="none"
            autoCorrect={false}
            accessibilityLabel="Buscar transação ou categoria"
          />

          {busca.length > 0 && (
            <TouchableOpacity
              onPress={() => setBusca('')}
              accessibilityLabel="Limpar pesquisa"
            >
              <Ionicons
                name="close-circle"
                size={20}
                color="#888888"
              />
            </TouchableOpacity>
          )}
        </View>

        {/* FILTROS */}

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={estilos.filtros}
        >
          {['Todas', 'Receita', 'Despesa'].map((filtro) => {
            const ativo = filtroAtivo === filtro;

            return (
              <TouchableOpacity
                key={filtro}
                style={[
                  estilos.botaoFiltro,
                  ativo && estilos.botaoFiltroAtivo,
                ]}
                onPress={() => setFiltroAtivo(filtro)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    estilos.textoFiltro,
                    ativo && estilos.textoFiltroAtivo,
                  ]}
                >
                  {filtro === 'Todas'
                    ? 'Todas'
                    : filtro === 'Receita'
                      ? 'Receitas'
                      : 'Despesas'}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* LISTA DE TRANSAÇÕES */}

        {gruposPorData.length > 0 ? (
          gruposPorData.map(([data, itens]) => (
            <View key={data} style={estilos.grupoData}>
              <Text style={estilos.tituloData}>
                {formatarData(data)}
              </Text>

              <View style={estilos.cartaoTransacoes}>
                {itens.map(renderizarTransacao)}
              </View>
            </View>
          ))
        ) : (
          <View style={estilos.estadoVazio}>
            <View style={estilos.iconeVazio}>
              <Ionicons
                name="search-outline"
                size={32}
                color="#D92344"
              />
            </View>

            <Text style={estilos.tituloVazio}>
              Nenhuma transação encontrada
            </Text>

            <Text style={estilos.textoVazio}>
              Tente mudar os filtros ou pesquisar outro nome.
            </Text>

            <TouchableOpacity
              style={estilos.botaoLimpar}
              onPress={() => {
                setBusca('');
                setFiltroAtivo('Todas');
              }}
            >
              <Text style={estilos.textoBotaoLimpar}>
                Limpar filtros
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* RODAPÉ DA LISTA */}

        <Text style={estilos.rodape}>
          Exibindo {transacoesFiltradas.length}{' '}
          {transacoesFiltradas.length === 1
            ? 'transação'
            : 'transações'}
        </Text>
      </ScrollView>
    </View>
  );
  function formatarData(data) {
    const [ano, mes, dia] = data.split('-');

    const meses = [
        'jan.',
        'fev.',
        'mar.',
        'abr.',
        'mai.',
        'jun.',
        'jul.',
        'ago.',
        'set.',
        'out.',
        'nov.',
        'dez.',
    ];
    return `${dia} ${meses[Number(mes) - 1]} ${ano}`;
}


}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  conteudo: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 28,
  },

  cabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 23,
  },

  subtitulo: {
    color: '#888888',
    fontSize: 12,
    marginBottom: 5,
  },

  titulo: {
    color: '#252525',
    fontSize: 25,
    fontWeight: '800',
  },

  botaoAdicionar: {
    width: 46,
    height: 46,
    borderRadius: 15,
    backgroundColor: '#D92344',
    alignItems: 'center',
    justifyContent: 'center',
  },

  cartaoSaldo: {
    backgroundColor: '#D92344',
    borderRadius: 22,
    padding: 21,
    marginBottom: 28,
  },

  rotuloSaldo: {
    color: '#FFFFFF',
    fontSize: 13,
    opacity: 0.9,
  },

  valorSaldo: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: '800',
    marginTop: 8,
    marginBottom: 23,
  },

  linhaResumo: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.3)',
    paddingTop: 18,
    gap: 12,
  },

  itemResumo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    minWidth: 0,
  },

  iconeResumoReceita: {
    width: 33,
    height: 33,
    borderRadius: 11,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  iconeResumoDespesa: {
    width: 33,
    height: 33,
    borderRadius: 11,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  rotuloResumo: {
    color: '#FFFFFF',
    fontSize: 11,
    opacity: 0.85,
    marginBottom: 4,
  },

  valorResumo: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },

  cabecalhoLista: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },

  tituloSecao: {
    fontSize: 18,
    fontWeight: '800',
    color: '#252525',
  },

  seletorPeriodo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: '#FCE8E6',
  },

  textoPeriodo: {
    color: '#D92344',
    fontSize: 11,
    fontWeight: '700',
  },

  campoBusca: {
    height: 49,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    backgroundColor: '#F8F8F8',
    borderWidth: 1,
    borderColor: '#EEEEEE',
    borderRadius: 14,
    marginBottom: 17,
  },

  inputBusca: {
    flex: 1,
    minWidth: 0,
    fontSize: 13,
    color: '#252525',
    paddingVertical: 10,
  },

  filtros: {
    flexDirection: 'row',
    gap: 9,
    paddingBottom: 23,
  },

  botaoFiltro: {
    paddingVertical: 10,
    paddingHorizontal: 19,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    backgroundColor: '#FFFFFF',
  },

  botaoFiltroAtivo: {
    backgroundColor: '#D92344',
    borderColor: '#D92344',
  },

  textoFiltro: {
    color: '#777777',
    fontSize: 12,
    fontWeight: '700',
  },

  textoFiltroAtivo: {
    color: '#FFFFFF',
  },

  grupoData: {
    marginBottom: 22,
  },

  tituloData: {
    color: '#777777',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 10,
  },

  cartaoTransacoes: {
    borderWidth: 1,
    borderColor: '#EEEEEE',
    borderRadius: 19,
    paddingHorizontal: 13,
    backgroundColor: '#FFFFFF',
  },

  transacao: {
    minHeight: 76,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F1F1',
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

  descricaoTransacao: {
    color: '#303030',
    fontSize: 13,
    fontWeight: '700',
  },

  categoriaTransacao: {
    color: '#888888',
    fontSize: 11,
    marginTop: 5,
  },

  areaValor: {
    alignItems: 'flex-end',
    flexShrink: 0,
  },

  valorTransacao: {
    fontSize: 12,
    fontWeight: '800',
  },

  valorReceita: {
    color: '#238B45',
  },

  valorDespesa: {
    color: '#D92344',
  },

  tipoTransacao: {
    color: '#999999',
    fontSize: 10,
    marginTop: 5,
  },

  estadoVazio: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 45,
  },

  iconeVazio: {
    width: 64,
    height: 64,
    borderRadius: 22,
    backgroundColor: '#FCE8E6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 17,
  },

  tituloVazio: {
    color: '#303030',
    fontSize: 15,
    fontWeight: '800',
    textAlign: 'center',
  },

  textoVazio: {
    color: '#888888',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 19,
    marginTop: 8,
  },

  botaoLimpar: {
    paddingHorizontal: 18,
    paddingVertical: 11,
    backgroundColor: '#FCE8E6',
    borderRadius: 11,
    marginTop: 17,
  },

  textoBotaoLimpar: {
    color: '#D92344',
    fontSize: 12,
    fontWeight: '800',
  },

  rodape: {
    color: '#AAAAAA',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 3,
    marginBottom: 10,
  },
});