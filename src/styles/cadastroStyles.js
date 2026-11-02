import { StyleSheet } from 'react-native';

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  conteudo: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 35,
    paddingBottom: 24,
    justifyContent: 'center',
  },

  cabecalho: {
    alignItems: 'center',
    marginBottom: 30,
  },

  logo: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: '#D92344',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },

  nomeAplicativo: {
    fontSize: 24,
    fontWeight: '800',
    color: '#252525',
  },

  subtitulo: {
    fontSize: 13,
    color: '#777777',
    textAlign: 'center',
    marginTop: 7,
  },

  formulario: {
    width: '100%',
    maxWidth: 440,
    alignSelf: 'center',
  },

  titulo: {
    fontSize: 25,
    fontWeight: '800',
    color: '#252525',
    marginBottom: 7,
  },

  descricao: {
    fontSize: 13,
    color: '#777777',
    marginBottom: 23,
  },

  rotulo: {
    fontSize: 13,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 8,
  },

  campo: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#EAEAEA',
    borderRadius: 14,
    paddingHorizontal: 14,
    marginBottom: 17,
    gap: 10,
  },

  input: {
    flex: 1,
    minWidth: 0,
    paddingVertical: 13,
    fontSize: 14,
    color: '#252525',
  },

  areaTermos: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 2,
    marginBottom: 22,
    gap: 10,
  },

  checkbox: {
    width: 21,
    height: 21,
    borderWidth: 1.5,
    borderColor: '#CCCCCC',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },

  checkboxSelecionado: {
    backgroundColor: '#D92344',
    borderColor: '#D92344',
  },

  textoTermos: {
    flex: 1,
    fontSize: 12,
    lineHeight: 19,
    color: '#666666',
  },

  botaoCadastrar: {
    minHeight: 54,
    backgroundColor: '#D92344',
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: 18,
  },

  textoBotaoCadastrar: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  areaLogin: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 23,
    gap: 5,
  },

  textoLogin: {
    fontSize: 13,
    color: '#777777',
  },

  linkLogin: {
    fontSize: 13,
    fontWeight: '800',
    color: '#D92344',
  },

  rodape: {
    fontSize: 11,
    color: '#AAAAAA',
    textAlign: 'center',
    marginTop: 28,
  },
});
export default estilos;