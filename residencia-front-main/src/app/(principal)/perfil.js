
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import estilos from '../../styles/perfilStyles';

export default function Perfil() {
  const usuario = {
    nome: 'Edmilson Ronaldy',
    email: 'edmilson@email.com',
    telefone: '(00) 00000-0000',
  };

  function editarPerfil() {
    Alert.alert(
      'Editar perfil',
      'A edição do perfil será implementada futuramente.'
    );
  }

  function sairDaConta() {
    Alert.alert(
      'Sair da conta',
      'Deseja realmente sair?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Sair',
          onPress: () => router.replace('/login'),
        },
      ]
    );
  }

  function abrirConfiguracoes() {
    router.push('/(principal)/configuracoes');
  }

  return (
    <ScrollView
      style={estilos.container}
      contentContainerStyle={estilos.conteudo}
      showsVerticalScrollIndicator={false}
    >
      <View style={estilos.cabecalho}>
        <TouchableOpacity
          style={estilos.botaoVoltar}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#222222" />
        </TouchableOpacity>

        <Text style={estilos.titulo}>Meu perfil</Text>
      </View>

      <View style={estilos.cartaoPerfil}>
        <View style={estilos.avatar}>
          <Ionicons name="person" size={48} color="#FFFFFF" />
        </View>

        <Text style={estilos.nome}>{usuario.nome}</Text>
        <Text style={estilos.email}>{usuario.email}</Text>

        <TouchableOpacity
          style={estilos.botaoEditar}
          onPress={editarPerfil}
        >
          <Ionicons name="create-outline" size={18} color="#FFFFFF" />
          <Text style={estilos.textoBotaoEditar}>Editar perfil</Text>
        </TouchableOpacity>
      </View>

      <Text style={estilos.tituloSecao}>Informações pessoais</Text>

      <View style={estilos.cartaoInformacoes}>
        <View style={estilos.itemInformacao}>
          <View style={estilos.iconeInformacao}>
            <Ionicons name="person-outline" size={22} color="#6C63FF" />
          </View>

          <View style={estilos.textosInformacao}>
            <Text style={estilos.rotulo}>Nome completo</Text>
            <Text style={estilos.valor}>{usuario.nome}</Text>
          </View>
        </View>

        <View style={estilos.divisor} />

        <View style={estilos.itemInformacao}>
          <View style={estilos.iconeInformacao}>
            <Ionicons name="mail-outline" size={22} color="#6C63FF" />
          </View>

          <View style={estilos.textosInformacao}>
            <Text style={estilos.rotulo}>E-mail</Text>
            <Text style={estilos.valor}>{usuario.email}</Text>
          </View>
        </View>

        <View style={estilos.divisor} />

        <View style={estilos.itemInformacao}>
          <View style={estilos.iconeInformacao}>
            <Ionicons name="call-outline" size={22} color="#6C63FF" />
          </View>

          <View style={estilos.textosInformacao}>
            <Text style={estilos.rotulo}>Telefone</Text>
            <Text style={estilos.valor}>{usuario.telefone}</Text>
          </View>
        </View>
      </View>

      <Text style={estilos.tituloSecao}>Conta e segurança</Text>

      <View style={estilos.cartaoOpcoes}>
        <TouchableOpacity
          style={estilos.opcao}
          onPress={abrirConfiguracoes}
        >
          <View style={estilos.iconeOpcao}>
            <Ionicons name="settings-outline" size={22} color="#6C63FF" />
          </View>

          <Text style={estilos.textoOpcao}>Configurações</Text>

          <Ionicons name="chevron-forward" size={20} color="#999999" />
        </TouchableOpacity>

        <View style={estilos.divisor} />

        <TouchableOpacity
          style={estilos.opcao}
          onPress={() =>
            Alert.alert(
              'Privacidade',
              'As opções de privacidade serão implementadas futuramente.'
            )
          }
        >
          <View style={estilos.iconeOpcao}>
            <Ionicons name="shield-checkmark-outline" size={22} color="#6C63FF" />
          </View>

          <Text style={estilos.textoOpcao}>Privacidade e segurança</Text>

          <Ionicons name="chevron-forward" size={20} color="#999999" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={estilos.botaoSair}
        onPress={sairDaConta}
      >
        <Ionicons name="log-out-outline" size={22} color="#E53935" />
        <Text style={estilos.textoBotaoSair}>Sair da conta</Text>
      </TouchableOpacity>

      <Text style={estilos.versao}>Meu Financeiro · Versão 1.0.0</Text>
    </ScrollView>
  );
}
