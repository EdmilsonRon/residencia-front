import React, { useMemo, useState, useEffect } from 'react';
 
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
 
import { useTransacoes } from '../../contexts/TransacoesContext';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
 
export default function Transacoes() {
  const [filtroAtivo, setFiltroAtivo] = useState('Todas');
  const [busca, setBusca] = useState('');
  const [mostrarArquivadas, setMostrarArquivadas] = useState(false);
  const [paginaAtiva, setPaginaAtiva] = useState(1);
  const [paginaArquivadas, setPaginaArquivadas] = useState(1);
  const ITENS_POR_PAGINA = 20;
 
  useEffect(() => {
    setPaginaAtiva(1);
    setPaginaArquivadas(1);
  }, [busca, filtroAtivo]);
 
  const [lancamentoSelecionado, setLancamentoSelecionado] = useState(null);
  const [mostrarOpcoes, setMostrarOpcoes] = useState(false);
  const [mostrarEdicao, setMostrarEdicao] = useState(false);
 
  const [escopoEdicao, setEscopoEdicao] = useState('unico');
  const [descricaoEdicao, setDescricaoEdicao] = useState('');
  const [categoriaEdicao, setCategoriaEdicao] = useState('');
  const [valorEdicao, setValorEdicao] = useState('');
 
  const {
    transacoes,
    lancamentosPendentes,
    confirmarLancamento,
    editarLancamento,
    excluirLancamentosFuturos,
    cancelarRecorrencia,
    arquivarTransacao,
    restaurarTransacao,
    carregado,
  } = useTransacoes();
 
  function obterDataHoje() {
    const hoje = new Date();
 
    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, '0');
    const dia = String(hoje.getDate()).padStart(2, '0');
 
    return `${ano}-${mes}-${dia}`;
  }
 
  const hoje = obterDataHoje();
 
  function formatarMoeda(valor) {
    return Number(valor || 0).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  }
 
  function formatarData(data) {
    if (!data) return '';
 
    const [ano, mes, dia] = data.split('-');
 
    const meses = [
      'jan.', 'fev.', 'mar.', 'abr.',
      'mai.', 'jun.', 'jul.', 'ago.',
      'set.', 'out.', 'nov.', 'dez.',
    ];
 
    return `${dia} ${meses[Number(mes) - 1]} ${ano}`;
  }
 
  function obterSituacao(item) {
    if (item.data < hoje) return 'Atrasado';
    if (item.data === hoje) return 'Disponível hoje';
 
    return 'Agendado';
  }
 
  /*
   * IMPORTANTE:
   * O saldo considera TODAS as transações.
   * Não filtramos as arquivadas aqui.
   */
  const totalReceitas = transacoes
    .filter((item) => item.tipo === 'Receita')
    .reduce((total, item) => total + Number(item.valor), 0);
 
  const totalDespesas = transacoes
    .filter((item) => item.tipo === 'Despesa')
    .reduce((total, item) => total + Number(item.valor), 0);
 
  const saldoPeriodo = totalReceitas - totalDespesas;
 
  const transacoesAtivas = useMemo(
    () => transacoes.filter((item) => !item.arquivada),
    [transacoes]
  );
 
  const transacoesArquivadas = useMemo(
    () => transacoes.filter((item) => item.arquivada),
    [transacoes]
  );
 
  const transacoesFiltradas = useMemo(() => {
    const textoBusca = busca.trim().toLowerCase();
 
    return transacoesAtivas
      .filter((item) => {
        const correspondeAoFiltro =
          filtroAtivo === 'Todas' ||
          item.tipo === filtroAtivo;
 
        const correspondeABusca =
          (item.descricao || '').toLowerCase().includes(textoBusca) ||
          (item.categoria || '').toLowerCase().includes(textoBusca);
 
        return correspondeAoFiltro && correspondeABusca;
      })
      .sort((a, b) => b.data.localeCompare(a.data));
  }, [transacoesAtivas, filtroAtivo, busca]);
 
  const arquivadasFiltradas = useMemo(() => {
    const textoBusca = busca.trim().toLowerCase();
 
    return transacoesArquivadas
      .filter((item) => {
        const correspondeAoFiltro =
          filtroAtivo === 'Todas' ||
          item.tipo === filtroAtivo;
 
        const correspondeABusca =
          (item.descricao || '').toLowerCase().includes(textoBusca) ||
          (item.categoria || '').toLowerCase().includes(textoBusca);
 
        return correspondeAoFiltro && correspondeABusca;
      })
      .sort((a, b) => b.data.localeCompare(a.data));
  }, [transacoesArquivadas, filtroAtivo, busca]);
 
  const pendentesFiltrados = useMemo(() => {
    const textoBusca = busca.trim().toLowerCase();
 
    return lancamentosPendentes
      .filter((item) => {
        const correspondeAoFiltro =
          filtroAtivo === 'Todas' ||
          item.tipo === filtroAtivo;
 
        const correspondeABusca =
          (item.descricao || '').toLowerCase().includes(textoBusca) ||
          (item.categoria || '').toLowerCase().includes(textoBusca);
 
        return correspondeAoFiltro && correspondeABusca;
      })
      .sort((a, b) => a.data.localeCompare(b.data));
  }, [lancamentosPendentes, filtroAtivo, busca]);
 
  function abrirNovaTransacao() {
    router.push('/nova-transacao');
  }
 
  function confirmar(item) {
    if (item.data > hoje) {
      Alert.alert(
        'Lançamento futuro',
        `Esse lançamento está programado para ${formatarData(item.data)}. Você poderá confirmá-lo nessa data.`
      );
 
      return;
    }
 
    Alert.alert(
      'Confirmar lançamento',
      `Deseja confirmar "${item.descricao}" no valor de ${formatarMoeda(item.valor)}?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Confirmar',
          onPress: () => {
            const sucesso = confirmarLancamento(item.id);
 
            if (!sucesso) {
              Alert.alert(
                'Não foi possível confirmar',
                'Verifique a data do lançamento.'
              );
            }
          },
        },
      ]
    );
  }
 
  function abrirOpcoes(item) {
    setLancamentoSelecionado(item);
    setMostrarOpcoes(true);
  }
 
  function abrirEdicao(escopo) {
    if (!lancamentoSelecionado) return;
 
    setEscopoEdicao(escopo);
    setDescricaoEdicao(lancamentoSelecionado.descricao || '');
    setCategoriaEdicao(lancamentoSelecionado.categoria || '');
    setValorEdicao(
      String(lancamentoSelecionado.valor || '').replace('.', ',')
    );
 
    setMostrarOpcoes(false);
    setMostrarEdicao(true);
  }
 
  function converterValor(valorDigitado) {
    let normalizado = valorDigitado.trim().replace(/\s/g, '');
 
    if (normalizado.includes(',')) {
      normalizado = normalizado
        .replace(/\./g, '')
        .replace(',', '.');
    }
 
    return Number(normalizado);
  }
 
  function salvarEdicao() {
    if (!lancamentoSelecionado) return;
 
    const valorNumerico = converterValor(valorEdicao);
 
    if (!descricaoEdicao.trim()) {
      Alert.alert(
        'Descrição obrigatória',
        'Informe uma descrição.'
      );
      return;
    }
 
    if (!categoriaEdicao.trim()) {
      Alert.alert(
        'Categoria obrigatória',
        'Informe uma categoria.'
      );
      return;
    }
 
    if (
      !Number.isFinite(valorNumerico) ||
      valorNumerico <= 0
    ) {
      Alert.alert(
        'Valor inválido',
        'Informe um valor maior que zero.'
      );
      return;
    }
 
    const sucesso = editarLancamento(
      lancamentoSelecionado.id,
      {
        descricao: descricaoEdicao,
        categoria: categoriaEdicao,
        valor: valorNumerico,
      },
      escopoEdicao
    );
 
    if (!sucesso) {
      Alert.alert(
        'Erro',
        'Não foi possível atualizar o lançamento.'
      );
      return;
    }
 
    setMostrarEdicao(false);
    setLancamentoSelecionado(null);
 
    Alert.alert(
      'Lançamento atualizado!',
      escopoEdicao === 'proximos'
        ? 'Este lançamento e os próximos pendentes foram atualizados. Os já confirmados foram preservados.'
        : 'Somente este lançamento foi atualizado.'
    );
  }
 
  function excluirEsteEFuturos() {
    if (!lancamentoSelecionado) return;
 
    const item = lancamentoSelecionado;
 
    setMostrarOpcoes(false);
 
    Alert.alert(
      'Excluir lançamentos',
      item.recorrenciaId
        ? `Deseja excluir ${item.descricao} a partir da parcela ${item.parcela}? As parcelas anteriores e já confirmadas serão preservadas.`
        : `Deseja excluir o lançamento "${item.descricao}"?`,
      [
        {
          text: 'Voltar',
          style: 'cancel',
        },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => {
            const sucesso = excluirLancamentosFuturos(item.id);
 
            if (sucesso) {
              setLancamentoSelecionado(null);
 
              Alert.alert(
                'Lançamentos excluídos',
                'Os lançamentos selecionados foram removidos. O histórico confirmado foi preservado.'
              );
            }
          },
        },
      ]
    );
  }
 
  function cancelarProgramacao() {
    if (!lancamentoSelecionado?.recorrenciaId) return;
 
    const item = lancamentoSelecionado;
 
    setMostrarOpcoes(false);
 
    Alert.alert(
      'Cancelar programação inteira',
      `Deseja cancelar toda a programação de "${item.descricao}"? Todos os lançamentos ainda pendentes serão removidos. Os já confirmados continuarão no histórico.`,
      [
        {
          text: 'Voltar',
          style: 'cancel',
        },
        {
          text: 'Cancelar programação',
          style: 'destructive',
          onPress: () => {
            cancelarRecorrencia(item.recorrenciaId);
            setLancamentoSelecionado(null);
 
            Alert.alert(
              'Programação cancelada',
              'Os lançamentos pendentes foram removidos. As movimentações confirmadas foram preservadas.'
            );
          },
        },
      ]
    );
  }
 
  function confirmarArquivamento(item) {
    Alert.alert(
      'Arquivar movimentação',
      `Deseja arquivar "${item.descricao}"? Ela sairá da lista principal, mas continuará no histórico e nos cálculos financeiros.`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Arquivar',
          onPress: () => {
            const sucesso = arquivarTransacao(item.id);
 
            if (sucesso) {
              Alert.alert(
                'Movimentação arquivada',
                'O registro foi preservado e continua sendo considerado nos cálculos.'
              );
            }
          },
        },
      ]
    );
  }
 
  function confirmarRestauracao(item) {
    Alert.alert(
      'Restaurar movimentação',
      `Deseja restaurar "${item.descricao}" para a lista principal?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Restaurar',
          onPress: () => {
            const sucesso = restaurarTransacao(item.id);
 
            if (sucesso) {
              Alert.alert(
                'Movimentação restaurada',
                'O registro voltou para a lista principal. O limite de 100 movimentações foi mantido.'
              );
            }
          },
        },
      ]
    );
  }
 
  function renderizarTransacao(item, arquivada = false) {
    const receita = item.tipo === 'Receita';
 
    return (
      <View key={item.id} style={estilos.transacao}>
        <View
          style={[
            estilos.iconeTransacao,
            { backgroundColor: item.corFundo || '#F1F1F1' },
          ]}
        >
          <Ionicons
            name={item.icone || 'cash-outline'}
            size={22}
            color={item.corIcone || '#777777'}
          />
        </View>
 
        <View style={estilos.detalhesTransacao}>
          <Text style={estilos.descricaoTransacao}>
            {item.descricao}
          </Text>
 
          <Text style={estilos.categoriaTransacao}>
            {item.categoria}
          </Text>
 
          {item.totalParcelas && (
            <Text style={estilos.textoParcela}>
              Parcela {item.parcela}/{item.totalParcelas}
            </Text>
          )}
        </View>
 
        <View style={estilos.areaValor}>
          <Text
            style={[
              estilos.valorTransacao,
              receita
                ? estilos.valorReceita
                : estilos.valorDespesa,
            ]}
          >
            {receita ? '+' : '-'}
            {formatarMoeda(item.valor)}
          </Text>
 
          <Text style={estilos.tipoTransacao}>
            {item.tipo}
          </Text>
        </View>
 
        <TouchableOpacity
          style={estilos.botaoAcaoHistorico}
          onPress={() =>
            arquivada
              ? confirmarRestauracao(item)
              : confirmarArquivamento(item)
          }
        >
          <Ionicons
            name={arquivada ? 'refresh-outline' : 'archive-outline'}
            size={19}
            color={arquivada ? '#238B45' : '#777777'}
          />
        </TouchableOpacity>
      </View>
    );
  }
 
  function renderizarPendente(item) {
    const receita = item.tipo === 'Receita';
    const situacao = obterSituacao(item);
    const disponivel = item.data <= hoje;
 
    return (
      <View key={item.id} style={estilos.cartaoPendente}>
        <View style={estilos.linhaPendente}>
          <View
            style={[
              estilos.iconeTransacao,
              { backgroundColor: item.corFundo || '#F1F1F1' },
            ]}
          >
            <Ionicons
              name={item.icone || 'calendar-outline'}
              size={22}
              color={item.corIcone || '#777777'}
            />
          </View>
 
          <View style={estilos.detalhesTransacao}>
            <Text style={estilos.descricaoTransacao}>
              {item.descricao}
            </Text>
 
            <Text style={estilos.categoriaTransacao}>
              {item.categoria}
            </Text>
 
            {item.totalParcelas && (
              <Text style={estilos.textoParcela}>
                Parcela {item.parcela}/{item.totalParcelas}
              </Text>
            )}
          </View>
 
          <View style={estilos.areaValor}>
            <Text
              style={[
                estilos.valorTransacao,
                receita
                  ? estilos.valorReceita
                  : estilos.valorDespesa,
              ]}
            >
              {receita ? '+' : '-'}
              {formatarMoeda(item.valor)}
            </Text>
 
            <Text style={estilos.tipoTransacao}>
              {formatarData(item.data)}
            </Text>
          </View>
 
          <TouchableOpacity
            style={estilos.botaoOpcoes}
            onPress={() => abrirOpcoes(item)}
          >
            <Ionicons
              name="ellipsis-vertical"
              size={20}
              color="#777777"
            />
          </TouchableOpacity>
        </View>
 
        <View style={estilos.linhaSituacao}>
          <View style={estilos.statusPendente}>
            <Ionicons
              name="time-outline"
              size={14}
              color={situacao === 'Atrasado' ? '#D92344' : '#C47A16'}
            />
 
            <Text
              style={[
                estilos.textoStatus,
                situacao === 'Atrasado' && { color: '#D92344' },
              ]}
            >
              {situacao}
            </Text>
          </View>
 
          <TouchableOpacity
            style={[
              estilos.botaoConfirmar,
              !disponivel && estilos.botaoConfirmarDesativado,
            ]}
            disabled={!disponivel}
            onPress={() => confirmar(item)}
          >
            <Ionicons
              name="checkmark-circle-outline"
              size={17}
              color={disponivel ? '#FFFFFF' : '#999999'}
            />
 
            <Text
              style={[
                estilos.textoBotaoConfirmar,
                !disponivel && { color: '#999999' },
              ]}
            >
              Confirmar
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
 
  function limparFiltros() {
    setBusca('');
    setFiltroAtivo('Todas');
  }
 
  function separarPaginasPorData(lista) {
    const grupos = [];
    lista.forEach((item) => {
      const ultimoGrupo = grupos[grupos.length - 1];
      if (!ultimoGrupo || ultimoGrupo.data !== item.data) {
        grupos.push({ data: item.data, itens: [item] });
      } else {
        ultimoGrupo.itens.push(item);
      }
    });
 
    const paginas = [];
    let pagina = [];
    let quantidade = 0;
 
    grupos.forEach((grupo) => {
      if (quantidade >= ITENS_POR_PAGINA && pagina.length > 0) {
        paginas.push(pagina);
        pagina = [];
        quantidade = 0;
      }
      pagina.push(...grupo.itens);
      quantidade += grupo.itens.length;
    });
 
    if (pagina.length > 0) paginas.push(pagina);
    return paginas;
  }
 
  const paginasAtivas = separarPaginasPorData(transacoesFiltradas);
  const paginasArquivadas = separarPaginasPorData(arquivadasFiltradas);
  const totalPaginasAtivas = Math.max(1, paginasAtivas.length);
  const totalPaginasArquivadas = Math.max(1, paginasArquivadas.length);
  const transacoesDaPagina = paginasAtivas[paginaAtiva - 1] || [];
  const arquivadasDaPagina = paginasArquivadas[paginaArquivadas - 1] || [];
 
  useEffect(() => {
    if (paginaAtiva > totalPaginasAtivas) setPaginaAtiva(totalPaginasAtivas);
    if (paginaArquivadas > totalPaginasArquivadas) setPaginaArquivadas(totalPaginasArquivadas);
  }, [paginaAtiva, paginaArquivadas, totalPaginasAtivas, totalPaginasArquivadas]);
 
  function renderizarPaginacao(pagina, total, alterarPagina) {
    if (total <= 1) return null;
 
    return (
      <View style={estilos.paginacao}>
        <TouchableOpacity
          style={[estilos.botaoPagina, pagina === 1 && estilos.botaoPaginaDesativado]}
          disabled={pagina === 1}
          onPress={() => alterarPagina(pagina - 1)}
        >
          <Ionicons name="chevron-back" size={17} color={pagina === 1 ? '#BBBBBB' : '#D92344'} />
          <Text style={[estilos.textoPagina, pagina === 1 && estilos.textoPaginaDesativado]}>Anterior</Text>
        </TouchableOpacity>
        <Text style={estilos.contadorPagina}>Página {pagina} de {total}</Text>
        <TouchableOpacity
          style={[estilos.botaoPagina, pagina === total && estilos.botaoPaginaDesativado]}
          disabled={pagina === total}
          onPress={() => alterarPagina(pagina + 1)}
        >
          <Text style={[estilos.textoPagina, pagina === total && estilos.textoPaginaDesativado]}>Próxima</Text>
          <Ionicons name="chevron-forward" size={17} color={pagina === total ? '#BBBBBB' : '#D92344'} />
        </TouchableOpacity>
      </View>
    );
  }
 
  function renderizarGrupos(lista, arquivada = false) {
    const grupos = {};
 
    lista.forEach((item) => {
      if (!grupos[item.data]) {
        grupos[item.data] = [];
      }
 
      grupos[item.data].push(item);
    });
 
    return Object.entries(grupos)
      .sort(([dataA], [dataB]) => dataB.localeCompare(dataA))
      .map(([data, itens]) => (
        <View key={data} style={estilos.grupoData}>
          <Text style={estilos.tituloData}>
            {formatarData(data)}
          </Text>
 
          <View style={estilos.cartaoTransacoes}>
            {itens.map((item) =>
              renderizarTransacao(item, arquivada)
            )}
          </View>
        </View>
      ));
  }
 
  if (!carregado) {
    return (
      <View style={estilos.carregando}>
        <Text style={estilos.textoCarregando}>
          Carregando transações...
        </Text>
      </View>
    );
  }
 
  return (
    <View style={estilos.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={estilos.conteudo}
        keyboardShouldPersistTaps="handled"
      >
        <View style={estilos.cabecalho}>
          <View>
            <Text style={estilos.subtitulo}>
              Acompanhe suas movimentações
            </Text>
 
            <Text style={estilos.titulo}>
              Transações
            </Text>
          </View>
 
          <TouchableOpacity
            style={estilos.botaoAdicionar}
            onPress={abrirNovaTransacao}
          >
            <Ionicons
              name="add"
              size={27}
              color="#FFFFFF"
            />
          </TouchableOpacity>
        </View>
 
        <View style={estilos.cartaoSaldo}>
          <Text style={estilos.rotuloSaldo}>
            Saldo das movimentações confirmadas
          </Text>
 
          <Text style={estilos.valorSaldo}>
            {formatarMoeda(saldoPeriodo)}
          </Text>
 
          <View style={estilos.linhaResumo}>
            <View style={estilos.itemResumo}>
              <View style={estilos.iconeResumo}>
                <Ionicons
                  name="arrow-down"
                  size={17}
                  color="#FFFFFF"
                />
              </View>
 
              <View>
                <Text style={estilos.rotuloResumo}>
                  Receitas
                </Text>
 
                <Text style={estilos.valorResumo}>
                  {formatarMoeda(totalReceitas)}
                </Text>
              </View>
            </View>
 
            <View style={estilos.itemResumo}>
              <View style={estilos.iconeResumo}>
                <Ionicons
                  name="arrow-up"
                  size={17}
                  color="#FFFFFF"
                />
              </View>
 
              <View>
                <Text style={estilos.rotuloResumo}>
                  Despesas
                </Text>
 
                <Text style={estilos.valorResumo}>
                  {formatarMoeda(totalDespesas)}
                </Text>
              </View>
            </View>
          </View>
        </View>
 
        <View style={estilos.avisoLimite}>
          <Ionicons
            name="archive-outline"
            size={19}
            color="#D92344"
          />
 
          <Text style={estilos.textoAvisoLimite}>
            A lista principal mantém até 100 movimentações.
            As mais antigas são arquivadas sem serem apagadas.
          </Text>
        </View>
 
        <View style={estilos.cabecalhoLista}>
          <Text style={estilos.tituloSecao}>
            Movimentações
          </Text>
 
          <View style={estilos.seletorPeriodo}>
            <Ionicons
              name="calendar-outline"
              size={16}
              color="#D92344"
            />
 
            <Text style={estilos.textoPeriodo}>
              Todas as datas
            </Text>
          </View>
        </View>
 
        <View style={estilos.campoBusca}>
          <Ionicons
            name="search-outline"
            size={21}
            color="#888888"
          />
 
          <TextInput
            style={estilos.inputBusca}
            placeholder="Buscar transação ou categoria"
            placeholderTextColor="#999999"
            value={busca}
            onChangeText={setBusca}
            autoCapitalize="none"
            autoCorrect={false}
          />
 
          {busca.length > 0 && (
            <TouchableOpacity onPress={() => setBusca('')}>
              <Ionicons
                name="close-circle"
                size={20}
                color="#888888"
              />
            </TouchableOpacity>
          )}
        </View>
 
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={estilos.filtros}
        >
          {['Todas', 'Receita', 'Despesa'].map((filtro) => {
            const ativo = filtroAtivo === filtro;
 
            return (
              <TouchableOpacity
                key={filtro}
                style={[
                  estilos.botaoFiltro,
                  ativo && estilos.botaoFiltroAtivo,
                ]}
                onPress={() => setFiltroAtivo(filtro)}
              >
                <Text
                  style={[
                    estilos.textoFiltro,
                    ativo && estilos.textoFiltroAtivo,
                  ]}
                >
                  {filtro === 'Todas'
                    ? 'Todas'
                    : filtro === 'Receita'
                      ? 'Receitas'
                      : 'Despesas'}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
 
        <View style={estilos.cabecalhoProgramados}>
          <View>
            <Text style={estilos.tituloSecao}>
              Lançamentos programados
            </Text>
 
            <Text style={estilos.subtituloProgramados}>
              Confirme quando realizar o pagamento ou recebimento.
            </Text>
          </View>
 
          <View style={estilos.contadorPendentes}>
            <Text style={estilos.numeroPendentes}>
              {pendentesFiltrados.length}
            </Text>
          </View>
        </View>
 
        {pendentesFiltrados.length > 0 ? (
          <View style={estilos.listaPendentes}>
            {pendentesFiltrados.map(renderizarPendente)}
          </View>
        ) : (
          <View style={estilos.vazioProgramados}>
            <Ionicons
              name="calendar-outline"
              size={27}
              color="#AAAAAA"
            />
 
            <Text style={estilos.textoVazioProgramados}>
              Nenhum lançamento programado encontrado.
            </Text>
          </View>
        )}
 
        <View style={estilos.cabecalhoRealizadas}>
          <Text style={estilos.tituloSecao}>
            Movimentações realizadas
          </Text>
 
          <Text style={estilos.quantidadeRealizadas}>
            {transacoesFiltradas.length} de 100
          </Text>
        </View>
 
        {transacoesFiltradas.length > 0 ? (
          renderizarGrupos(transacoesDaPagina)
        ) : (
          <View style={estilos.estadoVazio}>
            <Ionicons
              name="search-outline"
              size={32}
              color="#D92344"
            />
 
            <Text style={estilos.tituloVazio}>
              Nenhuma transação encontrada
            </Text>
 
            <Text style={estilos.textoVazio}>
              Tente mudar os filtros ou pesquisar outro nome.
            </Text>
 
            <TouchableOpacity
              style={estilos.botaoLimpar}
              onPress={limparFiltros}
            >
              <Text style={estilos.textoBotaoLimpar}>
                Limpar filtros
              </Text>
            </TouchableOpacity>
          </View>
        )}
        {renderizarPaginacao(paginaAtiva, totalPaginasAtivas, setPaginaAtiva)}
 
        {/* ÁREA DE ARQUIVADAS */}
        <TouchableOpacity
          style={estilos.botaoMostrarArquivadas}
          onPress={() => setMostrarArquivadas(!mostrarArquivadas)}
        >
          <View style={estilos.linhaBotaoArquivadas}>
            <Ionicons
              name="archive-outline"
              size={20}
              color="#D92344"
            />
 
            <View style={{ flex: 1 }}>
              <Text style={estilos.tituloArquivadas}>
                Movimentações arquivadas
              </Text>
 
              <Text style={estilos.subtituloArquivadas}>
                {transacoesArquivadas.length} registros preservados
              </Text>
            </View>
 
            <Ionicons
              name={
                mostrarArquivadas
                  ? 'chevron-up'
                  : 'chevron-down'
              }
              size={20}
              color="#777777"
            />
          </View>
        </TouchableOpacity>
 
        {mostrarArquivadas && (
          <View style={estilos.areaArquivadas}>
            <Text style={estilos.textoOrientacaoArquivadas}>
              Esses registros continuam fazendo parte dos seus
              cálculos financeiros. Use o botão de restauração
              para colocá-los novamente na lista principal.
            </Text>
 
            {arquivadasFiltradas.length > 0 ? (
              renderizarGrupos(arquivadasDaPagina, true)
            ) : (
              <View style={estilos.vazioProgramados}>
                <Text style={estilos.textoVazioProgramados}>
                  Nenhuma movimentação arquivada encontrada.
                </Text>
              </View>
            )}
            {renderizarPaginacao(paginaArquivadas, totalPaginasArquivadas, setPaginaArquivadas)}
          </View>
        )}
 
        <Text style={estilos.rodape}>
          {transacoes.length} movimentações preservadas no histórico
        </Text>
      </ScrollView>
 
      {/* MENU DE OPÇÕES DO LANÇAMENTO PENDENTE */}
      <Modal
        visible={mostrarOpcoes}
        transparent
        animationType="fade"
        onRequestClose={() => setMostrarOpcoes(false)}
      >
        <View style={estilos.fundoModal}>
          <View style={estilos.modalOpcoes}>
            <View style={estilos.cabecalhoModal}>
              <View style={{ flex: 1 }}>
                <Text style={estilos.tituloModal}>
                  Gerenciar lançamento
                </Text>
 
                <Text style={estilos.subtituloModal}>
                  {lancamentoSelecionado?.descricao}
                </Text>
              </View>
 
              <TouchableOpacity
                onPress={() => setMostrarOpcoes(false)}
              >
                <Ionicons
                  name="close"
                  size={24}
                  color="#777777"
                />
              </TouchableOpacity>
            </View>
 
            <TouchableOpacity
              style={estilos.opcaoModal}
              onPress={() => abrirEdicao('unico')}
            >
              <Ionicons
                name="create-outline"
                size={21}
                color="#D92344"
              />
 
              <View style={estilos.textoOpcaoModal}>
                <Text style={estilos.tituloOpcaoModal}>
                  Editar somente este
                </Text>
 
                <Text style={estilos.descricaoOpcaoModal}>
                  Altera apenas o lançamento selecionado.
                </Text>
              </View>
            </TouchableOpacity>
 
            {lancamentoSelecionado?.recorrenciaId && (
              <>
                <TouchableOpacity
                  style={estilos.opcaoModal}
                  onPress={() => abrirEdicao('proximos')}
                >
                  <Ionicons
                    name="repeat-outline"
                    size={21}
                    color="#D92344"
                  />
 
                  <View style={estilos.textoOpcaoModal}>
                    <Text style={estilos.tituloOpcaoModal}>
                      Editar este e os próximos
                    </Text>
 
                    <Text style={estilos.descricaoOpcaoModal}>
                      Atualiza os lançamentos pendentes a partir deste.
                    </Text>
                  </View>
                </TouchableOpacity>
 
                <TouchableOpacity
                  style={estilos.opcaoModal}
                  onPress={excluirEsteEFuturos}
                >
                  <Ionicons
                    name="trash-outline"
                    size={21}
                    color="#D92344"
                  />
 
                  <View style={estilos.textoOpcaoModal}>
                    <Text style={estilos.tituloOpcaoModal}>
                      Excluir este e os próximos
                    </Text>
 
                    <Text style={estilos.descricaoOpcaoModal}>
                      Preserva as parcelas anteriores e confirmadas.
                    </Text>
                  </View>
                </TouchableOpacity>
 
                <TouchableOpacity
                  style={estilos.opcaoModal}
                  onPress={cancelarProgramacao}
                >
                  <Ionicons
                    name="close-circle-outline"
                    size={21}
                    color="#D92344"
                  />
 
                  <View style={estilos.textoOpcaoModal}>
                    <Text style={estilos.tituloOpcaoModal}>
                      Cancelar programação inteira
                    </Text>
 
                    <Text style={estilos.descricaoOpcaoModal}>
                      Remove todos os lançamentos ainda pendentes.
                    </Text>
                  </View>
                </TouchableOpacity>
              </>
            )}
 
            {!lancamentoSelecionado?.recorrenciaId && (
              <TouchableOpacity
                style={estilos.opcaoModal}
                onPress={excluirEsteEFuturos}
              >
                <Ionicons
                  name="trash-outline"
                  size={21}
                  color="#D92344"
                />
 
                <View style={estilos.textoOpcaoModal}>
                  <Text style={estilos.tituloOpcaoModal}>
                    Excluir lançamento
                  </Text>
 
                  <Text style={estilos.descricaoOpcaoModal}>
                    Remove este lançamento pendente.
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>
 
      {/* MODAL DE EDIÇÃO */}
      <Modal
        visible={mostrarEdicao}
        transparent
        animationType="slide"
        onRequestClose={() => setMostrarEdicao(false)}
      >
        <KeyboardAvoidingView
          style={estilos.fundoModal}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={estilos.modalEdicao}>
            <View style={estilos.cabecalhoModal}>
              <View style={{ flex: 1 }}>
                <Text style={estilos.tituloModal}>
                  Editar lançamento
                </Text>
 
                <Text style={estilos.subtituloModal}>
                  {escopoEdicao === 'proximos'
                    ? 'Este e os próximos pendentes'
                    : 'Somente este lançamento'}
                </Text>
              </View>
 
              <TouchableOpacity
                onPress={() => setMostrarEdicao(false)}
              >
                <Ionicons
                  name="close"
                  size={24}
                  color="#777777"
                />
              </TouchableOpacity>
            </View>
 
            <Text style={estilos.rotuloCampoModal}>
              Descrição
            </Text>
 
            <TextInput
              style={estilos.inputModal}
              value={descricaoEdicao}
              onChangeText={setDescricaoEdicao}
              placeholder="Descrição"
              placeholderTextColor="#999999"
              maxLength={100}
            />
 
            <Text style={estilos.rotuloCampoModal}>
              Categoria
            </Text>
 
            <TextInput
              style={estilos.inputModal}
              value={categoriaEdicao}
              onChangeText={setCategoriaEdicao}
              placeholder="Categoria"
              placeholderTextColor="#999999"
            />
 
            <Text style={estilos.rotuloCampoModal}>
              Valor por lançamento
            </Text>
 
            <View style={estilos.inputValorModal}>
              <Text style={estilos.simboloModal}>R$</Text>
 
              <TextInput
                style={estilos.campoValorModal}
                value={valorEdicao}
                onChangeText={setValorEdicao}
                placeholder="0,00"
                placeholderTextColor="#999999"
                keyboardType="decimal-pad"
              />
            </View>
 
            <TouchableOpacity
              style={estilos.botaoSalvarEdicao}
              onPress={salvarEdicao}
            >
              <Ionicons
                name="checkmark-circle-outline"
                size={20}
                color="#FFFFFF"
              />
 
              <Text style={estilos.textoSalvarEdicao}>
                Salvar alterações
              </Text>
            </TouchableOpacity>
 
            <TouchableOpacity
              style={estilos.botaoCancelarEdicao}
              onPress={() => setMostrarEdicao(false)}
            >
              <Text style={estilos.textoCancelarEdicao}>
                Voltar
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}
 
const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  carregando: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  textoCarregando: {
    color: '#888888',
    fontSize: 13,
  },
  conteudo: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 28,
  },
  cabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 23,
  },
  subtitulo: {
    color: '#888888',
    fontSize: 12,
    marginBottom: 5,
  },
  titulo: {
    color: '#252525',
    fontSize: 25,
    fontWeight: '800',
  },
  botaoAdicionar: {
    width: 46,
    height: 46,
    borderRadius: 15,
    backgroundColor: '#D92344',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartaoSaldo: {
    backgroundColor: '#D92344',
    borderRadius: 22,
    padding: 21,
    marginBottom: 20,
  },
  rotuloSaldo: {
    color: '#FFFFFF',
    fontSize: 13,
    opacity: 0.9,
  },
  valorSaldo: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: '800',
    marginTop: 8,
    marginBottom: 23,
  },
  linhaResumo: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.3)',
    paddingTop: 18,
    gap: 12,
  },
  itemResumo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    minWidth: 0,
  },
  iconeResumo: {
    width: 33,
    height: 33,
    borderRadius: 11,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rotuloResumo: {
    color: '#FFFFFF',
    fontSize: 11,
    opacity: 0.85,
    marginBottom: 4,
  },
  valorResumo: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  avisoLimite: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#FFF4F4',
    marginBottom: 25,
  },
  textoAvisoLimite: {
    flex: 1,
    color: '#777777',
    fontSize: 11,
    lineHeight: 17,
  },
  cabecalhoLista: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  tituloSecao: {
    fontSize: 17,
    fontWeight: '800',
    color: '#252525',
  },
  seletorPeriodo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: '#FCE8E6',
  },
  textoPeriodo: {
    color: '#D92344',
    fontSize: 11,
    fontWeight: '700',
  },
  campoBusca: {
    height: 49,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    backgroundColor: '#F8F8F8',
    borderWidth: 1,
    borderColor: '#EEEEEE',
    borderRadius: 14,
    marginBottom: 17,
  },
  inputBusca: {
    flex: 1,
    minWidth: 0,
    fontSize: 13,
    color: '#252525',
    paddingVertical: 10,
  },
  filtros: {
    flexDirection: 'row',
    gap: 9,
    paddingBottom: 23,
  },
  botaoFiltro: {
    paddingVertical: 10,
    paddingHorizontal: 19,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    backgroundColor: '#FFFFFF',
  },
  botaoFiltroAtivo: {
    backgroundColor: '#D92344',
    borderColor: '#D92344',
  },
  textoFiltro: {
    color: '#777777',
    fontSize: 12,
    fontWeight: '700',
  },
  textoFiltroAtivo: {
    color: '#FFFFFF',
  },
  cabecalhoProgramados: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 13,
    gap: 10,
  },
  subtituloProgramados: {
    fontSize: 11,
    color: '#999999',
    marginTop: 5,
    lineHeight: 17,
    maxWidth: 270,
  },
  contadorPendentes: {
    width: 32,
    height: 32,
    borderRadius: 11,
    backgroundColor: '#FCE8E6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  numeroPendentes: {
    color: '#D92344',
    fontSize: 13,
    fontWeight: '800',
  },
  listaPendentes: {
    gap: 11,
    marginBottom: 25,
  },
  cartaoPendente: {
    borderWidth: 1,
    borderColor: '#EEEEEE',
    borderRadius: 17,
    padding: 13,
    backgroundColor: '#FFFFFF',
  },
  linhaPendente: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },
  botaoOpcoes: {
    width: 29,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  linhaSituacao: {
    borderTopWidth: 1,
    borderTopColor: '#F1F1F1',
    marginTop: 12,
    paddingTop: 11,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusPendente: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  textoStatus: {
    color: '#C47A16',
    fontSize: 11,
    fontWeight: '700',
  },
  botaoConfirmar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#238B45',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  botaoConfirmarDesativado: {
    backgroundColor: '#F0F0F0',
  },
  textoBotaoConfirmar: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  textoParcela: {
    color: '#7950C7',
    fontSize: 10,
    fontWeight: '700',
    marginTop: 4,
  },
  cabecalhoRealizadas: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    gap: 8,
  },
  quantidadeRealizadas: {
    color: '#999999',
    fontSize: 10,
  },
  vazioProgramados: {
    borderWidth: 1,
    borderColor: '#EEEEEE',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    gap: 8,
    marginBottom: 25,
  },
  textoVazioProgramados: {
    color: '#999999',
    fontSize: 11,
    textAlign: 'center',
  },
  grupoData: {
    marginBottom: 22,
  },
  tituloData: {
    color: '#777777',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 10,
  },
  cartaoTransacoes: {
    borderWidth: 1,
    borderColor: '#EEEEEE',
    borderRadius: 19,
    paddingHorizontal: 13,
    backgroundColor: '#FFFFFF',
  },
  transacao: {
    minHeight: 76,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F1F1',
  },
  iconeTransacao: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detalhesTransacao: {
    flex: 1,
    minWidth: 0,
  },
  descricaoTransacao: {
    color: '#303030',
    fontSize: 13,
    fontWeight: '700',
  },
  categoriaTransacao: {
    color: '#888888',
    fontSize: 11,
    marginTop: 5,
  },
  areaValor: {
    alignItems: 'flex-end',
    flexShrink: 0,
  },
  valorTransacao: {
    fontSize: 12,
    fontWeight: '800',
  },
  valorReceita: {
    color: '#238B45',
  },
  valorDespesa: {
    color: '#D92344',
  },
  tipoTransacao: {
    color: '#999999',
    fontSize: 10,
    marginTop: 5,
  },
  botaoAcaoHistorico: {
    width: 30,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  estadoVazio: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 35,
  },
  tituloVazio: {
    color: '#303030',
    fontSize: 15,
    fontWeight: '800',
    textAlign: 'center',
    marginTop: 12,
  },
  textoVazio: {
    color: '#888888',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 19,
    marginTop: 8,
  },
  botaoLimpar: {
    paddingHorizontal: 18,
    paddingVertical: 11,
    backgroundColor: '#FCE8E6',
    borderRadius: 11,
    marginTop: 17,
  },
  textoBotaoLimpar: {
    color: '#D92344',
    fontSize: 12,
    fontWeight: '800',
  },
  botaoMostrarArquivadas: {
    borderWidth: 1,
    borderColor: '#EEEEEE',
    borderRadius: 15,
    padding: 15,
    marginTop: 10,
    marginBottom: 15,
  },
  linhaBotaoArquivadas: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
  },
  tituloArquivadas: {
    fontSize: 13,
    fontWeight: '800',
    color: '#333333',
  },
  subtituloArquivadas: {
    fontSize: 11,
    color: '#999999',
    marginTop: 4,
  },
  areaArquivadas: {
    marginTop: 5,
    marginBottom: 15,
  },
  textoOrientacaoArquivadas: {
    color: '#888888',
    fontSize: 11,
    lineHeight: 17,
    marginBottom: 15,
  },
  rodape: {
    color: '#AAAAAA',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  paginacao: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    marginBottom: 18,
    paddingVertical: 8,
  },
  botaoPagina: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 9,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#F1D5DA',
  },
  botaoPaginaDesativado: {
    borderColor: '#EEEEEE',
  },
  textoPagina: {
    color: '#D92344',
    fontSize: 11,
    fontWeight: '700',
  },
  textoPaginaDesativado: {
    color: '#BBBBBB',
  },
  contadorPagina: {
    color: '#777777',
    fontSize: 11,
    fontWeight: '700',
  },
  fundoModal: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  modalOpcoes: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 19,
  },
  cabecalhoModal: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 17,
    gap: 12,
  },
  tituloModal: {
    fontSize: 18,
    color: '#252525',
    fontWeight: '800',
  },
  subtituloModal: {
    fontSize: 12,
    color: '#888888',
    marginTop: 5,
  },
  opcaoModal: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: '#F1F1F1',
  },
  textoOpcaoModal: {
    flex: 1,
  },
  tituloOpcaoModal: {
    fontSize: 13,
    color: '#333333',
    fontWeight: '700',
  },
  descricaoOpcaoModal: {
    fontSize: 11,
    color: '#999999',
    marginTop: 4,
    lineHeight: 16,
  },
  modalEdicao: {
    backgroundColor: '#FFFFFF',
    borderRadius: 21,
    padding: 20,
  },
  rotuloCampoModal: {
    fontSize: 12,
    color: '#444444',
    fontWeight: '700',
    marginBottom: 7,
    marginTop: 12,
  },
  inputModal: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    borderRadius: 12,
    paddingHorizontal: 13,
    fontSize: 13,
    color: '#252525',
    backgroundColor: '#FAFAFA',
  },
  inputValorModal: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    borderRadius: 12,
    paddingHorizontal: 13,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
  },
  simboloModal: {
    fontSize: 14,
    fontWeight: '800',
    color: '#D92344',
    marginRight: 9,
  },
  campoValorModal: {
    flex: 1,
    fontSize: 14,
    color: '#252525',
    paddingVertical: 10,
  },
  botaoSalvarEdicao: {
    minHeight: 51,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#D92344',
    borderRadius: 13,
    marginTop: 23,
  },
  textoSalvarEdicao: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  botaoCancelarEdicao: {
    alignItems: 'center',
    paddingVertical: 15,
  },
  textoCancelarEdicao: {
    color: '#777777',
    fontSize: 13,
    fontWeight: '700',
  },
});
