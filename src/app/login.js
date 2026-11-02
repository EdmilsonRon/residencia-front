import React, { useState } from 'react';
import estilos from '../../src/styles/loginStyles';
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

    // Verifica o email
    const formatoEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formatoEmail.test(emailLimpo)) {
      setErro('Digite um endereço de e-mail válido.');
      return;
    }

    if (senha.length < 8) {
      setErro('A senha deve ter pelo menos 8 caracteres.');
      return;
    }
    setErro('');

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

        <View style={estilos.formulario}>
          <Text style={estilos.titulo}>
            Bem-vindo!
          </Text>

          <Text style={estilos.descricao}>
            Entre na sua conta para continuar.
          </Text>

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

          <TouchableOpacity
            style={estilos.botaoRecuperar}
            onPress={() => router.push('/recuperar-senha')}
          >
            <Text style={estilos.textoRecuperar}>
              Esqueceu sua senha?
            </Text>
          </TouchableOpacity>

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

        <Text style={estilos.rodape}>
          Suas finanças, organizadas em um só lugar.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

