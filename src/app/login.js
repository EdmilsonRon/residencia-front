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
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erro, setErro] = useState('');

  function entrar() {
    const emailLimpo = email.trim();

    // Verifica se os campos foram preenchidos.
    if (!emailLimpo || !senha) {
      setErro('Preencha o e-mail e a senha para continuar.');
      return;
    }

    // Verifica se o e-mail possui um formato válido.
    const formatoEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formatoEmail.test(emailLimpo)) {
      setErro('Digite um endereço de e-mail válido.');
      return;
    }

    // Aplica a mesma regra mínima de senha do cadastro.
    if (senha.length < 8) {
      setErro('A senha deve ter pelo menos 8 caracteres.');
      return;
    }

    // Limpa a mensagem de erro caso os campos sejam válidos.
    setErro('');

    /*
      A autenticação real será implementada posteriormente.
      Por enquanto, validamos os campos, mas ainda não
      verificamos se a conta existe ou se a senha está correta.
    */
    router.replace('/home');
  }

  function abrirCadastro() {
    router.push('/cadastro');
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
        {/* Identidade visual */}
        <View style={estilos.cabecalho}>
          <View style={estilos.logo}>
            <Ionicons
              name="wallet"
              size={36}
              color="#FFFFFF"
            />
          </View>

          <Text style={estilos.nomeAplicativo}>
            Meu Financeiro
          </Text>

          <Text style={estilos.subtitulo}>
            Organize suas finanças em um só lugar.
          </Text>
        </View>

        {/* Formulário */}
        <View style={estilos.formulario}>
          <Text style={estilos.titulo}>
            Bem-vindo!
          </Text>

          <Text style={estilos.descricao}>
            Entre na sua conta para continuar.
          </Text>

          {/* Campo de e-mail */}
          <Text style={estilos.rotulo}>
            E-mail
          </Text>

          <View
            style={[
              estilos.campo,
              erro && estilos.campoErro,
            ]}
          >
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
              onChangeText={(texto) => {
                setEmail(texto);
                setErro('');
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
              accessibilityLabel="E-mail"
              returnKeyType="next"
            />
          </View>

          {/* Campo de senha */}
          <Text style={estilos.rotulo}>
            Senha
          </Text>

          <View
            style={[
              estilos.campo,
              erro && estilos.campoErro,
            ]}
          >
            <Ionicons
              name="lock-closed-outline"
              size={21}
              color="#888888"
            />

            <TextInput
              style={estilos.input}
              placeholder="Digite sua senha"
              placeholderTextColor="#999999"
              value={senha}
              onChangeText={(texto) => {
                setSenha(texto);
                setErro('');
              }}
              secureTextEntry={!mostrarSenha}
              autoCapitalize="none"
              autoComplete="current-password"
              accessibilityLabel="Senha"
              returnKeyType="done"
              onSubmitEditing={entrar}
            />

            <TouchableOpacity
              onPress={() => setMostrarSenha(!mostrarSenha)}
              accessibilityRole="button"
              accessibilityLabel={
                mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'
              }
            >
              <Ionicons
                name={mostrarSenha ? 'eye-off-outline' : 'eye-outline'}
                size={21}
                color="#888888"
              />
            </TouchableOpacity>
          </View>

          {/* Mensagem de erro */}
          {erro !== '' && (
            <View style={estilos.areaErro}>
              <Ionicons
                name="alert-circle-outline"
                size={18}
                color="#D92344"
              />

              <Text style={estilos.textoErro}>
                {erro}
              </Text>
            </View>
          )}

          {/* Recuperação de senha */}
          <TouchableOpacity
            style={estilos.botaoRecuperar}
            onPress={() => router.push('/recuperar-senha')}
          >
            <Text style={estilos.textoRecuperar}>
              Esqueceu sua senha?
            </Text>
          </TouchableOpacity>

          {/* Botão de entrada */}
          <TouchableOpacity
            style={estilos.botaoEntrar}
            activeOpacity={0.8}
            onPress={entrar}
          >
            <Text style={estilos.textoBotaoEntrar}>
              Entrar
            </Text>

            <Ionicons
              name="arrow-forward"
              size={20}
              color="#FFFFFF"
            />
          </TouchableOpacity>

          {/* Acesso ao cadastro */}
          <View style={estilos.areaCadastro}>
            <Text style={estilos.textoCadastro}>
              Ainda não tem uma conta?
            </Text>

            <TouchableOpacity onPress={abrirCadastro}>
              <Text style={estilos.linkCadastro}>
                Criar conta
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Rodapé */}
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
    justifyContent: 'center',
    paddingHorizontal: 26,
    paddingTop: 45,
    paddingBottom: 25,
  },

  cabecalho: {
    alignItems: 'center',
    marginBottom: 38,
  },

  logo: {
    width: 76,
    height: 76,
    borderRadius: 24,
    backgroundColor: '#D92344',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },

  nomeAplicativo: {
    fontSize: 27,
    fontWeight: '800',
    color: '#252525',
    letterSpacing: -0.5,
  },

  subtitulo: {
    fontSize: 14,
    color: '#777777',
    marginTop: 9,
    textAlign: 'center',
  },

  formulario: {
    width: '100%',
  },

  titulo: {
    fontSize: 27,
    fontWeight: '700',
    color: '#252525',
  },

  descricao: {
    fontSize: 14,
    color: '#777777',
    marginTop: 8,
    marginBottom: 27,
  },

  rotulo: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 9,
    marginTop: 16,
  },

  campo: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 54,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    paddingHorizontal: 15,
    backgroundColor: '#FAFAFA',
    gap: 11,
  },

  campoErro: {
    borderColor: '#D92344',
  },

  input: {
    flex: 1,
    height: '100%',
    fontSize: 14,
    color: '#252525',
  },

  areaErro: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginTop: 12,
  },

  textoErro: {
    flex: 1,
    fontSize: 13,
    color: '#D92344',
    lineHeight: 19,
  },

  botaoRecuperar: {
    alignSelf: 'flex-end',
    marginTop: 14,
    paddingVertical: 5,
  },

  textoRecuperar: {
    fontSize: 13,
    fontWeight: '600',
    color: '#D92344',
  },

  botaoEntrar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 54,
    borderRadius: 12,
    backgroundColor: '#D92344',
    marginTop: 27,
    gap: 10,
  },

  textoBotaoEntrar: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  areaCadastro: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 26,
    gap: 5,
  },

  textoCadastro: {
    fontSize: 13,
    color: '#777777',
  },

  linkCadastro: {
    fontSize: 13,
    fontWeight: '700',
    color: '#D92344',
  },

  rodape: {
    fontSize: 11,
    color: '#AAAAAA',
    textAlign: 'center',
    marginTop: 35,
  },
});
