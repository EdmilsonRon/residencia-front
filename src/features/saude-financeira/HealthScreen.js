import React, { useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTransacoes } from '../../contexts/TransacoesContext';
import { useCategorias } from '../../contexts/CategoriasContext';
import { useOrcamentos } from '../../contexts/OrcamentosContext';
import { obterResumoFinanceiro, gerarTextosLocais, formatarMoeda } from './calculos';
import styles from './styles';

function BarraIndicador({ valor }) {
  const cor = valor === null ? '#D9D9DE' : valor >= 70 ? '#238B45' : valor >= 40 ? '#E5A323' : '#D92344';
  return <View style={styles.trilho}><View style={[styles.preenchimento, { width: `${valor === null ? 0 : Math.max(0, Math.min(100, valor))}%`, backgroundColor: cor }]} /></View>;
}

function CartaoDimensao({ item }) {
  return (
    <View style={styles.dimensao}>
      <View style={styles.linhaDimensao}>
        <Text style={styles.nomeDimensao}>{item.titulo}</Text>
        <Text style={styles.valorDimensao}>{item.valor === null ? 'Sem dados' : `${item.valor}/100`}</Text>
      </View>
      <BarraIndicador valor={item.valor} />
      <Text style={styles.descricaoDimensao}>{item.descricao}</Text>
    </View>
  );
}

export default function HealthScreen() {
  const { transacoes } = useTransacoes();
  const { categorias } = useCategorias();
  const { orcamentos } = useOrcamentos();
  const resumo = useMemo(() => obterResumoFinanceiro(transacoes, orcamentos, categorias), [transacoes, orcamentos, categorias]);
  const textos = useMemo(() => gerarTextosLocais(resumo), [resumo]);
  const maiorCategoria = resumo.categoriasComGasto[0];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.conteudo} showsVerticalScrollIndicator={false}>
        <View style={styles.cabecalho}>
          <TouchableOpacity onPress={() => router.back()} style={styles.voltar} accessibilityLabel="Voltar">
            <Ionicons name="arrow-back" size={22} color="#252525" />
          </TouchableOpacity>
          <View style={styles.cabecalhoTexto}>
            <Text style={styles.titulo}>Saúde financeira</Text>
            <Text style={styles.subtitulo}>Uma visão dos seus hábitos financeiros</Text>
          </View>
        </View>

        <View style={styles.cartaoDestaque}>
          <View style={styles.selo}><Ionicons name="analytics-outline" size={24} color="#FFFFFF" /></View>
          <Text style={styles.tituloDestaque}>Resumo do período</Text>
          <Text style={styles.periodo}>{resumo.mesReferencia}</Text>
          <Text style={styles.textoDestaque}>{resumo.temDados ? (resumo.saldo >= 0 ? 'Seu mês está com saldo positivo' : 'Atenção ao resultado do mês') : 'Vamos começar sua análise'}</Text>
          <Text style={styles.legendaDestaque}>{resumo.temDados ? 'Indicadores calculados com os lançamentos cadastrados.' : 'Adicione movimentações para visualizar seus indicadores.'}</Text>
          <View style={styles.gradeSaldo}>
            <View style={styles.itemSaldo}><Text style={styles.rotuloSaldo}>Receitas</Text><Text style={styles.valorSaldo}>{formatarMoeda(resumo.receitas)}</Text></View>
            <View style={styles.itemSaldo}><Text style={styles.rotuloSaldo}>Despesas</Text><Text style={styles.valorSaldo}>{formatarMoeda(resumo.despesas)}</Text></View>
            <View style={styles.itemSaldo}><Text style={styles.rotuloSaldo}>Resultado</Text><Text style={[styles.valorSaldo, { color: '#FFFFFF' }]}>{formatarMoeda(resumo.saldo)}</Text></View>
          </View>
        </View>

        <View style={styles.cartao}>
          <Text style={styles.tituloSecao}>Diagnóstico por dimensão</Text>
          <Text style={styles.ajudaSecao}>Os indicadores abaixo usam somente dados disponíveis no aplicativo.</Text>
          {resumo.dimensoesDisponiveis.map((item) => <CartaoDimensao key={item.id} item={item} />)}
        </View>

        <View style={styles.cartao}>
          <Text style={styles.tituloSecao}>Análise dos seus dados</Text>
          <Text style={styles.ajudaSecao}>Leitura automática das movimentações deste mês</Text>
          {textos.map((texto, index) => (
            <View style={styles.linhaInsight} key={`${index}-${texto}`}>
              <Ionicons name="information-circle-outline" size={19} color="#C91F45" style={styles.iconeInsight} />
              <Text style={styles.textoInsight}>{texto}</Text>
            </View>
          ))}
        </View>

        <View style={styles.cartao}>
          <Text style={styles.tituloSecao}>Orçamentos e categorias</Text>
          {resumo.orcamentosAtivos.length ? resumo.orcamentosAtivos.map((item) => (
            <View style={styles.orcamentoLinha} key={item.categoria}>
              <View style={styles.linhaDimensao}><Text style={styles.nomeDimensao}>{item.categoria}</Text><Text style={styles.valorDimensao}>{Math.round(item.percentual)}%</Text></View>
              <BarraIndicador valor={Math.min(item.percentual, 100)} />
              <Text style={styles.descricaoDimensao}>{formatarMoeda(item.gasto)} de {formatarMoeda(item.limite)}</Text>
            </View>
          )) : <Text style={styles.textoVazio}>Você ainda não cadastrou orçamentos. Eles ajudam a comparar os gastos reais com os limites planejados.</Text>}
          {maiorCategoria ? <View style={styles.maiorCategoria}><Text style={styles.rotuloSaldoEscuro}>Maior categoria de despesa</Text><Text style={styles.maiorCategoriaNome}>{maiorCategoria.nome}</Text><Text style={styles.descricaoDimensao}>{formatarMoeda(maiorCategoria.valor)} ({maiorCategoria.percentual}% das despesas)</Text></View> : null}
        </View>

        <Text style={styles.rodape}>Análise educativa baseada nos lançamentos registrados. Não representa aconselhamento financeiro profissional.</Text>
      </ScrollView>
    </View>
  );
}
