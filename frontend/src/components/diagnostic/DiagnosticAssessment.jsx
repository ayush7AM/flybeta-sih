import { useState, useMemo } from 'react';
import { CheckCircle, XCircle, ChevronRight, RotateCcw, BarChart3 } from 'lucide-react';
import DIAGNOSTIC_QUESTIONS, { COMPETENCY_META } from '../../data/diagnosticQuestions';

/**
 * DiagnosticAssessment
 * 
 * Multi-step FRAC competency assessment component.
 * Steps through 12 domain-specific MCQs, tracks answers,
 * and produces a competency gap score object on completion.
 * 
 * Output shape: { comp_statistical: 33, comp_technical: 100, comp_digital_governance: 66, comp_behavioural: 100 }
 */
export default function DiagnosticAssessment({ onComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  const questions = DIAGNOSTIC_QUESTIONS;
  const totalQuestions = questions.length;
  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex) / totalQuestions) * 100;

  // ── Compute competency scores ──────────────────────────────────────
  const competencyProfile = useMemo(() => {
    if (!showResult) return null;

    // Group questions by tag
    const tagGroups = {};
    questions.forEach((q) => {
      if (!tagGroups[q.frac_competency_tag]) {
        tagGroups[q.frac_competency_tag] = { total: 0, correct: 0 };
      }
      tagGroups[q.frac_competency_tag].total += 1;
      if (selectedAnswers[q.id] === q.correct_answer) {
        tagGroups[q.frac_competency_tag].correct += 1;
      }
    });

    // Convert to percentage scores
    const profile = {};
    Object.entries(tagGroups).forEach(([tag, { total, correct }]) => {
      profile[tag] = Math.round((correct / total) * 100);
    });

    return profile;
  }, [showResult, selectedAnswers, questions]);

  // ── Handlers ───────────────────────────────────────────────────────
  const handleSelectAnswer = (option) => {
    if (showFeedback) return; // prevent re-selection after answering
    setSelectedAnswers((prev) => ({ ...prev, [currentQuestion.id]: option }));
    setShowFeedback(true);
  };

  const handleNext = () => {
    setShowFeedback(false);
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setShowResult(true);
      if (onComplete) {
        // Build the profile one more time for the callback
        const tagGroups = {};
        questions.forEach((q) => {
          if (!tagGroups[q.frac_competency_tag]) {
            tagGroups[q.frac_competency_tag] = { total: 0, correct: 0 };
          }
          tagGroups[q.frac_competency_tag].total += 1;
          if (selectedAnswers[q.id] === q.correct_answer || 
              (q.id === currentQuestion.id && currentQuestion.correct_answer === selectedAnswers[currentQuestion.id])) {
            tagGroups[q.frac_competency_tag].correct += 1;
          }
        });
        const profile = {};
        Object.entries(tagGroups).forEach(([tag, { total, correct }]) => {
          profile[tag] = Math.round((correct / total) * 100);
        });
        onComplete(profile);
      }
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedAnswers({});
    setShowResult(false);
    setShowFeedback(false);
  };

  const selectedOption = selectedAnswers[currentQuestion?.id];
  const isCorrect = selectedOption === currentQuestion?.correct_answer;

  // ── Results Screen ─────────────────────────────────────────────────
  if (showResult && competencyProfile) {
    const totalCorrect = Object.values(competencyProfile).reduce(
      (sum, pct) => sum + (pct / 100) * 3, 0
    );
    const overallPct = Math.round((totalCorrect / totalQuestions) * 100);

    return (
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="brutalist-card p-8 mb-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <BarChart3 size={28} style={{ color: 'var(--color-primary)' }} />
            <h2 className="heading-lg m-0">Competency Assessment Results</h2>
          </div>
          <p className="text-muted mb-4">
            Your FRAC competency gap analysis across {Object.keys(COMPETENCY_META).length} domains
          </p>

          {/* Overall Score */}
          <div
            className="inline-block px-8 py-4 border-2 border-ink mb-2"
            style={{ boxShadow: 'var(--shadow-brutal-sm)' }}
          >
            <p className="label-mono text-muted m-0 mb-1">OVERALL SCORE</p>
            <p className="heading-xl m-0" style={{ color: 'var(--color-primary)' }}>
              {overallPct}%
            </p>
            <p className="text-sm text-muted m-0">
              {Math.round(totalCorrect)}/{totalQuestions} correct
            </p>
          </div>
        </div>

        {/* Per-Domain Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {Object.entries(COMPETENCY_META).map(([tag, meta]) => {
            const score = competencyProfile[tag] ?? 0;
            const gapLevel =
              score >= 80 ? 'Strong' : score >= 50 ? 'Moderate' : 'Needs Development';
            const gapColor =
              score >= 80 ? '#059669' : score >= 50 ? '#EAB308' : '#DC2626';

            return (
              <div
                key={tag}
                className="brutalist-card p-6"
                style={{ borderLeftWidth: '6px', borderLeftColor: meta.color }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">{meta.icon}</span>
                  <h3
                    className="heading-sm m-0"
                    style={{ fontSize: '0.95rem' }}
                  >
                    {meta.label}
                  </h3>
                </div>

                {/* Score bar */}
                <div className="mb-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="label-mono text-muted" style={{ fontSize: '0.7rem' }}>
                      COMPETENCY
                    </span>
                    <span className="label-mono" style={{ color: meta.color, fontWeight: 700 }}>
                      {score}%
                    </span>
                  </div>
                  <div
                    className="w-full h-3 border border-ink"
                    style={{ background: 'var(--color-canvas)' }}
                  >
                    <div
                      className="h-full transition-all duration-700 ease-out"
                      style={{
                        width: `${score}%`,
                        background: meta.color,
                      }}
                    />
                  </div>
                </div>

                {/* Gap indicator */}
                <div className="flex items-center gap-2">
                  <span
                    className="brutalist-badge"
                    style={{
                      background: gapColor + '20',
                      color: gapColor,
                      borderColor: gapColor,
                    }}
                  >
                    {gapLevel}
                  </span>
                  {score < 80 && (
                    <span className="text-xs text-muted">
                      Gap: {100 - score}%
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Competency Output (dev reference) */}
        <div className="brutalist-card p-6 mb-8">
          <p className="label-mono text-muted mb-3" style={{ fontSize: '0.7rem' }}>
            FRAC COMPETENCY PROFILE OUTPUT
          </p>
          <pre
            className="p-4 border border-ink text-sm overflow-x-auto"
            style={{
              background: 'var(--color-canvas)',
              fontFamily: 'var(--font-mono)',
            }}
          >
            {JSON.stringify(competencyProfile, null, 2)}
          </pre>
        </div>

        {/* Actions */}
        <div className="flex justify-center gap-4 mb-12">
          <button
            onClick={handleRestart}
            className="brutalist-btn"
            style={{ background: 'var(--color-surface)' }}
          >
            <RotateCcw size={16} />
            Retake Assessment
          </button>
        </div>
      </div>
    );
  }

  // ── Question Screen ────────────────────────────────────────────────
  const domainMeta = COMPETENCY_META[currentQuestion.frac_competency_tag];

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="label-mono text-muted" style={{ fontSize: '0.75rem' }}>
            QUESTION {currentIndex + 1} OF {totalQuestions}
          </span>
          <span
            className="brutalist-badge"
            style={{
              background: domainMeta.color + '20',
              color: domainMeta.color,
              borderColor: domainMeta.color,
            }}
          >
            {domainMeta.icon} {domainMeta.label}
          </span>
        </div>
        <div
          className="w-full h-2 border border-ink"
          style={{ background: 'var(--color-canvas)' }}
        >
          <div
            className="h-full transition-all duration-500 ease-out"
            style={{
              width: `${progress}%`,
              background: domainMeta.color,
            }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="brutalist-card p-8 mb-6">
        <p
          className="heading-md m-0 mb-6"
          style={{ lineHeight: 1.4, fontSize: '1.15rem' }}
        >
          {currentQuestion.question_text}
        </p>

        {/* Options */}
        <div className="flex flex-col gap-3">
          {currentQuestion.options.map((option, idx) => {
            const isSelected = selectedOption === option;
            const isCorrectOption = option === currentQuestion.correct_answer;
            const letter = String.fromCharCode(65 + idx); // A, B, C, D

            let optionStyle = {
              background: 'var(--color-surface)',
              borderColor: 'var(--color-ink)',
              cursor: showFeedback ? 'default' : 'pointer',
            };
            let iconEl = null;

            if (showFeedback) {
              if (isCorrectOption) {
                optionStyle.background = '#DCFCE7';
                optionStyle.borderColor = '#059669';
                iconEl = <CheckCircle size={20} color="#059669" />;
              } else if (isSelected && !isCorrectOption) {
                optionStyle.background = '#FEE2E2';
                optionStyle.borderColor = '#DC2626';
                iconEl = <XCircle size={20} color="#DC2626" />;
              }
            } else if (isSelected) {
              optionStyle.background = domainMeta.color + '15';
              optionStyle.borderColor = domainMeta.color;
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelectAnswer(option)}
                disabled={showFeedback}
                className="w-full text-left p-4 border-2 flex items-start gap-3 transition-all duration-150"
                style={{
                  ...optionStyle,
                  boxShadow: isSelected && !showFeedback ? 'var(--shadow-brutal-sm)' : 'none',
                }}
              >
                <span
                  className="label-mono flex-shrink-0 w-8 h-8 flex items-center justify-center border border-ink"
                  style={{
                    background: isSelected ? domainMeta.color : 'var(--color-canvas)',
                    color: isSelected ? '#fff' : 'var(--color-ink)',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                  }}
                >
                  {letter}
                </span>
                <span className="flex-1 text-sm" style={{ lineHeight: 1.5 }}>
                  {option}
                </span>
                {iconEl && <span className="flex-shrink-0 mt-0.5">{iconEl}</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Feedback + Next */}
      {showFeedback && (
        <div className="flex items-center justify-between mb-8">
          <div
            className="brutalist-badge px-4 py-2"
            style={{
              background: isCorrect ? '#DCFCE7' : '#FEE2E2',
              color: isCorrect ? '#059669' : '#DC2626',
              borderColor: isCorrect ? '#059669' : '#DC2626',
              fontSize: '0.85rem',
            }}
          >
            {isCorrect ? '✓ Correct!' : '✗ Incorrect'}
          </div>
          <button
            onClick={handleNext}
            className="brutalist-btn brutalist-btn-primary"
          >
            {currentIndex < totalQuestions - 1 ? (
              <>
                Next Question <ChevronRight size={16} />
              </>
            ) : (
              <>
                View Results <BarChart3 size={16} />
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
