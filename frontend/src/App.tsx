import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Landing } from './pages/Landing';
import { Assessment } from './pages/Assessment';
import { Dashboard } from './pages/Dashboard';
import { Trends } from './pages/Trends';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { NotFound } from './pages/NotFound';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isLoggedIn = !!localStorage.getItem('user_session');
  return isLoggedIn ? <>{children}</> : <Navigate to="/login" replace />;
};

const App: React.FC = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-background text-text">
        {/* Navigation Header */}
        <Navbar />

        {/* Page Container */}
        <main className="flex-1 w-full max-w-7xl mx-auto py-6 px-4">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/trends" element={<Trends />} />
            <Route path="/assess" element={<ProtectedRoute><Assessment /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="border-t border-border py-8 text-center text-xs text-muted mt-auto">
          <div className="max-w-7xl mx-auto px-4">
            <p>© {new Date().getFullYear()} Career Compass. Designed for high-impact developers.</p>
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;
