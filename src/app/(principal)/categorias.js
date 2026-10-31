import React, { useState } from 'react';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
  StatusBar,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { useCategorias } from '../../contexts/CategoriasContext';

const iconesDisponiveis = [
  { nome: 'cart-outline', descricao: 'Compras' },
  { nome: 'home-outline', descricao: 'Casa' },
  { nome: 'car-outline', descricao: 'Transporte' },
  { nome: 'fast-food-outline', descricao: 'Alimentação' },
  { nome: 'heart-outline', descricao: 'Saúde' },
  { nome: 'game-controller-outline', descricao: 'Lazer' },
  { nome: 'book-outline', descricao: 'Educação' },
  { nome: 'wallet-outline', descricao: 'Dinheiro' },
  { nome: 'laptop-outline', descricao: 'Trabalho' },
  { nome: 'airplane-outline', descricao: 'Viagens' },
  { nome: 'paw-outline', descricao: 'Pets' },
  { nome: 'gift-outline', descricao: 'Presentes' },
  { nome: 'shirt-outline', descricao: 'Roupas' },
  { nome: 'fitness-outline', descricao: 'Exercícios' },
  { nome: 'musical-notes-outline', descricao: 'Música' },
  { nome: 'cash-outline', descricao: 'Renda' },
  { nome: 'trending-up-outline', descricao: 'Investimentos' },
  { nome: 'ellipsis-horizontal-circle-outline', descricao: 'Outros' },
];

const coresDisponiveis = [
  { principal: '#D92344', fundo: '#FCE8E6' },
  { principal: '#238B45', fundo: '#E4F5E9' },
  { principal: '#3574C8', fundo: '#E7F0FF' },
  { principal: '#7950C7', fundo: '#F0E9FF' },
  { principal: '#C47A16', fundo: '#FFF0DD' },
  { principal: '#0891B2', fundo: '#E0F7FA' },
  { principal: '#DB2777', fundo: '#FCE7F3' },
  { principal: '#64748B', fundo: '#F1F5F9' },
];

export default function Categorias() {
  const {
    categorias,
    adicionarCategoria,
  } = useCategorias();

  const [tipoFiltro, setTipoFiltro] = useState('Despesa');
  const [modalVisivel, setModalVisivel] = useState(false);

  const [nome, setNome] = useState('');
  const [tipoNovo, setTipoNovo] = useState('Despesa');
  const [iconeSelecionado, setIconeSelecionado] = useState('cart-outline');
  const [corSelecionada, setCorSelecionada] = useState(coresDisponiveis[0]);
  const [erro, setErro] = useState('');

  const categoriasFiltradas = categorias.filter(
    (categoria) => categoria.tipo === tipoFiltro
  );

  function abrirFormulario() {
    setNome('');
    setTipoNovo(tipoFiltro);
    setIconeSelecionado(
      tipoFiltro === 'Receita' ? 'wallet-outline' : 'cart-outline'
    );
    setCorSelecionada(
      tipoFiltro === 'Receita'
        ? coresDisponiveis[1]
        : coresDisponiveis[0]
    );
    setErro('');
    setModalVisivel(true);
  }

  function fecharFormulario() {
    setModalVisivel(false);
    setErro('');
  }

  function salvarCategoria() {
    if (!nome.trim()) {
      setErro('Digite um nome para a categoria.');
      return;
    }

    const resultado = adicionarCategoria({
      nome: nome.trim(),
      tipo: tipoNovo,
      icone: iconeSelecionado,
      cor: corSelecionada.principal,
      corFundo: corSelecionada.fundo,
    });

    if (!resultado.sucesso) {
      setErro(resultado.mensagem);
      return;
    }

    setTipoFiltro(tipoNovo);
    setModalVisivel(false);
    setNome('');
    setErro('');

    if (Platform.OS === 'web') {
      // No navegador, a atualização da lista já confirma o cadastro.
      return;
    }

    Alert.alert('Categoria criada', 'Sua nova categoria foi adicionada.');
  }

  function renderizarCategoria(categoria) {
    return (
      <View key={categoria.id} style={estilos.cartaoCategoria}>
        <View
          style={[
            estilos.iconeCategoria,
            {
              backgroundColor: categoria.corFundo || '#F1F1F1',
            },
          ]}
        >
          <Ionicons
            name={categoria.icone || 'pricetag-outline'}
            size={23}
            color={categoria.cor || '#777777'}
          />
        </View>

        <View style={estilos.informacoesCategoria}>
          <Text style={estilos.nomeCategoria}>
            {categoria.nome}
          </Text>

          <Text style={estilos.tipoCategoria}>
            {categoria.tipo === 'Receita' ? 'Receita' : 'Despesa'}
          </Text>
        </View>

        <View
          style={[
            estilos.indicadorTipo,
            {
              backgroundColor:
                categoria.tipo === 'Receita' ? '#238B45' : '#D92344',
            },
          ]}
        />
      </View>
    );
  }

  return (
    <View style={estilos.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <ScrollView
        contentContainerStyle={estilos.conteudo}
        showsVerticalScrollIndicator={false}
      >
        {/* CABEÇALHO */}

        <View style={estilos.cabecalho}>
          <View style={estilos.textosCabecalho}>
            <Text style={estilos.titulo}>
              Categorias
            </Text>

            <Text style={estilos.subtitulo}>
              Organize suas receitas e despesas
            </Text>
          </View>

          <TouchableOpacity
            style={estilos.botaoAdicionar}
            onPress={abrirFormulario}
            activeOpacity={0.8}
            accessibilityLabel="Adicionar nova categoria"
          >
            <Ionicons name="add" size={27} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* RESUMO */}

        <View style={estilos.cartaoResumo}>
          <View style={estilos.resumoItem}>
            <View style={estilos.resumoIconeReceita}>
              <Ionicons
                name="arrow-down-circle-outline"
                size={22}
                color="#238B45"
              />
            </View>

            <View>
              <Text style={estilos.resumoLegenda}>
                Receitas
              </Text>

              <Text style={estilos.resumoNumero}>
                {categorias.filter((item) => item.tipo === 'Receita').length}
              </Text>
            </View>
          </View>

          <View style={estilos.divisorResumo} />

          <View style={estilos.resumoItem}>
            <View style={estilos.resumoIconeDespesa}>
              <Ionicons
                name="arrow-up-circle-outline"
                size={22}
                color="#D92344"
              />
            </View>

            <View>
              <Text style={estilos.resumoLegenda}>
                Despesas
              </Text>

              <Text style={estilos.resumoNumero}>
                {categorias.filter((item) => item.tipo === 'Despesa').length}
              </Text>
            </View>
          </View>
        </View>

        {/* FILTRO */}

        <View style={estilos.seletorTipos}>
          <TouchableOpacity
            style={[
              estilos.botaoFiltro,
              tipoFiltro === 'Despesa' && estilos.filtroDespesaAtivo,
            ]}
            onPress={() => setTipoFiltro('Despesa')}
            activeOpacity={0.8}
          >
            <Ionicons
              name="arrow-up-circle-outline"
              size={19}
              color={tipoFiltro === 'Despesa' ? '#FFFFFF' : '#D92344'}
            />

            <Text
              style={[
                estilos.textoFiltro,
                tipoFiltro === 'Despesa' && estilos.textoFiltroAtivo,
              ]}
            >
              Despesas
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              estilos.botaoFiltro,
              tipoFiltro === 'Receita' && estilos.filtroReceitaAtivo,
            ]}
            onPress={() => setTipoFiltro('Receita')}
            activeOpacity={0.8}
          >
            <Ionicons
              name="arrow-down-circle-outline"
              size={19}
              color={tipoFiltro === 'Receita' ? '#FFFFFF' : '#238B45'}
            />

            <Text
              style={[
                estilos.textoFiltro,
                tipoFiltro === 'Receita' && estilos.textoFiltroAtivo,
              ]}
            >
              Receitas
            </Text>
          </TouchableOpacity>
        </View>

        {/* LISTA DE CATEGORIAS */}

        <View style={estilos.cabecalhoLista}>
          <Text style={estilos.tituloLista}>
            {tipoFiltro === 'Receita'
              ? 'Categorias de receita'
              : 'Categorias de despesa'}
          </Text>

          <Text style={estilos.contador}>
            {categoriasFiltradas.length}
            {categoriasFiltradas.length === 1 ? ' categoria' : ' categorias'}
          </Text>
        </View>

        {categoriasFiltradas.length > 0 ? (
          <View style={estilos.listaCategorias}>
            {categoriasFiltradas.map(renderizarCategoria)}
          </View>
        ) : (
          <View style={estilos.estadoVazio}>
            <View style={estilos.iconeVazio}>
              <Ionicons
                name="pricetags-outline"
                size={34}
                color="#AAAAAA"
              />
            </View>

            <Text style={estilos.tituloVazio}>
              Nenhuma categoria encontrada
            </Text>

            <Text style={estilos.textoVazio}>
              Adicione uma categoria para organizar suas movimentações.
            </Text>

            <TouchableOpacity
              style={estilos.botaoVazio}
              onPress={abrirFormulario}
              activeOpacity={0.8}
            >
              <Ionicons name="add" size={19} color="#FFFFFF" />

              <Text style={estilos.textoBotaoVazio}>
                Criar categoria
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* BOTÃO INFERIOR */}

        <TouchableOpacity
          style={estilos.botaoNovaCategoria}
          onPress={abrirFormulario}
          activeOpacity={0.8}
        >
          <Ionicons name="add-circle-outline" size={21} color="#D92344" />

          <Text style={estilos.textoBotaoNovaCategoria}>
            Nova categoria
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* MODAL DE CADASTRO */}

      <Modal
        visible={modalVisivel}
        animationType="slide"
        transparent
        onRequestClose={fecharFormulario}
      >
        <KeyboardAvoidingView
          style={estilos.fundoModal}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={estilos.modal}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <View style={estilos.cabecalhoModal}>
                <View style={estilos.textosCabecalhoModal}>
                  <Text style={estilos.tituloModal}>
                    Nova categoria
                  </Text>

                  <Text style={estilos.subtituloModal}>
                    Personalize como organizar seu dinheiro
                  </Text>
                </View>

                <TouchableOpacity
                  style={estilos.botaoFechar}
                  onPress={fecharFormulario}
                  accessibilityLabel="Fechar formulário"
                >
                  <Ionicons name="close" size={23} color="#555555" />
                </TouchableOpacity>
              </View>

              {/* PRÉVIA */}

              <View style={estilos.previaCategoria}>
                <View
                  style={[
                    estilos.iconePrevia,
                    { backgroundColor: corSelecionada.fundo },
                  ]}
                >
                  <Ionicons
                    name={iconeSelecionado}
                    size={28}
                    color={corSelecionada.principal}
                  />
                </View>

                <View style={estilos.textoPrevia}>
                  <Text style={estilos.nomePrevia}>
                    {nome.trim() || 'Nome da categoria'}
                  </Text>

                  <Text style={estilos.tipoPrevia}>
                    {tipoNovo}
                  </Text>
                </View>
              </View>

              {/* NOME */}

              <Text style={estilos.rotulo}>
                Nome da categoria
              </Text>

              <TextInput
                style={estilos.inputNome}
                placeholder="Ex.: Pets, Assinaturas, Freelance..."
                placeholderTextColor="#999999"
                value={nome}
                onChangeText={(texto) => {
                  setNome(texto);
                  setErro('');
                }}
                maxLength={40}
                returnKeyType="done"
              />

              {/* TIPO */}

              <Text style={estilos.rotulo}>
                Tipo de categoria
              </Text>

              <View style={estilos.opcoesTipoModal}>
                <TouchableOpacity
                  style={[
                    estilos.opcaoTipoModal,
                    tipoNovo === 'Despesa' && estilos.opcaoDespesaAtiva,
                  ]}
                  onPress={() => {
                    setTipoNovo('Despesa');
                    setCorSelecionada(coresDisponiveis[0]);
                  }}
                >
                  <Ionicons
                    name="arrow-up-circle-outline"
                    size={21}
                    color={tipoNovo === 'Despesa' ? '#FFFFFF' : '#D92344'}
                  />

                  <Text
                    style={[
                      estilos.textoOpcaoTipo,
                      tipoNovo === 'Despesa' && estilos.textoOpcaoTipoAtivo,
                    ]}
                  >
                    Despesa
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    estilos.opcaoTipoModal,
                    tipoNovo === 'Receita' && estilos.opcaoReceitaAtiva,
                  ]}
                  onPress={() => {
                    setTipoNovo('Receita');
                    setCorSelecionada(coresDisponiveis[1]);
                  }}
                >
                  <Ionicons
                    name="arrow-down-circle-outline"
                    size={21}
                    color={tipoNovo === 'Receita' ? '#FFFFFF' : '#238B45'}
                  />

                  <Text
                    style={[
                      estilos.textoOpcaoTipo,
                      tipoNovo === 'Receita' && estilos.textoOpcaoTipoAtivo,
                    ]}
                  >
                    Receita
                  </Text>
                </TouchableOpacity>
              </View>

              {/* ÍCONES */}

              <Text style={estilos.rotulo}>
                Escolha um ícone
              </Text>

              <View style={estilos.gradeIcones}>
                {iconesDisponiveis.map((item) => (
                  <TouchableOpacity
                    key={item.nome}
                    style={[
                      estilos.opcaoIcone,
                      iconeSelecionado === item.nome &&
                        estilos.opcaoIconeAtiva,
                      iconeSelecionado === item.nome && {
                        borderColor: corSelecionada.principal,
                        backgroundColor: corSelecionada.fundo,
                      },
                    ]}
                    onPress={() => setIconeSelecionado(item.nome)}
                    accessibilityLabel={item.descricao}
                  >
                    <Ionicons
                      name={item.nome}
                      size={23}
                      color={
                        iconeSelecionado === item.nome
                          ? corSelecionada.principal
                          : '#777777'
                      }
                    />
                  </TouchableOpacity>
                ))}
              </View>

              {/* CORES */}

              <Text style={estilos.rotulo}>
                Escolha uma cor
              </Text>

              <View style={estilos.gradeCores}>
                {coresDisponiveis.map((cor) => (
                  <TouchableOpacity
                    key={cor.principal}
                    style={[
                      estilos.opcaoCor,
                      { backgroundColor: cor.principal },
                      corSelecionada.principal === cor.principal &&
                        estilos.opcaoCorAtiva,
                    ]}
                    onPress={() => setCorSelecionada(cor)}
                    accessibilityLabel={`Selecionar cor ${cor.principal}`}
                  >
                    {corSelecionada.principal === cor.principal && (
                      <Ionicons
                        name="checkmark"
                        size={19}
                        color="#FFFFFF"
                      />
                    )}
                  </TouchableOpacity>
                ))}
              </View>

              {/* ERRO */}

              {erro ? (
                <View style={estilos.caixaErro}>
                  <Ionicons
                    name="alert-circle-outline"
                    size={19}
                    color="#D92344"
                  />

                  <Text style={estilos.textoErro}>
                    {erro}
                  </Text>
                </View>
              ) : null}

              {/* AÇÕES */}

              <TouchableOpacity
                style={[
                  estilos.botaoSalvar,
                  {
                    backgroundColor:
                      tipoNovo === 'Receita' ? '#238B45' : '#D92344',
                  },
                ]}
                onPress={salvarCategoria}
                activeOpacity={0.8}
              >
                <Ionicons
                  name="checkmark-circle-outline"
                  size={21}
                  color="#FFFFFF"
                />

                <Text style={estilos.textoBotaoSalvar}>
                  Salvar categoria
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={estilos.botaoCancelar}
                onPress={fecharFormulario}
              >
                <Text style={estilos.textoBotaoCancelar}>
                  Cancelar
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

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
});