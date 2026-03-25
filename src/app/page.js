import Link from 'next/link';
import {
  ArrowRight,
  Brain,
  Building2,
  Command,
  Database,
  Gauge,
  Github,
  Lock,
  Search,
  Shield,
  Sparkles,
  Zap,
} from 'lucide-react';
import { LiveHeroPanel } from '@/components/landing/LiveHeroPanel';
import styles from './page.module.css';

const FEATURE_CARDS = [
  {
    title: 'AI Insights',
    subtitle: 'Gemini 1.5',
    description: 'Context-aware streaming responses based on active filters and tenant state.',
    tags: ['Gemini', 'Streaming', 'AI'],
    badge: 'Live',
    wide: true,
    Icon: Brain,
  },
  {
    title: '100K+ Virtualization',
    subtitle: 'TanStack',
    description: 'Large datasets stay smooth with low memory overhead and keyboard-first controls.',
    tags: ['Virtual', 'Performance'],
    badge: '60fps',
    wide: true,
    Icon: Database,
  },
  {
    title: 'Multi-Tenant Context',
    subtitle: 'Org Switching',
    description: 'Department-aware themes and charts update instantly without route reload.',
    tags: ['Tenant', 'Theming'],
    badge: 'Instant',
    Icon: Building2,
  },
  {
    title: 'Command Palette',
    subtitle: 'Power UX',
    description: 'Quick navigation, role switching, and action search from one keyboard surface.',
    tags: ['Cmd+K', 'Navigation'],
    badge: 'Fast',
    Icon: Command,
  },
  {
    title: 'RBAC + Auth',
    subtitle: 'Supabase',
    description: 'Role-driven actions with sign-in flows and secure server-side API boundaries.',
    tags: ['Auth', 'Security'],
    badge: 'Secure',
    Icon: Shield,
  },
  {
    title: 'Advanced Analytics',
    subtitle: 'Filtering',
    description: 'Fuzzy search, multi-column filters, KPI summaries, and state-level drilldowns.',
    tags: ['Search', 'Charts'],
    badge: 'Smart',
    Icon: Search,
  },
];

export default function LandingPage() {
  return (
    <div className={styles.page}>
      <div className={styles.gridLayer} />
      <div className={styles.glowTop} />
      <div className={styles.glowBottom} />

      <header className={styles.navbar}>
        <Link href="/" className={styles.brand}>
          <div className={styles.brandIcon}>
            <Gauge size={16} />
          </div>
          <span>
            Bharat<span className={styles.brandHighlight}>-Insight</span>
          </span>
        </Link>

        <nav className={styles.navLinks}>
          <a href="#features">Features</a>
          <Link href="/dashboard">Dashboard</Link>
          <a href="https://github.com" target="_blank" rel="noreferrer noopener">
            <Github size={14} />
            GitHub
          </a>
        </nav>

        <div className={styles.navCtaWrap}>
          <Link href="/dashboard" className={styles.launchBtn}>
            Launch App
            <ArrowRight size={14} />
          </Link>
        </div>
      </header>

      <main className={styles.main}>
        <section className={styles.heroSection}>
          <div className={styles.heroLeft}>
            <div className={styles.pill}>
              <Sparkles size={13} />
              Powered by Google Gemini AI
            </div>
            <h1 className={styles.heroTitle}>
              Bharat<span>-Insight</span>
            </h1>
            <p className={styles.heroSubtitle}>AI-Driven Data Intelligence Platform</p>
            <p className={styles.heroCopy}>
              India&apos;s advanced multi-tenant analytics platform. Analyze 100,000+ public
              data points with real-time AI insights for fast, transparent decisions.
            </p>
            <div className={styles.heroActions}>
              <Link href="/dashboard" className={styles.primaryCta}>
                Launch Dashboard
                <ArrowRight size={16} />
              </Link>
            </div>
            <div className={styles.metrics}>
              <div>
                <strong>100K+</strong>
                <span>Data Points</span>
              </div>
              <div>
                <strong>28+</strong>
                <span>States</span>
              </div>
              <div>
                <strong>95+</strong>
                <span>Lighthouse</span>
              </div>
            </div>
          </div>

          <LiveHeroPanel />
        </section>

        <section className={styles.orgStrip} aria-label="Ecosystem partners">
          <p>Designed for India&apos;s public data ecosystem</p>
          <div>
            {['TRAI', 'MeitY', 'BharatNet', 'Digital India', 'NITI Aayog', 'NASSCOM'].map((org) => (
              <span key={org}>{org}</span>
            ))}
          </div>
        </section>

        <section id="features" className={styles.featuresSection}>
          <div className={styles.sectionHead}>
            <span>Everything you need</span>
            <h2>
              Built for production <em>scale</em>
            </h2>
            <p>
              A focused data intelligence stack for analysis teams, ministries, and high-volume
              dashboards.
            </p>
          </div>

          <div className={styles.featureGrid}>
            {FEATURE_CARDS.map((card) => {
              const Icon = card.Icon;
              return (
                <article
                  key={card.title}
                  className={`${styles.featureCard} ${card.wide ? styles.featureCardWide : ''}`}
                >
                  <header>
                    <div className={styles.featureIcon}><Icon size={18} /></div>
                    <span>{card.badge}</span>
                  </header>
                  <h3>
                    {card.title} <small>{card.subtitle}</small>
                  </h3>
                  <p>{card.description}</p>
                  <div className={styles.featureTags}>
                    {card.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className={styles.ctaSection}>
          <div>
            <span>Open Source and Free</span>
            <h2>
              Ready to explore <em>India&apos;s data?</em>
            </h2>
            <p>
              Launch the dashboard and analyze 100,000+ records with an AI assistant and
              keyboard-first workflows.
            </p>
            <div className={styles.ctaActions}>
              <Link href="/dashboard" className={styles.primaryCta}>
                Launch App
                <ArrowRight size={16} />
              </Link>
            </div>
            <div className={styles.stackChips}>
              {[
                'Next.js 16',
                'React 19',
                'Tailwind v4',
                'Gemini AI',
                'Supabase',
                'TanStack',
              ].map((chip) => (
                <span key={chip}>{chip}</span>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div>
          <strong>Bharat-Insight</strong>
          <p>AI-Driven Data Intelligence Platform</p>
        </div>
        <div>
          <p>
            <Lock size={13} />
            Auth + RBAC
          </p>
          <p>
            <Zap size={13} />
            Real-time analytics
          </p>
        </div>
        <div className={styles.footerMeta}>
          <span>v0.3.0</span>
          <span>Built on Next.js 16</span>
        </div>
      </footer>
    </div>
  );
}
