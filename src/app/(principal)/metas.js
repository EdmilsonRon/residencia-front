
import React, { useState } from 'react';

import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Modal,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import { useMetas } from '../../contexts/MetasContext';
import { useTransacoes } from '../../contexts/TransacoesContext';

export default function Metas() {
  const {
    metas,
    adicionarMeta,
    excluirMeta,
  } = useMetas();

  const {
    transacoes,
    adicionarTransacao,
    excluirTransacoesDaMeta,
  } = useTransacoes();

  const [modalVisivel, setModalVisivel] = useState(false);
  const [modalValorVisivel, setModalValorVisivel] = useState(false);

  const [nome, setNome] = useState('');
  const [valorObjetivo, setValorObjetivo] = useState('');
  const [prazo, setPrazo] = useState('');

  const [valorAdicionado, setValorAdicionado] = useState('');
  const [metaSelecionada, setMetaSelecionada] = useState(null);

  function converterValor(valor) {
    return Number(
      String(valor)
        .trim()
        .replace(/\./g, '')
        .replace(',', '.')
    );
  }

  function formatarMoeda(valor) {
    return Number(valor || 0).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  }

  function formatarPercentual(valor, objetivo) {
    if (!objetivo || objetivo <= 0) {
      return 0;
    }

    return Math.min((valor / objetivo) * 100, 100);
  }

  function obterValorGuardado(metaId) {
    return transacoes
      .filter(transacao =>
        transacao.metaId === metaId &&
        transacao.tipo === 'Despesa'
      )
      .reduce(
        (total, transacao) =>
          total + Number(transacao.valor || 0),
        0
      );
  }

  function limparFormulario() {
    setNome('');
    setValorObjetivo('');
    setPrazo('');
  }

  function salvarMeta() {
    const nomeLimpo = nome.trim();
    const objetivo = converterValor(valorObjetivo);

    if (!nomeLimpo) {
      Alert.alert('Atenção', 'Informe o nome da meta.');
      return;
    }

    if (!Number.isFinite(objetivo) || objetivo <= 0) {
      Alert.alert('Valor inválido', 'Informe um objetivo válido.');
      return;
    }

    if (prazo.trim()) {
      const formatoValido = /^\d{2}\/\d{2}\/\d{4}$/.test(prazo);

      if (!formatoValido) {
        Alert.alert(
          'Prazo inválido',
          'Utilize o formato DD/MM/AAAA.'
        );
        return;
      }

      const [dia, mes, ano] = prazo.split('/').map(Number);
      const data = new Date(ano, mes - 1, dia);

      if (
        data.getDate() !== dia ||
        data.getMonth() !== mes - 1 ||
        data.getFullYear() !== ano
      ) {
        Alert.alert('Prazo inválido', 'Informe uma data válida.');
        return;
      }
    }

    adicionarMeta({
      nome: nomeLimpo,
      objetivo,
      prazo: prazo.trim(),
    });

    limparFormulario();
    setModalVisivel(false);
  }

  function abrirModalValor(meta) {
    setMetaSelecionada(meta);
    setValorAdicionado('');
    setModalValorVisivel(true);
  }

  function adicionarValor() {
    if (!metaSelecionada) {
      return;
    }

    const valor = converterValor(valorAdicionado);

    if (!Number.isFinite(valor) || valor <= 0) {
      Alert.alert(
        'Valor inválido',
        'Informe um valor maior que zero.'
      );
      return;
    }

    const guardado = obterValorGuardado(metaSelecionada.id);
    const restante = Math.max(
      metaSelecionada.objetivo - guardado,
      0
    );

    if (valor > restante) {
      Alert.alert(
        'Valor acima do necessário',
        `Faltam apenas ${formatarMoeda(restante)} para alcançar essa meta.`
      );
      return;
    }

    const hoje = new Date();

    const data = [
      hoje.getFullYear(),
      String(hoje.getMonth() + 1).padStart(2, '0'),
      String(hoje.getDate()).padStart(2, '0'),
    ].join('-');

    adicionarTransacao({
      descricao: `Aporte: ${metaSelecionada.nome}`,
      categoria: 'Investimentos',
      data,
      valor,
      tipo: 'Despesa',
      metaId: metaSelecionada.id,
      icone: 'trending-up-outline',
      corFundo: '#F0E9FF',
      corIcone: '#7950C7',
    });

    setModalValorVisivel(false);
    setMetaSelecionada(null);
    setValorAdicionado('');
  }

function removerMeta(meta) {
  Alert.alert(
    'Excluir meta',
    `Deseja excluir a meta "${meta.nome}"? As movimentações financeiras anteriores serão preservadas.`,
    [
      {
        text: 'Cancelar',
        style: 'cancel',
      },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          const resultado = await excluirMeta(meta.id);

          if (resultado?.sucesso) {
            Alert.alert(
              'Meta excluída',
              'A meta foi removida. Seu histórico financeiro foi preservado.'
            );
          }
        },
      },
    ]
  );
}

  function renderizarMeta(meta) {
    const guardado = obterValorGuardado(meta.id);

    const restante = Math.max(
      meta.objetivo - guardado,
      0
    );

    const progresso = formatarPercentual(
      guardado,
      meta.objetivo
    );

    const concluida = guardado >= meta.objetivo;

    return (
      <View key={meta.id} style={estilos.cartaoMeta}>
        <View style={estilos.cabecalhoMeta}>
          <View style={estilos.iconeMeta}>
            <Ionicons
              name="flag-outline"
              size={23}
              color="#D92344"
            />
          </View>

          <View style={estilos.informacoesMeta}>
            <Text style={estilos.nomeMeta}>
              {meta.nome}
            </Text>

            <Text style={estilos.prazoMeta}>
              {meta.prazo
                ? `Prazo: ${meta.prazo}`
                : 'Sem prazo definido'}
            </Text>
          </View>

          <TouchableOpacity
            style={estilos.botaoExcluir}
            onPress={() => removerMeta(meta)}
          >
            <Ionicons
              name="trash-outline"
              size={19}
              color="#D92344"
            />
          </TouchableOpacity>
        </View>

        <View style={estilos.valoresMeta}>
          <View>
            <Text style={estilos.rotuloValor}>
              Já guardado
            </Text>

            <Text style={estilos.valorGuardado}>
              {formatarMoeda(guardado)}
            </Text>
          </View>

          <View style={estilos.alinhamentoDireita}>
            <Text style={estilos.rotuloValor}>
              Objetivo
            </Text>

            <Text style={estilos.valorObjetivo}>
              {formatarMoeda(meta.objetivo)}
            </Text>
          </View>
        </View>

        <View style={estilos.linhaProgresso}>
          <View
            style={[
              estilos.barraProgresso,
              {
                width: `${progresso}%`,
              },
            ]}
          />
        </View>

        <View style={estilos.rodapeMeta}>
          <Text style={estilos.textoProgresso}>
            {progresso.toFixed(0)}% concluído
          </Text>

          {concluida && (
            <Text style={estilos.textoConcluida}>
              Meta alcançada!
            </Text>
          )}
        </View>

        <Text style={estilos.textoRestante}>
          Faltam {formatarMoeda(restante)}
        </Text>

        {!concluida && (
          <TouchableOpacity
            style={estilos.botaoAdicionarValor}
            activeOpacity={0.7}
            onPress={() => abrirModalValor(meta)}
          >
            <Ionicons
              name="add-circle-outline"
              size={19}
              color="#FFFFFF"
            />

            <Text style={estilos.textoBotaoAdicionar}>
              Adicionar valor
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  const totalObjetivos = metas.reduce(
    (total, meta) => total + meta.objetivo,
    0
  );

  const totalGuardado = metas.reduce(
    (total, meta) =>
      total + obterValorGuardado(meta.id),
    0
  );

  const progressoGeral = formatarPercentual(
    totalGuardado,
    totalObjetivos
  );

  return (
    <View style={estilos.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#FFFFFF"
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={estilos.conteudo}
      >
        <View style={estilos.cabecalho}>
          <TouchableOpacity
            style={estilos.botaoVoltar}
            onPress={() => router.back()}
          >
            <Ionicons
              name="arrow-back"
              size={22}
              color="#252525"
            />
          </TouchableOpacity>

          <View>
            <Text style={estilos.saudacao}>
              Organize seus objetivos
            </Text>

            <Text style={estilos.nomeAplicativo}>
              Minhas metas
            </Text>
          </View>
        </View>

        <View style={estilos.cartaoResumo}>
          <Text style={estilos.tituloResumo}>
            Progresso geral
          </Text>

          <Text style={estilos.valorResumo}>
            {formatarMoeda(totalGuardado)}
          </Text>

          <Text style={estilos.descricaoResumo}>
            De {formatarMoeda(totalObjetivos)} em objetivos
          </Text>

          <View style={estilos.linhaProgressoGeral}>
            <View
              style={[
                estilos.barraProgressoGeral,
                { width: `${progressoGeral}%` },
              ]}
            />
          </View>

          <View style={estilos.rodapeResumo}>
            <Text style={estilos.textoResumo}>
              {progressoGeral.toFixed(0)}% alcançado
            </Text>

            <Text style={estilos.textoResumo}>
              {metas.length} {metas.length === 1 ? 'meta' : 'metas'}
            </Text>
          </View>
        </View>

        <View style={estilos.tituloSecao}>
          <View>
            <Text style={estilos.tituloSecaoTexto}>
              Seus objetivos
            </Text>

            <Text style={estilos.subtituloSecao}>
              Acompanhe suas conquistas
            </Text>
          </View>

          <TouchableOpacity
            style={estilos.botaoNovaMeta}
            onPress={() => setModalVisivel(true)}
          >
            <Ionicons
              name="add"
              size={23}
              color="#FFFFFF"
            />
          </TouchableOpacity>
        </View>

        {metas.length > 0 ? (
          <View style={estilos.listaMetas}>
            {metas.map(renderizarMeta)}
          </View>
        ) : (
          <View style={estilos.estadoVazio}>
            <Ionicons
              name="flag-outline"
              size={40}
              color="#D92344"
            />

            <Text style={estilos.tituloVazio}>
              Nenhuma meta cadastrada
            </Text>

            <Text style={estilos.descricaoVazio}>
              Crie seu primeiro objetivo e comece a acompanhar
              seu progresso financeiro.
            </Text>

            <TouchableOpacity
              style={estilos.botaoVazio}
              onPress={() => setModalVisivel(true)}
            >
              <Text style={estilos.textoBotaoVazio}>
                Criar primeira meta
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      <Modal
        visible={modalVisivel}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisivel(false)}
      >
        <KeyboardAvoidingView
          style={estilos.fundoModal}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={estilos.conteudoModal}>
            <View style={estilos.cabecalhoModal}>
              <Text style={estilos.tituloModal}>
                Nova meta
              </Text>

              <TouchableOpacity
                onPress={() => setModalVisivel(false)}
              >
                <Ionicons
                  name="close"
                  size={25}
                  color="#555555"
                />
              </TouchableOpacity>
            </View>

            <Text style={estilos.descricaoModal}>
              Defina um objetivo para acompanhar suas economias.
            </Text>

            <Text style={estilos.rotuloCampo}>
              Nome da meta
            </Text>

            <TextInput
              style={estilos.campo}
              placeholder="Ex: Comprar um notebook"
              placeholderTextColor="#999999"
              value={nome}
              onChangeText={setNome}
              maxLength={50}
            />

            <Text style={estilos.rotuloCampo}>
              Valor desejado
            </Text>

            <TextInput
              style={estilos.campo}
              placeholder="Ex: 4000,00"
              placeholderTextColor="#999999"
              value={valorObjetivo}
              onChangeText={setValorObjetivo}
              keyboardType="decimal-pad"
            />

            <Text style={estilos.rotuloCampo}>
              Prazo (opcional)
            </Text>

            <TextInput
              style={estilos.campo}
              placeholder="Ex: 30/06/2027"
              placeholderTextColor="#999999"
              value={prazo}
              onChangeText={setPrazo}
              keyboardType="numeric"
              maxLength={10}
            />

            <TouchableOpacity
              style={estilos.botaoSalvar}
              onPress={salvarMeta}
            >
              <Text style={estilos.textoBotaoSalvar}>
                Criar meta
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <Modal
        visible={modalValorVisivel}
        transparent
        animationType="slide"
        onRequestClose={() => setModalValorVisivel(false)}
      >
        <KeyboardAvoidingView
          style={estilos.fundoModal}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={estilos.conteudoModal}>
            <View style={estilos.cabecalhoModal}>
              <Text style={estilos.tituloModal}>
                Adicionar valor
              </Text>

              <TouchableOpacity
                onPress={() => setModalValorVisivel(false)}
              >
                <Ionicons
                  name="close"
                  size={25}
                  color="#555555"
                />
              </TouchableOpacity>
            </View>

            {metaSelecionada && (
              <Text style={estilos.descricaoModal}>
                Adicione dinheiro à meta {metaSelecionada.nome}.
                Esse valor será regisFtrado como uma despesa de investimento.
              </Text>
            )}

            <Text style={estilos.rotuloCampo}>
              Valor do aporte
            </Text>

            <TextInput
              style={estilos.campo}
              placeholder="Ex: 200,00"
              placeholderTextColor="#999999"
              value={valorAdicionado}
              onChangeText={setValorAdicionado}
              keyboardType="decimal-pad"
            />

            <TouchableOpacity
              style={estilos.botaoSalvar}
              onPress={adicionarValor}
            >
              <Text style={estilos.textoBotaoSalvar}>
                Confirmar aporte
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={estilos.botaoCancelar}
              onPress={() => setModalValorVisivel(false)}
            >
              <Text style={estilos.textoCancelar}>
                Cancelar
              </Text>
            </TouchableOpacity>
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
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 35,
  },

  cabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
    marginBottom: 25,
  },

  botaoVoltar: {
    width: 43,
    height: 43,
    borderRadius: 14,
    backgroundColor: '#F7F7F7',
    alignItems: 'center',
    justifyContent: 'center',
  },

  saudacao: {
    fontSize: 13,
    color: '#777777',
  },

  nomeAplicativo: {
    fontSize: 24,
    fontWeight: '800',
    color: '#252525',
    marginTop: 3,
  },

  cartaoResumo: {
    backgroundColor: '#D92344',
    borderRadius: 20,
    padding: 22,
    marginBottom: 28,
  },

  tituloResumo: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },

  valorResumo: {
    color: '#FFFFFF',
    fontSize: 29,
    fontWeight: '800',
    marginTop: 12,
  },

  descricaoResumo: {
    color: '#FFFFFF',
    fontSize: 12,
    marginTop: 5,
  },

  linhaProgressoGeral: {
    height: 9,
    backgroundColor: '#FFFFFF55',
    borderRadius: 10,
    marginTop: 22,
    overflow: 'hidden',
  },

  barraProgressoGeral: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
  },

  rodapeResumo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },

  textoResumo: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },

  tituloSecao: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 17,
  },

  tituloSecaoTexto: {
    fontSize: 18,
    fontWeight: '800',
    color: '#252525',
  },

  subtituloSecao: {
    color: '#888888',
    fontSize: 12,
    marginTop: 5,
  },

  botaoNovaMeta: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#D92344',
    alignItems: 'center',
    justifyContent: 'center',
  },

  listaMetas: {
    gap: 15,
  },

  cartaoMeta: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EEEEEE',
    borderRadius: 18,
    padding: 17,
  },

  cabecalhoMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
  },

  iconeMeta: {
    width: 44,
    height: 44,
    borderRadius: 13,
    backgroundColor: '#FCE8E6',
    alignItems: 'center',
    justifyContent: 'center',
  },

  informacoesMeta: {
    flex: 1,
  },

  nomeMeta: {
    fontSize: 15,
    fontWeight: '800',
    color: '#252525',
  },

  prazoMeta: {
    fontSize: 11,
    color: '#888888',
    marginTop: 5,
  },

  botaoExcluir: {
    padding: 8,
  },

  valoresMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 22,
  },

  rotuloValor: {
    fontSize: 11,
    color: '#888888',
    marginBottom: 5,
  },

  valorGuardado: {
    fontSize: 17,
    fontWeight: '800',
    color: '#238B45',
  },

  valorObjetivo: {
    fontSize: 16,
    fontWeight: '800',
    color: '#252525',
  },

  alinhamentoDireita: {
    alignItems: 'flex-end',
  },

  linhaProgresso: {
    height: 9,
    backgroundColor: '#EEEEEE',
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 19,
  },

  barraProgresso: {
    height: '100%',
    backgroundColor: '#238B45',
    borderRadius: 10,
  },

  rodapeMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },

  textoProgresso: {
    fontSize: 11,
    fontWeight: '700',
    color: '#777777',
  },

  textoConcluida: {
    fontSize: 11,
    fontWeight: '800',
    color: '#238B45',
  },

  textoRestante: {
    fontSize: 12,
    color: '#777777',
    marginTop: 12,
  },

  botaoAdicionarValor: {
    minHeight: 45,
    backgroundColor: '#D92344',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 16,
  },

  textoBotaoAdicionar: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },

  estadoVazio: {
    alignItems: 'center',
    padding: 30,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    borderRadius: 18,
  },

  tituloVazio: {
    fontSize: 16,
    fontWeight: '800',
    color: '#252525',
    marginTop: 15,
  },

  descricaoVazio: {
    color: '#888888',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 19,
    marginTop: 8,
  },

  botaoVazio: {
    backgroundColor: '#D92344',
    borderRadius: 12,
    paddingHorizontal: 22,
    paddingVertical: 13,
    marginTop: 20,
  },

  textoBotaoVazio: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13,
  },

  fundoModal: {
    flex: 1,
    backgroundColor: '#00000077',
    justifyContent: 'center',
    padding: 20,
  },

  conteudoModal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 22,
  },

  cabecalhoModal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  tituloModal: {
    fontSize: 21,
    fontWeight: '800',
    color: '#252525',
  },

  descricaoModal: {
    fontSize: 12,
    color: '#888888',
    lineHeight: 19,
    marginTop: 12,
    marginBottom: 15,
  },

  rotuloCampo: {
    fontSize: 12,
    fontWeight: '700',
    color: '#444444',
    marginBottom: 8,
    marginTop: 12,
  },

  campo: {
    minHeight: 50,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    backgroundColor: '#FAFAFA',
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 14,
    color: '#252525',
  },

  botaoSalvar: {
    minHeight: 52,
    backgroundColor: '#D92344',
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 22,
  },

  textoBotaoSalvar: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },

  botaoCancelar: {
    alignItems: 'center',
    paddingVertical: 15,
  },

  textoCancelar: {
    color: '#777777',
    fontWeight: '700',
  },
});
