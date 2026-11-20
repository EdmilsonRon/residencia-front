import React, { useEffect, useState } from 'react';

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
  ActivityIndicator,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import { useAuth } from '../../contexts/AuthContext';

import {
  formatarTelefone,
  limparTelefone,
  validarTelefone,
} from '../../utils/telefone';

export default function Configuracoes() {
  const {
    usuarioLogado,
    atualizarUsuario,
    carregando,
  } = useAuth();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [salvando, setSalvando] = useState(false);

  // Carrega os dados atuais do usuário.
  useEffect(() => {
    if (usuarioLogado) {
      setNome(usuarioLogado.nome || '');
      setEmail(usuarioLogado.email || '');
      setTelefone(
        formatarTelefone(usuarioLogado.telefone || '')
      );
    }
  }, [usuarioLogado]);

  // Verifica se houve alguma alteração nos campos.
  const houveAlteracao = Boolean(usuarioLogado) && (
    nome.trim() !== (usuarioLogado.nome || '') ||
    email.trim().toLowerCase() !==
      (usuarioLogado.email || '').toLowerCase() ||
    limparTelefone(telefone) !==
      limparTelefone(usuarioLogado.telefone || '')
  );

  // Restaura os dados originais.
  function descartarAlteracoes() {
    setNome(usuarioLogado?.nome || '');
    setEmail(usuarioLogado?.email || '');

    setTelefone(
      formatarTelefone(usuarioLogado?.telefone || '')
    );
  }

  // Aplica a máscara brasileira ao telefone.
  function alterarTelefone(valor) {
    const numeros = String(valor || '').replace(/\D/g, '');

    // Impede mais de 11 dígitos.
    if (numeros.length > 11) {
      return;
    }

    setTelefone(formatarTelefone(numeros));
  }

  // Salva as alterações do perfil.
  async function salvarPerfil() {
    if (salvando) return;

    // Verifica os campos obrigatórios.
    if (!nome.trim() || !email.trim()) {
      Alert.alert(
        'Campos obrigatórios',
        'Nome e e-mail precisam ser preenchidos.'
      );

      return;
    }

    // Validação do e-mail.
    const formatoEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formatoEmail.test(email.trim())) {
      Alert.alert(
        'E-mail inválido',
        'Digite um endereço de e-mail válido.'
      );

      return;
    }

    // O telefone pode ficar vazio.
    // Caso seja preenchido, precisa ser válido.
    if (telefone.trim() && !validarTelefone(telefone)) {
      Alert.alert(
        'Telefone inválido',
        'Digite um telefone brasileiro válido, incluindo o DDD. Exemplo: (81) 99785-4357.'
      );

      return;
    }

    try {
      setSalvando(true);

      await atualizarUsuario({
        nome: nome.trim(),
        email: email.trim().toLowerCase(),
        telefone: limparTelefone(telefone),
      });

      Alert.alert(
        'Perfil atualizado',
        'Suas informações foram salvas com sucesso.'
      );
    } catch (erro) {
      Alert.alert(
        'Não foi possível salvar',
        erro?.message || 'Ocorreu um erro ao atualizar seus dados.'
      );
    } finally {
      setSalvando(false);
    }
  }

  // Navegação para privacidade.
  function abrirPrivacidade() {
    router.push('/(principal)/privacidade-seguranca');
  }

  // Navegação para política de privacidade.
  function abrirPolitica() {
    router.push('/(principal)/politica-privacidade');
  }

  // Estado de carregamento.
  if (carregando) {
    return (
      <View style={estilos.estado}>
        <ActivityIndicator
          size="large"
          color="#D92344"
        />

        <Text style={estilos.textoEstado}>
          Carregando configurações...
        </Text>
      </View>
    );
  }

  // Estado sem usuário conectado.
  if (!usuarioLogado) {
    return (
      <View style={estilos.estado}>
        <Ionicons
          name="person-circle-outline"
          size={48}
          color="#AAAAAA"
        />

        <Text style={estilos.textoEstado}>
          Nenhum usuário conectado.
        </Text>

        <TouchableOpacity
          style={estilos.botaoPrincipal}
          onPress={() => router.replace('/login')}
        >
          <Text style={estilos.textoBotaoPrincipal}>
            Ir para o login
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

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
        {/* Cabeçalho */}
        <View style={estilos.cabecalho}>
          <TouchableOpacity
            style={estilos.botaoVoltar}
            onPress={() => router.back()}
            accessibilityLabel="Voltar"
          >
            <Ionicons
              name="arrow-back"
              size={22}
              color="#252525"
            />
          </TouchableOpacity>

          <View style={estilos.cabecalhoTexto}>
            <Text style={estilos.titulo}>
              Configurações
            </Text>

            <Text style={estilos.subtitulo}>
              Gerencie seu perfil e a privacidade da conta
            </Text>
          </View>
        </View>

        {/* Edição de perfil */}
        <Text style={estilos.tituloSecao}>
          Editar perfil
        </Text>

        <View style={estilos.cartao}>
          {/* Nome */}
          <Text style={estilos.rotulo}>
            Nome completo
          </Text>

          <View style={estilos.campo}>
            <Ionicons
              name="person-outline"
              size={20}
              color="#888888"
            />

            <TextInput
              style={estilos.input}
              value={nome}
              onChangeText={setNome}
              placeholder="Seu nome"
              placeholderTextColor="#999999"
              maxLength={80}
              accessibilityLabel="Nome completo"
            />
          </View>

          {/* E-mail */}
          <Text style={estilos.rotulo}>
            E-mail
          </Text>

          <View style={estilos.campo}>
            <Ionicons
              name="mail-outline"
              size={20}
              color="#888888"
            />

            <TextInput
              style={estilos.input}
              value={email}
              onChangeText={setEmail}
              placeholder="voce@email.com"
              placeholderTextColor="#999999"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              accessibilityLabel="E-mail"
            />
          </View>

          {/* Telefone */}
          <Text style={estilos.rotulo}>
            Telefone
          </Text>

          <View style={estilos.campo}>
            <Ionicons
              name="call-outline"
              size={20}
              color="#888888"
            />

            <TextInput
              style={estilos.input}
              value={telefone}
              onChangeText={alterarTelefone}
              placeholder="(00) 00000-0000"
              placeholderTextColor="#999999"
              keyboardType="phone-pad"
              maxLength={15}
              accessibilityLabel="Telefone"
              autoComplete="tel"
            />
          </View>

          {/* Salvar alterações */}
          <TouchableOpacity
            style={[
              estilos.botaoPrincipal,
              !houveAlteracao && estilos.botaoDesativado,
            ]}
            disabled={!houveAlteracao || salvando}
            activeOpacity={0.85}
            onPress={salvarPerfil}
          >
            {salvando ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={estilos.textoBotaoPrincipal}>
                Salvar alterações
              </Text>
            )}
          </TouchableOpacity>

          {/* Descartar alterações */}
          {houveAlteracao && (
            <TouchableOpacity
              style={estilos.botaoSecundario}
              onPress={descartarAlteracoes}
              disabled={salvando}
            >
              <Text style={estilos.textoBotaoSecundario}>
                Descartar alterações
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Privacidade e segurança */}
        <Text style={estilos.tituloSecao}>
          Privacidade e segurança
        </Text>

        <View style={estilos.cartaoOpcoes}>
          {/* Privacidade */}
          <TouchableOpacity
            style={estilos.opcao}
            activeOpacity={0.7}
            onPress={abrirPrivacidade}
          >
            <View style={estilos.iconeOpcao}>
              <Ionicons
                name="shield-checkmark-outline"
                size={21}
                color="#D92344"
              />
            </View>

            <View style={estilos.textosOpcao}>
              <Text style={estilos.textoOpcao}>
                Privacidade e segurança
              </Text>

              <Text style={estilos.descricaoOpcao}>
                Proteção da conta e informações utilizadas
              </Text>
            </View>

            <Ionicons
              name="chevron-forward"
              size={19}
              color="#BBBBBB"
            />
          </TouchableOpacity>

          <View style={estilos.divisor} />

          {/* Política de privacidade */}
          <TouchableOpacity
            style={estilos.opcao}
            activeOpacity={0.7}
            onPress={abrirPolitica}
          >
            <View style={estilos.iconeOpcao}>
              <Ionicons
                name="document-text-outline"
                size={21}
                color="#D92344"
              />
            </View>

            <View style={estilos.textosOpcao}>
              <Text style={estilos.textoOpcao}>
                Política de privacidade
              </Text>

              <Text style={estilos.descricaoOpcao}>
                Consulte como seus dados são tratados
              </Text>
            </View>

            <Ionicons
              name="chevron-forward"
              size={19}
              color="#BBBBBB"
            />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// Estilos da tela de configurações.
const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },

  conteudo: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 35,
  },

  estado: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8F8F8',
    padding: 24,
  },

  textoEstado: {
    fontSize: 14,
    color: '#777777',
    marginTop: 12,
    textAlign: 'center',
  },

  cabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 25,
  },

  botaoVoltar: {
    width: 43,
    height: 43,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  cabecalhoTexto: {
    flex: 1,
  },

  titulo: {
    fontSize: 25,
    fontWeight: '800',
    color: '#252525',
  },

  subtitulo: {
    fontSize: 12,
    color: '#888888',
    marginTop: 5,
  },

  tituloSecao: {
    fontSize: 13,
    fontWeight: '700',
    color: '#444444',
    marginBottom: 10,
  },

  cartao: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    marginBottom: 22,
  },

  rotulo: {
    fontSize: 13,
    color: '#777777',
    marginBottom: 7,
  },

  campo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    height: 50,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E4E4E4',
    backgroundColor: '#FAFAFA',
    paddingHorizontal: 14,
    marginBottom: 16,
  },

  input: {
    flex: 1,
    fontSize: 15,
    color: '#252525',
  },

  botaoPrincipal: {
    minHeight: 50,
    borderRadius: 14,
    backgroundColor: '#D92344',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    marginTop: 4,
  },

  botaoDesativado: {
    backgroundColor: '#E8B5BF',
  },

  textoBotaoPrincipal: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },

  botaoSecundario: {
    alignItems: 'center',
    paddingVertical: 14,
  },

  textoBotaoSecundario: {
    color: '#777777',
    fontSize: 14,
    fontWeight: '600',
  },

  cartaoOpcoes: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },

  opcao: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },

  iconeOpcao: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: '#FCE8E6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  textosOpcao: {
    flex: 1,
  },

  textoOpcao: {
    fontSize: 15,
    fontWeight: '600',
    color: '#252525',
  },

  descricaoOpcao: {
    fontSize: 12,
    color: '#888888',
    marginTop: 3,
  },

  divisor: {
    height: 1,
    backgroundColor: '#F1F1F1',
  },
});