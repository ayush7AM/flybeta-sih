import { useState } from 'react';
import { CheckCircle, XCircle, ChevronRight, RotateCcw, Trophy } from 'lucide-react';
import { COMPETENCY_META } from '../../data/competencyTaxonomy';

/**
 * QuizViewer
 * Interactive quiz with instant grading, explanations, and FRAC tags.
 */
export default function QuizViewer({ questions, filename, onReset }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [results, setResults] = useState([]);   // { correct: bool, quadrant: string }
  const [isFinished, setIsFinished] = useState(false);

  const question = questions[currentIndex];
  const totalQuestions = questions.length;

  const handleSelect = (option) => {
    if (isRevealed) return;
    setSelectedAnswer(option);
    setIsRevealed(true);

    const isCorrect = option === question.correct_answer;
    setResults((prev) => [...prev, {
      correct: isCorrect,
      quadrant: question.frac_quadrant,
    }]);
  };

  const handleNext = () => {
    if (currentIndex + 1 >= totalQuestions) {
      setIsFinished(true);
    } else {
      setCurrentIndex((i) => i + 1);
      setSelectedAnswer(null);
      setIsRevealed(false);
    }
  };

  // ── Results Summary ──────────────────────────────────────────────
  if (isFinished) {
    const correctCount = results.filter((r) => r.correct).length;
    const scorePercent = Math.round((correctCount / totalQuestions) * 100);

    // Group by quadrant
    const quadrantScores = {};
    results.forEach(({ correct, quadrant }) => {
      if (!quadrantScores[quadrant]) quadrantScores[quadrant] = { correct: 0, total: 0 };
      quadrantScores[quadrant].total++;
      if (correct) quadrantScores[quadrant].correct++;
    });

    return (
      <div className="max-w-2xl mx-auto">
        <div className="brutalist-card p-8 bg-surface text-center">
          <Trophy size={48} className="mx-auto mb-4" style={{ color: scorePercent >= 70 ? 'var(--color-emerald)' : '#f59e0b' }} />
          <h2 className="heading-xl m-0 mb-2">{scorePercent}%</h2>
          <p className="text-muted text-sm m-0 mb-6">
            {correctCount} of {totalQuestions} correct from <span className="font-bold">{filename}</span>
          </p>

          {/* Quadrant breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6 text-left">
            {Object.entries(quadrantScores).map(([tag, { correct, total }]) => {
              const meta = COMPETENCY_META[tag] || { label: tag, icon: '📋', color: '#6b7280' };
              return (
                <div key={tag} className="p-3 bg-canvas" style={{ borderRadius: 'var(--border-radius)', border: '1px solid var(--color-border)' }}>
                  <div className="flex items-center gap-2 mb-1">
                    <span>{meta.icon}</span>
                    <span className="label-mono text-xs font-bold">{meta.label}</span>
                  </div>
                  <span className="text-sm" style={{ color: correct === total ? 'var(--color-emerald)' : '#f59e0b' }}>
                    {correct}/{total} correct
                  </span>
                </div>
              );
            })}
          </div>

          <button
            onClick={onReset}
            className="brutalist-btn bg-primary text-white px-6 py-3 flex items-center gap-2 mx-auto"
          >
            <RotateCcw size={16} /> Generate Another Quiz
          </button>
        </div>
      </div>
    );
  }

  // ── Question View ────────────────────────────────────────────────
  const meta = COMPETENCY_META[question.frac_quadrant] || { label: question.frac_quadrant, icon: '📋', color: '#6b7280' };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Bar */}
      <div className="flex items-center justify-between mb-4">
        <span className="label-mono text-xs text-muted">
          Question {currentIndex + 1} of {totalQuestions}
        </span>
        <span
          className="brutalist-badge text-xs"
          style={{ background: meta.color, color: '#fff' }}
        >
          {meta.icon} {meta.label}
        </span>
      </div>

      <div className="w-full h-2 bg-canvas overflow-hidden mb-6"
           style={{ borderRadius: 'var(--border-radius)', border: '1px solid var(--color-border)' }}>
        <div
          className="h-full transition-all duration-500"
          style={{
            width: `${((currentIndex + 1) / totalQuestions) * 100}%`,
            backgroundColor: 'var(--color-primary)',
            borderRadius: 'var(--border-radius)',
          }}
        />
      </div>

      {/* Question Card */}
      <div className="brutalist-card p-6 bg-surface mb-4">
        <p className="heading-md text-sm m-0 mb-1" style={{ color: 'var(--color-muted)', textTransform: 'uppercase', fontSize: '0.65rem' }}>
          {question.difficulty}
        </p>
        <h3 className="heading-md m-0 mb-5" style={{ fontSize: '1rem', lineHeight: 1.5 }}>
          {question.question_text}
        </h3>

        {/* Options */}
        <div className="space-y-3">
          {question.options.map((option, i) => {
            const isSelected = selectedAnswer === option;
            const isCorrect = option === question.correct_answer;

            let borderColor = 'var(--color-border)';
            let bg = 'var(--color-canvas)';
            let icon = null;

            if (isRevealed) {
              if (isCorrect) {
                borderColor = '#059669';
                bg = '#ECFDF5';
                icon = <CheckCircle size={18} style={{ color: '#059669' }} />;
              } else if (isSelected && !isCorrect) {
                borderColor = '#DC2626';
                bg = '#FEF2F2';
                icon = <XCircle size={18} style={{ color: '#DC2626' }} />;
              }
            } else if (isSelected) {
              borderColor = 'var(--color-primary)';
              bg = 'var(--color-surface)';
            }

            return (
              <button
                key={i}
                onClick={() => handleSelect(option)}
                disabled={isRevealed}
                className="w-full text-left p-3 flex items-center gap-3 transition-all cursor-pointer disabled:cursor-default"
                style={{
                  border: `2px solid ${borderColor}`,
                  borderRadius: 'var(--border-radius)',
                  background: bg,
                  color: 'var(--color-ink)',
                }}
              >
                <span className="label-mono text-xs font-bold shrink-0" style={{ color: 'var(--color-muted)', width: '1.5rem' }}>
                  {String.fromCharCode(65 + i)}.
                </span>
                <span className="text-sm flex-1">{option}</span>
                {icon}
              </button>
            );
          })}
        </div>
      </div>

      {/* Explanation (shown after answer) */}
      {isRevealed && (
        <div className="brutalist-card p-4 mb-4" style={{ borderLeft: '4px solid var(--color-primary)', background: 'var(--color-surface)' }}>
          <p className="label-mono text-xs font-bold mb-1" style={{ color: 'var(--color-primary)' }}>EXPLANATION</p>
          <p className="text-sm text-muted m-0" style={{ lineHeight: 1.6 }}>
            {question.explanation}
          </p>
        </div>
      )}

      {/* Next Button */}
      {isRevealed && (
        <div className="flex justify-end">
          <button
            onClick={handleNext}
            className="brutalist-btn bg-primary text-white px-6 py-2.5 flex items-center gap-2"
          >
            {currentIndex + 1 >= totalQuestions ? 'See Results' : 'Next Question'}
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
