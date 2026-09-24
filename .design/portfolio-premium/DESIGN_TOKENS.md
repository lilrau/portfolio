# Design Tokens: Portfolio Premium

**Arquivo-fonte:** `src/styles/tokens.css` (importado em `src/app/globals.css` logo após `tailwindcss`).
**Filosofia:** *Liquid Editorial*: Editorial/Magazine (tipografia, escala dramática, reveals, parallax) sobre um sistema de liquid glass no estilo Apple, com o fluido como única fonte de cor.

## Decisões

| Área | Escolha | Por quê |
| --- | --- | --- |
| Display | **Instrument Serif** (com itálico) | Serifa editorial dos portfolios de award; usada em palavras de acento, headlines de seção e métricas |
| Texto/UI | **Geist** (já carregada via `next/font`) | Grotesk precisa e próxima da SF, sem o genérico do Inter. Sai o `@import` do Inter. O hero usa Geist em peso extremo com tracking −0.045em |
| Mono | **Geist Mono** | Eyebrows em caixa alta, anos, metadados: o detalhe de "folio" editorial |
| Neutros | Cinzas **frios** (`#f3f4f7` / `#07080c`) | Casam com a paleta azul-violeta do fluido; o dark não é inversão, é quase preto azulado |
| Acento | Índigo `#3346d3` (light) / `#8c99ff` (dark) | Derivado da cor 1 do fluido; usado só em CTA, foco, link e estado ativo |
| Fluido | 5 tons: índigo, pervinca, violeta, azul, ciano | Substitui o arco-íris aleatório. Intensidade 0.12 no light e 0.16 no dark (o dark "absorve" mais) |
| Vidro | Tint 70% (light) / 72% (dark), blur 18px, saturate 180%, refração SVG escala 40 (lente 70) | Tint calculado para garantir AA **sobre o fluido saturado** (pior caso) |
| Espaçamento | Base 8px + `--space-section` fluido (96→192px) | Respiro editorial; o ritmo entre seções escala com a viewport |
| Tipo | Escala fluida por `clamp()`, de 375 a 1440px; hero de 56 a 176px | Nome monumental sem quebrar no mobile |
| Raios | 10 / 20 / 32 / 44 / pill | Cantos grandes no estilo visionOS nos painéis de vidro |
| Motion | `expo-out` para reveals e overlays; stagger de 90ms por linha e 70ms por item; preloader ≤ 1.8s | Movimento "caro": rápido no início e longo no assentamento. Bounce só no press de vidro, nunca em texto |
| Breakpoints | Defaults do Tailwind v4 (640/768/1024/1280/1536) | `lg` (1024) liga o cursor de vidro e o parallax |

## Contraste verificado (WCAG 2.x)

| Par | Light | Dark |
| --- | --- | --- |
| text-primary / bg | 17.7 | 17.2 |
| text-secondary / bg | 7.7 | 8.6 |
| text-secondary / glass sobre fluido saturado (pior caso) | ≥ 5.3 | ≥ 4.6 |
| text-tertiary / bg | 4.9 | 5.2 |
| accent / bg | 6.5 | 7.7 |
| on-accent / accent | 7.1 | 7.7 |

**Regras de uso que derivam disso:**
- `text-ink-subtle` (tertiary) só sobre o fundo liso ou vidro `strong`; **nunca** sobre vidro comum em cima do fluido.
- Texto de corpo diretamente sobre o fluido (sem vidro) só em `text-ink` (primary).
- O vidro `subtle` (40%/35%) é decorativo (lente do cursor, pills sem texto essencial).

## Ponte com o Tailwind (utilities)

`bg-canvas` `bg-surface` `bg-well` · `text-ink` `text-ink-muted` `text-ink-subtle` · `border-line` `border-line-subtle` · `bg-accent` `text-accent` `text-accent-fg` · `font-display` `font-sans` `font-mono` · `text-hero` `text-display` `text-metric` `text-headline` `text-title` `text-lead` · `rounded-glass(-sm|-md|-xl)` · `shadow-glass` `shadow-soft` `shadow-deep` · `ease-out-expo` `ease-in-out-expo` `ease-spring` · `max-w-content` `max-w-wide` `max-w-page`

## Contrato com o `fluid.js`

O script deve ler, via `getComputedStyle(document.documentElement)`, e reler quando `data-theme` ou `prefers-color-scheme` mudarem:
- `--fluid-back`: triplet RGB → `config.BACK_COLOR`
- `--fluid-color-1..5` → pool de onde `generateColor()` sorteia
- `--fluid-intensity` → multiplicador (antes hard-coded em 0.15)
- `--fluid-burst` → ganho extra dos splats automáticos (preloader): 10 no light, 5 no dark (no dark 10 estourava para branco)

## Tokens adicionados durante o build

- `--glass-edge-tint` (light 14% branco / dark 22% grafite): tint do anel do bezel, onde a refração aparece; o núcleo usa `--glass-tint` para o contraste do texto.
- `--glass-blur-refract: 2px`: blur leve quando a refração SVG está ativa (o blur de 18px apagaria a distorção).
- Halo de legibilidade (em `globals.css`, não token): `text-shadow` na cor do fundo em `main`/`footer`, para texto sem vidro sobre splats saturados.

## Refração: onde ela é permitida (medido)

A refração SVG (`backdrop-filter: url(#…)`) sai do caminho de GPU do Chromium e re-renderiza o backdrop a cada frame em que o conteúdo por trás se move. Medido numa Iris Xe com scroll + ponteiro (`scripts/bench-scroll.mjs`): refração em todas as superfícies ≈ 36 fps; só nas pills pequenas ≈ 60 fps. Por isso `panel`, `strong` (nav) e `lens` (cursor) usam só blur; `pill` refrata. `--glass-refraction-lens` fica reservado caso a lente volte a refratar (ex.: só com o ponteiro parado).

## Refração: onde ela é permitida (medido)

A refração SVG (`backdrop-filter: url(#…)`) sai do caminho de GPU do Chromium e re-renderiza o backdrop a cada frame em que o conteúdo por trás se move. Medido numa Iris Xe com scroll + ponteiro (`scripts/bench-scroll.mjs`): refração em todas as superfícies ≈ 36 fps; só nas pills pequenas ≈ 60 fps. Por isso `panel`, `strong` (nav) e `lens` (cursor) usam só blur; `pill` refrata. `--glass-refraction-lens` fica reservado caso a lente volte a refratar.

## Desvios e pendências

- Os tokens de dark estão duplicados (`[data-theme="dark"]` e `@media (prefers-color-scheme)`) por exigência do padrão de resolução de tema; editar os dois juntos.
- As sombras `--shadow-sm/md/lg` sobrescrevem os defaults do Tailwind de mesmo nome, de propósito (`shadow-md` passa a usar a sombra do sistema).
- As classes legadas (`text-gray-*`, overrides de dark, `--background`) foram removidas na task 19.
- Instrument Serif é carregada via `next/font/google` como `--font-instrument-serif`, com as variáveis de fonte no `<html>` (no `<body>` o `:root` não as enxerga).
- `pnpm build` dispara uma verificação de deps que falha por builds ignorados (`sharp`, `@parcel/watcher`, `unrs-resolver`). Rodar `pnpm approve-builds` uma vez resolve. Até lá, `./node_modules/.bin/next build` funciona.
