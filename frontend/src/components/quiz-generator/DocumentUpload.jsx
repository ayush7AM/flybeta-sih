import { useState, useRef } from 'react';
import { Upload, FileText, Loader2, AlertCircle } from 'lucide-react';

const DIFFICULTY_OPTIONS = [
  { value: 'easy', label: 'Easy' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
];

const QUESTION_COUNT_OPTIONS = [3, 5, 10];

/**
 * DocumentUpload
 * Drag-and-drop file upload with difficulty & question count selectors.
 */
export default function DocumentUpload({ onGenerate, isLoading, error }) {
  const [file, setFile] = useState(null);
  const [difficulty, setDifficulty] = useState('intermediate');
  const [numQuestions, setNumQuestions] = useState(5);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef(null);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped && (dropped.name.endsWith('.pdf') || dropped.name.endsWith('.pptx'))) {
      setFile(dropped);
    }
  };

  const handleFileSelect = (e) => {
    const selected = e.target.files[0];
    if (selected) setFile(selected);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (file && !isLoading) {
      onGenerate(file, numQuestions, difficulty);
    }
  };

  const fileSizeMB = file ? (file.size / 1024 / 1024).toFixed(2) : 0;

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
      {/* Drop Zone */}
      <div
        className="brutalist-card p-8 text-center cursor-pointer transition-all"
        style={{
          background: dragOver ? 'var(--color-primary)' : 'var(--color-surface)',
          color: dragOver ? '#fff' : 'var(--color-ink)',
          borderStyle: file ? 'solid' : 'dashed',
        }}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.pptx"
          onChange={handleFileSelect}
          className="hidden"
        />

        {file ? (
          <div className="flex items-center justify-center gap-3">
            <FileText size={28} style={{ color: 'var(--color-primary)' }} />
            <div className="text-left">
              <p className="heading-md text-sm m-0">{file.name}</p>
              <p className="text-muted text-xs m-0">{fileSizeMB} MB</p>
            </div>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setFile(null); }}
              className="label-mono text-xs px-3 py-1 bg-canvas text-muted cursor-pointer"
              style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--border-radius)' }}
            >
              Remove
            </button>
          </div>
        ) : (
          <>
            <Upload size={36} className="mx-auto mb-3" style={{ color: dragOver ? '#fff' : 'var(--color-primary)' }} />
            <p className="heading-md text-sm m-0 mb-1">
              {dragOver ? 'Drop file here' : 'Upload Statistical Manual'}
            </p>
            <p className="text-muted text-xs m-0">
              Drag & drop or click to select a PDF or PPTX file (max 5MB)
            </p>
          </>
        )}
      </div>

      {/* Options Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Difficulty */}
        <div>
          <label className="block label-mono text-xs mb-1.5 text-ink font-bold">Difficulty</label>
          <div className="flex gap-2">
            {DIFFICULTY_OPTIONS.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => setDifficulty(value)}
                className="label-mono text-xs px-4 py-2 cursor-pointer transition-all flex-1"
                style={{
                  borderRadius: 'var(--border-radius)',
                  border: '2px solid',
                  borderColor: difficulty === value ? 'var(--color-primary)' : 'var(--color-border)',
                  background: difficulty === value ? 'var(--color-primary)' : 'var(--color-surface)',
                  color: difficulty === value ? '#fff' : 'var(--color-muted)',
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Question Count */}
        <div>
          <label className="block label-mono text-xs mb-1.5 text-ink font-bold">Number of Questions</label>
          <div className="flex gap-2">
            {QUESTION_COUNT_OPTIONS.map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setNumQuestions(n)}
                className="label-mono text-xs px-4 py-2 cursor-pointer transition-all flex-1"
                style={{
                  borderRadius: 'var(--border-radius)',
                  border: '2px solid',
                  borderColor: numQuestions === n ? 'var(--color-primary)' : 'var(--color-border)',
                  background: numQuestions === n ? 'var(--color-primary)' : 'var(--color-surface)',
                  color: numQuestions === n ? '#fff' : 'var(--color-muted)',
                }}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 p-3 text-sm" style={{ background: '#FEF2F2', color: '#DC2626', borderRadius: 'var(--border-radius)' }}>
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={!file || isLoading}
        className="brutalist-btn bg-primary text-white w-full py-3 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Generating Quiz...
          </>
        ) : (
          <>
            Generate FRAC Quiz
          </>
        )}
      </button>
    </form>
  );
}
