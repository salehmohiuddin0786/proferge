"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Head from 'next/head';
import Link from 'next/link';
import { LogIn } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      console.log('Logging in to:', `${API_URL}/api/auth/login`);
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const responseData = await res.json();
      console.log('Login Response:', responseData);
      if (!res.ok) {
        if (res.status === 401) {
          throw new Error('Invalid email or password. Please try again.');
        }
        if (res.status === 404) {
          throw new Error('Login endpoint not found. Please check the backend server.');
        }
        throw new Error(responseData.error || 'Login failed');
      }
      localStorage.setItem('token', responseData.token);
      router.push('/addjobs');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>Login - Proferge Talent Partners</title>
        <meta name="description" content="Log in to manage job postings and applications with Proferge Talent Partners." />
      </Head>
      <div className="min-h-screen bg-[#F7F8FA] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl border border-[#E0E2E8] p-8 max-w-md w-full">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#0A2540] font-[Montserrat]">Log In</h1>
            <p className="text-[#0A2540]/80 mt-2 font-[Open Sans]">
              Access your Proferge Talent Partners account to manage jobs and applications.
            </p>
          </div>
          {error && (
            <div className="bg-red-100 text-red-700 p-4 rounded-xl mb-6 font-[Open Sans]">
              {error}
            </div>
          )}
          <form onSubmit={handleLogin} className="space-y-6">
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
                  <span>Logging in...</span>
                </>
              ) : (
                <>
                  <span>Log In</span>
                  <LogIn className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
          <p className="text-center text-[#0A2540]/80 mt-4 font-[Open Sans]">
            Don’t have an account?{' '}
            <Link href="/register" className="text-[#00A7A7] hover:underline font-semibold">
              Register
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default LoginPage;