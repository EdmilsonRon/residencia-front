
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
  Modal,
} from 'react-native';

import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import { useTransacoes } from '../../contexts/TransacoesContext';
import { useCategorias } from '../../contexts/CategoriasContext';

const LIMITE_PARCELAS = 24;

export default function NovaTransacao() {
  const {
    adicionarTransacao,
    adicionarRecorrencia,
    carregado,
  } = useTransacoes();

  const { categorias, obterCategoriasPorTipo } = useCategorias();

  const [tipo, setTipo] = useState('Despesa');
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [categoria, setCategoria] = useState('Alimentação');
  const [data, setData] = useState(new Date());
  const [mostrarSeletorData, setMostrarSeletorData] = useState(false);

  const [periodicidade, setPeriodicidade] = useState('Unica');
  const [quantidade, setQuantidade] = useState('2');
  const [salvando, setSalvando] = useState(false);

  const categoriasDisponiveis = obterCategoriasPorTipo(tipo);

  useEffect(() => {
    const disponivel = categoriasDisponiveis.some(
      (item) => item.nome === categoria
    );

    if (!disponivel) {
      setCategoria(categoriasDisponiveis[0]?.nome || '');
    }
  }, [tipo, categorias]);

  function formatarDataISO(dataEscolhida) {
    const ano = dataEscolhida.getFullYear();
    const mes = String(
      dataEscolhida.getMonth() + 1
    ).padStart(2, '0');
    const dia = String(
      dataEscolhida.getDate()
    ).padStart(2, '0');

    return `${ano}-${mes}-${dia}`;
  }

  function formatarDataBrasileira(dataEscolhida) {
    return dataEscolhida.toLocaleDateString('pt-BR');
  }

  function aoAlterarData(event, dataEscolhida) {
    if (Platform.OS === 'android') {
      setMostrarSeletorData(false);
    }

    if (dataEscolhida) {
      setData(dataEscolhida);
    }
  }

  function converterValor(valorDigitado) {
    let valorNormalizado = valorDigitado
      .trim()
      .replace(/\s/g, '');

    if (valorNormalizado.includes(',')) {
      valorNormalizado = valorNormalizado
        .replace(/\./g, '')
        .replace(',', '.');
    }

    return Number(valorNormalizado);
  }

  function obterCores() {
    return {
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
  }

  function salvarTransacao() {
    if (salvando) return;

    if (!carregado) {
      Alert.alert(
        'Aguarde',
        'Os dados do aplicativo ainda estão sendo carregados.'
      );
      return;
    }

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
        'Selecione uma categoria.'
      );
      return;
    }

    const valorNumerico = converterValor(valor);

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

    const quantidadeNumerica = Number(quantidade);

    if (
      periodicidade !== 'Unica' &&
      (
        !Number.isInteger(quantidadeNumerica) ||
        quantidadeNumerica < 2 ||
        quantidadeNumerica > LIMITE_PARCELAS
      )
    ) {
      Alert.alert(
        'Quantidade inválida',
        'Informe uma quantidade entre 2 e 24 lançamentos.'
      );
      return;
    }

    const cores = obterCores();

    const dados = {
      descricao: descricao.trim(),
      categoria,
      data: formatarDataISO(data),
      valor: valorNumerico,
      tipo,
      icone: cores.icone,
      corFundo: cores.corFundo,
      corIcone: cores.corIcone,
    };

    setSalvando(true);

    try {
      if (periodicidade === 'Unica') {
        const resultado = adicionarTransacao(dados);

        if (!resultado) {
          throw new Error('Não foi possível criar a transação.');
        }

        Alert.alert(
          'Transação cadastrada!',
          'Sua movimentação foi registrada.',
          [
            {
              text: 'Continuar',
              onPress: () => router.replace('/transacoes'),
            },
          ]
        );

        return;
      }

      const resultado = adicionarRecorrencia({
        ...dados,
        quantidade: quantidadeNumerica,
        ilimitada: false,
      });

      if (!resultado) {
        setSalvando(false);

        Alert.alert(
          'Erro ao programar',
          'Não foi possível criar os lançamentos. Verifique os dados informados.'
        );

        return;
      }

      const nomeProgramacao =
        periodicidade === 'Parcelada'
          ? 'parcelas'
          : 'lançamentos mensais';

      Alert.alert(
        'Programação criada!',
        `${quantidadeNumerica} ${nomeProgramacao} foram programados. Eles aparecerão na área de lançamentos pendentes e só entrarão no saldo após sua confirmação.`,
        [
          {
            text: 'Continuar',
            onPress: () => router.replace('/transacoes'),
          },
        ]
      );
    } catch (erro) {
      console.log('Erro ao salvar transação:', erro);
      setSalvando(false);

      Alert.alert(
        'Erro',
        'Não foi possível cadastrar a transação.'
      );
    }
  }

  const opcoesPeriodicidade = [
    {
      valor: 'Unica',
      titulo: 'Única',
      descricao: 'Uma vez',
      icone: 'calendar-outline',
    },
    {
      valor: 'Parcelada',
      titulo: 'Parcelada',
      descricao: 'Compra dividida em parcelas',
      icone: 'layers-outline',
    },
    {
      valor: 'Mensal',
      titulo: 'Mensal com prazo',
      descricao: 'Ex.: aluguel ou mensalidade',
      icone: 'repeat-outline',
    },
  ];

  const exigeQuantidade = periodicidade !== 'Unica';

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
        <View style={estilos.cabecalho}>
          <TouchableOpacity
            style={estilos.botaoVoltar}
            onPress={() => router.back()}
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

        <Text style={estilos.rotulo}>
          Tipo de transação
        </Text>

        <View style={estilos.seletorTipo}>
          {['Despesa', 'Receita'].map((item) => {
            const ativo = tipo === item;
            const receita = item === 'Receita';

            return (
              <TouchableOpacity
                key={item}
                style={[
                  estilos.botaoTipo,
                  ativo && (
                    receita
                      ? estilos.receitaAtiva
                      : estilos.despesaAtiva
                  ),
                ]}
                onPress={() => setTipo(item)}
              >
                <Ionicons
                  name={
                    receita
                      ? 'arrow-down-circle-outline'
                      : 'arrow-up-circle-outline'
                  }
                  size={22}
                  color={
                    ativo
                      ? '#FFFFFF'
                      : receita
                        ? '#238B45'
                        : '#D92344'
                  }
                />

                <Text
                  style={[
                    estilos.textoTipo,
                    ativo && estilos.textoTipoAtivo,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={estilos.rotulo}>
          Valor {exigeQuantidade ? 'por lançamento' : ''}
        </Text>

        <View style={estilos.campoValor}>
          <Text style={estilos.simboloMoeda}>R$</Text>

          <TextInput
            style={estilos.inputValor}
            placeholder="0,00"
            placeholderTextColor="#BBBBBB"
            keyboardType="decimal-pad"
            value={valor}
            onChangeText={setValor}
          />
        </View>

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
            placeholder="Ex.: Compra de celular"
            placeholderTextColor="#999999"
            value={descricao}
            onChangeText={setDescricao}
            maxLength={100}
          />
        </View>

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
                  selecionada && {
                    backgroundColor: item.corFundo,
                    borderColor: item.cor,
                  },
                ]}
                onPress={() => setCategoria(item.nome)}
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
              Nenhuma categoria disponível.
            </Text>
          )}
        </View>

        <Text style={estilos.rotulo}>
          Data do primeiro lançamento
        </Text>

        <TouchableOpacity
          style={estilos.campo}
          onPress={() => setMostrarSeletorData(true)}
        >
          <Ionicons
            name="calendar-outline"
            size={21}
            color="#888888"
          />

          <Text style={estilos.textoData}>
            {formatarDataBrasileira(data)}
          </Text>

          <Ionicons
            name="chevron-down-outline"
            size={18}
            color="#888888"
          />
        </TouchableOpacity>

        <Text style={estilos.rotulo}>
          Programação
        </Text>

        <View style={estilos.opcoesPeriodicidade}>
          {opcoesPeriodicidade.map((item) => {
            const ativo = periodicidade === item.valor;

            return (
              <TouchableOpacity
                key={item.valor}
                style={[
                  estilos.opcaoPeriodicidade,
                  ativo && estilos.opcaoPeriodicidadeAtiva,
                ]}
                onPress={() => setPeriodicidade(item.valor)}
              >
                <Ionicons
                  name={item.icone}
                  size={21}
                  color={ativo ? '#D92344' : '#888888'}
                />

                <View style={estilos.textosPeriodicidade}>
                  <Text
                    style={[
                      estilos.tituloPeriodicidade,
                      ativo && { color: '#D92344' },
                    ]}
                  >
                    {item.titulo}
                  </Text>

                  <Text style={estilos.descricaoPeriodicidade}>
                    {item.descricao}
                  </Text>
                </View>

                {ativo && (
                  <Ionicons
                    name="checkmark-circle"
                    size={18}
                    color="#D92344"
                  />
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {exigeQuantidade && (
          <>
            <Text style={estilos.rotulo}>
              {periodicidade === 'Parcelada'
                ? 'Quantidade de parcelas'
                : 'Duração em meses'}
            </Text>

            <View style={estilos.campo}>
              <Ionicons
                name="layers-outline"
                size={21}
                color="#888888"
              />

              <TextInput
                style={estilos.input}
                placeholder="Ex.: 12"
                placeholderTextColor="#999999"
                keyboardType="number-pad"
                value={quantidade}
                onChangeText={(texto) => {
                  const somenteNumeros = texto.replace(/[^0-9]/g, '');

                  if (somenteNumeros === '') {
                    setQuantidade('');
                    return;
                  }

                  const numero = Number(somenteNumeros);

                  setQuantidade(
                    String(Math.min(numero, LIMITE_PARCELAS))
                  );
                }}
                maxLength={2}
              />

              <Text style={estilos.textoParcelas}>
                {periodicidade === 'Parcelada'
                  ? 'parcelas'
                  : 'meses'}
              </Text>
            </View>

            <Text style={estilos.textoLimite}>
              Você pode programar de 2 a 24 lançamentos.
            </Text>
          </>
        )}

        {exigeQuantidade && (
          <View style={estilos.avisoProgramacao}>
            <Ionicons
              name="information-circle-outline"
              size={21}
              color="#D92344"
            />

            <Text style={estilos.textoAviso}>
              Os lançamentos serão programados mensalmente,
              sempre no dia correspondente à primeira data.
              {'\n\n'}
              Eles aparecerão como pendentes e só entrarão
              no seu saldo após sua confirmação.
              {'\n\n'}
              O valor informado corresponde ao valor de cada
              parcela ou lançamento mensal.
              {'\n\n'}
              O limite máximo é de 24 lançamentos.
            </Text>
          </View>
        )}

        {Platform.OS === 'ios' && (
          <Modal
            visible={mostrarSeletorData}
            transparent
            animationType="slide"
            onRequestClose={() => setMostrarSeletorData(false)}
          >
            <View style={estilos.fundoModalData}>
              <View style={estilos.modalData}>
                <View style={estilos.cabecalhoModalData}>
                  <Text style={estilos.tituloModalData}>
                    Selecionar data
                  </Text>

                  <TouchableOpacity
                    onPress={() => setMostrarSeletorData(false)}
                  >
                    <Text style={estilos.botaoConcluirData}>
                      Concluir
                    </Text>
                  </TouchableOpacity>
                </View>

                <DateTimePicker
                  value={data}
                  mode="date"
                  display="spinner"
                  onChange={aoAlterarData}
                  maximumDate={new Date(2100, 11, 31)}
                  minimumDate={new Date(1900, 0, 1)}
                  locale="pt-BR"
                />
              </View>
            </View>
          </Modal>
        )}

        {Platform.OS === 'android' && mostrarSeletorData && (
          <DateTimePicker
            value={data}
            mode="date"
            display="default"
            onChange={aoAlterarData}
            maximumDate={new Date(2100, 11, 31)}
            minimumDate={new Date(1900, 0, 1)}
          />
        )}

        <TouchableOpacity
          style={[
            estilos.botaoSalvar,
            tipo === 'Receita' && estilos.botaoSalvarReceita,
            salvando && { opacity: 0.6 },
          ]}
          onPress={salvarTransacao}
          disabled={salvando}
        >
          <Ionicons
            name="checkmark-circle-outline"
            size={22}
            color="#FFFFFF"
          />

          <Text style={estilos.textoBotaoSalvar}>
            {salvando ? 'Salvando...' : 'Salvar transação'}
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
  },
  textoCategoria: {
    fontSize: 12,
    color: '#666666',
    fontWeight: '600',
  },
  textoData: {
    flex: 1,
    fontSize: 14,
    color: '#252525',
    paddingVertical: 13,
  },
  opcoesPeriodicidade: {
    gap: 9,
    marginBottom: 18,
  },
  opcaoPeriodicidade: {
    minHeight: 68,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    borderRadius: 14,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  opcaoPeriodicidadeAtiva: {
    borderColor: '#D92344',
    backgroundColor: '#FFF8F8',
  },
  textosPeriodicidade: {
    flex: 1,
  },
  tituloPeriodicidade: {
    color: '#333333',
    fontSize: 13,
    fontWeight: '800',
  },
  descricaoPeriodicidade: {
    color: '#999999',
    fontSize: 11,
    marginTop: 4,
  },
  textoParcelas: {
    color: '#888888',
    fontSize: 12,
  },
  textoLimite: {
    color: '#999999',
    fontSize: 11,
    marginTop: -12,
    marginBottom: 15,
  },
  avisoProgramacao: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: '#FFF4F4',
    borderRadius: 13,
    padding: 13,
    marginBottom: 15,
  },
  textoAviso: {
    flex: 1,
    color: '#777777',
    fontSize: 11,
    lineHeight: 18,
  },
  fundoModalData: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
  },
  modalData: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    padding: 20,
    paddingBottom: 30,
  },
  cabecalhoModalData: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  tituloModalData: {
    fontSize: 17,
    fontWeight: '800',
    color: '#252525',
  },
  botaoConcluirData: {
    fontSize: 15,
    fontWeight: '700',
    color: '#D92344',
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
