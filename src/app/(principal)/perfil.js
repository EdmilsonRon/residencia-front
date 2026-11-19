
import React, { useState, useEffect } from 'react';

import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { useAuth } from '../../contexts/AuthContext';
import estilos from '../../styles/perfilStyles';

export default function Perfil() {
  const {
    usuarioLogado,
    atualizarUsuario,
    sairDaConta,
    carregando,
  } = useAuth();

  const [modalEditar, setModalEditar] = useState(false);

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');

  const [salvando, setSalvando] = useState(false);

  // Preenche os campos com os dados do usuário.
  useEffect(() => {
    if (usuarioLogado) {
      setNome(usuarioLogado.nome || '');
      setEmail(usuarioLogado.email || '');
      setTelefone(usuarioLogado.telefone || '');
    }
  }, [usuarioLogado]);

  function abrirEdicao() {
    setNome(usuarioLogado?.nome || '');
    setEmail(usuarioLogado?.email || '');
    setTelefone(usuarioLogado?.telefone || '');
    setModalEditar(true);
  }

  async function salvarEdicao() {
    if (salvando) return;

    if (!nome.trim() || !email.trim()) {
      Alert.alert(
        'Campos obrigatórios',
        'Nome e e-mail precisam ser preenchidos.'
      );
      return;
    }

    const formatoEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formatoEmail.test(email.trim())) {
      Alert.alert('E-mail inválido', 'Digite um e-mail válido.');
      return;
    }

    try {
      setSalvando(true);

      await atualizarUsuario({
        nome,
        email,
        telefone,
      });

      setModalEditar(false);

      Alert.alert(
        'Perfil atualizado!',
        'Suas informações foram salvas com sucesso.'
      );
    } catch (erro) {
      Alert.alert(
        'Não foi possível atualizar',
        erro.message || 'Ocorreu um erro ao salvar seus dados.'
      );
    } finally {
      setSalvando(false);
    }
  }

  function abrirRecuperacaoSenha() {
    router.push('/recuperar-senha');
  }

  function abrirConfiguracoes() {
    router.push('/(principal)/configuracoes');
  }

  function abrirPrivacidade() {
    router.push('/(principal)/privacidade-seguranca');
  }

  function abrirPoliticaPrivacidade() {
    router.push('/(principal)/politica-privacidade');
  }

  function formatarData(data) {
    if (!data) return 'Não disponível';

    const dataConvertida = new Date(data);

    if (Number.isNaN(dataConvertida.getTime())) {
      return 'Não disponível';
    }

    return dataConvertida.toLocaleDateString('pt-BR');
  }

  function obterIniciais(nomeCompleto) {
    if (!nomeCompleto) return 'U';

    const partes = nomeCompleto.trim().split(/\s+/);

    if (partes.length === 1) {
      return partes[0].substring(0, 2).toUpperCase();
    }

    return (
      partes[0][0] + partes[partes.length - 1][0]
    ).toUpperCase();
  }

  function confirmarSaida() {
    Alert.alert(
      'Sair da conta',
      'Deseja realmente encerrar sua sessão?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: async () => {
            try {
              await sairDaConta();
              router.replace('/login');
            } catch (erro) {
              Alert.alert(
                'Erro',
                'Não foi possível encerrar a sessão.'
              );
            }
          },
        },
      ]
    );
  }

  if (carregando) {
    return (
      <View style={estilos.carregando}>
        <ActivityIndicator size="large" color="#D92344" />
        <Text style={estilos.textoCarregando}>
          Carregando perfil...
        </Text>
      </View>
    );
  }

  if (!usuarioLogado) {
    return (
      <View style={estilos.carregando}>
        <Ionicons
          name="person-circle-outline"
          size={55}
          color="#AAAAAA"
        />

        <Text style={estilos.textoCarregando}>
          Nenhum usuário conectado.
        </Text>

        <TouchableOpacity
          style={estilos.botaoLogin}
          onPress={() => router.replace('/login')}
        >
          <Text style={estilos.textoBotaoEditar}>
            Ir para o login
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <>
      <StatusBar style="dark" />

      <ScrollView
        style={estilos.container}
        contentContainerStyle={estilos.conteudo}
        showsVerticalScrollIndicator={false}
      >
        {/* Cabeçalho */}
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

          <Text style={estilos.titulo}>
            Meu perfil
          </Text>
        </View>

        {/* Cartão do usuário */}
        <View style={estilos.cartaoPerfil}>
          <View style={estilos.avatar}>
            <Text style={estilos.iniciais}>
              {obterIniciais(usuarioLogado.nome)}
            </Text>
          </View>

          <Text style={estilos.nome}>
            {usuarioLogado.nome}
          </Text>

          <Text style={estilos.email}>
            {usuarioLogado.email}
          </Text>

          <View style={estilos.seloConta}>
            <Ionicons
              name="checkmark-circle"
              size={15}
              color="#238B45"
            />

            <Text style={estilos.textoSelo}>
              Conta cadastrada
            </Text>
          </View>

          <TouchableOpacity
            style={estilos.botaoEditar}
            onPress={abrirEdicao}
            activeOpacity={0.8}
          >
            <Ionicons
              name="create-outline"
              size={18}
              color="#FFFFFF"
            />

            <Text style={estilos.textoBotaoEditar}>
              Editar perfil
            </Text>
          </TouchableOpacity>
        </View>

        {/* Informações pessoais */}
        <Text style={estilos.tituloSecao}>
          Informações pessoais
        </Text>

        <View style={estilos.cartaoInformacoes}>
          <View style={estilos.itemInformacao}>
            <View style={estilos.iconeInformacao}>
              <Ionicons
                name="person-outline"
                size={22}
                color="#D92344"
              />
            </View>

            <View style={estilos.textosInformacao}>
              <Text style={estilos.rotulo}>
                Nome completo
              </Text>

              <Text style={estilos.valor}>
                {usuarioLogado.nome}
              </Text>
            </View>
          </View>

          <View style={estilos.divisor} />

          <View style={estilos.itemInformacao}>
            <View style={estilos.iconeInformacao}>
              <Ionicons
                name="mail-outline"
                size={22}
                color="#D92344"
              />
            </View>

            <View style={estilos.textosInformacao}>
              <Text style={estilos.rotulo}>
                E-mail
              </Text>

              <Text style={estilos.valor}>
                {usuarioLogado.email}
              </Text>
            </View>
          </View>

          <View style={estilos.divisor} />

          <View style={estilos.itemInformacao}>
            <View style={estilos.iconeInformacao}>
              <Ionicons
                name="call-outline"
                size={22}
                color="#D92344"
              />
            </View>

            <View style={estilos.textosInformacao}>
              <Text style={estilos.rotulo}>
                Telefone
              </Text>

              <Text style={estilos.valor}>
                {usuarioLogado.telefone || 'Não informado'}
              </Text>
            </View>
          </View>

          <View style={estilos.divisor} />

          <View style={estilos.itemInformacao}>
            <View style={estilos.iconeInformacao}>
              <Ionicons
                name="calendar-outline"
                size={22}
                color="#D92344"
              />
            </View>

            <View style={estilos.textosInformacao}>
              <Text style={estilos.rotulo}>
                Data de cadastro
              </Text>

              <Text style={estilos.valor}>
                {formatarData(usuarioLogado.criadoEm)}
              </Text>
            </View>
          </View>
        </View>

        {/* Conta e segurança */}
        <Text style={estilos.tituloSecao}>
          Conta e segurança
        </Text>

        <View style={estilos.cartaoOpcoes}>
          <TouchableOpacity
            style={estilos.opcao}
            onPress={abrirConfiguracoes}
          >
            <View style={estilos.iconeOpcao}>
              <Ionicons
                name="settings-outline"
                size={22}
                color="#D92344"
              />
            </View>

            <View style={estilos.textosOpcao}>
              <Text style={estilos.textoOpcao}>
                Configurações
              </Text>

              <Text style={estilos.descricaoOpcao}>
                Preferências do aplicativo
              </Text>
            </View>

            <Ionicons
              name="chevron-forward"
              size={20}
              color="#999999"
            />
          </TouchableOpacity>

          <View style={estilos.divisor} />

          <TouchableOpacity
            style={estilos.opcao}
            onPress={abrirRecuperacaoSenha}
          >
            <View style={estilos.iconeOpcao}>
              <Ionicons
                name="lock-closed-outline"
                size={22}
                color="#D92344"
              />
            </View>

            <View style={estilos.textosOpcao}>
              <Text style={estilos.textoOpcao}>
                Alterar senha
              </Text>

              <Text style={estilos.descricaoOpcao}>
                Recuperação de acesso à conta
              </Text>
            </View>

            <Ionicons
              name="chevron-forward"
              size={20}
              color="#999999"
            />
          </TouchableOpacity>

          <View style={estilos.divisor} />

          <TouchableOpacity
            style={estilos.opcao}
            onPress={abrirPrivacidade}
          >
            <View style={estilos.iconeOpcao}>
              <Ionicons
                name="shield-checkmark-outline"
                size={22}
                color="#D92344"
              />
            </View>

            <View style={estilos.textosOpcao}>
              <Text style={estilos.textoOpcao}>
                Privacidade e segurança
              </Text>

              <Text style={estilos.descricaoOpcao}>
                Proteção das suas informações
              </Text>
            </View>

            <Ionicons
              name="chevron-forward"
              size={20}
              color="#999999"
            />
          </TouchableOpacity>

          <View style={estilos.divisor} />

          <TouchableOpacity
            style={estilos.opcao}
            onPress={abrirPoliticaPrivacidade}
          >
            <View style={estilos.iconeOpcao}>
              <Ionicons
                name="document-text-outline"
                size={22}
                color="#D92344"
              />
            </View>

            <View style={estilos.textosOpcao}>
              <Text style={estilos.textoOpcao}>
                Política de privacidade
              </Text>

              <Text style={estilos.descricaoOpcao}>
                Como seus dados são tratados
              </Text>
            </View>

            <Ionicons
              name="chevron-forward"
              size={20}
              color="#999999"
            />
          </TouchableOpacity>
        </View>

        {/* Sair */}
        <TouchableOpacity
          style={estilos.botaoSair}
          onPress={confirmarSaida}
          activeOpacity={0.8}
        >
          <Ionicons
            name="log-out-outline"
            size={22}
            color="#D92344"
          />

          <Text style={estilos.textoBotaoSair}>
            Sair da conta
          </Text>
        </TouchableOpacity>

        <Text style={estilos.versao}>
          Meu Financeiro · Versão 1.0.0
        </Text>
      </ScrollView>

      {/* Modal de edição */}
      <Modal
        visible={modalEditar}
        animationType="slide"
        transparent
        onRequestClose={() => setModalEditar(false)}
      >
        <KeyboardAvoidingView
          style={estilos.fundoModal}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={estilos.modal}>
            <View style={estilos.cabecalhoModal}>
              <View>
                <Text style={estilos.tituloModal}>
                  Editar perfil
                </Text>

                <Text style={estilos.descricaoModal}>
                  Atualize suas informações pessoais.
                </Text>
              </View>

              <TouchableOpacity
                style={estilos.botaoFechar}
                onPress={() => setModalEditar(false)}
              >
                <Ionicons
                  name="close"
                  size={24}
                  color="#555555"
                />
              </TouchableOpacity>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <Text style={estilos.rotuloModal}>
                Nome completo
              </Text>

              <View style={estilos.campoModal}>
                <Ionicons
                  name="person-outline"
                  size={20}
                  color="#888888"
                />

                <TextInput
                  style={estilos.inputModal}
                  placeholder="Seu nome completo"
                  value={nome}
                  onChangeText={setNome}
                  autoCapitalize="words"
                  autoCorrect={false}
                />
              </View>

              <Text style={estilos.rotuloModal}>
                E-mail
              </Text>

              <View style={estilos.campoModal}>
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color="#888888"
                />

                <TextInput
                  style={estilos.inputModal}
                  placeholder="Seu e-mail"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              <Text style={estilos.rotuloModal}>
                Telefone
              </Text>

              <View style={estilos.campoModal}>
                <Ionicons
                  name="call-outline"
                  size={20}
                  color="#888888"
                />

                <TextInput
                  style={estilos.inputModal}
                  placeholder="Seu telefone"
                  value={telefone}
                  onChangeText={setTelefone}
                  keyboardType="phone-pad"
                  maxLength={15}
                />
              </View>

              <TouchableOpacity
                style={[
                  estilos.botaoSalvar,
                  salvando && estilos.botaoDesabilitado,
                ]}
                onPress={salvarEdicao}
                disabled={salvando}
              >
                {salvando ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <>
                    <Text style={estilos.textoBotaoSalvar}>
                      Salvar alterações
                    </Text>

                    <Ionicons
                      name="checkmark"
                      size={20}
                      color="#FFFFFF"
                    />
                  </>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={estilos.botaoCancelar}
                onPress={() => setModalEditar(false)}
                disabled={salvando}
              >
                <Text style={estilos.textoBotaoCancelar}>
                  Cancelar
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
}
