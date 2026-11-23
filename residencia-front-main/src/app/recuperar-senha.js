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

export default function RecuperarSenha() {
  const [email, setEmail] = useState('');
  const [erro, setErro] = useState('');
  const [solicitacaoEnviada, setSolicitacaoEnviada] = useState(false);

  function solicitarRecuperacao() {
    const emailLimpo = email.trim();

    if (!emailLimpo) {
      setErro('Digite seu e-mail para continuar.');
      return;
    }

    const formatoEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formatoEmail.test(emailLimpo)) {
      setErro('Digite um endereço de e-mail válido.');
      return;
    }

    setErro('');
    
    setSolicitacaoEnviada(true);
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
        <TouchableOpacity
          style={estilos.botaoVoltar}
          onPress={() => router.replace('/login')}
          accessibilityRole="button"
          accessibilityLabel="Voltar para o login"
        >
          <Ionicons name="arrow-back" size={23} color="#252525" />
        </TouchableOpacity>

        <View style={estilos.cabecalho}>
          <View style={estilos.logo}>
            <Ionicons
              name="lock-open-outline"
              size={36}
              color="#FFFFFF"
            />
          </View>

          <Text style={estilos.nomeAplicativo}>
            Meu Financeiro
          </Text>
        </View>

        {!solicitacaoEnviada ? (
          <View style={estilos.formulario}>
            <Text style={estilos.titulo}>
              Esqueceu sua senha?
            </Text>

            <Text style={estilos.descricao}>
              Não se preocupe! Informe o e-mail associado à sua
              conta e enviaremos instruções para criar uma nova senha.
            </Text>

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
                onChangeText={(texto) => {
                  setEmail(texto);
                  setErro('');
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="email"
                accessibilityLabel="E-mail"
                returnKeyType="send"
                onSubmitEditing={solicitarRecuperacao}
              />
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
              style={estilos.botaoPrincipal}
              activeOpacity={0.8}
              onPress={solicitarRecuperacao}
            >
              <Text style={estilos.textoBotaoPrincipal}>
                Enviar instruções
              </Text>

              <Ionicons
                name="mail-outline"
                size={20}
                color="#FFFFFF"
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={estilos.botaoSecundario}
              onPress={() => router.replace('/login')}
            >
              <Text style={estilos.textoBotaoSecundario}>
                Voltar para o login
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={estilos.formulario}>
            <View style={estilos.iconeSucesso}>
              <Ionicons
                name="checkmark-circle-outline"
                size={55}
                color="#238B45"
              />
            </View>

            <Text style={estilos.tituloCentralizado}>
              Solicitação registrada!
            </Text>

            <Text style={estilos.descricaoCentralizada}>
              Se houver uma conta associada ao e-mail informado,
              você receberá instruções para redefinir sua senha.
              Verifique sua caixa de entrada e a pasta de spam.
            </Text>

            <Text style={estilos.aviso}>
              No momento, o envio real de e-mails ainda não está
              conectado ao aplicativo.
            </Text>

            <TouchableOpacity
              style={estilos.botaoPrincipal}
              activeOpacity={0.8}
              onPress={() => router.replace('/login')}
            >
              <Text style={estilos.textoBotaoPrincipal}>
                Voltar para o login
              </Text>

              <Ionicons
                name="arrow-forward"
                size={20}
                color="#FFFFFF"
              />
            </TouchableOpacity>
          </View>
        )}

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
    paddingTop: 25,
    paddingBottom: 25,
  },

  botaoVoltar: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginBottom: 18,
  },

  cabecalho: {
    alignItems: 'center',
    marginBottom: 40,
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

  formulario: {
    width: '100%',
  },

  titulo: {
    fontSize: 27,
    fontWeight: '700',
    color: '#252525',
  },

  tituloCentralizado: {
    fontSize: 25,
    fontWeight: '700',
    color: '#252525',
    textAlign: 'center',
  },

  descricao: {
    fontSize: 14,
    lineHeight: 22,
    color: '#777777',
    marginTop: 12,
    marginBottom: 20,
  },

  descricaoCentralizada: {
    fontSize: 14,
    lineHeight: 22,
    color: '#777777',
    marginTop: 14,
    marginBottom: 20,
    textAlign: 'center',
  },

  rotulo: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 9,
    marginTop: 8,
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

  botaoPrincipal: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 54,
    borderRadius: 12,
    backgroundColor: '#D92344',
    marginTop: 27,
    gap: 10,
  },

  textoBotaoPrincipal: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  botaoSecundario: {
    alignItems: 'center',
    marginTop: 22,
    paddingVertical: 10,
  },

  textoBotaoSecundario: {
    fontSize: 14,
    fontWeight: '600',
    color: '#D92344',
  },

  iconeSucesso: {
    alignItems: 'center',
    marginBottom: 18,
  },

  aviso: {
    fontSize: 12,
    lineHeight: 19,
    color: '#946200',
    backgroundColor: '#FFF4CC',
    borderRadius: 10,
    padding: 12,
  },

  rodape: {
    fontSize: 11,
    color: '#AAAAAA',
    textAlign: 'center',
    marginTop: 40,
  },
});
