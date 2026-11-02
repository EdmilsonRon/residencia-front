
import { StyleSheet } from 'react-native';

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
    gap: 12,
    marginBottom: 25,
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

  rotuloSecao: {
    fontSize: 13,
    fontWeight: '700',
    color: '#444444',
    marginBottom: 10,
  },

  filtros: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 18,
  },

  filtro: {
    flex: 1,
    paddingVertical: 11,
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
    borderRadius: 18,
    padding: 18,
    marginBottom: 13,
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
    fontSize: 27,
    fontWeight: '800',
    marginTop: 7,
  },

  iconeSaldo: {
    width: 48,
    height: 48,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },

  descricaoSaldo: {
    color: '#888888',
    fontSize: 11,
    marginTop: 15,
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
    borderRadius: 16,
    padding: 15,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },

  linhaResumo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginBottom: 12,
  },

  rotuloResumo: {
    fontSize: 12,
    fontWeight: '600',
    color: '#555555',
  },

  valorResumo: {
    fontSize: 17,
    fontWeight: '800',
  },

  secao: {
    marginBottom: 25,
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
    borderRadius: 17,
    padding: 16,
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
    fontSize: 12,
    fontWeight: '700',
  },

  fundoBarra: {
    width: '100%',
    height: 9,
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    overflow: 'hidden',
  },

  barra: {
    height: '100%',
    borderRadius: 10,
  },

  filtrosCategoria: {
    flexDirection: 'row',
    backgroundColor: '#EEEEEE',
    borderRadius: 12,
    padding: 4,
    marginBottom: 13,
  },

  botaoTipoCategoria: {
    flex: 1,
    paddingVertical: 10,
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
    gap: 8,
    marginBottom: 20,
  },

  totalCategorias: {
    color: '#252525',
    fontSize: 13,
    fontWeight: '800',
  },

  itemCategoria: {
    marginBottom: 19,
  },

  linhaCategoria: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 9,
  },

  infoCategoria: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    minWidth: 0,
  },

  iconeCategoria: {
    width: 38,
    height: 38,
    borderRadius: 12,
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

  aviso: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 9,
    padding: 13,
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

export default estilos;
