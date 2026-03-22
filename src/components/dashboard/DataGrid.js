'use client';
import { useRef, useState, useMemo, useEffect, useCallback } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useAuth } from '@/contexts/AuthContext';
import styles from './DataGrid.module.css';
import { Search, X, Filter, SlidersHorizontal } from 'lucide-react';

/**
 * Fuzzy matching algorithm — scores consecutive matches, word-boundary hits, and handles typos.
 */
function fuzzyMatch(query, target) {
  if (!query || !target) return { match: !query, score: 0, indices: [] };
  const q = query.toLowerCase();
  const t = target.toLowerCase();

  const substringIdx = t.indexOf(q);
  if (substringIdx !== -1) {
    const indices = [];
    for (let i = substringIdx; i < substringIdx + q.length; i++) indices.push(i);
    const score = 100 + (q.length / t.length) * 50 - substringIdx;
    return { match: true, score, indices };
  }

  let qi = 0, score = 0;
  const indices = [];
  let lastMatchIdx = -2, consecutiveBonus = 0;

  for (let ti = 0; ti < t.length && qi < q.length; ti++) {
    if (t[ti] === q[qi]) {
      indices.push(ti);
      if (ti === lastMatchIdx + 1) { consecutiveBonus += 4; score += consecutiveBonus; }
      else { consecutiveBonus = 0; score += 1; }
      if (ti === 0 || /[\s\-_]/.test(t[ti - 1])) score += 8;
      if (target[ti] === query[qi]) score += 1;
      lastMatchIdx = ti;
      qi++;
    }
  }

  if (qi < q.length) return { match: false, score: 0, indices: [] };
  const spread = indices.length > 1 ? indices[indices.length - 1] - indices[0] : 0;
  score -= spread * 0.5;
  score += (q.length / t.length) * 20;
  return { match: true, score, indices };
}

function scoreRow(row, query) {
  const fields = [row.id, row.state, row.status, row.department, String(row.year)];
  let bestScore = -1;
  for (const field of fields) {
    const result = fuzzyMatch(query, field);
    if (result.match && result.score > bestScore) bestScore = result.score;
  }
  return bestScore;
}

// Debounce hook
function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timeout = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timeout);
  }, [value, delay]);
  return debounced;
}

// Extract unique sorted values
function useUniqueValues(data, key) {
  return useMemo(() => {
    if (!data || data.length === 0) return [];
    const set = new Set(data.map(r => r[key]));
    return [...set].sort((a, b) => (typeof a === 'number' ? a - b : String(a).localeCompare(String(b))));
  }, [data, key]);
}

export function DataGrid({ data: rawData, onFilterChange }) {
  const [query, setQuery] = useState('');
  const [activeDepartment, setActiveDepartment] = useState('All');
  const [activeState, setActiveState] = useState('All');
  const [activeYear, setActiveYear] = useState('All');
  const [activeStatus, setActiveStatus] = useState('All');
  const [focusedRow, setFocusedRow] = useState(-1);
  const [showFilters, setShowFilters] = useState(false);
  const { role } = useAuth();
  const parentRef = useRef(null);
  const containerRef = useRef(null);

  const loading = !rawData || rawData.length === 0;

  // Debounce search for performance on 100k rows
  const debouncedQuery = useDebounce(query, 150);

  // Extract unique values for dynamic filter dropdowns
  const states = useUniqueValues(rawData, 'state');
  const years = useUniqueValues(rawData, 'year');

  const filteredData = useMemo(() => {
    let result = rawData || [];
    // Multi-column exact filters
    if (activeDepartment !== 'All') result = result.filter(r => r.department === activeDepartment);
    if (activeState !== 'All') result = result.filter(r => r.state === activeState);
    if (activeYear !== 'All') result = result.filter(r => String(r.year) === activeYear);
    if (activeStatus !== 'All') result = result.filter(r => r.status === activeStatus);
    // Fuzzy search
    if (debouncedQuery.trim()) {
      const q = debouncedQuery.trim();
      const scored = [];
      for (const row of result) {
        const s = scoreRow(row, q);
        if (s > 0) scored.push({ row, score: s });
      }
      scored.sort((a, b) => b.score - a.score);
      result = scored.map(s => s.row);
    }
    return result;
  }, [rawData, debouncedQuery, activeDepartment, activeState, activeYear, activeStatus]);

  // Notify parent of filter context
  useEffect(() => {
    if (onFilterChange) {
      onFilterChange({
        query: debouncedQuery,
        department: activeDepartment,
        state: activeState,
        year: activeYear,
        count: filteredData.length
      });
    }
  }, [filteredData.length, debouncedQuery, activeDepartment, activeState, activeYear, onFilterChange]);

  // Reset focused row when data changes
  useEffect(() => { setFocusedRow(-1); }, [filteredData]);

  const activeFilterCount = [activeDepartment, activeState, activeYear, activeStatus].filter(f => f !== 'All').length;

  const clearAllFilters = useCallback(() => {
    setActiveDepartment('All');
    setActiveState('All');
    setActiveYear('All');
    setActiveStatus('All');
    setQuery('');
  }, []);

  const rowVirtualizer = useVirtualizer({
    count: filteredData.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 40,
    overscan: 20,
  });

  const handleClear = useCallback(() => { setQuery(''); }, []);

  // Keyboard navigation
  const handleKeyDown = useCallback((e) => {
    const maxIdx = filteredData.length - 1;
    if (maxIdx < 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedRow(prev => {
          const next = Math.min(prev + 1, maxIdx);
          rowVirtualizer.scrollToIndex(next, { align: 'auto' });
          return next;
        });
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedRow(prev => {
          const next = Math.max(prev - 1, 0);
          rowVirtualizer.scrollToIndex(next, { align: 'auto' });
          return next;
        });
        break;
      case 'Home':
        e.preventDefault();
        setFocusedRow(0);
        rowVirtualizer.scrollToIndex(0);
        break;
      case 'End':
        e.preventDefault();
        setFocusedRow(maxIdx);
        rowVirtualizer.scrollToIndex(maxIdx);
        break;
      case 'PageDown':
        e.preventDefault();
        setFocusedRow(prev => {
          const next = Math.min(prev + 20, maxIdx);
          rowVirtualizer.scrollToIndex(next, { align: 'auto' });
          return next;
        });
        break;
      case 'PageUp':
        e.preventDefault();
        setFocusedRow(prev => {
          const next = Math.max(prev - 20, 0);
          rowVirtualizer.scrollToIndex(next, { align: 'auto' });
          return next;
        });
        break;
      default:
        break;
    }
  }, [filteredData.length, rowVirtualizer]);

  return (
    <div
      className={styles.container}
      ref={containerRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      role="grid"
      aria-label="Government schemes data grid"
    >
      {/* Controls Row */}
      <div className={styles.header}>
        <div className={styles.searchBox}>
          <Search size={15} />
          <input
            type="text"
            placeholder="Fuzzy search — try 'Maharshtra' or 'Actvie'..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            aria-label="Fuzzy search"
          />
          {query && (
            <button onClick={handleClear} className={styles.clearBtn} title="Clear search" aria-label="Clear search">
              <X size={14} />
            </button>
          )}
        </div>

        <button
          className={`${styles.filterToggle} ${showFilters ? styles.filterToggleActive : ''}`}
          onClick={() => setShowFilters(f => !f)}
          title="Toggle filters"
        >
          <SlidersHorizontal size={14} />
          Filters
          {activeFilterCount > 0 && <span className={styles.filterBadge}>{activeFilterCount}</span>}
        </button>

        <div className={styles.counter}>
          {debouncedQuery && <span className={styles.fuzzyTag}>fuzzy</span>}
          <span className={styles.rowCount}>{filteredData.length.toLocaleString()}</span>
          <span className={styles.rowLabel}> / {(rawData?.length || 0).toLocaleString()} rows</span>
        </div>
      </div>

      {/* Multi-Column Filters Panel */}
      {showFilters && (
        <div className={styles.filtersPanel}>
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}><Filter size={12} /> Department</label>
            <select value={activeDepartment} onChange={e => setActiveDepartment(e.target.value)} className={styles.select} aria-label="Filter by department">
              <option value="All">All Departments</option>
              <option value="Agriculture">Agriculture</option>
              <option value="Health">Health</option>
              <option value="Finance">Finance</option>
              <option value="Education">Education</option>
              <option value="Transport">Transport</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}><Filter size={12} /> State</label>
            <select value={activeState} onChange={e => setActiveState(e.target.value)} className={styles.select} aria-label="Filter by state">
              <option value="All">All States</option>
              {states.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}><Filter size={12} /> Year</label>
            <select value={activeYear} onChange={e => setActiveYear(e.target.value)} className={styles.select} aria-label="Filter by year">
              <option value="All">All Years</option>
              {years.map(y => <option key={y} value={String(y)}>{y}</option>)}
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}><Filter size={12} /> Status</label>
            <select value={activeStatus} onChange={e => setActiveStatus(e.target.value)} className={styles.select} aria-label="Filter by status">
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Completed">Completed</option>
              <option value="Pending">Pending</option>
              <option value="Under Review">Under Review</option>
            </select>
          </div>

          {activeFilterCount > 0 && (
            <button className={styles.clearAllBtn} onClick={clearAllFilters}>
              <X size={12} /> Clear All
            </button>
          )}
        </div>
      )}

      {/* Keyboard hint */}
      {!loading && filteredData.length > 0 && (
        <div className={styles.kbHint}>
          <kbd>↑</kbd><kbd>↓</kbd> Navigate &nbsp; <kbd>PgUp</kbd><kbd>PgDn</kbd> Jump &nbsp; <kbd>Home</kbd><kbd>End</kbd> Edges
        </div>
      )}

      {loading ? (
        <div className="p-3 space-y-1.5">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="h-10 bg-white/[0.03] rounded-md animate-pulse" style={{ animationDelay: `${i * 50}ms` }} />
          ))}
        </div>
      ) : filteredData.length === 0 ? (
        <div className={styles.emptyState}>
          <Search size={32} />
          <div className={styles.emptyTitle}>No matches found</div>
          <div className={styles.emptyDesc}>Try a different search term or adjust filters — fuzzy search handles typos!</div>
        </div>
      ) : (
        <div className={styles.tableWrapper}>
          <div className={styles.tableHeader} role="row">
            <div className={styles.cell} role="columnheader">ID</div>
            <div className={styles.cell} role="columnheader">State</div>
            <div className={styles.cell} role="columnheader">Dept</div>
            <div className={styles.cell} role="columnheader">Year</div>
            <div className={styles.cell} role="columnheader">Funding (Cr)</div>
            <div className={`${styles.cell} ${styles.cellHideMobile}`} role="columnheader">Beneficiaries</div>
            <div className={styles.cell} role="columnheader">Status</div>
            {role === 'admin' && <div className={styles.cell} role="columnheader">Action</div>}
          </div>
          <div ref={parentRef} className={styles.tableBody}>
            <div style={{ height: `${rowVirtualizer.getTotalSize()}px`, width: '100%', position: 'relative' }}>
              {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                const row = filteredData[virtualRow.index];
                const isFocused = virtualRow.index === focusedRow;
                return (
                  <div
                    key={virtualRow.index}
                    className={`${styles.virtualRow} ${isFocused ? styles.focusedRow : ''}`}
                    role="row"
                    aria-selected={isFocused}
                    onClick={() => setFocusedRow(virtualRow.index)}
                    style={{
                      position: 'absolute',
                      top: 0, left: 0, width: '100%',
                      height: `${virtualRow.size}px`,
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                  >
                    <div className={styles.cell} role="gridcell">{row.id}</div>
                    <div className={styles.cell} role="gridcell">{row.state}</div>
                    <div className={styles.cell} role="gridcell">{row.department}</div>
                    <div className={styles.cell} role="gridcell">{row.year}</div>
                    <div className={styles.cell} role="gridcell">₹{row.funding_crores?.toFixed?.(1) ?? row.funding_crores}</div>
                    <div className={`${styles.cell} ${styles.cellHideMobile}`} role="gridcell">{(row.beneficiaries || 0).toLocaleString()}</div>
                    <div className={styles.cell} role="gridcell">
                      <span className={`${styles.statusBadge} ${styles[row.status.toLowerCase().replace(' ', '')]}`}>{row.status}</span>
                    </div>
                    {role === 'admin' && (
                      <div className={styles.cell} role="gridcell">
                        <button className={styles.editBtn}>Edit</button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
