import { promises as fs } from 'fs';
import path from 'path';

export const runtime = 'nodejs';

const CACHE_TTL_MS = 60_000;
let cachedSummary = null;
let cachedAt = 0;
let cachedMtime = 0;

async function getDatasetSummary() {
  const datasetPath = path.join(process.cwd(), 'public', 'data', 'dataset.json');
  const stats = await fs.stat(datasetPath);
  const now = Date.now();

  if (
    cachedSummary &&
    now - cachedAt < CACHE_TTL_MS &&
    cachedMtime === stats.mtimeMs
  ) {
    return cachedSummary;
  }

  const raw = await fs.readFile(datasetPath, 'utf8');
  const rows = JSON.parse(raw);

  const yearBuckets = new Map();
  const stateBuckets = new Map();
  const uniqueStates = new Set();
  let totalBeneficiaries = 0;
  let totalFundingCr = 0;

  for (const row of rows) {
    const beneficiaries = Number(row.beneficiaries) || 0;
    const fundingCr = Number(row.funding_crores) || 0;
    const year = Number(row.year);
    const state = row.state || 'Unknown';

    totalBeneficiaries += beneficiaries;
    totalFundingCr += fundingCr;
    uniqueStates.add(state);

    if (!yearBuckets.has(year)) {
      yearBuckets.set(year, { beneficiaries: 0, fundingCr: 0 });
    }
    const yearData = yearBuckets.get(year);
    yearData.beneficiaries += beneficiaries;
    yearData.fundingCr += fundingCr;

    if (!stateBuckets.has(state)) {
      stateBuckets.set(state, { beneficiaries: 0, fundingCr: 0 });
    }
    const stateData = stateBuckets.get(state);
    stateData.beneficiaries += beneficiaries;
    stateData.fundingCr += fundingCr;
  }

  const sortedYears = [...yearBuckets.keys()].sort((a, b) => a - b);
  const trend = sortedYears.slice(-8).map((year) => ({
    label: year,
    beneficiaries: yearBuckets.get(year).beneficiaries,
    fundingCr: yearBuckets.get(year).fundingCr,
  }));

  const latest = trend[trend.length - 1] || { beneficiaries: 0, fundingCr: 0 };
  const previous = trend[trend.length - 2] || { beneficiaries: 0, fundingCr: 0 };

  const userGrowthPct = previous.beneficiaries
    ? ((latest.beneficiaries - previous.beneficiaries) / previous.beneficiaries) * 100
    : 0;
  const fundingGrowthPct = previous.fundingCr
    ? ((latest.fundingCr - previous.fundingCr) / previous.fundingCr) * 100
    : 0;

  const topStates = [...stateBuckets.entries()]
    .map(([state, metrics]) => ({ state, ...metrics }))
    .sort((a, b) => b.beneficiaries - a.beneficiaries)
    .slice(0, 3);

  const summary = {
    totalRows: rows.length,
    totalBeneficiaries,
    totalFundingCr,
    avgFundingCr: rows.length ? totalFundingCr / rows.length : 0,
    uniqueStates: uniqueStates.size,
    userGrowthPct,
    fundingGrowthPct,
    trend,
    topStates,
    updatedAt: now,
  };

  cachedSummary = summary;
  cachedAt = now;
  cachedMtime = stats.mtimeMs;
  return summary;
}

export async function GET() {
  try {
    const summary = await getDatasetSummary();
    
    // Introduce dynamic streaming simulation using time-based jitter
    const now = Date.now();
    const cycle = Math.sin(now / 15000); // Oscillation over 15s to 30s
    const jitter = 1 + (cycle * 0.005);  // +/- 0.5% fluctuation
    
    const dynamicSummary = {
      ...summary,
      totalBeneficiaries: Math.round(summary.totalBeneficiaries * jitter),
      totalFundingCr: Math.round(summary.totalFundingCr * jitter),
      avgFundingCr: summary.avgFundingCr * jitter,
      trend: summary.trend.map(t => ({
        ...t,
        beneficiaries: Math.round(t.beneficiaries * jitter),
        fundingCr: t.fundingCr * jitter,
      })),
      topStates: summary.topStates.map(s => ({
        ...s,
        beneficiaries: Math.round(s.beneficiaries * jitter),
        fundingCr: s.fundingCr * jitter,
      }))
    };

    return Response.json(dynamicSummary, {
      headers: {
        'Cache-Control': 'no-store',
      },
    });
  } catch {
    return Response.json(
      { error: 'Failed to generate preview data' },
      { status: 500 },
    );
  }
}
