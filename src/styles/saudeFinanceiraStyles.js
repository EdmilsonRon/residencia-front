import { StyleSheet } from 'react-native';

// Mesmo padrão visual de relatoriosStyles: fundo #F8F8F8, cartões brancos
// com borda #EEEEEE e vermelho #D92344 como cor principal.
const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },

  conteudo: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 20,
  },

  cabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
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

  // ---- seletor de mês ----
  seletorMes: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    paddingHorizontal: 6,
    paddingVertical: 4,
    marginBottom: 16,
  },

  botaoMes: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },

  textoMes: {
    fontSize: 14,
    fontWeight: '700',
    color: '#252525',
  },

  // ---- cartão da pontuação ----
  cartaoPontuacao: {
    borderRadius: 22,
    paddingVertical: 24,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 14,
  },

  notaGrande: {
    fontSize: 52,
    fontWeight: '800',
    lineHeight: 58,
  },

  notaDe: {
    fontSize: 13,
    color: '#666666',
    marginTop: -2,
  },

  rotuloStatus: {
    fontSize: 22,
    fontWeight: '800',
    marginTop: 14,
  },

  mensagemStatus: {
    fontSize: 14,
    color: '#444444',
    marginTop: 6,
    textAlign: 'center',
  },

  variacao: {
    fontSize: 12,
    color: '#666666',
    marginTop: 5,
    textAlign: 'center',
  },

  // ---- cartões brancos ----
  cartao: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },

  tituloCartao: {
    fontSize: 15,
    fontWeight: '800',
    color: '#252525',
    marginBottom: 6,
  },

  subtituloCartao: {
    fontSize: 11,
    color: '#888888',
    marginBottom: 6,
    lineHeight: 15,
  },

  tituloPositivo: {
    fontSize: 15,
    fontWeight: '800',
    color: '#238B45',
    marginBottom: 6,
  },

  tituloAtencao: {
    fontSize: 15,
    fontWeight: '800',
    color: '#D92344',
    marginBottom: 6,
  },

  // ---- diagnóstico por dimensão ----
  linhaDimensao: {
    paddingVertical: 11,
    borderTopWidth: 1,
    borderTopColor: '#F1F1F1',
  },

  topoDimensao: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  nomeDimensao: {
    fontSize: 14,
    color: '#252525',
    flexShrink: 1,
    paddingRight: 8,
  },

  notaDimensao: {
    fontSize: 14,
    fontWeight: '800',
  },

  trilhaBarra: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ECECEC',
    marginTop: 8,
    overflow: 'hidden',
  },

  barra: {
    height: 8,
    borderRadius: 4,
  },

  descricaoDimensao: {
    fontSize: 12,
    color: '#777777',
    marginTop: 7,
    lineHeight: 17,
  },

  // ---- textos de listas ----
  itemTexto: {
    fontSize: 14,
    color: '#333333',
    lineHeight: 20,
    paddingVertical: 9,
    borderTopWidth: 1,
    borderTopColor: '#F1F1F1',
  },

  tituloRecomendacao: {
    fontSize: 14,
    fontWeight: '800',
    color: '#252525',
  },

  detalheRecomendacao: {
    fontSize: 12,
    color: '#777777',
    marginTop: 3,
    lineHeight: 17,
  },

  itemRecomendacao: {
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F1F1',
  },

  // ---- tabela "Como chegamos" ----
  linhaTabela: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F1F1',
  },

  textoTabela: {
    fontSize: 14,
    color: '#252525',
    flexShrink: 1,
    paddingRight: 8,
  },

  valorTabela: {
    fontSize: 14,
    color: '#252525',
  },

  textoTotal: {
    fontSize: 14,
    fontWeight: '800',
    color: '#252525',
  },

  // ---- evolução da pontuação ----
  graficoBarras: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    height: 120,
    marginTop: 10,
  },

  colunaBarra: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: 52,
  },

  barraHistorico: {
    width: 42,
    borderRadius: 10,
  },

  valorBarra: {
    fontSize: 11,
    fontWeight: '700',
    color: '#555555',
    marginBottom: 4,
  },

  nomeBarra: {
    fontSize: 11,
    color: '#777777',
    marginTop: 6,
  },

  // ---- avisos ----
  aviso: {
    fontSize: 11,
    color: '#888888',
    marginBottom: 8,
    textAlign: 'left',
  },

  vazio: {
    alignItems: 'center',
    paddingVertical: 30,
  },

  textoVazio: {
    fontSize: 14,
    color: '#777777',
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 20,
  },

  // ---- rodapé com botão ----
  rodape: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 14,
    backgroundColor: '#F8F8F8',
  },

  botaoPrincipal: {
    height: 52,
    borderRadius: 16,
    backgroundColor: '#D92344',
    alignItems: 'center',
    justifyContent: 'center',
  },

  textoBotaoPrincipal: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
});

export default estilos;
