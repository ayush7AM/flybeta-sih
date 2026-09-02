import { useAuth } from '../context/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import DiagnosticAssessment from '../components/diagnostic/DiagnosticAssessment';
import { useCompetency } from '../context/CompetencyContext';

/**
 * DiagnosticPage
 * 
 * Auth-gated page wrapper for the FRAC competency diagnostic.
 * Redirects unauthenticated users to the landing page.
 */
export default function DiagnosticPage() {
  const { user, loading } = useAuth();

  const { saveProfile } = useCompetency();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="brutalist-card p-8 text-center">
          <p className="heading-md">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  const handleComplete = (competencyProfile) => {
    console.log('FRAC Competency Profile:', competencyProfile);
    saveProfile(competencyProfile);
    navigate('/tracks');
    // TODO Phase 2+: POST to /api/v1/diagnostic/submit/ and save DiagnosticResult
  };

  return (
    <div>
      {/* Page Header */}
      <header className="mb-10">
        <div
          className="bg-surface border-2 border-ink p-8 inline-block"
          style={{ boxShadow: 'var(--shadow-brutal-lg)' }}
        >
          <div className="flex items-center gap-4 mb-2">
            <div
              className="brutalist-badge"
              style={{ background: 'var(--color-primary)', color: 'var(--color-canvas)' }}
            >
              ASSESSMENT
            </div>
            <span className="label-mono text-muted">
              FRAC Competency Diagnostic
            </span>
          </div>
          <h1 className="heading-xl m-0" style={{ color: 'var(--color-primary)' }}>
            Skill Gap Analysis
          </h1>
          <p className="text-muted mt-2 mb-0" style={{ maxWidth: '600px' }}>
            Answer 12 domain-specific questions to identify your competency gaps
            across Big Data, AI/ML, GIS, and Cloud Infrastructure — aligned to
            the MoSPI FRAC framework.
          </p>
        </div>
      </header>

      {/* Assessment Component */}
      <DiagnosticAssessment onComplete={handleComplete} />
    </div>
  );
}
