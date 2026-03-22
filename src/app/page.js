'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Database, Sparkles, LineChart, Layers, ShieldCheck, Zap,
  ArrowRight, ChevronDown, Monitor, Server, Brain, Palette,
  Lock, Command, Globe, Cpu
} from 'lucide-react';
import styles from './page.module.css';

export default function LandingPage() {
  // Removed typedText state as we are removing the terminal for a cleaner, citizen-facing look

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add(styles.active);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    const els = document.querySelectorAll(`.${styles.reveal}`);
    els.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const features = [
    {
      icon: <Database size={22} />, title: "Instant Access to 100k+ Records",
      desc: "Browse massive data.gov.in datasets with zero loading screens. Our high-performance grid ensures butter-smooth exploration.",
      large: true, color: "#2563eb" // Trusted Blue
    },
    {
      icon: <Sparkles size={22} />, title: "AI-Powered Insights",
      desc: "Ask questions in plain English. Our integrated AI analyzes the current data view to provide instant, contextual answers.",
      color: "#16a34a" // Indian Green
    },
    {
      icon: <Layers size={22} />, title: "Cross-Ministry Analytics",
      desc: "Switch seamlessly between Health, Agriculture, and Finance datasets with dynamic, color-coded themes.",
      color: "#f97316" // Saffron
    },
    {
      icon: <ShieldCheck size={22} />, title: "Secure & Trusted",
      desc: "Role-based access controls ensure that sensitive administrative features are securely locked behind authentication.",
      color: "#475569" // Slate
    },
    {
      icon: <Zap size={22} />, title: "Citizen-First Interface",
      desc: "Press Cmd+K to search, navigate effortlessly with your keyboard, and enjoy a clean, responsive mobile experience.",
      color: "#0284c7" // Light Blue
    },
  ];

  const archLayers = [
    {
      label: "Frontend Layer",
      icon: <Monitor size={18} />,
      color: "#6366f1",
      items: ["Next.js 16 App Router", "React 19 (Server + Client)", "CSS Modules + Custom Props", "Geist Typography"]
    },
    {
      label: "Data Layer",
      icon: <Database size={18} />,
      color: "#06b6d4",
      items: ["100k JSON Dataset", "TanStack Virtual", "Fuzzy Search Engine", "Multi-column Filters"]
    },
    {
      label: "AI Layer",
      icon: <Brain size={18} />,
      color: "#10b981",
      items: ["Groq LLM (Llama 3.3)", "Streaming API Route", "Context-Aware Prompts", "Token-by-Token UI"]
    },
    {
      label: "Platform Layer",
      icon: <Cpu size={18} />,
      color: "#f59e0b",
      items: ["Multi-Tenant Context", "Auth Context (RBAC)", "CSS Theme Engine", "Command Palette"]
    }
  ];

  const techStack = [
    { name: "Next.js 16", desc: "App Router", icon: <Globe size={20} /> },
    { name: "React 19", desc: "Server Components", icon: <Monitor size={20} /> },
    { name: "TanStack", desc: "Virtual Scrolling", icon: <Database size={20} /> },
    { name: "Groq AI", desc: "LLM Streaming", icon: <Brain size={20} /> },
    { name: "CSS Modules", desc: "Scoped Styling", icon: <Palette size={20} /> },
    { name: "Lucide", desc: "Icon System", icon: <Zap size={20} /> },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.ambientOrb1}></div>
      <div className={styles.ambientOrb2}></div>
      <div className={styles.ambientOrb3}></div>
      <div className={styles.gridOverlay}></div>

      {/* ===== Navbar ===== */}
      <header className={styles.navbar}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}><LineChart size={18} /></div>
          Bharat-Insight
        </div>
        <nav className={styles.navLinks}>
          <a href="#features" className={styles.navLink}>Features</a>
          <a href="#architecture" className={styles.navLink}>Architecture</a>
          <a href="#tech" className={styles.navLink}>Tech Stack</a>
          <span className={styles.navDivider}></span>
          <Link href="/dashboard" className={styles.launchBtn}>
            Launch Dashboard <ArrowRight size={14} />
          </Link>
        </nav>
      </header>

      <main>
        {/* ===== Hero ===== */}
        <section className={styles.hero}>
          <div className={styles.heroBadge}>
            <span className={styles.badgeDot}></span>
            Built with Next.js 16 & AI-Powered Insights
          </div>

          <h1 className={`${styles.title} ${styles.reveal}`}>
            <span className={styles.titleLine}>Transparent Public Data.</span>
            <span className={styles.titleGradient}>For a Digital India.</span>
          </h1>

          <p className={`${styles.subtitle} ${styles.reveal}`} style={{ transitionDelay: '0.1s' }}>
            Access, analyze, and gain actionable insights from official government datasets.
            <br />Empowering citizens with a high-performance, AI-driven analytics platform.
          </p>

          <div className={`${styles.heroActions} ${styles.reveal}`} style={{ transitionDelay: '0.2s' }}>
            <Link href="/dashboard" className={styles.primaryBtn}>
              Access Public Dashboard <ArrowRight size={16} />
            </Link>
          </div>
        </section>

        {/* ===== Stats ===== */}
        <section className={`${styles.statsBar} ${styles.reveal}`}>
          {[
            { value: "100k+", label: "Official Records" },
            { value: "3", label: "Key Ministries" },
            { value: "Instant", label: "Data Access" },
            { value: "AI", label: "Analysis" },
          ].map((s, i) => (
            <div key={i} className={styles.statGroup}>
              {i > 0 && <div className={styles.statDivider}></div>}
              <div className={styles.stat}>
                <span className={styles.statValue}>{s.value}</span>
                <span className={styles.statLabel}>{s.label}</span>
              </div>
            </div>
          ))}
        </section>

        {/* ===== Features Bento ===== */}
        <section id="features" className={styles.bentoSection}>
          <div className={`${styles.sectionHeader} ${styles.reveal}`}>
            <span className={styles.sectionTag}>PLATFORM CAPABILITIES</span>
            <h2 className={styles.sectionTitle}>Built for Citizens</h2>
            <p className={styles.sectionSubtitle}>Everything you need to analyze massive public datasets easily and transparently.</p>
          </div>
          <div className={styles.bentoGrid}>
            {features.map((f, i) => (
              <div
                key={i}
                className={`${styles.bentoCard} ${f.large ? styles.bentoLarge : ''} ${styles.reveal}`}
                style={{ transitionDelay: `${i * 0.08}s`, '--card-color': f.color }}
              >
                <div className={styles.bentoIcon}>{f.icon}</div>
                <h3 className={styles.bentoTitle}>{f.title}</h3>
                <p className={styles.bentoDesc}>{f.desc}</p>
                <div className={styles.bentoShine}></div>
              </div>
            ))}
          </div>
        </section>

        {/* ===== Architecture ===== */}
        <section id="architecture" className={styles.archSection}>
          <div className={`${styles.sectionHeader} ${styles.reveal}`}>
            <span className={styles.sectionTag} style={{ background: 'rgba(37, 99, 235, 0.15)', color: '#60a5fa' }}>INFRASTRUCTURE</span>
            <h2 className={styles.sectionTitle}>Trusted Architecture</h2>
            <p className={styles.sectionSubtitle}>A robust, secure foundation ensuring high availability of public datasets.</p>
          </div>

          {/* Architecture Flowchart */}
          <div className={`${styles.archFlowchart} ${styles.reveal}`}>
            {/* User Entry */}
            <div className={styles.archNode} style={{ '--node-color': '#f8fafc' }}>
              <div className={styles.archNodeIcon}><Globe size={20} /></div>
              <div className={styles.archNodeLabel}>User Browser</div>
            </div>
            <div className={styles.archArrow}>
              <div className={styles.archArrowLine}></div>
              <div className={styles.archArrowLabel}>HTTP Request</div>
            </div>

            {/* App Router */}
            <div className={styles.archNode} style={{ '--node-color': '#6366f1' }}>
              <div className={styles.archNodeIcon}><Server size={20} /></div>
              <div className={styles.archNodeLabel}>Next.js App Router</div>
              <div className={styles.archNodeSub}>Server Components + API Routes</div>
            </div>

            {/* Split into two paths */}
            <div className={styles.archSplit}>
              <div className={styles.archBranch}>
                <div className={styles.archArrow}>
                  <div className={styles.archArrowLine}></div>
                  <div className={styles.archArrowLabel}>Page Render</div>
                </div>
                <div className={styles.archNode} style={{ '--node-color': '#06b6d4' }}>
                  <div className={styles.archNodeIcon}><Monitor size={20} /></div>
                  <div className={styles.archNodeLabel}>React Client Components</div>
                  <div className={styles.archNodeSub}>DataGrid · InsightPanel · OrgSwitcher</div>
                </div>
                <div className={styles.archArrow}>
                  <div className={styles.archArrowLine}></div>
                  <div className={styles.archArrowLabel}>Context API</div>
                </div>
                <div className={styles.archNode} style={{ '--node-color': '#f59e0b' }}>
                  <div className={styles.archNodeIcon}><Lock size={20} /></div>
                  <div className={styles.archNodeLabel}>State Management</div>
                  <div className={styles.archNodeSub}>TenantContext · AuthContext · Providers</div>
                </div>
              </div>
              <div className={styles.archBranch}>
                <div className={styles.archArrow}>
                  <div className={styles.archArrowLine}></div>
                  <div className={styles.archArrowLabel}>/api/chat</div>
                </div>
                <div className={styles.archNode} style={{ '--node-color': '#10b981' }}>
                  <div className={styles.archNodeIcon}><Brain size={20} /></div>
                  <div className={styles.archNodeLabel}>AI Streaming API</div>
                  <div className={styles.archNodeSub}>Groq SDK · Llama 3.3 · ReadableStream</div>
                </div>
                <div className={styles.archArrow}>
                  <div className={styles.archArrowLine}></div>
                  <div className={styles.archArrowLabel}>JSON Dataset</div>
                </div>
                <div className={styles.archNode} style={{ '--node-color': '#8b5cf6' }}>
                  <div className={styles.archNodeIcon}><Database size={20} /></div>
                  <div className={styles.archNodeLabel}>Data Source</div>
                  <div className={styles.archNodeSub}>100k rows · TanStack Virtual · Fuzzy Filter</div>
                </div>
              </div>
            </div>
          </div>

          {/* Architecture Layer Cards */}
          <div className={styles.archCards}>
            {archLayers.map((layer, i) => (
              <div
                key={i}
                className={`${styles.archCard} ${styles.reveal}`}
                style={{ transitionDelay: `${i * 0.1}s`, '--layer-color': layer.color }}
              >
                <div className={styles.archCardHeader}>
                  <div className={styles.archCardIcon}>{layer.icon}</div>
                  <div className={styles.archCardLabel}>{layer.label}</div>
                </div>
                <ul className={styles.archCardList}>
                  {layer.items.map((item, j) => (
                    <li key={j} className={styles.archCardItem}>
                      <span className={styles.archDot}></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* ===== Tech Stack ===== */}
        <section id="tech" className={styles.techSection}>
          <div className={`${styles.sectionHeader} ${styles.reveal}`}>
            <span className={styles.sectionTag} style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#a78bfa' }}>STACK</span>
            <h2 className={styles.sectionTitle}>Built With</h2>
            <p className={styles.sectionSubtitle}>Modern, production-grade tools for performance and developer experience.</p>
          </div>
          <div className={styles.techGrid}>
            {techStack.map((t, i) => (
              <div key={i} className={`${styles.techCard} ${styles.reveal}`} style={{ transitionDelay: `${i * 0.06}s` }}>
                <div className={styles.techIcon}>{t.icon}</div>
                <div className={styles.techName}>{t.name}</div>
                <div className={styles.techDesc}>{t.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ===== CTA Footer ===== */}
        <section className={`${styles.footerCta} ${styles.reveal}`}>
          <h2 className={styles.ctaTitle}>Ready to explore the data?</h2>
          <p className={styles.ctaSubtitle}>Jump into the dashboard and see 100k+ rows of Indian public data with AI insights.</p>
          <Link href="/dashboard" className={styles.ctaButton}>
            Launch Dashboard <ArrowRight size={16} />
          </Link>
        </section>
      </main>

      <footer className={styles.footer}>
        <span>Bharat-Insight Analytics Platform</span>
        <span className={styles.footerDot}>·</span>
        <span>Built with Next.js 16</span>
        <span className={styles.footerDot}>·</span>
        <span>Press <kbd className={styles.kbd}>⌘K</kbd> anywhere</span>
      </footer>
    </div>
  );
}
