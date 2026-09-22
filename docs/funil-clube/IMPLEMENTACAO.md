# Preview implementado — cobrança do clube

Abra `http://127.0.0.1:3017/projeto-do-clube?exp=cobranca` enquanto o servidor local estiver ativo.

Para iniciar na raiz deste repositório:

```sh
BB_FUNIL_PREVIEW=1 WATCHPACK_POLLING=true node node_modules/next/dist/bin/next dev --hostname 127.0.0.1 --port 3017
```

Foi usado o servidor sem Turbopack e com polling porque o primeiro processo encontrou limite de arquivos monitorados (EMFILE) e não reconheceu a rota. A alteração está no comando local, não nos scripts padrão do projeto.

## Entrega

Página em `src/app/projeto-do-clube/`: apresentação da dor, solução ligada à marca, demonstração navegável de autorização/cobrança/acompanhamento, alternância de pendência, contexto da operação, FAQ e formulário simulado. Identidade usa Montserrat carregada pelo projeto e logo existente; estilos locais em CSS Module. Transições respondem à escolha do visitante e à preferência de movimento reduzido.

O formulário não coleta telefone ou cartão, não grava dados e não usa hooks de CRM. Ele permite validar disposição, campos e confirmação com exemplos locais. A versão comercial ainda exige campos/qualificação finais, condições, provas do produto e integração própria ensaiada. Nenhum anúncio de resultado, preço não confirmado ou depoimento foi incluído.

A rota responde somente em desenvolvimento com `BB_FUNIL_PREVIEW=1`; fora disso retorna notFound. Esse modo desativa no RootLayout GTM, Pixel, fallbacks noscript e PerguntaDono para o servidor local inteiro. Fora desse modo, os componentes existentes são preservados. Não é um mecanismo de autenticação ou autorização para publicação.

O parâmetro `exp=cobranca` identifica o preview; somente a experiência de cobrança foi construída. Outros parâmetros não mudam a copy nem são interpolados. A família de variantes e sua atribuição comercial ainda não foi implementada.

## Verificação executada

- TypeScript: `npx tsc --noEmit --incremental false`, sem erros.
- ESLint dos arquivos TSX alterados; registrar abaixo eventuais avisos herdados.
- Chromium via Playwright: carregamento, seleção de acompanhamento, alternância para pendência, simulação de formulário, menu e demonstração no celular, modo de movimento reduzido.
- Teste de rede com bloqueio de destinos externos: nenhuma tentativa externa observada na página durante o percurso ensaiado; nenhum erro de JavaScript. Não é auditoria de todas as rotas do site.
- Inspeção visual por screenshots em desktop e celular; fonte computada Montserrat.

Fonte: execução local desta implementação, não amostra de marketing. Capturas: `/private/tmp/bb-lp-desktop.png` e `/private/tmp/bb-lp-mobile.png`. Roteiro de verificação desta sessão: `/private/tmp/verificar-bb-lp.mjs` (usa o Playwright instalado no projeto bestbarbers-ai).

Não houve publicação, commit, alteração em APIs, CRM ou campanhas. `tsconfig.tsbuildinfo` já tinha alteração antes do trabalho; o servidor pode atualizar cache local. Nenhuma reversão desse arquivo foi feita.

ESLint concluiu sem erros. Avisos nos trechos existentes do RootLayout: script inline de analytics e imagem do Pixel noscript. Ambos ficam desativados no preview; não houve refatoração dos transportes legados.

## Refinamento de movimento após feedback

O usuário apontou que a primeira versão não entregava a camada de animação planejada. Foi acrescentada uma sequência finita no hero: mensagem manual em destaque → ligação visual → entrada do acompanhamento → destaque de recorrência → situações de pagamento, incluindo pendência. Há pausa, continuação e repetição explícitas. Não há loop infinito ou transformação de pendência em pagamento aprovado.

A demonstração agora tem uma trilha visual navegável: autorização, cobrança e acompanhamento. A linha avança conforme a seleção; o símbolo de recorrência faz movimento finito e os estados entram com destaque. No celular, selecionar uma etapa leva a demonstração à área visível; movimento reduzido usa navegação imediata. Seções entram discretamente quando chegam à leitura, sem ocultar conteúdo no HTML inicial. Uma barra superior acompanha o progresso de leitura, não progresso de implantação.

Implementação nativa de CSS e Web Animations API na página Next.js. A skill hyperframes-animation foi consultada como referência de organização de movimento, sem criar composição ou vídeo HyperFrames. A preferência por movimento reduzido desativa as animações, transições e rolagem suave da experiência; os controles de repetição ficam ocultos nesse modo.

Validação posterior: TypeScript e lint do componente sem erros; teste de pausa e retomada das animações, navegação das etapas, pendência, formulário, menu móvel e preferência de movimento reduzido passou. Nenhum erro de JavaScript ou tentativa de chamada externa no percurso ensaiado. A eficácia visual/comercial permanece hipótese, sem amostra de conversão.

## Revisão da direção visual após crítica de qualidade

O usuário considerou insuficiente o refinamento anterior. A abertura foi recomposta: fundo escuro, título maior, amarelo de marca, painel conceitual com profundidade e contraste de leitura, cartão de autorização separado e trilha de cobrança. Os controles Manual / Com recorrência alternam mensagens pendentes de conferência e a representação do acompanhamento. Não é simulação de uma funcionalidade nova do produto nem migração automática de mensagens.

A sequência de entrada foi refeita para painel, autorização, linhas de situação e conexão. Pausa/repetição continuam presentes; movimento reduzido mantém a comparação sem transições. TypeScript, lint, teste de comparação, pausa/retomada, etapas, pendência, formulário e navegação móvel passaram. Inspeção de screenshots motivou aumento do contraste do painel e afastamento do cartão para preservar a leitura. Qualidade comercial continua não medida; não há afirmação de resultado perfeito.
