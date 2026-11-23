
import { Stack } from 'expo-router';

import { TransacoesProvider } from '../contexts/TransacoesContext';
import { CategoriasProvider } from '../contexts/CategoriasContext';
import { OrcamentosProvider } from '../contexts/OrcamentosContext';

export default function Layout() {
  return (
    <CategoriasProvider>
      <TransacoesProvider>
        <OrcamentosProvider>
          <Stack screenOptions={{ headerShown: false }} />
        </OrcamentosProvider>
      </TransacoesProvider>
    </CategoriasProvider>
  );
}
