'use client';
// Re-export Zustand store as the useTenant hook for backward compatibility
import useTenantStore from '@/stores/tenantStore';

export function useTenant() {
  const tenant = useTenantStore(s => s.tenant);
  const setTenant = useTenantStore(s => s.setTenant);
  return { tenant, setTenant };
}

// Keep TenantProvider as a no-op wrapper
export function TenantProvider({ children }) {
  return children;
}
