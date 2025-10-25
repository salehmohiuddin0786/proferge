"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Head from 'next/head';
import Link from 'next/link';
import { UserPlus } from 'lucide-react';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('applicant');
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Debug: Log API URL
    console.log('API URL:', API_URL);

    // Client-side validation
    if (!username || !email || !phone || !password) {
      setError('All fields are required');
      setIsSubmitting(false);
      return;
    }
    if (!/^\+?[1-9]\d{1,14}$/.test(phone)) {
      setError('Please enter a valid phone number (e.g., +1234567890)');
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, phone, password, role }),
      });
      // Debug: Log response
      const responseData = await res.json();
      console.log('Register Response:', responseData);

      if (!res.ok) {
        if (res.status === 404) {
          throw new Error('Registration endpoint not found. Please check the backend server.');
        }
        throw new Error(responseData.error || 'Registration failed');
      }
      router.push('/login');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>Register - Proferge Talent Partners</title>
        <meta name="description" content="Create an account to manage job postings or apply for jobs with Proferge Talent Partners." />
      </Head>
      <div className="min-h-screen bg-[#F7F8FA] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl border border-[#E0E2E8] p-8 max-w-md w-full">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#0A2540] font-[Montserrat]">Register</h1>
            <p className="text-[#0A2540]/80 mt-2 font-[Open Sans]">
              Create your Proferge Talent Partners account to get started.
            </p>
          </div>
          {error && (
            <div className="bg-red-100 text-red-700 p-4 rounded-xl mb-6 font-[Open Sans]">
              {error}
            </div>
          )}
          <form onSubmit={handleRegister} className="space-y-6">
            <div>
              <label className="block text-[#0A2540] font-semibold mb-2 font-[Open Sans]">
                Username *
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 border border-[#E0E2E8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00A7A7] focus:border-transparent transition-all duration-300 font-[Open Sans]"
                placeholder="Enter your username"
                required
              />
            </div>
            <div>
              <label className="block text-[#0A2540] font-semibold mb-2 font-[Open Sans]">
                Email *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-[#E0E2E8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00A7A7] focus:border-transparent transition-all duration-300 font-[Open Sans]"
                placeholder="Enter your email"
                required
              />
            </div>
            <div>
              <label className="block text-[#0A2540] font-semibold mb-2 font-[Open Sans]">
                Phone *
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 border border-[#E0E2E8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00A7A7] focus:border-transparent transition-all duration-300 font-[Open Sans]"
                placeholder="e.g., +1234567890"
                required
              />
            </div>
            <div>
              <label className="block text-[#0A2540] font-semibold mb-2 font-[Open Sans]">
                Password *
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-[#E0E2E8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00A7A7] focus:border-transparent transition-all duration-300 font-[Open Sans]"
                placeholder="Enter your password"
                required
              />
            </div>
            <div>
              <label className="block text-[#0A2540] font-semibold mb-2 font-[Open Sans]">
                Role *
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-3 border border-[#E0E2E8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00A7A7] focus:border-transparent transition-all duration-300 font-[Open Sans]"
                required
              >
                <option value="applicant">Applicant</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full bg-[#00A7A7] text-[#F7F8FA] font-semibold py-4 px-6 rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center space-x-2 font-[Open Sans] ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#008080] transform hover:scale-105'
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-[#F7F8FA] border-t-transparent rounded-full animate-spin"></div>
                  <span>Registering...</span>
                </>
              ) : (
                <>
                  <span>Register</span>
                  <UserPlus className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
          <p className="text-center text-[#0A2540]/80 mt-4 font-[Open Sans]">
            Already have an account?{' '}
            <Link href="/login" className="text-[#00A7A7] hover:underline font-semibold">
              Log In
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;