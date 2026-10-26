import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function SideMenu({ visible, onClose }) {
  if (!visible) {
    return null;
  }

  function navegar(rota) {
    onClose();
    router.push(rota);
  }

  return (
    <View style={styles.overlay}>

      {/* Área escura fora do menu */}
      <Pressable
        style={styles.background}
        onPress={onClose}
      />

      {/* Menu */}
      <View style={styles.menu}>

        {/* Cabeçalho */}
        <View style={styles.menuHeader}>

          <View style={styles.profileIcon}>
            <Ionicons
              name="person"
              size={28}
              color="#222"
            />
          </View>

          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>
              Usuário
            </Text>

            <Text style={styles.profileEmail}>
              usuario@email.com
            </Text>
          </View>

          <TouchableOpacity onPress={onClose}>
            <Ionicons
              name="close"
              size={27}
              color="#222"
            />
          </TouchableOpacity>

        </View>

        {/* Separador */}
        <View style={styles.separator} />

        {/* Usuário */}
        <MenuItem
          icon="person-outline"
          title="Usuário"
          onPress={() => navegar('/usuario')}
        />

        {/* Transações */}
        <MenuItem
          icon="swap-horizontal-outline"
          title="Transações"
          onPress={() => navegar('/transacoes')}
        />

        {/* Categorias */}
        <MenuItem
          icon="grid-outline"
          title="Categorias"
          onPress={() => navegar('/categorias')}
        />

        {/* Orçamentos */}
        <MenuItem
          icon="wallet-outline"
          title="Orçamentos"
          onPress={() => navegar('/orcamentos')}
        />

        {/* Metas */}
        <MenuItem
          icon="flag-outline"
          title="Metas"
          onPress={() => navegar('/metas')}
        />

        {/* Relatórios */}
        <MenuItem
          icon="bar-chart-outline"
          title="Relatórios"
          onPress={() => navegar('/relatorios')}
        />

        {/* Saúde Financeira */}
        <MenuItem
          icon="heart-outline"
          title="Saúde Financeira"
          onPress={() => navegar('/saude-financeira')}
        />

        <View style={styles.separator} />

        {/* Voltar para Home */}
        <MenuItem
          icon="home-outline"
          title="Início"
          onPress={() => navegar('/home')}
        />

      </View>

    </View>
  );
}


/* Item reutilizável do menu */
function MenuItem({ icon, title, onPress }) {
  return (
    <TouchableOpacity
      style={styles.menuItem}
      onPress={onPress}
    >

      <Ionicons
        name={icon}
        size={24}
        color="#222"
      />

      <Text style={styles.menuItemText}>
        {title}
      </Text>

      <Ionicons
        name="chevron-forward"
        size={18}
        color="#777"
      />

    </TouchableOpacity>
  );
}


const styles = StyleSheet.create({

  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 100,
    flexDirection: 'row',
  },

  background: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
  },

  menu: {
    width: '78%',
    height: '100%',
    backgroundColor: '#B18768',
    paddingTop: 55,
    paddingHorizontal: 18,

    shadowColor: '#000',
    shadowOffset: {
      width: 3,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 5,

    elevation: 10,
  },

  menuHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 18,
  },

  profileIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2,
    borderColor: '#222',
    alignItems: 'center',
    justifyContent: 'center',
  },

  profileInfo: {
    flex: 1,
    marginLeft: 12,
  },

  profileName: {
    fontSize: 17,
    fontWeight: 'bold',
  },

  profileEmail: {
    fontSize: 10,
    marginTop: 3,
    color: '#555',
  },

  separator: {
    height: 1,
    backgroundColor: '#80634E',
    marginVertical: 8,
  },

  menuItem: {
    height: 55,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 8,
  },

  menuItemText: {
    flex: 1,
    marginLeft: 13,
    fontSize: 15,
    fontWeight: '500',
  },

});