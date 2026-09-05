import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';

/**
 * TourGuide — Multi-Page Guided Tour
 * 
 * Walks new users across multiple pages:
 *   Dashboard → Tracks → Diagnostic → Pathways → Quiz Engine → Labs → Admin
 * 
 * Uses localStorage `mospi_tour_page` to track which page group to show.
 * Each page has its own tour steps. Clicking "Next" on the last step of a page
 * auto-navigates to the next page and continues the tour there.
 */

const TOUR_PAGES = [
  {
    path: '/dashboard',
    steps: [
      {
        element: '#tour-identity',
        popover: {
          title: '👤 Your Officer Profile',
          description: 'Your designation, division, and FRAC assessment status live here. This identity drives all personalized recommendations.',
          side: 'bottom',
          align: 'start',
        },
      },
      {
        element: '#tour-radar',
        popover: {
          title: '📊 Competency Radar',
          description: 'Your current FRAC scores vs the target framework for your designation. Red areas = skill gaps that need attention.',
          side: 'top',
          align: 'center',
        },
      },
    ],
  },
  {
    path: '/tracks',
    steps: [
      {
        popover: {
          title: '📚 Learning Tracks',
          description: 'Four MoSPI tracks aligned to the FRAC quadrants: Statistical, Technical, Digital Governance, and Behavioural. Pick any track to start structured learning.',
          side: 'bottom',
          align: 'center',
        },
      },
    ],
  },
  {
    path: '/diagnostic',
    steps: [
      {
        popover: {
          title: '🎯 FRAC Diagnostic',
          description: 'Retake the 12-question competency assessment anytime to update your skill profile. Your officer data is pre-filled — just answer the questions.',
          side: 'bottom',
          align: 'center',
        },
      },
    ],
  },
  {
    path: '/recommendations',
    steps: [
      {
        popover: {
          title: '🗺️ Training Pathways',
          description: 'AI-curated recommendations from iGOT Karmayogi e-courses and NSSTA TPAC institutional programmes — filtered by your specific skill gaps.',
          side: 'bottom',
          align: 'center',
        },
      },
    ],
  },
  {
    path: '/quiz-generator',
    steps: [
      {
        popover: {
          title: '📝 Document Quiz Engine',
          description: 'Upload any MoSPI statistical manual or circular (PDF/PPTX) — AI auto-generates FRAC-tagged MCQs with instant grading and explanations.',
          side: 'bottom',
          align: 'center',
        },
      },
    ],
  },
  {
    path: '/labs/architect',
    steps: [
      {
        popover: {
          title: '🏗️ AI Labs',
          description: 'Project Architect generates step-by-step blueprints. Code Reviewer analyzes your code for bugs and style issues. Both powered by Gemini AI.',
          side: 'bottom',
          align: 'center',
        },
      },
    ],
  },
  {
    path: '/admin',
    steps: [
      {
        popover: {
          title: '🏛️ Admin Analytics',
          description: 'Division-wide competency heatmaps, cadre-level gap analysis, and training effectiveness metrics for DIID administrators.',
          side: 'bottom',
          align: 'center',
        },
      },
    ],
  },
];

export default function TourGuide() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const hasSeenTour = localStorage.getItem('mospi_has_seen_tour');
    if (hasSeenTour === 'true') return;

    // Which page group are we on?
    const currentPageIndex = parseInt(localStorage.getItem('mospi_tour_page') || '0', 10);
    const tourPage = TOUR_PAGES[currentPageIndex];
    if (!tourPage) {
      // Tour is complete
      localStorage.setItem('mospi_has_seen_tour', 'true');
      localStorage.removeItem('mospi_tour_page');
      return;
    }

    // Are we on the right page for this tour group?
    if (!location.pathname.startsWith(tourPage.path)) {
      // Navigate to the correct page
      navigate(tourPage.path);
      return;
    }

    // Small delay to let the page render
    const timer = setTimeout(() => {
      const isLastPageGroup = currentPageIndex >= TOUR_PAGES.length - 1;
      const steps = tourPage.steps;

      const driverObj = driver({
        showProgress: true,
        animate: true,
        overlayColor: 'rgba(15, 23, 42, 0.75)',
        stagePadding: 8,
        stageRadius: 8,
        popoverClass: 'smartskills-tour-popover',
        nextBtnText: isLastPageGroup ? 'Finish Tour 🎉' : 'Next →',
        prevBtnText: '← Back',
        doneBtnText: isLastPageGroup ? 'Start Exploring! 🚀' : 'Next Page →',
        allowClose: true,
        steps: steps,
        onDestroyStarted: () => {
          if (driverObj.isLastStep()) {
            // Move to next page group
            const nextIndex = currentPageIndex + 1;
            if (nextIndex < TOUR_PAGES.length) {
              localStorage.setItem('mospi_tour_page', String(nextIndex));
              driverObj.destroy();
              navigate(TOUR_PAGES[nextIndex].path);
            } else {
              // Tour complete
              localStorage.setItem('mospi_has_seen_tour', 'true');
              localStorage.removeItem('mospi_tour_page');
              driverObj.destroy();
            }
          } else {
            driverObj.destroy();
          }
        },
      });

      driverObj.drive();
    }, 600);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return null;
}
