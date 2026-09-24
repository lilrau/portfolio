# Information Architecture: Portfolio Premium — Raul Souza Silva

> Base: `DESIGN_BRIEF.md` desta pasta. Estado atual: uma rota (`src/app/page.tsx`, ~1450 linhas), nav por âncoras com scroll em JS, conteúdo de projetos em `src/data/projects.json` e textos hard-coded em inglês.

## Site Map

- Root `/` → redirect para `/pt` ou `/en` (via `Accept-Language`; fallback `/en`)
- Home (EN) `/en`
  - Hero `/en` (topo)
  - Work `/en#work`
    - Project detail (overlay) `/en#work/<slug>`
  - Experience `/en#experience`
  - About `/en#about` (inclui o bloco Stack)
  - Contact `/en#contact`
- Home (PT) `/pt` (mesma estrutura, rótulos traduzidos, âncoras idênticas)
- Resume PDF `/raul_resume_en.pdf` (arquivo estático, linkado nas duas línguas)
- 404 `/[locale]/not-found` (fluido + link para a home do idioma)
- OG images `/en/opengraph-image`, `/pt/opengraph-image` (gerados com `next/og`)

**Slugs de projeto** (estáveis, em inglês, iguais nas duas línguas):

| Projeto | Slug | Tipo |
| --- | --- | --- |
| Amazoca | `amazoca` | Destaque |
| EduSaaS | `edusaas` | Destaque |
| AquiCob | `aquicob` | Destaque |
| Hi: Agenda e Gestão | `hi` | Destaque |
| AI Receptionist | `ai-receptionist` | Lista |
| AI Debt Negotiation Agent | `ai-debt-agent` | Lista |
| Transport — FlyXSolutions | `flyx-transport` | Lista |
| MEI-U (UTFPR × UNESP) | `mei-u` | Lista |
| BootStack | `bootstack` | Lista (open source) |

> As âncoras ficam em inglês nos dois idiomas (`#work`, não `#trabalhos`) para o seletor de idioma preservar a posição trocando só o prefixo da rota.

## Navigation Model

- **Primary navigation** (pill de vidro flutuante, 4 itens): Work · Experience · About · Contact
  - Aparece depois que o hero sai da tela (como hoje). Marca a seção ativa via IntersectionObserver.
  - O nome/monograma "RS" à esquerda da pill volta ao topo (substitui o ícone de Home).
- **Secondary navigation**: dentro de Work, os cards e as linhas da lista abrem o overlay de detalhe. Dentro do overlay, setas anterior/próximo navegam entre projetos sem fechar.
- **Utility navigation** (à direita da pill, separada por um divisor): seletor `EN / PT`, toggle de tema, botão "Résumé" (download do PDF).
  - Antes da nav aparecer (no hero), o seletor de idioma e o tema ficam fixos no canto superior direito, como o toggle atual.
- **Mobile navigation**: pill compacta com monograma, botão "Contact" e um botão de menu. O menu abre uma sheet de vidro de baixo para cima com os 4 links grandes (tipografia display), os utilitários e o e-mail. Fecha com swipe, Esc ou tocando fora.
- **Hero CTAs**: primário "Get in touch" (âncora `#contact`), secundário "Résumé" (PDF).
- **Footer**: © ano · LinkedIn · GitHub · "Back to top".

## Content Hierarchy

### Hero
1. **Nome** "Raul Souza Silva" em tipografia monumental. É o que o recrutador precisa memorizar.
2. **Cargo** "Full Stack Engineer · AI-enabled products": confirma o encaixe na vaga em 1s.
3. **Proposta de valor em uma linha**, com uma palavra em serifa itálica (ex.: "I build *reliable* products, from database to interface."). Dá o tom sem adjetivos vazios.
4. **CTAs**: Get in touch (primário) · Résumé (secundário). É a meta de conversão desde a primeira dobra.
5. **Micro-status** discreto: "Currently at Amazoca · Remote, Brazil" e um indicador de disponibilidade. Mostra senioridade em contexto real.
6. Dica de scroll sutil. Abaixo da dobra, só o fluido.

### Work
1. **Headline da seção** com reveal ("Selected *work*"). Orienta.
2. **4 cards de destaque** (Amazoca, EduSaaS, AquiCob, Hi), em ordem de força para "AI product engineer". Cada card tem, nesta ordem: imagem → nome → papel e ano → 2-3 métricas grandes → tags neutras. A métrica vem antes da descrição porque é a evidência.
3. **Lista compacta "More work"**: nome · tipo curto · ano · tags (máx. 3). Dá amplitude sem competir com os destaques.
4. Link "More on GitHub" no fim da lista (substitui o card fake "You can also check other stuff…").

### Project detail (overlay)
1. Galeria de imagens: o visual prova que o produto existe.
2. Nome, papel, período e links (site / GitHub).
3. **Impacto**: métricas e bullets de conquistas.
4. Descrição do produto (2-3 frases).
5. Stack completo (tags).
6. Navegação: anterior / próximo / fechar.

### Experience
1. Headline da seção.
2. **Timeline** em ordem reversa: Amazoca by Lugenius → AquiCob → MoonRock Tech Solutions (co-founder) → UTFPR × UNESP (voluntário). Cada item traz empresa, cargo(s), período, local e 2-3 conquistas com número em destaque. A promoção Junior → Full Stack na Amazoca aparece como dois cargos no mesmo item: é um sinal de crescimento.
3. **Education strip**: UTFPR (ADS, 2024–2025) · **English C1 (EF SET)** em destaque · Mackenzie AI & Data Science.
4. Botão "Download résumé (PDF)".

### About
1. Foto real em moldura de vidro, ao lado de um parágrafo curto de apresentação (quem é, o que constrói, como trabalha com produto).
2. Uma frase sobre o background de educador, como diferencial de comunicação.
3. **Bloco Stack**: 3 colunas tipográficas (Backend · Frontend · AI & Infra), com a fonte da verdade no currículo.
4. Idiomas: Português (nativo) · English (C1).

### Contact
1. **Headline de fechamento** grande ("Let's build something *reliable*." / "Vamos construir algo *confiável*.").
2. **E-mail em destaque**, clicável (`mailto`), com botão de copiar.
3. LinkedIn · GitHub.
4. Localização e fuso ("Brazil · UTC−3 · open to remote").

### 404
1. "Page not found" / "Página não encontrada" em display.
2. Link para a home do idioma. O fluido continua interativo.

## User Flows

### Recrutador em triagem rápida (meta: < 60s)
1. Chega em `/en` (link do LinkedIn ou da candidatura). Preloader na primeira visita (< 2s, pulável).
2. Lê nome, cargo e proposta no hero.
   - Se já está convencido → clica "Résumé" (PDF abre em nova aba) ou "Get in touch" (rola até Contact).
   - Se quer evidência → rola.
3. Em Work, bate o olho nas métricas dos 4 destaques.
4. Em Experience, confirma empresas, períodos e o C1.
5. Em Contact, copia o e-mail ou abre o LinkedIn. **Conversão.**

### Tech lead aprofundando
1. Chega por um link direto, possivelmente `/en#work/amazoca`, enviado pelo recrutador.
   - Se a URL tem `#work/<slug>` → a página carrega com o overlay do projeto aberto (sem preloader).
2. Explora a galeria e o impacto; navega com "próximo" pelos outros projetos.
3. Fecha o overlay (Esc/X) e volta ao card de origem em Work.
4. Visita GitHub (lista ou footer), e About para ver o Stack.
5. Contact → e-mail.

### Visitante brasileiro
1. Acessa `/` com o navegador em pt-BR → redirect para `/pt`.
2. Mesmo fluxo, com textos em PT. O PDF continua em EN, e o botão avisa: "Currículo (PDF, em inglês)".
3. Pode trocar para EN pelo seletor; a seção atual é preservada.

### Troca de tema
1. O primeiro paint já usa o tema do sistema (script inline, sem flash).
2. O toggle alterna light/dark e salva em `localStorage`. O fluido faz crossfade do fundo.

## Naming Conventions

| Concept | Label EN | Label PT | Notes |
| --- | --- | --- | --- |
| Seção de projetos | Work | Trabalhos | Headline: "Selected work" / "Trabalhos selecionados" |
| Projetos não-destaque | More work | Mais trabalhos | |
| Painel de projeto | — (sem rótulo) | — | Na UI é só o conteúdo; no código é `ProjectDetail` |
| Carreira | Experience | Experiência | |
| Currículo (arquivo) | Résumé | Currículo | Sempre com "(PDF)" no botão de download |
| Sobre | About | Sobre | |
| Contato | Contact | Contato | CTA: "Get in touch" / "Fale comigo" |
| Tecnologias | Stack | Stack | Termo usado igual em PT |
| Métrica de impacto | — | — | No código: `impact[]` com `{ value, label }` |
| Papel no projeto | Role | Papel | Ex.: "Full Stack Engineer", "Co-founder & Lead Engineer" |
| Formação | Education | Formação | |
| Disponibilidade | Open to opportunities | Aberto a oportunidades | Controlado por uma flag nos dados |

## Component Reuse Map

| Component | Used on | Behavior differences |
| --- | --- | --- |
| `app/[locale]/layout.tsx` | Todas as rotas localizadas | Define `lang`, fontes, script de tema, `FluidBackground`, `GlassCursor`, `SmoothScroll`, `NavBar` |
| `FluidBackground` | Home, 404 | Na 404 não há splats automáticos de entrada |
| `GlassSurface` (ex-LiquidGlass) | Nav, cards, overlay, sheet mobile, cursor, botões | Variantes `pill` / `panel` / `lens`; intensidade de refração por variante |
| `Section` (wrapper) | Work, Experience, About, Contact | Todas usam `id`, eyebrow opcional, headline com reveal e container de largura consistente |
| `RevealHeadline` | Hero, todas as seções, 404, Contact | Hero em escala monumental; seções em escala display |
| `TechTag` | Cards, lista, overlay, Stack | Na lista mostra no máximo 3; no overlay, todas |
| `ImpactStat` | Cards de destaque, overlay, timeline | Tamanho menor na timeline |
| `ResumeButton` | Hero, nav (utility), Experience, Contact | Primário na Experience, secundário no hero, ícone na nav mobile |
| `LocaleSwitcher` / `ThemeToggle` | Canto fixo (hero), nav, sheet mobile | Mesma lógica, três apresentações |

## Content Growth Plan

- **Projetos**: vivem em `src/data/projects.ts` (tipado), com `featured: boolean` e `order`. Novos projetos entram na lista "More work"; promover um a destaque é trocar a flag. Limite de design: **4 destaques** (grid 2×2) e **até ~8 na lista**. Acima disso, a lista mostra 6 e um "Show all".
- **Experiência**: `src/data/experience.ts`. Cresce devagar; a timeline aceita N itens sem mudar o layout.
- **Textos de UI e conteúdo**: dicionários `src/i18n/en.ts` e `src/i18n/pt.ts`, com a mesma forma tipada. Campos de conteúdo bilíngue (descrições, conquistas) ficam nos dados como `{ en, pt }`.
- Sem CMS, blog, busca ou paginação (fora de escopo).

## URL Strategy

- **Pattern**: `/<locale>` + fragmento `#<section>` ou `#work/<project-slug>`.
- **Locales**: `en`, `pt`. Segmento dinâmico `app/[locale]` com `generateStaticParams` (as duas línguas pré-renderizadas estaticamente).
- **Root**: `/` faz redirect via `proxy.ts` (nome do middleware no Next 16) (Accept-Language → `pt` se começar com `pt`, senão `en`).
- **Dynamic segments**: só `[locale]`. O detalhe do projeto é hash (overlay client-side), não rota.
- **Query parameters**: nenhum.
- **SEO**: `hreflang` alternates entre `/en` e `/pt`, `canonical` por idioma, metadata e OG image traduzidos.
- **Âncoras**: sempre em inglês e iguais nos dois idiomas; o seletor troca `/en#about` ↔ `/pt#about`.
