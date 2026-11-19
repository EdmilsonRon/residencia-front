import React from 'react';

import { View } from 'react-native';

// Anel de pontuação feito só com View (sem react-native-svg).
// Cada traço é um pedacinho do círculo; os primeiros ficam coloridos
// de acordo com a nota, o resto fica cinza.

const TOTAL_TRACOS = 60;
const LARGURA_TRACO = 6;
const COMPRIMENTO_TRACO = 16;

export default function GraficoPontuacao({
  nota,
  cor,
  tamanho = 170,
  children,
}) {
  const ativos = Math.round((Math.min(100, Math.max(0, nota)) / 100) * TOTAL_TRACOS);

  return (
    <View
      style={{
        width: tamanho,
        height: tamanho,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {Array.from({ length: TOTAL_TRACOS }).map((_, indice) => (
        <View
          key={indice}
          pointerEvents="none"
          style={{
            position: 'absolute',
            width: tamanho,
            height: tamanho,
            transform: [{ rotate: `${(indice * 360) / TOTAL_TRACOS}deg` }],
          }}
        >
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: tamanho / 2 - LARGURA_TRACO / 2,
              width: LARGURA_TRACO,
              height: COMPRIMENTO_TRACO,
              borderRadius: LARGURA_TRACO / 2,
              backgroundColor: indice < ativos ? cor : '#E6E6E6',
            }}
          />
        </View>
      ))}

      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        {children}
      </View>
    </View>
  );
}
