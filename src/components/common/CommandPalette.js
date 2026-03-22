'use client';
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  Search, LayoutDashboard, Home, Sparkles, Users, LogOut,
  Moon, Shield, ArrowRight
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/stores/authStore';
import useTenantStore from '@/stores/tenantStore';

const ACTIONS = [
  { id: 'dashboard', label: 'Go to Dashboard', icon: LayoutDashboard, group: 'Navigation', path: '/dashboard' },
  { id: 'home', label: 'Go to Landing Page', icon: Home, group: 'Navigation', path: '/' },
  { id: 'login', label: 'Go to Login', icon: ArrowRight, group: 'Navigation', path: '/login' },
  { id: 'ask-ai', label: 'Ask AI Assistant', icon: Sparkles, group: 'Quick Actions', action: 'focus-ai' },
  { id: 'toggle-role', label: 'Toggle Admin / Viewer Role', icon: Shield, group: 'Quick Actions', action: 'toggle-role' },
  { id: 'switch-health', label: 'Switch to Ministry of Health', icon: Users, group: 'Switch Organization', action: 'tenant-health' },
  { id: 'switch-agriculture', label: 'Switch to Ministry of Agriculture', icon: Users, group: 'Switch Organization', action: 'tenant-agriculture' },
  { id: 'switch-finance', label: 'Switch to Ministry of Finance', icon: Users, group: 'Switch Organization', action: 'tenant-finance' },
  { id: 'sign-out', label: 'Sign Out', icon: LogOut, group: 'Account', action: 'sign-out' },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const resultsRef = useRef(null);
  const router = useRouter();
  const toggleRole = useAuthStore(s => s.toggleRole);
  const signOut = useAuthStore(s => s.signOut);
  const setTenant = useTenantStore(s => s.setTenant);

  // Filter actions by query
  const filtered = useMemo(() => {
    if (!query.trim()) return ACTIONS;
    const q = query.toLowerCase();
    return ACTIONS.filter(a =>
      a.label.toLowerCase().includes(q) ||
      a.group.toLowerCase().includes(q)
    );
  }, [query]);

  // Group filtered actions
  const grouped = useMemo(() => {
    const map = new Map();
    filtered.forEach(a => {
      if (!map.has(a.group)) map.set(a.group, []);
      map.get(a.group).push(a);
    });
    return map;
  }, [filtered]);

  // Reset selection when query changes
  useEffect(() => { setSelectedIndex(0); }, [query]);

  // Global hotkey
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(o => !o);
        setQuery('');
        setSelectedIndex(0);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Auto-focus input
  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  const executeAction = useCallback((action) => {
    setOpen(false);
    setQuery('');
    if (action.path) {
      router.push(action.path);
    } else if (action.action === 'toggle-role') {
      toggleRole();
    } else if (action.action === 'sign-out') {
      signOut().then(() => router.push('/login'));
    } else if (action.action?.startsWith('tenant-')) {
      setTenant(action.action.replace('tenant-', ''));
    } else if (action.action === 'focus-ai') {
      router.push('/dashboard');
    }
  }, [router, toggleRole, signOut, setTenant]);

  // Keyboard navigation inside palette
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') { setOpen(false); return; }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(i => (i + 1) % Math.max(filtered.length, 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(i => (i - 1 + filtered.length) % Math.max(filtered.length, 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[selectedIndex]) executeAction(filtered[selectedIndex]);
    }
  }, [filtered, selectedIndex, executeAction]);

  // Scroll selected into view
  useEffect(() => {
    if (!resultsRef.current) return;
    const selected = resultsRef.current.querySelector('[data-selected="true"]');
    if (selected) selected.scrollIntoView({ block: 'nearest' });
  }, [selectedIndex]);

  if (!open) return null;

  let flatIndex = 0;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-start justify-center pt-[13vh] animate-fade-in"
      onClick={() => setOpen(false)}
      onKeyDown={handleKeyDown}
    >
      <div
        className="w-full max-w-[580px] bg-[#0f1117] border border-white/[0.06] rounded-xl shadow-[0_30px_60px_-12px_rgba(0,0,0,0.6),0_0_40px_rgba(99,102,241,0.08)] flex flex-col overflow-hidden animate-slide-up"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/[0.06]">
          <Search size={18} className="text-gray-500 shrink-0" />
          <input
            ref={inputRef}
            autoFocus
            type="text"
            placeholder="Search actions, pages, settings..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="flex-1 bg-transparent border-none text-white text-[0.95rem] outline-none font-sans placeholder:text-gray-600"
          />
          <kbd className="bg-white/[0.06] text-gray-500 text-[0.65rem] px-1.5 py-0.5 rounded font-mono border border-white/[0.06]">ESC</kbd>
        </div>

        {/* Results */}
        <div ref={resultsRef} className="py-2 px-2 max-h-[320px] overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="text-center py-8 text-gray-600 text-sm">No results for &quot;{query}&quot;</div>
          ) : (
            [...grouped.entries()].map(([group, items]) => (
              <div key={group}>
                <div className="text-[0.68rem] font-semibold text-gray-500 uppercase tracking-widest px-3 pt-3 pb-1.5">{group}</div>
                {items.map((action) => {
                  const idx = flatIndex++;
                  const isSelected = idx === selectedIndex;
                  const Icon = action.icon;
                  return (
                    <button
                      key={action.id}
                      data-selected={isSelected}
                      onClick={() => executeAction(action)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-left transition-all duration-100
                        ${isSelected
                          ? 'bg-primary text-white shadow-[0_2px_12px_rgba(99,102,241,0.25)]'
                          : 'text-gray-400 hover:bg-white/[0.04] hover:text-gray-200'
                        }
                      `}
                    >
                      <Icon size={15} className={isSelected ? 'text-white' : 'text-gray-500'} />
                      <span className="flex-1">{action.label}</span>
                      {isSelected && <ArrowRight size={14} className="text-white/60" />}
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center px-3.5 py-2.5 border-t border-white/[0.06] bg-black/30 text-gray-600 text-[0.7rem]">
          <span><kbd className="bg-white/[0.06] px-1 py-0.5 rounded font-mono text-[0.6rem] border border-white/[0.06] mx-0.5">↑</kbd><kbd className="bg-white/[0.06] px-1 py-0.5 rounded font-mono text-[0.6rem] border border-white/[0.06] mx-0.5">↓</kbd> Navigate</span>
          <span><kbd className="bg-white/[0.06] px-1 py-0.5 rounded font-mono text-[0.6rem] border border-white/[0.06] mx-0.5">↵</kbd> Select</span>
          <span><kbd className="bg-white/[0.06] px-1.5 py-0.5 rounded font-mono text-[0.6rem] border border-white/[0.06] mx-0.5">Cmd/Ctrl+K</kbd> Toggle</span>
        </div>
      </div>
    </div>
  );
}
