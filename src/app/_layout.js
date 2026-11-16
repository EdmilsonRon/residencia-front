
import { Stack } from 'expo-router';

import {
  TransacoesProvider,
} from '../contexts/TransacoesContext';

import {
  CategoriasProvider,
} from '../contexts/CategoriasContext';

import {
  MetasProvider,
} from '../contexts/MetasContext';

import {
  OrcamentosProvider,
} from '../contexts/OrcamentosContext';

export default function Layout() {
  return (
    <CategoriasProvider>
      <TransacoesProvider>
        <OrcamentosProvider>
          <MetasProvider>
            <Stack
              screenOptions={{
                headerShown: false,
              }}
            />
          </MetasProvider>
        </OrcamentosProvider>
      </TransacoesProvider>
    </CategoriasProvider>
  );
}
