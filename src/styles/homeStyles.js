
import { StyleSheet } from 'react-native';

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
    textTransform: 'capitalize',
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

  resumoMesGrafico: {
    marginBottom: 18,
    padding: 14,
    borderRadius: 14,
    backgroundColor: '#FAFAFA',
  },

  nomeMesGrafico: {
    fontSize: 13,
    fontWeight: '700',
    color: '#555555',
  },

  rotuloSaldoGrafico: {
    marginTop: 8,
    fontSize: 12,
    color: '#888888',
  },

  valorSaldoGrafico: {
    marginTop: 4,
    fontSize: 24,
    fontWeight: '800',
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

  areaBarrasDuplas: {
    height: 120,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 3,
  },

  barraGrafico: {
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },

  barraReceitaGrafico: {
    backgroundColor: '#238B45',
    width: 10,
  },

  barraDespesaGrafico: {
    backgroundColor: '#D92344',
    width: 10,
  },

  barraSelecionada: {
    opacity: 1,
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
    gap: 18,
    marginTop: 16,
  },

  itemLegendaGrafico: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  pontoReceitaGrafico: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: '#238B45',
  },

  pontoDespesaGrafico: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: '#D92344',
  },

  textoLegenda: {
    fontSize: 11,
    color: '#777777',
  },

  detalhesGrafico: {
    marginTop: 18,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    gap: 12,
  },

  linhaDetalheGrafico: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  textoDetalheGrafico: {
    fontSize: 12,
    color: '#777777',
  },

  valorReceitaDetalhe: {
    fontSize: 13,
    fontWeight: '700',
    color: '#238B45',
  },

  valorDespesaDetalhe: {
    fontSize: 13,
    fontWeight: '700',
    color: '#D92344',
  },

  instrucaoGrafico: {
    marginTop: 14,
    fontSize: 10,
    textAlign: 'center',
    color: '#999999',
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

  mensagemVazia: {
    paddingVertical: 20,
    textAlign: 'center',
    color: '#888888',
    fontSize: 13,
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

export default estilos;
