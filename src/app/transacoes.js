import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function Transacoes() {
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
          Transações
        </Text>

        <View style={{ width: 26 }} />
      </View>

      {/* Receitas / Despesas */}
      <View style={styles.tabs}>

        <TouchableOpacity style={styles.tabActive}>
          <Text style={styles.tabActiveText}>
            DESPESAS
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tab}>
          <Text>
            RECEITAS
          </Text>
        </TouchableOpacity>

      </View>

      {/* Busca */}
      <View style={styles.search}>
        <Ionicons
          name="search-outline"
          size={20}
          color="#555"
        />

        <TextInput
          placeholder="Buscar"
          placeholderTextColor="#555"
          style={styles.searchInput}
        />
      </View>

      {/* Filtros */}
      <View style={styles.filters}>

        <TouchableOpacity style={styles.filter}>
          <Text>PERÍODO</Text>
          <Ionicons name="chevron-down" size={14} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.filter}>
          <Text>CATEGORIA</Text>
          <Ionicons name="chevron-down" size={14} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.filter}>
          <Text>TIPO</Text>
          <Ionicons name="chevron-down" size={14} />
        </TouchableOpacity>

      </View>

      {/* Lista */}
      <ScrollView
        style={styles.list}
        showsVerticalScrollIndicator={false}
      >

        <Transaction
          icon="cash-outline"
          title="Salário"
          category="Receita • 20/10/26"
          value="+ R$ 3.000,00"
          positive
        />

        <Transaction
          icon="cart-outline"
          title="Mercado"
          category="Alimentação • 13/10/26"
          value="- R$ 250,00"
        />

        <Transaction
          icon="car-outline"
          title="Transporte"
          category="Transporte • 02/10/26"
          value="- R$ 300,00"
        />

        <Transaction
          icon="restaurant-outline"
          title="Restaurante"
          category="Alimentação • 01/10/26"
          value="- R$ 80,00"
        />

        <Transaction
          icon="game-controller-outline"
          title="Lazer"
          category="Lazer • 28/09/26"
          value="- R$ 120,00"
        />

      </ScrollView>

      {/* Menu inferior */}
      <View style={styles.bottomMenu}>

        <TouchableOpacity
          onPress={() => router.replace('/home')}
        >
          <Ionicons name="home-outline" size={24} />
          <Text style={styles.menuText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity>
          <Ionicons
            name="swap-horizontal"
            size={24}
            color="#D71920"
          />
          <Text style={styles.menuText}>Transações</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push('/categorias')}
        >
          <Ionicons name="grid-outline" size={24} />
          <Text style={styles.menuText}>Categorias</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push('/mais')}
        >
          <Ionicons name="menu-outline" size={24} />
          <Text style={styles.menuText}>Mais</Text>
        </TouchableOpacity>

      </View>

    </SafeAreaView>
  );
}


/* Componente de transação */
function Transaction({
  icon,
  title,
  category,
  value,
  positive = false,
}) {
  return (
    <View style={styles.transaction}>

      <View style={styles.transactionIcon}>
        <Ionicons
          name={icon}
          size={24}
          color="#222"
        />
      </View>

      <View style={styles.transactionInfo}>
        <Text style={styles.transactionTitle}>
          {title}
        </Text>

        <Text style={styles.transactionCategory}>
          {category}
        </Text>
      </View>

      <Text
        style={[
          styles.transactionValue,
          positive && styles.positive,
        ]}
      >
        {value}
      </Text>

    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#B18768',
    paddingHorizontal: 15,
  },

  header: {
    height: 65,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
  },

  tabs: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#555',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 10,
  },

  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },

  tabActive: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#D71920',
  },

  tabActiveText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  search: {
    height: 42,
    borderWidth: 1,
    borderColor: '#555',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginBottom: 10,
  },

  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 15,
  },

  filters: {
    flexDirection: 'row',
    gap: 7,
    marginBottom: 10,
  },

  filter: {
    flex: 1,
    height: 35,
    borderWidth: 1,
    borderColor: '#555',
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },

  list: {
    flex: 1,
    marginBottom: 70,
  },

  transaction: {
    minHeight: 70,
    borderBottomWidth: 1,
    borderBottomColor: '#80634E',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },

  transactionIcon: {
    width: 45,
    height: 45,
    borderWidth: 1,
    borderColor: '#555',
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
  },

  transactionInfo: {
    flex: 1,
    marginLeft: 10,
  },

  transactionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
  },

  transactionCategory: {
    fontSize: 11,
    color: '#555',
    marginTop: 3,
  },

  transactionValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#D71920',
  },

  positive: {
    color: '#168B38',
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