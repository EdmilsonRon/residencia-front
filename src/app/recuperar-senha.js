
import React, { useState } from 'react';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { useAuth } from '../contexts/AuthContext';

import { StyleSheet } from 'react-native';

export default function RecuperarSenha() {
  const { usuarios, carregando } = useAuth();

  const [email, setEmail] = useState('');
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);

  function solicitarRecuperacao() {
    if (enviando || carregando) {
      return;
    }

    const emailLimpo = email.trim().toLowerCase();

    if (!emailLimpo) {
      setErro('Digite seu e-mail para continuar.');
      return;
    }

    const formatoEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      emailLimpo
    );

    if (!formatoEmail) {
      setErro('Digite um endereço de e-mail válido.');
      return;
    }

    setErro('');
    setEnviando(true);

    const usuarioEncontrado = usuarios.find(
      (usuario) => usuario.email.toLowerCase() === emailLimpo
    );

    setEnviando(false);

    if (!usuarioEncontrado) {
      setErro('Não encontramos uma conta cadastrada com esse e-mail.');
      return;
    }

    router.push({
      pathname: '/nova-senha',
      params: {
        email: emailLimpo,
      },
    });
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
          <Ionicons
            name="arrow-back"
            size={23}
            color="#252525"
          />
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

        <View style={estilos.formulario}>
          <Text style={estilos.titulo}>
            Esqueceu sua senha?
          </Text>

          <Text style={estilos.descricao}>
            Informe o e-mail utilizado no cadastro para continuar
            com a recuperação da sua conta.
          </Text>

          <Text style={estilos.rotulo}>
            E-mail cadastrado
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
              accessibilityLabel="E-mail cadastrado"
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
            style={[
              estilos.botaoPrincipal,
              (enviando || carregando) && estilos.botaoDesabilitado,
            ]}
            activeOpacity={0.8}
            onPress={solicitarRecuperacao}
            disabled={enviando || carregando}
          >
            {carregando || enviando ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Text style={estilos.textoBotaoPrincipal}>
                  Continuar
                </Text>

                <Ionicons
                  name="arrow-forward"
                  size={20}
                  color="#FFFFFF"
                />
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={estilos.botaoSecundario}
            onPress={() => router.replace('/login')}
          >
            <Text style={estilos.textoBotaoSecundario}>
              Voltar para o login
            </Text>
          </TouchableOpacity>

          <View style={estilos.avisoContainer}>
            <Ionicons
              name="information-circle-outline"
              size={19}
              color="#946200"
            />

            <Text style={estilos.aviso}>
              A recuperação está funcionando localmente. O envio
              de e-mail será implementado quando o backend estiver
              disponível.
            </Text>
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

  descricao: {
    fontSize: 14,
    lineHeight: 22,
    color: '#777777',
    marginTop: 12,
    marginBottom: 20,
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

  botaoDesabilitado: {
    opacity: 0.6,
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

  avisoContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 9,
    backgroundColor: '#FFF4CC',
    borderRadius: 10,
    padding: 12,
    marginTop: 22,
  },

  aviso: {
    flex: 1,
    fontSize: 12,
    lineHeight: 19,
    color: '#946200',
  },

  rodape: {
    fontSize: 11,
    color: '#AAAAAA',
    textAlign: 'center',
    marginTop: 40,
  },
});
