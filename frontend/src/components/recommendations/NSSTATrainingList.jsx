import { useCompetency } from '../../context/CompetencyContext';
import { COMPETENCY_META } from '../../data/diagnosticQuestions';
import NSSTA_TPAC from '../../data/nsstaTpac';
import { Calendar, MapPin, Users, Clock, CheckCircle, XCircle } from 'lucide-react';

const GAP_THRESHOLD = 60;

/**
 * NSSTATrainingList
 * 
 * Filters NSSTA TPAC institutional programmes by the user's
 * competency gaps and designation eligibility.
 */
export default function NSSTATrainingList() {
  const { profile, userDesignation } = useCompetency();

  if (!profile) return null;

  // Find competencies with gaps
  const gapTags = Object.entries(profile)
    .filter(([key, val]) => key.startsWith('comp_') && typeof val === 'number' && val < GAP_THRESHOLD)
    .map(([key]) => key);

  // Filter programmes: at least one competency matches a gap area
  const relevantProgrammes = NSSTA_TPAC.filter((prog) =>
    prog.associated_competencies.some((tag) => gapTags.includes(tag))
  );

  const otherProgrammes = NSSTA_TPAC.filter((prog) =>
    !prog.associated_competencies.some((tag) => gapTags.includes(tag))
  );

  const isEligible = (prog) => {
    if (!userDesignation) return false;
    return prog.target_designations.some((d) => userDesignation.includes(d.split(' (')[0]));
  };

  const renderProgramme = (prog) => {
    const eligible = isEligible(prog);
    const compLabels = prog.associated_competencies
      .map((tag) => COMPETENCY_META[tag]?.label || tag)
      .join(', ');

    return (
      <div
        key={prog.id}
        className="brutalist-card p-5 bg-surface"
      >
        {/* Header Row */}
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex-1">
            <h4 className="heading-md text-sm m-0 mb-1">{prog.program_name}</h4>
            <span className="label-mono text-xs text-muted">{compLabels}</span>
          </div>

          {/* Eligibility Badge */}
          {eligible ? (
            <span className="brutalist-badge text-xs flex items-center gap-1 shrink-0"
                  style={{ background: '#059669', color: '#fff' }}>
              <CheckCircle size={12} /> Eligible
            </span>
          ) : (
            <span className="brutalist-badge text-xs flex items-center gap-1 shrink-0 bg-canvas text-muted"
                  style={{ border: '1px solid var(--color-border)' }}>
              <XCircle size={12} /> Not Eligible
            </span>
          )}
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-muted mb-3">
          <div className="flex items-center gap-1.5">
            <Calendar size={13} />
            <span>{prog.dates}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin size={13} />
            <span>{prog.mode}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock size={13} />
            <span>{prog.duration}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users size={13} />
            <span>{prog.capacity} seats</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3" 
             style={{ borderTop: '1px solid var(--color-border)' }}>
          <div className="text-xs text-muted">
            <span className="font-bold">Nomination Deadline:</span> {prog.nomination_deadline}
          </div>
          <div className="text-xs text-muted">
            <span className="font-bold">For:</span>{' '}
            {prog.target_designations.map((d) => d.split(' (')[0]).join(', ')}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      {/* Recommended */}
      {relevantProgrammes.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Calendar size={18} style={{ color: 'var(--color-primary)' }} />
            <h3 className="heading-md text-sm m-0">Recommended for Your Gap Areas</h3>
          </div>
          <div className="flex flex-col gap-4">
            {relevantProgrammes.map(renderProgramme)}
          </div>
        </div>
      )}

      {/* Other Programmes */}
      {otherProgrammes.length > 0 && (
        <div>
          <h3 className="heading-md text-sm m-0 mb-4 text-muted">All NSSTA Programmes</h3>
          <div className="flex flex-col gap-4">
            {otherProgrammes.map(renderProgramme)}
          </div>
        </div>
      )}

      {relevantProgrammes.length === 0 && otherProgrammes.length === 0 && (
        <div className="brutalist-card p-8 text-center bg-surface">
          <p className="text-muted">No NSSTA programmes available at this time.</p>
        </div>
      )}
    </div>
  );
}
