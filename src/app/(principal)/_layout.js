
import React, { useState } from 'react';

import {
  View,
  StyleSheet,
} from 'react-native';

import { Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import BottomMenu from '../../components/BottomMenu';
import SideMenu from '../../components/SideMenu';
import ResponsiveContainer from '../../components/ResponsiveContainer';

export default function LayoutPrincipal() {
  const [menuAberto, setMenuAberto] = useState(false);

  function abrirMenu() {
    setMenuAberto(true);
  }

  function fecharMenu() {
    setMenuAberto(false);
  }

  return (
    <SafeAreaView
      style={estilos.container}
      edges={['top', 'bottom']}
    >
      <View style={estilos.conteudo}>
        <ResponsiveContainer>
          <Stack
            initialRouteName="home"
            screenOptions={{
              headerShown: false,
              contentStyle: {
                backgroundColor: '#FFFFFF',
              },
            }}
          />
        </ResponsiveContainer>
      </View>

      <BottomMenu onOpenMenu={abrirMenu} />

      <SideMenu
        visible={menuAberto}
        onClose={fecharMenu}
      />
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  conteudo: {
    flex: 1,
  },
});
