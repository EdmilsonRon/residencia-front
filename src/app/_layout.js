import { Stack } from 'expo-router';

import {
  TransacoesProvider,
} from '../contexts/TransacoesContext';

export default function Layout() {
  return (
    <TransacoesProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </TransacoesProvider>
  );
}