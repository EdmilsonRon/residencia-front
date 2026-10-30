import { View, Text, StyleSheet } from 'react-native';

export default function Configuracoes() {
  return (
    <View style={estilos.container}>
      <Text style={estilos.titulo}>Configurações</Text>
      <Text style={estilos.descricao}>
        Aqui você poderá personalizar as preferências do aplicativo.
      </Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#FFFFFF',
  },
  titulo: {
    fontSize: 26,
    fontWeight: '700',
    color: '#222222',
  },
  descricao: {
    fontSize: 15,
    color: '#777777',
    marginTop: 12,
  },
});