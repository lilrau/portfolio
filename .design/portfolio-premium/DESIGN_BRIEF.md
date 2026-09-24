# Design Brief: Portfolio Premium — Raul Souza Silva

## Problem

Um recrutador ou tech lead abre o portfolio entre dezenas de outros. Ele tem de 30 a 90 segundos para decidir se o Raul é um engenheiro sênior de produto ou mais um dev com template bonito. Hoje o site trabalha contra isso:

- tudo grita ao mesmo tempo: terminal digitando, memoji, cinco cards de navegação, gradientes em todo título e badges coloridas;
- os projetos descrevem *o que o sistema faz*, não *o que o Raul fez nem o impacto disso*;
- o currículo está preso num iframe de 800px, e as métricas fortes (−63% de latência, 15% → 72% de cobertura, 100+ operadores) estão escondidas no PDF;
- o vidro é só um blur, e o fluido em arco-íris parece uma demo de WebGL em vez de uma escolha de marca.

O resultado é que o recrutador não encontra rápido os sinais de senioridade e não sente o cuidado que diferencia um profissional premium.

## Solution

Uma experiência de peça de exposição, calma e confiante. O fluido interativo passa a ser a "matéria" do site: o conteúdo flutua sobre ele em lâminas de vidro líquido que refratam de verdade o que está atrás, e um cursor-lente de vidro deixa o visitante "tocar" a superfície.

A primeira dobra mostra só o essencial: nome em tipografia monumental, uma proposta de valor em uma linha e um CTA de contato. Rolando, a narrativa segue o que um recrutador quer saber, nesta ordem: quem é, o que já entregou (com números), onde trabalhou, como contatar. Cada seção entra com coreografia contida: headlines revelam linha a linha, cards de projeto ganham profundidade com parallax, e abrir um projeto vira uma transição, não um modal genérico.

O site existe em inglês e português, cada um com URL própria, para o Raul enviar o link certo para cada vaga.

## Experience Principles

1. **Evidência acima de adjetivos.** Nenhuma frase diz "sênior", "apaixonado" ou "incrível". Os números e decisões técnicas dizem. Todo projeto em destaque mostra papel, escopo e pelo menos uma métrica.
2. **Um elemento vivo por vez.** O fluido é o protagonista visual; tipografia e vidro são o palco. Animações coreografadas nunca competem com o fluido nem entre si: uma coisa se move de cada vez, e o conteúdo parado é quase monocromático.
3. **Espetáculo que não custa leitura.** Os recursos Awwwards (preloader, cursor, scroll coreografado) são camadas por cima de um documento que funciona sem elas. Em até 3 segundos o recrutador lê nome, cargo e CTA. Preloader só na primeira visita. `prefers-reduced-motion` desliga a coreografia e mantém o conteúdo.

## Aesthetic Direction

- **Philosophy**: *Liquid Editorial.* Liquid glass no estilo Apple (visionOS / iOS 26) combinado com tipografia editorial de portfolio de award. Vidro com refração real (SVG displacement), realce especular nas bordas e tint sutil sobre um campo de fluido com paleta curada.
- **Tone**: Calmo e confiante. Autoridade tranquila, frases curtas, sem superlativos, muito respiro.
- **Reference points**: portfolios premiados no Awwwards (tipografia expressiva, split-text reveals, cursor custom, transições de página); apple.com e visionOS (qualidade do vidro, ritmo de scroll, respiro); o uso editorial de serifa itálica como acento em sites de estúdio.
- **Anti-references**: template de portfolio de dev (terminal digitando, grid de logos coloridos, cards "About / Projects / Contact" no hero, emoji/memoji); gradientes de texto cinza em todo título; badges multicoloridas por tecnologia; "glassmorphism" de Dribbble (blur genérico e bordas brancas grossas); fluido arco-íris saturado; excesso de animação simultânea.

### Tipografia

- **Display**: serifa com itálico expressivo (ex.: Instrument Serif), para palavras de acento dentro de headlines e para números grandes.
- **Texto e UI**: grotesk neutra e precisa (ex.: Inter Tight ou Geist), em pesos extremos para o display sans do hero.
- Fontes self-hosted via `next/font`; sai o `@import` do Google Fonts.

### Cor

- Conteúdo quase monocromático: neutros frios em light e dark.
- Fluido com paleta curada de 4 a 5 tons harmônicos (azul, índigo, violeta, um toque de ciano), com intensidade calibrada por tema.
- Um único acento de UI derivado da paleta do fluido, usado com parcimônia (CTA, foco, estados ativos).

## Existing Patterns

- **Typography**: Geist e Geist Mono carregados via `next/font` em `layout.tsx`, mas o `body` sobrescreve com Inter via `@import` do Google Fonts em `globals.css`. Pesos `font-black` com gradiente cinza em todos os títulos. **Substituir.**
- **Colors**: só `--background` e `--foreground` em `:root` e `[data-theme="dark"]`. O dark mode é feito sobrescrevendo classes utilitárias (`.text-gray-700` etc.) com CSS, o que é frágil. **Substituir** por tokens semânticos.
- **Spacing**: escala padrão do Tailwind v4, sem tokens próprios.
- **Theme**: `data-theme` em `<html>`, salvo em `localStorage`, padrão light. `public/fluid.js` observa `data-theme` para trocar `BACK_COLOR`. **Manter o mecanismo** e passar a respeitar `prefers-color-scheme` como padrão.
- **Components**:
  - `components/fluid.tsx` + `public/fluid.js`: simulação WebGL. **Obrigatório manter.** Mudar só a paleta dos splats, a intensidade por tema e o respeito a reduced-motion.
  - `components/LiquidGlass.tsx`: blur CSS simples. **Reescrever** com refração SVG.
  - `components/CodeTerminal/*`, `Flex.tsx`, `Text.tsx`: **remover**. Hoje só o terminal usa Flex/Text; verificar antes de apagar.
  - `app/page.tsx`: monólito de ~1450 linhas. **Quebrar** em componentes de seção.
  - `data/projects.json`: **Estender** com `slug`, `featured`, `role`, `year`, `impact[]` e textos bilíngues.
- **Dependencies**: `framer-motion` (manter, para transições e reveals). `liquid-glass-react` e `@specy/liquid-glass-react` estão sem uso e devem ser **removidos**. `sass` só é usado pelo terminal e deve ser **removido** junto. `lucide-react` fica, com uso mínimo. Existem dois lockfiles: o projeto usa **pnpm**, então `package-lock.json` sai.

## Component Inventory

| Component | Status | Notes |
| --- | --- | --- |
| FluidBackground | Modify | Paleta curada, intensidade por tema, pausa com reduced-motion e aba oculta; carregar depois do conteúdo |
| LiquidGlass (Surface) | Modify (rewrite) | Filtro SVG de displacement e realce especular; variantes `pill`, `panel`, `lens`; fallback de blur fora do Chromium |
| GlassCursor | New | Lente de vidro que segue o ponteiro com mola; cresce/muda em links e cards; desativado em touch e reduced-motion |
| Preloader | New | Intro curta na primeira visita (sessionStorage): nome revela e o vidro "abre" para o fluido; menos de 2s; pulável |
| SmoothScroll | New | Lenis integrado ao framer-motion; desativado em reduced-motion |
| SplitText / RevealHeadline | New | Reveal linha a linha e palavra a palavra, com acento em serifa itálica |
| NavBar | Modify | Pill de vidro flutuante com links de seção, seletor EN/PT e toggle de tema; indica a seção ativa |
| ThemeToggle | Modify | Três estados implícitos (system padrão, light, dark) e sem flash no carregamento |
| LocaleSwitcher | New | Troca `/en` ↔ `/pt` preservando a âncora da seção |
| Hero | Modify (rewrite) | Nome monumental, cargo, uma linha de proposta de valor, CTA de contato e CTA secundário de CV; sem terminal nem memoji |
| About | Modify | Foto real em moldura de vidro, texto enxuto, uma frase sobre o background de educador |
| Stack | Modify (rewrite) | Lista tipográfica em 3 colunas (Backend / Frontend / AI & Infra), sem logos |
| FeaturedProjectCard | New | Amazoca, EduSaaS, AquiCob, Hi: imagem com parallax, papel, ano, 2-3 métricas, tags neutras |
| ProjectList | New | Lista compacta para os demais (AI Receptionist, AI Debt Agent, Transport, MEI-U, BootStack) com preview de imagem no hover |
| ProjectDetail | Modify (replace modal) | Painel/overlay com transição a partir do card (shared layout), galeria, descrição, links; fecha com Esc e foco preso |
| ExperienceTimeline | New | Amazoca, AquiCob, MoonRock (+ UTFPR×UNESP): cargo, período, 2-3 conquistas |
| EducationStrip | New | UTFPR, C1 English (destacado), Mackenzie AI, numa linha discreta |
| ResumeDownload | New | Botão para o PDF (EN), usado no hero, na Experience e no contato |
| ContactSection | Modify (rewrite) | Headline grande de fechamento, e-mail em destaque com copiar, LinkedIn e GitHub; sem iPhone nem Discord |
| Footer | New | Linha mínima: © ano, links e "back to top" |
| TechTag | Modify | Neutra, monocromática, sem cor por tecnologia |
| i18n dictionaries | New | `en` / `pt` para todo o texto de UI e conteúdo de projetos e experiência |

## Key Interactions

- **Primeira visita**: o preloader mostra o nome em reveal e a lâmina de vidro se dissolve, revelando o fluido já em movimento com um splat automático inicial. O hero entra em sequência: nome, cargo, proposta, CTAs. Nas visitas seguintes da sessão não há preloader.
- **Cursor**: a lente de vidro segue o ponteiro com mola suave (vidro com blur; ver nota de performance abaixo). Sobre link ou botão, encolhe e ganha contorno; sobre um card de projeto, expande e mostra um rótulo ("View"). O movimento do ponteiro continua alimentando o fluido, como hoje.
- **Scroll**: smooth scroll com inércia. Headlines de seção revelam linha a linha ao entrar. Os cards de destaque têm parallax leve na imagem e entram em sequência. A nav aparece depois do hero e marca a seção ativa.
- **Abrir projeto**: o card se expande num painel de detalhes (shared element). A galeria navega por setas, teclado e swipe. Esc ou o botão de fechar volta ao card de origem. A URL ganha `#project-slug` para ser compartilhável.
- **Lista de projetos**: no hover de uma linha, um preview da imagem flutua junto ao cursor (desktop). No toque, abre o detalhe.
- **Copiar e-mail**: clique copia; o botão confirma "Copied" / "Copiado" por 2s e anuncia via `aria-live`.
- **Tema**: o padrão segue o sistema. O toggle alterna light/dark, o fluido faz crossfade da cor de fundo, e não há flash no primeiro paint (script inline no `<head>`).
- **Idioma**: `/` redireciona para `/pt` ou `/en` conforme `Accept-Language`. O seletor troca de rota mantendo a seção atual.

> **Nota de performance (decidida no build, 2026-09-22).** A refração SVG (`backdrop-filter: url(#…)`) sai do caminho de GPU do Chromium: com ela em cards, nav e cursor, o scroll caía para ~36 fps numa Iris Xe. A refração ficou só nas pills pequenas; painéis, nav e a lente do cursor usam vidro com blur (≈60 fps). Reativar em superfícies grandes ou em movimento só passando em `scripts/bench-scroll.mjs`.

## Responsive Behavior

- **Desktop (≥1024px)**: experiência completa: cursor de vidro, parallax, preview flutuante na lista, grid de destaques 2×2 ou em cascata.
- **Tablet (768–1023px)**: sem cursor custom; destaques em 2 colunas; timeline em coluna única.
- **Mobile (<768px)**: nome do hero com escala fluida (`clamp`) sem quebrar feio; nav vira pill compacta com menu em sheet de vidro; destaques empilhados; lista sem preview flutuante (toque abre o detalhe); detalhe do projeto em tela cheia com swipe; fluido em resolução reduzida (já existe `isMobile()` em `fluid.js`); smooth scroll nativo em vez de Lenis.
- Em todos: gutter mínimo de 16px, sem scroll horizontal.

## Accessibility Requirements

- Contraste AA (4.5:1 texto, 3:1 texto grande e UI) **sobre o pior caso do fluido**: as lâminas de vidro recebem tint suficiente para garantir isso nos dois temas.
- `prefers-reduced-motion`: sem preloader, sem Lenis, sem parallax, reveals viram fade simples, fluido sem splats automáticos (continua reagindo ao ponteiro).
- O cursor custom nunca substitui o foco: `:focus-visible` com anel claro em todos os interativos; o cursor nativo volta em inputs.
- Navegação completa por teclado, com skip link para o conteúdo. O painel de projeto prende o foco, fecha com Esc e devolve o foco ao card.
- Canvas do fluido com `aria-hidden`. Imagens com `alt` descritivo bilíngue. `lang` correto em `<html>` por rota.
- Split text não quebra leitores de tela: o texto completo fica em `aria-label` e os spans são `aria-hidden`.

## Out of Scope

- Páginas de case study por projeto (`/projects/[slug]`). O detalhe é um painel na mesma página.
- Blog, CMS ou qualquer backend. O conteúdo continua em JSON/dicionários no repo.
- Formulário de contato (só `mailto` + copiar).
- Reescrever a física da simulação de fluido. Só paleta, intensidade e ciclo de vida.
- Currículo em PDF em português (continua só o PDF EN, linkado nas duas línguas).
- Analytics, SEO avançado além de metadata/OG por idioma e `hreflang`.
- Novas fotos ou screenshots de projetos. Usamos os assets existentes em `public/`.
