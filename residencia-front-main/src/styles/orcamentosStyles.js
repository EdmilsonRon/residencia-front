
import { StyleSheet } from 'react-native';

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },

  conteudo: {
    padding: 20,
    paddingBottom: 110,
  },

  cabecalho: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },

  titulo: {
    fontSize: 27,
    fontWeight: 'bold',
    color: '#222222',
  },

  subtitulo: {
    fontSize: 14,
    color: '#777777',
    marginTop: 5,
  },

  botaoAdicionar: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: '#238B45',
    alignItems: 'center',
    justifyContent: 'center',
  },

  resumo: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 20,
    marginBottom: 28,
    elevation: 2,
  },

  resumoTitulo: {
    fontSize: 14,
    color: '#777777',
  },

  resumoValor: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#222222',
    marginTop: 8,
    marginBottom: 20,
  },

  resumoLinha: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    paddingTop: 16,
  },

  resumoLegenda: {
    fontSize: 13,
    color: '#777777',
    marginBottom: 5,
  },

  resumoGasto: {
    fontSize: 17,
    fontWeight: '600',
    color: '#D92344',
  },

  resumoRestante: {
    fontSize: 17,
    fontWeight: '600',
    color: '#238B45',
  },

  valorNegativo: {
    color: '#D92344',
  },

  secaoCabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },

  secaoTitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222222',
  },

  quantidade: {
    backgroundColor: '#E8E8E8',
    color: '#555555',
    borderRadius: 10,
    paddingHorizontal: 9,
    paddingVertical: 3,
    marginLeft: 10,
    fontSize: 12,
    fontWeight: 'bold',
  },

  cartao: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    marginBottom: 15,
    elevation: 1,
  },

  cartaoCabecalho: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  categoriaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  categoriaIcone: {
    width: 45,
    height: 45,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  categoriaNome: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222222',
  },

  categoriaLimite: {
    fontSize: 13,
    color: '#777777',
    marginTop: 4,
  },

  acoes: {
    flexDirection: 'row',
  },

  botaoAcao: {
    padding: 7,
  },

  gastosLinha: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 10,
  },

  gastoTexto: {
    fontSize: 14,
    color: '#555555',
  },

  porcentagem: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#238B45',
  },

  barraFundo: {
    height: 9,
    backgroundColor: '#EAEAEA',
    borderRadius: 10,
    overflow: 'hidden',
  },

  barraProgresso: {
    height: '100%',
    borderRadius: 10,
  },

  restanteTexto: {
    fontSize: 13,
    color: '#238B45',
    marginTop: 10,
  },

  estadoVazio: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 28,
  },

  vazioIcone: {
    width: 65,
    height: 65,
    borderRadius: 20,
    backgroundColor: '#EEEEEE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },

  vazioTitulo: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#222222',
    textAlign: 'center',
  },

  vazioDescricao: {
    fontSize: 14,
    color: '#777777',
    textAlign: 'center',
    lineHeight: 21,
    marginTop: 8,
    marginBottom: 20,
  },

  botaoCriar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#238B45',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 18,
  },

  botaoCriarTexto: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginLeft: 5,
  },

  modalFundo: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.45)',
  },

  modal: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 22,
    maxHeight: '85%',
  },

  modalCabecalho: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 22,
  },

  modalTitulo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222222',
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#444444',
    marginBottom: 10,
    marginTop: 8,
  },

  listaCategorias: {
    maxHeight: 220,
  },

  opcaoCategoria: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 13,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    marginBottom: 8,
  },

  opcaoSelecionada: {
    borderColor: '#238B45',
    backgroundColor: '#F0F9F2',
  },

  opcaoCategoriaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  opcaoCategoriaTexto: {
    fontSize: 14,
    color: '#333333',
    marginLeft: 10,
  },

  input: {
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: '#222222',
    marginBottom: 20,
  },

  botaoSalvar: {
    backgroundColor: '#238B45',
    padding: 16,
    borderRadius: 13,
    alignItems: 'center',
    marginTop: 5,
  },

  botaoSalvarTexto: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default estilos;
