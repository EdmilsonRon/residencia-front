# Saúde Financeira — módulo isolado

Esta pasta adiciona uma implementação de tela sem alterar as rotas, contextos, estilos ou componentes existentes.

## Arquivos
- `HealthScreen.js`: tela React Native que consome os contextos já existentes.
- `styles.js`: estilos da tela.
- `calculos.js`: cálculos determinísticos e mensagens locais de fallback.

## Integração futura
A rota `src/app/(principal)/saude-financeira.js` já existe no projeto original. Para ativar esta implementação posteriormente, substitua o conteúdo daquela rota por:

```js
export { default } from '../../features/saude-financeira/HealthScreen';
```

Essa alteração de rota NÃO foi feita nesta entrega, conforme solicitado: somente a nova pasta foi adicionada.

## Limites dos dados atuais
Os contextos existentes fornecem transações, categorias e orçamentos. Por isso, esta versão calcula:
- receitas, despesas e resultado do mês;
- capacidade de poupança estimada a partir do resultado mensal;
- organização dos lançamentos por presença de categoria;
- acompanhamento dos limites de orçamento;
- categorias com maior volume de despesas.

O projeto atual não fornece dados estruturados suficientes para avaliar reserva de emergência, dívidas/parcelamentos, contas vencidas ou evolução patrimonial. Esses tópicos foram omitidos para não inventar indicadores.

## Sugestão de IA para descrições
Recomendação inicial: Gemini API via Google AI Studio, usando um modelo Flash disponível no nível gratuito. Consulte limites e modelos elegíveis antes de integrar: https://ai.google.dev/gemini-api/docs/pricing

**Atenção à privacidade:** a documentação do nível gratuito informa que o conteúdo enviado pode ser usado para melhorar produtos do Google. Não envie nome, e-mail, descrições livres de transações, números de conta ou dados identificáveis. Prefira enviar somente agregados (totais por mês, percentuais e categorias genéricas), após consentimento claro. Para dados financeiros reais de usuários, use um backend próprio para guardar a chave da API; nunca coloque a chave no aplicativo React Native.

### Payload agregado sugerido
```json
{
  "periodo": "2026-11",
  "receitas": 3500,
  "despesas": 2800,
  "saldo": 700,
  "taxaPoupancaPercentual": 20,
  "organizacaoPercentual": 95,
  "orcamentos": [
    { "categoria": "Moradia", "gasto": 900, "limite": 1000 },
    { "categoria": "Alimentação", "gasto": 650, "limite": 600 }
  ]
}
```

### Prompt de sistema sugerido
Você é um assistente de educação financeira. Analise exclusivamente os indicadores agregados recebidos. Não invente dívidas, reservas, metas, contas vencidas ou patrimônio que não estejam nos dados. Diferencie fatos calculados de hipóteses. Produza: (1) até três pontos positivos, (2) até três pontos de atenção, (3) até três ações práticas e realistas. Sempre cite o indicador que sustenta cada observação. Não prometa resultados, não recomende investimentos específicos e não trate a análise como aconselhamento financeiro profissional. Se faltarem dados, diga explicitamente o que não pode ser avaliado. Responda em português brasileiro, com linguagem simples e respeitosa.

### Outras opções
- **GroqCloud:** oferece acesso gratuito sujeito a cotas e modelos disponíveis no momento; pode ser uma alternativa para gerar textos curtos. Verifique a política de dados e os limites antes de enviar informações.
- **Modelos locais (Ollama):** não exigem envio de dados a um provedor externo, mas precisam rodar em um servidor ou computador com recursos adequados. É uma alternativa para maior controle de privacidade, não necessariamente a mais simples para hospedar o aplicativo.

A IA deve interpretar os números; os cálculos e validações devem permanecer no código do aplicativo/backend. Gere as descrições novamente apenas quando os dados mudarem ou quando o usuário solicitar, para reduzir chamadas e custos.
