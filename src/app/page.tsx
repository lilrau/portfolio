"use client";

import FluidBackground from "../components/fluid";
import LiquidGlass from "../components/LiquidGlass";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  FolderOpen,
  FileText,
  Mail,
  Code2,
  Monitor,
  Package,
  Workflow,
  Github,
  ExternalLink,
  ArrowRight,
  Moon,
  Sun,
  Home as HomeIcon,
} from "lucide-react";
import { useState, useEffect } from "react";
import React from "react";
import projectsData from "../data/projects.json";
import { CodeTerminal } from "../components/CodeTerminal";

interface Project {
  title: string;
  subtitle: string;
  description: string;
  images: string[];
  tech_tags?: string[];
  link?: string;
  github?: string | null;
}

type TechTagConfig = {
  className: string;
  Icon?: React.ComponentType<{ className?: string }>;
};

// Add this mock project after importing projectsData
const allProjects: Project[] = [
  ...(projectsData as Project[]),
  {
    title: "You can also check other stuff on my github",
    subtitle: "Click this card",
    description: "",
    images: [""], // No image, but keeps the design
    link: "https://github.com/lilrau",
    github: null,
    tech_tags: [],
  },
];

export default function Home() {
  const [showHeader, setShowHeader] = useState(false);
  const [currentImages, setCurrentImages] = useState<{ [key: string]: number }>(
    {}
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImages, setModalImages] = useState<string[]>([]);
  const [currentModalImage, setCurrentModalImage] = useState(0);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const handleScroll = () => {
      // Mostra o header quando rolar mais que 100vh (altura da hero)
      setShowHeader(window.scrollY > window.innerHeight * 0.9);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const stored = window.localStorage.getItem("theme");
    if (stored === "light" || stored === "dark") {
      setTheme(stored);
      return;
    }
    setTheme("dark");
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    document.documentElement.setAttribute("data-theme", theme);
    window.localStorage.setItem("theme", theme);
  }, [theme]);

  const handleImageNavigation = (
    projectId: string,
    direction: "prev" | "next",
    totalImages: number
  ) => {
    setCurrentImages((prev) => {
      const current = prev[projectId] || 0;
      let nextIndex;

      if (direction === "next") {
        nextIndex = (current + 1) % totalImages;
      } else {
        nextIndex = (current - 1 + totalImages) % totalImages;
      }

      return { ...prev, [projectId]: nextIndex };
    });
  };

  const handleDotNavigation = (projectId: string, index: number) => {
    setCurrentImages((prev) => ({ ...prev, [projectId]: index }));
  };

  const openModal = (images: string[], startIndex: number) => {
    setModalImages(images);
    setCurrentModalImage(startIndex);
    setModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalImages([]);
    setCurrentModalImage(0);
    document.body.style.overflow = "unset";
  };

  const [slideDirection, setSlideDirection] = useState<"left" | "right">(
    "right"
  );

  const navigateModalImage = (direction: "prev" | "next") => {
    setSlideDirection(direction === "next" ? "right" : "left");
    if (direction === "next") {
      setCurrentModalImage((prev) => (prev + 1) % modalImages.length);
    } else {
      setCurrentModalImage(
        (prev) => (prev - 1 + modalImages.length) % modalImages.length
      );
    }
  };

  const techTagConfig: Record<string, TechTagConfig> = {
    n8n: {
      className: "bg-[#EA4B71]/10 border-[#EA4B71]/40 text-[#EA4B71]",
      Icon: Workflow,
    },
    react: {
      className: "bg-[#2596be]/10 border-[#2596be]/40 text-[#2596be]",
      Icon: Code2,
    },
    "node.js": {
      className: "bg-[#2596be]/10 border-[#2596be]/40 text-[#2596be]",
      Icon: Code2,
    },
    "openai api": {
      className: "bg-black/5 border-black/20 text-black",
      Icon: Code2,
    },
    postgresql: {
      className: "bg-[#336791]/10 border-[#336791]/40 text-[#336791]",
      Icon: Package,
    },
    supabase: {
      className: "bg-[#3ECF8E]/10 border-[#3ECF8E]/40 text-emerald-700",
      Icon: Code2,
    },
    "next.js": {
      className: "bg-black/5 border-black/20 text-black",
      Icon: Code2,
    },
    docker: {
      className: "bg-[#0db7ed]/10 border-[#0db7ed]/40 text-sky-700",
      Icon: Package,
    },
    typescript: {
      className: "bg-[#3178c6]/10 border-[#3178c6]/40 text-blue-700",
      Icon: Code2,
    },
    javascript: {
      className: "bg-[#facc15]/10 border-[#facc15]/40 text-amber-700",
      Icon: Code2,
    },
    php: {
      className: "bg-[#777bb3]/10 border-[#777bb3]/40 text-indigo-700",
      Icon: Code2,
    },
    mysql: {
      className: "bg-[#00758f]/10 border-[#00758f]/40 text-sky-800",
      Icon: Package,
    },
    "whatsapp api": {
      className: "bg-[#25D366]/10 border-[#25D366]/40 text-emerald-700",
      Icon: Mail,
    },
    "c#": {
      className: "bg-[#682876]/10 border-[#682876]/40 text-purple-700",
      Icon: Code2,
    },
    vectordb: {
      className: "bg-[#6366f1]/10 border-[#6366f1]/40 text-indigo-600",
      Icon: Package,
    },
  };

  const smoothScrollTo = (targetY: number, duration = 1100) => {
    if (typeof window === "undefined") return;

    const startY = window.scrollY || window.pageYOffset;
    const distance = targetY - startY;
    const startTime = performance.now();

    const easeInOutCubic = (t: number) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    const step = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeInOutCubic(progress);

      window.scrollTo(0, startY + distance * eased);

      if (elapsed < duration) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  };

  const scrollToSection = (id: string) => {
    if (typeof window === "undefined") return;

    const element = document.getElementById(id);
    if (!element) return;

    const rect = element.getBoundingClientRect();
    const offset = -80;
    const targetY = rect.top + window.pageYOffset + offset;

    smoothScrollTo(targetY);
  };

  const scrollToTop = () => {
    if (typeof window === "undefined") return;
    smoothScrollTo(0);
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const renderThemeToggle = () => (
    <button
      onClick={toggleTheme}
      className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/70 px-3 py-1 text-xs font-medium text-gray-800 hover:bg-white/90 hover:text-gray-900 transition-colors"
    >
      {theme === "dark" ? (
        <>
          <Sun className="w-4 h-4" />
          <span>Light</span>
        </>
      ) : (
        <>
          <Moon className="w-4 h-4" />
          <span>Dark</span>
        </>
      )}
    </button>
  );

  return (
    <main className="relative">
      <div className="fixed top-4 right-4 z-[60]">{renderThemeToggle()}</div>
      <motion.div
        className="fixed top-2 left-0 w-full flex justify-center p-4 z-50"
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: showHeader ? 1 : 0, y: showHeader ? 0 : -100 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <div className="w-full max-w-4xl flex items-center justify-center gap-4">
          <div className="flex items-center gap-4">
            {[
              { type: "home" as const },
              { type: "section" as const, label: "About Me", target: "about-me" },
              { type: "section" as const, label: "Stack", target: "stack" },
              { type: "section" as const, label: "Projects", target: "projects" },
              { type: "section" as const, label: "Resume", target: "resume" },
              { type: "section" as const, label: "Contact", target: "contact" },
            ].map((item) => {
              const isHome = item.type === "home";

              const handleClick = () => {
                if (isHome) {
                  scrollToTop();
                } else if ("target" in item && item.target) {
                  scrollToSection(item.target);
                }
              };

              return (
                <LiquidGlass
                  key={isHome ? "home" : item.label}
                  cornerRadius={999}
                  padding={isHome ? "10px" : "10px 18px"}
                  blurAmount={0.6}
                  saturation={130}
                  elasticity={0.8}
                  className={
                    isHome
                      ? "cursor-pointer flex items-center justify-center text-xs md:text-sm min-h-[36px] w-9"
                      : "cursor-pointer flex items-center justify-center text-xs md:text-sm min-h-[36px]"
                  }
                  onClick={handleClick}
                >
                  {isHome ? (
                    <HomeIcon className="w-4 h-4 text-gray-800" />
                  ) : (
                    <span className="text-gray-800 font-medium tracking-wide">
                      {item.label}
                    </span>
                  )}
                </LiquidGlass>
              );
            })}
          </div>
        </div>
      </motion.div>
      <FluidBackground />

      {/* Hero Section */}
      <section className="relative z-10 w-full min-h-screen flex items-center">
        <div className="mx-auto max-w-[1700px] px-8 py-5 md:py-5 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center space-y-6">
              {/* Nome e cargo com animação */}
              <motion.div
                className="space-y-6"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
              >
                <h1 className="text-6xl md:text-8xl font-black bg-gradient-to-br from-gray-800 via-gray-600 to-gray-900 bg-clip-text text-transparent leading-tight tracking-tight drop-shadow-sm">
                  Raul Souza Silva
                </h1>
                <p className="text-lg md:text-xl text-gray-600 font-extralight tracking-widest mt-8">
                  Full Stack Developer
                </p>
              </motion.div>

              {/* Memoji com animação */}
              <motion.div
                className="flex justify-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
              >
                <Image
                  src="/memoji.png"
                  alt="Raul Memoji"
                  width={300}
                  height={300}
                  priority
                />
              </motion.div>

              {/* Tagline */}
              <motion.p
                className="text-lg md:text-xl text-gray-600 font-medium"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
              >
                I make people&apos;s live easier with software they love
              </motion.p>

              {/* Portfolio Sections */}
              <motion.div
                className="grid grid-cols-2 md:grid-cols-5 gap-6 mt-16"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.9, ease: "easeOut" }}
              >
                {[
                  {
                    icon: User,
                    label: "About Me",
                    description: "My Story",
                    color: "text-blue-400",
                    target: "about-me",
                  },
                  {
                    icon: Code2,
                    label: "Stack",
                    description: "Languages and Tools",
                    color: "text-cyan-400",
                    target: "stack",
                  },
                  {
                    icon: FolderOpen,
                    label: "Projects",
                    description: "My Work",
                    color: "text-green-400",
                    target: "projects",
                  },
                  {
                    icon: FileText,
                    label: "Resume",
                    description: "Experience",
                    color: "text-purple-400",
                    target: "resume",
                  },
                  {
                    icon: Mail,
                    label: "Contact",
                    description: "Get in Touch",
                    color: "text-orange-400",
                    target: "contact",
                  },
                ].map((item, index) => {
                  const handleClick = () => {
                    setTimeout(() => {
                      scrollToSection(item.target);
                    }, 200);
                  };

                  return (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
                    >
                      <LiquidGlass
                        cornerRadius={16}
                        padding="24px"
                        blurAmount={0.8}
                        saturation={120}
                        elasticity={0.4}
                        className="w-full h-full flex flex-col items-center justify-center text-center min-h-[120px] cursor-pointer"
                        onClick={handleClick}
                      >
                        <div className="flex flex-col items-center justify-center group">
                          <item.icon
                            className={`w-8 h-8 mb-3 ${item.color} transition-all duration-200 ease-out mx-auto group-hover:scale-110 group-hover:brightness-110`}
                          />
                          <h3 className="text-sm font-semibold text-black mb-1 transition-all duration-200 group-hover:text-black/90">
                            {item.label}
                          </h3>
                          <p className="text-xs text-gray-600 transition-all duration-200 group-hover:text-gray-700">
                            {item.description}
                          </p>
                        </div>
                      </LiquidGlass>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>
            {/* Terminal Column */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
              className="w-full lg:pl-8"
            >
              <div className="w-full h-[560px] md:h-[680px]">
                <CodeTerminal />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Me Section */}
      <section id="about-me" className="relative z-10 w-full">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            {/* Image Column */}
            <motion.div
              className="flex justify-center lg:justify-start"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              <div className="relative">
                <Image
                  src="/dev_pic_blur_bg.png"
                  alt="Raul Souza Silva - Full Stack Developer"
                  width={400}
                  height={500}
                  className="rounded-2xl shadow-2xl"
                  priority
                />
              </div>
            </motion.div>

            {/* Text Column */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              <span className="inline-flex items-center justify-center rounded-full border border-white/40 bg-white/60 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-gray-700 mb-3">
                Profile · About
              </span>
              <h2 className="text-4xl md:text-5xl font-black bg-gradient-to-br from-gray-800 via-gray-600 to-gray-900 bg-clip-text text-transparent leading-tight tracking-tight">
                About Me
              </h2>

              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p className="text-lg">
                  Full Stack Developer with over 2 years of experience building
                  scalable web applications and robust solutions. My background
                  includes working in tech companies as well as developing
                  custom freelance projects.
                </p>

                <p className="text-lg">
                  My work focuses on process optimization through automation,
                  complex API integrations, and the development of SaaS/SaaP
                  systems. I leverage technologies like TypeScript, React,
                  Next.js, and Laravel to create secure, high-performance
                  solutions, always prioritizing the user experience.
                </p>

                <p className="text-lg">
                  My unique background as an educator allows me to translate
                  complex technical requirements into clear, objective language,
                  facilitating effective communication and collaboration between
                  technical and non-technical teams.
                </p>

                <div className="mt-8">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">
                    Core Competencies:
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      Building end-to-end web applications with a focus on
                      performance and usability.
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      Complex integrations between financial system APIs,
                      databases, and automation platforms (n8n).
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      Technical leadership, including backlog management, task
                      delegation, and alignment with stakeholders.
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-orange-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      Developing intelligent systems with applied AI for process
                      automation.
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stack Section */}
      <section id="stack" className="relative z-10 w-full">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <span className="inline-flex items-center justify-center rounded-full border border-white/40 bg-white/60 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-gray-700 mb-3">
              Skills · Techs
            </span>
            <h2 className="text-4xl md:text-5xl font-black bg-gradient-to-br from-gray-800 via-gray-600 to-gray-900 bg-clip-text text-transparent leading-tight tracking-tight mb-4">
              Stack
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Languages and Tools I use to build amazing applications
            </p>
          </motion.div>

          {/* Backend Stack */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Backend
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                {
                  name: "Node.js",
                  icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg",
                },
                {
                  name: "PHP",
                  icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/php/php-original.svg",
                },
                {
                  name: "Laravel",
                  icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/laravel/laravel-original.svg",
                },
                { name: "REST APIs", icon: Package },
                {
                  name: "SQL",
                  icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original.svg",
                },
                { name: "n8n", icon: Workflow },
                {
                  name: "C#",
                  icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/csharp/csharp-original.svg",
                },
                {
                  name: ".NET",
                  icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/dot-net/dot-net-original.svg",
                },
              ].map((tech, index) => (
                <motion.div
                  key={tech.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <LiquidGlass
                    cornerRadius={12}
                    padding="16px"
                    blurAmount={0.6}
                    saturation={110}
                    elasticity={0.9}
                    className="w-full h-full flex flex-col items-center justify-center text-center min-h-[80px] p-2"
                  >
                    <div className="flex items-center justify-center w-8 h-8 mb-2">
                      {typeof tech.icon === "string" ? (
                        <Image
                          src={tech.icon}
                          alt={tech.name}
                          width={32}
                          height={32}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="w-6 h-6 text-gray-600">
                          {React.createElement(
                            tech.icon as React.ComponentType<{
                              className: string;
                            }>,
                            { className: "w-full h-full" }
                          )}
                        </div>
                      )}
                    </div>
                    <span className="text-sm font-medium text-black">
                      {tech.name}
                    </span>
                  </LiquidGlass>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Frontend Stack */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Frontend
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                {
                  name: "TypeScript",
                  icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg",
                },
                {
                  name: "React",
                  icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg",
                },
                {
                  name: "Next.js",
                  icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg",
                },
                {
                  name: "HTML",
                  icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original-wordmark.svg",
                },
                {
                  name: "CSS",
                  icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original-wordmark.svg",
                },
                {
                  name: "JavaScript",
                  icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg",
                },
                {
                  name: "Tailwind",
                  icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg",
                },
                { name: "UI/UX", icon: Monitor },
              ].map((tech, index) => (
                <motion.div
                  key={tech.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <LiquidGlass
                    cornerRadius={12}
                    padding="16px"
                    blurAmount={0.6}
                    saturation={110}
                    elasticity={0.9}
                    className="w-full h-full flex flex-col items-center justify-center text-center min-h-[80px] p-2"
                  >
                    <div className="flex items-center justify-center w-8 h-8 mb-2">
                      {typeof tech.icon === "string" ? (
                        <Image
                          src={tech.icon}
                          alt={tech.name}
                          width={32}
                          height={32}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="w-6 h-6 text-gray-600">
                          {React.createElement(
                            tech.icon as React.ComponentType<{
                              className: string;
                            }>,
                            { className: "w-full h-full" }
                          )}
                        </div>
                      )}
                    </div>
                    <span className="text-sm font-medium text-black">
                      {tech.name}
                    </span>
                  </LiquidGlass>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Other Tools */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Other Tools
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                {
                  name: "Git",
                  icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg",
                },
                {
                  name: "Jira",
                  icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/jira/jira-original.svg",
                },
                {
                  name: "Docker",
                  icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-plain.svg",
                },
                {
                  name: "Railway",
                  icon: "https://railway.com/brand/logo-dark.svg",
                },
                {
                  name: "Vercel",
                  icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vercel/vercel-original.svg",
                },
                {
                  name: "OpenAI API",
                  icon: "https://www.svgrepo.com/show/306500/openai.svg",
                },
                {
                  name: "Redis",
                  icon: "https://www.svgrepo.com/show/303460/redis-logo.svg",
                },
              ].map((tech, index) => (
                <motion.div
                  key={tech.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <LiquidGlass
                    cornerRadius={12}
                    padding="16px"
                    blurAmount={0.6}
                    saturation={110}
                    elasticity={0.9}
                    className="w-full h-full flex flex-col items-center justify-center text-center min-h-[80px]"
                  >
                    <div className="flex items-center justify-center w-8 h-8 mb-2">
                      {typeof tech.icon === "string" ? (
                        <Image
                          src={tech.icon}
                          alt={tech.name}
                          width={32}
                          height={32}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="w-6 h-6 text-gray-600">
                          {React.createElement(
                            tech.icon as React.ComponentType<{
                              className: string;
                            }>,
                            { className: "w-full h-full" }
                          )}
                        </div>
                      )}
                    </div>
                    <span className="text-sm font-medium text-black">
                      {tech.name}
                    </span>
                  </LiquidGlass>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="relative z-10 w-full py-32">
        <div className="max-w-[1400px] mx-auto px-6">
          <motion.div
            className="text-center mb-24"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <span className="inline-flex items-center justify-center rounded-full border border-white/40 bg-white/60 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-gray-700 mb-4">
              Case Studies · Projects
            </span>
            <h2 className="text-5xl md:text-7xl font-black bg-gradient-to-br from-gray-800 via-gray-600 to-gray-900 bg-clip-text text-transparent leading-tight tracking-tight mb-4">
              Selected Work
            </h2>
            <p className="text-xl md:text-2xl text-gray-500 max-w-3xl mx-auto font-light">
              A collection of projects that showcase my passion for building
              digital experiences.
            </p>
          </motion.div>

          <div className="relative">
            <div className="absolute inset-0 rounded-[3rem]" />
            <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 p-6 md:p-10 lg:p-12">
              {allProjects.map((project, idx) => {
                const isGithubCard = idx === allProjects.length - 1;
                const currentIndex = currentImages[project.title] || 0;

                if (isGithubCard) {
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 40 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.7, delay: idx * 0.1 }}
                      viewport={{ once: true }}
                      className="h-full"
                    >
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group block h-full min-h-[480px] relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-gray-950 via-slate-900 to-black shadow-[0_24px_80px_rgba(15,23,42,0.65)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_90px_rgba(15,23,42,0.9)]"
                      >
                        <div className="absolute inset-0 opacity-30 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 via-sky-500/10 to-purple-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        <div className="relative z-10 h-full flex flex-col items-center justify-center p-10 md:p-12 text-center">
                          <div className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center mb-8 group-hover:bg-white/20 transition-all duration-500">
                            <Github className="w-12 h-12 text-white" />
                          </div>
                          <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            View More on GitHub
                          </h3>
                          <p className="text-gray-400 text-lg max-w-xl">
                            Explore my repositories, contributions and
                            experiments.
                          </p>

                          <div className="mt-8 flex items-center gap-2 text-white font-medium">
                            <span>Visit Profile</span>
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </a>
                    </motion.div>
                  );
                }

                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: idx * 0.1 }}
                    viewport={{ once: true }}
                    className={`group relative h-full ${
                      idx % 2 === 1 ? "lg:mt-16" : ""
                    }`}
                  >
                    <div className="relative h-full rounded-[2.5rem] overflow-hidden border border-white/20 bg-white/5 backdrop-blur-xl shadow-[0_18px_60px_rgba(15,23,42,0.18)] transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-[0_24px_80px_rgba(15,23,42,0.35)]">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/20 to-transparent opacity-70 pointer-events-none" />
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="relative flex flex-col h-full">
                        {/* Image Area */}
                        <div
                          className="relative w-full h-[340px] md:h-[380px] overflow-hidden bg-gray-100/60 cursor-pointer"
                          onClick={() =>
                            openModal(project.images, currentIndex)
                          }
                        >
                          {project.images[0] ? (
                            project.images.map((image, imgIdx) => (
                              <motion.div
                                key={imgIdx}
                                className="absolute inset-0"
                                initial={{ opacity: 0, scale: 1.02 }}
                                animate={{
                                  opacity: currentIndex === imgIdx ? 1 : 0,
                                  scale: currentIndex === imgIdx ? 1 : 1.02,
                                }}
                                transition={{ duration: 0.6, ease: "easeOut" }}
                              >
                                <Image
                                  src={`/${image}`}
                                  alt={project.title}
                                  fill
                                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                              </motion.div>
                            ))
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                              <Package className="w-16 h-16" />
                            </div>
                          )}

                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-slate-900/20 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-500" />

                          {project.images.length > 1 && (
                            <div className="absolute bottom-5 left-6 right-6 flex items-center justify-between gap-4">
                              <div className="flex items-center gap-2">
                                {project.images.map((_, dotIdx) => (
                                  <button
                                    key={dotIdx}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDotNavigation(
                                        project.title,
                                        dotIdx
                                      );
                                    }}
                                    className={`h-1.5 rounded-full transition-all duration-300 ${
                                      currentIndex === dotIdx
                                        ? "w-6 bg-white"
                                        : "w-2 bg-white/40 hover:bg-white/70"
                                    }`}
                                    aria-label={`Go to image ${dotIdx + 1}`}
                                  />
                                ))}
                              </div>

                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openModal(project.images, currentIndex);
                                }}
                                className="inline-flex items-center gap-2 rounded-full bg-white/85 px-4 py-2 text-xs font-semibold text-gray-900 shadow-md backdrop-blur-md hover:bg-white transition-colors"
                              >
                                <Monitor className="w-4 h-4" />
                                View Full Gallery
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Content Area */}
                        <div className="flex flex-col flex-grow p-8 md:p-10">
                          <div className="mb-6">
                            <div className="mb-4 flex items-center justify-between text-[11px] font-medium uppercase tracking-[0.25em] text-gray-500">
                              <span className="inline-flex items-center gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                                {project.github
                                  ? "Open Source"
                                  : "Client Project"}
                              </span>
                              <span className="text-gray-400">
                                Case {String(idx + 1).padStart(2, "0")}
                              </span>
                            </div>
                            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight mb-2">
                              {project.title}
                            </h3>
                            <p className="text-sm md:text-base font-medium text-blue-600/80">
                              {project.subtitle}
                            </p>
                          </div>

                          <p className="text-gray-600 leading-relaxed text-base md:text-lg mb-8 flex-grow font-light">
                            {project.description}
                          </p>

                          {Array.isArray(project.tech_tags) &&
                            project.tech_tags.length > 0 && (
                              <div className="mb-8 flex flex-wrap gap-2">
                                {project.tech_tags.map(
                                  (tag: string, tagIdx: number) => {
                                    const normalized = tag.toLowerCase();
                                    const config = techTagConfig[normalized];
                                    const Icon = config?.Icon;
                                    const baseClass =
                                      "tech-tag inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold shadow-sm backdrop-blur-sm";
                                    const className = config
                                      ? `${baseClass} ${config.className}`
                                      : `${baseClass} border-white/40 bg-white/80 text-gray-800`;

                                    return (
                                      <span
                                        key={`${project.title}-tag-${tagIdx}`}
                                        className={className}
                                      >
                                        {Icon && (
                                          <Icon className="w-3.5 h-3.5" />
                                        )}
                                        {tag}
                                      </span>
                                    );
                                  }
                                )}
                              </div>
                            )}

                          <div className="flex flex-wrap items-center gap-4 pt-6 border-t border-white/20 mt-auto">
                            {project.link && (
                              <a
                                href={project.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-full font-medium transition-all hover:bg-gray-800 hover:shadow-lg hover:-translate-y-0.5"
                              >
                                <span>Visit Site</span>
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            )}
                            {project.github && (
                              <a
                                href={project.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center w-12 h-12 rounded-full border border-gray-600/30 text-gray-600 hover:text-gray-900 hover:border-gray-400 hover:bg-white/70 transition-all"
                                title="View Code"
                              >
                                <Github className="w-5 h-5" />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Image Modal */}
      {modalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={closeModal}
        >
          <div className="relative w-full h-full flex items-center justify-center p-4">
            {/* Close Button */}
            <motion.button
              initial={{ opacity: 0, scale: 0.8, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              onClick={closeModal}
              className="absolute top-4 right-4 z-50 p-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white hover:bg-white/20 transition-all duration-300 z-10"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </motion.button>

            {/* Navigation Buttons */}
            {modalImages.length > 1 && (
              <>
                <motion.button
                  initial={{ opacity: 0, scale: 0.8, x: -50 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateModalImage("prev");
                  }}
                  className="absolute left-4 z-50 p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white hover:bg-white/20 transition-all duration-300"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </motion.button>
                <motion.button
                  initial={{ opacity: 0, scale: 0.8, x: 50 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateModalImage("next");
                  }}
                  className="absolute right-4 z-50 p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white hover:bg-white/20 transition-all duration-300"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </motion.button>
              </>
            )}

            {/* Image Display */}
            <div
              className="relative max-w-7xl max-h-[90vh] flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <AnimatePresence mode="wait" custom={slideDirection}>
                <motion.div
                  key={currentModalImage}
                  custom={slideDirection}
                  initial={{
                    opacity: 0,
                    x: slideDirection === "right" ? 100 : -100,
                    scale: 0.9,
                  }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{
                    opacity: 0,
                    x: slideDirection === "right" ? -100 : 100,
                    scale: 0.9,
                  }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="relative"
                >
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                  >
                    <Image
                      src={`/${modalImages[currentModalImage]}`}
                      alt="Enlarged project image"
                      width={1920}
                      height={1080}
                      className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
                      priority
                    />
                  </motion.div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Image Counter */}
            {modalImages.length > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.4 }}
                className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm"
              >
                {currentModalImage + 1} / {modalImages.length}
              </motion.div>
            )}
          </div>
        </motion.div>
      )}

      {/* Resume Section */}
      <section id="resume" className="relative z-10 w-full">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <span className="inline-flex items-center justify-center rounded-full border border-white/40 bg-white/60 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-gray-700 mb-3">
              Experience · CV
            </span>
            <h2 className="text-4xl md:text-5xl font-black bg-gradient-to-br from-gray-800 via-gray-600 to-gray-900 bg-clip-text text-transparent leading-tight tracking-tight mb-4">
              Resume
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              View my detailed professional profile and experience <br></br>
              (Last update: September 2025, check LinkedIn for more details)
            </p>
          </motion.div>

          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <div className="w-full h-[800px] rounded-lg overflow-hidden">
              <iframe
                src="/raul_resume_en.pdf#toolbar=1&navpanes=1&scrollbar=1"
                className="w-full h-full border-0"
                title="Raul Resume"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="relative z-10 w-full">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <span className="inline-flex items-center justify-center rounded-full border border-white/40 bg-white/60 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-gray-700 mb-3">
              Connect · Contact
            </span>
            <h2 className="text-4xl md:text-5xl font-black bg-gradient-to-br from-gray-800 via-gray-600 to-gray-900 bg-clip-text text-transparent leading-tight tracking-tight mb-4">
              Keep in touch
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Let&apos;s connect and create something amazing together
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Contact Links */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="space-y-4">
                <a
                  href="https://linkedin.com/in/lilrau"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <LiquidGlass
                    cornerRadius={12}
                    padding="16px"
                    blurAmount={0.6}
                    saturation={110}
                    elasticity={0.9}
                    className="w-full"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 flex items-center justify-center bg-blue-500 rounded-full text-white flex-shrink-0">
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-800">
                          LinkedIn
                        </h3>
                        <p className="text-gray-600">linkedin.com/in/lilrau</p>
                      </div>
                    </div>
                  </LiquidGlass>
                </a>

                <a href="mailto:raulsscoc@hotmail.com" className="block">
                  <LiquidGlass
                    cornerRadius={12}
                    padding="16px"
                    blurAmount={0.6}
                    saturation={110}
                    elasticity={0.9}
                    className="w-full"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 flex items-center justify-center bg-blue-400 rounded-full text-white flex-shrink-0">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-800">
                          Email
                        </h3>
                        <p className="text-gray-600">raulsscoc@hotmail.com</p>
                      </div>
                    </div>
                  </LiquidGlass>
                </a>

                <a
                  href="https://discordapp.com/users/246318073815105547"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <LiquidGlass
                    cornerRadius={12}
                    padding="16px"
                    blurAmount={0.6}
                    saturation={110}
                    elasticity={0.9}
                    className="w-full"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 flex items-center justify-center bg-indigo-500 rounded-full text-white flex-shrink-0">
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-800">
                          Discord
                        </h3>
                        <p className="text-gray-600">@r.bxd</p>
                      </div>
                    </div>
                  </LiquidGlass>
                </a>
              </div>
            </motion.div>

            {/* iPhone Mockup */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              viewport={{ once: true }}
              className="flex justify-center md:justify-end"
            >
              <Image
                src="/iPhone Call Mockup.png"
                alt="iPhone Call Mockup"
                width={450}
                height={600}
              />
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
}
