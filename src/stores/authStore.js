import { create } from 'zustand';
import { createClient } from '@/lib/supabase';

const useAuthStore = create((set) => {
  // Initialize Supabase listener
  if (typeof window !== 'undefined') {
    const supabase = createClient();
    if (supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        const adminEmail = 'namyajaiswal@gmail.com';
        const isUserAdmin = session?.user?.email === adminEmail;
        set({
          user: session?.user ?? null,
          role: isUserAdmin ? 'admin' : 'viewer',
          loading: false
        });
      });
      supabase.auth.onAuthStateChange((_event, session) => {
        const adminEmail = 'namyajaiswal@gmail.com';
        const isUserAdmin = session?.user?.email === adminEmail;
        set({
          user: session?.user ?? null,
          role: isUserAdmin ? 'admin' : 'viewer',
          loading: false
        });
      });
    } else {
      // Demo mode
      set({ user: { email: 'demo@govdata.in', id: 'demo' }, role: 'viewer', loading: false });
    }
  }

  return {
    user: null,
    role: 'viewer',
    loading: true,

    setRole: (role) => set({ role }),

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
