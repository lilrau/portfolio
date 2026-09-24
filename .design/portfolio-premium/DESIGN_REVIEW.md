# Design Review: Portfolio Premium — Raul Souza Silva

Revisado contra: DESIGN_BRIEF.md (+ INFORMATION_ARCHITECTURE.md, DESIGN_TOKENS.md)
Filosofia: *Liquid Editorial*: liquid glass (Apple) + tipografia editorial de portfolio de award sobre o fluido interativo
Data: 2026-09-22

## Screenshots capturados

Capturados com Chromium headless via CDP (o Playwright MCP não estava disponível nesta sessão). As capturas de página inteira bloqueiam o `fluid.js` para os reveals de scroll dispararem de forma confiável; as `review-hero-fluid-*` rodam o fluido na GPU real (Intel Iris Xe).

| Screenshot | Breakpoint | O que mostra |
| --- | --- | --- |
| `screenshots/review-home-desktop-1280.jpg` | Desktop 1280×800 | Página inteira, EN, light |
| `screenshots/review-home-tablet-768.jpg` | Tablet 768×1024 | Página inteira, EN, light |
| `screenshots/review-home-mobile-375.jpg` | Mobile 375×812 | Página inteira, EN, light |
| `screenshots/review-home-pt-dark-mode-desktop-1280.jpg` | Desktop 1280×800 | Página inteira, PT, dark |
| `screenshots/review-home-pt-dark-mode-mobile-375.jpg` | Mobile 375×812 | Página inteira, PT, dark |
| `screenshots/review-hero-fluid-light-desktop-1280.png` | Desktop 1280×800 | Hero sobre o fluido real, light |
| `screenshots/review-hero-fluid-dark-desktop-1280.png` | Desktop 1280×800 | Hero sobre o fluido real, dark |
| `screenshots/review-preloader-desktop-1280.png` | Desktop 1280×800 | Preloader no meio da intro |
| `screenshots/review-card-hover.png` | Desktop 1280×800 | Card de destaque sob o ponteiro, nav por cima |
| `screenshots/review-list-row-hover.png` | Desktop 1280×800 | Lista "More work" |
| `screenshots/review-nav-focus-visible.png` | Desktop 1280×800 | Anel de foco por teclado na nav |
| `screenshots/review-project-detail-open-desktop-1280.png` | Desktop 1280×800 | Overlay do projeto, galeria |
| `screenshots/review-project-detail-content-desktop-1280.png` | Desktop 1280×800 | Overlay rolado até o conteúdo |
| `screenshots/review-hero-mobile-375.png` | Mobile 375×812 | Hero, PT |
| `screenshots/review-mobile-nav-pill-375.png` | Mobile 375×812 | Pill de nav inferior sobre os cards |
| `screenshots/review-mobile-menu-open-375.png` | Mobile 375×812 | Sheet do menu mobile |
| `screenshots/review-project-detail-mobile-375.png` | Mobile 375×812 | Overlay do projeto, PT |
| `screenshots/review-footer-mobile-375.png` | Mobile 375×812 | Fim da página: footer sob a pill |
| `screenshots/review-404-mobile-375.png` | Mobile 375×812 | 404, PT |

> Todos em `.design/portfolio-premium/screenshots/`. As capturas intermediárias do build ficam em `screenshots/wip/`.

## Resumo

O build acerta a direção do brief. A grotesk monumental com a serifa itálica sobre o fluido curado é reconhecível como *Liquid Editorial* à primeira vista; a evidência (métricas) lidera todo projeto; light e dark parecem desenhados, não invertidos. O achado mais grave é funcional, não estético: **no celular, a pill de nav flutuante cobre permanentemente os links do footer** no fim da página. Em segundo lugar, alguns rótulos em cinza terciário ficam direto sobre o fluido, quebrando a regra de contraste que os próprios tokens definiram.

## Must fix

1. **Links do footer inalcançáveis no mobile.** No fim da página, a pill fixa (`NavBar.tsx`, `bottom-4`, ~56px) sobrepõe o footer e não há mais o que rolar. Verificado com `elementFromPoint`: LinkedIn, GitHub e "Voltar ao topo" ficam todos cobertos. Ver `screenshots/review-footer-mobile-375.png`. _Correção: padding inferior no footer abaixo de `md` que libere a pill (ex.: `pb-28 md:pb-8` em `Footer.tsx`), ou esconder a pill quando o footer entra na tela._
2. **Texto terciário direto sobre o fluido.** `text-ink-subtle` (4.9:1 só sobre o fundo liso) é usado no índice das seções (`ui.tsx:31`), no índice do Contact (`Contact.tsx:36`) e na numeração da lista (`ProjectList.tsx:65`). O DESIGN_TOKENS.md proíbe terciário sobre o fluido sem vidro. O halo atenua, mas a regra existe porque os splats derrubam o contraste abaixo de AA. Ver em `screenshots/review-hero-fluid-light-desktop-1280.png` o quanto os splats saturam. _Correção: usar `text-ink-muted` nesses três (7.7:1 / 8.6:1). O caso da sheet mobile (`NavBar.tsx:301`) está sobre vidro `strong` e é permitido._

## Should fix

1. **As colunas da lista "More work" não se alinham entre linhas.** Cada linha é um grid próprio com colunas `auto`, então as colunas de tipo e período começam em posições diferentes em cada linha. Ver `screenshots/review-list-row-hover.png`. _Correção: larguras fixas nas colunas finais (ex.: `md:grid-cols-[3rem_minmax(0,1.2fr)_minmax(0,1fr)_7rem_1rem]`) ou subgrid no `<ul>`._
2. **O ponto de status parece sinal de disponibilidade e nunca para de se mexer.** O ponto verde pulsando ao lado de "Atualmente na Amazoca" (`Hero.tsx:59`) é o sinal universal de "disponível/online", algo que a página não afirma (a IA previa uma flag explícita de disponibilidade). Ele também soma um segundo elemento sempre animado, junto do fluido e do "Scroll", contra o princípio 2 ("um elemento vivo por vez"). _Correção: ponto estático e neutro; uma flag `available` real nos dados, se o Raul quiser anunciar isso._
3. **Os controles da galeria colidem com o botão de fechar quando o overlay rola.** As setas ficam na borda inferior da galeria e, com o painel rolado, sobem até o lado do botão fechar fixo (`screenshots/review-project-detail-content-desktop-1280.png`, canto superior direito). _Correção: galeria `sticky` com fade, ou esconder os controles quando ela sai quase toda da vista._
4. **O preloader desvia do brief.** O brief descreve uma lâmina de vidro que se dissolve no fluido; o build levanta uma cortina opaca `bg-canvas` (`Preloader.tsx`). Funciona e é rápido, mas é o único momento em que a ideia de "vidro" some. _Correção: reduzir a opacidade da cortina enquanto ela sobe, ou dar a ela o tint `strong`, para o fluido aparecer por trás._
5. **A lente do cursor não refrata mais.** Foi uma decisão de performance, medida: a refração na lente em movimento custava ~20 fps numa Iris Xe. O brief prometia uma lente que "refrata o que está atrás"; hoje ela é uma bolha com blur. _Correção (opcional): refratar só com o ponteiro parado, medindo de novo com `scripts/bench-scroll.mjs`; senão, registrar a mudança no brief._
6. **Link do currículo duplicado.** O caminho do PDF está hard-coded em `Hero.tsx:132`, enquanto NavBar e Experience usam `contact.resume`, e quatro lugares reimplementam um botão de currículo com estilos um pouco diferentes. O `ResumeButton` planejado nunca foi extraído. _Correção: um `ResumeButton` (variantes primary / glass / compact) lendo `contact.resume`._
7. **Estilo de eyebrow mono repetido ~20 vezes.** `font-mono text-xs uppercase tracking-[var(--letter-spacing-wide)]` aparece copiado em 13 arquivos, em vez de usar o `Eyebrow` (que existe em `ui.tsx`) ou uma utility. _Correção: uma utility `eyebrow` (`@utility` no `globals.css`) ou reusar o `Eyebrow`._
8. **Tamanhos de texto fora da escala.** São 12 valores `text-[…]` soltos: três clamps de display separados (Contact, Preloader, 404), `1.75rem` duas vezes, `2rem`, `2.25rem` e `0.6875rem` ×5. _Correção: adicionar um degrau de display `text-closing` (headline do Contact e da 404) e um token `text-micro` (0.6875rem), mapeando o resto para degraus existentes._

## Could improve

1. **Links do footer sem estilo de foco próprio.** Eles caem no outline do navegador, enquanto todo o resto usa `--shadow-focus` (`Footer.tsx`). _Sugestão: o mesmo `focus-visible:shadow-[var(--shadow-focus)]`._
2. **Métricas fracas em dois cards.** EduSaaS mostra "Live" e Hi mostra só "47 modelos Prisma". Ao lado do −63% / 72% / 175+ da Amazoca, parecem enchimento. _Sugestão: números reais de uso (marcados `TODO(raul)` em `src/data/projects.ts`), ou tirar a linha de métricas desses dois e deixar o papel e a descrição liderarem._
3. **O respiro entre "More work" e Experience é longo demais no desktop.** O `--space-section` mais o deslocamento `lg:translate-y-32` dos cards da direita deixam uma faixa vazia alta (`review-home-desktop-1280.jpg`). _Sugestão: reduzir o `lg:mt-56` da lista ou compensar o deslocamento com margem negativa._
4. **Área vazia grande no hero mobile, entre o status e o nome** (`review-hero-mobile-375.png`). É intencional (nome ancorado embaixo), mas em celulares baixos a proposta e os CTAs caem perto da dobra. _Sugestão: `min-h-[92svh]` nos celulares, ou subir um pouco o nome abaixo de `sm`._
5. **Screenshots dos cards cortados pelo topo.** O `object-top` corta a foto do EduSaaS pela metade. _Sugestão: um `focus` (object-position) por projeto nos dados._

## O que funciona bem

- **Fidelidade estética alta.** A Geist a −0.045em contra a Instrument Serif itálica, o conteúdo quase monocromático e o fluido como única fonte de cor são reconhecivelmente a filosofia do brief em todo screenshot, nos dois temas (`review-hero-fluid-*`).
- **Evidência acima de adjetivos, literalmente.** As métricas são o elemento mais forte em cada card de destaque e na timeline, e todo número vem do currículo.
- **O dark é desenhado, não invertido.** Quase-preto frio, acento levantado (#8c99ff), fluido mais luminoso; o botão "Baixar currículo" inverte limpo (`review-home-pt-dark-mode-mobile-375.jpg`).
- **Arquitetura de interação sólida.** Overlays compartilháveis em `#work/<slug>` com histórico correto, FLIP a partir do card, foco preso e devolvido, Esc, galeria por teclado; a troca de idioma mantém a seção e o contexto WebGL.
- **Base de acessibilidade.** Auditoria automática limpa (alt, nomes acessíveis, landmarks, ordem de headings, um h1), anel de foco visível (`review-nav-focus-visible.png`), reduced-motion respeitado em tudo (preloader, Lenis, cursor, parallax, bursts).
- **Performance medida, não adivinhada.** Scroll de volta a ~60 fps numa GPU integrada, com checagem repetível em `scripts/bench-scroll.mjs`.
- **O mobile se adapta em vez de encolher.** Nav embaixo, na zona do polegar; sheet com links em tamanho display; timeline em coluna única; overlay em tela cheia.

## Status das correções (2026-09-22)

| Item | Status | Verificação |
| --- | --- | --- |
| Must 1 · footer inalcançável no mobile | ✅ Corrigido (`Footer.tsx`: `pb-28 md:pb-8`) | `elementFromPoint`: LinkedIn, GitHub e Voltar ao topo alcançáveis a 375px |
| Must 2 · terciário sobre o fluido | ✅ Corrigido (`ui.tsx`, `Contact.tsx`, `ProjectList.tsx` → `text-ink-muted`) | grep: `text-ink-subtle` só resta dentro da sheet de vidro `strong` |
| Should 1 · colunas da lista | ✅ Corrigido (colunas finais com largura fixa) | x das colunas idêntico nas 5 linhas (`screenshots/review-fix-list-aligned.png`) |
| Should 2 · ponto de status | ✅ Corrigido (ponto estático e neutro) | sem `animate-ping` no hero |
| Should 3 · controles da galeria × fechar | ✅ Corrigido (somem com fade e ficam `inert` quando a galeria sai da vista) | opacidade 1 → 0 ao rolar (`screenshots/review-fix-detail-scrolled.png`) |
| Should 4 · preloader como cortina | ✅ Corrigido (dissolve em vez de subir; total ≈ 1.75s) | bateria do preloader verde |
| Should 5 · lente sem refração | 📝 Mantido por performance; decisão registrada no DESIGN_BRIEF.md | `scripts/bench-scroll.mjs` ≈ 60 fps |
| Should 6 · botão do currículo duplicado | ✅ Corrigido (`ResumeButton` com 4 variantes; único ponto de `contact.resume`) | grep |
| Should 7 · eyebrow repetido | ✅ Corrigido (`@utility eyebrow`; 0 cópias restantes) | grep |
| Should 8 · tamanhos fora da escala | ✅ Corrigido (tokens `text-closing`, `text-stat`, `text-micro`; resto mapeado) | resta só `text-[1.12em]`, relativo e intencional |
| Could 1 · foco no footer | ✅ Corrigido | — |
| Could 2 · métricas fracas | ✅ Parcial ("Live" do EduSaaS removido); números reais seguem como `TODO(raul)` | — |
| Could 3 · respiro entre seções | ✅ Corrigido (seções só com padding superior; sem espaçamento dobrado) | — |
| Could 4 · hero mobile | ⏭️ Mantido (ancoragem baixa é intencional) | — |
| Could 5 · enquadramento das imagens | ⏭️ Mantido (ganho pequeno) | — |

Regressão: bateria completa (overlay, FLIP, sheet, preloader, tema, idioma, auditoria a11y) verde; lint e tipos limpos; scroll a 60 fps.
