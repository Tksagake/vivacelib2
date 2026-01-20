'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Navbar from '../components/Navbar';
import { BookOpen, MessageSquare, Video, Music2, ArrowRight, TrendingUp, Clock, Smartphone, Download } from 'lucide-react';

// Initialize Supabase client
const supabase = createClientComponentClient();

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [greeting, setGreeting] = useState('');
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

    // Set greeting based on time of day
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 17) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, [router]);

  const quickActions = [
    {
      title: 'Digital Library',
      description: 'Access 500+ music books, theory guides, and Trinity College London preparation materials',
      icon: BookOpen,
      href: '/library',
      color: 'bg-[var(--primary-100)]',
      iconColor: 'text-[var(--primary-600)]',
      stats: '500+ Resources',
    },
    {
      title: 'AI Assistant',
      description: 'Get instant answers to your music theory questions with our intelligent chatbot',
      icon: MessageSquare,
      href: '/chat',
      color: 'bg-[var(--secondary-100)]',
      iconColor: 'text-[var(--secondary-600)]',
      stats: '24/7 Available',
    },
    {
      title: 'Video Lessons',
      description: 'Watch expert tutorials and masterclasses aligned with Trinity syllabi',
      icon: Video,
      href: '/youtube',
      color: 'bg-[var(--accent-100)]',
      iconColor: 'text-[var(--accent-600)]',
      stats: 'HD Quality',
    },
    {
      title: 'Score Editor',
      description: 'Create and edit musical scores with our intuitive ABC notation editor',
      icon: Music2,
      href: '/sheets',
      color: 'bg-purple-100',
      iconColor: 'text-purple-600',
      stats: 'Export Ready',
    },
  ];

  const recentActivity = [
    { type: 'book', title: 'Trinity Grade 5 Theory', time: '2 hours ago' },
    { type: 'chat', title: 'Circle of Fifths discussion', time: 'Yesterday' },
    { type: 'video', title: 'Piano Scales Tutorial', time: '3 days ago' },
  ];

  const learningTips = [
    'Practice sight-reading for 15 minutes daily to improve fluency.',
    'Use the AI assistant to clarify complex theory concepts.',
    'Review your Trinity materials weekly for better retention.',
  ];

  const firstName = user?.user_metadata?.full_name?.split(' ')[0] || 'Student';

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Navbar />

      {/* Welcome Header */}
      <div className="bg-gradient-to-br from-[var(--primary-800)] to-[var(--primary-900)] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <p className="text-white/70 text-sm font-medium mb-1">{greeting}</p>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                Welcome back, {firstName}!
              </h1>
              <p className="text-lg text-white/80">
                Continue your musical journey where you left off.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center min-w-[140px]">
                <div className="text-sm font-medium text-white/70 mb-1">Trinity Center</div>
                <div className="text-lg font-bold text-[var(--accent-400)]">#74255</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Student Portal App Banner */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-[var(--secondary-50)] to-[var(--accent-50)] rounded-xl border border-[var(--secondary-200)] p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="w-16 h-16 bg-gradient-to-br from-[var(--secondary-600)] to-[var(--secondary-700)] rounded-2xl flex items-center justify-center shrink-0 shadow-lg">
                <Smartphone className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-[var(--primary-900)] mb-2">
                  Take Vivace With You
                </h3>
                <p className="text-[var(--neutral-700)] mb-4">
                  Access your academic records, grades, notices, and school communications on the go with the official Vivace Student Portal App for Android.
                </p>
                <a
                  href="https://ksvlqxjnhvesydokmdfw.supabase.co/storage/v1/object/public/app-releases/vivace2.apk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--secondary-600)] text-white font-semibold rounded-lg hover:bg-[var(--secondary-700)] transition-all shadow-md hover:shadow-lg"
                >
                  <Download size={18} />
                  <span>Download Android App</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Quick Actions - Main Column */}
          <div className="lg:col-span-2 space-y-8">
            <section>
              <h2 className="text-xl font-bold text-[var(--primary-900)] mb-6">Quick Access</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {quickActions.map((action, index) => (
                  <a
                    key={index}
                    href={action.href}
                    className="group bg-white rounded-xl border border-[var(--neutral-200)] p-6 hover:shadow-lg hover:border-[var(--primary-300)] transition-all duration-300"
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                        <action.icon size={24} className={action.iconColor} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-semibold text-[var(--primary-900)] group-hover:text-[var(--primary-700)] transition-colors">
                            {action.title}
                          </h3>
                          <ArrowRight size={18} className="text-[var(--neutral-400)] group-hover:text-[var(--primary-600)] group-hover:translate-x-1 transition-all" />
                        </div>
                        <p className="text-sm text-[var(--neutral-600)] mb-2 line-clamp-2">
                          {action.description}
                        </p>
                        <span className="inline-block px-2 py-0.5 bg-[var(--neutral-100)] text-[var(--neutral-600)] text-xs font-medium rounded">
                          {action.stats}
                        </span>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </section>

            {/* Trinity Resources Section */}
            <section>
              <h2 className="text-xl font-bold text-[var(--primary-900)] mb-6">Trinity College London Resources</h2>
              <div className="bg-white rounded-xl border border-[var(--neutral-200)] p-6">
                <p className="text-[var(--neutral-700)] mb-6">
                  As an authorized Trinity College London Examination Center, we provide comprehensive resources 
                  aligned with Trinity syllabi for all grade levels and diploma examinations.
                </p>
                <div className="grid sm:grid-cols-3 gap-4">
                  <a href="/library" className="text-center p-4 bg-[var(--primary-50)] rounded-xl hover:bg-[var(--primary-100)] transition-colors">
                    <div className="w-12 h-12 bg-[var(--primary-100)] rounded-full flex items-center justify-center mx-auto mb-3">
                      <BookOpen size={24} className="text-[var(--primary-600)]" />
                    </div>
                    <div className="font-semibold text-[var(--primary-900)]">Theory Books</div>
                    <div className="text-sm text-[var(--neutral-600)]">Grades 1-8</div>
                  </a>
                  <a href="/youtube" className="text-center p-4 bg-[var(--secondary-50)] rounded-xl hover:bg-[var(--secondary-100)] transition-colors">
                    <div className="w-12 h-12 bg-[var(--secondary-100)] rounded-full flex items-center justify-center mx-auto mb-3">
                      <Video size={24} className="text-[var(--secondary-600)]" />
                    </div>
                    <div className="font-semibold text-[var(--primary-900)]">Video Tutorials</div>
                    <div className="text-sm text-[var(--neutral-600)]">Performance & Theory</div>
                  </a>
                  <a href="/sheets" className="text-center p-4 bg-[var(--accent-50)] rounded-xl hover:bg-[var(--accent-100)] transition-colors">
                    <div className="w-12 h-12 bg-[var(--accent-100)] rounded-full flex items-center justify-center mx-auto mb-3">
                      <Music2 size={24} className="text-[var(--accent-600)]" />
                    </div>
                    <div className="font-semibold text-[var(--primary-900)]">Score Editor</div>
                    <div className="text-sm text-[var(--neutral-600)]">Create & Export</div>
                  </a>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Activity */}
            <section className="bg-white rounded-xl border border-[var(--neutral-200)] p-6">
              <div className="flex items-center gap-2 mb-4">
                <Clock size={18} className="text-[var(--neutral-500)]" />
                <h3 className="font-semibold text-[var(--primary-900)]">Recent Activity</h3>
              </div>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      activity.type === 'book' ? 'bg-[var(--primary-100)]' :
                      activity.type === 'chat' ? 'bg-[var(--secondary-100)]' : 'bg-[var(--accent-100)]'
                    }`}>
                      {activity.type === 'book' && <BookOpen size={14} className="text-[var(--primary-600)]" />}
                      {activity.type === 'chat' && <MessageSquare size={14} className="text-[var(--secondary-600)]" />}
                      {activity.type === 'video' && <Video size={14} className="text-[var(--accent-600)]" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[var(--neutral-800)] truncate">{activity.title}</p>
                      <p className="text-xs text-[var(--neutral-500)]">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Learning Tips */}
            <section className="bg-gradient-to-br from-[var(--accent-50)] to-[var(--accent-100)] rounded-xl p-6 border border-[var(--accent-200)]">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp size={18} className="text-[var(--accent-600)]" />
                <h3 className="font-semibold text-[var(--primary-900)]">Study Tips</h3>
              </div>
              <div className="space-y-3">
                {learningTips.map((tip, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="w-5 h-5 bg-[var(--accent-500)] text-white rounded-full flex items-center justify-center text-xs font-medium shrink-0 mt-0.5">
                      {index + 1}
                    </div>
                    <p className="text-sm text-[var(--neutral-700)]">{tip}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
