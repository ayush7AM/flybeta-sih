import { useMemo } from 'react';

// ── Activity Heatmap (GitHub-style) ──────────────────────────────────────
// Reads daily activity from localStorage key 'flybeta_activity_log'
// Format: { "2026-09-01": 2, "2026-08-30": 1, ... }  (count of levels/lessons completed)

const WEEKS_TO_SHOW = 26; // ~6 months
const DAYS = ['Mon', '', 'Wed', '', 'Fri', '', ''];

function getActivityData() {
  try {
    const stored = localStorage.getItem('flybeta_activity_log');
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

export function recordActivity(count = 1) {
  const data = getActivityData();
  const today = new Date().toISOString().split('T')[0]; // "YYYY-MM-DD"
  data[today] = (data[today] || 0) + count;
  localStorage.setItem('flybeta_activity_log', JSON.stringify(data));
}

function getIntensity(count) {
  if (!count || count === 0) return 0;
  if (count === 1) return 1;
  if (count === 2) return 2;
  if (count <= 4) return 3;
  return 4;
}

export default function ActivityHeatmap() {
  const { weeks, activityData, totalActivities, currentStreak } = useMemo(() => {
    const data = getActivityData();
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = Sunday
    const adjustedDay = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Mon = 0

    // Calculate the total number of days to render
    const totalDays = WEEKS_TO_SHOW * 7 + adjustedDay + 1;

    // Start date
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - totalDays + 1);

    // Build weeks array
    const weeksArr = [];
    let currentWeek = [];
    const tempDate = new Date(startDate);

    for (let i = 0; i < totalDays; i++) {
      const dateStr = tempDate.toISOString().split('T')[0];
      const count = data[dateStr] || 0;
      currentWeek.push({ date: dateStr, count, intensity: getIntensity(count) });

      if (currentWeek.length === 7) {
        weeksArr.push(currentWeek);
        currentWeek = [];
      }
      tempDate.setDate(tempDate.getDate() + 1);
    }
    if (currentWeek.length > 0) {
      weeksArr.push(currentWeek);
    }

    // Total activities
    const total = Object.values(data).reduce((sum, v) => sum + v, 0);

    // Current streak
    let streak = 0;
    const checkDate = new Date(today);
    while (true) {
      const ds = checkDate.toISOString().split('T')[0];
      if (data[ds] && data[ds] > 0) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    return { weeks: weeksArr, activityData: data, totalActivities: total, currentStreak: streak };
  }, []);

  // Color scale using CSS variables
  const getColor = (intensity) => {
    switch (intensity) {
      case 0: return 'var(--color-canvas)';
      case 1: return 'var(--heatmap-1, #9BE9A8)';
      case 2: return 'var(--heatmap-2, #40C463)';
      case 3: return 'var(--heatmap-3, #30A14E)';
      case 4: return 'var(--heatmap-4, #216E39)';
      default: return 'var(--color-canvas)';
    }
  };

  // Month labels
  const monthLabels = useMemo(() => {
    const labels = [];
    let lastMonth = -1;
    weeks.forEach((week, weekIdx) => {
      const firstDay = week[0];
      if (firstDay) {
        const month = new Date(firstDay.date).getMonth();
        if (month !== lastMonth) {
          lastMonth = month;
          labels.push({
            weekIdx,
            label: new Date(firstDay.date).toLocaleString('default', { month: 'short' }),
          });
        }
      }
    });
    return labels;
  }, [weeks]);

  return (
    <div className="brutalist-card p-4 md:p-6" style={{ background: 'var(--color-surface)' }}>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h3 className="heading-md m-0">LEARNING ACTIVITY</h3>
        <div className="flex items-center gap-3">
          {currentStreak > 0 && (
            <span className="label-mono text-sm" style={{ color: 'var(--color-primary)' }}>
              🔥 {currentStreak} day streak
            </span>
          )}
          <span className="label-mono text-muted text-sm">
            {totalActivities} total
          </span>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="overflow-x-auto">
        <div style={{ minWidth: '680px' }}>
          {/* Month labels */}
          <div className="flex" style={{ paddingLeft: '32px', marginBottom: '4px' }}>
            {monthLabels.map((m, i) => (
              <span
                key={i}
                className="label-mono text-muted"
                style={{
                  position: 'relative',
                  left: `${m.weekIdx * 14}px`,
                  fontSize: '10px',
                  whiteSpace: 'nowrap',
                }}
              >
                {m.label}
              </span>
            ))}
          </div>

          <div className="flex gap-0.5">
            {/* Day labels */}
            <div className="flex flex-col gap-0.5 pr-1" style={{ width: '28px' }}>
              {DAYS.map((day, i) => (
                <span
                  key={i}
                  className="label-mono text-muted"
                  style={{ fontSize: '9px', height: '12px', lineHeight: '12px' }}
                >
                  {day}
                </span>
              ))}
            </div>

            {/* Weeks columns */}
            {weeks.map((week, wIdx) => (
              <div key={wIdx} className="flex flex-col gap-0.5">
                {week.map((day, dIdx) => (
                  <div
                    key={dIdx}
                    title={`${day.date}: ${day.count} ${day.count === 1 ? 'completion' : 'completions'}`}
                    style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: 'calc(var(--border-radius) * 0.25)',
                      backgroundColor: getColor(day.intensity),
                      border: `1px solid var(--color-border-light)`,
                      cursor: 'default',
                    }}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-end gap-1.5 mt-3">
        <span className="label-mono text-muted" style={{ fontSize: '10px' }}>Less</span>
        {[0, 1, 2, 3, 4].map((level) => (
          <div
            key={level}
            style={{
              width: '12px',
              height: '12px',
              borderRadius: 'calc(var(--border-radius) * 0.25)',
              backgroundColor: getColor(level),
              border: `1px solid var(--color-border-light)`,
            }}
          />
        ))}
        <span className="label-mono text-muted" style={{ fontSize: '10px' }}>More</span>
      </div>
    </div>
  );
}
