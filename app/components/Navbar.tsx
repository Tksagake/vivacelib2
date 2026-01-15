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
    <nav className="bg-gradient-to-r from-cyan-50 to-blue-50 shadow-md py-3 border-b border-cyan-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <a href="/" className="flex items-center space-x-3">
        <div className="flex items-center space-x-3">
          <Image
            src="/Logo.png"
            alt="Vivace Resource Centre Logo"
            width={120}
            height={48}
            className="object-contain"
            priority
          />
          <h2 className="text-lg text-cyan-800 font-semibold hidden sm:block">
            Vivace Resource Centre
          </h2>
        </div>
        </a>
        <div className="flex items-center space-x-4">
          
          {/* Library Link */}
          <a href="/library" className="text-cyan-700 hover:text-cyan-800 flex items-center font-medium">
            <BookOpen className="sm:mr-1" size={20} />
            <span className="hidden sm:inline">Library</span>
          </a>
          
          {/* Chat Link */}
          <a href="/chat" className="text-cyan-700 hover:text-cyan-800 flex items-center font-medium">
            <MessageCircle className="sm:mr-1" size={20} />
            <span className="hidden sm:inline">Chat</span>
          </a>
          
          {/* YouTube Link */}
          <a href="/youtube" className="text-cyan-700 hover:text-cyan-800 flex items-center font-medium">
            <Music className="sm:mr-1" size={20} />
            <span className="hidden sm:inline">YouTube</span>
          </a>
          
          {/* Sheets Link */}
          <a href="/sheets" className="text-cyan-700 hover:text-cyan-800 flex items-center font-medium">
            <BookOpen className="sm:mr-1" size={20} />
            <span className="hidden sm:inline">Score Sheet</span>
          </a>
          
          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="text-sm text-red-600 hover:text-red-700 flex items-center font-medium"
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