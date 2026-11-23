
import { StyleSheet, Platform } from 'react-native';

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  conteudo: {
    paddingHorizontal: 22,
    paddingTop: 24,
    paddingBottom: 35,
  },

  cabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 25,
    gap: 15,
  },

  textosCabecalho: {
    flex: 1,
  },

  titulo: {
    fontSize: 27,
    fontWeight: '800',
    color: '#252525',
  },

  subtitulo: {
    marginTop: 6,
    fontSize: 13,
    color: '#888888',
  },

  botaoAdicionar: {
    width: 49,
    height: 49,
    borderRadius: 16,
    backgroundColor: '#D92344',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },

  cartaoResumo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#EEEEEE',
    borderRadius: 18,
    padding: 17,
    marginBottom: 25,
  },

  resumoItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
  },

  resumoIconeReceita: {
    width: 43,
    height: 43,
    borderRadius: 14,
    backgroundColor: '#E4F5E9',
    alignItems: 'center',
    justifyContent: 'center',
  },

  resumoIconeDespesa: {
    width: 43,
    height: 43,
    borderRadius: 14,
    backgroundColor: '#FCE8E6',
    alignItems: 'center',
    justifyContent: 'center',
  },

  resumoLegenda: {
    color: '#777777',
    fontSize: 12,
  },

  resumoNumero: {
    marginTop: 3,
    color: '#252525',
    fontSize: 22,
    fontWeight: '800',
  },

  divisorResumo: {
    width: 1,
    height: 42,
    backgroundColor: '#E5E5E5',
    marginHorizontal: 12,
  },

  seletorTipos: {
    flexDirection: 'row',
    gap: 11,
    marginBottom: 27,
  },

  botaoFiltro: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    minHeight: 48,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    backgroundColor: '#FFFFFF',
  },

  filtroDespesaAtivo: {
    backgroundColor: '#D92344',
    borderColor: '#D92344',
  },

  filtroReceitaAtivo: {
    backgroundColor: '#238B45',
    borderColor: '#238B45',
  },

  textoFiltro: {
    fontSize: 13,
    fontWeight: '700',
    color: '#555555',
  },

  textoFiltroAtivo: {
    color: '#FFFFFF',
  },

  cabecalhoLista: {
    marginBottom: 14,
  },

  tituloLista: {
    fontSize: 17,
    fontWeight: '800',
    color: '#252525',
  },

  contador: {
    marginTop: 5,
    fontSize: 12,
    color: '#888888',
  },

  listaCategorias: {
    gap: 11,
  },

  cartaoCategoria: {
    minHeight: 76,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 13,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EEEEEE',
    borderRadius: 16,
  },

  iconeCategoria: {
    width: 48,
    height: 48,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },

  informacoesCategoria: {
    flex: 1,
    marginLeft: 13,
  },

  nomeCategoria: {
    fontSize: 14,
    fontWeight: '700',
    color: '#292929',
  },

  tipoCategoria: {
    marginTop: 5,
    fontSize: 12,
    color: '#888888',
  },

  indicadorTipo: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginLeft: 10,
  },

  estadoVazio: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 35,
    borderRadius: 18,
    backgroundColor: '#FAFAFA',
  },

  iconeVazio: {
    width: 68,
    height: 68,
    borderRadius: 22,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },

  tituloVazio: {
    fontSize: 15,
    fontWeight: '800',
    color: '#333333',
    textAlign: 'center',
  },

  textoVazio: {
    marginTop: 8,
    fontSize: 12,
    lineHeight: 19,
    color: '#888888',
    textAlign: 'center',
  },

  botaoVazio: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginTop: 20,
    paddingHorizontal: 17,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#D92344',
  },

  textoBotaoVazio: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  botaoNovaCategoria: {
    minHeight: 53,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
    marginTop: 23,
    borderWidth: 1,
    borderColor: '#F2C8CF',
    borderRadius: 15,
    backgroundColor: '#FFF9FA',
  },

  textoBotaoNovaCategoria: {
    fontSize: 14,
    fontWeight: '800',
    color: '#D92344',
  },

  fundoModal: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },

  modal: {
    width: '100%',
    maxHeight: '92%',
    paddingHorizontal: 22,
    paddingTop: 24,
    paddingBottom: Platform.OS === 'ios' ? 30 : 20,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },

  cabecalhoModal: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 21,
    gap: 10,
  },

  textosCabecalhoModal: {
    flex: 1,
  },

  tituloModal: {
    fontSize: 22,
    fontWeight: '800',
    color: '#252525',
  },

  subtituloModal: {
    marginTop: 5,
    fontSize: 12,
    color: '#888888',
  },

  botaoFechar: {
    width: 40,
    height: 40,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
  },

  previaCategoria: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    marginBottom: 21,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    borderRadius: 16,
    backgroundColor: '#FAFAFA',
  },

  iconePrevia: {
    width: 51,
    height: 51,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },

  textoPrevia: {
    flex: 1,
    marginLeft: 13,
  },

  nomePrevia: {
    fontSize: 15,
    fontWeight: '800',
    color: '#292929',
  },

  tipoPrevia: {
    marginTop: 5,
    fontSize: 12,
    color: '#888888',
  },

  rotulo: {
    marginBottom: 9,
    marginTop: 5,
    fontSize: 13,
    fontWeight: '700',
    color: '#333333',
  },

  inputNome: {
    minHeight: 51,
    paddingHorizontal: 14,
    marginBottom: 19,
    borderWidth: 1,
    borderColor: '#E7E7E7',
    borderRadius: 13,
    backgroundColor: '#FAFAFA',
    fontSize: 14,
    color: '#252525',
  },

  opcoesTipoModal: {
    flexDirection: 'row',
    gap: 11,
    marginBottom: 19,
  },

  opcaoTipoModal: {
    flex: 1,
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    borderRadius: 13,
    backgroundColor: '#FFFFFF',
  },

  opcaoDespesaAtiva: {
    backgroundColor: '#D92344',
    borderColor: '#D92344',
  },

  opcaoReceitaAtiva: {
    backgroundColor: '#238B45',
    borderColor: '#238B45',
  },

  textoOpcaoTipo: {
    fontSize: 13,
    fontWeight: '700',
    color: '#555555',
  },

  textoOpcaoTipoAtivo: {
    color: '#FFFFFF',
  },

  gradeIcones: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },

  opcaoIcone: {
    width: 43,
    height: 43,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },

  opcaoIconeAtiva: {
    borderWidth: 2,
  },

  gradeCores: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 13,
    marginBottom: 19,
  },

  opcaoCor: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },

  opcaoCorAtiva: {
    borderColor: '#333333',
    borderWidth: 2,
  },

  caixaErro: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    marginBottom: 13,
    borderRadius: 11,
    backgroundColor: '#FFF0F0',
  },

  textoErro: {
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
    color: '#C51D3A',
  },

  botaoSalvar: {
    minHeight: 53,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
    borderRadius: 14,
    marginTop: 5,
  },

  textoBotaoSalvar: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  botaoCancelar: {
    alignItems: 'center',
    paddingVertical: 16,
  },

  textoBotaoCancelar: {
    fontSize: 13,
    fontWeight: '700',
    color: '#777777',
  },
  botaoExcluirCategoria: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FCE8E6',
    marginLeft: 8,
  },
  
});

export default estilos;
