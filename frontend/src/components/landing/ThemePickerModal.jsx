import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { X, ChevronRight, Palette } from 'lucide-react';

/**
 * ThemePickerModal
 * 
 * Step 1 of the onboarding flow.
 * Shows available themes with instant live previews, then routes to /diagnostic.
 */
export default function ThemePickerModal({ isOpen, onClose }) {
  const { themeKey, themes, themeKeys, setTheme } = useTheme();
  const navigate = useNavigate();
  const [selectedKey, setSelectedKey] = useState(themeKey);

  if (!isOpen) return null;

  const handlePreview = (key) => {
    setSelectedKey(key);
    setTheme(key); // Live preview — applies immediately
  };

  const handleContinue = () => {
    onClose();
    navigate('/onboarding');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div
        className="relative w-full max-w-lg flex flex-col max-h-[90vh]"
        style={{
          background: 'var(--color-surface)',
          border: 'var(--border-width) solid var(--color-border)',
          borderRadius: 'var(--border-radius)',
          boxShadow: 'var(--shadow-brutal-lg)',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between p-5"
          style={{
            borderBottom: 'var(--border-width) solid var(--color-border)',
            background: 'var(--color-primary)',
            borderRadius: 'var(--border-radius) var(--border-radius) 0 0',
          }}
        >
          <div className="flex items-center gap-3">
            <Palette size={22} style={{ color: '#fff' }} />
            <h2 className="heading-lg m-0 text-lg" style={{ color: '#fff' }}>
              Choose Your Theme
            </h2>
          </div>
          <button
            onClick={onClose}
            className="bg-transparent border-none cursor-pointer p-1 transition-colors"
            style={{ color: '#fff' }}
          >
            <X size={22} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto">
          <p className="text-muted text-sm m-0 mb-4">
            Select a visual identity for your experience. You can always change this later from the dashboard.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {themeKeys.map((key) => {
              const t = themes[key];
              const isActive = key === selectedKey;
              const primaryColor = t.vars['--color-primary'];
              const canvasColor = t.vars['--color-canvas'];
              const surfaceColor = t.vars['--color-surface'];
              const borderColor = t.vars['--color-border'];
              const inkColor = t.vars['--color-ink'];

              return (
                <button
                  key={key}
                  onClick={() => handlePreview(key)}
                  className="relative flex flex-col items-center gap-2 p-4 cursor-pointer transition-all"
                  style={{
                    border: `2px solid ${isActive ? primaryColor : 'var(--color-border)'}`,
                    borderRadius: 'var(--border-radius)',
                    backgroundColor: isActive ? canvasColor : 'var(--color-canvas)',
                    boxShadow: isActive ? `0 0 0 2px ${primaryColor}` : 'none',
                    transform: isActive ? 'scale(1.03)' : 'none',
                  }}
                >
                  {/* Active check */}
                  {isActive && (
                    <span
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 flex items-center justify-center text-xs font-bold"
                      style={{
                        backgroundColor: primaryColor,
                        color: '#fff',
                        borderRadius: '50%',
                      }}
                    >
                      ✓
                    </span>
                  )}

                  {/* Theme icon */}
                  <span className="text-2xl">{t.icon}</span>

                  {/* Color preview bar */}
                  <div className="w-full flex gap-1 h-3" style={{ borderRadius: 2 }}>
                    <div className="flex-1" style={{ background: primaryColor, borderRadius: 2 }} />
                    <div className="flex-1" style={{ background: surfaceColor, border: `1px solid ${borderColor}`, borderRadius: 2 }} />
                    <div className="flex-1" style={{ background: inkColor, borderRadius: 2 }} />
                  </div>

                  {/* Label */}
                  <span
                    className="label-mono text-xs font-bold"
                    style={{ color: isActive ? primaryColor : 'var(--color-muted)' }}
                  >
                    {t.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div
          className="p-5 flex justify-end"
          style={{
            borderTop: 'var(--border-width) solid var(--color-border)',
          }}
        >
          <button
            onClick={handleContinue}
            className="brutalist-btn bg-primary text-white flex items-center gap-2 px-6 py-2.5"
          >
            Continue to Assessment <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
