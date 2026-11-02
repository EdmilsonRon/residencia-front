import React, { useState } from 'react';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  StatusBar,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { useCategorias } from '../../contexts/CategoriasContext';
import { useTransacoes } from '../../contexts/TransacoesContext';

import estilos from '../../styles/categoriasStyles';

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
  {
    nome: 'ellipsis-horizontal-circle-outline',
    descricao: 'Outros',
  },
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
    removerCategoria,
  } = useCategorias();

  const {
    atualizarCategoriaTransacoes,
  } = useTransacoes();

  const [tipoFiltro, setTipoFiltro] = useState('Despesa');
  const [modalVisivel, setModalVisivel] = useState(false);

  const [nome, setNome] = useState('');
  const [tipoNovo, setTipoNovo] = useState('Despesa');
  const [iconeSelecionado, setIconeSelecionado] = useState('cart-outline');
  const [corSelecionada, setCorSelecionada] = useState(
    coresDisponiveis[0]
  );
  const [erro, setErro] = useState('');

  const categoriasFiltradas = categorias.filter(
    (categoria) => categoria.tipo === tipoFiltro
  );

  function abrirFormulario() {
    setNome('');
    setTipoNovo(tipoFiltro);

    setIconeSelecionado(
      tipoFiltro === 'Receita'
        ? 'wallet-outline'
        : 'cart-outline'
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
      return;
    }

    Alert.alert(
      'Categoria criada',
      'Sua nova categoria foi adicionada.'
    );
  }

  function excluirCategoria(categoria) {
    const categoriaProtegida =
      categoria.nome.trim().toLowerCase() === 'outros';

    if (categoriaProtegida) {
      Alert.alert(
        'Categoria protegida',
        'A categoria Outros não pode ser excluída.'
      );

      return;
    }

    function confirmarExclusao() {
      atualizarCategoriaTransacoes(
        categoria.nome,
        'Outros',
        categoria.tipo
      );

      const resultado = removerCategoria(categoria.id);

      if (!resultado.sucesso) {
        if (Platform.OS === 'web') {
          window.alert(resultado.mensagem);
        } else {
          Alert.alert('Erro', resultado.mensagem);
        }
      }
    }

    if (Platform.OS === 'web') {
      const confirmou = window.confirm(
        `Tem certeza que deseja excluir a categoria "${categoria.nome}"?\n\n` +
        `Todas as transações dessa categoria serão transferidas para "Outros".`
      );

      if (confirmou) {
        confirmarExclusao();
      }

      return;
    }

    Alert.alert(
      'Excluir categoria',
      `Tem certeza que deseja excluir "${categoria.nome}"?\n\n` +
        'Todas as transações dessa categoria serão transferidas para "Outros".',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: confirmarExclusao,
        },
      ]
    );
  }

  function renderizarCategoria(categoria) {
    const categoriaProtegida =
      categoria.nome.trim().toLowerCase() === 'outros';

    return (
      <View
        key={categoria.id}
        style={estilos.cartaoCategoria}
      >
        <View
          style={[
            estilos.iconeCategoria,
            {
              backgroundColor:
                categoria.corFundo || '#F1F1F1',
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
            {categoria.tipo === 'Receita'
              ? 'Receita'
              : 'Despesa'}
          </Text>
        </View>

        <View
          style={[
            estilos.indicadorTipo,
            {
              backgroundColor:
                categoria.tipo === 'Receita'
                  ? '#238B45'
                  : '#D92344',
            },
          ]}
        />

        {!categoriaProtegida && (
          <TouchableOpacity
            style={estilos.botaoExcluirCategoria}
            onPress={() => excluirCategoria(categoria)}
            activeOpacity={0.7}
            accessibilityLabel={`Excluir categoria ${categoria.nome}`}
          >
            <Ionicons
              name="trash-outline"
              size={20}
              color="#D92344"
            />
          </TouchableOpacity>
        )}
      </View>
    );
  }

  return (
    <View style={estilos.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#FFFFFF"
      />

      <ScrollView
        contentContainerStyle={estilos.conteudo}
        showsVerticalScrollIndicator={false}
      >

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
            <Ionicons
              name="add"
              size={27}
              color="#FFFFFF"
            />
          </TouchableOpacity>
        </View>


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
                {
                  categorias.filter(
                    (item) => item.tipo === 'Receita'
                  ).length
                }
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
                {
                  categorias.filter(
                    (item) => item.tipo === 'Despesa'
                  ).length
                }
              </Text>
            </View>
          </View>
        </View>


        <View style={estilos.seletorTipos}>
          <TouchableOpacity
            style={[
              estilos.botaoFiltro,
              tipoFiltro === 'Despesa' &&
                estilos.filtroDespesaAtivo,
            ]}
            onPress={() => setTipoFiltro('Despesa')}
            activeOpacity={0.8}
          >
            <Ionicons
              name="arrow-up-circle-outline"
              size={19}
              color={
                tipoFiltro === 'Despesa'
                  ? '#FFFFFF'
                  : '#D92344'
              }
            />

            <Text
              style={[
                estilos.textoFiltro,
                tipoFiltro === 'Despesa' &&
                  estilos.textoFiltroAtivo,
              ]}
            >
              Despesas
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              estilos.botaoFiltro,
              tipoFiltro === 'Receita' &&
                estilos.filtroReceitaAtivo,
            ]}
            onPress={() => setTipoFiltro('Receita')}
            activeOpacity={0.8}
          >
            <Ionicons
              name="arrow-down-circle-outline"
              size={19}
              color={
                tipoFiltro === 'Receita'
                  ? '#FFFFFF'
                  : '#238B45'
              }
            />

            <Text
              style={[
                estilos.textoFiltro,
                tipoFiltro === 'Receita' &&
                  estilos.textoFiltroAtivo,
              ]}
            >
              Receitas
            </Text>
          </TouchableOpacity>
        </View>


        <View style={estilos.cabecalhoLista}>
          <Text style={estilos.tituloLista}>
            {tipoFiltro === 'Receita'
              ? 'Categorias de receita'
              : 'Categorias de despesa'}
          </Text>

          <Text style={estilos.contador}>
            {categoriasFiltradas.length}
            {categoriasFiltradas.length === 1
              ? ' categoria'
              : ' categorias'}
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
              <Ionicons
                name="add"
                size={19}
                color="#FFFFFF"
              />

              <Text style={estilos.textoBotaoVazio}>
                Criar categoria
              </Text>
            </TouchableOpacity>
          </View>
        )}


        <TouchableOpacity
          style={estilos.botaoNovaCategoria}
          onPress={abrirFormulario}
          activeOpacity={0.8}
        >
          <Ionicons
            name="add-circle-outline"
            size={21}
            color="#D92344"
          />

          <Text style={estilos.textoBotaoNovaCategoria}>
            Nova categoria
          </Text>
        </TouchableOpacity>
      </ScrollView>


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
                  <Ionicons
                    name="close"
                    size={23}
                    color="#555555"
                  />
                </TouchableOpacity>
              </View>


              <View style={estilos.previaCategoria}>
                <View
                  style={[
                    estilos.iconePrevia,
                    {
                      backgroundColor: corSelecionada.fundo,
                    },
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


              <Text style={estilos.rotulo}>
                Tipo de categoria
              </Text>

              <View style={estilos.opcoesTipoModal}>
                <TouchableOpacity
                  style={[
                    estilos.opcaoTipoModal,
                    tipoNovo === 'Despesa' &&
                      estilos.opcaoDespesaAtiva,
                  ]}
                  onPress={() => {
                    setTipoNovo('Despesa');
                    setCorSelecionada(coresDisponiveis[0]);
                  }}
                >
                  <Ionicons
                    name="arrow-up-circle-outline"
                    size={21}
                    color={
                      tipoNovo === 'Despesa'
                        ? '#FFFFFF'
                        : '#D92344'
                    }
                  />

                  <Text
                    style={[
                      estilos.textoOpcaoTipo,
                      tipoNovo === 'Despesa' &&
                        estilos.textoOpcaoTipoAtivo,
                    ]}
                  >
                    Despesa
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    estilos.opcaoTipoModal,
                    tipoNovo === 'Receita' &&
                      estilos.opcaoReceitaAtiva,
                  ]}
                  onPress={() => {
                    setTipoNovo('Receita');
                    setCorSelecionada(coresDisponiveis[1]);
                  }}
                >
                  <Ionicons
                    name="arrow-down-circle-outline"
                    size={21}
                    color={
                      tipoNovo === 'Receita'
                        ? '#FFFFFF'
                        : '#238B45'
                    }
                  />

                  <Text
                    style={[
                      estilos.textoOpcaoTipo,
                      tipoNovo === 'Receita' &&
                        estilos.textoOpcaoTipoAtivo,
                    ]}
                  >
                    Receita
                  </Text>
                </TouchableOpacity>
              </View>


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
                    onPress={() =>
                      setIconeSelecionado(item.nome)
                    }
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


              <Text style={estilos.rotulo}>
                Escolha uma cor
              </Text>

              <View style={estilos.gradeCores}>
                {coresDisponiveis.map((cor) => (
                  <TouchableOpacity
                    key={cor.principal}
                    style={[
                      estilos.opcaoCor,
                      {
                        backgroundColor: cor.principal,
                      },
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


              <TouchableOpacity
                style={[
                  estilos.botaoSalvar,
                  {
                    backgroundColor:
                      tipoNovo === 'Receita'
                        ? '#238B45'
                        : '#D92344',
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