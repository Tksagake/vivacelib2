'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useRouter } from 'next/navigation';

export default function Register() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [agree, setAgree] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!agree) {
      return setError('You must agree to the Privacy Policy and Terms and Conditions.');
    }

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
          email: email, // Explicitly include in metadata
        },
      },
    });

    if (authError) return setError(authError.message);

    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: authData.user?.id,
        user_id: authData.user?.id,
        email: email,
        full_name: name,
        status: 'pending',
      });

    if (profileError) return setError(profileError.message);

    // Show toast message
    setShowToast(true);

    // Redirect to login page after a short delay
    setTimeout(() => {
      router.push('/login');
    }, 1000); // Adjust the delay as needed
  };

  // Hide toast after 3 seconds
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-100 to-white p-4">
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-sm w-full animate-fade-in">
        <div className="flex flex-col items-center mb-6">
          <img src="/Logo.png" alt="Vivace Logo" className="w-26 h-26" />
          <h2 className="text-purple-600 text-lg font-semibold">Create an Account</h2>
          <p className="text-gray-600 text-sm">Join us and start your musical journey!</p>
        </div>
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="text-purple-600 text-sm mb-1 block">Full Name</label>
            <input
              type="text"
              placeholder="Sikolia"
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 rounded-lg border border-purple-300 outline-none focus:ring-2 focus:ring-purple-500 bg-purple-50 text-purple-900 placeholder-gray-400"
            />
          </div>
          <div>
            <label className="text-purple-600 text-sm mb-1 block">Email Address</label>
            <input
              type="email"
              placeholder="you@example.com"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-lg border border-purple-300 outline-none focus:ring-2 focus:ring-purple-500 bg-purple-50 text-purple-900 placeholder-gray-400"
            />
          </div>
          <div>
            <label className="text-purple-600 text-sm mb-1 block">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-lg border border-purple-300 outline-none focus:ring-2 focus:ring-purple-500 bg-purple-50 text-purple-900 placeholder-gray-400"
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="agree"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="agree" className="text-purple-600 text-sm">
              I agree to the{' '}
              <a href="/privacy-policy" className="underline hover:text-purple-500">
                Privacy Policy
              </a>{' '}
              and{' '}
              <a href="/terms-and-conditions" className="underline hover:text-purple-500">
                Terms and Conditions
              </a>
              .
            </label>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-3 rounded-lg font-bold text-lg transition-transform hover:scale-105 active:scale-95"
          >
            Register
          </button>
        </form>
        <p className="mt-4 text-center text-purple-600">
          Already have an account?{' '}
          <a href="/login" className="underline hover:text-purple-500">
            Log in here
          </a>
        </p>
      </div>
      {showToast && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg">
          Check your email for the confirmation link!
        </div>
      )}
    </div>
  );
}
