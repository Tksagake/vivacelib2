import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { BookOpen, MessageCircle, Video, Music2, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';

const supabase = createClientComponentClient();

const Navbar: React.FC = () => {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const navLinks = [
    { href: '/library', icon: BookOpen, label: 'Library' },
    { href: '/chat', icon: MessageCircle, label: 'AI Chat' },
    { href: '/youtube', icon: Video, label: 'Video Lessons' },
    { href: '/sheets', icon: Music2, label: 'Score Editor' },
  ];

  return (
    <nav className="bg-white border-b border-[var(--neutral-200)] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="/dashboard" className="flex items-center gap-3 shrink-0">
            <Image
              src="/Logo.png"
              alt="Vivace Music School Kenya"
              width={48}
              height={48}
              className="object-contain"
              priority
            />
            <div className="hidden sm:block">
              <h2 className="text-sm font-semibold text-[var(--primary-900)]">
                Vivace Music School
              </h2>
              <p className="text-xs text-[var(--neutral-500)]">Kenya</p>
            </div>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[var(--neutral-600)] hover:text-[var(--primary-700)] hover:bg-[var(--primary-50)] rounded-lg transition-colors"
              >
                <link.icon size={18} />
                <span>{link.label}</span>
              </a>
            ))}
          </div>

          {/* Desktop Logout */}
          <div className="hidden md:flex items-center">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[var(--error)] hover:bg-red-50 rounded-lg transition-colors"
              aria-label="Log out"
            >
              <LogOut size={18} />
              <span>Log Out</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-[var(--neutral-600)] hover:bg-[var(--neutral-100)] rounded-lg"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-[var(--neutral-200)]">
          <div className="px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-[var(--neutral-700)] hover:text-[var(--primary-700)] hover:bg-[var(--primary-50)] rounded-lg transition-colors"
              >
                <link.icon size={20} />
                <span>{link.label}</span>
              </a>
            ))}
            <div className="pt-4 mt-4 border-t border-[var(--neutral-200)]">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-[var(--error)] hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut size={20} />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;