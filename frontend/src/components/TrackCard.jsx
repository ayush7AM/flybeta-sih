import { Link } from 'react-router-dom';
import { Cloud, Bot, BarChart3, BookOpen, BrainCircuit, Database, Code, Rocket } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ICON_MAP = {
  'cloud': Cloud,
  'robot': Bot,
  'chart-bar': BarChart3,
  'brain': BrainCircuit,
  'database': Database,
  'code': Code,
  'rocket': Rocket,
};

const TRACK_CODES = {
  'data-science': 'TS-01',
  'ai-ml': 'TS-02',
  'cloud': 'TS-03',
  'ai': 'TS-02',
  'data': 'TS-01',
};

export default function TrackCard({ domain }) {
  const { themeKey } = useTheme();
  const trackCode = TRACK_CODES[domain.name] || 'TS-00';
  const levelCount = domain.levels?.length || 0;
  const IconComponent = ICON_MAP[domain.icon] || BookOpen;

  return (
    <article className="brutalist-card flex flex-col overflow-hidden">
      {/* Track Image Header */}
      <div
        className="h-52 border-b-2 relative flex items-center justify-center"
        style={{
          borderColor: 'var(--color-border)',
          background: 'var(--color-canvas)',
        }}
      >
        {/* Track Code Badge */}
        <div
          className="absolute top-4 left-4 label-mono px-2 py-1 border"
          style={{
            background: 'var(--color-primary)',
            color: 'var(--color-canvas)',
            borderColor: 'var(--color-border)',
          }}
        >
          {trackCode}
        </div>
        {/* Lucide Icon */}
        <IconComponent
          size={72}
          strokeWidth={1.5}
          style={{ color: 'var(--color-primary)', opacity: 0.3 }}
        />
      </div>

      {/* Card Body */}
      <div className="p-6 flex-grow flex flex-col">
        <div className="mb-4">
          <span
            className="brutalist-badge mb-2"
            style={{
              background: 'var(--color-primary)',
              color: 'var(--color-canvas)',
            }}
          >
            TRACK
          </span>
          <h2 className="heading-md mt-2">{domain.title}</h2>
        </div>

        {/* Level info */}
        <div className="border-t-2 pt-4 flex-grow" style={{ borderColor: 'var(--color-border)' }}>
          <div className="flex items-center gap-2 mb-2 text-muted">
            <span className="label-mono">{levelCount} Levels</span>
            <span className="text-border-light">•</span>
            <span className="label-mono">
              {domain.levels?.reduce((acc, l) => acc + (l.lessons?.length || 0), 0) || 0} Lessons
            </span>
          </div>

          {/* First 3 level titles as preview */}
          <ul className="list-none p-0 m-0">
            {domain.levels?.slice(0, 3).map((level) => (
              <li
                key={level.id}
                className="border-b border-border-light py-2 flex items-center gap-2 text-sm"
              >
                <span
                  className="w-6 h-6 flex items-center justify-center border text-xs font-bold"
                  style={{
                    background: 'var(--color-canvas)',
                    borderColor: 'var(--color-border)',
                  }}
                >
                  {level.number}
                </span>
                {level.title}
              </li>
            ))}
          </ul>
        </div>

        {/* CTA Button */}
        <Link
          to={`/track/${domain.name}`}
          className="brutalist-btn brutalist-btn-primary w-full text-center mt-4 no-underline"
        >
          Start Track →
        </Link>
      </div>
    </article>
  );
}
