import { Link } from 'react-router-dom';
import { Cloud, Bot, BarChart3, BookOpen, BrainCircuit, Database, Code, Rocket } from 'lucide-react';

const ICON_MAP = {
  'cloud': Cloud,
  'robot': Bot,
  'chart-bar': BarChart3,
  'brain': BrainCircuit,
  'database': Database,
  'code': Code,
  'rocket': Rocket,
};

const TRACK_COLORS = {
  'data-science': { accent: '#059669', bg: '#f0fdf4', label: 'Emerald Track', code: 'TS-01' },
  'ai-ml': { accent: '#6D28D9', bg: '#f5f3ff', label: 'Violet Track', code: 'TS-02' },
  'cloud': { accent: '#2563EB', bg: '#eff6ff', label: 'Cobalt Track', code: 'TS-03' },
  'ai': { accent: '#6D28D9', bg: '#f5f3ff', label: 'Violet Track', code: 'TS-02' },
  'data': { accent: '#059669', bg: '#f0fdf4', label: 'Emerald Track', code: 'TS-01' },
};

const DEFAULT_TRACK = { accent: '#E52E2E', bg: '#fef2f2', label: 'Track', code: 'TS-00' };

export default function TrackCard({ domain }) {
  const track = TRACK_COLORS[domain.name] || DEFAULT_TRACK;
  const levelCount = domain.levels?.length || 0;
  const IconComponent = ICON_MAP[domain.icon] || BookOpen;

  return (
    <article className="brutalist-card flex flex-col overflow-hidden">
      {/* Track Image Header */}
      <div
        className="h-52 border-b-2 border-ink relative flex items-center justify-center"
        style={{ background: track.bg }}
      >
        {/* Track Code Badge */}
        <div
          className="absolute top-4 left-4 label-mono px-2 py-1 border border-ink"
          style={{ background: track.accent, color: '#000' }}
        >
          {track.code}
        </div>
        {/* Lucide Icon */}
        <IconComponent
          size={72}
          strokeWidth={1.5}
          style={{ color: track.accent, opacity: 0.35 }}
        />
      </div>


      {/* Card Body */}
      <div className="p-6 flex-grow flex flex-col">
        <div className="mb-4">
          <span
            className="brutalist-badge mb-2"
            style={{ background: track.accent, color: '#000' }}
          >
            {track.label}
          </span>
          <h2 className="heading-md mt-2">{domain.title}</h2>
        </div>

        {/* Level info */}
        <div className="border-t-2 border-ink pt-4 flex-grow">
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
                <span className="w-6 h-6 flex items-center justify-center border border-ink text-xs font-bold"
                      style={{ background: track.bg }}>
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
