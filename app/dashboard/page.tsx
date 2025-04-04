'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Navbar from '../components/Navbar'; // Adjust the path as necessary
import { TypeAnimation } from 'react-type-animation';

// Initialize Supabase client
const supabase = createClientComponentClient();

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session?.user) {
        router.push('/login');
      } else {
        setUser(session.user);
      }
    };

    getSession();
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-white">
      {/* Import and use the Navbar component */}
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mt-12">
          <h1 className="text-4xl font-bold text-purple-800 animate-bounce">
            Welcome, {user?.user_metadata?.full_name?.split(' ')[0]}! 🎵
          </h1>
          <p className="mt-4 text-lg text-gray-700">
            Ready to dive into a world of music and learning? 📚🎶
          </p>
          <div className="mt-8 text-base text-gray-600 space-y-4">
            <TypeAnimation
              sequence={[
                '✨ "Small progress each day adds up to big results."',
                2000,
                '🎯 "Consistency beats motivation – let’s go!"',
                2000,
                '🚀 "Vivace: Learn. Create. Elevate."',
                2000,
                '🎶 "Music is the universal language of mankind."',
                2000,
              ]}
              wrapper="span"
              speed={50}
              style={{ display: 'inline-block', fontStyle: 'italic', color: 'purple' }}
              repeat={Infinity}
            />
          </div>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-10">
          {/* Library Card */}
          <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center hover:shadow-lg transition-shadow">
            <img src="/logo.png" alt="Library Icon" className="w-16 h-16 mb-4" />
            <h2 className="text-xl font-semibold text-purple-800">Digital Library</h2>
            <p className="mt-2 text-gray-600">Explore our collection of books and resources.</p>
            <a href="/library" className="mt-4 text-purple-600 hover:underline">
              Visit Library
            </a>
          </div>

          {/* AI Model Card */}
          <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center hover:shadow-lg transition-shadow">
            <img src="/aicon.png" alt="AI Icon" className="w-16 h-16 mb-4" />
            <h2 className="text-xl font-semibold text-purple-800">AI Model</h2>
            <p className="mt-2 text-gray-600">Interact with our AI to enhance your learning experience.</p>
            <a href="/chat" className="mt-4 text-purple-600 hover:underline">
              Explore AI
            </a>
          </div>

          {/* Profile Card */}
          <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center hover:shadow-lg transition-shadow">
            <img src="/download.jpeg" alt="Profile Icon" className="w-16 h-16 mb-4" />
            <h2 className="text-xl font-semibold text-purple-800">Youtube Learn</h2>
            <p className="mt-2 text-gray-600">View and update your profile information.</p>
            <a href="/profile" className="mt-4 text-purple-600 hover:underline">
              Go to Profile
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
