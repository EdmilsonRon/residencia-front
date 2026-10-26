import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const categorias = [
  {
    nome: 'Alimentação',
    icone: 'restaurant-outline',
  },
  {
    nome: 'Transporte',
    icone: 'car-outline',
  },
  {
    nome: 'Moradia',
    icone: 'home-outline',
  },
  {
    nome: 'Lazer',
    icone: 'game-controller-outline',
  },
  {
    nome: 'Saúde',
    icone: 'heart-outline',
  },
  {
    nome: 'Outros',
    icone: 'ellipsis-horizontal-circle-outline',
  },
];

export default function Categorias() {
  return (
    <SafeAreaView style={styles.container}>

      {/* Cabeçalho */}
      <View style={styles.header}>

        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons
            name="arrow-back"
            size={26}
            color="#222"
          />
        </TouchableOpacity>

        <Text style={styles.title}>
          Categorias
        </Text>

        <TouchableOpacity>
          <Ionicons
            name="add"
            size={30}
            color="#222"
          />
        </TouchableOpacity>

      </View>

      {/* Lista */}
      <ScrollView style={styles.list}>

        {categorias.map((categoria) => (
          <TouchableOpacity
            key={categoria.nome}
            style={styles.category}
          >

            <View style={styles.categoryLeft}>

              <View style={styles.iconContainer}>
                <Ionicons
                  name={categoria.icone}
                  size={24}
                  color="#222"
                />
              </View>

              <Text style={styles.categoryName}>
                {categoria.nome}
              </Text>

            </View>

            <Ionicons
              name="chevron-forward"
              size={20}
              color="#555"
            />

          </TouchableOpacity>
        ))}

      </ScrollView>

      {/* Menu inferior */}
      <View style={styles.bottomMenu}>

        <TouchableOpacity
          onPress={() => router.replace('/home')}
        >
          <Ionicons
            name="home-outline"
            size={24}
            color="#222"
          />
          <Text style={styles.menuText}>
            Home
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push('/transacoes')}
        >
          <Ionicons
            name="swap-horizontal"
            size={24}
            color="#222"
          />
          <Text style={styles.menuText}>
            Transações
          </Text>
        </TouchableOpacity>

        <TouchableOpacity>
          <Ionicons
            name="grid"
            size={24}
            color="#D71920"
          />
          <Text style={styles.menuText}>
            Categorias
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push('/mais')}
        >
          <Ionicons
            name="menu-outline"
            size={24}
            color="#222"
          />
          <Text style={styles.menuText}>
            Mais
          </Text>
        </TouchableOpacity>

      </View>

    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#B18768',
    paddingHorizontal: 15,
  },

  header: {
    height: 70,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
  },

  list: {
    flex: 1,
    marginBottom: 70,
  },

  category: {
    height: 65,
    backgroundColor: '#C19A7B',
    borderBottomWidth: 1,
    borderBottomColor: '#80634E',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },

  categoryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  iconContainer: {
    width: 42,
    height: 42,
    borderWidth: 1,
    borderColor: '#555',
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  categoryName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#222',
  },

  bottomMenu: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 65,
    backgroundColor: '#E5E5E5',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },

  menuText: {
    fontSize: 9,
    textAlign: 'center',
    marginTop: 2,
  },
});