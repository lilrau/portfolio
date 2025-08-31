"use client";

import FluidBackground from "../components/fluid";
import LiquidGlass from "../components/LiquidGlass";
import Image from "next/image";
import { motion } from "framer-motion";
import { User, FolderOpen, FileText, Mail, Code2, Server, Monitor, Package, Database, Workflow, Cog, Globe, Type, Atom, FileCode, Palette, GitBranch, Bug, Ship, Cloud, Brain } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Home() {
  const [showHeader, setShowHeader] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Mostra o header quando rolar mais que 100vh (altura da hero)
      setShowHeader(window.scrollY > window.innerHeight * 0.9);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <main className="relative">
      <motion.div 
        className="fixed top-0 left-0 w-full flex justify-center gap-4 p-4 z-50"
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
      <section className="relative z-10 w-full min-h-screen flex items-center justify-center">
        <div className="text-center space-y-6 max-w-4xl mx-auto px-6 py-5 md:py-5">
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
                } if (item.label === 'Stack') {
                  setTimeout(() => {
                    document.getElementById('stack')?.scrollIntoView({
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
                    elasticity={0.3}
                    className="w-full h-full flex flex-col items-center justify-center text-center min-h-[80px] p-2"
                  >
                    <div className="flex items-center justify-center w-8 h-8 mb-2">
                      {typeof tech.icon === 'string' ? (
                        <img src={tech.icon} alt={tech.name} className="w-full h-full object-contain" />
                      ) : (
                        <tech.icon className="w-6 h-6 text-gray-600" />
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
                    elasticity={0.3}
                    className="w-full h-full flex flex-col items-center justify-center text-center min-h-[80px] p-2"
                  >
                    <div className="flex items-center justify-center w-8 h-8 mb-2">
                      {typeof tech.icon === 'string' ? (
                        <img src={tech.icon} alt={tech.name} className="w-full h-full object-contain" />
                      ) : (
                        <tech.icon className="w-6 h-6 text-gray-600" />
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
                    elasticity={0.3}
                    className="w-full h-full flex flex-col items-center justify-center text-center min-h-[80px]"
                  >
                    {typeof tech.icon === 'string' ? (
                      <img src={tech.icon} alt={tech.name} className="w-8 h-8 mb-2 object-contain" />
                    ) : (
                      <tech.icon className="w-6 h-6 mb-2 text-gray-600" />
                    )}
                    <span className="text-sm font-medium text-black">{tech.name}</span>
                  </LiquidGlass>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
