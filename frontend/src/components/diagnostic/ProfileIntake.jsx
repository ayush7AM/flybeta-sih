import { useState } from 'react';
import { ArrowRight, UserCircle } from 'lucide-react';

const DESIGNATIONS = [
  'Junior Statistical Officer (JSO)',
  'Senior Statistical Officer (SSO)',
  'Assistant Director',
  'Deputy Director',
  'Joint Director',
  'Director',
  'Deputy Director General',
  'Additional Director General',
  'Director General'
];

const DIVISIONS = [
  'National Statistical Office (NSO)',
  'Central Statistics Office (CSO)',
  'Data Processing Division (DPD)',
  'Survey Design and Research Division (SDRD)',
  'Field Operations Division (FOD)',
  'National Accounts Division (NAD)',
  'Economic Statistics Division (ESD)'
];

export default function ProfileIntake({ onComplete }) {
  const [designation, setDesignation] = useState('');
  const [division, setDivision] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (designation && division) {
      onComplete({ designation, division });
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="brutalist-card p-8 bg-surface">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-primary bg-opacity-10 rounded-full text-primary">
            <UserCircle size={32} />
          </div>
          <div>
            <h2 className="heading-lg m-0" style={{ color: 'var(--color-primary)' }}>Officer Profile</h2>
            <p className="text-muted m-0 mt-1">Please provide your MoSPI designation and division to contextualize your assessment.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block label-mono text-sm mb-2 text-ink font-bold">
              Current Designation
            </label>
            <select
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              className="w-full p-3 border-2 border-border bg-canvas focus:outline-none focus:border-primary transition-colors text-ink"
              style={{ borderRadius: 'var(--border-radius)' }}
              required
            >
              <option value="" disabled>Select your designation...</option>
              {DESIGNATIONS.map((desig) => (
                <option key={desig} value={desig}>{desig}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block label-mono text-sm mb-2 text-ink font-bold">
              Division / Department
            </label>
            <select
              value={division}
              onChange={(e) => setDivision(e.target.value)}
              className="w-full p-3 border-2 border-border bg-canvas focus:outline-none focus:border-primary transition-colors text-ink"
              style={{ borderRadius: 'var(--border-radius)' }}
              required
            >
              <option value="" disabled>Select your division...</option>
              {DIVISIONS.map((div) => (
                <option key={div} value={div}>{div}</option>
              ))}
            </select>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={!designation || !division}
              className="brutalist-btn bg-primary text-white flex items-center gap-2 px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Start Diagnostic <ArrowRight size={20} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
