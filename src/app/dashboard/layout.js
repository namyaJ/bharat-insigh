'use client';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Search, Sparkles, ChevronDown, LogOut, Command } from 'lucide-react';
import useAuthStore from '@/stores/authStore';
import useUIStore from '@/stores/uiStore';
import { useTenant } from '@/contexts/TenantContext';
import styles from './dashboard.module.css';
import Link from 'next/link';

const TENANT_META = {
  health: {
    label: 'Health',
    fullName: 'Ministry of Health & Family Welfare',
    description: 'Public health infrastructure and disease surveillance data',
    color: '#ef4444',
  },
  agriculture: {
    label: 'Agriculture',
    fullName: 'Ministry of Agriculture & Farmers Welfare',
    description: 'Crop production, irrigation, and rural development data',
    color: '#22c55e',
  },
  finance: {
    label: 'Finance',
    fullName: 'Ministry of Finance',
    description: 'Budget allocation, expenditure, and fiscal policy data',
    color: '#f59e0b',
  },
};

export default function DashboardLayout({ children }) {
  const user = useAuthStore(s => s.user);
  const role = useAuthStore(s => s.role);
  const setRole = useAuthStore(s => s.setRole);
  const signOut = useAuthStore(s => s.signOut);
  const loading = useAuthStore(s => s.loading);
  const showInsight = useUIStore(s => s.showInsight);
  const toggleInsight = useUIStore(s => s.toggleInsight);
  const { tenant, setTenant } = useTenant();
  const router = useRouter();

  const [deptOpen, setDeptOpen] = useState(false);
  const deptRef = useRef(null);

  const meta = TENANT_META[tenant] || TENANT_META.health;

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (deptRef.current && !deptRef.current.contains(e.target)) {
        setDeptOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };

  const openCommandPalette = () => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true, bubbles: true }));
  };

  if (loading || !user) {
    return (
      <div className={styles.dashboardContainer} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Loading...</div>
      </div>
    );
  }

  return (
    <div className={styles.dashboardContainer}>
      {/* ===== Top Navigation Bar ===== */}
      <header className={styles.topNav}>
        <div className={styles.leftGroup}>
          <Link href="/" className={styles.backBtn} title="Back to Home">
            <ArrowLeft size={18} />
          </Link>

          <Link href="/dashboard" className={styles.brand}>
            <div className={styles.brandIcon}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" fill="url(#brandGrad)" />
                <path d="M8 12l3 3 5-6" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                <defs>
                  <linearGradient id="brandGrad" x1="4" y1="4" x2="20" y2="20">
                    <stop stopColor="#ef4444" />
                    <stop offset="1" stopColor="#f97316" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <span className={styles.brandName}>Bharat-Insight</span>
          </Link>

          {/* Department Switcher */}
          <div className={styles.deptSwitcher} ref={deptRef}>
            <button className={styles.deptBtn} onClick={() => setDeptOpen(!deptOpen)}>
              <span className={styles.deptIcon}>🏛</span>
              <span className={styles.deptLabel}>{meta.label}</span>
              <ChevronDown size={14} className={`${styles.deptChevron} ${deptOpen ? styles.deptChevronOpen : ''}`} />
            </button>
            {deptOpen && (
              <div className={styles.deptDropdown}>
                {Object.entries(TENANT_META).map(([key, val]) => (
                  <button
                    key={key}
                    className={`${styles.deptOption} ${tenant === key ? styles.deptOptionActive : ''}`}
                    onClick={() => { setTenant(key); setDeptOpen(false); }}
                  >
                    <span className={styles.deptDot} style={{ background: val.color }} />
                    {val.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Role Toggle */}
          <div className={styles.roleGroup}>
            <button
              className={`${styles.roleBtn} ${role === 'admin' ? styles.roleBtnActive : ''}`}
              onClick={() => setRole('admin')}
            >
              ○ Admin
            </button>
            <button
              className={`${styles.roleBtn} ${role === 'viewer' ? styles.roleBtnActive : ''}`}
              onClick={() => setRole('viewer')}
            >
              ◉ Viewer
            </button>
          </div>
        </div>

        <div className={styles.rightGroup}>
          <button className={styles.navActionBtn} onClick={openCommandPalette} title="Search (⌘K)">
            <Search size={15} />
            <span className={styles.navActionLabel}>Search</span>
          </button>

          <button className={styles.navActionBtn} onClick={openCommandPalette} title="Command Palette">
            <Command size={15} />
          </button>

          <button
            className={`${styles.navActionBtn} ${styles.aiBtn} ${showInsight ? styles.aiBtnActive : ''}`}
            onClick={toggleInsight}
            title="Toggle AI Insights"
          >
            <Sparkles size={15} />
            <span className={styles.navActionLabel}>AI Insights</span>
          </button>

          <button onClick={handleSignOut} title="Sign Out" className={styles.signOutBtn}>
            <LogOut size={16} />
          </button>
        </div>
      </header>

      {/* ===== Ministry Sub-Header ===== */}
      <div className={styles.subHeader}>
        <span className={styles.subIcon}>🏛</span>
        <div className={styles.subText}>
          <span className={styles.subTitle}>{meta.fullName}</span>
          <span className={styles.subDesc}>{meta.description}</span>
        </div>
      </div>

      {/* ===== Main Content ===== */}
      <div className={styles.mainContent}>
        <main className={styles.pageContent}>
          {children}
        </main>
      </div>
    </div>
  );
}
