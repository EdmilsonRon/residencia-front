import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [lembrar, setLembrar] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>

        {/* Logo */}
        <View style={styles.logoArea}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoText}>B</Text>
          </View>

          <Text style={styles.welcome}>
            BEM VINDO
          </Text>
        </View>

        {/* Formulário */}
        <View style={styles.form}>

          {/* E-mail */}
          <View style={styles.inputContainer}>
            <Ionicons
              name="person-outline"
              size={20}
              color="#222"
            />

            <TextInput
              style={styles.input}
              placeholder="E-mail"
              placeholderTextColor="#333"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Senha */}
          <View style={styles.inputContainer}>
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color="#222"
            />

            <TextInput
              style={styles.input}
              placeholder="Senha"
              placeholderTextColor="#333"
              value={senha}
              onChangeText={setSenha}
              secureTextEntry={!mostrarSenha}
            />

            <TouchableOpacity
              onPress={() => setMostrarSenha(!mostrarSenha)}
            >
              <Ionicons
                name={
                  mostrarSenha
                    ? 'eye-outline'
                    : 'eye-off-outline'
                }
                size={21}
                color="#222"
              />
            </TouchableOpacity>
          </View>

          {/* Lembrar / Esqueci */}
          <View style={styles.options}>

            <TouchableOpacity
              style={styles.remember}
              onPress={() => setLembrar(!lembrar)}
            >
              <View
                style={[
                  styles.checkbox,
                  lembrar && styles.checkboxActive,
                ]}
              >
                {lembrar && (
                  <Ionicons
                    name="checkmark"
                    size={13}
                    color="#fff"
                  />
                )}
              </View>

              <Text style={styles.rememberText}>
                Lembrar-me
              </Text>
            </TouchableOpacity>

            <TouchableOpacity>
              <Text style={styles.forgot}>
                Esqueceu sua senha?
              </Text>
            </TouchableOpacity>

          </View>

          {/* Entrar */}
            <TouchableOpacity
            style={styles.loginButton}
            onPress={() => router.replace('/home')}
            >            
            <Text style={styles.loginText}>
              Entrar
            </Text>
          </TouchableOpacity>

          {/* Criar conta */}
          <View style={styles.createArea}>
            <Text style={styles.accountText}>
              Não tem uma conta?
            </Text>

            <TouchableOpacity>
              <Text style={styles.createText}>
                Criar conta
              </Text>
            </TouchableOpacity>
          </View>

        </View>

        {/* Logo inferior */}
        <View style={styles.footer}>
          <Text style={styles.bradesco}>
            ◉ bradesco
          </Text>
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#B18768',
  },

  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 70,
  },

  logoArea: {
    alignItems: 'center',
  },

  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#222',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },

  logoText: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#222',
  },

  welcome: {
    fontSize: 20,
    fontWeight: '500',
    color: '#111',
  },

  form: {
    width: '82%',
    borderWidth: 2,
    borderColor: '#FF2028',
    borderRadius: 7,
    padding: 10,
  },

  inputContainer: {
    height: 38,
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 7,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    marginBottom: 7,
    backgroundColor: 'transparent',
  },

  input: {
    flex: 1,
    marginLeft: 7,
    fontSize: 15,
    color: '#222',
    paddingVertical: 0,
  },

  options: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
    marginBottom: 8,
  },

  remember: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  checkbox: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: '#168B38',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 4,
  },

  checkboxActive: {
    backgroundColor: '#168B38',
  },

  rememberText: {
    fontSize: 9,
    color: '#222',
  },

  forgot: {
    fontSize: 9,
    color: '#FF2028',
    textDecorationLine: 'underline',
  },

  loginButton: {
    height: 34,
    backgroundColor: '#FF2028',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 2,
  },

  loginText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },

  createArea: {
    alignItems: 'center',
    marginTop: 8,
  },

  accountText: {
    fontSize: 9,
    color: '#222',
  },

  createText: {
    fontSize: 10,
    color: '#FF2028',
    fontWeight: 'bold',
    marginTop: 2,
  },

  footer: {
    alignSelf: 'flex-start',
    marginLeft: 25,
  },

  bradesco: {
    color: '#D71920',
    fontSize: 15,
    fontWeight: 'bold',
  },
});