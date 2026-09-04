import { useCompetency } from '../../context/CompetencyContext';
import { COMPETENCY_META } from '../../data/diagnosticQuestions';
import IGOT_CATALOG from '../../data/igotCatalog';
import { ExternalLink, AlertTriangle, BookOpen, Clock, BarChart2 } from 'lucide-react';

const GAP_THRESHOLD = 60;

/**
 * IGOTPathway
 * 
 * Reads the user's FRAC competency profile and recommends iGOT
 * Karmayogi e-learning courses for any domain scoring below 60%.
 */
export default function IGOTPathway() {
  const { profile } = useCompetency();

  if (!profile) return null;

  // Find competencies with gaps
  const gapTags = Object.entries(profile)
    .filter(([key, val]) => key.startsWith('comp_') && typeof val === 'number' && val < GAP_THRESHOLD)
    .map(([key]) => key);

  // Filter catalog to matching courses
  const recommendedCourses = IGOT_CATALOG.filter((course) =>
    course.competencies.some((tag) => gapTags.includes(tag))
  );

  // Courses for areas the user is strong in
  const optionalCourses = IGOT_CATALOG.filter((course) =>
    !course.competencies.some((tag) => gapTags.includes(tag))
  );

  if (recommendedCourses.length === 0 && optionalCourses.length === 0) {
    return (
      <div className="brutalist-card p-8 text-center bg-surface">
        <p className="text-muted">No iGOT courses available at this time.</p>
      </div>
    );
  }

  const getPriorityLabel = (course) => {
    const score = course.competencies.reduce((min, tag) => {
      const s = profile[tag];
      return typeof s === 'number' ? Math.min(min, s) : min;
    }, 100);
    if (score < 33) return { text: 'Critical Gap', color: '#dc2626' };
    if (score < GAP_THRESHOLD) return { text: 'Recommended', color: '#f59e0b' };
    return { text: 'Optional', color: '#6b7280' };
  };

  const renderCourseCard = (course) => {
    const priority = getPriorityLabel(course);
    const meta = course.competencies
      .map((tag) => COMPETENCY_META[tag]?.label || tag)
      .join(', ');

    return (
      <div
        key={course.identifier}
        className="brutalist-card p-5 bg-surface flex flex-col justify-between"
        style={{ minHeight: '220px' }}
      >
        <div>
          {/* Priority Badge + Domain */}
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span
              className="brutalist-badge text-xs font-bold"
              style={{ background: priority.color, color: '#fff' }}
            >
              {priority.text}
            </span>
            <span className="label-mono text-xs text-muted">{meta}</span>
          </div>

          {/* Title */}
          <h4 className="heading-md text-sm m-0 mb-2">{course.name}</h4>

          {/* Description */}
          <p className="text-muted text-xs m-0 mb-3" style={{ lineHeight: 1.5 }}>
            {course.description}
          </p>
        </div>

        {/* Footer: Meta + CTA */}
        <div>
          <div className="flex items-center gap-4 mb-3 text-xs text-muted">
            <span className="flex items-center gap-1"><Clock size={12} /> {course.duration}</span>
            <span className="flex items-center gap-1"><BarChart2 size={12} /> {course.level}</span>
            <span className="flex items-center gap-1"><BookOpen size={12} /> {course.provider}</span>
          </div>

          <a
            href={course.url}
            target="_blank"
            rel="noopener noreferrer"
            className="brutalist-btn bg-primary text-white text-xs px-4 py-2 no-underline flex items-center gap-2 w-fit"
          >
            Enroll via iGOT <ExternalLink size={14} />
          </a>
        </div>
      </div>
    );
  };

  return (
    <div>
      {/* Recommended (gap areas) */}
      {recommendedCourses.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle size={18} style={{ color: '#f59e0b' }} />
            <h3 className="heading-md text-sm m-0">Prioritized for Your Gap Areas</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendedCourses.map(renderCourseCard)}
          </div>
        </div>
      )}

      {/* Optional (strong areas) */}
      {optionalCourses.length > 0 && (
        <div>
          <h3 className="heading-md text-sm m-0 mb-4 text-muted">All Other Courses</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {optionalCourses.map(renderCourseCard)}
          </div>
        </div>
      )}
    </div>
  );
}
