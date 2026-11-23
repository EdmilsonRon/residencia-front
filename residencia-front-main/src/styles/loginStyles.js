import { StyleSheet } from 'react-native';

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  conteudo: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 26,
    paddingTop: 45,
    paddingBottom: 25,
  },

  cabecalho: {
    alignItems: 'center',
    marginBottom: 38,
  },

  logo: {
    width: 76,
    height: 76,
    borderRadius: 24,
    backgroundColor: '#D92344',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },

  nomeAplicativo: {
    fontSize: 27,
    fontWeight: '800',
    color: '#252525',
    letterSpacing: -0.5,
  },

  subtitulo: {
    fontSize: 14,
    color: '#777777',
    marginTop: 9,
    textAlign: 'center',
  },

  formulario: {
    width: '100%',
  },

  titulo: {
    fontSize: 27,
    fontWeight: '700',
    color: '#252525',
  },

  descricao: {
    fontSize: 14,
    color: '#777777',
    marginTop: 8,
    marginBottom: 27,
  },

  rotulo: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 9,
    marginTop: 16,
  },

  campo: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 54,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    paddingHorizontal: 15,
    backgroundColor: '#FAFAFA',
    gap: 11,
  },

  campoErro: {
    borderColor: '#D92344',
  },

  input: {
    flex: 1,
    height: '100%',
    fontSize: 14,
    color: '#252525',
  },

  areaErro: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginTop: 12,
  },

  textoErro: {
    flex: 1,
    fontSize: 13,
    color: '#D92344',
    lineHeight: 19,
  },

  botaoRecuperar: {
    alignSelf: 'flex-end',
    marginTop: 14,
    paddingVertical: 5,
  },

  textoRecuperar: {
    fontSize: 13,
    fontWeight: '600',
    color: '#D92344',
  },

  botaoEntrar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 54,
    borderRadius: 12,
    backgroundColor: '#D92344',
    marginTop: 27,
    gap: 10,
  },

  textoBotaoEntrar: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  areaCadastro: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 26,
    gap: 5,
  },

  textoCadastro: {
    fontSize: 13,
    color: '#777777',
  },

  linkCadastro: {
    fontSize: 13,
    fontWeight: '700',
    color: '#D92344',
  },

  rodape: {
    fontSize: 11,
    color: '#AAAAAA',
    textAlign: 'center',
    marginTop: 35,
  },
});
export default estilos;