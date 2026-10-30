import React, { useState } from 'react';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function Cadastro() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);
  const [aceitouTermos, setAceitouTermos] = useState(false);

  function cadastrar() {
    if (
      !nome.trim() ||
      !email.trim() ||
      !senha ||
      !confirmarSenha
    ) {
      Alert.alert(
        'Campos obrigatórios',
        'Preencha todos os campos para continuar.'
      );
      return;
    }

    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      email.trim()
    );

    if (!emailValido) {
      Alert.alert(
        'E-mail inválido',
        'Digite um endereço de e-mail válido.'
      );
      return;
    }

    if (senha.length < 8) {
      Alert.alert(
        'Senha muito curta',
        'Sua senha precisa ter pelo menos 8 caracteres.'
      );
      return;
    }

    if (senha !== confirmarSenha) {
      Alert.alert(
        'Senhas diferentes',
        'A senha e a confirmação precisam ser iguais.'
      );
      return;
    }

    if (!aceitouTermos) {
      Alert.alert(
        'Termos de uso',
        'Você precisa aceitar os termos para continuar.'
      );
      return;
    }

    // O cadastro real será conectado ao Spring Boot posteriormente.
    Alert.alert(
      'Cadastro validado!',
      'Os dados foram validados. O próximo passo será conectar o cadastro ao servidor.',
      [
        {
          text: 'Ir para o login',
          onPress: () => router.replace('/login'),
        },
      ]
    );
  }

  function voltarParaLogin() {
    router.replace('/login');
  }

  return (
    <KeyboardAvoidingView
      style={estilos.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar style="dark" />

      <ScrollView
        contentContainerStyle={estilos.conteudo}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* CABEÇALHO */}

        <View style={estilos.cabecalho}>
          <View style={estilos.logo}>
            <Ionicons
              name="wallet"
              size={34}
              color="#FFFFFF"
            />
          </View>

          <Text style={estilos.nomeAplicativo}>
            Meu Financeiro
          </Text>

          <Text style={estilos.subtitulo}>
            Comece a organizar sua vida financeira.
          </Text>
        </View>

        {/* FORMULÁRIO */}

        <View style={estilos.formulario}>
          <Text style={estilos.titulo}>
            Crie sua conta
          </Text>

          <Text style={estilos.descricao}>
            Preencha seus dados para começar.
          </Text>

          {/* NOME */}

          <Text style={estilos.rotulo}>
            Nome completo
          </Text>

          <View style={estilos.campo}>
            <Ionicons
              name="person-outline"
              size={21}
              color="#888888"
            />

            <TextInput
              style={estilos.input}
              placeholder="Digite seu nome completo"
              placeholderTextColor="#999999"
              value={nome}
              onChangeText={setNome}
              autoCapitalize="words"
              autoCorrect={false}
              autoComplete="name"
              accessibilityLabel="Nome completo"
              returnKeyType="next"
            />
          </View>

          {/* E-MAIL */}

          <Text style={estilos.rotulo}>
            E-mail
          </Text>

          <View style={estilos.campo}>
            <Ionicons
              name="mail-outline"
              size={21}
              color="#888888"
            />

            <TextInput
              style={estilos.input}
              placeholder="Digite seu e-mail"
              placeholderTextColor="#999999"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
              accessibilityLabel="E-mail"
              returnKeyType="next"
            />
          </View>

          {/* SENHA */}

          <Text style={estilos.rotulo}>
            Senha
          </Text>

          <View style={estilos.campo}>
            <Ionicons
              name="lock-closed-outline"
              size={21}
              color="#888888"
            />

            <TextInput
              style={estilos.input}
              placeholder="Crie uma senha"
              placeholderTextColor="#999999"
              value={senha}
              onChangeText={setSenha}
              secureTextEntry={!mostrarSenha}
              autoCapitalize="none"
              autoComplete="new-password"
              accessibilityLabel="Senha"
              returnKeyType="next"
            />

            <TouchableOpacity
              onPress={() => setMostrarSenha(!mostrarSenha)}
              accessibilityRole="button"
              accessibilityLabel={
                mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'
              }
            >
              <Ionicons
                name={
                  mostrarSenha
                    ? 'eye-off-outline'
                    : 'eye-outline'
                }
                size={21}
                color="#888888"
              />
            </TouchableOpacity>
          </View>

          {/* CONFIRMAR SENHA */}

          <Text style={estilos.rotulo}>
            Confirmar senha
          </Text>

          <View style={estilos.campo}>
            <Ionicons
              name="shield-checkmark-outline"
              size={21}
              color="#888888"
            />

            <TextInput
              style={estilos.input}
              placeholder="Digite a senha novamente"
              placeholderTextColor="#999999"
              value={confirmarSenha}
              onChangeText={setConfirmarSenha}
              secureTextEntry={!mostrarConfirmacao}
              autoCapitalize="none"
              autoComplete="new-password"
              accessibilityLabel="Confirmar senha"
              returnKeyType="done"
            />

            <TouchableOpacity
              onPress={() =>
                setMostrarConfirmacao(!mostrarConfirmacao)
              }
              accessibilityRole="button"
              accessibilityLabel={
                mostrarConfirmacao
                  ? 'Ocultar confirmação da senha'
                  : 'Mostrar confirmação da senha'
              }
            >
              <Ionicons
                name={
                  mostrarConfirmacao
                    ? 'eye-off-outline'
                    : 'eye-outline'
                }
                size={21}
                color="#888888"
              />
            </TouchableOpacity>
          </View>

          {/* TERMOS */}

          <TouchableOpacity
            style={estilos.areaTermos}
            activeOpacity={0.7}
            onPress={() => setAceitouTermos(!aceitouTermos)}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: aceitouTermos }}
          >
            <View
              style={[
                estilos.checkbox,
                aceitouTermos && estilos.checkboxSelecionado,
              ]}
            >
              {aceitouTermos && (
                <Ionicons
                  name="checkmark"
                  size={16}
                  color="#FFFFFF"
                />
              )}
            </View>

            <Text style={estilos.textoTermos}>
              Li e aceito os termos de uso e a política de privacidade.
            </Text>
          </TouchableOpacity>

          {/* BOTÃO CADASTRAR */}

          <TouchableOpacity
            style={estilos.botaoCadastrar}
            activeOpacity={0.8}
            onPress={cadastrar}
          >
            <Text style={estilos.textoBotaoCadastrar}>
              Criar minha conta
            </Text>

            <Ionicons
              name="arrow-forward"
              size={20}
              color="#FFFFFF"
            />
          </TouchableOpacity>

          {/* VOLTAR AO LOGIN */}

          <View style={estilos.areaLogin}>
            <Text style={estilos.textoLogin}>
              Já possui uma conta?
            </Text>

            <TouchableOpacity onPress={voltarParaLogin}>
              <Text style={estilos.linkLogin}>
                Entrar
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={estilos.rodape}>
          Suas finanças, organizadas em um só lugar.
        </Text>
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