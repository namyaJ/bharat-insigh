'use client';
import { useMemo } from 'react';
import {
  PieChart, Pie, Cell,
  BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  ComposedChart, Area, Line, Legend
} from 'recharts';
import { TrendingUp, BarChart3, PieChart as PieIcon, IndianRupee, MapPin, Activity, Info } from 'lucide-react';
import styles from './DashboardCharts.module.css';

// --- Custom Plain English Tooltips ---

const StatusTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className={styles.customTooltip}>
        <p className={styles.tooltipTitle}>{data.name} Schemes</p>
        <p className={styles.tooltipDesc}>
          There are currently <strong>{data.value.toLocaleString()}</strong> public records marked as {data.name.toLowerCase()}.
        </p>
      </div>
    );
  }
  return null;
};

const DeptTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className={styles.customTooltip}>
        <p className={styles.tooltipTitle}>Ministry of {data.name}</p>
        <p className={styles.tooltipDesc}>
          This department has been allocated <strong>₹{(data.value / 1000).toFixed(1)}k Crores</strong> out of the public budget.
        </p>
      </div>
    );
  }
  return null;
};

const TrendTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const funding = payload.find(p => p.dataKey === 'funding');
    const impact = payload.find(p => p.dataKey === 'beneficiaries');
    return (
      <div className={styles.customTooltip}>
        <p className={styles.tooltipTitle}>Year {label}</p>
        {funding && (
          <p className={styles.tooltipDesc} style={{ color: funding.color }}>
            <strong>₹{(funding.value / 1000).toFixed(1)}k Cr</strong> allocated in public funds.
          </p>
        )}
        {impact && (
          <p className={styles.tooltipDesc} style={{ color: impact.color }}>
            Impacting over <strong>{(impact.value).toLocaleString()}</strong> citizens.
          </p>
        )}
      </div>
    );
  }
  return null;
};

export function DashboardCharts({ data }) {
  const stats = useMemo(() => {
    if (!data || data.length === 0) return null;

    const totalFunding = data.reduce((sum, r) => sum + r.funding_crores, 0);
    const avgFunding = totalFunding / data.length;
    const uniqueStates = new Set(data.map(r => r.state)).size;

    // Status distribution
    const statusCounts = {};
    data.forEach(r => { statusCounts[r.status] = (statusCounts[r.status] || 0) + 1; });
    
    // Formatting for Recharts
    const statusData = Object.keys(statusCounts).map(key => ({
      name: key, value: statusCounts[key]
    }));

    // Department funding
    const deptFunding = {};
    data.forEach(r => { deptFunding[r.department] = (deptFunding[r.department] || 0) + r.funding_crores; });
    const deptData = Object.keys(deptFunding).map(key => ({
      name: key, value: deptFunding[key]
    })).sort((a, b) => b.value - a.value);

    // Year-wise trend (Funding + Beneficiaries)
    const yearMetrics = {};
    data.forEach(r => {
      if (!yearMetrics[r.year]) yearMetrics[r.year] = { funding: 0, beneficiaries: 0 };
      yearMetrics[r.year].funding += r.funding_crores;
      if (r.beneficiaries) yearMetrics[r.year].beneficiaries += r.beneficiaries;
    });
    
    const yearData = Object.keys(yearMetrics).sort().slice(-8).map(year => ({
      year: year,
      funding: yearMetrics[year].funding,
      beneficiaries: yearMetrics[year].beneficiaries,
    }));

    return {
      totalRows: data.length,
      totalFunding,
      avgFunding,
      uniqueStates,
      statusData,
      deptData,
      yearData
    };
  }, [data]);

  if (!stats) {
    return (
      <div className={styles.chartsContainer}>
        {/* Skeleton Loaders */}
        <div className={styles.kpiRow}>
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-xl animate-pulse">
              <div className="w-10 h-10 rounded-lg bg-white/10" />
              <div className="flex flex-col gap-2 flex-1">
                <div className="h-5 w-24 rounded bg-white/10" />
                <div className="h-3 w-16 rounded bg-white/5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const COLORS = {
    Active: '#10b981',
    Completed: '#6366f1',
    Pending: '#f59e0b',
    'Under Review': '#ef4444',
    Agriculture: '#10b981',
    Health: '#6366f1',
    Finance: '#f59e0b',
    Education: '#06b6d4',
    Transport: '#ec4899',
  };

  return (
    <div className={styles.chartsContainer}>
      
      {/* ===== KPI Cards Row ===== */}
      <div className={styles.kpiRow}>
        <div className={styles.kpiCard}>
          <div className={styles.kpiIcon} style={{ background: 'rgba(99,102,241,0.15)', color: '#818cf8' }}>
            <BarChart3 size={20} />
          </div>
          <div className={styles.kpiInfo}>
            <div className={styles.kpiValue}>{stats.totalRows.toLocaleString()}</div>
            <div className={styles.kpiLabel}>Total Records</div>
            <div className={styles.kpiSubLabel}>Official government schemes tracked</div>
          </div>
        </div>
        <div className={styles.kpiCard}>
          <div className={styles.kpiIcon} style={{ background: 'rgba(16,185,129,0.15)', color: '#34d399' }}>
            <IndianRupee size={20} />
          </div>
          <div className={styles.kpiInfo}>
            <div className={styles.kpiValue}>₹{(stats.totalFunding / 1000).toFixed(1)}k Cr</div>
            <div className={styles.kpiLabel}>Total Budget</div>
            <div className={styles.kpiSubLabel}>Total funds allocated across all years</div>
          </div>
        </div>
        <div className={styles.kpiCard}>
          <div className={styles.kpiIcon} style={{ background: 'rgba(245,158,11,0.15)', color: '#fbbf24' }}>
            <MapPin size={20} />
          </div>
          <div className={styles.kpiInfo}>
            <div className={styles.kpiValue}>{stats.uniqueStates} States</div>
            <div className={styles.kpiLabel}>Geographic Reach</div>
            <div className={styles.kpiSubLabel}>Regions covered prominently in this dataset</div>
          </div>
        </div>
        <div className={styles.kpiCard}>
          <div className={styles.kpiIcon} style={{ background: 'rgba(236,72,153,0.15)', color: '#f472b6' }}>
            <Activity size={20} />
          </div>
          <div className={styles.kpiInfo}>
            <div className={styles.kpiValue}>₹{stats.avgFunding.toFixed(1)} Cr</div>
            <div className={styles.kpiLabel}>Avg Budget / Scheme</div>
            <div className={styles.kpiSubLabel}>The average funds dedicated per project</div>
          </div>
        </div>
      </div>

      {/* ===== High-Detail Charts ===== */}
      <div className={styles.chartsRow}>
        
        {/* Status Phase Pie Chart */}
        <div className={styles.chartCard} style={{ gridColumn: 'span 4' }}>
          <div className={styles.chartHeaderBlock}>
            <div className={styles.chartTitleRow}>
              <PieIcon size={16} className={styles.chartHeaderIcon} />
              <h3 className={styles.chartTitle}>Status of Public Schemes</h3>
            </div>
            <p className={styles.chartDescription}>
              A breakdown of the current phase for all tracked initiatives. Hover over a slice to see exactly how many records are in that status.
            </p>
          </div>
          <div className={styles.chartArea}>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={stats.statusData}
                  cx="50%" cy="50%"
                  innerRadius={70} outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="none"
                >
                  {stats.statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[entry.name] || '#8884d8'} />
                  ))}
                </Pie>
                <RechartsTooltip content={<StatusTooltip />} cursor={{fill: 'transparent'}} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '13px', color: '#94a3b8', paddingTop: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Department Funding Bar Chart */}
        <div className={styles.chartCard} style={{ gridColumn: 'span 8' }}>
          <div className={styles.chartHeaderBlock}>
            <div className={styles.chartTitleRow}>
              <IndianRupee size={16} className={styles.chartHeaderIcon} />
              <h3 className={styles.chartTitle}>Budget Allocation by Ministry</h3>
            </div>
            <p className={styles.chartDescription}>
              Which departments receive the largest share of public funding. This horizontal view clarifies financial priorities across the government.
            </p>
          </div>
          <div className={styles.chartArea}>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={stats.deptData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis type="number" tickFormatter={(val) => `₹${val/1000}k`} stroke="#475569" fontSize={11} />
                <YAxis dataKey="name" type="category" stroke="#cbd5e1" fontSize={12} fontWeight={500} />
                <RechartsTooltip content={<DeptTooltip />} cursor={{fill: 'rgba(255,255,255,0.03)'}} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} maxBarSize={40}>
                  {stats.deptData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[entry.name] || '#6366f1'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Year Trend Composed Chart */}
        <div className={styles.chartCard} style={{ gridColumn: 'span 12' }}>
          <div className={styles.chartHeaderBlock}>
            <div className={styles.chartTitleRow}>
              <TrendingUp size={16} className={styles.chartHeaderIcon} />
              <h3 className={styles.chartTitle}>Funding & Citizen Impact Over Time</h3>
            </div>
            <p className={styles.chartDescription}>
              This chart tracks how budget allocations (blue area) correlate with the total citizens impacted (pink line) across the last 8 years. A rising line indicates wider public reach.
            </p>
          </div>
          <div className={styles.chartArea}>
            <ResponsiveContainer width="100%" height={320}>
              <ComposedChart data={stats.yearData} margin={{ top: 20, right: 40, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorFunding" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="year" stroke="#475569" fontSize={12} tickMargin={10} />
                <YAxis yAxisId="left" stroke="#3b82f6" fontSize={11} tickFormatter={(val) => `₹${val/1000}k`} />
                <YAxis yAxisId="right" orientation="right" stroke="#ec4899" fontSize={11} tickFormatter={(val) => `${(val/1000).toFixed(0)}k`} />
                <RechartsTooltip content={<TrendTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 2 }} />
                <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '13px' }} />
                <Area yAxisId="left" type="monotone" dataKey="funding" name="Budget Allocated (Cr)" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorFunding)" />
                <Line yAxisId="right" type="monotone" dataKey="beneficiaries" name="Citizens Impacted" stroke="#ec4899" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
