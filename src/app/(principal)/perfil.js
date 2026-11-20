
import React from 'react';

import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { useAuth } from '../../contexts/AuthContext';
import estilos from '../../styles/perfilStyles';

import { formatarTelefone } from '../../utils/telefone';

export default function Perfil() {
  const {
    usuarioLogado,
    sairDaConta,
    carregando,
  } = useAuth();

  function abrirConfiguracoes() {
    router.push('/(principal)/configuracoes');
  }

  function abrirPrivacidade() {
    router.push('/(principal)/privacidade-seguranca');
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
        <ActivityIndicator
          size="large"
          color="#D92344"
        />

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
        </View>

        {/* Informações pessoais */}
        <Text style={estilos.tituloSecao}>
          Informações pessoais
        </Text>

        <View style={estilos.cartaoInformacoes}>
          {/* Nome */}
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

          {/* E-mail */}
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

          {/* Telefone */}
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
                {formatarTelefone(usuarioLogado.telefone || '') || 'Não informado'}
              </Text>
            </View>
          </View>

          <View style={estilos.divisor} />

          {/* Data de cadastro */}
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
          {/* Configurações */}
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

          {/* Privacidade e segurança */}
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
        </View>

        {/* Sair da conta */}
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

        {/* Versão */}
        <Text style={estilos.versao}>
          Meu Financeiro · Versão 1.0.0
        </Text>
      </ScrollView>
    </>
  );
}
