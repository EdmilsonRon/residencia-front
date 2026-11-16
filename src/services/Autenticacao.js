
import AsyncStorage from '@react-native-async-storage/async-storage';

const CHAVE_USUARIO = '@MeuFinanceiro:usuario';
const CHAVE_SENHA = '@MeuFinanceiro:senha';
const CHAVE_SESSAO = '@MeuFinanceiro:sessao';

export async function salvarCadastro(nome, email, senha) {
  const usuarioExistente = await AsyncStorage.getItem(CHAVE_USUARIO);

  if (usuarioExistente) {
    const usuario = JSON.parse(usuarioExistente);

    if (usuario.email === email.trim().toLowerCase()) {
      throw new Error('Este e-mail já está cadastrado.');
    }
  }

  const novoUsuario = {
    nome: nome.trim(),
    email: email.trim().toLowerCase(),
  };

  await AsyncStorage.setItem(
    CHAVE_USUARIO,
    JSON.stringify(novoUsuario)
  );

  await AsyncStorage.setItem(CHAVE_SENHA, senha);
}

export async function autenticarUsuario(email, senha) {
  const usuarioSalvo = await AsyncStorage.getItem(CHAVE_USUARIO);
  const senhaSalva = await AsyncStorage.getItem(CHAVE_SENHA);

  if (!usuarioSalvo || !senhaSalva) {
    return null;
  }

  const usuario = JSON.parse(usuarioSalvo);

  if (
    usuario.email !== email.trim().toLowerCase() ||
    senhaSalva !== senha
  ) {
    return null;
  }

  await AsyncStorage.setItem(
    CHAVE_SESSAO,
    JSON.stringify(usuario)
  );

  return usuario;
}

export async function obterUsuarioLogado() {
  const sessao = await AsyncStorage.getItem(CHAVE_SESSAO);

  return sessao ? JSON.parse(sessao) : null;
}

export async function encerrarSessao() {
  await AsyncStorage.removeItem(CHAVE_SESSAO);
}
