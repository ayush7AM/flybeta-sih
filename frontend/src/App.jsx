import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import TrackSelectionPage from './pages/TrackSelectionPage';
import TrackRoadmapPage from './pages/TrackRoadmapPage';
import LessonRunnerPage from './pages/LessonRunnerPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<TrackSelectionPage />} />
          <Route path="/track/:name" element={<TrackRoadmapPage />} />
          <Route path="/track/:name/level/:num/lesson/:order" element={<LessonRunnerPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
