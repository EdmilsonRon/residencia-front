import { Stack } from 'expo-router';

import {
  TransacoesProvider,
} from '../contexts/TransacoesContext';

import {
  CategoriasProvider,
} from '../contexts/CategoriasContext';

export default function Layout() {
  return (
    <CategoriasProvider>
      <TransacoesProvider>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        />
      </TransacoesProvider>
    </CategoriasProvider>
  );
}