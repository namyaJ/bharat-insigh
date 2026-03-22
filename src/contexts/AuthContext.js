'use client';
// Re-export Zustand store as the useAuth hook for backward compatibility
import useAuthStore from '@/stores/authStore';

export function useAuth() {
  return useAuthStore();
}

// Keep AuthProvider as a no-op wrapper for any existing <AuthProvider> usage
export function AuthProvider({ children }) {
  return children;
}
