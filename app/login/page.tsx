"use client";

import { useState } from "react";
import supabase from "../lib/supabaseClient";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Mail, Lock, ArrowRight, Eye, EyeOff, Smartphone } from "lucide-react";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setIsLoading(false);
      return setError(error.message);
    }

    document.cookie = `sb-access-token=${data.session?.access_token}; path=/`;
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[var(--primary-800)] via-[var(--primary-700)] to-[var(--primary-900)] p-12 flex-col justify-between relative overflow-hidden">
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
        
        <div className="relative z-10 space-y-6">
          <div>
            <h2 className="text-4xl font-bold text-white mb-4">Welcome Back</h2>
            <p className="text-xl text-white/80 max-w-md">
              Continue your musical journey with access to our comprehensive digital library and learning resources.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 max-w-sm">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-2xl font-bold text-white">500+</div>
              <div className="text-sm text-white/70">Learning Resources</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-2xl font-bold text-white">24/7</div>
              <div className="text-sm text-white/70">AI Assistance</div>
            </div>
          </div>
        </div>
        
        <div className="relative z-10">
          <p className="text-white/50 text-sm">
            © 2025 Vivace Music School Kenya. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right Panel - Login Form */}
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
              <h2 className="text-2xl font-bold text-[var(--primary-900)] mb-2">Sign In</h2>
              <p className="text-[var(--neutral-600)]">
                Enter your credentials to access your account
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
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
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-[var(--neutral-200)]">
              <p className="text-center text-[var(--neutral-600)] mb-4">
                Don&apos;t have an account?{" "}
                <a 
                  href="/register" 
                  className="font-semibold text-[var(--primary-700)] hover:text-[var(--primary-800)] transition-colors"
                >
                  Create account
                </a>
              </p>
              
              <div className="mt-4 p-4 bg-[var(--secondary-50)] rounded-lg border border-[var(--secondary-200)]">
                <div className="flex items-center gap-3">
                  <Smartphone size={20} className="text-[var(--secondary-600)] shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm text-[var(--neutral-700)] mb-1">
                      <strong>Access on mobile:</strong> Download the Vivace Student Portal App
                    </p>
                    <a 
                      href="https://ksvlqxjnhvesydokmdfw.supabase.co/storage/v1/object/public/app-releases/vivace.apk"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-semibold text-[var(--secondary-700)] hover:text-[var(--secondary-800)] hover:underline transition-colors"
                    >
                      Get Android App →
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <p className="mt-8 text-center text-sm text-[var(--neutral-500)]">
            By signing in, you agree to our{" "}
            <a href="/terms-and-conditions" className="text-[var(--primary-600)] hover:underline">Terms of Service</a>
            {" "}and{" "}
            <a href="/privacy-policy" className="text-[var(--primary-600)] hover:underline">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
}
