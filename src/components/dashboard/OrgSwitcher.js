'use client';
import { useTenant } from '@/contexts/TenantContext';
import styles from './OrgSwitcher.module.css';
import { Activity, Tractor, Landmark, Building2 } from 'lucide-react';

const TENANT_ICONS = {
  health: Activity,
  agriculture: Tractor,
  finance: Landmark,
};

export function OrgSwitcher() {
  const { tenant, setTenant } = useTenant();

  const handleOrgChange = (e) => {
    setTenant(e.target.value);
  };

  const IconComponent = TENANT_ICONS[tenant] || Building2;

  return (
    <div className={styles.switcherWrapper}>
      <IconComponent size={16} color="var(--text-secondary)" />
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
