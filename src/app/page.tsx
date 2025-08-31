"use client";

import FluidBackground from "../components/fluid";
import LiquidGlass from "../components/LiquidGlass";
import Image from "next/image";
import { motion } from "framer-motion";
import { User, FolderOpen, FileText, Mail, Code2 } from 'lucide-react';

export default function Home() {
  return (
    <main className="relative">
      <FluidBackground />

      {/* Hero Section */}
      <section className="relative z-10 w-full min-h-screen flex items-center justify-center">
        <div className="text-center space-y-12 max-w-4xl mx-auto px-6 py-20 md:py-28">
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
                  alt="Raul Santos - Full Stack Developer"
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
    </main>
  );
}
