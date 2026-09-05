import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ALL_TAGS, COMPETENCY_META } from '../data/competencyTaxonomy';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis,
  PolarRadiusAxis, Radar, LineChart, Line, AreaChart, Area,
} from 'recharts';
import { ArrowLeft, Building2, Users, TrendingUp, AlertTriangle } from 'lucide-react';

// ── Mock Data: Division-wide competency averages ────────────────────

const DIVISION_SCORES = [
  { division: 'NSO', comp_statistical: 72, comp_technical: 58, comp_digital_governance: 45, comp_behavioural: 65 },
  { division: 'CSO', comp_statistical: 78, comp_technical: 62, comp_digital_governance: 50, comp_behavioural: 68 },
  { division: 'DPD', comp_statistical: 55, comp_technical: 75, comp_digital_governance: 60, comp_behavioural: 52 },
  { division: 'SDRD', comp_statistical: 82, comp_technical: 48, comp_digital_governance: 42, comp_behavioural: 58 },
  { division: 'FOD', comp_statistical: 68, comp_technical: 42, comp_digital_governance: 38, comp_behavioural: 70 },
  { division: 'NAD', comp_statistical: 85, comp_technical: 55, comp_digital_governance: 48, comp_behavioural: 62 },
  { division: 'DIID', comp_statistical: 60, comp_technical: 70, comp_digital_governance: 65, comp_behavioural: 55 },
];

// ── Mock Data: Cadre-level skill gaps ───────────────────────────────

const CADRE_GAPS = [
  { cadre: 'JSO', comp_statistical: 45, comp_technical: 35, comp_digital_governance: 30, comp_behavioural: 40 },
  { cadre: 'SSO', comp_statistical: 65, comp_technical: 55, comp_digital_governance: 45, comp_behavioural: 55 },
  { cadre: 'Asst. Dir', comp_statistical: 72, comp_technical: 60, comp_digital_governance: 55, comp_behavioural: 62 },
  { cadre: 'Dy. Dir', comp_statistical: 80, comp_technical: 65, comp_digital_governance: 60, comp_behavioural: 70 },
];

// ── Mock Data: Training effectiveness over quarters ─────────────────

const TRAINING_EFFECTIVENESS = [
  { quarter: 'Q1 2025', iGOT_completion: 45, NSSTA_completion: 62, avg_score_improvement: 8 },
  { quarter: 'Q2 2025', iGOT_completion: 52, NSSTA_completion: 58, avg_score_improvement: 12 },
  { quarter: 'Q3 2025', iGOT_completion: 61, NSSTA_completion: 70, avg_score_improvement: 15 },
  { quarter: 'Q4 2025', iGOT_completion: 68, NSSTA_completion: 75, avg_score_improvement: 18 },
  { quarter: 'Q1 2026', iGOT_completion: 74, NSSTA_completion: 80, avg_score_improvement: 22 },
  { quarter: 'Q2 2026', iGOT_completion: 78, NSSTA_completion: 82, avg_score_improvement: 25 },
];

// ── Summary stats ───────────────────────────────────────────────────

const SUMMARY_STATS = [
  { label: 'Total Officers', value: '2,847', icon: Users, color: '#2563EB' },
  { label: 'Active Divisions', value: '7', icon: Building2, color: '#7C3AED' },
  { label: 'Avg Competency', value: '58.4%', icon: TrendingUp, color: '#059669' },
  { label: 'Critical Gaps', value: '3', icon: AlertTriangle, color: '#DC2626' },
];

const BAR_COLORS = ['#2563EB', '#7C3AED', '#059669', '#EA580C'];

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState('divisions');

  return (
    <div className="max-w-6xl mx-auto px-3 md:px-4 py-6 md:py-8 space-y-6 md:space-y-8">

      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Link
              to="/dashboard"
              className="brutalist-badge bg-canvas text-ink no-underline cursor-pointer hover:bg-border-light transition-colors flex items-center gap-1"
            >
              <ArrowLeft size={14} /> Learner View
            </Link>
            <span className="brutalist-badge" style={{ background: '#DC2626', color: '#fff' }}>
              ADMIN
            </span>
          </div>
          <h1 className="heading-xl m-0">DIID ANALYTICS</h1>
          <p className="text-muted label-mono mt-1">ENTERPRISE CAPACITY MONITORING</p>
        </div>
      </div>

      {/* ── Summary Cards ─────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {SUMMARY_STATS.map((stat) => (
          <div
            key={stat.label}
            className="brutalist-card p-4"
            style={{ background: 'var(--color-surface)' }}
          >
            <div className="flex items-center gap-2 mb-2">
              <stat.icon size={18} style={{ color: stat.color }} />
              <span className="label-mono text-xs text-muted">{stat.label}</span>
            </div>
            <p className="heading-lg m-0" style={{ color: stat.color, fontSize: '1.5rem' }}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* ── Tab Selector ──────────────────────────────────────── */}
      <div className="flex gap-2">
        {[
          { key: 'divisions', label: 'Division Heatmap' },
          { key: 'cadres', label: 'Cadre Analysis' },
          { key: 'training', label: 'Training Effectiveness' },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className="label-mono text-xs px-4 py-2 cursor-pointer transition-all"
            style={{
              borderRadius: 'var(--border-radius)',
              border: '2px solid',
              borderColor: activeTab === key ? 'var(--color-primary)' : 'var(--color-border)',
              background: activeTab === key ? 'var(--color-primary)' : 'var(--color-surface)',
              color: activeTab === key ? '#fff' : 'var(--color-muted)',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── Tab Content ───────────────────────────────────────── */}

      {/* Division-wide Competency Heatmap */}
      {activeTab === 'divisions' && (
        <div className="brutalist-card p-4 md:p-6" style={{ background: 'var(--color-surface)' }}>
          <h3 className="heading-md mb-2">Division-Wide Competency Scores</h3>
          <p className="text-muted text-xs label-mono mb-4">
            Average FRAC scores across 7 divisions — identifies systemic skill gaps
          </p>
          <div style={{ width: '100%', height: 400 }}>
            <ResponsiveContainer>
              <BarChart data={DIVISION_SCORES} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis
                  dataKey="division"
                  tick={{ fill: 'var(--color-muted)', fontSize: 11, fontFamily: 'var(--font-mono)' }}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fill: 'var(--color-muted)', fontSize: 10 }}
                />
                <Tooltip
                  contentStyle={{
                    background: 'var(--color-surface)',
                    border: '2px solid var(--color-border)',
                    borderRadius: 'var(--border-radius)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: 11,
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 11, fontFamily: 'var(--font-mono)' }} />
                {ALL_TAGS.map((tag, i) => (
                  <Bar
                    key={tag}
                    dataKey={tag}
                    name={COMPETENCY_META[tag].shortLabel}
                    fill={BAR_COLORS[i]}
                    radius={[2, 2, 0, 0]}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Critical gaps callout */}
          <div className="mt-4 p-3 flex items-start gap-3" style={{ background: '#FEF2F2', borderRadius: 'var(--border-radius)', border: '1px solid #FECACA' }}>
            <AlertTriangle size={18} style={{ color: '#DC2626', marginTop: 2 }} />
            <div>
              <p className="label-mono text-xs font-bold m-0" style={{ color: '#DC2626' }}>CRITICAL GAPS IDENTIFIED</p>
              <p className="text-xs text-muted m-0 mt-1">
                FOD &amp; SDRD show Digital Governance scores below 42% — recommend prioritizing NSSTA cybersecurity &amp; Gov-Cloud programmes.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Cadre-level Skill Gaps */}
      {activeTab === 'cadres' && (
        <div className="brutalist-card p-4 md:p-6" style={{ background: 'var(--color-surface)' }}>
          <h3 className="heading-md mb-2">Skill Gaps by Cadre (JSO → Dy. Director)</h3>
          <p className="text-muted text-xs label-mono mb-4">
            Aggregate competency levels across designation groups
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Radar view */}
            <div style={{ width: '100%', height: 350 }}>
              <ResponsiveContainer>
                <RadarChart data={ALL_TAGS.map((tag) => ({
                  quadrant: COMPETENCY_META[tag].shortLabel,
                  JSO: CADRE_GAPS.find(c => c.cadre === 'JSO')?.[tag] ?? 0,
                  SSO: CADRE_GAPS.find(c => c.cadre === 'SSO')?.[tag] ?? 0,
                  'Dy. Dir': CADRE_GAPS.find(c => c.cadre === 'Dy. Dir')?.[tag] ?? 0,
                }))}>
                  <PolarGrid stroke="var(--color-border)" />
                  <PolarAngleAxis
                    dataKey="quadrant"
                    tick={{ fill: 'var(--color-muted)', fontSize: 11, fontFamily: 'var(--font-mono)' }}
                  />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: 'var(--color-muted)', fontSize: 10 }} />
                  <Radar name="JSO" dataKey="JSO" stroke="#DC2626" fill="#DC2626" fillOpacity={0.15} strokeWidth={2} />
                  <Radar name="SSO" dataKey="SSO" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.15} strokeWidth={2} />
                  <Radar name="Dy. Director" dataKey="Dy. Dir" stroke="#059669" fill="#059669" fillOpacity={0.15} strokeWidth={2} />
                  <Legend wrapperStyle={{ fontSize: 11, fontFamily: 'var(--font-mono)' }} />
                  <Tooltip
                    contentStyle={{
                      background: 'var(--color-surface)',
                      border: '2px solid var(--color-border)',
                      borderRadius: 'var(--border-radius)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: 11,
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Table view */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs label-mono" style={{ borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--color-border)' }}>
                    <th className="text-left py-2 px-2 text-muted">Cadre</th>
                    {ALL_TAGS.map(tag => (
                      <th key={tag} className="text-center py-2 px-2 text-muted">{COMPETENCY_META[tag].icon}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {CADRE_GAPS.map((row) => (
                    <tr key={row.cadre} style={{ borderBottom: '1px solid var(--color-border)' }}>
                      <td className="py-2 px-2 font-bold">{row.cadre}</td>
                      {ALL_TAGS.map(tag => {
                        const val = row[tag];
                        const isLow = val < 50;
                        return (
                          <td key={tag} className="text-center py-2 px-2" style={{ color: isLow ? '#DC2626' : 'var(--color-emerald)' }}>
                            {val}%
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Training Programme Effectiveness */}
      {activeTab === 'training' && (
        <div className="brutalist-card p-4 md:p-6" style={{ background: 'var(--color-surface)' }}>
          <h3 className="heading-md mb-2">Training Programme Effectiveness</h3>
          <p className="text-muted text-xs label-mono mb-4">
            Completion rates &amp; score improvement trends (iGOT + NSSTA TPAC)
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Completion rates */}
            <div>
              <p className="label-mono text-xs font-bold mb-2 text-muted">COMPLETION RATES (%)</p>
              <div style={{ width: '100%', height: 280 }}>
                <ResponsiveContainer>
                  <AreaChart data={TRAINING_EFFECTIVENESS} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                    <XAxis dataKey="quarter" tick={{ fill: 'var(--color-muted)', fontSize: 10, fontFamily: 'var(--font-mono)' }} />
                    <YAxis domain={[0, 100]} tick={{ fill: 'var(--color-muted)', fontSize: 10 }} />
                    <Tooltip
                      contentStyle={{
                        background: 'var(--color-surface)',
                        border: '2px solid var(--color-border)',
                        borderRadius: 'var(--border-radius)',
                        fontFamily: 'var(--font-mono)',
                        fontSize: 11,
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: 11, fontFamily: 'var(--font-mono)' }} />
                    <Area type="monotone" dataKey="iGOT_completion" name="iGOT" stroke="#2563EB" fill="#2563EB" fillOpacity={0.15} strokeWidth={2} />
                    <Area type="monotone" dataKey="NSSTA_completion" name="NSSTA" stroke="#7C3AED" fill="#7C3AED" fillOpacity={0.15} strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Score improvement */}
            <div>
              <p className="label-mono text-xs font-bold mb-2 text-muted">AVG SCORE IMPROVEMENT (pts)</p>
              <div style={{ width: '100%', height: 280 }}>
                <ResponsiveContainer>
                  <LineChart data={TRAINING_EFFECTIVENESS} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                    <XAxis dataKey="quarter" tick={{ fill: 'var(--color-muted)', fontSize: 10, fontFamily: 'var(--font-mono)' }} />
                    <YAxis tick={{ fill: 'var(--color-muted)', fontSize: 10 }} />
                    <Tooltip
                      contentStyle={{
                        background: 'var(--color-surface)',
                        border: '2px solid var(--color-border)',
                        borderRadius: 'var(--border-radius)',
                        fontFamily: 'var(--font-mono)',
                        fontSize: 11,
                      }}
                    />
                    <Line type="monotone" dataKey="avg_score_improvement" name="Score Δ" stroke="#059669" strokeWidth={3} dot={{ fill: '#059669', r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
