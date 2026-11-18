
import { StyleSheet } from 'react-native';

const estilos = StyleSheet.create({

  // TELA PRINCIPAL

  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },

  conteudo: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 35,
  },

  // CABEÇALHO

  cabecalho: {
    marginBottom: 24,
  },

  titulo: {
    fontSize: 25,
    fontWeight: '800',
    color: '#222222',
  },

  subtitulo: {
    fontSize: 13,
    color: '#777777',
    marginTop: 6,
    lineHeight: 20,
  },

  // CARTÃO DE PONTUAÇÃO

  cartaoPontuacao: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 25,
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },

  rotuloPontuacao: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555555',
  },

  linhaPontuacao: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 12,
  },

  valorPontuacao: {
    fontSize: 54,
    fontWeight: '800',
    color: '#D92344',
  },

  pontuacaoMaxima: {
    fontSize: 17,
    color: '#999999',
    marginLeft: 6,
  },

  descricaoPontuacao: {
    fontSize: 13,
    color: '#777777',
    marginTop: 8,
    lineHeight: 19,
  },

  barraFundo: {
    height: 10,
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 18,
  },

  barraProgresso: {
    height: '100%',
    backgroundColor: '#D92344',
    borderRadius: 10,
  },

  avisoAnaliseParcial: {
    backgroundColor: '#FFF4DF',
    borderRadius: 10,
    padding: 12,
    marginTop: 15,
  },

  textoAvisoAnaliseParcial: {
    fontSize: 12,
    color: '#946200',
    lineHeight: 18,
  },

  // TÍTULOS DAS SEÇÕES

  secao: {
    marginBottom: 25,
  },

  tituloSecao: {
    fontSize: 18,
    fontWeight: '800',
    color: '#222222',
    marginBottom: 5,
  },

  descricaoSecao: {
    fontSize: 12,
    color: '#888888',
    marginBottom: 15,
    lineHeight: 18,
  },

  // DIMENSÕES FINANCEIRAS

  cartaoDimensao: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },

  linhaDimensao: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  nomeDimensao: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333333',
    flex: 1,
  },

  valorDimensao: {
    fontSize: 15,
    fontWeight: '800',
    color: '#D92344',
    marginLeft: 10,
  },

  barraDimensaoFundo: {
    height: 7,
    backgroundColor: '#EEEEEE',
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 13,
  },

  barraDimensao: {
    height: '100%',
    backgroundColor: '#238B45',
    borderRadius: 10,
  },

  textoDimensaoIndisponivel: {
    fontSize: 12,
    color: '#999999',
    marginTop: 10,
  },

  // RESUMO FINANCEIRO

  resumoContainer: {
    flexDirection: 'row',
    gap: 12,
  },

  cartaoResumo: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 15,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },

  rotuloResumo: {
    fontSize: 12,
    color: '#777777',
    marginBottom: 9,
  },

  valorResumo: {
    fontSize: 17,
    fontWeight: '800',
    color: '#333333',
  },

  valorReceita: {
    color: '#238B45',
  },

  valorDespesa: {
    color: '#D92344',
  },

  valorAporte: {
    color: '#4775B8',
  },

  // PONTOS POSITIVOS E ALERTAS

  cartaoInformacao: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },

  linhaInformacao: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  iconeInformacao: {
    width: 34,
    height: 34,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  iconePositivo: {
    backgroundColor: '#E4F5E9',
  },

  iconeAlerta: {
    backgroundColor: '#FFF0DF',
  },

  iconeRecomendacao: {
    backgroundColor: '#FCE8E6',
  },

  textoInformacao: {
    flex: 1,
    fontSize: 13,
    color: '#555555',
    lineHeight: 20,
  },

  mensagemVazia: {
    fontSize: 13,
    color: '#999999',
    lineHeight: 20,
    textAlign: 'center',
    paddingVertical: 15,
  },

  // HISTÓRICO

  cartaoHistorico: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },

  linhaHistorico: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },

  nomeMesHistorico: {
    fontSize: 13,
    fontWeight: '600',
    color: '#444444',
  },

  valorHistorico: {
    fontSize: 14,
    fontWeight: '800',
    color: '#D92344',
  },

  // BOTÕES

  botaoPrincipal: {
    backgroundColor: '#D92344',
    borderRadius: 13,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },

  textoBotaoPrincipal: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },

});

export default estilos;
