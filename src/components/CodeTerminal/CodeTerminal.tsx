"use client";

import React, { useState, useEffect } from "react";
import { Flex } from "../Flex";
import { Text } from "../Text";
import styles from "./CodeTerminal.module.scss";

const CodeTerminal: React.FC = () => {
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const codeContentRef = React.useRef<HTMLDivElement>(null);

  const renderCodeLine = (line: string, lineNumber: number) => {
    let processedLine = line
      .replace(/"([^"]*)"/g, '<span class="string">"$1"</span>')
      .replace(/\b(interface|async|function|const|await|return|export|class|extends|implements|import|from|type|enum)\b(?![^<]*>)/g, '<span class="keyword">$1</span>')
      .replace(/\b(SeniorDeveloper|SeniorEngineer|TechStack|CloudArchitect|string|boolean|number)\b(?![^<]*>)/g, '<span class="type">$1</span>')
      .replace(/(\w+)(?=\s*:)(?![^<]*>)/g, '<span class="property">$1</span>')
      .replace(/\b(true|false)\b(?![^<]*>)/g, '<span class="boolean">$1</span>')
      .replace(/(\w+)(?=\()(?![^<]*>)/g, '<span class="function">$1</span>')
      .replace(/(\/\/.*$)/g, '<span class="comment">$1</span>')
      .replace(/\b(\d+)\b(?![^<]*<\/span>)/g, '<span class="number">$1</span>');

    return processedLine;
  };

  const fullCode = [
    "interface SeniorDeveloper {",
    '  name: "Raul Souza Silva";',
    '  role: "Full-Stack Developer";',
    '  company: ["Lugenius", "MoonRock Labs"];',
    '  location: "Paraná, Brazil";',
    '  experience: "2+ years";',
    "}",
    "",
    "class TechStack {",
    "  frontend = {",
    '    frameworks: ["React", "Next.js", "TypeScript"],',
    '    styling: ["CSS", "Tailwind"],',
    "  };",
    "",
    "  backend = {",
    '    languages: ["Node.js", "PHP", "TypeScript"],',
    '    frameworks: ["Express.js", "Laravel"],',
    '    databases: ["PostgreSQL", "MySQL", "Redis", "Vector DBs"]',
    "  };",
    "",
    "  tools = {",
    '    other: ["Docker", "Git", "GitHub", "Jira", "Railway", "Vercel", "Linux"]',
    "  };",
    "",
    "  emerging = {",
    '    ai: ["n8n", "OpenAI API", "Google AI Studio", "Retell AI"],',
    '    realtime: ["Socket.io", "WebSocket"]',
    "  };",
    "}",
    "",
    "export const raulSouzaSilva: Engineer = {",
    "  passionate: true,",
    '  expertise: "AI automation, complex API integrations & the development of SaaS/SaaP systems",',
    '  certifications: ["Systems Analyst and Developer @ UTFPR", "English Certificate C1 Advanced @ EF SET"]',
    "};"
  ];

  useEffect(() => {
    if (!isTyping) return;

    const timer = setTimeout(() => {
      if (currentLineIndex < fullCode.length) {
        const currentLine = fullCode[currentLineIndex];

        if (currentCharIndex < currentLine.length) {
          // Typing current line
          const partialLine = currentLine.substring(0, currentCharIndex + 1);
          setDisplayedLines(prev => {
            const newLines = [...prev];
            newLines[currentLineIndex] = partialLine;
            return newLines;
          });
          setCurrentCharIndex(prev => prev + 1);
        } else {
          // Line complete, move to next line
          setCurrentLineIndex(prev => prev + 1);
          setCurrentCharIndex(0);
          if (currentLineIndex + 1 < fullCode.length) {
            setDisplayedLines(prev => [...prev, ""]);
          }
          // Auto scroll to bottom when line is complete
          setTimeout(() => {
            if (codeContentRef.current) {
              codeContentRef.current.scrollTop = codeContentRef.current.scrollHeight;
            }
          }, 10);
        }
      } else {
        // Typing complete
        setIsTyping(false);
      }
    }, Math.random() * 30 + 20); // Random speed between 20-50ms for realistic typing

    return () => clearTimeout(timer);
  }, [currentCharIndex, currentLineIndex, isTyping, fullCode]);

  // Initialize first line
  useEffect(() => {
    if (displayedLines.length === 0) {
      setDisplayedLines([""]);
    }
  }, []);

  return (
    <Flex
      className={styles.terminal}
      direction="column"
      fillWidth
      fillHeight
      radius="l"
      border="neutral-alpha-weak"
      background="neutral-strong"
      overflow="hidden"
    >
      {/* Terminal Header */}
      <Flex
        className={styles.header}
        paddingX="16"
        paddingY="12"
        horizontal="space-between"
        vertical="center"
      >
        <Flex gap="8" vertical="center">
          <Flex gap="4">
            <div className={styles.terminalButton} style={{backgroundColor: '#ff5f57'}}></div>
            <div className={styles.terminalButton} style={{backgroundColor: '#ffbd2e'}}></div>
            <div className={styles.terminalButton} style={{backgroundColor: '#28ca42'}}></div>
          </Flex>
          <Text variant="body-default-s" onBackground="neutral-weak">
            lilrau/heart/dev/rauls.ts
          </Text>
        </Flex>
        <Text variant="body-default-xs" onBackground="neutral-weak">
          TypeScript
        </Text>
      </Flex>

      {/* Terminal Content */}
      <Flex
        direction="column"
        padding="20"
        fillHeight
        gap="2"
        className={styles.codeContent}
        ref={codeContentRef}
      >
        {displayedLines.map((line, index) => {
          const indentMatch = line?.match(/^[\t ]+/);
          const indentText = indentMatch ? indentMatch[0] : '';
          const spaces = (indentText.match(/ /g) || []).length;
          const tabs = (indentText.match(/\t/g) || []).length;
          const indentCh = spaces + tabs * 2; // tabs sized as 2 spaces
          const content = line ? line.slice(indentText.length) : '';

          return (
            <Flex key={index} gap="16" vertical="center">
              <Text
                variant="body-default-xs"
                className={styles.lineNumber}
              >
                {String(index + 1).padStart(2, ' ')}
              </Text>
              <div
                className={styles.codeLine}
                style={{ paddingLeft: `${indentCh}ch` }}
                dangerouslySetInnerHTML={{
                  __html: content ? renderCodeLine(content, index + 1) : ' '
                }}
              />
            </Flex>
          );
        })}

        {/* Cursor - show only when typing and at current line */}
        {isTyping && (
          <Flex gap="16" vertical="center" className={styles.cursor}>
            <Text
              variant="body-default-xs"
              className={styles.lineNumber}
            >
              {String(displayedLines.length).padStart(2, ' ')}
            </Text>
            <div className={styles.codeLine}>
              <span className={styles.blinkingCursor}>|</span>
            </div>
          </Flex>
        )}
      </Flex>

      {/* Terminal Footer */}
      <Flex
        paddingX="16"
        paddingY="8"
        horizontal="space-between"
        vertical="center"
        className={styles.footer}
      >
        <Text variant="body-default-xs" onBackground="neutral-weak">
          TypeScript
        </Text>
        <Flex gap="12">
          <Text variant="body-default-xs" onBackground="neutral-weak">
            UTF-8
          </Text>
          <Text variant="body-default-xs" onBackground="neutral-weak">
            Ln 25, Col 2
          </Text>
        </Flex>
      </Flex>
    </Flex>
  );
};

export { CodeTerminal };