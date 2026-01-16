'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Mail, Lock, User, ArrowRight, Eye, EyeOff, Check, BookOpen, Video, MessageSquare } from 'lucide-react';

export default function Register() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [agree, setAgree] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const features = [
    { icon: BookOpen, text: 'Access 500+ music resources' },
    { icon: Video, text: 'HD video lessons' },
    { icon: MessageSquare, text: '24/7 AI learning assistant' },
  ];

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!agree) {
      setIsLoading(false);
      return setError('You must agree to the Privacy Policy and Terms and Conditions.');
    }

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
      },
    });

    if (authError) {
      setIsLoading(false);
      return setError(authError.message);
    }

    setShowToast(true);
    setTimeout(() => {
      router.push('/login');
    }, 2000);
  };

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[var(--secondary-800)] via-[var(--secondary-700)] to-[var(--secondary-900)] p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-white/5 to-transparent"></div>
        
        <div className="relative z-10">
          <a href="/" className="inline-flex items-center gap-3">
            <Image 
              src="/Logo.png" 
              alt="Vivace Music School" 
              width={60} 
              height={60}
              className="object-contain"
              priority
            />
            <div>
              <h1 className="text-xl font-bold text-white">Vivace Music School</h1>
              <p className="text-sm text-white/70">Kenya</p>
            </div>
          </a>
        </div>
        
        <div className="relative z-10 space-y-8">
          <div>
            <h2 className="text-4xl font-bold text-white mb-4">Start Your Journey</h2>
            <p className="text-xl text-white/80 max-w-md">
              Join thousands of students mastering music with Kenya&apos;s premier digital learning platform.
            </p>
          </div>
          
          <div className="space-y-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center">
                  <feature.icon size={20} className="text-white" />
                </div>
                <span className="text-white/90">{feature.text}</span>
              </div>
            ))}
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 max-w-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-8 h-8 bg-white/20 rounded-full border-2 border-white/30"></div>
                ))}
              </div>
              <span className="text-white/90 text-sm">Join 10,000+ students</span>
            </div>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <svg key={i} className="w-4 h-4 text-[var(--accent-400)]" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span className="text-white/70 text-sm ml-2">4.9/5 rating</span>
            </div>
          </div>
        </div>
        
        <div className="relative z-10">
          <p className="text-white/50 text-sm">
            © 2025 Vivace Music School Kenya. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right Panel - Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-[var(--background)]">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8 text-center">
            <a href="/" className="inline-flex items-center gap-3">
              <Image 
                src="/Logo.png" 
                alt="Vivace Music School" 
                width={80} 
                height={80}
                className="object-contain"
                priority
              />
            </a>
            <h1 className="mt-4 text-2xl font-bold text-[var(--primary-900)]">Vivace Music School Kenya</h1>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-[var(--neutral-200)] p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-[var(--primary-900)] mb-2">Create Account</h2>
              <p className="text-[var(--neutral-600)]">
                Join our community of music learners
              </p>
            </div>

            <form onSubmit={handleRegister} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-[var(--neutral-700)] mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User size={18} className="text-[var(--neutral-400)]" />
                  </div>
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 border border-[var(--neutral-300)] rounded-lg bg-white text-[var(--neutral-900)] placeholder-[var(--neutral-400)] focus:border-[var(--primary-500)] focus:ring-2 focus:ring-[var(--primary-500)]/20 focus:outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--neutral-700)] mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail size={18} className="text-[var(--neutral-400)]" />
                  </div>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 border border-[var(--neutral-300)] rounded-lg bg-white text-[var(--neutral-900)] placeholder-[var(--neutral-400)] focus:border-[var(--primary-500)] focus:ring-2 focus:ring-[var(--primary-500)]/20 focus:outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--neutral-700)] mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock size={18} className="text-[var(--neutral-400)]" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-12 py-3 border border-[var(--neutral-300)] rounded-lg bg-white text-[var(--neutral-900)] placeholder-[var(--neutral-400)] focus:border-[var(--primary-500)] focus:ring-2 focus:ring-[var(--primary-500)]/20 focus:outline-none transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-[var(--neutral-400)] hover:text-[var(--neutral-600)]"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <p className="mt-2 text-xs text-[var(--neutral-500)]">
                  Password must be at least 6 characters long
                </p>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex items-center h-5 mt-0.5">
                  <input
                    type="checkbox"
                    id="agree"
                    checked={agree}
                    onChange={(e) => setAgree(e.target.checked)}
                    className="w-4 h-4 border-[var(--neutral-300)] rounded text-[var(--primary-600)] focus:ring-[var(--primary-500)] cursor-pointer"
                  />
                </div>
                <label htmlFor="agree" className="text-sm text-[var(--neutral-600)]">
                  I agree to the{' '}
                  <a href="/privacy-policy" className="text-[var(--primary-600)] hover:underline font-medium">
                    Privacy Policy
                  </a>{' '}
                  and{' '}
                  <a href="/terms-and-conditions" className="text-[var(--primary-600)] hover:underline font-medium">
                    Terms and Conditions
                  </a>
                </label>
              </div>

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 bg-[var(--primary-700)] text-white py-3.5 rounded-lg font-semibold hover:bg-[var(--primary-800)] focus:ring-4 focus:ring-[var(--primary-500)]/30 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Creating account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-[var(--neutral-200)]">
              <p className="text-center text-[var(--neutral-600)]">
                Already have an account?{' '}
                <a 
                  href="/login" 
                  className="font-semibold text-[var(--primary-700)] hover:text-[var(--primary-800)] transition-colors"
                >
                  Sign in
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Success Toast */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-300">
          <div className="flex items-center gap-3 bg-[var(--secondary-600)] text-white px-6 py-4 rounded-lg shadow-lg">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <Check size={18} />
            </div>
            <div>
              <p className="font-medium">Account created successfully!</p>
              <p className="text-sm text-white/80">Check your email for the confirmation link.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
