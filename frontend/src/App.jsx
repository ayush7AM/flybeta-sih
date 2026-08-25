import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/layout/Layout';
import LandingPage from './pages/LandingPage';
import TrackSelectionPage from './pages/TrackSelectionPage';
import TrackRoadmapPage from './pages/TrackRoadmapPage';
import LessonRunnerPage from './pages/LessonRunnerPage';
import ProjectArchitectPage from './pages/ProjectArchitectPage';
import CodeReviewerPage from './pages/CodeReviewerPage';
import VisionPage from './pages/VisionPage';
import VideoDetailPage from './pages/VideoDetailPage';

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <UserProvider>
          <Routes>
            {/* Landing page — standalone, no app shell */}
            <Route path="/" element={<LandingPage />} />

            {/* App routes — inside Layout with Navbar */}
            <Route element={<Layout />}>
              <Route path="/tracks" element={<TrackSelectionPage />} />
              <Route path="/track/:name" element={<TrackRoadmapPage />} />
              <Route path="/track/:name/level/:num/lesson/:order" element={<LessonRunnerPage />} />
              <Route path="/labs" element={<Navigate to="/labs/architect" replace />} />
              <Route path="/labs/architect" element={<ProjectArchitectPage />} />
              <Route path="/labs/reviewer" element={<CodeReviewerPage />} />
              <Route path="/vision" element={<VisionPage />} />
              <Route path="/vision/video/:id" element={<VideoDetailPage />} />
            </Route>
          </Routes>
        </UserProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
