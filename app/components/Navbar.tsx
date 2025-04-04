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
        <div className="flex items-center space-x-3">
          <Image
            src="/logo.png"
            alt="Vivace Music School Kenya Logo"
            width={120}
            height={48}
            className="object-contain"
          />
          <h2 className="text-lg text-purple-700 font-medium">Vivace Music School Kenya</h2>
        </div>
        <div className="flex items-center space-x-4">
          <a href="/library" className="text-purple-600 hover:text-purple-800 flex items-center">
            <BookOpen className="mr-1" size={20} /> Library
          </a>
          <a href="/chat" className="text-purple-600 hover:text-purple-800 flex items-center">
            <MessageCircle className="mr-1" size={20} /> Chat
          </a>
          <a href="/youtube" className="text-purple-600 hover:text-purple-800 flex items-center">
            <Music className="mr-1" size={20} /> YouTube
          </a>
            <a href="/sheets" className="text-purple-600 hover:text-purple-800 flex items-center">
                <BookOpen className="mr-1" size={20} /> Score Sheet Manuscript
            </a>
          <button
            onClick={handleLogout}
            className="text-sm text-red-600 hover:text-red-800 flex items-center"
          >
            <LogOut className="mr-1" size={20} /> Log Out
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
