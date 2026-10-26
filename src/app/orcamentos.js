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

export default function Orcamentos() {
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
          Orçamentos
        </Text>

        <View style={{ width: 26 }} />

      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >

        {/* Abas */}
        <View style={styles.tabs}>

          <View style={styles.activeTab}>
            <Text style={styles.activeTabText}>
              VISÃO GERAL
            </Text>
          </View>

          <View style={styles.tab}>
            <Text>
              POR CATEGORIA
            </Text>
          </View>

        </View>

        {/* Total */}
        <View style={styles.totalCard}>

          <View style={styles.totalHeader}>
            <View>
              <Text style={styles.label}>
                TOTAL GASTO
              </Text>

              <Text style={styles.amount}>
                R$ 3.200,00
              </Text>
            </View>

            <View>
              <Text style={styles.label}>
                LIMITE/MÊS
              </Text>

              <Text style={styles.limit}>
                R$ 5.000,00
              </Text>
            </View>
          </View>

          <View style={styles.progressBackground}>
            <View
              style={[
                styles.progress,
                { width: '64%' },
              ]}
            />
          </View>

          <Text style={styles.percentage}>
            64%
          </Text>

        </View>

        {/* Título */}
        <Text style={styles.sectionTitle}>
          POR CATEGORIA
        </Text>

        {/* Alimentação */}
        <BudgetItem
          icon="restaurant-outline"
          name="Alimentação"
          spent="R$ 800"
          limit="R$ 1.000"
          percentage="80%"
          width="80%"
        />

        {/* Moradia */}
        <BudgetItem
          icon="home-outline"
          name="Moradia"
          spent="R$ 800"
          limit="R$ 1.200"
          percentage="66%"
          width="66%"
        />

        {/* Transporte */}
        <BudgetItem
          icon="car-outline"
          name="Transporte"
          spent="R$ 450"
          limit="R$ 800"
          percentage="56%"
          width="56%"
        />

      </ScrollView>

      {/* Menu */}
      <View style={styles.bottomMenu}>

        <TouchableOpacity
          onPress={() => router.replace('/home')}
        >
          <Ionicons name="home-outline" size={24} />
          <Text style={styles.menuText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push('/transacoes')}
        >
          <Ionicons name="swap-horizontal" size={24} />
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
function BudgetItem({
  icon,
  name,
  spent,
  limit,
  percentage,
  width,
}) {
  return (
    <View style={styles.budgetCard}>

      <View style={styles.budgetTop}>

        <View style={styles.budgetLeft}>

          <View style={styles.budgetIcon}>
            <Ionicons
              name={icon}
              size={24}
              color="#222"
            />
          </View>

          <View>
            <Text style={styles.budgetName}>
              {name}
            </Text>

            <Text style={styles.budgetValues}>
              {spent} / {limit}
            </Text>
          </View>

        </View>

        <Text style={styles.budgetPercentage}>
          {percentage}
        </Text>

      </View>

      <View style={styles.progressBackground}>
        <View
          style={[
            styles.progress,
            { width },
          ]}
        />
      </View>

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
    height: 70,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  title: {
    fontSize: 22,
    fontWeight: 'bold',
  },

  scroll: {
    paddingBottom: 80,
  },

  tabs: {
    height: 42,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#555',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 12,
  },

  activeTab: {
    flex: 1,
    backgroundColor: '#D71920',
    justifyContent: 'center',
    alignItems: 'center',
  },

  activeTabText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  totalCard: {
    backgroundColor: '#C19A7B',
    borderRadius: 12,
    padding: 15,
  },

  totalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  label: {
    fontSize: 11,
    fontWeight: 'bold',
  },

  amount: {
    fontSize: 22,
    marginTop: 5,
  },

  limit: {
    fontSize: 18,
    marginTop: 7,
  },

  progressBackground: {
    height: 10,
    backgroundColor: '#DDD',
    borderRadius: 5,
    overflow: 'hidden',
    marginTop: 12,
  },

  progress: {
    height: '100%',
    backgroundColor: '#D71920',
    borderRadius: 5,
  },

  percentage: {
    textAlign: 'right',
    fontWeight: 'bold',
    marginTop: 3,
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 18,
    marginBottom: 8,
  },

  budgetCard: {
    backgroundColor: '#C19A7B',
    borderRadius: 12,
    padding: 13,
    marginBottom: 10,
  },

  budgetTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  budgetLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  budgetIcon: {
    width: 42,
    height: 42,
    borderWidth: 1,
    borderColor: '#555',
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  budgetName: {
    fontSize: 15,
    fontWeight: 'bold',
  },

  budgetValues: {
    fontSize: 12,
    marginTop: 3,
  },

  budgetPercentage: {
    fontWeight: 'bold',
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