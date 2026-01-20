'use client';

import { Smartphone, Download, BookOpen, Bell, Zap, Shield } from 'lucide-react';

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
    }
  ];

  return (
    <section id="app" className="py-20 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          {/* Left Column - Device Mockup */}
          <div className="order-1 lg:order-1">
            <div className="relative max-w-sm mx-auto lg:mx-0">
              {/* Phone Mockup Container */}
              <div 
                className="relative mx-auto" 
                style={{ 
                  width: '280px',
                  height: '570px',
                  transform: 'perspective(1000px) rotateY(-5deg) rotateX(2deg)',
                  transformStyle: 'preserve-3d'
                }}
              >
                {/* Subtle Shadow */}
                <div 
                  className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-64 h-8 bg-neutral-900/5 rounded-full blur-xl"
                  style={{ transform: 'translateZ(-20px)' }}
                ></div>
                
                {/* Phone Frame */}
                <div className="relative w-full h-full bg-neutral-900 rounded-[3rem] shadow-2xl overflow-hidden border-8 border-neutral-900">
                  {/* Notch */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-neutral-900 rounded-b-3xl z-10"></div>
                  
                  {/* Screen Content */}
                  <div className="absolute inset-0 bg-white overflow-hidden">
                    {/* Status Bar */}
                    <div className="h-12 bg-[var(--primary-900)] flex items-center justify-between px-8 pt-2">
                      <span className="text-white text-xs font-medium">9:41</span>
                      <div className="flex gap-1">
                        <div className="w-4 h-3 border border-white rounded-sm"></div>
                        <div className="w-4 h-3 border border-white rounded-sm"></div>
                        <div className="w-4 h-3 border border-white rounded-sm"></div>
                      </div>
                    </div>
                    
                    {/* App Header */}
                    <div className="bg-[var(--primary-900)] text-white px-6 py-6 pb-8">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center">
                          <Smartphone className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <div className="font-bold text-sm">Vivace Portal</div>
                          <div className="text-xs text-white/70">Student Dashboard</div>
                        </div>
                      </div>
                      <div className="text-xl font-bold">Welcome, Student</div>
                    </div>
                    
                    {/* Quick Stats Cards */}
                    <div className="px-6 -mt-4 space-y-3">
                      <div className="bg-white rounded-xl shadow-lg p-4 border border-neutral-100">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-semibold text-neutral-600">Current Grade</span>
                          <span className="text-lg font-bold text-[var(--primary-700)]">Grade 5</span>
                        </div>
                        <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                          <div className="h-full w-3/4 bg-[var(--primary-600)]"></div>
                        </div>
                      </div>
                      
                      <div className="bg-white rounded-xl shadow-lg p-4 border border-neutral-100">
                        <div className="text-xs font-semibold text-neutral-600 mb-2">Recent Notice</div>
                        <div className="text-sm font-medium text-neutral-900">Trinity Exam Schedule</div>
                        <div className="text-xs text-neutral-500 mt-1">2 days ago</div>
                      </div>
                      
                      <div className="bg-white rounded-xl shadow-lg p-4 border border-neutral-100">
                        <div className="text-xs font-semibold text-neutral-600 mb-2">Attendance</div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-bold text-[var(--secondary-600)]">95%</span>
                          <span className="text-xs text-neutral-500">This term</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Content Stack */}
          <div className="order-2 lg:order-2 space-y-8">
            {/* Eyebrow Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--primary-50)] text-[var(--primary-700)] rounded-full text-sm font-semibold">
              <Smartphone size={16} />
              <span>Digital Student Platform</span>
            </div>
            
            {/* Main Heading */}
            <h2 className="text-4xl lg:text-5xl font-bold text-[var(--primary-900)] leading-tight max-w-lg">
              Your Academic Journey,
              <br />
              Always at Hand
            </h2>
            
            {/* Descriptive Paragraph */}
            <p className="text-lg text-[var(--neutral-700)] leading-relaxed max-w-lg">
              The Vivace Student Portal provides centralized access to your academic records, Trinity exam results, 
              school notices, and attendance tracking—supporting our digital-first approach to music education.
            </p>

            {/* Feature List */}
            <div className="space-y-6 pt-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[var(--primary-100)] rounded-xl flex items-center justify-center shrink-0">
                    <feature.icon size={22} className="text-[var(--primary-700)]" />
                  </div>
                  <div className="pt-1">
                    <h3 className="font-bold text-[var(--primary-900)] text-base mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-[var(--neutral-600)] leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Primary CTA Area */}
            <div className="pt-4">
              <a
                href={APK_DOWNLOAD_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-[var(--primary-700)] text-white font-semibold rounded-lg hover:bg-[var(--primary-800)] transition-all shadow-lg hover:shadow-xl"
              >
                <Download size={20} />
                <span>Download for Android</span>
              </a>
              
              {/* Supporting Micro-Text */}
              <p className="text-sm text-[var(--neutral-500)] mt-3">
                Android APK · Official Vivace distribution
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
