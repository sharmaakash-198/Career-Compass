import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('MALE');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setGeneralError('');
    setFieldErrors({});

    try {
      const response = await fetch('http://localhost:8080/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName,
          lastName: lastName || null,
          dob,
          gender,
          email,
          phoneNumber,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.fieldErrors) {
          setFieldErrors(data.fieldErrors);
        } else {
          setGeneralError(data.message || 'Signup failed. Please check your inputs.');
        }
        setLoading(false);
        return;
      }

      // Successful signup: redirect to OTP verification screen
      navigate(`/verify-otp?email=${encodeURIComponent(email)}`, { replace: true });
    } catch (err) {
      console.error('Signup error:', err);
      setGeneralError('Network error. Please make sure the backend is running.');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-8 border border-border bg-surface rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold text-primary mb-6">Create Account</h2>
      
      {generalError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded text-sm">
          {generalError}
        </div>
      )}

      <form onSubmit={handleSignup} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1 text-primary">First Name *</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className={`w-full px-3 py-2 border rounded bg-white text-primary text-sm focus:outline-none ${
                fieldErrors.firstName ? 'border-red-500 focus:border-red-500' : 'border-border focus:border-primary'
              }`}
              required
            />
            {fieldErrors.firstName && (
              <p className="text-red-500 text-xs mt-1">{fieldErrors.firstName}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1 text-primary">Last Name</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className={`w-full px-3 py-2 border rounded bg-white text-primary text-sm focus:outline-none ${
                fieldErrors.lastName ? 'border-red-500 focus:border-red-500' : 'border-border focus:border-primary'
              }`}
            />
            {fieldErrors.lastName && (
              <p className="text-red-500 text-xs mt-1">{fieldErrors.lastName}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1 text-primary">Date of Birth *</label>
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className={`w-full px-3 py-2 border rounded bg-white text-primary text-sm focus:outline-none ${
                fieldErrors.dob ? 'border-red-500 focus:border-red-500' : 'border-border focus:border-primary'
              }`}
              required
            />
            {fieldErrors.dob && (
              <p className="text-red-500 text-xs mt-1">{fieldErrors.dob}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1 text-primary">Gender *</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded bg-white text-primary text-sm focus:outline-none focus:border-primary"
              required
            >
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select>
            {fieldErrors.gender && (
              <p className="text-red-500 text-xs mt-1">{fieldErrors.gender}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1 text-primary">Phone Number (Indian) *</label>
          <input
            type="tel"
            placeholder="10-digit mobile number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className={`w-full px-3 py-2 border rounded bg-white text-primary text-sm focus:outline-none ${
              fieldErrors.phoneNumber ? 'border-red-500 focus:border-red-500' : 'border-border focus:border-primary'
            }`}
            required
          />
          {fieldErrors.phoneNumber && (
            <p className="text-red-500 text-xs mt-1">{fieldErrors.phoneNumber}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1 text-primary">Email address *</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full px-3 py-2 border rounded bg-white text-primary text-sm focus:outline-none ${
              fieldErrors.email ? 'border-red-500 focus:border-red-500' : 'border-border focus:border-primary'
            }`}
            required
          />
          {fieldErrors.email && (
            <p className="text-red-500 text-xs mt-1">{fieldErrors.email}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1 text-primary">Password *</label>
          <input
            type="password"
            placeholder="Min 8 chars, 1 uppercase, 1 special char"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`w-full px-3 py-2 border rounded bg-white text-primary text-sm focus:outline-none ${
              fieldErrors.password ? 'border-red-500 focus:border-red-500' : 'border-border focus:border-primary'
            }`}
            required
          />
          {fieldErrors.password && (
            <p className="text-red-500 text-xs mt-1">{fieldErrors.password}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 bg-primary text-white font-semibold rounded hover:bg-slate-800 transition-colors text-sm ${
            loading ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Creating Account...' : 'Sign Up'}
        </button>
      </form>
      <p className="mt-4 text-xs text-center text-slate-500">
        Already have an account? <Link to="/login" className="underline text-primary">Sign in</Link>
      </p>
    </div>
  );
};

export default Signup;
