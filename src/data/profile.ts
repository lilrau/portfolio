import type { Job, Localized } from "./types";

export const contact = {
  email: "raulsscoc@hotmail.com",
  linkedin: "https://linkedin.com/in/lilrau",
  github: "https://github.com/lilrau",
  resume: "/raul_resume_en.pdf",
};

// From the résumé (public/raul_resume_en.pdf), newest first.
export const experience: Job[] = [
  {
    company: "Bioregistro",
    location: { en: "Remote, Brazil", pt: "Remoto, Brasil" },
    roles: [
      { title: { en: "Mid-level Full Stack Engineer", pt: "Engenheiro Full Stack Pleno" }, period: "Jul 2026 — Now" },
    ],
    highlights: [
      { text: { en: "Building an end-to-end public sector examination platform: frontend, backend and core processing for large-scale contest operations.", pt: "Construindo uma plataforma de ponta a ponta para concursos públicos: frontend, backend e processamento para operações em larga escala." } },
      { text: { en: "Designed the answer-sheet pipeline in .NET: AI-assisted edital extraction with human approval, OMR, QR/OCR candidate identification, deterministic scoring and operator review.", pt: "Desenhei o pipeline de cartões-resposta em .NET: extração de edital assistida por IA com aprovação humana, OMR, identificação por QR/OCR, correção determinística e revisão operacional." } },
      { text: { en: "Layout-agnostic computer vision that infers answer-sheet geometry automatically, plus Next.js interfaces for contest management, reconciliation, review queues and result publication.", pt: "Visão computacional independente de layout que infere a geometria do cartão-resposta, e interfaces em Next.js para gestão de concursos, conciliação, filas de revisão e publicação de resultados." } },
    ],
  },
  {
    company: "Amazoca by Lugenius",
    location: { en: "Remote, Brazil", pt: "Remoto, Brasil" },
    roles: [
      { title: { en: "Full Stack Software Engineer", pt: "Engenheiro de Software Full Stack" }, period: "Jan — Jul 2026" },
      { title: { en: "Junior Developer", pt: "Desenvolvedor Júnior" }, period: "Oct — Dec 2025" },
    ],
    highlights: [
      { text: { en: "Sole developer of the recommendation agent that assembles a personalised travel package for each user, built on LLMs and vector databases.", pt: "Único responsável por desenvolver o agente de recomendação que monta o pacote de viagem ideal para cada usuário, usando LLMs e bancos vetoriais." } },
      { text: { en: "Owned architectural decisions across frontend and backend with product and engineering, and built persistent chat, payments, reservations and real-time onboarding.", pt: "Responsável por decisões de arquitetura no frontend e no backend junto com produto e engenharia, e construí chat persistente, pagamentos, reservas e onboarding em tempo real." } },
      { text: { en: "Tuned the critical database queries with indexing, eager loading and TypeORM adjustments, and grew the unit and integration test suite (Vitest, Jest).", pt: "Otimizei as queries críticas do banco com índices, eager loading e ajustes no TypeORM, e ampliei a suíte de testes unitários e de integração (Vitest, Jest)." } },
      { text: { en: "Set up CI/CD with GitHub Actions, Render, Vercel and Cloudflare for frequent, low-risk deploys.", pt: "Montei o CI/CD com GitHub Actions, Render, Vercel e Cloudflare para deploys frequentes e seguros." } },
    ],
  },
  {
    company: "AquiCob",
    location: { en: "Ponta Grossa, Brazil", pt: "Ponta Grossa, Brasil" },
    roles: [{ title: { en: "Software Engineer — Automation & AI", pt: "Engenheiro de Software — Automação e IA" }, period: "Jun 2024 — Aug 2025" }],
    highlights: [
      { text: { en: "Built WhatsApp bots that replace human operators in debt collection, fully integrated with the CRM.", pt: "Desenvolvi robôs de WhatsApp que substituem operadores humanos na cobrança de dívidas, totalmente integrados ao CRM." } },
      { text: { en: "Integrated WhatsApp Cloud API, Chatwoot and financial platforms through n8n and APIs, automating the first response to customers.", pt: "Integrei WhatsApp Cloud API, Chatwoot e plataformas financeiras via n8n e APIs, automatizando a primeira resposta aos clientes." } },
      { text: { en: "Designed intelligent negotiation flows on WhatsApp that cut repetitive manual work.", pt: "Desenhei fluxos de negociação inteligentes no WhatsApp que reduziram o trabalho manual repetitivo." } },
    ],
  },
  {
    company: "MoonRock Tech Solutions",
    location: { en: "Remote, Brazil", pt: "Remoto, Brasil" },
    roles: [{ title: { en: "Software Engineer & Co-founder", pt: "Engenheiro de Software e Co-fundador" }, period: "Sep 2023 — Now" }],
    highlights: [
      { text: { en: "Co-founded a software studio building B2B and B2C web platforms (EduSaaS, Hi).", pt: "Co-fundei um estúdio de software que constrói plataformas web B2B e B2C (EduSaaS, Hi)." } },
      { text: { en: "Lead architecture, database design and deployment across the products, including a leaner build pipeline.", pt: "Lidero a arquitetura, o design de banco de dados e o deploy dos produtos, incluindo um pipeline de build mais enxuto." } },
      { text: { en: "Designed EduSaaS's multi-tenant core with WhatsApp billing and class reminders, and Hi's WhatsApp AI assistant for scheduling.", pt: "Projetei o núcleo multi-tenant do EduSaaS, com lembretes de cobrança e aulas pelo WhatsApp, e o assistente de IA no WhatsApp do Hi para agendamentos." } },
    ],
  },
  {
    company: "UTFPR × UNESP",
    location: { en: "Academic project", pt: "Projeto acadêmico" },
    roles: [{ title: { en: "Volunteer Student Developer", pt: "Desenvolvedor Voluntário" }, period: "Feb — Jun 2024" }],
    highlights: [
      { text: { en: "Built the project-management platform for MEI-U, UTFPR's methodology where student teams solve real-world problems: from onboarding and skill mapping to KPI and deadline tracking.", pt: "Desenvolvi a plataforma de gestão de projetos do MEI-U, metodologia da UTFPR em que times de alunos resolvem problemas reais: do onboarding e mapeamento de competências ao acompanhamento de KPIs e prazos." } },
      { text: { en: "Implemented the allocation algorithm, matching students' competencies to project requirements by Euclidean distance, designed to evolve into more advanced machine learning models.", pt: "Implementei o algoritmo de alocação, que casa as competências dos alunos com os requisitos dos projetos por distância euclidiana, pensado para evoluir para modelos de machine learning mais avançados." } },
      { text: { en: "Designed a scalable, containerised architecture: .NET backend services, a React frontend, and Docker for orchestration and deployment.", pt: "Projetei uma arquitetura escalável e conteinerizada: serviços de backend em .NET, frontend em React e Docker para orquestração e deploy." } },
    ],
  },
];

// `mark` is the short monogram shown large on each card.
export const education: { mark: Localized; title: Localized; detail: Localized }[] = [
  {
    mark: { en: "C1", pt: "C1" },
    title: { en: "English C1 Advanced", pt: "Inglês C1 Avançado" },
    detail: { en: "EF SET certificate", pt: "Certificado EF SET" },
  },
  {
    mark: { en: "SA&D", pt: "ADS" },
    title: { en: "Technology Degree in Systems Analysis and Development", pt: "Curso Superior de Tecnologia em Análise e Desenvolvimento de Sistemas" },
    detail: { en: "UTFPR · 2024 — 2026", pt: "UTFPR · 2024 — 2026" },
  },
  {
    mark: { en: "AI", pt: "IA" },
    title: { en: "AI & Advanced Data Science Tools", pt: "IA e Ferramentas Avançadas de Data Science" },
    detail: { en: "Mackenzie Presbyterian University", pt: "Universidade Presbiteriana Mackenzie" },
  },
];

export const stack: { group: Localized; items: string[] }[] = [
  {
    group: { en: "Backend", pt: "Backend" },
    items: ["Node.js", "NestJS", ".NET", "Laravel", "PHP", "REST APIs", "PostgreSQL", "SQL Server", "MySQL", "Prisma", "TypeORM", "Redis"],
  },
  {
    group: { en: "Frontend", pt: "Frontend" },
    items: ["TypeScript", "React", "Next.js", "Vite", "Inertia.js", "Tailwind CSS"],
  },
  {
    group: { en: "AI & Infra", pt: "IA e Infra" },
    items: ["LLM integrations", "AI agents", "Computer vision", "Recommendation systems", "Vector databases", "n8n", "Docker", "GitHub Actions", "Vercel", "Render", "Cloudflare"],
  },
];
