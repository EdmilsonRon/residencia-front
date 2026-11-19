import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  limparTelefone,
  validarTelefone,
} from '../../src/utils/telefone';

const AuthContext = createContext(null);

const CHAVE_USUARIOS = '@meuFinanceiro:usuarios';
const CHAVE_SESSAO = '@meuFinanceiro:usuarioLogado';

export function AuthProvider({ children }) {
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioLogado, setUsuarioLogado] = useState(null);
  const [carregando, setCarregando] = useState(true);

  // Carrega usuários e sessão quando o aplicativo inicia.
  useEffect(() => {
    async function carregarDados() {
      try {
        const usuariosSalvos = await AsyncStorage.getItem(CHAVE_USUARIOS);
        const sessaoSalva = await AsyncStorage.getItem(CHAVE_SESSAO);

        const listaUsuarios = usuariosSalvos
          ? JSON.parse(usuariosSalvos)
          : [];

        setUsuarios(listaUsuarios);

        if (sessaoSalva) {
          const sessao = JSON.parse(sessaoSalva);

          const usuarioEncontrado = listaUsuarios.find(
            usuario => usuario.id === sessao.id
          );

          if (usuarioEncontrado) {
            setUsuarioLogado(usuarioEncontrado);
          } else {
            await AsyncStorage.removeItem(CHAVE_SESSAO);
          }
        }

      } catch (erro) {
        console.log('Erro ao carregar autenticação:', erro);
      } finally {
        setCarregando(false);
      }
    }

    carregarDados();
  }, []);

  // Cadastra um novo usuário.
  async function cadastrarUsuario(dados) {
    const nome = dados.nome.trim();
    const email = dados.email.trim().toLowerCase();
    const telefone = limparTelefone(dados.telefone);

    const senha = dados.senha;

    if (!nome || !email || !senha) {
      throw new Error('Preencha todos os campos obrigatórios.');
    }

    // Valida o telefone antes de salvar.
    if (!validarTelefone(telefone)) {
      throw new Error(
        'Digite um telefone brasileiro válido, incluindo o DDD.'
      );
    }

    const formatoEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formatoEmail.test(email)) {
      throw new Error('Digite um endereço de e-mail válido.');
    }

    if (senha.length < 8) {
      throw new Error(
        'A senha precisa ter pelo menos 8 caracteres.'
      );
    }

    const usuariosAtuais = await obterUsuariosAtualizados();

    const emailExistente = usuariosAtuais.some(
      usuario => usuario.email.toLowerCase() === email
    );

    if (emailExistente) {
      throw new Error(
        'Já existe uma conta cadastrada com esse e-mail.'
      );
    }

    const novoUsuario = {
      id: Date.now().toString(),
      nome,
      email,
      telefone,
      senha,
      criadoEm: new Date().toISOString(),
    };

    const novaLista = [...usuariosAtuais, novoUsuario];

    await AsyncStorage.setItem(
      CHAVE_USUARIOS,
      JSON.stringify(novaLista)
    );

    setUsuarios(novaLista);

    return novoUsuario;
  }

  // Recupera a lista mais recente do armazenamento.
  async function obterUsuariosAtualizados() {
    const dadosSalvos = await AsyncStorage.getItem(CHAVE_USUARIOS);

    return dadosSalvos ? JSON.parse(dadosSalvos) : usuarios;
  }

  // Realiza o login.
  async function fazerLogin(emailInformado, senhaInformada) {
    const email = emailInformado.trim().toLowerCase();

    const usuariosAtuais = await obterUsuariosAtualizados();

    const usuarioEncontrado = usuariosAtuais.find(
      usuario =>
        usuario.email.toLowerCase() === email &&
        usuario.senha === senhaInformada
    );

    if (!usuarioEncontrado) {
      throw new Error('E-mail ou senha incorretos.');
    }

    await AsyncStorage.setItem(
      CHAVE_SESSAO,
      JSON.stringify({ id: usuarioEncontrado.id })
    );

    setUsuarios(usuariosAtuais);
    setUsuarioLogado(usuarioEncontrado);

    return usuarioEncontrado;
  }

  // Encerra a sessão sem excluir o cadastro.
  async function sairDaConta() {
    await AsyncStorage.removeItem(CHAVE_SESSAO);
    setUsuarioLogado(null);
  }

  // Atualiza nome, e-mail e telefone.
  async function atualizarUsuario(dadosAtualizados) {
    if (!usuarioLogado) {
      throw new Error('Nenhum usuário está conectado.');
    }

    const usuariosAtuais = await obterUsuariosAtualizados();

    const nome = dadosAtualizados.nome !== undefined
      ? dadosAtualizados.nome.trim()
      : usuarioLogado.nome;

    const email = dadosAtualizados.email !== undefined
      ? dadosAtualizados.email.trim().toLowerCase()
      : usuarioLogado.email;

    const telefone = dadosAtualizados.telefone !== undefined
      ? limparTelefone(dadosAtualizados.telefone)
      : usuarioLogado.telefone || '';

    if (!nome || !email) {
      throw new Error('Nome e e-mail são obrigatórios.');
    }

    const formatoEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formatoEmail.test(email)) {
      throw new Error('Digite um endereço de e-mail válido.');
    }

    // Valida o telefone antes de atualizar.
    if (!validarTelefone(telefone)) {
      throw new Error(
        'Digite um telefone brasileiro válido, incluindo o DDD.'
      );
    }

    const emailEmUso = usuariosAtuais.some(
      usuario =>
        usuario.id !== usuarioLogado.id &&
        usuario.email.toLowerCase() === email
    );

    if (emailEmUso) {
      throw new Error(
        'Esse e-mail já está sendo utilizado por outra conta.'
      );
    }

    const usuarioAtualizado = {
      ...usuarioLogado,
      nome,
      email,
      telefone,
    };

    const novaLista = usuariosAtuais.map(usuario =>
      usuario.id === usuarioLogado.id
        ? usuarioAtualizado
        : usuario
    );

    await AsyncStorage.setItem(
      CHAVE_USUARIOS,
      JSON.stringify(novaLista)
    );

    setUsuarios(novaLista);
    setUsuarioLogado(usuarioAtualizado);

    return usuarioAtualizado;
  }

  // Altera a senha de uma conta existente.
  async function alterarSenha(emailInformado, novaSenha) {
    const email = emailInformado.trim().toLowerCase();

    const usuariosAtuais = await obterUsuariosAtualizados();

    const usuarioEncontrado = usuariosAtuais.find(
      usuario => usuario.email.toLowerCase() === email
    );

    if (!usuarioEncontrado) {
      throw new Error(
        'Não encontramos uma conta com esse e-mail.'
      );
    }

    if (!novaSenha || novaSenha.length < 8) {
      throw new Error(
        'A senha precisa ter pelo menos 8 caracteres.'
      );
    }

    const novaLista = usuariosAtuais.map(usuario =>
      usuario.id === usuarioEncontrado.id
        ? { ...usuario, senha: novaSenha }
        : usuario
    );

    await AsyncStorage.setItem(
      CHAVE_USUARIOS,
      JSON.stringify(novaLista)
    );

    setUsuarios(novaLista);

    if (usuarioLogado?.id === usuarioEncontrado.id) {
      setUsuarioLogado({
        ...usuarioLogado,
        senha: novaSenha,
      });
    }
  }

  return (
    <AuthContext.Provider
      value={{
        usuarios,
        usuarioLogado,
        carregando,
        cadastrarUsuario,
        fazerLogin,
        sairDaConta,
        atualizarUsuario,
        alterarSenha,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const contexto = useContext(AuthContext);

  if (!contexto) {
    throw new Error(
      'useAuth precisa ser utilizado dentro de AuthProvider.'
    );
  }

  return contexto;
}
