"use client";

import FluidBackground from "../components/fluid";
import LiquidGlass from "../components/LiquidGlass";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { User, FolderOpen, FileText, Mail, Code2,  Monitor, Package, Workflow, Github } from 'lucide-react';
import { useState, useEffect } from 'react';
import React from 'react';
import projectsData from "../data/projects.json";
import { CodeTerminal } from "../components/CodeTerminal";

// Add this mock project after importing projectsData
const allProjects = [
  ...projectsData,
  {
    title: "You can also check other stuff on my github",
    subtitle: "Click this card",
    description: "",
    images: [""], // No image, but keeps the design
    link: "https://github.com/lilrau",
    github: null
  }
];

export default function Home() {
  const [showHeader, setShowHeader] = useState(false);
  const [currentImages, setCurrentImages] = useState<{ [key: string]: number }>({});
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImages, setModalImages] = useState<string[]>([]);
  const [currentModalImage, setCurrentModalImage] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      // Mostra o header quando rolar mais que 100vh (altura da hero)
      setShowHeader(window.scrollY > window.innerHeight * 0.9);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleImageNavigation = (projectId: string, direction: 'prev' | 'next', totalImages: number) => {
    setCurrentImages(prev => {
      const current = prev[projectId] || 0;
      let nextIndex;
      
      if (direction === 'next') {
        nextIndex = (current + 1) % totalImages;
      } else {
        nextIndex = (current - 1 + totalImages) % totalImages;
      }
      
      return { ...prev, [projectId]: nextIndex };
    });
  };

  const handleDotNavigation = (projectId: string, index: number) => {
    setCurrentImages(prev => ({ ...prev, [projectId]: index }));
  };

  const openModal = (images: string[], startIndex: number) => {
    setModalImages(images);
    setCurrentModalImage(startIndex);
    setModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalImages([]);
    setCurrentModalImage(0);
    document.body.style.overflow = 'unset';
  };

  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('right');

  const navigateModalImage = (direction: 'prev' | 'next') => {
    setSlideDirection(direction === 'next' ? 'right' : 'left');
    if (direction === 'next') {
      setCurrentModalImage((prev) => (prev + 1) % modalImages.length);
    } else {
      setCurrentModalImage((prev) => (prev - 1 + modalImages.length) % modalImages.length);
    }
  };

  return (
    <main className="relative">
      <motion.div 
        className="fixed top-2 left-0 w-full flex justify-center gap-4 p-4 z-50"
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: showHeader ? 1 : 0, y: showHeader ? 0 : -100 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        {[
          { label: 'About Me', target: 'about-me' },
          { label: 'Stack', target: 'stack' },
          { label: 'Projects', target: 'projects' },
          { label: 'Resume', target: 'resume' },
          { label: 'Contact', target: 'contact' }
        ].map((item) => (
          <button
            key={item.label}
            onClick={() => document.getElementById(item.target)?.scrollIntoView({ behavior: 'smooth' })}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-black transition-colors bg-white/10 backdrop-blur-sm rounded-lg"
          >
            {item.label}
          </button>
        ))}
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
              { icon: User, label: 'About Me', description: 'My Story', color: 'text-blue-400' },
              { icon: Code2, label: 'Stack', description: 'Languages and Tools', color: 'text-cyan-400' },
              { icon: FolderOpen, label: 'Projects', description: 'My Work', color: 'text-green-400' },
              { icon: FileText, label: 'Resume', description: 'Experience', color: 'text-purple-400' },
              { icon: Mail, label: 'Contact', description: 'Get in Touch', color: 'text-orange-400' }
            ].map((item, index) => {
              const handleClick = () => {
                if (item.label === 'About Me') {
                  setTimeout(() => {
                    document.getElementById('about-me')?.scrollIntoView({
                      behavior: 'smooth',
                      block: 'start'
                    });
                  }, 200);
                } else if (item.label === 'Stack') {
                  setTimeout(() => {
                    document.getElementById('stack')?.scrollIntoView({
                      behavior: 'smooth',
                      block: 'start'
                    });
                  }, 200);
                } else if (item.label === 'Projects') {
                  setTimeout(() => {
                    document.getElementById('projects')?.scrollIntoView({
                      behavior: 'smooth',
                      block: 'start'
                    });
                  }, 200);
                } else if (item.label === 'Resume') {
                  setTimeout(() => {
                    document.getElementById('resume')?.scrollIntoView({
                      behavior: 'smooth',
                      block: 'start'
                    });
                  }, 200);
                } else if (item.label === 'Contact') {
                  setTimeout(() => {
                    document.getElementById('contact')?.scrollIntoView({
                      behavior: 'smooth',
                      block: 'start'
                    });
                  }, 200);
                }
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
                      <item.icon className={`w-8 h-8 mb-3 ${item.color} transition-all duration-200 ease-out mx-auto group-hover:scale-110 group-hover:brightness-110`} />
                      <h3 className="text-sm font-semibold text-black mb-1 transition-all duration-200 group-hover:text-black/90">{item.label}</h3>
                      <p className="text-xs text-black/70 transition-all duration-200 group-hover:text-black/80">{item.description}</p>
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
              <h2 className="text-4xl md:text-5xl font-black bg-gradient-to-br from-gray-800 via-gray-600 to-gray-900 bg-clip-text text-transparent leading-tight tracking-tight">
                About Me
              </h2>
              
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p className="text-lg">
                  Full Stack Developer with over 2 years of experience building scalable web applications and robust solutions. My background includes working in tech companies as well as developing custom freelance projects.
                </p>
                
                <p className="text-lg">
                  My work focuses on process optimization through automation, complex API integrations, and the development of SaaS/SaaP systems. I leverage technologies like TypeScript, React, Next.js, and Laravel to create secure, high-performance solutions, always prioritizing the user experience.
                </p>
                
                <p className="text-lg">
                  My unique background as an educator allows me to translate complex technical requirements into clear, objective language, facilitating effective communication and collaboration between technical and non-technical teams.
                </p>
                
                <div className="mt-8">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Core Competencies:</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      Building end-to-end web applications with a focus on performance and usability.
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      Complex integrations between financial system APIs, databases, and automation platforms (n8n).
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      Technical leadership, including backlog management, task delegation, and alignment with stakeholders.
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-orange-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      Developing intelligent systems with applied AI for process automation.
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
            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Backend</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: 'Node.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg' },
                { name: 'PHP', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/php/php-original.svg' },
                { name: 'Laravel', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/laravel/laravel-original.svg' },
                { name: 'REST APIs', icon: Package },
                { name: 'SQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original.svg' },
                { name: 'n8n', icon: Workflow },
                { name: 'C#', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/csharp/csharp-original.svg' },
                { name: '.NET', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/dot-net/dot-net-original.svg' }
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
                      {typeof tech.icon === 'string' ? (
                        <Image src={tech.icon} alt={tech.name} width={32} height={32} className="w-full h-full object-contain" />
                      ) : (
                        <div className="w-6 h-6 text-gray-600">
                          {React.createElement(tech.icon as React.ComponentType<{ className: string }>, { className: "w-full h-full" })}
                        </div>
                      )}
                    </div>
                    <span className="text-sm font-medium text-black">{tech.name}</span>
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
            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Frontend</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: 'TypeScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg' },
                { name: 'React', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg' },
                { name: 'Next.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg' },
                { name: 'HTML', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original-wordmark.svg' },
                { name: 'CSS', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original-wordmark.svg' },
                { name: 'JavaScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg' },
                { name: 'Tailwind', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg' },
                { name: 'UI/UX', icon: Monitor }
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
                      {typeof tech.icon === 'string' ? (
                        <Image src={tech.icon} alt={tech.name} width={32} height={32} className="w-full h-full object-contain" />
                      ) : (
                        <div className="w-6 h-6 text-gray-600">
                          {React.createElement(tech.icon as React.ComponentType<{ className: string }>, { className: "w-full h-full" })}
                        </div>
                      )}
                    </div>
                    <span className="text-sm font-medium text-black">{tech.name}</span>
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
            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Other Tools</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: 'Git', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg' },
                { name: 'Jira', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/jira/jira-original.svg' },
                { name: 'Docker', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-plain.svg' },
                { name: 'Railway', icon: 'https://railway.com/brand/logo-dark.svg' },
                { name: 'Vercel', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vercel/vercel-original.svg' },
                { name: 'OpenAI API', icon: 'https://www.svgrepo.com/show/306500/openai.svg' },
                { name: 'Redis', icon: 'https://www.svgrepo.com/show/303460/redis-logo.svg' }
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
                      {typeof tech.icon === 'string' ? (
                        <Image src={tech.icon} alt={tech.name} width={32} height={32} className="w-full h-full object-contain" />
                      ) : (
                        <div className="w-6 h-6 text-gray-600">
                          {React.createElement(tech.icon as React.ComponentType<{ className: string }>, { className: "w-full h-full" })}
                        </div>
                      )}
                    </div>
                    <span className="text-sm font-medium text-black">{tech.name}</span>
                  </LiquidGlass>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

       {/* Projects Section */}
       <section id="projects" className="relative z-10 w-full">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-black bg-gradient-to-br from-gray-800 via-gray-600 to-gray-900 bg-clip-text text-transparent leading-tight tracking-tight mb-4">
              Projects
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Here are some of the projects I&apos;ve worked on
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {allProjects.map((project, idx) => {
              const isGithubCard = idx === allProjects.length - 1;
              const projectId = `project-${idx}`;
              return (
                <motion.div
                  key={project.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                >
                  {isGithubCard ? (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block h-full w-full"
                    >
                      <LiquidGlass
                        cornerRadius={18}
                        padding="24px"
                        blurAmount={0.8}
                        saturation={120}
                        elasticity={0.4}
                        className="w-full h-full flex flex-col items-center justify-center text-center min-h-[320px] cursor-pointer group"
                      >
                        <div className="flex flex-col items-center justify-center mb-4">
                          <Github className="w-16 h-16 text-black/70 group-hover:text-black transition-all duration-200 mb-2" />
                        </div>
                        <h3 className="text-xl font-bold text-black mb-2">{project.title}</h3>
                        <p className="text-sm font-medium text-gray-600">{project.subtitle}</p>
                      </LiquidGlass>
                    </a>
                  ) : (
                    <LiquidGlass
                      cornerRadius={16}
                      padding="24px"
                      blurAmount={0.8}
                      saturation={120}
                      elasticity={0.4}
                      className="w-full h-full"
                    >
                      <div className="space-y-4">
                        {/* Project Images Carousel */}
                        <div className="relative">
                          <div className="relative w-full aspect-[16/9] max-h-80 overflow-hidden rounded-lg">
                            {project.images[0] ? (
                              project.images.map((image, idx2) => (
                                <motion.div
                                  key={idx2}
                                  className="absolute inset-0"
                                  initial={{ opacity: 0 }}
                                  animate={{
                                    opacity: (currentImages[project.title] || 0) === idx2 ? 1 : 0
                                  }}
                                  transition={{ duration: 0.5 }}
                                >
                                  <div
                                    className="relative w-full h-full cursor-pointer group"
                                    onClick={() => openModal(project.images, idx2)}
                                  >
                                    <Image
                                      src={`/${image}`}
                                      alt={`${project.title} ${idx2 + 1}`}
                                      fill
                                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    />
                                  </div>
                                </motion.div>
                              ))
                            ) : (
                              // Placeholder for the mock project (no image)
                              <div className="flex items-center justify-center w-full h-full min-h-[180px] text-gray-400 text-lg">
                                <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 18l-4-4-4 4m8-6l-4-4-4 4" />
                                </svg>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Project Info */}
                        <div className="space-y-2">
                          <h3 className="text-xl font-bold text-gray-800">{project.title}</h3>
                          {project.subtitle && (
                            <p className="text-sm font-medium text-gray-600">{project.subtitle}</p>
                          )}
                          {project.description && (
                            <p className="text-sm text-gray-700 leading-relaxed">{project.description}</p>
                          )}
                        </div>

                        {/* Project Links */}
                        <div className="flex gap-4 pt-2">
                          {project.link && (
                            <a
                              href={project.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors"
                            >
                              Access
                            </a>
                          )}
                          {project.github && (
                            <a
                              href={project.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-4 py-2 bg-gray-800 text-white text-sm font-medium rounded-lg hover:bg-gray-900 transition-colors"
                            >
                              GitHub
                            </a>
                          )}
                        </div>
                      </div>
                    </LiquidGlass>
                  )}
                </motion.div>
              );
            })}
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
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
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
                    navigateModalImage('prev');
                  }}
                  className="absolute left-4 z-50 p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white hover:bg-white/20 transition-all duration-300"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </motion.button>
                <motion.button
                  initial={{ opacity: 0, scale: 0.8, x: 50 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateModalImage('next');
                  }}
                  className="absolute right-4 z-50 p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white hover:bg-white/20 transition-all duration-300"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
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
                  initial={{ opacity: 0, x: slideDirection === 'right' ? 100 : -100, scale: 0.9 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: slideDirection === 'right' ? -100 : 100, scale: 0.9 }}
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
            <h2 className="text-4xl md:text-5xl font-black bg-gradient-to-br from-gray-800 via-gray-600 to-gray-900 bg-clip-text text-transparent leading-tight tracking-tight mb-4">
              Contact
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
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-800">LinkedIn</h3>
                        <p className="text-gray-600">linkedin.com/in/lilrau</p>
                      </div>
                    </div>
                  </LiquidGlass>
                </a>

                <a 
                  href="mailto:raulsscoc@hotmail.com" 
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
                      <div className="w-10 h-10 flex items-center justify-center bg-blue-400 rounded-full text-white flex-shrink-0">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-800">Email</h3>
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
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/></svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-800">Discord</h3>
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