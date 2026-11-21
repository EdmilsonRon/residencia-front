
import { StyleSheet } from 'react-native';

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6FA',
  },

  conteudo: {
    padding: 20,
    paddingBottom: 35,
  },

  carregando: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F6FA',
    padding: 25,
  },

  textoCarregando: {
    fontSize: 14,
    color: '#777777',
    marginTop: 12,
  },

  cabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },

  botaoVoltar: {
    width: 43,
    height: 43,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },

  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#252525',
  },

  cartaoPerfil: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    alignItems: 'center',
    padding: 25,
    marginBottom: 27,
    elevation: 2,
    shadowColor: '#000000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },

  avatar: {
    width: 95,
    height: 95,
    borderRadius: 50,
    backgroundColor: '#D92344',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },

  iniciais: {
    fontSize: 31,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },

  nome: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#252525',
    marginBottom: 5,
    textAlign: 'center',
  },

  email: {
    fontSize: 14,
    color: '#777777',
    marginBottom: 13,
    textAlign: 'center',
  },

  seloConta: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EAF7EE',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 5,
    marginBottom: 20,
  },

  textoSelo: {
    color: '#238B45',
    fontSize: 12,
    fontWeight: '600',
  },

  botaoEditar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D92344',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 11,
    gap: 8,
  },

  textoBotaoEditar: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },

  tituloSecao: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#252525',
    marginBottom: 12,
  },

  cartaoInformacoes: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 15,
    marginBottom: 27,
  },

  itemInformacao: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },

  iconeInformacao: {
    width: 45,
    height: 45,
    borderRadius: 12,
    backgroundColor: '#FFF0F2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  textosInformacao: {
    flex: 1,
  },

  rotulo: {
    fontSize: 13,
    color: '#888888',
    marginBottom: 5,
  },

  valor: {
    fontSize: 15,
    fontWeight: '600',
    color: '#252525',
  },

  divisor: {
    height: 1,
    backgroundColor: '#EEEEEE',
  },

  cartaoOpcoes: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 15,
    marginBottom: 25,
  },

  opcao: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
  },

  iconeOpcao: {
    width: 43,
    height: 43,
    borderRadius: 12,
    backgroundColor: '#FFF0F2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  textosOpcao: {
    flex: 1,
  },

  textoOpcao: {
    fontSize: 15,
    color: '#333333',
    fontWeight: '600',
  },

  descricaoOpcao: {
    fontSize: 12,
    color: '#999999',
    marginTop: 4,
  },

  botaoSair: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF0F2',
    paddingVertical: 15,
    borderRadius: 12,
    gap: 10,
  },

  textoBotaoSair: {
    color: '#D92344',
    fontSize: 16,
    fontWeight: 'bold',
  },

  botaoLogin: {
    backgroundColor: '#D92344',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 20,
  },

  versao: {
    textAlign: 'center',
    color: '#AAAAAA',
    fontSize: 12,
    marginTop: 22,
  },


  fundoModal: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },

  modal: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 23,
    paddingBottom: 30,
    maxHeight: '90%',
  },

  cabecalhoModal: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 25,
  },

  tituloModal: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#252525',
  },

  descricaoModal: {
    fontSize: 13,
    color: '#888888',
    marginTop: 5,
  },

  botaoFechar: {
    width: 38,
    height: 38,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },

  rotuloModal: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 9,
    marginTop: 15,
  },

  campoModal: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 53,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    paddingHorizontal: 14,
    backgroundColor: '#FAFAFA',
    gap: 10,
  },

  inputModal: {
    flex: 1,
    height: '100%',
    fontSize: 14,
    color: '#252525',
  },

  botaoSalvar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D92344',
    height: 54,
    borderRadius: 12,
    marginTop: 28,
    gap: 10,
  },

  botaoDesabilitado: {
    opacity: 0.6,
  },

  textoBotaoSalvar: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },

  botaoCancelar: {
    alignItems: 'center',
    paddingVertical: 15,
    marginTop: 5,
  },

  textoBotaoCancelar: {
    fontSize: 14,
    fontWeight: '600',
    color: '#777777',
  },
});

export default estilos;
