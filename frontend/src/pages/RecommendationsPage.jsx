import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCompetency } from '../context/CompetencyContext';
import { useAuth } from '../context/AuthContext';
import IGOTPathway from '../components/recommendations/IGOTPathway';
import NSSTATrainingList from '../components/recommendations/NSSTATrainingList';
import { GraduationCap, Building2, ArrowRight } from 'lucide-react';

const TABS = [
  { key: 'igot', label: 'iGOT E-Learning Pathways', icon: GraduationCap },
  { key: 'nssta', label: 'NSSTA Institutional Programmes', icon: Building2 },
];

/**
 * RecommendationsPage
 * 
 * Unified two-tab container for the Dual Recommendation Pipeline.
 * Shows a fallback CTA if the user has not completed the diagnostic.
 */
export default function RecommendationsPage() {
  const [activeTab, setActiveTab] = useState('igot');
  const { hasCompletedDiagnostic, profile } = useCompetency();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Count gap areas for the header stat
  const gapCount = profile
    ? Object.entries(profile)
        .filter(([k, v]) => k.startsWith('comp_') && typeof v === 'number' && v < 60)
        .length
    : 0;

  return (
    <div id="tour-page-recommendations">
      {/* Page Header */}
      <header className="mb-8">
        <div
          className="bg-surface p-6 md:p-8 inline-block"
          style={{
            border: 'var(--border-width) solid var(--color-border)',
            borderRadius: 'var(--border-radius)',
            boxShadow: 'var(--shadow-brutal-lg)',
          }}
        >
          <div className="flex items-center gap-4 mb-2">
            <div
              className="brutalist-badge"
              style={{ background: 'var(--color-primary)', color: 'var(--color-canvas)' }}
            >
              PATHWAYS
            </div>
            <span className="label-mono text-muted">
              Personalized Learning Recommendations
            </span>
          </div>
          <h1 className="heading-xl m-0" style={{ color: 'var(--color-primary)' }}>
            Capacity Building Pathways
          </h1>
          <p className="text-muted mt-2 mb-0" style={{ maxWidth: '600px' }}>
            {hasCompletedDiagnostic
              ? `Based on your FRAC diagnostic, ${gapCount} competency area${gapCount !== 1 ? 's' : ''} ${gapCount !== 1 ? 'need' : 'needs'} improvement. Below are your recommended learning pathways.`
              : 'Complete the FRAC Competency Diagnostic to unlock personalized recommendations.'}
          </p>
        </div>
      </header>

      {/* Fallback: No diagnostic */}
      {!hasCompletedDiagnostic ? (
        <div className="brutalist-card p-8 text-center bg-surface max-w-lg mx-auto">
          <GraduationCap size={48} className="mx-auto mb-4" style={{ color: 'var(--color-primary)' }} />
          <h3 className="heading-md mb-2">Diagnostic Required</h3>
          <p className="text-muted text-sm mb-6">
            Take the FRAC Competency Assessment to identify your skill gaps. 
            We'll then recommend targeted iGOT courses and NSSTA training programmes.
          </p>
          <button
            onClick={() => navigate('/diagnostic')}
            className="brutalist-btn bg-primary text-white px-6 py-3 flex items-center gap-2 mx-auto"
          >
            Start Diagnostic <ArrowRight size={18} />
          </button>
        </div>
      ) : (
        <>
          {/* Tab Switcher */}
          <div className="flex gap-2 mb-6 flex-wrap">
            {TABS.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`label-mono px-5 py-2.5 flex items-center gap-2 border-2 transition-all cursor-pointer ${
                  activeTab === key
                    ? 'bg-primary text-white border-primary'
                    : 'bg-surface text-muted border-border hover:border-primary'
                }`}
                style={{ borderRadius: 'var(--border-radius)' }}
              >
                <Icon size={16} />
                {label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === 'igot' ? <IGOTPathway /> : <NSSTATrainingList />}
        </>
      )}
    </div>
  );
}
