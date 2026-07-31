import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { ExperienceProvider } from './context/ExperienceContext';
import { Atmosphere } from './components/Atmosphere';
import { Navigation } from './components/Navigation';
import { ScrollDirector } from './components/ScrollDirector';
import { TransitionVeil } from './components/TransitionVeil';
import { Soundtrack } from './components/Soundtrack';
import { LoadingScreen } from './components/LoadingScreen';
import { Opening } from './pages/Opening';
import { Expectation } from './pages/Expectation';
import { Trajectory } from './pages/Trajectory';
import { Ship } from './pages/Ship';
import { Lessons } from './pages/Lessons';
import { Traits } from './pages/Traits';
import { Ideas } from './pages/Ideas';
import { People } from './pages/People';
import { ContinuePage } from './pages/Continue';

function Experience() {
  const location = useLocation();
  return (
    <div className="experience">
      <Atmosphere />
      <ScrollDirector />
      <TransitionVeil />
      <Navigation />
      <Soundtrack />
      <LoadingScreen />
      <Routes location={location}>
        <Route path="/" element={<Opening />} />
        <Route path="/expectation" element={<Expectation />} />
        <Route path="/trajectory" element={<Trajectory />} />
        <Route path="/ship" element={<Ship />} />
        <Route path="/lessons" element={<Lessons />} />
        <Route path="/traits" element={<Traits />} />
        <Route path="/ideas" element={<Ideas />} />
        <Route path="/people" element={<People />} />
        <Route path="/continue" element={<ContinuePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <ExperienceProvider>
        <Experience />
      </ExperienceProvider>
    </BrowserRouter>
  );
}
