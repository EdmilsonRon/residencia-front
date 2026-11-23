
import { StyleSheet } from 'react-native';

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6FA',
  },

  conteudo: {
    padding: 20,
    paddingBottom: 30,
  },

  cabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },

  botaoVoltar: {
    width: 42,
    height: 42,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },

  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222222',
  },

  cartaoPerfil: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    alignItems: 'center',
    padding: 25,
    marginBottom: 25,
  },

  avatar: {
    width: 95,
    height: 95,
    borderRadius: 50,
    backgroundColor: '#6C63FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },

  nome: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222222',
    marginBottom: 5,
    textAlign: 'center',
  },

  email: {
    fontSize: 14,
    color: '#777777',
    marginBottom: 20,
  },

  botaoEditar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6C63FF',
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: 10,
  },

  textoBotaoEditar: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },

  tituloSecao: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222222',
    marginBottom: 12,
  },

  cartaoInformacoes: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 15,
    marginBottom: 25,
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
    backgroundColor: '#F0EFFF',
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
    marginBottom: 4,
  },

  valor: {
    fontSize: 15,
    fontWeight: '500',
    color: '#222222',
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
    paddingVertical: 16,
  },

  iconeOpcao: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#F0EFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  textoOpcao: {
    flex: 1,
    fontSize: 15,
    color: '#333333',
    fontWeight: '500',
  },

  botaoSair: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF0F0',
    paddingVertical: 15,
    borderRadius: 12,
  },

  textoBotaoSair: {
    color: '#E53935',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },

  versao: {
    textAlign: 'center',
    color: '#AAAAAA',
    fontSize: 12,
    marginTop: 20,
  },
});

export default estilos;
