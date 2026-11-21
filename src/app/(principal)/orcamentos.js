
import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { useTransacoes } from '../../contexts/TransacoesContext';
import { useCategorias } from '../../contexts/CategoriasContext';
import { useOrcamentos } from '../../contexts/OrcamentosContext';

import estilos from '../../styles/orcamentosStyles';

export default function Orcamentos() {
  const { transacoes } = useTransacoes();
  const { categorias } = useCategorias();

  const {
    orcamentos,
    adicionarOrcamento,
    editarOrcamento,
    excluirOrcamento,
  } = useOrcamentos();

  const [modalVisivel, setModalVisivel] = useState(false);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState(null);
  const [limite, setLimite] = useState('');
  const [orcamentoEditando, setOrcamentoEditando] = useState(null);

  const categoriasDespesa = categorias.filter(
    (categoria) => categoria.tipo === 'Despesa'
  );

  const gastosPorCategoria = useMemo(() => {
    const gastos = {};
    const hoje = new Date();

    transacoes.forEach((transacao) => {
      if (transacao.tipo !== 'Despesa') return;

      const dataTransacao = new Date(transacao.data + 'T12:00:00');

      if (
        dataTransacao.getMonth() !== hoje.getMonth() ||
        dataTransacao.getFullYear() !== hoje.getFullYear()
      ) {
        return;
      }

      const nomeCategoria = transacao.categoria;

      gastos[nomeCategoria] =
        (gastos[nomeCategoria] || 0) + Number(transacao.valor || 0);
    });

    return gastos;
  }, [transacoes]);

  const totalLimites = orcamentos.reduce(
    (total, item) => total + Number(item.limite || 0),
    0
  );

  const totalGastos = orcamentos.reduce(
    (total, item) =>
      total + (gastosPorCategoria[item.categoria] || 0),
    0
  );

  function dinheiro(valor) {
    return Number(valor || 0).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  }

  function abrirModal(orcamento = null) {
    if (orcamento) {
      setOrcamentoEditando(orcamento);
      setCategoriaSelecionada(orcamento.categoria);
      setLimite(String(orcamento.limite));
    } else {
      setOrcamentoEditando(null);
      setCategoriaSelecionada(null);
      setLimite('');
    }

    setModalVisivel(true);
  }

  function salvarOrcamento() {
    const valorLimite = Number(limite.replace(',', '.'));

    if (!categoriaSelecionada) {
      Alert.alert('Atenção', 'Selecione uma categoria.');
      return;
    }

    if (!valorLimite || valorLimite <= 0) {
      Alert.alert('Atenção', 'Informe um limite válido.');
      return;
    }

    const jaExiste = orcamentos.some(
      (item) =>
        item.categoria === categoriaSelecionada &&
        item.id !== orcamentoEditando?.id
    );

    if (jaExiste) {
      Alert.alert(
        'Categoria já utilizada',
        'Já existe um orçamento para essa categoria.'
      );
      return;
    }

    const dadosOrcamento = {
      categoria: categoriaSelecionada,
      limite: valorLimite,
    };

    if (orcamentoEditando) {
      editarOrcamento(
        orcamentoEditando.id,
        dadosOrcamento
      );
    } else {
      adicionarOrcamento(dadosOrcamento);
    }

    setModalVisivel(false);
    setOrcamentoEditando(null);
    setCategoriaSelecionada(null);
    setLimite('');
  }

  function confirmarExclusao(id) {
    Alert.alert(
      'Excluir orçamento',
      'Deseja excluir este orçamento?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => excluirOrcamento(id),
        },
      ]
    );
  }

  return (
    <View style={estilos.container}>
      <ScrollView
        contentContainerStyle={estilos.conteudo}
        showsVerticalScrollIndicator={false}
      >
        <View style={estilos.cabecalho}>
          <View>
            <Text style={estilos.titulo}>Orçamentos</Text>

            <Text style={estilos.subtitulo}>
              Controle seus limites mensais
            </Text>
          </View>

          <TouchableOpacity
            style={estilos.botaoAdicionar}
            onPress={() => abrirModal()}
          >
            <Ionicons
              name="add"
              size={26}
              color="#FFFFFF"
            />
          </TouchableOpacity>
        </View>

        <View style={estilos.resumo}>
          <Text style={estilos.resumoTitulo}>
            Limites deste mês
          </Text>

          <Text style={estilos.resumoValor}>
            {dinheiro(totalLimites)}
          </Text>

          <View style={estilos.resumoLinha}>
            <View>
              <Text style={estilos.resumoLegenda}>
                Total gasto
              </Text>

              <Text style={estilos.resumoGasto}>
                {dinheiro(totalGastos)}
              </Text>
            </View>

            <View>
              <Text style={estilos.resumoLegenda}>
                Restante
              </Text>

              <Text
                style={[
                  estilos.resumoRestante,
                  totalLimites - totalGastos < 0 &&
                    estilos.valorNegativo,
                ]}
              >
                {dinheiro(totalLimites - totalGastos)}
              </Text>
            </View>
          </View>
        </View>

        <View style={estilos.secaoCabecalho}>
          <Text style={estilos.secaoTitulo}>
            Seus orçamentos
          </Text>

          <Text style={estilos.quantidade}>
            {orcamentos.length}
          </Text>
        </View>

        {orcamentos.length === 0 ? (
          <View style={estilos.estadoVazio}>
            <View style={estilos.vazioIcone}>
              <Ionicons
                name="wallet-outline"
                size={32}
                color="#777777"
              />
            </View>

            <Text style={estilos.vazioTitulo}>
              Nenhum orçamento criado
            </Text>

            <Text style={estilos.vazioDescricao}>
              Defina limites para suas categorias e acompanhe seus gastos.
            </Text>

            <TouchableOpacity
              style={estilos.botaoCriar}
              onPress={() => abrirModal()}
            >
              <Ionicons
                name="add"
                size={20}
                color="#FFFFFF"
              />

              <Text style={estilos.botaoCriarTexto}>
                Criar orçamento
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          orcamentos.map((orcamento) => {
            const categoria = categorias.find(
              (item) => item.nome === orcamento.categoria
            );

            const gasto =
              gastosPorCategoria[orcamento.categoria] || 0;

            const progresso = gasto / orcamento.limite;

            const porcentagem = Math.min(
              progresso * 100,
              100
            );

            const ultrapassou = gasto > orcamento.limite;

            return (
              <View
                key={orcamento.id}
                style={estilos.cartao}
              >
                <View style={estilos.cartaoCabecalho}>
                  <View style={estilos.categoriaInfo}>
                    <View
                      style={[
                        estilos.categoriaIcone,
                        {
                          backgroundColor:
                            categoria?.corFundo || '#F1F1F1',
                        },
                      ]}
                    >
                      <Ionicons
                        name={
                          categoria?.icone ||
                          'pricetag-outline'
                        }
                        size={22}
                        color={
                          categoria?.cor || '#555555'
                        }
                      />
                    </View>

                    <View>
                      <Text style={estilos.categoriaNome}>
                        {orcamento.categoria}
                      </Text>

                      <Text style={estilos.categoriaLimite}>
                        Limite: {dinheiro(orcamento.limite)}
                      </Text>
                    </View>
                  </View>

                  <View style={estilos.acoes}>
                    <TouchableOpacity
                      onPress={() => abrirModal(orcamento)}
                      style={estilos.botaoAcao}
                    >
                      <Ionicons
                        name="create-outline"
                        size={20}
                        color="#555555"
                      />
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() =>
                        confirmarExclusao(orcamento.id)
                      }
                      style={estilos.botaoAcao}
                    >
                      <Ionicons
                        name="trash-outline"
                        size={20}
                        color="#D92344"
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={estilos.gastosLinha}>
                  <Text style={estilos.gastoTexto}>
                    Gasto: {dinheiro(gasto)}
                  </Text>

                  <Text
                    style={[
                      estilos.porcentagem,
                      ultrapassou && estilos.valorNegativo,
                    ]}
                  >
                    {Math.round(progresso * 100)}%
                  </Text>
                </View>

                <View style={estilos.barraFundo}>
                  <View
                    style={[
                      estilos.barraProgresso,
                      {
                        width: `${porcentagem}%`,
                        backgroundColor: ultrapassou
                          ? '#D92344'
                          : '#238B45',
                      },
                    ]}
                  />
                </View>

                <Text
                  style={[
                    estilos.restanteTexto,
                    ultrapassou && estilos.valorNegativo,
                  ]}
                >
                  {ultrapassou
                    ? `Você ultrapassou ${dinheiro(
                        gasto - orcamento.limite
                      )}`
                    : `Restam ${dinheiro(
                        orcamento.limite - gasto
                      )}`}
                </Text>
              </View>
            );
          })
        )}
      </ScrollView>

      <Modal
        visible={modalVisivel}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisivel(false)}
      >
        <View style={estilos.modalFundo}>
          <View style={estilos.modal}>
            <View style={estilos.modalCabecalho}>
              <Text style={estilos.modalTitulo}>
                {orcamentoEditando
                  ? 'Editar orçamento'
                  : 'Novo orçamento'}
              </Text>

              <TouchableOpacity
                onPress={() => setModalVisivel(false)}
              >
                <Ionicons
                  name="close"
                  size={25}
                  color="#333333"
                />
              </TouchableOpacity>
            </View>

            <Text style={estilos.label}>
              Categoria
            </Text>

            <ScrollView
              style={estilos.listaCategorias}
              nestedScrollEnabled
            >
              {categoriasDespesa.map((categoria) => (
                <TouchableOpacity
                  key={categoria.id}
                  style={[
                    estilos.opcaoCategoria,
                    categoriaSelecionada === categoria.nome &&
                      estilos.opcaoSelecionada,
                  ]}
                  onPress={() =>
                    setCategoriaSelecionada(categoria.nome)
                  }
                >
                  <View style={estilos.opcaoCategoriaInfo}>
                    <Ionicons
                      name={
                        categoria.icone ||
                        'pricetag-outline'
                      }
                      size={20}
                      color={categoria.cor || '#555555'}
                    />

                    <Text
                      style={estilos.opcaoCategoriaTexto}
                    >
                      {categoria.nome}
                    </Text>
                  </View>

                  {categoriaSelecionada === categoria.nome && (
                    <Ionicons
                      name="checkmark-circle"
                      size={20}
                      color="#238B45"
                    />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={estilos.label}>
              Limite mensal (R$)
            </Text>

            <TextInput
              style={estilos.input}
              value={limite}
              onChangeText={setLimite}
              placeholder="Ex.: 500,00"
              keyboardType="decimal-pad"
            />

            <TouchableOpacity
              style={estilos.botaoSalvar}
              onPress={salvarOrcamento}
            >
              <Text style={estilos.botaoSalvarTexto}>
                {orcamentoEditando
                  ? 'Salvar alterações'
                  : 'Criar orçamento'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
