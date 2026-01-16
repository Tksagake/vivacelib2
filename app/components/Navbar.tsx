import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { BookOpen, MessageCircle, Music, LogOut } from 'lucide-react';

const supabase = createClientComponentClient();

const Navbar: React.FC = () => {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <nav className="bg-purple-50 shadow-sm py-3">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <a href="/" className="flex items-center space-x-3">
        <div className="flex items-center space-x-3">
          <Image
            src="/Logo.png"
            alt="Vivace Logo"
            width={120}
            height={48}
            className="object-contain"
            priority
          />
          <h2 className="text-lg text-purple-700 font-medium hidden sm:block">
            Vivace Music Kenya Resource Center
          </h2>
        </div>
        </a>z
        <div className="flex items-center space-x-4">
          
          {/* Library Link */}
          <a href="/library" className="text-purple-600 hover:text-purple-800 flex items-center">
            <BookOpen className="sm:mr-1" size={20} />
            <span className="hidden sm:inline">Library</span>
          </a>
          
          {/* Chat Link */}
          <a href="/chat" className="text-purple-600 hover:text-purple-800 flex items-center">
            <MessageCircle className="sm:mr-1" size={20} />
            <span className="hidden sm:inline">Chat</span>
          </a>
          
          {/* YouTube Link */}
          <a href="/youtube" className="text-purple-600 hover:text-purple-800 flex items-center">
            <Music className="sm:mr-1" size={20} />
            <span className="hidden sm:inline">YouTube</span>
          </a>
          
          {/* Sheets Link */}
          <a href="/sheets" className="text-purple-600 hover:text-purple-800 flex items-center">
            <BookOpen className="sm:mr-1" size={20} />
            <span className="hidden sm:inline">Score Sheet</span>
          </a>
          
          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="text-sm text-red-600 hover:text-red-800 flex items-center"
            aria-label="Log out"
          >
            <LogOut className="sm:mr-1" size={20} />
            <span className="hidden sm:inline">Log Out</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;