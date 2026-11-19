import React from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

// Dados que o app usa hoje (conferir com o que o backend vai guardar depois).
const DADOS_USADOS = [
  { icone: 'person-outline', texto: 'Nome, e-mail e telefone do seu perfil' },
  { icone: 'swap-horizontal-outline', texto: 'Receitas e despesas que você registra' },
  { icone: 'grid-outline', texto: 'Categorias que você cria ou usa' },
  { icone: 'wallet-outline', texto: 'Orçamentos e limites por categoria' },
];

const DICAS = [
  'Use uma senha longa, que você não usa em outros sites.',
  'Não compartilhe sua senha nem códigos de recuperação com ninguém.',
  'Saia da conta ao usar o app em um aparelho que não é seu.',
];

export default function PrivacidadeSeguranca() {
  function avisoEmBreve(titulo) {
    Alert.alert(
      titulo,
      'Esta opção será liberada quando o aplicativo estiver conectado ao servidor.'
    );
  }

  return (
    <View style={estilos.container}>
      <ScrollView
        contentContainerStyle={estilos.conteudo}
        showsVerticalScrollIndicator={false}
      >
        <View style={estilos.cabecalho}>
          <TouchableOpacity
            style={estilos.botaoVoltar}
            onPress={() => router.back()}
            accessibilityLabel="Voltar"
          >
            <Ionicons name="arrow-back" size={22} color="#252525" />
          </TouchableOpacity>

          <View style={estilos.cabecalhoTexto}>
            <Text style={estilos.titulo}>Privacidade e segurança</Text>
            <Text style={estilos.subtitulo}>
              Proteja sua conta e entenda seus dados
            </Text>
          </View>
        </View>

        <Text style={estilos.tituloSecao}>Segurança da conta</Text>

        <View style={estilos.cartao}>
          <TouchableOpacity
            style={estilos.opcao}
            activeOpacity={0.7}
            onPress={() => avisoEmBreve('Alterar senha')}
          >
            <View style={estilos.iconeOpcao}>
              <Ionicons name="key-outline" size={21} color="#D92344" />
            </View>

            <View style={estilos.textosOpcao}>
              <Text style={estilos.textoOpcao}>Alterar senha</Text>
              <Text style={estilos.descricaoOpcao}>
                Troque a senha de acesso da sua conta
              </Text>
            </View>

            <Ionicons name="chevron-forward" size={19} color="#BBBBBB" />
          </TouchableOpacity>
        </View>

        <Text style={estilos.tituloSecao}>Dicas de segurança</Text>

        <View style={estilos.cartao}>
          {DICAS.map((dica, indice) => (
            <View
              key={dica}
              style={[estilos.linhaDica, indice > 0 && estilos.linhaComBorda]}
            >
              <Ionicons name="checkmark-circle" size={20} color="#238B45" />
              <Text style={estilos.textoDica}>{dica}</Text>
            </View>
          ))}
        </View>

        <Text style={estilos.tituloSecao}>Dados que o app usa</Text>

        <View style={estilos.cartao}>
          {DADOS_USADOS.map((item, indice) => (
            <View
              key={item.texto}
              style={[estilos.linhaDica, indice > 0 && estilos.linhaComBorda]}
            >
              <Ionicons name={item.icone} size={20} color="#888888" />
              <Text style={estilos.textoDica}>{item.texto}</Text>
            </View>
          ))}
        </View>

        <Text style={estilos.tituloSecao}>Privacidade</Text>

        <View style={estilos.cartao}>
          <TouchableOpacity
            style={estilos.opcao}
            activeOpacity={0.7}
            onPress={() => router.push('/(principal)/politica-privacidade')}
          >
            <View style={estilos.iconeOpcao}>
              <Ionicons name="document-text-outline" size={21} color="#D92344" />
            </View>

            <View style={estilos.textosOpcao}>
              <Text style={estilos.textoOpcao}>Política de privacidade</Text>
              <Text style={estilos.descricaoOpcao}>
                Como seus dados são tratados
              </Text>
            </View>

            <Ionicons name="chevron-forward" size={19} color="#BBBBBB" />
          </TouchableOpacity>

          <View style={estilos.divisor} />

          <TouchableOpacity
            style={estilos.opcao}
            activeOpacity={0.7}
            onPress={() => avisoEmBreve('Excluir conta')}
          >
            <View style={[estilos.iconeOpcao, estilos.iconeAlerta]}>
              <Ionicons name="trash-outline" size={21} color="#D92344" />
            </View>

            <View style={estilos.textosOpcao}>
              <Text style={[estilos.textoOpcao, { color: '#D92344' }]}>
                Excluir minha conta
              </Text>
              <Text style={estilos.descricaoOpcao}>
                Apaga sua conta e seus dados
              </Text>
            </View>

            <Ionicons name="chevron-forward" size={19} color="#BBBBBB" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

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
    fontSize: 23,
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
    paddingHorizontal: 16,
    marginBottom: 20,
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

  iconeAlerta: {
    backgroundColor: '#FCE8E6',
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

  linhaDica: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 13,
  },

  linhaComBorda: {
    borderTopWidth: 1,
    borderTopColor: '#F1F1F1',
  },

  textoDica: {
    flex: 1,
    fontSize: 14,
    color: '#333333',
    lineHeight: 20,
  },
});
