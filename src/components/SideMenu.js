import React from 'react';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Pressable,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const opcoesMenu = [
  {
    titulo: 'Início',
    rota: '/home',
    icone: 'home-outline',
  },
  {
    titulo: 'Orçamentos',
    rota: '/orcamentos',
    icone: 'wallet-outline',
  },
  {
    titulo: 'Metas',
    rota: '/metas',
    icone: 'flag-outline',
  },
  {
    titulo: 'Relatórios',
    rota: '/relatorios',
    icone: 'bar-chart-outline',
  },
  {
    titulo: 'Saúde financeira',
    rota: '/saude-financeira',
    icone: 'heart-outline',
  },
  {
    titulo: 'Perfil',
    rota: '/perfil',
    icone: 'person-outline',
  },
  {
    titulo: 'Configurações',
    rota: '/configuracoes',
    icone: 'settings-outline',
  },
];

export default function SideMenu({ visible, onClose }) {
  function navegarPara(rota) {
    onClose();
    router.navigate(rota);
  }

  function sairDoAplicativo() {
    onClose();

    // O logout real será implementado futuramente.
    // Por enquanto, esta função apenas fecha o menu.
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={estilos.fundoModal}>
        {/* Área escurecida fora do menu */}
        <Pressable
          style={estilos.areaExterna}
          onPress={onClose}
        />

        {/* Painel lateral */}
        <View style={estilos.painel}>
          <View style={estilos.cabecalho}>
            <View style={estilos.logo}>
              <Ionicons
                name="wallet"
                size={27}
                color="#FFFFFF"
              />
            </View>

            <View style={estilos.informacoesCabecalho}>
              <Text style={estilos.tituloAplicativo}>
                Meu Financeiro
              </Text>

              <Text style={estilos.subtituloAplicativo}>
                Organize sua vida financeira
              </Text>
            </View>

            <TouchableOpacity
              onPress={onClose}
              style={estilos.botaoFechar}
              accessibilityRole="button"
              accessibilityLabel="Fechar menu"
            >
              <Ionicons
                name="close"
                size={24}
                color="#555555"
              />
            </TouchableOpacity>
          </View>

          <View style={estilos.separador} />

          <ScrollView
            style={estilos.lista}
            showsVerticalScrollIndicator={false}
          >
            {opcoesMenu.map((opcao) => (
              <TouchableOpacity
                key={opcao.rota}
                style={estilos.opcao}
                activeOpacity={0.7}
                onPress={() => navegarPara(opcao.rota)}
              >
                <Ionicons
                  name={opcao.icone}
                  size={22}
                  color="#555555"
                  style={estilos.iconeOpcao}
                />

                <Text style={estilos.textoOpcao}>
                  {opcao.titulo}
                </Text>

                <Ionicons
                  name="chevron-forward"
                  size={17}
                  color="#BBBBBB"
                />
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={estilos.separador} />

          <TouchableOpacity
            style={estilos.opcaoSair}
            activeOpacity={0.7}
            onPress={sairDoAplicativo}
          >
            <Ionicons
              name="log-out-outline"
              size={22}
              color="#D92344"
              style={estilos.iconeOpcao}
            />

            <Text style={estilos.textoSair}>
              Sair
            </Text>
          </TouchableOpacity>

          <Text style={estilos.rodape}>
            Meu Financeiro
          </Text>
        </View>
      </View>
    </Modal>
  );
}

const estilos = StyleSheet.create({
  fundoModal: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },

  areaExterna: {
    flex: 1,
  },

  painel: {
    width: 300,
    maxWidth: '88%',
    height: '100%',
    backgroundColor: '#FFFFFF',
    paddingTop: 55,
    paddingBottom: 25,
    elevation: 10,
    shadowColor: '#000000',
    shadowOffset: {
      width: -3,
      height: 0,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },

  cabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingBottom: 24,
  },

  logo: {
    width: 48,
    height: 48,
    borderRadius: 15,
    backgroundColor: '#D92344',
    alignItems: 'center',
    justifyContent: 'center',
  },

  informacoesCabecalho: {
    flex: 1,
    marginLeft: 12,
  },

  tituloAplicativo: {
    fontSize: 17,
    fontWeight: '700',
    color: '#222222',
  },

  subtituloAplicativo: {
    fontSize: 11,
    color: '#777777',
    marginTop: 5,
  },

  botaoFechar: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
  },

  separador: {
    height: 1,
    backgroundColor: '#EEEEEE',
    marginHorizontal: 18,
  },

  lista: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 15,
  },

  opcao: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 50,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 5,
  },

  iconeOpcao: {
    width: 28,
    marginRight: 10,
  },

  textoOpcao: {
    flex: 1,
    fontSize: 14,
    color: '#333333',
    fontWeight: '500',
  },

  opcaoSair: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 52,
    paddingHorizontal: 24,
    marginTop: 8,
  },

  textoSair: {
    fontSize: 14,
    fontWeight: '600',
    color: '#D92344',
  },

  rodape: {
    textAlign: 'center',
    fontSize: 11,
    color: '#AAAAAA',
    marginTop: 15,
  },
});