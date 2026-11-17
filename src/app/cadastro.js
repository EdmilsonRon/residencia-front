
import React, { useState } from 'react';

import estilos from '../../src/styles/cadastroStyles';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { useAuth } from '../contexts/AuthContext';

export default function Cadastro() {
  const { cadastrarUsuario, carregando } = useAuth();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);
  const [aceitouTermos, setAceitouTermos] = useState(false);
  const [cadastrando, setCadastrando] = useState(false);
  const [telefone, setTelefone] = useState('');

  async function cadastrar() {
    if (cadastrando || carregando) {
      return;
    }

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

    try {
      setCadastrando(true);

      await cadastrarUsuario({
        nome: nome.trim(),
        email: email.trim().toLowerCase(),
        telefone: telefone.trim(),
        senha: senha,
      });

      Alert.alert(
        'Cadastro realizado!',
        'Sua conta foi criada com sucesso. Entre utilizando o e-mail e a senha cadastrados.',
        [
          {
            text: 'Ir para o login',
            onPress: () => {
              router.replace('/login');
            },
          },
        ]
      );
    } catch (erro) {
      Alert.alert(
        'Erro no cadastro',
        erro.message || 'Não foi possível criar sua conta.'
      );
    } finally {
      setCadastrando(false);
    }
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

        <View style={estilos.formulario}>
          <Text style={estilos.titulo}>
            Crie sua conta
          </Text>

          <Text style={estilos.descricao}>
            Preencha seus dados para começar.
          </Text>

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

          <Text style={estilos.rotulo}>
  Telefone
</Text>

<View style={estilos.campo}>
  <Ionicons
    name="call-outline"
    size={21}
    color="#888888"
  />

  <TextInput
    style={estilos.input}
    placeholder="Digite seu telefone"
    placeholderTextColor="#999999"
    value={telefone}
    onChangeText={setTelefone}
    keyboardType="phone-pad"
    maxLength={15}
    autoComplete="tel"
    accessibilityLabel="Telefone"
    returnKeyType="next"
  />
</View>


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
              onSubmitEditing={cadastrar}
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

          <TouchableOpacity
            style={estilos.botaoCadastrar}
            activeOpacity={0.8}
            onPress={cadastrar}
            disabled={cadastrando || carregando}
          >
            <Text style={estilos.textoBotaoCadastrar}>
              {cadastrando ? 'Criando conta...' : 'Criar minha conta'}
            </Text>

            {!cadastrando && (
              <Ionicons
                name="arrow-forward"
                size={20}
                color="#FFFFFF"
              />
            )}
          </TouchableOpacity>

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
