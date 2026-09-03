import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { updateActiveTheme } from '../services/api';
import EditProfileModal from '../components/EditProfileModal';
import { useCompetency } from '../context/CompetencyContext';
import { Moon, Sun, LogOut } from 'lucide-react';
import ActivityHeatmap from '../components/ActivityHeatmap';



// ── Track metadata (matches DESIGN.md accent tokens) ────────────────────

const TRACK_META = {
  cloud:          { label: 'Cloud Computing',   color: '#2563EB', icon: '☁️' },
  ai:             { label: 'AI & ML',           color: '#6D28D9', icon: '🤖' },
  'data-science': { label: 'Data Science',      color: '#059669', icon: '📊' },
};

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user, refetchUser, loading, logout } = useAuth();
  const { themeKey, themes, themeKeys, setTheme, isDarkMode, toggleDarkMode } = useTheme();
  const { profile: compProfile, hasCompletedDiagnostic } = useCompetency();

  const [themeUpdating, setThemeUpdating] = useState(null); // key being updated
  const [editModalOpen, setEditModalOpen] = useState(false);

  // ── Profile save handler (from EditProfileModal) ──────────────────────
  const handleProfileSave = () => {
    refetchUser();
    setEditModalOpen(false);
  };

  // ── Auth guard ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!loading && !user) {
      navigate('/tracks', { replace: true });
    }
  }, [user, loading, navigate]);

  // ── Theme click handler ───────────────────────────────────────────────
  const handleThemeChange = async (key) => {
    if (key === themeKey) return;
    setThemeUpdating(key);
    // Apply immediately on the frontend
    setTheme(key);
    try {
      await updateActiveTheme(key);
      refetchUser();
    } catch (err) {
      console.error('Failed to save theme:', err);
    } finally {
      setThemeUpdating(null);
    }
  };

  // ── Loading skeleton ──────────────────────────────────────────────────
  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="brutalist-card p-8 text-center">
          <p className="label-mono text-muted">LOADING DASHBOARD...</p>
        </div>
      </div>
    );
  }

  const profile = user; // Alias for convenience below

  return (
    <div className="max-w-5xl mx-auto px-3 md:px-4 py-6 md:py-8 space-y-6 md:space-y-8">

      {/* ── Page Header ─────────────────────────────────────────────── */}
      <div>
        <h1 className="heading-xl">COMMAND CENTER</h1>
        <p className="text-muted label-mono mt-1">YOUR PILOT DASHBOARD</p>
      </div>

      {/* ── Mobile Quick Actions (visible only on mobile) ────────────── */}
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

            {/* Professional Badges */}
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
          </div>
        </div>
      </div>

      {/* ── Activity Heatmap ───────────────────────────────────────────── */}
      <ActivityHeatmap />

      {/* ── FRAC Baseline Competency ────────────────────────────────── */}
      <div className="brutalist-card p-4 md:p-6" style={{ background: 'var(--color-surface)' }}>
        <h3 className="heading-md mb-4">FRAC BASELINE COMPETENCY</h3>

        {!hasCompletedDiagnostic ? (
          <div className="bg-canvas border-2 border-ink p-4 flex justify-between items-center flex-wrap gap-4">
            <span className="label-mono text-muted">Assessment pending...</span>
            <button onClick={() => navigate('/diagnostic')} className="brutalist-btn brutalist-btn-primary">
              Take Assessment
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {[
              { key: 'comp_big_data_analytics', label: 'Big Data & Modern Statistics' },
              { key: 'comp_ai_ml_statistics', label: 'AI & ML in Official Statistics' },
              { key: 'comp_gis_spatial', label: 'GIS & Spatial Analytics' },
              { key: 'comp_cloud_infrastructure', label: 'Cloud Infrastructure for Gov Data' }
            ].map(domain => {
              const score = compProfile?.[domain.key] ?? 0;
              const isGap = score < 60;
              return (
                <div key={domain.key}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="label-mono font-bold">{domain.label}</span>
                    <span className="label-mono text-sm" style={{ color: isGap ? '#DC2626' : 'var(--color-emerald)' }}>
                      {score}%
                    </span>
                  </div>
                  <div className="w-full h-4 border-2 border-ink bg-canvas overflow-hidden">
                    <div
                      className="h-full transition-all duration-700 ease-out"
                      style={{
                        width: `${score}%`,
                        backgroundColor: isGap ? '#DC2626' : 'var(--color-primary)'
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Track Progress ──────────────────────────────────────────── */}
      <div className="brutalist-card p-4 md:p-6" style={{ background: 'var(--color-surface)' }}>
        <h3 className="heading-md mb-4">TRACK PROGRESS</h3>

        <div className="space-y-4">
          {Object.entries(TRACK_META).map(([slug, meta]) => {
            const dp = profile?.domain_progress?.find((d) => d.domain_name === slug);
            const highest = dp?.highest_unlocked_level || 1;
            const completed = Math.max(highest - 1, 0);
            const trackPct = Math.round((completed / 10) * 100);

            return (
              <div key={slug}>
                <div className="flex items-center justify-between mb-1">
                  <span className="label-mono font-bold flex items-center gap-2">
                    <span>{meta.icon}</span>
                    <span>{meta.label}</span>
                  </span>
                  <span className="label-mono text-muted text-sm">
                    {completed} / 10 Completed
                  </span>
                </div>
                <div
                  className="w-full h-5 border-3 border-ink relative overflow-hidden"
                  style={{
                    backgroundColor: 'var(--color-canvas)',
                    borderWidth: '3px',
                  }}
                >
                  <div
                    className="h-full transition-all duration-500 ease-out"
                    style={{
                      width: `${trackPct}%`,
                      backgroundColor: meta.color,
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
                {/* Active indicator */}
                {isActive && (
                  <span
                    className="absolute -top-2 -right-2 w-6 h-6 flex items-center justify-center border-2 border-ink text-xs font-bold"
                    style={{ backgroundColor: primaryColor, color: 'white' }}
                  >
                    ✓
                  </span>
                )}

                {/* Theme icon */}
                <span className="text-3xl">{t.icon}</span>

                {/* Color swatch */}
                <div
                  className="w-full h-3 border-2"
                  style={{
                    backgroundColor: primaryColor,
                    borderColor: borderColor,
                  }}
                />

                {/* Label */}
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
