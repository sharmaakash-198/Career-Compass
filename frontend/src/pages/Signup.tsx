import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email && password) {
      // Save mock session details
      localStorage.setItem('user_session', JSON.stringify({ name, email }));
      navigate('/dashboard');
      window.location.reload();
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-8 border border-border bg-surface rounded-lg">
      <h2 className="text-2xl font-bold text-primary mb-6">Create Account</h2>
      <form onSubmit={handleSignup} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-1 text-primary">Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-border rounded bg-white text-primary text-sm focus:outline-none focus:border-primary"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1 text-primary">Email address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-border rounded bg-white text-primary text-sm focus:outline-none focus:border-primary"
            required
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
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 bg-primary text-white font-semibold rounded hover:bg-slate-800 transition-colors text-sm"
        >
          Sign Up
        </button>
      </form>
      <p className="mt-4 text-xs text-center text-slate-500">
        Already have an account? <Link to="/login" className="underline text-primary">Sign in</Link>
      </p>
    </div>
  );
};

export default Signup;
