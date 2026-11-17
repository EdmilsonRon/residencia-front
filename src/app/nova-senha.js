
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
  StyleSheet,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { useAuth } from '../contexts/AuthContext';

export default function NovaSenha() {
  const { email } = useLocalSearchParams();

  const { alterarSenha, carregando } = useAuth();

  const emailConta = Array.isArray(email) ? email[0] : email;

  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);

  const [erro, setErro] = useState('');
  const [senhaAlterada, setSenhaAlterada] = useState(false);
  const [salvando, setSalvando] = useState(false);

  async function salvarNovaSenha() {
    if (salvando || carregando) {
      return;
    }

    if (!emailConta) {
      setErro('Não foi possível identificar sua conta. Solicite a recuperação novamente.');
      return;
    }

    if (!senha || !confirmarSenha) {
      setErro('Preencha os dois campos de senha.');
      return;
    }

    if (senha.length < 8) {
      setErro('A nova senha deve ter pelo menos 8 caracteres.');
      return;
    }

    if (senha !== confirmarSenha) {
      setErro('As senhas não são iguais. Verifique os campos.');
      return;
    }

    try {
      setErro('');
      setSalvando(true);

      await alterarSenha(emailConta, senha);

      setSenhaAlterada(true);
    } catch (erroAlteracao) {
      setErro(
        erroAlteracao.message || 'Não foi possível alterar sua senha.'
      );
    } finally {
      setSalvando(false);
    }
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
              name="lock-closed-outline"
              size={36}
              color="#FFFFFF"
            />
          </View>

          <Text style={estilos.nomeAplicativo}>
            Meu Financeiro
          </Text>
        </View>

        {!senhaAlterada ? (
          <View style={estilos.formulario}>
            <Text style={estilos.titulo}>
              Criar nova senha
            </Text>

            <Text style={estilos.descricao}>
              Escolha uma nova senha para sua conta. Ela deverá
              ter pelo menos 8 caracteres.
            </Text>

            <View style={estilos.contaContainer}>
              <Ionicons
                name="mail-outline"
                size={18}
                color="#777777"
              />

              <Text style={estilos.emailConta}>
                {emailConta || 'E-mail não identificado'}
              </Text>
            </View>

            <Text style={estilos.rotulo}>
              Nova senha
            </Text>

            <View style={estilos.campo}>
              <Ionicons
                name="lock-closed-outline"
                size={21}
                color="#888888"
              />

              <TextInput
                style={estilos.input}
                placeholder="Digite a nova senha"
                placeholderTextColor="#999999"
                value={senha}
                onChangeText={(texto) => {
                  setSenha(texto);
                  setErro('');
                }}
                secureTextEntry={!mostrarSenha}
                autoCapitalize="none"
                autoComplete="new-password"
                accessibilityLabel="Nova senha"
                returnKeyType="next"
              />

              <TouchableOpacity
                onPress={() => setMostrarSenha(!mostrarSenha)}
                accessibilityRole="button"
                accessibilityLabel={
                  mostrarSenha ? 'Ocultar nova senha' : 'Mostrar nova senha'
                }
              >
                <Ionicons
                  name={mostrarSenha ? 'eye-off-outline' : 'eye-outline'}
                  size={21}
                  color="#888888"
                />
              </TouchableOpacity>
            </View>

            <Text style={estilos.rotulo}>
              Confirmar nova senha
            </Text>

            <View style={estilos.campo}>
              <Ionicons
                name="lock-closed-outline"
                size={21}
                color="#888888"
              />

              <TextInput
                style={estilos.input}
                placeholder="Digite a senha novamente"
                placeholderTextColor="#999999"
                value={confirmarSenha}
                onChangeText={(texto) => {
                  setConfirmarSenha(texto);
                  setErro('');
                }}
                secureTextEntry={!mostrarConfirmacao}
                autoCapitalize="none"
                autoComplete="new-password"
                accessibilityLabel="Confirmar nova senha"
                returnKeyType="done"
                onSubmitEditing={salvarNovaSenha}
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
                salvando && estilos.botaoDesabilitado,
              ]}
              activeOpacity={0.8}
              onPress={salvarNovaSenha}
              disabled={salvando || carregando}
            >
              {salvando || carregando ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Text style={estilos.textoBotaoPrincipal}>
                    Salvar nova senha
                  </Text>

                  <Ionicons
                    name="checkmark"
                    size={21}
                    color="#FFFFFF"
                  />
                </>
              )}
            </TouchableOpacity>

            <Text style={estilos.aviso}>
              Esta alteração atualiza a senha armazenada localmente.
              A validação por e-mail será adicionada com o backend.
            </Text>
          </View>
        ) : (
          <View style={estilos.formulario}>
            <View style={estilos.iconeSucesso}>
              <Ionicons
                name="checkmark-circle-outline"
                size={65}
                color="#238B45"
              />
            </View>

            <Text style={estilos.tituloCentralizado}>
              Senha alterada!
            </Text>

            <Text style={estilos.descricaoCentralizada}>
              Sua nova senha foi salva com sucesso. Agora você
              pode entrar na sua conta utilizando a nova senha.
            </Text>

            <TouchableOpacity
              style={estilos.botaoPrincipal}
              activeOpacity={0.8}
              onPress={() => router.replace('/login')}
            >
              <Text style={estilos.textoBotaoPrincipal}>
                Ir para o login
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

  contaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F6F6F6',
    borderRadius: 10,
    padding: 13,
    gap: 9,
    marginBottom: 12,
  },

  emailConta: {
    flex: 1,
    fontSize: 13,
    color: '#555555',
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
    marginTop: 20,
  },

  rodape: {
    fontSize: 11,
    color: '#AAAAAA',
    textAlign: 'center',
    marginTop: 40,
  },
});
