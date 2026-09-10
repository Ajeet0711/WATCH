import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar.tsx';
import OfflineIndicator from './components/OfflineIndicator.tsx';

// Pages
import LandingPage from './pages/LandingPage.tsx';
import Onboarding from './pages/Onboarding.tsx';
import Dashboard from './pages/Dashboard.tsx';
import MemoryMatch from './pages/MemoryMatch.tsx';
import ObjectRecall from './pages/ObjectRecall.tsx';
import PatternRecall from './pages/PatternRecall.tsx';
import RoutineRecall from './pages/RoutineRecall.tsx';
import CompanionPage from './pages/CompanionPage.tsx';
import CaregiverDashboard from './pages/CaregiverDashboard.tsx';
import Settings from './pages/Settings.tsx';

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <div className="min-h-screen bg-white">
        <Navbar />
        
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/onboarding" element={<Onboarding />} />

          {/* Patient Routes */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/games/memory-match" element={<MemoryMatch />} />
          <Route path="/games/object-recall" element={<ObjectRecall />} />
          <Route path="/games/pattern-recall" element={<PatternRecall />} />
          <Route path="/games/routine-recall" element={<RoutineRecall />} />
          <Route path="/companion" element={<CompanionPage />} />

          {/* Caregiver Routes */}
          <Route path="/caregiver" element={<CaregiverDashboard />} />

          {/* Settings */}
          <Route path="/settings" element={<Settings />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {/* Offline Indicator */}
        <OfflineIndicator />
      </div>
    </BrowserRouter>
  );
}

export default App;
