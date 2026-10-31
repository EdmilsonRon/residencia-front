import React, { useState, useEffect } from 'react';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTransacoes } from '../../contexts/TransacoesContext';
import { useCategorias } from '../../contexts/CategoriasContext';

export default function NovaTransacao() {
  const { adicionarTransacao } = useTransacoes();

  const { categorias, obterCategoriasPorTipo } = useCategorias();

  const [tipo, setTipo] = useState('Despesa');
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [categoria, setCategoria] = useState('Alimentação');

  const [data, setData] = useState(
    new Date().toISOString().slice(0, 10)
  );

  const categoriasDisponiveis = obterCategoriasPorTipo(tipo);

  useEffect(() => {
    const categoriaAindaDisponivel = categoriasDisponiveis.some(
      (item) => item.nome === categoria
    );

    if (!categoriaAindaDisponivel) {
      setCategoria(categoriasDisponiveis[0]?.nome || '');
    }
  }, [tipo, categorias]);


  function salvarTransacao() {
    if (!descricao.trim()) {
      Alert.alert(
        'Descrição obrigatória',
        'Informe o nome da transação.'
      );
      return;
    }
    if (!categoria) {
        Alert.alert(
            'Categoria obrigatória',
            'Selecione uma categoria para a transação.'
        );
        return;
    }

    // Aceita valores como 150, 150.50 ou 150,50.
    const valorNormalizado = valor.trim().replace(',', '.');
    const valorNumerico = Number(valorNormalizado);

    if (
      !valor.trim() ||
      !Number.isFinite(valorNumerico) ||
      valorNumerico <= 0
    ) {
      Alert.alert(
        'Valor inválido',
        'Digite um valor maior que zero.'
      );
      return;
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(data)) {
      Alert.alert(
        'Data inválida',
        'Informe a data no formato AAAA-MM-DD.'
      );
      return;
    }

    const novaTransacao = {
      descricao: descricao.trim(),
      categoria,
      data,
      valor: valorNumerico,
      tipo,
      icone:
        tipo === 'Receita'
          ? 'arrow-down-circle-outline'
          : 'arrow-up-circle-outline',
      corFundo:
        tipo === 'Receita'
          ? '#E4F5E9'
          : '#FCE8E6',
      corIcone:
        tipo === 'Receita'
          ? '#238B45'
          : '#D92344',
    };

    adicionarTransacao(novaTransacao);

    // Retorna à lista depois de registrar a movimentação.
    router.replace('/transacoes');
  }

  return (
    <KeyboardAvoidingView
      style={estilos.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={estilos.conteudo}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* CABEÇALHO */}

        <View style={estilos.cabecalho}>
          <TouchableOpacity
            style={estilos.botaoVoltar}
            onPress={() => router.back()}
            accessibilityLabel="Voltar"
          >
            <Ionicons
              name="arrow-back"
              size={23}
              color="#252525"
            />
          </TouchableOpacity>

          <View style={estilos.titulosCabecalho}>
            <Text style={estilos.titulo}>
              Nova transação
            </Text>

            <Text style={estilos.subtitulo}>
              Registre uma movimentação financeira
            </Text>
          </View>
        </View>

        {/* TIPO DE TRANSAÇÃO */}

        <Text style={estilos.rotulo}>
          Tipo de transação
        </Text>

        <View style={estilos.seletorTipo}>
          <TouchableOpacity
            style={[
              estilos.botaoTipo,
              tipo === 'Despesa' && estilos.despesaAtiva,
            ]}
            onPress={() => setTipo('Despesa')}
            activeOpacity={0.8}
          >
            <Ionicons
              name="arrow-up-circle-outline"
              size={22}
              color={tipo === 'Despesa' ? '#FFFFFF' : '#D92344'}
            />

            <Text
              style={[
                estilos.textoTipo,
                tipo === 'Despesa' && estilos.textoTipoAtivo,
              ]}
            >
              Despesa
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              estilos.botaoTipo,
              tipo === 'Receita' && estilos.receitaAtiva,
            ]}
            onPress={() => setTipo('Receita')}
            activeOpacity={0.8}
          >
            <Ionicons
              name="arrow-down-circle-outline"
              size={22}
              color={tipo === 'Receita' ? '#FFFFFF' : '#238B45'}
            />

            <Text
              style={[
                estilos.textoTipo,
                tipo === 'Receita' && estilos.textoTipoAtivo,
              ]}
            >
              Receita
            </Text>
          </TouchableOpacity>
        </View>

        {/* VALOR */}

        <Text style={estilos.rotulo}>
          Valor
        </Text>

        <View style={estilos.campoValor}>
          <Text style={estilos.simboloMoeda}>
            R$
          </Text>

          <TextInput
            style={estilos.inputValor}
            placeholder="0,00"
            placeholderTextColor="#BBBBBB"
            keyboardType="decimal-pad"
            value={valor}
            onChangeText={setValor}
            accessibilityLabel="Valor da transação"
          />
        </View>

        {/* DESCRIÇÃO */}

        <Text style={estilos.rotulo}>
          Descrição
        </Text>

        <View style={estilos.campo}>
          <Ionicons
            name="document-text-outline"
            size={21}
            color="#888888"
          />

          <TextInput
            style={estilos.input}
            placeholder="Ex.: Compra no supermercado"
            placeholderTextColor="#999999"
            value={descricao}
            onChangeText={setDescricao}
            maxLength={100}
            returnKeyType="next"
            accessibilityLabel="Descrição"
          />
        </View>

        {/* CATEGORIA */}

<Text style={estilos.rotulo}>
  Categoria
</Text>

<View style={estilos.categorias}>
  {categoriasDisponiveis.map((item) => {
    const selecionada = categoria === item.nome;

    return (
      <TouchableOpacity
        key={item.id}
        style={[
          estilos.botaoCategoria,
          selecionada && estilos.categoriaSelecionada,
          selecionada && {
            backgroundColor: item.corFundo,
            borderColor: item.cor,
          },
        ]}
        onPress={() => setCategoria(item.nome)}
        activeOpacity={0.8}
      >
        <Ionicons
          name={item.icone}
          size={16}
          color={item.cor}
        />

        <Text
          style={[
            estilos.textoCategoria,
            selecionada && {
              color: item.cor,
              fontWeight: '700',
            },
          ]}
        >
          {item.nome}
        </Text>
      </TouchableOpacity>
    );
  })}

  {categoriasDisponiveis.length === 0 && (
    <Text style={estilos.textoCategoria}>
      Nenhuma categoria disponível para esse tipo.
    </Text>
  )}
</View>

        {/* DATA */}

        <Text style={estilos.rotulo}>
          Data
        </Text>

        <View style={estilos.campo}>
          <Ionicons
            name="calendar-outline"
            size={21}
            color="#888888"
          />

          <TextInput
            style={estilos.input}
            value={data}
            onChangeText={setData}
            placeholder="AAAA-MM-DD"
            placeholderTextColor="#999999"
            maxLength={10}
            accessibilityLabel="Data da transação"
          />
        </View>

        <Text style={estilos.ajudaData}>
          Informe a data no formato AAAA-MM-DD.
        </Text>

        {/* BOTÃO SALVAR */}

        <TouchableOpacity
          style={[
            estilos.botaoSalvar,
            tipo === 'Receita' && estilos.botaoSalvarReceita,
          ]}
          onPress={salvarTransacao}
          activeOpacity={0.8}
        >
          <Ionicons
            name="checkmark-circle-outline"
            size={22}
            color="#FFFFFF"
          />

          <Text style={estilos.textoBotaoSalvar}>
            Salvar transação
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={estilos.botaoCancelar}
          onPress={() => router.back()}
        >
          <Text style={estilos.textoCancelar}>
            Cancelar
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  conteudo: {
    paddingHorizontal: 22,
    paddingTop: 22,
    paddingBottom: 35,
  },

  cabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    gap: 13,
  },

  botaoVoltar: {
    width: 43,
    height: 43,
    borderRadius: 14,
    backgroundColor: '#F7F7F7',
    alignItems: 'center',
    justifyContent: 'center',
  },

  titulosCabecalho: {
    flex: 1,
  },

  titulo: {
    fontSize: 23,
    fontWeight: '800',
    color: '#252525',
  },

  subtitulo: {
    fontSize: 12,
    color: '#888888',
    marginTop: 5,
  },

  rotulo: {
    color: '#333333',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 10,
    marginTop: 8,
  },

  seletorTipo: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 22,
  },

  botaoTipo: {
    flex: 1,
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
  },

  despesaAtiva: {
    backgroundColor: '#D92344',
    borderColor: '#D92344',
  },

  receitaAtiva: {
    backgroundColor: '#238B45',
    borderColor: '#238B45',
  },

  textoTipo: {
    fontSize: 13,
    fontWeight: '700',
    color: '#555555',
  },

  textoTipoAtivo: {
    color: '#FFFFFF',
  },

  campoValor: {
    minHeight: 65,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#EAEAEA',
    borderRadius: 15,
    paddingHorizontal: 16,
    marginBottom: 20,
    gap: 10,
  },

  simboloMoeda: {
    fontSize: 18,
    fontWeight: '800',
    color: '#D92344',
  },

  inputValor: {
    flex: 1,
    minWidth: 0,
    fontSize: 26,
    fontWeight: '800',
    color: '#252525',
    paddingVertical: 12,
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
    marginBottom: 19,
    gap: 10,
  },

  input: {
    flex: 1,
    minWidth: 0,
    fontSize: 14,
    color: '#252525',
    paddingVertical: 13,
  },

  categorias: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 9,
    marginBottom: 20,
  },

    botaoCategoria: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 7,
        paddingHorizontal: 13,
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: '#EAEAEA',
        borderRadius: 11,
        backgroundColor: '#FFFFFF',
    },

  categoriaSelecionada: {
    backgroundColor: '#FCE8E6',
    borderColor: '#D92344',
  },

  textoCategoria: {
    fontSize: 12,
    color: '#666666',
    fontWeight: '600',
  },

  textoCategoriaSelecionada: {
    color: '#D92344',
    fontWeight: '800',
  },

  ajudaData: {
    fontSize: 11,
    color: '#888888',
    marginTop: -12,
    marginBottom: 20,
  },

  botaoSalvar: {
    minHeight: 55,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
    backgroundColor: '#D92344',
    borderRadius: 15,
    marginTop: 12,
  },

  botaoSalvarReceita: {
    backgroundColor: '#238B45',
  },

  textoBotaoSalvar: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },

  botaoCancelar: {
    alignItems: 'center',
    paddingVertical: 17,
  },

  textoCancelar: {
    fontSize: 13,
    fontWeight: '700',
    color: '#777777',
  },
});