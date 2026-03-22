import { create } from 'zustand';

const THEMES = {
  health:      { primary: '#6366f1', accent: '#818cf8', label: 'Ministry of Health' },
  agriculture: { primary: '#10b981', accent: '#34d399', label: 'Ministry of Agriculture' },
  finance:     { primary: '#f59e0b', accent: '#fbbf24', label: 'Ministry of Finance' },
};

const useTenantStore = create((set) => ({
  tenant: 'health',
  themes: THEMES,

  setTenant: (tenant) => {
    set({ tenant });
    // Apply CSS theme vars
    if (typeof document !== 'undefined') {
      const t = THEMES[tenant];
      if (t) {
        document.documentElement.style.setProperty('--primary-color', t.primary);
        document.documentElement.style.setProperty('--accent-color', t.accent);
      }
    }
  },

  getTenantLabel: () => {
    // This is a derived value — consumers should use: useTenantStore(s => THEMES[s.tenant].label)
  },
}));

export default useTenantStore;
