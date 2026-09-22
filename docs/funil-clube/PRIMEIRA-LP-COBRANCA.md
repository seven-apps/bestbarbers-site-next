# Primeira página do funil — cobrança do clube

## Decisão de trabalho

Recomendação desta análise: começar pela experiência de cobrança manual, ligada à peça B-S1 / E002 do plano. A escolha é de ordem de construção para validar estética e interação; não decide qual experimento será lançado. A rota prevista no acervo é `/projeto-do-clube?exp=cobranca`. A primeira validação será local, com interações demonstrativas e sem transporte para serviços externos. Esta entrega é a análise para implementação, não uma página já implementada.

Fontes: repositório local Best Barbers Site Next e documentos de páginas, experiências e lançamento do projeto bestbarbers-ai. Identificadores, nomes de versões, cores e caminhos são referências técnicas, não amostra de resultado. Copy, composição e movimentos são hipóteses criativas. Não há teste de conversão ou entrevista nova nesta análise.

## O que encontrei no projeto

| Fonte inspecionada | Reaproveitamento | Limite |
|---|---|---|
| `package.json` | Next.js, React, Tailwind, Framer Motion e Lucide já instalados | Não é necessário instalar outro motor só para este protótipo |
| `src/app/layout.tsx` | Montserrat via next/font; estrutura global | Também injeta GTM, Pixel, PageView, fallbacks noscript e PerguntaDono; rota nova herda efeitos externos |
| `src/styles/tokens.css` e `DESIGN_TOKENS.md` | Amarelo da marca, neutros, fontes, botões e espaços | Usar a identidade como base, sem copiar toda a composição da home |
| `src/content/home.ts` | Logo branca usada na navegação: `/images/Logo-BestBarbers-branco_1.webp` | Conferir contraste e integridade no render; logo nunca gerada como texto por IA |
| `src/components/clube/ClubePage.tsx` | Organização modular de página | Contém tracking, modal e seções de outros recursos; não clonar a árvore inteira |
| `HeroClube.tsx` | Referência de identidade e CTA | Hero de influenciadores não explica por si só a dor de cobrança |
| `AssinaturasClube.tsx` e `src/content/clube.ts` | Copy e assets de clube existentes | Copy antiga não prova condições atuais; não herdar automaticamente claims ou números |
| `src/components/ui/motion.tsx` | Padrões Framer Motion e entrada de elementos | Há entradas inicialmente invisíveis; não encontrei tratamento de reduced motion no arquivo. Conteúdo principal precisa continuar disponível sem animação |
| `src/components/sections/LeadFormModal.tsx` | Contato, e-mail opcional e qualificação compartilhada | Hook acoplado a transporte e tracking. Aparência e campos podem inspirar a versão local; não importar submissão real |
| `src/hooks/useLeadForm.ts` | Contexto, score, atribuição e eventos existentes | `form_submit` aparece antes de persistência; existem cortes por nome de conjunto e eventos de qualidade. Não assumir compatibilidade automática com o novo experimento |
| `src/hooks/usePloomesAPI.ts` | Fluxo comercial existente | Há chamadas externas de contato/negócio. Não usar durante validação estética |
| `src/lib/pergunta-dono.ts` | Regra existente de qualificação de topo | Prefixos de campanha/parâmetros podem abrir modal global e interromper a experiência. Protótipo deve ser isolado também desse componente |

Estado inicial do Git: `tsconfig.tsbuildinfo` já estava modificado. Não foi alterado ou revertido por esta análise. Não foram lidos arquivos de segredos, feitas chamadas comerciais, build, publicação ou commits.

## Direção visual

A composição proposta usa fundo claro, tipografia escura e amarelo da marca nos pontos de ação. O preto entra para dar foco à demonstração e à marca; verde fica reservado a estados, não vira outra identidade visual. Evitar uma página inteira amarela, excesso de gradientes, cartões flutuando sem significado, números crescendo e efeitos que disputem com a explicação.

A área principal deve parecer uma demonstração de operação bem desenhada. Usar celular e painel apenas quando cada um desempenhar uma tarefa na história. Texto em HTML, Montserrat real e logo do acervo. Não é necessário gerar imagem para começar a validar essa direção. Uma fotografia de barbearia é opcional e não resolve a falta de prova do produto.

No desktop: mensagem à esquerda e demonstração à direita. No celular: dor, solução, apoio, convite para explorar e demonstração em sequência curta. Não reduzir tela desktop inteira até seus textos ficarem ilegíveis. Enquadrar o detalhe relevante ou mostrar um cartão de explicação ligado à captura.

## Página bloco a bloco — proposta editorial

| Bloco | Mensagem e conteúdo | Interação / saída |
|---|---|---|
| Entrada | Sobretítulo: “Para quem já tem clube e ainda confere pagamento por mensagem.” Pergunta: “Seu clube ainda depende de pedir comprovante?” Título de solução: “Cobre a mensalidade no cartão com a BestBarbers.” Apoio: “O cliente autoriza a assinatura. A cobrança é recorrente e você acompanha os pagamentos pelo sistema.” | CTA principal “Ver como funciona” abre/rola para a demonstração. Link secundário “Quero avaliar para minha barbearia” vai ao pedido; nunca obrigar a assistir |
| Reconhecimento | Tarefas concretas: pedir comprovante, localizar a mensagem, conferir quem pagou. Sem caricaturar o dono como desorganizado | Transição visual das tarefas para um fluxo de acompanhamento; não inventar ganho de tempo |
| Demonstração principal | Adesão autorizada → cobrança recorrente → consulta de situação. Exceção: cobrança pendente precisa de atenção | Controles “Autorização”, “Cobrança” e “Acompanhamento”; texto e destaque visual sincronizados. Pendência explicada sem garantia de recebimento |
| Aplicação ao clube existente | Explicar que planos, vencimentos e assinantes precisam ser avaliados para configurar a operação | Checklist de assuntos, não barra que finge implantação concluída. Quem vem de outro sistema recebe alternativa pertinente |
| Ajuda de implantação | O que será avaliado e quem acompanha, conforme escopo aprovado | Manter como conteúdo interno condicionado enquanto escopo comercial não estiver confirmado |
| Prova | Captura real comentada e, se houver, relato específico autorizado de operação | Sem depoimento inventado, receita ilustrativa tratada como case ou números sem fonte |
| Dúvidas | “Meu cliente precisa autorizar?”, “E quando a cobrança não acontece?”, “Já tenho assinantes; como começo?”, “O que está incluído?” | Respostas objetivas validadas por produto/comercial. Não inventar regra sobre limite do cartão, tentativas, taxas ou migração |
| Pedido | “Vamos olhar como você cobra hoje?” Explicar o próximo passo e o atendimento com Lucas supervisionado | Formulário na página; confirmação real só na etapa conectada. Protótipo usa dados de exemplo e diz claramente que nada foi enviado |

As frases acima preservam a exigência da conversa: dor concreta, solução ligada à BestBarbers e explicação didática. A versão final depende da prova do produto. Não prometer fim de inadimplência, Pix recorrente, portabilidade de cartão ou dinheiro imediatamente disponível.

## Roteiro das animações

| Movimento | Por que existe | Implementação proposta / comportamento alternativo |
|---|---|---|
| Da mensagem ao acompanhamento | Mostrar a mudança de tarefa, em vez de decorar a tela | Elementos do exemplo se reorganizam após comando do visitante. Sem desaparecer com a pendência ou sugerir automação não comprovada |
| Seleção de etapa | Associar ação, explicação e região da tela | Estado local controla texto e destaque. Framer Motion para transição curta; teclado e botões também navegam |
| Destaque na captura | Tornar uma interface complexa compreensível | Recorte/destaque sobre asset real, sem redesenhar função ausente. Legenda explica o que está sendo apontado |
| Pendência | Mostrar o limite da promessa | Estado alternativo acionável, com indicação textual. Não depender só de vermelho/verde |
| Narrativa na rolagem | Manter contexto durante a explicação | Painel aderente ao lado de texto no desktop; cartões em fluxo no celular. Nunca travar a rolagem nem exigir gesto especial |
| Entrada de seções | Guiar a leitura sem esconder a mensagem | Movimento sutil de opacidade/posição; conteúdo essencial visível no HTML inicial. Sem demora artificial para aparecer CTA |
| Formulário e confirmação | Ajudar a entender erro e próximo passo | Estados de validação locais no protótipo. Foco vai para erro/resumo; não simular sucesso comercial |

Preferência de movimento reduzido elimina deslocamentos não essenciais. Pausa/repetição disponível se houver reprodução automática; prefiro controles explícitos na demonstração. Não há necessidade inicial de vídeo renderizado, WebGL, efeito 3D pesado ou dependência nova. A skill HyperFrames foi consultada; o produto pedido é uma experiência Next.js, não um vídeo ou composição HyperFrames.

## Assets: o que temos e o que falta

Inspeção visual de `public/images/gerenciamento-de-assinaturas.png` e `public/images/gerenciamento-de-assinaturas_1.webp`: os arquivos mostram app/agendamento e dashboard financeiro, com marcas de barbearias e valores. Não são prova suficiente da autorização e do acompanhamento de cobrança recorrente. O nome do arquivo não certifica adequação. Não reaproveitar como case nem como tela do fluxo pretendido.

| Material | Para validar estética | Para página comercial |
|---|---|---|
| Logo e Montserrat | Acervo e configuração existentes | Conferência de legibilidade e variante apropriada |
| Autorização da assinatura | Diagrama conceitual identificado como demonstração | Captura autorizada do percurso real, com dados de demonstração |
| Cobrança e situação do pagamento | Estados locais explicativos, sem aparência de prova homologada | Tela real atual, nomenclatura e comportamento confirmados |
| Pendência e tratamento | Explicação sem promessa de função específica | Captura e orientação validadas, inclusive limites da atuação do sistema |
| Vídeo de André ou parceiro | Não bloqueia o protótipo | Opcional, depois de roteiro/prova aprovados; não atribuir experiência falsa ao apresentador |
| Depoimento ou resultado | Omitir seção de case na ausência de evidência | Relato autorizado, contexto e fonte; números com fonte e n |
| Condições e assistência | Área editorial com estado interno de pendência | Escopo e condições liberados pelo responsável comercial |

## Arquitetura proposta

Preservar `/clube`, `/clube-de-assinaturas` e demais LPs. Criar a nova família em `src/app/projeto-do-clube/`, com configuração de conteúdo separada e componentes específicos em `src/components/funil-clube/`. Nomes propostos: `CobrancaHero`, `CobrancaDemo`, `ImplantacaoResumo`, `CobrancaFAQ` e `PedidoClubePreview`. Dados e copies ficam em `src/content/funil-clube.ts`.

O parâmetro `exp` deve passar por lista permitida; inicialmente somente cobrança é implementada. Valor desconhecido usa experiência neutra claramente definida, sem interpolar texto arbitrário da URL. A origem do anúncio é armazenada separadamente da situação confirmada pelo dono. Não inferir dor real apenas porque chegou por E002.

Página principal entrega conteúdo estrutural no servidor; somente demonstração e formulário exigem cliente. Estilos ficam limitados à nova experiência; não redefinir tokens globais para mudar a estética de páginas existentes. Imagens com proporção reservada, carregamento posterior para conteúdo abaixo da primeira tela e fallback para asset indisponível.

## Isolamento do protótipo: requisito descoberto no código

Criar uma rota Next.js sem formulário real não basta: o RootLayout atual injeta rastreamento global. Antes de abrir o protótipo, implementar modo explícito de preview local, controlado por ambiente de desenvolvimento, que não carregue GTM, Pixel/noscript, PerguntaDono e transportes externos. Preservar o comportamento existente fora desse modo. Um layout filho não remove scripts já injetados pelo pai.

O protótipo não importa os hooks comerciais. O formulário usa fixture e estado local; não coleta cartão, não envia contatos e não abre conversa real. A rede de teste bloqueia e registra saídas externas como verificação adicional. No preview, metadados sem indexação e sem canonical herdado da home; isso é organização técnica, não barreira de acesso nem publicação autorizada.

A etapa conectada será separada: revisar persistência, eventos, deduplicação, atribuição, origem e passagem ao Lucas. O achado local de `form_submit` antes do envio é risco a investigar nas tags, não prova de contagem errada em produção. Não corrigir silenciosamente todos os formulários existentes como efeito lateral da nova LP.

## Critérios de aceite

- O visitante entende para quem é, o que a BestBarbers faz e qual ação pode tomar sem depender de vídeo ou animação.
- Título e apoio têm leitura confortável no celular; CTA e campos não ficam cobertos por elementos fixos.
- A demonstração aceita toque, teclado e movimento reduzido; exceção de pagamento é compreensível.
- Não há tela ilustrativa tratada como captura real, case inventado ou condição comercial implícita.
- O preview não envia eventos, formulários ou mensagens externos; confirmação local não diz que o comercial recebeu.
- Imagem ausente, URL desconhecida, JavaScript indisponível e erro de preenchimento têm resposta útil.
- Conferir console, hidratação, tipagem e lint dos arquivos alterados; realizar inspeção visual em tela móvel e desktop. Desempenho é medido no protótipo, sem prometer nota antes da medição.
- As páginas existentes permanecem funcionais; revisar especificamente o caminho do layout global fora do modo preview.

## Sequência de construção

Primeiro isolar o preview. Depois implementar o hero e a demonstração conceitual interativa com a identidade real. Completar a narrativa e o formulário local para avaliar a página inteira. Fazer revisão visual e de compreensão; incorporar capturas reais quando conferidas. Conectar a jornada comercial somente na etapa autorizada e após seus ensaios.

Não falta uma nova ferramenta para começar. O que falta para a versão comercial é principalmente prova específica do produto, condições de assistência e integração validada. Esses pontos não impedem a primeira validação estética local.
