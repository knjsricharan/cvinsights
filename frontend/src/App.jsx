import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import { useResume } from './hooks/useResume';

function App() {
  const resumeState = useResume();

  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Landing resumeState={resumeState} />} />
        <Route 
          path="/dashboard" 
          element={
            resumeState.analysis ? 
              <Dashboard resumeState={resumeState} /> : 
              <Navigate to="/" replace />
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
