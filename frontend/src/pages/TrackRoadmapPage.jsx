import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getDomain, getCachedDomain } from '../services/api';
import { useTheme } from '../context/ThemeContext';
import { useUser } from '../context/UserContext';
import LevelNode from '../components/ui/LevelNode';

export default function TrackRoadmapPage() {
  const { name } = useParams();
  const { themeKey } = useTheme();
  const { user } = useUser();
  const cached = getCachedDomain(name);
  const [domain, setDomain] = useState(cached);
  const [loading, setLoading] = useState(!cached);
  const [error, setError] = useState(null);

  useEffect(() => {
    // SWR pattern: fetch silently to revalidate
    getDomain(name)
      .then((data) => setDomain(data))
      .catch((err) => {
        if (!cached) setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [name, cached]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="brutalist-card p-8 text-center">
          <p className="heading-md">Loading Roadmap...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="brutalist-card p-8 text-center">
          <p className="heading-md text-primary mb-2">Track not found</p>
          <Link to="/" className="brutalist-btn brutalist-btn-primary no-underline mt-4 inline-block">
            ← Back to Tracks
          </Link>
        </div>
      </div>
    );
  }

  const levels = domain?.levels || [];
  const totalLessons = levels.reduce((acc, l) => acc + (l.lessons?.length || 0), 0);
  
  const domainProgress = user?.domain_progress?.find(p => p.domain_name === name);
  const highestUnlockedLevel = domainProgress?.highest_unlocked_level || 1;

  return (
    <div>
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2 label-mono text-muted">
        <Link to="/" className="no-underline text-muted hover:text-ink">Tracks</Link>
        <span>/</span>
        <span style={{ color: 'var(--color-primary)' }}>{domain?.title || name}</span>
      </div>

      {/* Hero */}
      <header className="mb-12">
        <div className="bg-surface border-2 border-ink p-8 inline-block"
             style={{ boxShadow: 'var(--shadow-brutal-lg)' }}>
          <div className="flex items-center gap-4 mb-2">
            <div
              className="brutalist-badge"
              style={{ background: 'var(--color-primary)', color: 'var(--color-canvas)' }}
            >
              TRACK
            </div>
            <span className="label-mono text-muted">
              {levels.length} Levels • {totalLessons} Lessons
            </span>
          </div>
          <h1 className="heading-xl m-0" style={{ color: 'var(--color-primary)' }}>
            {domain?.title || name}
          </h1>
        </div>
      </header>

      {/* Roadmap */}
      <div className="max-w-3xl">
        {levels.length > 0 ? (
          levels
            .sort((a, b) => a.number - b.number)
            .map((level) => (
              <LevelNode
                key={level.id}
                level={level}
                domainName={name}
                isActive={level.number === 1}
                isLocked={level.number > highestUnlockedLevel}
              />
            ))
        ) : (
          <div className="brutalist-card p-12 text-center">
            <p className="heading-md text-muted mb-2">No levels yet</p>
            <p className="text-sm text-muted">
              Content for this track hasn't been loaded.
            </p>
          </div>
        )}

        {/* End cap */}
        {levels.length > 0 && (
          <div className="flex items-center gap-6">
            <div className="flex flex-col items-center">
              <div
                className="w-12 h-12 flex items-center justify-center border-2 border-ink text-white text-xl"
                style={{ background: 'var(--color-primary)', boxShadow: 'var(--shadow-brutal-sm)' }}
              >
                🏆
              </div>
            </div>
            <div className="flex-1 border-2 border-ink p-4" style={{ background: 'color-mix(in srgb, var(--color-primary) 8%, transparent)' }}>
              <p className="heading-md m-0" style={{ color: 'var(--color-primary)' }}>
                Track Complete!
              </p>
              <p className="text-sm text-muted m-0 mt-1">
                Master all {levels.length} levels to earn your certificate.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
