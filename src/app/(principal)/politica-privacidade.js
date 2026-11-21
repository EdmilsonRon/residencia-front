import React from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const TITULO = 'Política de Privacidade e Segurança';
const ATUALIZACAO = 'Última atualização: 17 de novembro de 2026';


const SECOES = [
  {
    titulo: '1. Introdução',
    blocos: [
      {
        tipo: 'p',
        texto:
          'Nosso aplicativo foi desenvolvido para ajudar você a organizar e acompanhar sua vida financeira de maneira simples, prática e segura.',
      },
      {
        tipo: 'p',
        texto:
          'A privacidade dos nossos usuários é uma prioridade. Esta política explica como coletamos, utilizamos, armazenamos e protegemos suas informações pessoais e financeiras durante o uso da plataforma.',
      },
      {
        tipo: 'p',
        texto:
          'Ao utilizar nosso aplicativo, você declara estar ciente das condições descritas nesta Política de Privacidade.',
      },
    ],
  },
  {
    titulo: '2. Informações Coletadas',
    blocos: [
      {
        tipo: 'p',
        texto:
          'Para oferecer nossos serviços, poderemos coletar e armazenar as seguintes informações:',
      },
      {
        tipo: 'lista',
        itens: [
          {
            rotulo: 'Dados pessoais:',
            texto:
              'nome, endereço de e-mail e informações utilizadas para identificação da conta.',
          },
          {
            rotulo: 'Dados financeiros:',
            texto:
              'receitas, despesas, saldos, categorias de gastos, contas e registros financeiros cadastrados pelo próprio usuário.',
          },
          {
            rotulo: 'Dados de utilização:',
            texto:
              'informações sobre funcionalidades utilizadas e interações com o aplicativo.',
          },
          {
            rotulo: 'Dados técnicos:',
            texto:
              'informações necessárias para garantir o funcionamento, a manutenção e a segurança da plataforma.',
          },
        ],
      },
      {
        tipo: 'p',
        texto:
          'Coletamos somente as informações necessárias para disponibilizar e melhorar nossos serviços.',
      },
    ],
  },
  {
    titulo: '3. Utilização das Informações',
    blocos: [
      {
        tipo: 'p',
        texto:
          'As informações fornecidas pelos usuários poderão ser utilizadas para:',
      },
      {
        tipo: 'lista',
        itens: [
          'Organizar e apresentar dados financeiros em painéis e relatórios.',
          'Calcular saldos, receitas, despesas e estatísticas.',
          'Permitir o acompanhamento da evolução financeira.',
          'Personalizar a experiência de utilização.',
          'Melhorar o desempenho e a funcionalidade do aplicativo.',
          'Identificar atividades suspeitas e prevenir acessos não autorizados.',
        ],
      },
      {
        tipo: 'destaque',
        texto:
          'Não utilizamos seus dados financeiros para realizar movimentações bancárias ou transações sem autorização expressa do usuário.',
      },
    ],
  },
  {
    titulo: '4. Armazenamento e Segurança dos Dados',
    blocos: [
      {
        tipo: 'p',
        texto:
          'Adotamos medidas técnicas e administrativas para proteger as informações armazenadas contra acessos não autorizados, alterações indevidas, vazamentos, perdas ou destruição.',
      },
      {
        tipo: 'p',
        texto:
          'Entre as medidas de segurança que poderão ser utilizadas estão:',
      },
      {
        tipo: 'lista',
        itens: [
          'Proteção das credenciais de acesso.',
          'Controle de permissões e autenticação de usuários.',
          'Armazenamento seguro das informações.',
          'Medidas de proteção contra acessos indevidos.',
        ],
      },
      {
        tipo: 'p',
        texto:
          'Apesar dos esforços para garantir a segurança, nenhum sistema digital pode oferecer proteção absoluta contra todos os riscos existentes.',
      },
    ],
  },
  {
    titulo: '5. Compartilhamento de Informações',
    blocos: [
      {
        tipo: 'p',
        texto:
          'A privacidade dos usuários é respeitada. Não comercializamos nem vendemos informações pessoais ou financeiras.',
      },
    ],
  },
  {
    titulo: '6. Direitos dos Usuários',
    blocos: [
      {
        tipo: 'p',
        texto:
          'O usuário possui o direito de solicitar, conforme a legislação aplicável:',
      },
      {
        tipo: 'lista',
        itens: [
          'Acesso aos seus dados pessoais.',
          'Correção de informações incompletas ou desatualizadas.',
          'Informações sobre o tratamento de seus dados.',
          'Revogação do consentimento, quando aplicável.',
        ],
      },
    ],
  },
  {
    titulo: '7. Responsabilidade do Usuário',
    blocos: [
      {
        tipo: 'p',
        texto: 'Para manter sua conta protegida, recomendamos:',
      },
      {
        tipo: 'lista',
        itens: [
          'Não compartilhar sua senha com terceiros.',
          'Utilizar uma senha segura e exclusiva.',
          'Encerrar a sessão ao utilizar dispositivos compartilhados.',
          'Manter seus dispositivos atualizados.',
        ],
      },
      {
        tipo: 'p',
        texto:
          'O usuário é responsável por manter a confidencialidade de suas credenciais de acesso.',
      },
    ],
  },
  {
    titulo: '8. Retenção e Exclusão de Dados',
    blocos: [
      {
        tipo: 'p',
        texto:
          'As informações serão armazenadas pelo período necessário para cumprir as finalidades descritas nesta política ou atender às obrigações legais aplicáveis.',
      },
      {
        tipo: 'p',
        texto:
          'O usuário poderá solicitar a exclusão de sua conta e dos dados associados, respeitando os casos em que a legislação exigir a conservação de determinadas informações.',
      },
    ],
  },
  {
    titulo: '9. Alterações nesta Política',
    blocos: [
      {
        tipo: 'p',
        texto:
          'Esta Política de Privacidade poderá ser atualizada periodicamente para acompanhar mudanças nos serviços, nas tecnologias utilizadas ou na legislação aplicável.',
      },
      {
        tipo: 'p',
        texto:
          'Sempre que houver alterações relevantes, os usuários poderão ser comunicados por meio do próprio aplicativo ou de outros canais disponíveis.',
      },
    ],
  },
];

const FRASE_FINAL =
  'Sua privacidade e segurança são fundamentais para nós. Nosso compromisso é oferecer uma experiência financeira transparente, confiável e protegida.';

function Bloco({ bloco }) {
  if (bloco.tipo === 'lista') {
    return (
      <View style={estilos.lista}>
        {bloco.itens.map((item) => {
          const rotulo = typeof item === 'string' ? null : item.rotulo;
          const texto = typeof item === 'string' ? item : item.texto;

          return (
            <View key={texto} style={estilos.itemLista}>
              <View style={estilos.marcador} />

              <Text style={estilos.textoItem}>
                {rotulo && <Text style={estilos.negrito}>{rotulo} </Text>}
                {texto}
              </Text>
            </View>
          );
        })}
      </View>
    );
  }

  return (
    <Text
      style={[
        estilos.paragrafo,
        bloco.tipo === 'destaque' && estilos.negrito,
      ]}
    >
      {bloco.texto}
    </Text>
  );
}

export default function PoliticaPrivacidade() {
  return (
    <View style={estilos.container}>
      <ScrollView
        contentContainerStyle={estilos.conteudo}
        showsVerticalScrollIndicator={false}
      >
        <View style={estilos.cabecalho}>
          <TouchableOpacity
            style={estilos.botaoVoltar}
            onPress={() => router.back()}
            accessibilityLabel="Voltar"
          >
            <Ionicons name="arrow-back" size={22} color="#252525" />
          </TouchableOpacity>

          <View style={estilos.cabecalhoTexto}>
            <Text style={estilos.titulo}>{TITULO}</Text>
            <Text style={estilos.subtitulo}>{ATUALIZACAO}</Text>
          </View>
        </View>

        {SECOES.map((secao) => (
          <View key={secao.titulo} style={estilos.cartao}>
            <Text style={estilos.tituloSecao}>{secao.titulo}</Text>

            {secao.blocos.map((bloco, indice) => (
              <Bloco key={indice} bloco={bloco} />
            ))}
          </View>
        ))}

        <View style={estilos.cartaoFinal}>
          <Ionicons name="shield-checkmark" size={26} color="#D92344" />

          <Text style={estilos.textoFinal}>{FRASE_FINAL}</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },

  conteudo: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 35,
  },

  cabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 22,
  },

  botaoVoltar: {
    width: 43,
    height: 43,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  cabecalhoTexto: {
    flex: 1,
  },

  titulo: {
    fontSize: 21,
    fontWeight: '800',
    color: '#252525',
  },

  subtitulo: {
    fontSize: 12,
    color: '#888888',
    marginTop: 5,
  },

  cartao: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },

  tituloSecao: {
    fontSize: 16,
    fontWeight: '800',
    color: '#252525',
    marginBottom: 10,
  },

  paragrafo: {
    fontSize: 14,
    color: '#444444',
    lineHeight: 21,
    marginBottom: 10,
  },

  negrito: {
    fontWeight: '800',
    color: '#252525',
  },

  lista: {
    marginBottom: 6,
  },

  itemLista: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 9,
  },

  marcador: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#D92344',
    marginTop: 8,
    marginRight: 10,
  },

  textoItem: {
    flex: 1,
    fontSize: 14,
    color: '#444444',
    lineHeight: 21,
  },

  cartaoFinal: {
    backgroundColor: '#FCE8E6',
    borderRadius: 18,
    padding: 18,
    alignItems: 'center',
    gap: 10,
  },

  textoFinal: {
    fontSize: 14,
    fontWeight: '700',
    color: '#252525',
    lineHeight: 21,
    textAlign: 'center',
  },
});
