import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import DiagnosticAssessment from '../components/diagnostic/DiagnosticAssessment';
import ProfileIntake from '../components/diagnostic/ProfileIntake';
import { useCompetency } from '../context/CompetencyContext';

/**
 * DiagnosticPage
 * 
 * Auth-gated page wrapper for the FRAC competency diagnostic.
 * Includes Profile Intake (Step 1) and Diagnostic Assessment (Step 2).
 */
export default function DiagnosticPage() {
  const { user, loading } = useAuth();
  const { saveProfile } = useCompetency();
  const navigate = useNavigate();

  const [intakeData, setIntakeData] = useState(null);

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

  const handleIntakeComplete = (data) => {
    setIntakeData(data);
  };

  const handleDiagnosticComplete = (competencyScores) => {
    // Merge intake data with scores
    const fullProfile = {
      ...intakeData,
      ...competencyScores
    };
    console.log('FRAC Competency Profile Saved:', fullProfile);
    saveProfile(fullProfile);
    navigate('/tracks');
  };

  return (
    <div>
      {/* Page Header */}
      <header className="mb-10">
        <div
          className="bg-surface p-8 inline-block"
          style={{ 
            border: 'var(--border-width) solid var(--color-border)',
            borderRadius: 'var(--border-radius)',
            boxShadow: 'var(--shadow-brutal-lg)' 
          }}
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
            {intakeData 
              ? "Answer 12 domain-specific questions to identify your competency gaps across Big Data, AI/ML, GIS, and Cloud Infrastructure."
              : "Welcome to the MoSPI SmartSkills diagnostic. We'll start by building your officer profile."}
          </p>
        </div>
      </header>

      {/* Assessment Flow Component */}
      {!intakeData ? (
        <ProfileIntake onComplete={handleIntakeComplete} />
      ) : (
        <DiagnosticAssessment onComplete={handleDiagnosticComplete} />
      )}
    </div>
  );
}
