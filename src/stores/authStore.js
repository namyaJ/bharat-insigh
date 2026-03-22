import { create } from 'zustand';
import { createClient } from '@/lib/supabase';

const useAuthStore = create((set) => {
  // Initialize Supabase listener
  if (typeof window !== 'undefined') {
    const supabase = createClient();
    if (supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        set({ user: session?.user ?? null, loading: false });
      });
      supabase.auth.onAuthStateChange((_event, session) => {
        set({ user: session?.user ?? null, loading: false });
      });
    } else {
      // Demo mode
      set({ user: { email: 'demo@govdata.in', id: 'demo' }, loading: false });
    }
  }

  return {
    user: null,
    role: 'viewer',
    loading: true,

    setRole: (role) => set({ role }),
    toggleRole: () => set((state) => ({ role: state.role === 'admin' ? 'viewer' : 'admin' })),

    signUp: async (email, password) => {
      const supabase = createClient();
      if (!supabase) return { data: null, error: { message: 'Supabase not configured.' } };
      return await supabase.auth.signUp({ email, password });
    },

    signIn: async (email, password) => {
      const supabase = createClient();
      if (!supabase) return { data: null, error: { message: 'Supabase not configured.' } };
      return await supabase.auth.signInWithPassword({ email, password });
    },

    signOut: async () => {
      const supabase = createClient();
      if (!supabase) { set({ user: null }); return { error: null }; }
      const { error } = await supabase.auth.signOut();
      if (!error) set({ user: null });
      return { error };
    },
  };
});

export default useAuthStore;
