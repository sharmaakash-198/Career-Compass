import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export const VerifyOtp: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const emailFromUrl = searchParams.get('email') || '';

  const [email, setEmail] = useState(emailFromUrl);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  
  // Cooldown for resend OTP (30 seconds)
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6 || !/^\d+$/.test(otp)) {
      setMessage({ text: 'OTP must be a 6-digit number.', type: 'error' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch('http://localhost:8080/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage({ text: data.message || 'OTP verification failed.', type: 'error' });
        setLoading(false);
        return;
      }

      setMessage({ text: 'Email verified successfully! Redirecting to sign in...', type: 'success' });
      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 2000);
    } catch (err) {
      console.error('OTP verification error:', err);
      setMessage({ text: 'Network error. Please make sure the backend is running.', type: 'error' });
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      setMessage({ text: 'Email is required to resend OTP.', type: 'error' });
      return;
    }

    setResending(true);
    setMessage(null);

    try {
      const response = await fetch('http://localhost:8080/api/auth/resend-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage({ text: data.message || 'Failed to resend OTP.', type: 'error' });
        setResending(false);
        return;
      }

      setMessage({ text: 'A new OTP has been sent to your email.', type: 'success' });
      setCooldown(30); // 30 seconds cooldown
      setResending(false);
    } catch (err) {
      console.error('Resend OTP error:', err);
      setMessage({ text: 'Network error. Failed to resend OTP.', type: 'error' });
      setResending(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-8 border border-border bg-surface rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold text-primary mb-6">Verify Email</h2>
      
      {message && (
        <div
          className={`mb-4 p-3 rounded text-sm border ${
            message.type === 'success'
              ? 'bg-green-50 border-green-200 text-green-700'
              : 'bg-red-50 border-red-200 text-red-700'
          }`}
        >
          {message.text}
        </div>
      )}

      <p className="text-xs text-slate-500 mb-6">
        Please enter the 6-digit OTP code sent to your registered email address to verify your account.
      </p>

      <form onSubmit={handleVerify} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-1 text-primary">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-border rounded bg-white text-primary text-sm focus:outline-none focus:border-primary"
            required
            placeholder="name@example.com"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1 text-primary">Verification OTP</label>
          <input
            type="text"
            maxLength={6}
            placeholder="123456"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
            className="w-full px-3 py-2 border border-border rounded bg-white text-primary text-sm focus:outline-none focus:border-primary text-center font-mono tracking-widest text-lg"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading || resending}
          className={`w-full py-2 bg-primary text-white font-semibold rounded hover:bg-slate-800 transition-colors text-sm ${
            loading || resending ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Verifying...' : 'Verify Code'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <button
          onClick={handleResend}
          disabled={cooldown > 0 || resending || loading}
          className={`text-xs font-semibold text-primary underline focus:outline-none ${
            cooldown > 0 || resending || loading ? 'opacity-50 cursor-not-allowed no-underline' : 'hover:text-slate-800'
          }`}
        >
          {resending ? 'Resending...' : cooldown > 0 ? `Resend OTP in ${cooldown}s` : 'Resend OTP'}
        </button>
      </div>
    </div>
  );
};

export default VerifyOtp;
