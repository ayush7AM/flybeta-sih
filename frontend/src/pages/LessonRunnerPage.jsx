import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getDomain } from '../services/api';
import MarkdownRenderer from '../components/MarkdownRenderer';

const TRACK_META = {
  'data-science': { accent: '#059669' },
  'ai-ml': { accent: '#6D28D9' },
  'cloud': { accent: '#2563EB' },
};

const DEFAULT_META = { accent: '#E52E2E' };

export default function LessonRunnerPage() {
  const { name, num, order } = useParams();
  const navigate = useNavigate();
  const [domain, setDomain] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const meta = TRACK_META[name] || DEFAULT_META;
  const levelNum = parseInt(num);
  const lessonOrder = parseInt(order);

  useEffect(() => {
    setLoading(true);
    getDomain(name)
      .then((data) => setDomain(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [name]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="brutalist-card p-8 text-center">
          <p className="heading-md">Loading Lesson...</p>
        </div>
      </div>
    );
  }

  if (error || !domain) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="brutalist-card p-8 text-center">
          <p className="heading-md text-primary mb-2">Lesson not found</p>
          <Link to={`/track/${name}`} className="brutalist-btn brutalist-btn-primary no-underline mt-4 inline-block">
            ← Back to Roadmap
          </Link>
        </div>
      </div>
    );
  }

  // Find current level and lesson
  const currentLevel = domain.levels?.find(l => l.number === levelNum);
  const currentLesson = currentLevel?.lessons?.find(l => l.order === lessonOrder);
  const allLessons = currentLevel?.lessons?.sort((a, b) => a.order - b.order) || [];

  if (!currentLevel || !currentLesson) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="brutalist-card p-8 text-center">
          <p className="heading-md text-primary mb-2">Lesson not found</p>
          <Link to={`/track/${name}`} className="brutalist-btn brutalist-btn-primary no-underline mt-4 inline-block">
            ← Back to Roadmap
          </Link>
        </div>
      </div>
    );
  }

  // Navigation helpers
  const currentIndex = allLessons.findIndex(l => l.order === lessonOrder);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  return (
    <div>
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2 label-mono text-muted flex-wrap">
        <Link to="/" className="no-underline text-muted hover:text-ink">Tracks</Link>
        <span>/</span>
        <Link to={`/track/${name}`} className="no-underline text-muted hover:text-ink">
          {domain.title}
        </Link>
        <span>/</span>
        <span>Level {levelNum}</span>
        <span>/</span>
        <span style={{ color: meta.accent }}>Lesson {lessonOrder}</span>
      </div>

      {/* Layout: Sidebar + Content */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar — Lesson List */}
        <aside className="lg:w-72 shrink-0">
          <div className="brutalist-card p-4 lg:sticky lg:top-24">
            <h3 className="heading-md text-sm mb-3 pb-2 border-b-2 border-ink">
              Level {levelNum}: {currentLevel.title}
            </h3>
            <ul className="list-none p-0 m-0">
              {allLessons.map((lesson) => {
                const isActive = lesson.order === lessonOrder;
                return (
                  <li key={lesson.id}>
                    <Link
                      to={`/track/${name}/level/${levelNum}/lesson/${lesson.order}`}
                      className={`flex items-center gap-2 py-2 px-2 no-underline text-sm border-b border-border-light transition-all ${
                        isActive
                          ? 'bg-ink text-white font-bold'
                          : 'text-ink hover:bg-canvas'
                      }`}
                    >
                      <span
                        className="w-5 h-5 flex items-center justify-center border text-xs shrink-0"
                        style={{
                          borderColor: isActive ? '#fff' : 'var(--color-ink)',
                          background: isActive ? meta.accent : 'transparent',
                          color: isActive ? '#fff' : 'var(--color-ink)',
                        }}
                      >
                        {lesson.order}
                      </span>
                      <span className="truncate">{lesson.title}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Lesson Header */}
          <div className="brutalist-card p-6 mb-6">
            <div className="flex items-center gap-3 mb-3 flex-wrap">
              {!currentLesson.is_mandatory && (
                <span className="brutalist-badge bg-gold-light text-gold">Bonus</span>
              )}
              <span className="brutalist-badge" style={{ background: meta.accent + '20', color: meta.accent }}>
                ⚡ {currentLesson.xp_reward} XP
              </span>
              <span className="brutalist-badge bg-gold-light text-gold">
                💰 {currentLesson.coins_reward} Coins
              </span>
            </div>
            <h1 className="heading-lg m-0">{currentLesson.title}</h1>
          </div>

          {/* Markdown Content */}
          <div className="brutalist-card p-8">
            <MarkdownRenderer content={currentLesson.content_md} />
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-6 gap-4">
            {prevLesson ? (
              <button
                onClick={() => navigate(`/track/${name}/level/${levelNum}/lesson/${prevLesson.order}`)}
                className="brutalist-btn bg-white text-ink"
              >
                ← Previous
              </button>
            ) : (
              <Link to={`/track/${name}`} className="brutalist-btn bg-white text-ink no-underline">
                ← Roadmap
              </Link>
            )}

            {nextLesson ? (
              <button
                onClick={() => navigate(`/track/${name}/level/${levelNum}/lesson/${nextLesson.order}`)}
                className="brutalist-btn brutalist-btn-primary"
              >
                Complete & Continue →
              </button>
            ) : (
              <Link
                to={`/track/${name}`}
                className="brutalist-btn brutalist-btn-primary no-underline"
              >
                ✓ Level Complete →
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
