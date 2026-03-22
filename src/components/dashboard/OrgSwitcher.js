'use client';
import { useTenant } from '@/contexts/TenantContext';
import styles from './OrgSwitcher.module.css';
import { Building2 } from 'lucide-react';

export function OrgSwitcher() {
  const { tenant, setTenant } = useTenant();

  const handleOrgChange = (e) => {
    setTenant(e.target.value);
  };

  return (
    <div className={styles.switcherWrapper}>
      <Building2 size={16} color="var(--text-secondary)" />
      <select 
        className={styles.select} 
        value={tenant} 
        onChange={handleOrgChange}
        title="Switch Department"
      >
        <option value="health">Ministry of Health</option>
        <option value="agriculture">Ministry of Agriculture</option>
        <option value="finance">Ministry of Finance</option>
      </select>
    </div>
  );
}
