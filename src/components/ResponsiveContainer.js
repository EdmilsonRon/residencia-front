
import React from 'react';

import {
  View,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';

export default function ResponsiveContainer({ children }) {
  const { width } = useWindowDimensions();

  const larguraMaxima = 1100;

  const largura = Math.min(width, larguraMaxima);

  return (
    <View style={estilos.container}>
      <View style={[estilos.conteudo, { width: largura }]}>
        {children}
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
  },

  conteudo: {
    flex: 1,
    maxWidth: '100%',
    width: '100%',
  },
});
