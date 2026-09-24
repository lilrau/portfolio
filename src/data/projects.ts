import type { Project } from "./types";

// Facts come from the résumé (public/raul_resume_en.pdf). Missing data is
// left empty with TODO(raul) rather than estimated.
export const projects: Project[] = [
  {
    slug: "amazoca",
    title: "Amazoca",
    featured: true,
    kind: { en: "AI-powered travel marketplace", pt: "Marketplace de viagens com IA" },
    role: { en: "Full Stack Software Engineer", pt: "Engenheiro de Software Full Stack" },
    context: "Amazoca by Lugenius",
    period: "2025 — 2026",
    achievements: [
      { en: "Owned architectural decisions across frontend and backend with product and engineering.", pt: "Responsável por decisões de arquitetura no frontend e no backend, junto com produto e engenharia." },
      { en: "Built AI-driven features: recommendations, persistent chat, payments, reservations and onboarding with real-time communication.", pt: "Construí features com IA: recomendações, chat persistente, pagamentos, reservas e onboarding com comunicação em tempo real." },
      { en: "Set up CI/CD with GitHub Actions, Render, Vercel and Cloudflare: ~5 deploys a week and ~6% lower infrastructure cost.", pt: "Montei CI/CD com GitHub Actions, Render, Vercel e Cloudflare: ~5 deploys por semana e ~6% a menos de custo de infraestrutura." },
    ],
    description: {
      en: "A marketplace for short-term rentals, experiences and services in the heart of the Amazon, connecting hosts and travellers. AI powers personalised recommendations across the platform.",
      pt: "Um marketplace de aluguéis de temporada, experiências e serviços no coração da Amazônia, conectando anfitriões e viajantes. A IA gera recomendações personalizadas em toda a plataforma.",
    },
    tags: ["Next.js", "React", "NestJS", "TypeScript", "PostgreSQL", "TypeORM", "VectorDB", "OpenAI API"],
    images: ["/amazoca.png", "/amazoca1.png"],
  },
  {
    slug: "edusaas",
    title: "EduSaaS",
    featured: true,
    kind: { en: "Multi-tenant school management SaaS", pt: "SaaS multi-tenant de gestão escolar" },
    role: { en: "Co-founder & Lead Engineer", pt: "Co-fundador e Engenheiro Líder" },
    context: "MoonRock Tech Solutions",
    // TODO(raul): period.
    achievements: [
      { en: "Designed the multi-tenant architecture, database and deployment pipeline.", pt: "Projetei a arquitetura multi-tenant, o banco de dados e o pipeline de deploy." },
      { en: "Automated billing reminders and class notices over WhatsApp, and boleto/instalment tracking with financial institutions.", pt: "Automatizei lembretes de cobrança e avisos de aula pelo WhatsApp, e o acompanhamento de boletos e parcelas com instituições financeiras." },
    ],
    description: {
      en: "Management platform for vocational schools with automated communication: WhatsApp reminders for billing and classes, and bank integrations that keep boletos and instalments in sync.",
      pt: "Plataforma de gestão para escolas profissionalizantes com comunicação automatizada: lembretes de cobrança e aulas pelo WhatsApp, e integrações bancárias que mantêm boletos e parcelas em dia.",
    },
    tags: ["Laravel", "React", "Inertia.js", "PostgreSQL", "Redis", "Cloudflare R2"],
    images: ["/edusaas.png", "/edusaas1.png", "/edusaas2.png"],
  },
  {
    slug: "aquicob",
    title: "AquiCob",
    featured: true,
    kind: { en: "Debt-collection CRM with AI workflows", pt: "CRM de cobrança com fluxos de IA" },
    role: { en: "Software Engineer — Automation & AI", pt: "Engenheiro de Software — Automação e IA" },
    context: "AquiCob",
    period: "2024 — 2025",
    achievements: [
      { en: "Built AI-assisted customer service workflows for the operators' daily routine.", pt: "Construí fluxos de atendimento assistidos por IA para a rotina dos operadores." },
      { en: "Integrated WhatsApp Cloud API, Chatwoot and financial platforms through n8n and APIs.", pt: "Integrei WhatsApp Cloud API, Chatwoot e plataformas financeiras via n8n e APIs." },
      { en: "Designed negotiation flows that cut repetitive manual work.", pt: "Desenhei fluxos de negociação que reduziram o trabalho manual repetitivo." },
    ],
    description: {
      en: "A complete CRM for billing management: billing, financial and client management, with WhatsApp, n8n workflows and financial institutions wired in.",
      pt: "Um CRM completo de gestão de cobrança: faturamento, gestão financeira e de clientes, com WhatsApp, fluxos n8n e instituições financeiras integrados.",
    },
    tags: ["PHP", "MySQL", "n8n", "WhatsApp Cloud API", "Chatwoot", "OpenAI API"],
    images: ["/aquicob.png"],
  },
  {
    slug: "hi",
    title: "Hi: Agenda e Gestão",
    featured: true,
    kind: { en: "Scheduling & client management for professionals", pt: "Agenda e gestão de clientes para profissionais" },
    role: { en: "Co-founder & Lead Engineer", pt: "Co-fundador e Engenheiro Líder" },
    context: "MoonRock Tech Solutions",
    // TODO(raul): period.
    achievements: [
      { en: "Led architecture, database design and the automated testing infrastructure.", pt: "Liderei a arquitetura, o design do banco e a infraestrutura de testes automatizados." },
      { en: "WhatsApp AI assistant for scheduling and client follow-up.", pt: "Assistente de IA no WhatsApp para agendamento e acompanhamento de clientes." },
    ],
    description: {
      en: "A business management platform for independent professionals: a web app (formerly also mobile) to run schedules and clients, with an AI assistant on WhatsApp.",
      pt: "Uma plataforma de gestão para profissionais autônomos: um app web (antes também mobile) para cuidar da agenda e dos clientes, com um assistente de IA no WhatsApp.",
    },
    tags: ["NestJS", "Prisma", "React", "Vite", "TypeScript", "PostgreSQL"],
    images: ["/hiapp.png", "/hiapp1.png", "/hiapp2.png"],
  },
  {
    slug: "ai-receptionist",
    title: "AI Receptionist",
    featured: false,
    kind: { en: "Voice AI agent for a dental practice", pt: "Agente de voz com IA para uma clínica odontológica" },
    // TODO(raul): role, period / context.
    achievements: [
      { en: "Handles calls naturally: books and manages appointments, answers common questions and escalates urgent cases to the team.", pt: "Atende ligações com naturalidade: agenda e gerencia consultas, responde dúvidas comuns e encaminha urgências para a equipe." },
    ],
    description: {
      en: "An AI-powered phone receptionist that manages appointments and patient enquiries by voice, keeping service professional and human.",
      pt: "Uma recepcionista telefônica com IA que gerencia consultas e dúvidas de pacientes por voz, mantendo o atendimento profissional e humano.",
    },
    tags: ["Retell AI", "ElevenLabs", "n8n", "OpenAI API", "VectorDB"],
    images: ["/dentalrecepcionist0.png", "/dentalrecepcionist.png", "/dentalrecepcionist1.png", "/dentalrecepcionist2.png", "/dentalrecepcionist3.png", "/dentalrecepcionist4.png"],
  },
  {
    slug: "ai-debt-agent",
    title: "AI Debt Negotiation Agent",
    featured: false,
    kind: { en: "AI agent integrated with a CRM and WhatsApp", pt: "Agente de IA integrado a CRM e WhatsApp" },
    role: { en: "Software Engineer — Automation & AI", pt: "Engenheiro de Software — Automação e IA" },
    context: "AquiCob",
    achievements: [
      { en: "Migrated the chatbot I first built as n8n workflows to a Node.js + Express service, fully integrated with the CRM.", pt: "Migrei o chatbot que construí primeiro em fluxos n8n para um serviço Node.js + Express, totalmente integrado ao CRM." },
    ],
    description: {
      en: "A real-time negotiation agent on WhatsApp that manages client conversations, automates negotiation steps and improves recovery rates.",
      pt: "Um agente de negociação em tempo real no WhatsApp que conduz conversas com clientes, automatiza etapas da negociação e melhora as taxas de recuperação.",
    },
    tags: ["Node.js", "Express", "n8n", "OpenAI API", "Chatwoot", "MySQL"],
    images: ["/ai_agent.jpg", "/ai_agent1.jpg", "/ai_agent2.jpg"],
  },
  {
    slug: "flyx-transport",
    title: "FlyX Transport",
    featured: false,
    kind: { en: "Management platform for freight companies", pt: "Plataforma de gestão para transportadoras" },
    // TODO(raul): role, period / context.
    achievements: [
      { en: "Fleet management, route planning, invoicing and client management in one product.", pt: "Gestão de frota, planejamento de rotas, faturamento e gestão de clientes num só produto." },
    ],
    description: {
      en: "Business management software for transport and freight companies that streamlines operations and helps control costs.",
      pt: "Software de gestão para empresas de transporte e frete que simplifica a operação e ajuda a controlar custos.",
    },
    tags: ["Next.js", "React", "TypeScript", "Node.js", "Supabase", "Vercel"],
    images: ["/transwilson.jpg", "/transwilson1.jpg", "/transwilson2.jpg"],
  },
  {
    slug: "mei-u",
    title: "MEI-U",
    featured: false,
    kind: { en: "Academic project platform, UTFPR × UNESP", pt: "Plataforma de projetos acadêmicos, UTFPR × UNESP" },
    role: { en: "Volunteer student developer", pt: "Desenvolvedor voluntário" },
    context: "UTFPR × UNESP",
    period: "2024",
    achievements: [
      { en: "Allocation algorithm based on Euclidean distance to match student skills with project needs.", pt: "Algoritmo de alocação por distância euclidiana para casar habilidades dos alunos com as necessidades dos projetos." },
    ],
    description: {
      en: "Manages students and academic projects: onboarding, skill mapping, project allocation and KPI tracking, following UTFPR's MEI-U methodology.",
      pt: "Gerencia alunos e projetos acadêmicos: onboarding, mapeamento de habilidades, alocação em projetos e acompanhamento de KPIs, seguindo a metodologia MEI-U da UTFPR.",
    },
    tags: [".NET", "React", "Python", "Docker"],
    images: ["/meiu.png"],
  },
  {
    slug: "bootstack",
    title: "BootStack",
    featured: true,
    kind: { en: "Open-source Linux setup tool", pt: "Ferramenta open source de setup Linux" },
    role: { en: "Author", pt: "Autor" },
    context: "Open source",
    achievements: [
      { en: "Regenerates a Linux environment across APT, Pacman, DNF, Zypper and APK, with setup export/import as JSON.", pt: "Recria um ambiente Linux entre APT, Pacman, DNF, Zypper e APK, com exportação e importação do setup em JSON." },
    ],
    description: {
      en: "A web tool to rebuild your Linux environment on any package manager from a portable JSON setup.",
      pt: "Uma ferramenta web para reconstruir seu ambiente Linux em qualquer gerenciador de pacotes a partir de um setup JSON portátil.",
    },
    tags: ["Next.js", "TypeScript", "Radix UI"],
    images: ["/bootstack.webp", "/bootstack1.webp"],
  },
];

export const featuredProjects = projects.filter((p) => p.featured);
export const moreProjects = projects.filter((p) => !p.featured);
