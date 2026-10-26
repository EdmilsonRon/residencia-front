import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
export default function Home() {
  return (
    <SafeAreaView style={styles.container}>

      {/* Cabeçalho */}
      <View style={styles.header}>
        <Text style={styles.brand}>
          Bradesco
        </Text>

        <TouchableOpacity>
          <Ionicons
            name="person-circle-outline"
            size={32}
            color="#222"
          />
        </TouchableOpacity>
      </View>

      {/* Saldo */}
      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>
          SALDO EM CONTA
        </Text>

        <Text style={styles.balance}>
          R$ 1.800,00
        </Text>
      </View>

      {/* Receitas e despesas */}
      <View style={styles.summary}>

        <View style={styles.summaryCard}>
          <Ionicons
            name="arrow-up-circle-outline"
            size={28}
            color="#168B38"
          />

          <Text style={styles.summaryTitle}>
            RECEITAS
          </Text>

          <Text style={styles.income}>
            R$ 5.000,00
          </Text>
        </View>

        <View style={styles.summaryCard}>
          <Ionicons
            name="arrow-down-circle-outline"
            size={28}
            color="#D71920"
          />

          <Text style={styles.summaryTitle}>
            DESPESAS
          </Text>

          <Text style={styles.expense}>
            R$ 3.200,00
          </Text>
        </View>

      </View>

      {/* Evolução */}
      <View style={styles.chartCard}>

        <Text style={styles.chartTitle}>
          EVOLUÇÃO
        </Text>

        <View style={styles.chart}>
          <View style={[styles.bar, { height: 35 }]} />
          <View style={[styles.bar, { height: 55 }]} />
          <View style={[styles.bar, { height: 42 }]} />
          <View style={[styles.bar, { height: 65 }]} />
          <View style={[styles.bar, { height: 30 }]} />
          <View style={[styles.bar, { height: 48 }]} />
          <View style={[styles.bar, { height: 38 }]} />
          <View style={[styles.bar, { height: 68 }]} />
        </View>

        <View style={styles.months}>
          <Text>ABR</Text>
          <Text>MAI</Text>
          <Text>JUN</Text>
          <Text>JUL</Text>
          <Text>AGO</Text>
        </View>

      </View>

      {/* Ações */}
      <View style={styles.actions}>

        <TouchableOpacity style={styles.action}>
          <Ionicons
            name="add-circle-outline"
            size={30}
            color="#222"
          />
          <Text>Nova</Text>
          <Text>Transação</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.action}
          onPress={() => router.push('/orcamentos')}
        >
          <Ionicons
            name="wallet-outline"
            size={30}
            color="#222"
          />
          <Text>Orçamento</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.action}>
          <Ionicons
            name="flag-outline"
            size={30}
            color="#222"
          />
          <Text>Metas</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.action}>
          <Ionicons
            name="heart-outline"
            size={30}
            color="#222"
          />
          <Text>Saúde</Text>
          <Text>Financeira</Text>
        </TouchableOpacity>

      </View>

      {/* Menu inferior */}
      <View style={styles.bottomMenu}>

        <TouchableOpacity>
          <Ionicons name="home" size={25} color="#D71920" />
          <Text>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
            onPress={() => router.push('/transacoes')}
        >
            <Ionicons
            name="swap-horizontal"
            size={25}
            color="#222"
            />
            <Text>Transações</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push('/categorias')}
        >
          <Ionicons
          name="grid-outline"
          size={25}
          color="#222"
          />
          <Text>Categorias</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push('/mais')}
        >
          <Ionicons
            name="menu"
            size={25}
            color="#222"
          />
          <Text>Mais</Text>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
  },

  brand: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#D71920',
  },

  balanceCard: {
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 12,
  },

  balanceLabel: {
    fontSize: 13,
    fontWeight: 'bold',
  },

  balance: {
    fontSize: 28,
    marginTop: 5,
  },

  summary: {
    flexDirection: 'row',
    gap: 10,
  },

  summaryCard: {
    flex: 1,
    backgroundColor: '#C19A7B',
    borderRadius: 12,
    padding: 10,
  },

  summaryTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 4,
  },

  income: {
    fontSize: 16,
    color: '#168B38',
    fontWeight: 'bold',
  },

  expense: {
    fontSize: 16,
    color: '#D71920',
    fontWeight: 'bold',
  },

  chartCard: {
    marginTop: 12,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#C19A7B',
  },

  chartTitle: {
    fontSize: 15,
    fontWeight: 'bold',
  },

  chart: {
    height: 90,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    marginTop: 10,
  },

  bar: {
    width: 15,
    backgroundColor: '#D71920',
    borderRadius: 4,
  },

  months: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 5,
  },

  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 15,
  },

  action: {
    alignItems: 'center',
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

  bottomMenuItem: {
    alignItems: 'center',
  },
});