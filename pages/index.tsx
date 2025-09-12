import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import GlowButton from '@/components/GlowButton'

export default function Home() {
  const router = useRouter()
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const features = [
    {
      icon: '🎓',
      title: 'Student Portal',
      description: 'Manage courses, view grades, track assignments, and stay updated with campus events.',
      gradient: 'from-blue-400 to-blue-600',
    },
    {
      icon: '👨‍🏫',
      title: 'Faculty Dashboard',
      description: 'Organize timetables, manage student records, handle grading, and communicate effectively.',
      gradient: 'from-green-400 to-green-600',
    },
    {
      icon: '⚙️',
      title: 'Admin Control',
      description: 'Oversee campus operations, manage users, monitor activities, and generate reports.',
      gradient: 'from-purple-400 to-purple-600',
    },
  ]

  const stats = [
    { value: '2,450+', label: 'Active Students' },
    { value: '145+', label: 'Faculty Members' },
    { value: '320+', label: 'Courses Offered' },
    { value: '99.9%', label: 'Uptime' },
  ]

  return (
    <div className="min-h-screen darker-blue-orange-gradient relative overflow-hidden">
      {/* Flowing gradient overlay */}
      <div className="fixed inset-0 flowing-gradient pointer-events-none opacity-20"></div>
      
      {/* Floating elements */}
      <div 
        className="fixed w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none"
        style={{ 
          top: `${100 + scrollY * 0.5}px`, 
          left: '-100px',
          transform: `translateY(${Math.sin(scrollY * 0.01) * 20}px)`
        }}
      ></div>
      <div 
        className="fixed w-64 h-64 bg-orange-400/10 rounded-full blur-3xl pointer-events-none"
        style={{ 
          bottom: `${100 - scrollY * 0.3}px`, 
          right: '-50px',
          transform: `translateY(${Math.cos(scrollY * 0.01) * 30}px)`
        }}
      ></div>

      {/* Navigation */}
      <nav className="bg-white/20 backdrop-blur-xl sticky top-0 z-50 border-b border-white/30">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Logo - Compact 2D Version */}
              <div className="w-12 h-12 relative group">
                <svg className="w-full h-full" viewBox="0 0 48 48">
                  {/* Background circle */}
                  <circle cx="24" cy="24" r="20" fill="url(#navLogoGradient)" opacity="0.1"/>
                  
                  {/* Orbit rings */}
                  <ellipse cx="24" cy="24" rx="18" ry="7" fill="none" stroke="#3b82f6" strokeWidth="1" opacity="0.4"/>
                  <ellipse cx="24" cy="24" rx="7" ry="18" fill="none" stroke="#f97316" strokeWidth="1" opacity="0.4"/>
                  
                  {/* Center sphere */}
                  <circle cx="24" cy="24" r="10" fill="url(#navSphereGradient)"/>
                  <ellipse cx="21" cy="20" rx="3" ry="2" fill="white" opacity="0.3"/>
                  
                  {/* Book icon */}
                  <g transform="translate(24, 24)">
                    <path d="M -4 -1 Q -4 -3, -2 -3 L 0 -3 L 2 -3 Q 4 -3, 4 -1 L 4 2 Q 4 3, 2 3 L 0 2 L -2 3 Q -4 3, -4 2 Z" 
                      fill="white" opacity="0.8"/>
                    <line x1="0" y1="-3" x2="0" y2="2" stroke="#1e3a8a" strokeWidth="0.5"/>
                  </g>
                  
                  {/* Dots */}
                  <circle cx="10" cy="24" r="1" fill="#f97316" opacity="0.6" className="group-hover:opacity-100"/>
                  <circle cx="38" cy="24" r="1" fill="#3b82f6" opacity="0.6" className="group-hover:opacity-100"/>
                  
                  <defs>
                    <linearGradient id="navLogoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#3b82f6"/>
                      <stop offset="100%" stopColor="#f97316"/>
                    </linearGradient>
                    <radialGradient id="navSphereGradient">
                      <stop offset="0%" stopColor="#60a5fa"/>
                      <stop offset="100%" stopColor="#3b82f6"/>
                    </radialGradient>
                  </defs>
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-navy">UNISPHERE</h1>
            </div>
            <div className="flex items-center gap-4">
              <Link href="#features" className="text-navy/80 hover:text-navy transition-colors font-medium">
                Features
              </Link>
              <Link href="#stats" className="text-navy/80 hover:text-navy transition-colors font-medium">
                Statistics
              </Link>
              <Link href="#contact" className="text-navy/80 hover:text-navy transition-colors font-medium">
                Contact
              </Link>
              <button
                onClick={() => router.push('/login')}
                className="bg-gradient-to-r from-blue-500 to-orange-500 text-white px-6 py-2 rounded-full hover:from-blue-600 hover:to-orange-600 transition-all duration-300 font-semibold shadow-md hover:shadow-lg"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-6 py-20">
        <div className="text-center max-w-4xl mx-auto">
          {/* 2D Simplistic Logo */}
          <div className="flex justify-center mb-8">
            <div className="relative group cursor-pointer">
              {/* Main Logo Container */}
              <div className="relative w-32 h-32 transform transition-all duration-500 hover:scale-110">
                
                {/* Background Circle with Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-orange-500 rounded-full opacity-10 group-hover:opacity-20 transition-opacity duration-500"></div>
                
                {/* Orbit Rings */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 128 128">
                  {/* Horizontal orbit */}
                  <ellipse cx="64" cy="64" rx="55" ry="20" 
                    fill="none" 
                    stroke="url(#blueOrangeGradient)" 
                    strokeWidth="1.5" 
                    opacity="0.6"
                    className="group-hover:opacity-100 transition-opacity duration-500"
                  />
                  {/* Vertical orbit */}
                  <ellipse cx="64" cy="64" rx="20" ry="55" 
                    fill="none" 
                    stroke="url(#orangeBlueGradient)" 
                    strokeWidth="1.5" 
                    opacity="0.6"
                    className="group-hover:opacity-100 transition-opacity duration-500"
                  />
                  
                  {/* Center Circle - Sphere */}
                  <circle cx="64" cy="64" r="28" 
                    fill="url(#sphereGradient)" 
                    className="filter drop-shadow-lg"
                  />
                  
                  {/* Sphere highlight */}
                  <ellipse cx="56" cy="52" rx="8" ry="6" 
                    fill="white" 
                    opacity="0.3"
                  />
                  
                  {/* Book/Education Symbol in center */}
                  <g transform="translate(64, 64)">
                    {/* Open book shape */}
                    <path d="M -12 -3 Q -12 -8, -6 -8 L 0 -8 L 6 -8 Q 12 -8, 12 -3 L 12 5 Q 12 8, 6 8 L 0 6 L -6 8 Q -12 8, -12 5 Z" 
                      fill="white" 
                      opacity="0.9"
                    />
                    {/* Book center line */}
                    <line x1="0" y1="-8" x2="0" y2="6" 
                      stroke="#1e3a8a" 
                      strokeWidth="1"
                    />
                    {/* Book pages */}
                    <line x1="-8" y1="-4" x2="-3" y2="-4" stroke="#1e3a8a" strokeWidth="0.5" opacity="0.6"/>
                    <line x1="-8" y1="-1" x2="-3" y2="-1" stroke="#1e3a8a" strokeWidth="0.5" opacity="0.6"/>
                    <line x1="-8" y1="2" x2="-3" y2="2" stroke="#1e3a8a" strokeWidth="0.5" opacity="0.6"/>
                    <line x1="3" y1="-4" x2="8" y2="-4" stroke="#1e3a8a" strokeWidth="0.5" opacity="0.6"/>
                    <line x1="3" y1="-1" x2="8" y2="-1" stroke="#1e3a8a" strokeWidth="0.5" opacity="0.6"/>
                    <line x1="3" y1="2" x2="8" y2="2" stroke="#1e3a8a" strokeWidth="0.5" opacity="0.6"/>
                  </g>
                  
                  {/* Graduation cap silhouette at top */}
                  <g transform="translate(64, 28)">
                    <path d="M -8 0 L 0 -4 L 8 0 L 0 4 Z" 
                      fill="#1e3a8a" 
                      opacity="0.8"
                    />
                    <line x1="0" y1="0" x2="4" y2="6" 
                      stroke="#1e3a8a" 
                      strokeWidth="1"
                    />
                    <circle cx="4" cy="7" r="1.5" fill="#1e3a8a"/>
                  </g>
                  
                  {/* Dots representing global connectivity */}
                  <circle cx="30" cy="64" r="2" fill="#f97316" opacity="0.8" className="animate-pulse"/>
                  <circle cx="98" cy="64" r="2" fill="#3b82f6" opacity="0.8" className="animate-pulse" style={{animationDelay: '0.5s'}}/>
                  <circle cx="64" cy="30" r="2" fill="#06b6d4" opacity="0.8" className="animate-pulse" style={{animationDelay: '1s'}}/>
                  <circle cx="64" cy="98" r="2" fill="#10b981" opacity="0.8" className="animate-pulse" style={{animationDelay: '1.5s'}}/>
                  
                  {/* Define gradients */}
                  <defs>
                    <linearGradient id="blueOrangeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#3b82f6"/>
                      <stop offset="100%" stopColor="#f97316"/>
                    </linearGradient>
                    <linearGradient id="orangeBlueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#f97316"/>
                      <stop offset="100%" stopColor="#3b82f6"/>
                    </linearGradient>
                    <radialGradient id="sphereGradient">
                      <stop offset="0%" stopColor="#60a5fa"/>
                      <stop offset="100%" stopColor="#3b82f6"/>
                    </radialGradient>
                  </defs>
                </svg>
                
                {/* Letter U overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-5xl font-bold text-white/20 group-hover:text-white/30 transition-all duration-500">U</span>
                </div>
              </div>
              
              {/* Hover tooltip */}
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-xs text-navy/60 font-medium">Global Education Network</span>
              </div>
            </div>
          </div>
          <h1 className="text-6xl md:text-8xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-orange-600 bg-clip-text text-transparent">
            UNISPHERE
          </h1>
          <h2 className="text-3xl md:text-4xl font-semibold text-navy mb-6">
            Campus Management Redefined
          </h2>
          <p className="text-xl text-navy/80 mb-8 leading-relaxed">
            A comprehensive campus management platform connecting students, faculty, and administrators 
            worldwide with intuitive design and powerful features for modern education.
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => router.push('/login')}
              className="bg-gradient-to-r from-blue-500 to-orange-500 text-white px-8 py-4 rounded-full hover:from-blue-600 hover:to-orange-600 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl text-lg"
            >
              Get Started
            </button>
          </div>
        </div>

        {/* Preview Card */}
        <div className="mt-16 bg-white/30 backdrop-blur-xl rounded-3xl p-2 max-w-5xl mx-auto shadow-2xl border border-white/40">
          <div className="bg-gradient-to-br from-blue-500/20 via-orange-500/20 to-blue-600/20 rounded-2xl p-8 h-96 flex items-center justify-center">
            <div className="text-center">
              <div className="flex justify-center gap-4 mb-6">
                {['🎓', '👨‍🏫', '⚙️'].map((icon, i) => (
                  <div 
                    key={i}
                    className="w-20 h-20 bg-white/60 backdrop-blur rounded-2xl flex items-center justify-center text-3xl shadow-lg hover:scale-110 transition-transform cursor-pointer"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  >
                    {icon}
                  </div>
                ))}
              </div>
              <h3 className="text-2xl font-bold text-navy mb-2">Three Portals, One System</h3>
              <p className="text-navy/70">Student • Faculty • Administrator</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 container mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-navy mb-4">Role-Based Portals</h2>
          <p className="text-navy/70 text-lg">Tailored experiences for every user</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white/40 backdrop-blur-xl rounded-3xl p-8 hover:scale-105 transition-all duration-300 cursor-pointer group shadow-lg hover:shadow-xl border border-white/50"
            >
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform shadow-md`}>
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold text-navy mb-3">{feature.title}</h3>
              <p className="text-navy/70 leading-relaxed mb-4">{feature.description}</p>
              <Link 
                href="/login" 
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors"
              >
                Access Portal 
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="relative z-10 container mx-auto px-6 py-20">
        <div className="bg-white/30 backdrop-blur-xl rounded-3xl p-12 shadow-xl border border-white/40">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-navy mb-4">Trusted by Thousands</h2>
            <p className="text-navy/70 text-lg">Empowering education with technology</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-orange-600 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </p>
                <p className="text-navy/70">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="relative z-10 container mx-auto px-6 py-20">
        <div className="bg-gradient-to-br from-blue-500/20 to-orange-500/20 backdrop-blur-xl rounded-3xl p-12 text-center shadow-xl border border-white/40">
          <h2 className="text-4xl font-bold text-navy mb-4">
            Ready to Transform Your Campus?
          </h2>
          <p className="text-navy/70 text-lg mb-8 max-w-2xl mx-auto">
            Join the future of campus management with our intuitive and powerful system designed for educational excellence.
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => router.push('/login')}
              className="bg-gradient-to-r from-blue-500 to-orange-500 text-white px-8 py-4 rounded-full hover:from-blue-600 hover:to-orange-600 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl text-lg"
            >
              Start Now
            </button>
            <button className="bg-white/50 backdrop-blur text-navy px-8 py-4 rounded-full hover:bg-white/70 transition-all duration-300 font-semibold shadow-md hover:shadow-lg text-lg border border-white/50">
              Contact Admin
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-white/20 backdrop-blur-xl mt-20 border-t border-white/30">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <p className="text-navy/60 text-sm">
              © 2024 UNISPHERE. All rights reserved.
            </p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="text-navy/60 hover:text-blue-600 transition-colors">Privacy</a>
              <a href="#" className="text-navy/60 hover:text-blue-600 transition-colors">Terms</a>
              <a href="#" className="text-navy/60 hover:text-blue-600 transition-colors">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}