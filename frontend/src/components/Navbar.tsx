import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Compass, Menu, X } from 'lucide-react';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const userSessionRaw = localStorage.getItem('user_session');
  const userSession = userSessionRaw ? JSON.parse(userSessionRaw) : null;
  const hasAssessment = !!localStorage.getItem('cc_assessment_result');

  const userName = userSession?.name || '';
  const firstName = userName.split(' ')[0] || 'Akash';

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Trends', path: '/trends' },
    { name: 'Firms', path: '/firms' },
    { name: 'Assessment', path: '/assess' },
  ];

  if (hasAssessment) {
    navItems.push({ name: 'Dashboard', path: '/dashboard' });
  }

  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = () => {
    localStorage.removeItem('user_session');
    navigate('/');
    window.location.reload();
  };

  return (
    <nav className="w-full bg-white border-b border-border px-4 lg:px-8 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group text-primary font-bold text-lg" id="nav-logo">
          <Compass className="w-5 h-5 text-primary" />
          <span>Career Compass</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              id={`nav-link-${item.name.toLowerCase().replace(' ', '-')}`}
              className={`text-sm font-medium transition-colors ${isActive(item.path)
                  ? 'text-primary font-bold'
                  : 'text-text hover:text-primary'
                }`}
            >
              {item.name}
            </Link>
          ))}

          <div className="h-4 w-px bg-border mx-2" />

          {userSession ? (
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-text">Hi, {firstName}</span>
              <button
                onClick={handleSignOut}
                className="px-4 py-2 border border-primary text-primary text-xs font-bold rounded hover:bg-surface transition-colors"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="text-sm font-medium text-text hover:text-primary"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 bg-primary text-white text-xs font-bold rounded hover:bg-slate-800 transition-colors"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          id="nav-toggle-mobile"
          className="p-2 md:hidden text-text hover:text-primary focus:outline-none"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden mt-4 pt-4 border-t border-border flex flex-col gap-3">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={`text-sm font-medium p-2 rounded hover:bg-surface ${isActive(item.path) ? 'text-primary font-bold bg-surface' : 'text-text'
                }`}
            >
              {item.name}
            </Link>
          ))}
          {userSession ? (
            <div className="flex flex-col gap-2 mt-2">
              <span className="text-sm font-semibold text-text px-2">Hi, {firstName}</span>
              <button
                onClick={() => {
                  setIsOpen(false);
                  handleSignOut();
                }}
                className="w-full text-center py-2 border border-primary text-primary text-sm font-bold rounded"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2 mt-2">
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="w-full text-center py-2 border border-border text-text text-sm font-medium rounded"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                onClick={() => setIsOpen(false)}
                className="w-full text-center py-2 bg-primary text-white text-sm font-bold rounded"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};
export default Navbar;
