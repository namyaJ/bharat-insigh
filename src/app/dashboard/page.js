'use client';
import { useState, useEffect, useMemo } from 'react';
import { useTenant } from '@/contexts/TenantContext';
import useUIStore from '@/stores/uiStore';
import { DataGrid } from '@/components/dashboard/DataGrid';
import { InsightPanel } from '@/components/dashboard/InsightPanel';
import { DashboardCharts } from '@/components/dashboard/DashboardCharts';
import styles from './page.module.css';

const TENANT_TO_DEPT = {
  health: 'Health',
  agriculture: 'Agriculture',
  finance: 'Finance',
};

export default function Dashboard() {
  const [gridContext, setGridContext] = useState({ query: '', department: 'All', count: 0 });
  const [rawData, setRawData] = useState([]);
  const { tenant } = useTenant();
  const showInsight = useUIStore(s => s.showInsight);

  useEffect(() => {
    fetch('/data/dataset.json')
      .then(r => {
        if (!r.ok) throw new Error('Failed to load dataset');
        return r.json();
      })
      .then(d => setRawData(d))
      .catch(err => console.error('Dataset load error:', err));
  }, []);

  // Filter data by the currently selected tenant/ministry
  const tenantData = useMemo(() => {
    const dept = TENANT_TO_DEPT[tenant];
    if (!dept || rawData.length === 0) return rawData;
    return rawData.filter(row => row.department === dept);
  }, [rawData, tenant]);

  return (
    <div className={`${styles.dashboardLayout} ${!showInsight ? styles.noInsight : ''}`}>
      {/* Left: Charts + Grid stack */}
      <div className={styles.mainColumn}>
        <div className={styles.chartsSection}>
          <DashboardCharts data={tenantData} />
        </div>
        <div className={styles.gridSection}>
          <DataGrid data={tenantData} onFilterChange={setGridContext} />
        </div>
      </div>
      {/* Right: AI Insight Panel */}
      {showInsight && (
        <div className={styles.insightSection}>
          <InsightPanel filterContext={gridContext} />
        </div>
      )}
    </div>
  );
}
