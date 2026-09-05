import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { updateActiveTheme } from '../services/api';
import EditProfileModal from '../components/EditProfileModal';
import { useCompetency } from '../context/CompetencyContext';
import { Moon, Sun, LogOut, Building2, Briefcase, Clock, GraduationCap } from 'lucide-react';
import ActivityHeatmap from '../components/ActivityHeatmap';
import { ALL_TAGS, COMPETENCY_META, TARGET_FRAMEWORK } from '../data/competencyTaxonomy';
import { MOSPI_TRACKS } from '../data/tracksData';
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  Radar, Legend, ResponsiveContainer, Tooltip
} from 'recharts';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user, refetchUser, loading, logout } = useAuth();
  const { themeKey, themes, themeKeys, setTheme, isDarkMode, toggleDarkMode } = useTheme();
  const {
    profile: compProfile,
    hasCompletedDiagnostic,
    userDesignation,
    userDivision,
    yearsOfService,
  } = useCompetency();

  const [themeUpdating, setThemeUpdating] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const handleProfileSave = () => {
    refetchUser();
    setEditModalOpen(false);
  };

  useEffect(() => {
    if (!loading && !user) {
      navigate('/tracks', { replace: true });
    }
  }, [user, loading, navigate]);

  const handleThemeChange = async (key) => {
    if (key === themeKey) return;
    setThemeUpdating(key);
    setTheme(key);
    if (user) {
      try {
        await updateActiveTheme(key);
        refetchUser();
      } catch (err) {
        console.error('Failed to save theme:', err);
      }
    }
    setThemeUpdating(null);
  };

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="brutalist-card p-8 text-center">
          <p className="label-mono text-muted">LOADING DASHBOARD...</p>
        </div>
      </div>
    );
  }

  const profile = user;

  // ── Radar chart data ────────────────────────────────────────────
  const radarData = ALL_TAGS.map((tag) => {
    const meta = COMPETENCY_META[tag];
    const actual = compProfile?.[tag] ?? 0;
    const target = TARGET_FRAMEWORK[compProfile?.designation || userDesignation]?.[tag] ?? 60;
    return {
      quadrant: meta.shortLabel,
      'Your Score': actual,
      'Target': target,
      fullMark: 100,
    };
  });

  return (
    <div className="max-w-5xl mx-auto px-3 md:px-4 py-6 md:py-8 space-y-6 md:space-y-8">

      {/* ── Page Header ─────────────────────────────────────────────── */}
      <div>
        <h1 className="heading-xl">COMMAND CENTER</h1>
        <p className="text-muted label-mono mt-1">YOUR PILOT DASHBOARD</p>
      </div>

      {/* ── Mobile Quick Actions ────────────────────────────────────── */}
      <div className="flex md:hidden items-center gap-2">
        <button
          onClick={toggleDarkMode}
          className="brutalist-badge bg-canvas text-ink cursor-pointer hover:bg-border-light transition-colors p-2 flex items-center gap-2"
        >
          {isDarkMode ? <Moon size={16} /> : <Sun size={16} />}
          <span className="text-xs">{isDarkMode ? 'Dark' : 'Light'}</span>
        </button>
        <button
          onClick={logout}
          className="brutalist-badge bg-red-100 text-red-700 cursor-pointer hover:bg-red-200 transition-colors p-2 flex items-center gap-2"
        >
          <LogOut size={16} />
          <span className="text-xs">Logout</span>
        </button>
      </div>

      {/* ── Hero Identity Card ──────────────────────────────────────── */}
      <div
        id="tour-identity"
        className="brutalist-card p-4 md:p-8"
        style={{ background: 'var(--color-surface)' }}
      >
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          {/* Avatar */}
          <div
            className="w-16 h-16 md:w-24 md:h-24 border-3 md:border-4 border-ink shrink-0 overflow-hidden"
            style={{
              backgroundColor: 'var(--color-surface)',
              boxShadow: 'var(--shadow-brutal-sm)',
            }}
          >
            {profile?.avatar ? (
              <img
                src={profile.avatar}
                alt="User avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center" style={{ fontSize: '1.8rem' }}>
                👤
              </div>
            )}
          </div>

          {/* Identity */}
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="heading-lg text-xl md:text-2xl" style={{ margin: 0, textTransform: 'none' }}>
                {profile?.name || profile?.username}
              </h2>
              <button
                onClick={() => setEditModalOpen(true)}
                className="brutalist-badge bg-canvas text-ink cursor-pointer hover:bg-border-light transition-colors"
                title="Edit Profile"
              >
                ✏️ Edit
              </button>
            </div>
            <p className="label-mono text-muted" style={{ textTransform: 'none' }}>@{profile?.username}</p>

            {/* Bio */}
            {profile?.bio && (
              <p className="text-sm mt-1" style={{ color: 'var(--color-muted)', fontFamily: 'var(--font-body)', textTransform: 'none' }}>
                {profile.bio}
              </p>
            )}

            {/* Professional Info Badges */}
            <div className="flex flex-wrap gap-2 md:gap-3 mt-3">
              <span className="brutalist-badge bg-primary text-white border-transparent">
                MoSPI Official
              </span>
              {hasCompletedDiagnostic && (
                <span className="brutalist-badge bg-emerald-100 text-emerald-800 border-emerald-800">
                  FRAC Assessed
                </span>
              )}
            </div>

            {/* Designation/Division/YoS Info */}
            {(userDesignation || userDivision || yearsOfService) && (
              <div className="flex flex-wrap gap-3 mt-3 pt-3" style={{ borderTop: '1px solid var(--color-border)' }}>
                {userDesignation && (
                  <div className="flex items-center gap-1.5 text-xs text-muted">
                    <Briefcase size={14} style={{ color: 'var(--color-primary)' }} />
                    <span className="label-mono">{userDesignation}</span>
                  </div>
                )}
                {userDivision && (
                  <div className="flex items-center gap-1.5 text-xs text-muted">
                    <Building2 size={14} style={{ color: 'var(--color-primary)' }} />
                    <span className="label-mono">{userDivision}</span>
                  </div>
                )}
                {yearsOfService && (
                  <div className="flex items-center gap-1.5 text-xs text-muted">
                    <Clock size={14} style={{ color: 'var(--color-primary)' }} />
                    <span className="label-mono">{yearsOfService}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Activity Heatmap ───────────────────────────────────────────── */}
      <ActivityHeatmap />

      {/* ── FRAC Competency Radar Chart ──────────────────────────────── */}
      <div id="tour-radar" className="brutalist-card p-4 md:p-6" style={{ background: 'var(--color-surface)' }}>
        <h3 className="heading-md mb-4">FRAC COMPETENCY PROFILE</h3>

        {!hasCompletedDiagnostic ? (
          <div className="bg-canvas p-4 flex justify-between items-center flex-wrap gap-4"
               style={{ border: 'var(--border-width) solid var(--color-border)', borderRadius: 'var(--border-radius)' }}>
            <span className="label-mono text-muted">Assessment pending...</span>
            <button onClick={() => navigate('/diagnostic')} className="brutalist-btn brutalist-btn-primary">
              Take Assessment
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Radar Chart */}
            <div style={{ width: '100%', height: 320 }}>
              <ResponsiveContainer>
                <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="75%">
                  <PolarGrid stroke="var(--color-border)" />
                  <PolarAngleAxis
                    dataKey="quadrant"
                    tick={{ fill: 'var(--color-muted)', fontSize: 11, fontFamily: 'var(--font-mono)' }}
                  />
                  <PolarRadiusAxis
                    angle={90}
                    domain={[0, 100]}
                    tick={{ fill: 'var(--color-muted)', fontSize: 10 }}
                  />
                  <Radar
                    name="Target"
                    dataKey="Target"
                    stroke="#94a3b8"
                    fill="#94a3b8"
                    fillOpacity={0.15}
                    strokeWidth={2}
                    strokeDasharray="5 5"
                  />
                  <Radar
                    name="Your Score"
                    dataKey="Your Score"
                    stroke="var(--color-primary)"
                    fill="var(--color-primary)"
                    fillOpacity={0.25}
                    strokeWidth={2}
                  />
                  <Legend
                    wrapperStyle={{ fontSize: 11, fontFamily: 'var(--font-mono)' }}
                  />
                  <Tooltip
                    contentStyle={{
                      background: 'var(--color-surface)',
                      border: '2px solid var(--color-border)',
                      borderRadius: 'var(--border-radius)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: 12,
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Linear bars alongside */}
            <div className="space-y-4">
              {ALL_TAGS.map(tag => {
                const meta = COMPETENCY_META[tag];
                const score = compProfile?.[tag] ?? 0;
                const target = TARGET_FRAMEWORK[compProfile?.designation]?.[tag] ?? 60;
                const isGap = score < target;
                return (
                  <div key={tag}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="label-mono font-bold text-sm">{meta.icon} {meta.label}</span>
                      <span className="label-mono text-sm" style={{ color: isGap ? '#DC2626' : 'var(--color-emerald)' }}>
                        {score}% <span className="text-muted text-xs">/ {target}%</span>
                      </span>
                    </div>
                    <div className="w-full h-3 bg-canvas overflow-hidden"
                         style={{ border: 'var(--border-width) solid var(--color-border)', borderRadius: 'var(--border-radius)' }}>
                      <div
                        className="h-full transition-all duration-700 ease-out"
                        style={{
                          width: `${score}%`,
                          backgroundColor: isGap ? '#DC2626' : meta.color,
                          borderRadius: 'var(--border-radius)',
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ── MoSPI Track Progress ──────────────────────────────────────── */}
      <div className="brutalist-card p-4 md:p-6" style={{ background: 'var(--color-surface)' }}>
        <h3 className="heading-md mb-4">LEARNING TRACK PROGRESS</h3>

        <div className="space-y-4">
          {MOSPI_TRACKS.map((track) => {
            const meta = COMPETENCY_META[track.frac_competency_tag] || {};
            const dp = profile?.domain_progress?.find((d) => d.domain_name === track.id);
            const highest = dp?.highest_unlocked_level || 1;
            const completed = Math.max(highest - 1, 0);
            const totalModules = track.modulesCount || track.modules?.length || 4;
            const trackPct = Math.round((completed / totalModules) * 100);

            return (
              <div key={track.id}>
                <div className="flex items-center justify-between mb-1">
                  <span className="label-mono font-bold flex items-center gap-2 text-sm">
                    <span>{meta.icon || '📘'}</span>
                    <span>{track.title}</span>
                  </span>
                  <span className="label-mono text-muted text-xs">
                    {completed} / {totalModules} Modules
                  </span>
                </div>
                <div
                  className="w-full h-4 relative overflow-hidden"
                  style={{
                    backgroundColor: 'var(--color-canvas)',
                    border: 'var(--border-width) solid var(--color-border)',
                    borderRadius: 'var(--border-radius)',
                  }}
                >
                  <div
                    className="h-full transition-all duration-500 ease-out"
                    style={{
                      width: `${trackPct}%`,
                      backgroundColor: meta.color || 'var(--color-primary)',
                      borderRadius: 'var(--border-radius)',
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Theme Selector ──────────────────────────────────────────── */}
      <div className="brutalist-card p-4 md:p-6" style={{ background: 'var(--color-surface)' }}>
        <h3 className="heading-md mb-2">TERMINAL THEME</h3>
        <p className="label-mono text-muted text-sm mb-4">
          SELECT YOUR VISUAL IDENTITY — CHANGES APPLY GLOBALLY
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {themeKeys.map((key) => {
            const t = themes[key];
            const isActive = key === themeKey;
            const isUpdating = themeUpdating === key;
            const primaryColor = t.vars['--color-primary'];
            const borderColor = t.vars['--color-border'] || t.vars['--color-ink'];

            return (
              <button
                key={key}
                onClick={() => handleThemeChange(key)}
                disabled={isUpdating}
                className="relative flex flex-col items-center gap-2 p-4 border-4 cursor-pointer transition-all"
                style={{
                  borderColor: isActive ? borderColor : 'var(--color-border-light)',
                  backgroundColor: isActive ? t.vars['--color-canvas'] : 'var(--color-surface)',
                  boxShadow: isActive ? `6px 6px 0px 0px ${borderColor}` : 'none',
                  transform: isActive ? 'translate(-2px, -2px)' : 'none',
                  opacity: isUpdating ? 0.6 : 1,
                }}
              >
                {isActive && (
                  <span
                    className="absolute -top-2 -right-2 w-6 h-6 flex items-center justify-center border-2 border-ink text-xs font-bold"
                    style={{ backgroundColor: primaryColor, color: 'white' }}
                  >
                    ✓
                  </span>
                )}
                <span className="text-3xl">{t.icon}</span>
                <div
                  className="w-full h-3 border-2"
                  style={{
                    backgroundColor: primaryColor,
                    borderColor: borderColor,
                  }}
                />
                <span
                  className="label-mono text-xs font-bold text-center"
                  style={{ color: isActive ? borderColor : 'var(--color-muted)' }}
                >
                  {t.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Edit Profile Modal ──────────────────────────────────────── */}
      {editModalOpen && (
        <EditProfileModal
          profile={profile}
          onSave={handleProfileSave}
          onClose={() => setEditModalOpen(false)}
        />
      )}
    </div>
  );
}
