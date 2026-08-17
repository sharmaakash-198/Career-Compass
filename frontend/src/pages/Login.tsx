import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { clearUserAssessmentCache } from '../utils/assessmentStorage';
import { setAuthTokens } from '../utils/auth';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 403) {
          setError('Email not verified. Redirecting to verification page...');
          setTimeout(() => {
            navigate(`/verify-otp?email=${encodeURIComponent(email)}`, { replace: true });
          }, 2000);
        } else {
          setError(data.message || 'Invalid email or password.');
        }
        setLoading(false);
        return;
      }

      const accessToken = data.accessToken;
      const refreshToken = data.refreshToken;
      const userId = data.userId;
      if (!accessToken || !refreshToken || userId == null) {
        setError('Login succeeded but tokens were missing. Please try again.');
        setLoading(false);
        return;
      }

      const previousSession = localStorage.getItem('user_session');
      let previousUserId: string | null = null;
      if (previousSession) {
        try {
          const parsed = JSON.parse(previousSession) as { id?: number | string };
          previousUserId = parsed.id != null ? String(parsed.id) : null;
        } catch {
          previousUserId = null;
        }
      }
      if (previousUserId != null && previousUserId !== String(userId)) {
        clearUserAssessmentCache();
      }

      setAuthTokens(accessToken, refreshToken);
      localStorage.setItem(
        'user_session',
        JSON.stringify({
          id: userId,
          name: data.fullName,
          email: data.email,
        })
      );

      navigate(data.hasAssessment ? '/dashboard' : '/assess', { replace: true });
    } catch (err) {
      console.error('Login error:', err);
      setError('Network error. Please make sure the backend is running.');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-8 border border-border bg-surface rounded shadow-sm">
      <h2 className="text-2xl font-bold text-primary mb-6">Login</h2>
      
      {error && (
        <div
          className={`mb-4 p-3 rounded text-sm border ${
            error.includes('Redirecting')
              ? 'bg-amber-50 border-amber-200 text-amber-700'
              : 'bg-red-50 border-red-200 text-red-700'
          }`}
        >
          {error}
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-1 text-primary">Email address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-border rounded bg-white text-primary text-sm focus:outline-none focus:border-primary"
            required
            disabled={loading}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1 text-primary">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-border rounded bg-white text-primary text-sm focus:outline-none focus:border-primary"
            required
            disabled={loading}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 bg-primary text-white font-semibold rounded hover:bg-slate-800 transition-colors text-sm ${
            loading ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Logging In...' : 'Sign In'}
        </button>
      </form>
      <p className="mt-4 text-xs text-center text-slate-500">
        New here? <Link to="/signup" className="underline text-primary">Create an account</Link>
      </p>
    </div>
  );
};

export default Login;
