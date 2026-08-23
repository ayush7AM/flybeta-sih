import { useState } from 'react';

// Placeholder components — will be replaced in Tasks 2.2 and 2.3
function ChannelFeedPlaceholder() {
  return (
    <div className="brutalist-card p-12 text-center">
      <p className="heading-md mb-2">📡 CHANNELS</p>
      <p className="text-muted">AI-curated video feed coming in Task 2.2</p>
    </div>
  );
}

function SynapseEnginePlaceholder() {
  return (
    <div className="brutalist-card p-12 text-center">
      <p className="heading-md mb-2">⚡ SYNAPSE</p>
      <p className="text-muted">YouTube-to-Quiz extractor coming in Task 2.3</p>
    </div>
  );
}

const VISION_TABS = [
  { key: 'channels', label: '📡 Channels', description: 'AI-Curated Feed' },
  { key: 'synapse',  label: '⚡ Synapse',  description: 'URL → Quiz Extractor' },
];

export default function VisionPage() {
  const [activeTab, setActiveTab] = useState('channels');

  return (
    <div>
      {/* ── Hero Header ──────────────────────────────────────────────── */}
      <header className="mb-10 border-b-2 border-ink pb-8">
        <h1 className="heading-xl mb-4 tracking-tighter">VISION</h1>
        <p
          className="text-lg max-w-2xl"
          style={{
            borderLeft: '4px solid var(--color-violet)',
            paddingLeft: '16px',
            color: 'var(--color-muted)',
            lineHeight: 1.6,
          }}
        >
          Your AI-powered video learning suite. Explore curated channels or extract
          quizzes from any YouTube video with Synapse.
        </p>
      </header>

      {/* ── Sub-Navigation Toggle ────────────────────────────────────── */}
      <nav
        className="flex gap-0 mb-10 border-2 border-ink w-fit"
        style={{ boxShadow: 'var(--shadow-brutal-sm)' }}
      >
        {VISION_TABS.map(({ key, label }) => {
          const isActive = activeTab === key;
          return (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`label-mono px-6 py-3 no-underline transition-colors border-r-2 border-ink last:border-r-0 cursor-pointer ${
                isActive
                  ? 'bg-violet text-white'
                  : 'bg-surface text-ink hover:bg-canvas'
              }`}
            >
              {label}
            </button>
          );
        })}
      </nav>

      {/* ── Active View ──────────────────────────────────────────────── */}
      {activeTab === 'channels' && <ChannelFeedPlaceholder />}
      {activeTab === 'synapse' && <SynapseEnginePlaceholder />}
    </div>
  );
}
