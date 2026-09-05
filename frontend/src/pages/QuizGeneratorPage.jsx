import { useState } from 'react';
import { generateDocQuiz } from '../services/api';
import DocumentUpload from '../components/quiz-generator/DocumentUpload';
import QuizViewer from '../components/quiz-generator/QuizViewer';
import { FileSearch } from 'lucide-react';

/**
 * QuizGeneratorPage
 * 
 * Page wrapper for the AI Document-to-Quiz engine.
 * States: upload → loading → quiz → results → upload (loop)
 */
export default function QuizGeneratorPage() {
  const [quizData, setQuizData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerate = async (file, numQuestions, difficulty) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await generateDocQuiz(file, numQuestions, difficulty);
      setQuizData(data);
    } catch (err) {
      const msg = err.response?.data?.error || err.message || 'Something went wrong.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setQuizData(null);
    setError(null);
  };

  return (
    <div id="tour-page-quiz">
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
              AI ENGINE
            </div>
            <span className="label-mono text-muted">
              Gemini-Powered Assessment Generator
            </span>
          </div>
          <h1 className="heading-xl m-0" style={{ color: 'var(--color-primary)' }}>
            Document to Quiz
          </h1>
          <p className="text-muted mt-2 mb-0" style={{ maxWidth: '600px' }}>
            {quizData
              ? `Generated ${quizData.num_questions} questions from "${quizData.filename}"`
              : 'Upload a statistical manual, circular, or presentation — AI auto-generates FRAC-tagged MCQs with instant grading.'}
          </p>
        </div>
      </header>

      {/* Content */}
      {!quizData ? (
        <DocumentUpload
          onGenerate={handleGenerate}
          isLoading={isLoading}
          error={error}
        />
      ) : (
        <QuizViewer
          questions={quizData.questions}
          filename={quizData.filename}
          onReset={handleReset}
        />
      )}
    </div>
  );
}
