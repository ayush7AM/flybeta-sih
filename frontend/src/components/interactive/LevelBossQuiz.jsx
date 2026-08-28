import React, { useState } from 'react';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';

export default function LevelBossQuiz({ quizData, levelId, onUnlock }) {
  const { width, height } = useWindowSize();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (!quizData || quizData.length === 0) return null;

  const currentQ = quizData[currentIndex];

  const handleAnswer = async (index) => {
    let newScore = score;
    if (index === currentQ.correct_index) {
      newScore += 1;
      setScore(newScore);
    }
    
    if (currentIndex + 1 < quizData.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setIsFinished(true);
      const percentage = (newScore / quizData.length) * 100;
      if (percentage >= 60) {
        setSubmitting(true);
        try {
          await fetch(`/api/v1/levels/${levelId}/pass_quiz/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
          });
        } catch (e) {
          console.error(e);
        }
        setSubmitting(false);
      }
    }
  };
  
  if (isFinished) {
    const percentage = (score / quizData.length) * 100;
    const passed = percentage >= 60;
    
    return (
      <div className="border-4 border-ink p-8 text-center bg-surface relative overflow-hidden" style={{ boxShadow: 'var(--shadow-brutal-md)' }}>
        {passed && <Confetti width={width} height={height} className="absolute inset-0" style={{ pointerEvents: 'none' }} />}
        {passed ? (
          <div className="bg-green-400 border-4 border-ink p-8 relative z-10" style={{ boxShadow: 'var(--shadow-brutal-sm)' }}>
            <h2 className="text-4xl md:text-5xl font-black text-white uppercase mb-4" style={{ textShadow: '4px 4px 0 var(--color-ink)' }}>LEVEL CLEARED</h2>
            <p className="text-2xl font-bold text-ink mb-2">You scored {percentage}%!</p>
            {submitting ? (
              <p className="font-mono text-ink mt-4 bg-surface border-2 border-ink inline-block px-4 py-2">Unlocking next level...</p>
            ) : (
              <div className="flex flex-col items-center gap-4 mt-4">
                <p className="font-mono text-ink bg-gold-light border-2 border-ink inline-block px-4 py-2 font-bold">+50 XP Awarded! Next level unlocked.</p>
                {onUnlock && (
                  <button 
                    onClick={onUnlock}
                    className="border-2 border-ink bg-surface px-8 py-3 text-xl font-bold hover:bg-gray-100 transition-colors shadow-[4px_4px_0_0_#111] hover:translate-y-1 hover:translate-x-1 hover:shadow-[0px_0px_0_0_#111]"
                  >
                    Return to Roadmap →
                  </button>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="bg-red-500 border-4 border-ink p-8" style={{ boxShadow: 'var(--shadow-brutal-sm)' }}>
            <h2 className="text-4xl md:text-5xl font-black text-white uppercase mb-4" style={{ textShadow: '4px 4px 0 var(--color-ink)' }}>TRY AGAIN</h2>
            <p className="text-2xl font-bold text-white mb-6">You scored {percentage}%. You need 60% to pass.</p>
            <button 
              className="border-2 border-ink bg-surface px-8 py-3 text-xl font-bold hover:bg-gray-100 transition-colors shadow-[4px_4px_0_0_#111] hover:translate-y-1 hover:translate-x-1 hover:shadow-[0px_0px_0_0_#111]"
              onClick={() => {
                setCurrentIndex(0);
                setScore(0);
                setIsFinished(false);
              }}
            >
              Retry Quiz
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="border-4 border-ink p-6 bg-surface" style={{ boxShadow: 'var(--shadow-brutal-md)' }}>
      <div className="flex justify-between items-center mb-6 pb-4 border-b-2 border-ink">
        <h3 className="font-bold text-2xl m-0 uppercase tracking-tight text-primary">Level Boss Quiz</h3>
        <span className="font-mono text-lg font-bold bg-gold-light text-ink border-2 border-ink px-3 py-1 shadow-[2px_2px_0_0_#111]">
          {currentIndex + 1} / {quizData.length}
        </span>
      </div>
      
      <p className="text-xl font-bold mb-8 text-ink leading-relaxed">{currentQ.question}</p>
      
      <div className="flex flex-col gap-4">
        {currentQ.options.map((opt, i) => (
          <button 
            key={i}
            onClick={() => handleAnswer(i)}
            className="text-left text-lg border-2 border-ink p-4 hover:bg-primary hover:text-white transition-all font-medium bg-canvas shadow-[4px_4px_0_0_#111] hover:translate-y-1 hover:translate-x-1 hover:shadow-[0px_0px_0_0_#111]"
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
