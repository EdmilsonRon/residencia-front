import React from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { usePathname, router } from 'expo-router';

const botoes = [
  {
    titulo: 'Início',
    rota: '/home',
    icone: 'home-outline',
    iconeAtivo: 'home',
  },
  {
    titulo: 'Transações',
    rota: '/transacoes',
    icone: 'swap-horizontal-outline',
    iconeAtivo: 'swap-horizontal',
  },
  {
    titulo: 'Categorias',
    rota: '/categorias',
    icone: 'grid-outline',
    iconeAtivo: 'grid',
  },
];

export default function BottomMenu({ onOpenMenu }) {
  const caminhoAtual = usePathname();

  return (
    <View style={estilos.container}>
      {botoes.map((botao) => {
        const ativo = caminhoAtual === botao.rota;

        return (
          <TouchableOpacity
            key={botao.rota}
            style={estilos.botao}
            activeOpacity={0.7}
            onPress={() => router.navigate(botao.rota)}
          >
            <Ionicons
              name={ativo ? botao.iconeAtivo : botao.icone}
              size={23}
              color={ativo ? '#D92344' : '#777777'}
            />

            <Text
              style={[
                estilos.texto,
                ativo && estilos.textoAtivo,
              ]}
            >
              {botao.titulo}
            </Text>
          </TouchableOpacity>
        );
      })}

      <TouchableOpacity
        style={estilos.botao}
        activeOpacity={0.7}
        onPress={onOpenMenu}
        accessibilityRole="button"
        accessibilityLabel="Abrir menu lateral"
      >
        <View style={estilos.botaoMais}>
          <Ionicons
            name="add"
            size={29}
            color="#FFFFFF"
          />
        </View>

        <Text style={estilos.texto}>
          Mais
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    height: 72,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    paddingBottom: 5,
    paddingHorizontal: 8,
  },

  botao: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },

  texto: {
    fontSize: 11,
    color: '#777777',
  },

  textoAtivo: {
    color: '#D92344',
    fontWeight: '700',
  },

  botaoMais: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: '#D92344',
    alignItems: 'center',
    justifyContent: 'center',
  },
});