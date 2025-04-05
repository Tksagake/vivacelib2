"use client";

import { useState } from "react";
import supabase from "../lib/supabaseClient"; // Import the centralized Supabase client
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) return setError(error.message);

    // Set the authentication token in cookies
    document.cookie = `sb-access-token=${data.session?.access_token}; path=/`;

    console.log("Redirecting to /dashboard");
    router.push("/dashboard");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-100 to-white p-4">
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-sm w-full animate-fade-in">
        <div className="flex flex-col items-center mb-6">
          <img src="/Logo.png" alt="Logo" className="w-46 h-46" />
          <h3 className="text-purple-600">Welcome Back</h3>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
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
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-3 rounded-lg font-bold text-lg transition-transform hover:scale-105 active:scale-95"
          >
            Login
          </button>
        </form>
        <p className="mt-4 text-center text-purple-600">
          Don't have an account?{" "}
          <a href="/register" className="underline hover:text-purple-500">
            Register here
          </a>
        </p>
      </div>
    </div>
  );
}
