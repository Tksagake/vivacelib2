'use client';

import { Smartphone, Download, Shield, Zap, BookOpen, Bell } from 'lucide-react';

export default function StudentPortalAppSection() {
  const APK_DOWNLOAD_URL = 'https://ksvlqxjnhvesydokmdfw.supabase.co/storage/v1/object/public/app-releases/vivace.apk';
  
  const features = [
    {
      icon: BookOpen,
      title: 'Academic Records',
      description: 'View grades, progress reports, and Trinity College London exam results'
    },
    {
      icon: Bell,
      title: 'School Notices',
      description: 'Stay updated with announcements, event schedules, and important communications'
    },
    {
      icon: Zap,
      title: 'Quick Access',
      description: 'Instant access to your student profile, attendance records, and course materials'
    },
    {
      icon: Shield,
      title: 'Secure & Official',
      description: 'Authenticated access to your personal academic information and school resources'
    }
  ];

  return (
    <section id="app" className="py-20 lg:py-28 bg-gradient-to-br from-[var(--primary-50)] to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--primary-100)] text-[var(--primary-700)] rounded-full text-sm font-semibold mb-6">
              <Smartphone size={16} />
              <span>Official Mobile Application</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--primary-900)] mb-6">
              Vivace Student Portal App
            </h2>
            
            <p className="text-lg text-[var(--neutral-700)] leading-relaxed mb-6">
              Access your academic information, school notices, and student resources directly from your mobile device. 
              The Vivace Student Portal App is the official platform for staying connected with your musical education journey.
            </p>
            
            <p className="text-base text-[var(--neutral-600)] leading-relaxed mb-8">
              Designed specifically for Vivace students and their families, this application provides secure, 
              authenticated access to academic records, examination results, attendance tracking, and institutional announcements.
            </p>

            {/* Features Grid */}
            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-[var(--secondary-100)] rounded-lg flex items-center justify-center shrink-0">
                    <feature.icon size={20} className="text-[var(--secondary-600)]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[var(--primary-900)] text-sm mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-xs text-[var(--neutral-600)] leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Download Button */}
            <div className="space-y-4">
              <a
                href={APK_DOWNLOAD_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-[var(--primary-700)] text-white font-semibold rounded-lg hover:bg-[var(--primary-800)] transition-all shadow-lg hover:shadow-xl group"
              >
                <Download size={20} className="group-hover:animate-bounce" />
                <span>Download Android App (APK)</span>
              </a>
              
              <p className="text-sm text-[var(--neutral-500)]">
                <strong className="text-[var(--neutral-700)]">For Android devices:</strong> Download the official APK file. 
                You may need to enable installation from unknown sources in your device settings.
              </p>
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-[var(--primary-300)] to-[var(--secondary-300)] rounded-2xl blur-2xl opacity-20"></div>
            
            <div className="relative bg-white rounded-2xl shadow-xl border border-[var(--neutral-200)] p-8">
              <div className="space-y-6">
                {/* App Icon Mockup */}
                <div className="flex items-center gap-4 pb-6 border-b border-[var(--neutral-200)]">
                  <div className="w-16 h-16 bg-gradient-to-br from-[var(--primary-700)] to-[var(--primary-900)] rounded-2xl flex items-center justify-center shadow-lg">
                    <Smartphone className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-[var(--primary-900)]">Vivace Student Portal</h3>
                    <p className="text-sm text-[var(--neutral-600)]">Official Mobile App</p>
                  </div>
                </div>

                {/* Info Cards */}
                <div className="space-y-3">
                  <div className="bg-[var(--primary-50)] rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-[var(--primary-900)]">Platform</span>
                      <span className="text-xs font-medium text-[var(--primary-700)] bg-[var(--primary-100)] px-2 py-1 rounded">Android</span>
                    </div>
                    <p className="text-xs text-[var(--neutral-600)]">APK installation required</p>
                  </div>

                  <div className="bg-[var(--secondary-50)] rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-[var(--primary-900)]">Access Level</span>
                      <span className="text-xs font-medium text-[var(--secondary-700)] bg-[var(--secondary-100)] px-2 py-1 rounded">Students Only</span>
                    </div>
                    <p className="text-xs text-[var(--neutral-600)]">Login with your student credentials</p>
                  </div>

                  <div className="bg-[var(--accent-50)] rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-[var(--primary-900)]">Distribution</span>
                      <span className="text-xs font-medium text-[var(--accent-700)] bg-[var(--accent-100)] px-2 py-1 rounded">Official Only</span>
                    </div>
                    <p className="text-xs text-[var(--neutral-600)]">Download exclusively from Vivace</p>
                  </div>
                </div>

                {/* Security Notice */}
                <div className="flex items-start gap-3 pt-4 border-t border-[var(--neutral-200)]">
                  <Shield size={18} className="text-[var(--secondary-600)] shrink-0 mt-0.5" />
                  <p className="text-xs text-[var(--neutral-600)] leading-relaxed">
                    This is the official Vivace Student Portal App. Always download from the authorized source to ensure security and authenticity.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
