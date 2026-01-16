"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { BookOpen, Video, MessageSquare, Music2, Award, GraduationCap, Library, ChevronRight, Menu, X, Mail, Phone, MapPin } from 'lucide-react';
import Image from 'next/image';

export default function Home() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const features = [
    { 
      title: 'Digital Library', 
      icon: Library, 
      description: 'Access our extensive collection of music theory books, sheet music, and educational resources in PDF format.',
      highlight: '500+ Resources'
    },
    { 
      title: 'Video Lessons', 
      icon: Video, 
      description: 'Learn from expert instructors through our curated collection of music tutorials and masterclasses.',
      highlight: 'HD Quality'
    },
    { 
      title: 'AI Learning Assistant', 
      icon: MessageSquare, 
      description: 'Get personalized guidance and instant answers to your music theory questions with our intelligent assistant.',
      highlight: '24/7 Available'
    },
    { 
      title: 'Score Editor', 
      icon: Music2, 
      description: 'Create and edit musical scores with our intuitive notation editor powered by ABC notation.',
      highlight: 'Export Ready'
    }
  ];

  const stats = [
    { value: '10,000+', label: 'Students Enrolled' },
    { value: '500+', label: 'Learning Resources' },
    { value: '50+', label: 'Expert Instructors' },
    { value: '15+', label: 'Years of Excellence' }
  ];

  const programs = [
    { 
      title: 'Trinity Preparation',
      description: 'Comprehensive preparation materials for all Trinity College London grade levels',
      icon: Award
    },
    { 
      title: 'Theory Fundamentals',
      description: 'Master music theory from basics to advanced concepts',
      icon: BookOpen
    },
    { 
      title: 'Practical Skills',
      description: 'Develop your instrumental and vocal techniques',
      icon: Music2
    },
    { 
      title: 'Professional Development',
      description: 'Advanced courses for music educators and professionals',
      icon: GraduationCap
    }
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)]">
      {/* Navigation */}
      <nav className="bg-white border-b border-[var(--neutral-200)] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-4">
              <Image 
                src="/Logo.png" 
                alt="Vivace Music School Kenya" 
                width={80} 
                height={80}
                className="object-contain"
                priority
              />
              <div className="hidden sm:block">
                <h1 className="text-lg font-semibold text-[var(--primary-900)]">Vivace Music School</h1>
                <p className="text-sm text-[var(--neutral-500)]">Kenya</p>
              </div>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-[var(--neutral-700)] hover:text-[var(--primary-700)] transition-colors font-medium">Features</a>
              <a href="#programs" className="text-[var(--neutral-700)] hover:text-[var(--primary-700)] transition-colors font-medium">Programs</a>
              <a href="#accreditation" className="text-[var(--neutral-700)] hover:text-[var(--primary-700)] transition-colors font-medium">Accreditation</a>
              <a href="#contact" className="text-[var(--neutral-700)] hover:text-[var(--primary-700)] transition-colors font-medium">Contact</a>
            </div>

            <div className="hidden md:flex items-center gap-4">
              <button
                onClick={() => router.push("/login")}
                className="px-5 py-2.5 text-[var(--primary-700)] font-medium hover:bg-[var(--primary-50)] rounded-md transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => router.push("/register")}
                className="px-5 py-2.5 bg-[var(--primary-700)] text-white font-medium rounded-md hover:bg-[var(--primary-800)] transition-colors"
              >
                Get Started
              </button>
            </div>

            <button 
              onClick={toggleMenu} 
              className="md:hidden p-2 text-[var(--neutral-700)] hover:bg-[var(--neutral-100)] rounded-md"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-[var(--neutral-200)]">
            <div className="px-4 py-6 space-y-4">
              <a href="#features" className="block py-2 text-[var(--neutral-700)] font-medium">Features</a>
              <a href="#programs" className="block py-2 text-[var(--neutral-700)] font-medium">Programs</a>
              <a href="#accreditation" className="block py-2 text-[var(--neutral-700)] font-medium">Accreditation</a>
              <a href="#contact" className="block py-2 text-[var(--neutral-700)] font-medium">Contact</a>
              <div className="pt-4 space-y-3 border-t border-[var(--neutral-200)]">
                <button
                  onClick={() => router.push("/login")}
                  className="w-full py-3 text-[var(--primary-700)] font-medium border border-[var(--primary-700)] rounded-md hover:bg-[var(--primary-50)] transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => router.push("/register")}
                  className="w-full py-3 bg-[var(--primary-700)] text-white font-medium rounded-md hover:bg-[var(--primary-800)] transition-colors"
                >
                  Get Started
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <header className="relative bg-gradient-to-br from-[var(--primary-900)] via-[var(--primary-800)] to-[var(--primary-700)] overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-white/5 to-transparent"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm mb-6">
                <Award size={16} />
                <span>Trinity College London Authorized Center #74255</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Your Gateway to
                <span className="block text-[var(--accent-400)]">Music Excellence</span>
              </h1>
              
              <p className="text-lg md:text-xl text-white/80 mb-8 max-w-xl mx-auto lg:mx-0">
                Access Kenya&apos;s premier digital music library. Comprehensive resources for Trinity College London preparation, 
                theory mastery, and professional development.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button
                  onClick={() => router.push("/register")}
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-[var(--primary-800)] font-semibold rounded-lg hover:bg-[var(--accent-100)] transition-colors shadow-lg"
                >
                  Start Learning Today
                  <ChevronRight size={20} />
                </button>
                <button
                  onClick={() => router.push("/login")}
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
                >
                  Explore Library
                </button>
              </div>
            </div>
            
            <div className="hidden lg:flex justify-center">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-[var(--accent-500)] to-[var(--secondary-500)] rounded-2xl blur-2xl opacity-30"></div>
                <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                  <Image 
                    src="/Logo.png" 
                    alt="Vivace Music School" 
                    width={300} 
                    height={300}
                    className="object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Section */}
      <section className="bg-white border-b border-[var(--neutral-200)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-[var(--primary-700)] mb-2">{stat.value}</div>
                <div className="text-sm text-[var(--neutral-600)] font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 lg:py-28 bg-[var(--background)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--primary-900)] mb-4">
              Comprehensive Learning Platform
            </h2>
            <p className="text-lg text-[var(--neutral-600)] max-w-2xl mx-auto">
              Everything you need to excel in your musical journey, from beginner to professional level.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="bg-white rounded-xl p-6 border border-[var(--neutral-200)] hover:border-[var(--primary-300)] hover:shadow-lg transition-all duration-300 group"
              >
                <div className="w-14 h-14 bg-[var(--primary-100)] rounded-lg flex items-center justify-center mb-5 group-hover:bg-[var(--primary-700)] transition-colors">
                  <feature.icon className="w-7 h-7 text-[var(--primary-700)] group-hover:text-white transition-colors" />
                </div>
                <div className="inline-block px-3 py-1 bg-[var(--accent-100)] text-[var(--accent-700)] text-xs font-semibold rounded-full mb-3">
                  {feature.highlight}
                </div>
                <h3 className="text-xl font-semibold text-[var(--primary-900)] mb-3">{feature.title}</h3>
                <p className="text-[var(--neutral-600)] leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section id="programs" className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-[var(--primary-900)] mb-6">
                Programs Designed for Excellence
              </h2>
              <p className="text-lg text-[var(--neutral-600)] mb-8">
                Our curriculum is aligned with Trinity College London international standards. 
                Whether you&apos;re preparing for examinations or pursuing professional development, we have the right program for you.
              </p>
              
              <div className="space-y-4">
                {programs.map((program, index) => (
                  <div 
                    key={index}
                    className="flex items-start gap-4 p-4 rounded-lg hover:bg-[var(--primary-50)] transition-colors cursor-pointer group"
                  >
                    <div className="w-12 h-12 bg-[var(--secondary-100)] rounded-lg flex items-center justify-center shrink-0 group-hover:bg-[var(--secondary-500)] transition-colors">
                      <program.icon className="w-6 h-6 text-[var(--secondary-700)] group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[var(--primary-900)] mb-1">{program.title}</h3>
                      <p className="text-sm text-[var(--neutral-600)]">{program.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <button 
                onClick={() => router.push("/register")}
                className="mt-8 inline-flex items-center gap-2 px-6 py-3 bg-[var(--primary-700)] text-white font-semibold rounded-lg hover:bg-[var(--primary-800)] transition-colors"
              >
                View All Programs
                <ChevronRight size={20} />
              </button>
            </div>
            
            <div className="relative">
              <div className="bg-gradient-to-br from-[var(--primary-100)] to-[var(--secondary-100)] rounded-2xl p-8 lg:p-12">
                <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-[var(--accent-500)] rounded-full flex items-center justify-center">
                      <Award className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-[var(--primary-900)]">Trinity College London</div>
                      <div className="text-sm text-[var(--neutral-500)]">Internationally Recognized</div>
                    </div>
                  </div>
                  <div className="h-2 bg-[var(--neutral-100)] rounded-full overflow-hidden">
                    <div className="h-full w-[95%] bg-gradient-to-r from-[var(--secondary-500)] to-[var(--primary-500)] rounded-full"></div>
                  </div>
                  <div className="mt-2 text-sm text-[var(--neutral-600)]">95% Pass Rate</div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg p-4 text-center shadow">
                    <div className="text-2xl font-bold text-[var(--primary-700)]">8</div>
                    <div className="text-xs text-[var(--neutral-600)]">Grade Levels</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center shadow">
                    <div className="text-2xl font-bold text-[var(--secondary-600)]">4</div>
                    <div className="text-xs text-[var(--neutral-600)]">Diploma Levels</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trinity Accreditation Section */}
      <section id="accreditation" className="py-20 lg:py-28 bg-[var(--primary-50)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-[var(--primary-300)] to-[var(--secondary-300)] rounded-2xl blur-xl opacity-30"></div>
                <div className="relative bg-white rounded-2xl p-8 shadow-lg border border-[var(--neutral-200)]">
                  <Image 
                    src="https://res.cloudinary.com/dylmsnibf/image/upload/v1738590835/2ca281d2-ec9a-48da-a4d1-972aa9a73fc3.png" 
                    alt="Trinity College London Authorized Center" 
                    width={300} 
                    height={300}
                    className="object-contain"
                  />
                  <div className="text-center mt-4">
                    <p className="text-sm font-semibold text-[var(--primary-700)]">Center Number: 74255</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--accent-100)] text-[var(--accent-700)] rounded-full text-sm font-semibold mb-6">
                <Award size={16} />
                <span>Authorized Examination Center</span>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold text-[var(--primary-900)] mb-6">
                Trinity College London Partner
              </h2>
              
              <p className="text-lg text-[var(--neutral-700)] leading-relaxed mb-6">
                Vivace Music School Kenya is proud to be an authorized Trinity College London Examination Center (Center Number 74255). 
                This prestigious partnership enables our students to pursue internationally recognized music qualifications without leaving Kenya.
              </p>
              
              <p className="text-lg text-[var(--neutral-700)] leading-relaxed mb-8">
                Trinity College London examinations are respected worldwide by universities, conservatories, and employers, 
                offering credible validation of musical achievement. Our faculty&apos;s deep familiarity with Trinity syllabi 
                ensures targeted preparation that maximizes examination success while building genuine musical competency.
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-xl p-4 border border-[var(--neutral-200)]">
                  <div className="text-2xl font-bold text-[var(--primary-700)]">100+</div>
                  <div className="text-sm text-[var(--neutral-600)]">Countries Recognize Trinity</div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-[var(--neutral-200)]">
                  <div className="text-2xl font-bold text-[var(--secondary-600)]">Since 1877</div>
                  <div className="text-sm text-[var(--neutral-600)]">Trinity Heritage</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-28 bg-gradient-to-r from-[var(--primary-800)] to-[var(--primary-900)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Begin Your Musical Journey Today
          </h2>
          <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
            Join thousands of students who have transformed their musical abilities through our comprehensive learning platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push("/register")}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-[var(--primary-800)] font-semibold rounded-lg hover:bg-[var(--accent-100)] transition-colors shadow-lg"
            >
              Create Free Account
              <ChevronRight size={20} />
            </button>
            <button
              onClick={() => router.push("/login")}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
            >
              Sign In
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-[var(--primary-900)] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            <div className="lg:col-span-1">
              <div className="flex items-center gap-3 mb-6">
                <Image 
                  src="/Logo.png" 
                  alt="Vivace Music School Kenya" 
                  width={60} 
                  height={60}
                  className="object-contain brightness-0 invert"
                />
                <div>
                  <h3 className="text-lg font-bold">Vivace Music School</h3>
                  <p className="text-sm text-white/60">Kenya</p>
                </div>
              </div>
              <p className="text-white/70 text-sm leading-relaxed mb-4">
                Empowering the next generation of musicians through quality education and innovative digital resources.
              </p>
              <div className="flex items-center gap-2">
                <Image 
                  src="https://res.cloudinary.com/dylmsnibf/image/upload/v1738590835/2ca281d2-ec9a-48da-a4d1-972aa9a73fc3.png" 
                  alt="Trinity College London" 
                  width={40} 
                  height={40}
                  className="object-contain"
                />
                <span className="text-xs text-white/60">Trinity Center #74255</span>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
              <ul className="space-y-3">
                <li>
                  <a href="https://www.vivaceke.co.ke" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-[var(--accent-400)] transition-colors text-sm">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="https://www.vivaceke.co.ke/about" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-[var(--accent-400)] transition-colors text-sm">
                    Our Programs
                  </a>
                </li>
                <li>
                  <a href="https://www.vivaceke.co.ke/contact" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-[var(--accent-400)] transition-colors text-sm">
                    Resources
                  </a>
                </li>
                <li>
                  <a href="/register" className="text-white/70 hover:text-[var(--accent-400)] transition-colors text-sm">
                    Enroll Now
                  </a>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-6">Contact Information</h4>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Mail size={18} className="text-[var(--accent-400)] mt-0.5 shrink-0" />
                  <span className="text-white/70 text-sm">info@vivaceke.co.ke</span>
                </li>
                <li className="flex items-start gap-3">
                  <Phone size={18} className="text-[var(--accent-400)] mt-0.5 shrink-0" />
                  <span className="text-white/70 text-sm">+254 795 958 448</span>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin size={18} className="text-[var(--accent-400)] mt-0.5 shrink-0" />
                  <span className="text-white/70 text-sm">5th Floor, Juja Square<br />Juja, Kenya</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-6">Connect With Us</h4>
              <div className="flex gap-4 mb-6">
                <a href="#" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-[var(--accent-500)] transition-colors" aria-label="Facebook">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-[var(--accent-500)] transition-colors" aria-label="Twitter">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-[var(--accent-500)] transition-colors" aria-label="LinkedIn">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                    <rect width="4" height="12" x="2" y="9"></rect>
                    <circle cx="4" cy="4" r="2"></circle>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-[var(--accent-500)] transition-colors" aria-label="YouTube">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/>
                    <path d="m10 15 5-3-5-3z"/>
                  </svg>
                </a>
              </div>
              <p className="text-white/50 text-xs">
                Subscribe to our newsletter for updates on new resources and programs.
              </p>
            </div>
          </div>
          
          <div className="border-t border-white/10 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-white/50 text-sm text-center md:text-left">
                © 2025 Vivace Music School Kenya. All rights reserved.
              </p>
              <p className="text-white/50 text-sm">
                Powered by <span className="text-[var(--accent-400)]">DiversiWorks Times Group</span>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
