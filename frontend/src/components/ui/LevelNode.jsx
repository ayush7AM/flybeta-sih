import { Link } from 'react-router-dom';
import { Lock } from 'lucide-react';

export default function LevelNode({ level, domainName, isActive, isLocked }) {
  const lessonCount = level.lessons?.length || 0;
  const mandatoryCount = level.lessons?.filter(l => l.is_mandatory).length || 0;

  return (
    <div className="relative flex items-start gap-6">
      {/* Connector Line (vertical) */}
      <div className="flex flex-col items-center">
        <div
          className="w-12 h-12 flex items-center justify-center border-2 border-ink font-bold text-lg z-10"
          style={{
            background: isActive ? 'var(--color-primary)' : 'var(--color-surface)',
            color: isActive ? 'var(--color-canvas)' : 'var(--color-ink)',
            boxShadow: isActive ? 'var(--shadow-brutal-sm)' : 'none',
          }}
        >
          {level.number}
        </div>
        {/* Vertical line */}
        <div className="w-0.5 h-8 bg-ink" />
      </div>

      {/* Level Card */}
      <div
        className={`flex-1 border-2 border-ink p-4 mb-4 transition-all relative ${
          isActive ? 'bg-surface' : 'bg-canvas'
        } ${isLocked ? 'grayscale opacity-60 pointer-events-none select-none' : ''}`}
        style={{
          boxShadow: isActive && !isLocked ? 'var(--shadow-brutal-sm)' : 'none',
        }}
      >
        {isLocked && (
          <div className="absolute inset-0 z-20 flex items-center justify-center">
            <Lock className="w-20 h-20 text-ink" strokeWidth={3} />
          </div>
        )}
        <div className={`relative z-10`}>
          <div className="flex items-center justify-between mb-2">
          <h3 className="heading-md text-lg m-0">{level.title}</h3>
          <span className="label-mono text-muted">
            {lessonCount} lesson{lessonCount !== 1 ? 's' : ''}
          </span>
        </div>

        {level.description && (
          <p className="text-sm text-muted m-0 mb-3">{level.description}</p>
        )}

        {/* Lesson list */}
        {level.lessons && level.lessons.length > 0 && (
          <div className="border-t border-border-light pt-3 mt-2">
            <ul className="list-none p-0 m-0">
              {level.lessons.map((lesson) => (
                <li key={lesson.id} className="flex items-center justify-between py-1.5 border-b border-border-light last:border-b-0">
                  <Link
                    to={`/track/${domainName}/level/${level.number}/lesson/${lesson.order}`}
                    className="no-underline text-ink hover:text-primary transition-colors flex items-center gap-2 text-sm"
                  >
                    <span className="w-5 h-5 flex items-center justify-center border border-ink text-xs">
                      {lesson.order}
                    </span>
                    {lesson.title}
                    {!lesson.is_mandatory && (
                      <span className="brutalist-badge text-xs bg-gold-light text-gold ml-1">Bonus</span>
                    )}
                  </Link>
                  <span className="label-mono text-xs text-muted">{lesson.xp_reward} XP</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Mandatory count */}
        <div className="mt-3 flex items-center gap-2">
          <span className="label-mono text-xs" style={{ color: 'var(--color-primary)' }}>
            {mandatoryCount} mandatory
          </span>
          {lessonCount - mandatoryCount > 0 && (
            <span className="label-mono text-xs text-muted">
              • {lessonCount - mandatoryCount} bonus
            </span>
          )}
        </div>
        </div>
      </div>
    </div>
  );
}
