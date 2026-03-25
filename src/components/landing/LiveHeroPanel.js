'use client';

import { useEffect, useMemo, useState } from 'react';
import { Gauge, Radio } from 'lucide-react';
import styles from '@/app/page.module.css';

const REFRESH_MS = 15000;

function compactNumber(value) {
  return new Intl.NumberFormat('en-IN', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(Number(value || 0));
}

function formatPercent(value) {
  const numeric = Number.isFinite(value) ? value : 0;
  const sign = numeric >= 0 ? '+' : '';
  return `${sign}${numeric.toFixed(1)}%`;
}

export function LiveHeroPanel() {
  const [snapshot, setSnapshot] = useState(null);
  const [error, setError] = useState('');
  const [syncing, setSyncing] = useState(true);
  const [tick, setTick] = useState(0);
  const [activeMetric, setActiveMetric] = useState('users');
  const [activeTrendIndex, setActiveTrendIndex] = useState(null);
  const [activeStateIndex, setActiveStateIndex] = useState(null);

  useEffect(() => {
    let mounted = true;
    let timerId = null;

    const fetchSnapshot = async () => {
      setSyncing(true);
      try {
        const response = await fetch('/api/preview', { cache: 'no-store' });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const payload = await response.json();
        if (mounted) {
          setSnapshot(payload);
          setError('');
        }
      } catch (fetchError) {
        if (mounted) {
          setError('Live preview unavailable');
        }
      } finally {
        if (mounted) {
          setSyncing(false);
        }
      }
    };

    fetchSnapshot();
    timerId = setInterval(fetchSnapshot, REFRESH_MS);

    return () => {
      mounted = false;
      if (timerId) clearInterval(timerId);
    };
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => setTick((value) => value + 1), 2800);
    return () => clearInterval(intervalId);
  }, []);

  const streamText = useMemo(() => {
    if (!snapshot) return 'Bootstrapping live metrics...';
    const messages = [
      `Streaming ${compactNumber(snapshot.totalRows)} records into live context...`,
      `Tracking ${snapshot.uniqueStates} active states across ministries...`,
      `Current filtered impact is ${compactNumber(snapshot.totalBeneficiaries)} beneficiaries...`,
      `Funding trend refreshed for the last ${snapshot.trend?.length || 0} periods...`,
    ];
    return messages[tick % messages.length];
  }, [snapshot, tick]);

  const trendMax = useMemo(() => {
    if (!snapshot?.trend?.length) return 1;
    return Math.max(...snapshot.trend.map((item) => item.beneficiaries), 1);
  }, [snapshot]);

  const activeTrend = snapshot?.trend?.[
    activeTrendIndex ?? Math.max((snapshot?.trend?.length || 1) - 1, 0)
  ];

  const activeState = snapshot?.topStates?.[activeStateIndex ?? 0];

  const metricDetails = useMemo(() => {
    if (!snapshot) {
      return {
        users: 'Live beneficiary totals will appear here.',
        funding: 'Funding averages will appear here.',
        states: 'State coverage will appear here.',
      };
    }

    return {
      users: `${compactNumber(snapshot.totalBeneficiaries)} beneficiaries currently modeled across the dataset.`,
      funding: `Average funding is INR ${Math.round(snapshot.avgFundingCr)} crores per row in the current snapshot.`,
      states: `${snapshot.uniqueStates} states are currently represented in the live dataset.`,
    };
  }, [snapshot]);

  const hoverSummary = useMemo(() => {
    if (activeState) {
      return `${activeState.state} currently leads this panel with ${compactNumber(activeState.beneficiaries)} beneficiaries and INR ${Math.round(activeState.fundingCr)}Cr funding.`;
    }

    if (activeTrend) {
      return `${activeTrend.label} closed with ${compactNumber(activeTrend.beneficiaries)} beneficiaries and INR ${compactNumber(activeTrend.fundingCr)}Cr allocated.`;
    }

    return metricDetails[activeMetric];
  }, [activeMetric, activeState, activeTrend, metricDetails]);

  return (
    <aside className={styles.heroRight} aria-label="Analytics preview">
      <article className={styles.analyticsCard}>
        <header>
          <div>
            <Gauge size={15} />
            <span>Analytics Overview</span>
          </div>
          <span className={styles.liveDot}>
            {syncing ? 'Syncing' : error ? 'Degraded' : 'Live'}
          </span>
        </header>

        <div className={styles.kpiGrid}>
          <div
            className={activeMetric === 'users' ? styles.kpiCardActive : ''}
            onMouseEnter={() => setActiveMetric('users')}
            onFocus={() => setActiveMetric('users')}
          >
            <span>Total Users</span>
            <strong>{snapshot ? compactNumber(snapshot.totalBeneficiaries) : '--'}</strong>
            <small>{snapshot ? formatPercent(snapshot.userGrowthPct) : '--'}</small>
          </div>
          <div
            className={activeMetric === 'funding' ? styles.kpiCardActive : ''}
            onMouseEnter={() => setActiveMetric('funding')}
            onFocus={() => setActiveMetric('funding')}
          >
            <span>Avg Funding</span>
            <strong>{snapshot ? `INR ${Math.round(snapshot.avgFundingCr)}` : '--'}</strong>
            <small>{snapshot ? formatPercent(snapshot.fundingGrowthPct) : '--'}</small>
          </div>
          <div
            className={activeMetric === 'states' ? styles.kpiCardActive : ''}
            onMouseEnter={() => setActiveMetric('states')}
            onFocus={() => setActiveMetric('states')}
          >
            <span>States</span>
            <strong>{snapshot ? snapshot.uniqueStates : '--'}</strong>
            <small className={styles.kpiNeutral}>Active</small>
          </div>
        </div>

        <div className={styles.hoverSummary}>
          <span>Live Context</span>
          <p>{hoverSummary}</p>
        </div>

        <div className={styles.fakeChart}>
          <div className={styles.chartHead}>
            <span>Subscriber Growth</span>
            {activeTrend ? (
              <p>
                <strong>{activeTrend.label}</strong>
                <span>{compactNumber(activeTrend.beneficiaries)} beneficiaries</span>
              </p>
            ) : null}
          </div>
          <div className={styles.trendBars}>
            {(snapshot?.trend || []).map((point, index) => {
              const heightPct = Math.max(
                10,
                Math.round((point.beneficiaries / trendMax) * 100),
              );
              return (
                <button
                  key={point.label}
                  type="button"
                  className={`${styles.trendBarWrap} ${activeTrendIndex === index ? styles.trendBarWrapActive : ''}`}
                  onMouseEnter={() => setActiveTrendIndex(index)}
                  onFocus={() => setActiveTrendIndex(index)}
                  onMouseLeave={() => setActiveTrendIndex(null)}
                  onBlur={() => setActiveTrendIndex(null)}
                  aria-label={`Inspect ${point.label} trend`}
                >
                  <div className={styles.trendBar} style={{ height: `${heightPct}%` }}>
                    <span className={styles.trendTooltip}>
                      INR {Math.round(point.fundingCr)}Cr
                    </span>
                  </div>
                  <small className={styles.trendLabel}>{String(point.label).slice(-2)}</small>
                </button>
              );
            })}
          </div>
        </div>

        <div className={styles.stateRows}>
          {(snapshot?.topStates || []).map((item, index) => (
            <button
              key={item.state}
              type="button"
              className={activeStateIndex === index ? styles.stateRowActive : ''}
              onMouseEnter={() => setActiveStateIndex(index)}
              onFocus={() => setActiveStateIndex(index)}
              onMouseLeave={() => setActiveStateIndex(null)}
              onBlur={() => setActiveStateIndex(null)}
            >
              <span>{item.state}</span>
              <span>{compactNumber(item.beneficiaries)}</span>
            </button>
          ))}
        </div>
      </article>

      <article className={styles.streamCard}>
        <div className={styles.streamHeader}>
          <span />
          <span />
          <span />
          <p>GEMINI AI STREAM</p>
        </div>
        <p className={styles.streamText}>
          <Radio size={12} />
          {streamText}
        </p>
      </article>

      <div className={styles.streamBadges}>
        <span>{snapshot ? `${snapshot.uniqueStates} States` : 'States'}</span>
        <span>Real-time AI</span>
        <span>RBAC Auth</span>
        <span>{snapshot ? `${compactNumber(snapshot.totalRows)} Rows` : 'Rows'}</span>
      </div>
    </aside>
  );
}
