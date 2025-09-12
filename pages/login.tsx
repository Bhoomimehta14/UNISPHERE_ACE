import { useState } from 'react'
import { useRouter } from 'next/router'
import GlowButton from '@/components/GlowButton'

type UserRole = 'student' | 'faculty' | 'admin'

export default function Login() {
  const router = useRouter()
  const [sapId, setSapId] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<UserRole>('student')
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate SAP ID format (70522400XXX)
    const sapIdRegex = /^70522400\d{3}$/
    if (!sapIdRegex.test(sapId)) {
      setError('Please enter a valid SAP ID (Format: 70522400XXX)')
      return
    }
    
    if (sapId && password) {
      localStorage.setItem('user', JSON.stringify({ sapId, role }))
      
      switch (role) {
        case 'student':
          router.push('/student/dashboard')
          break
        case 'faculty':
          router.push('/faculty/dashboard')
          break
        case 'admin':
          router.push('/admin/dashboard')
          break
      }
    } else {
      setError('Please enter SAP ID and password')
    }
  }

  const roleOptions = [
    { value: 'student', label: 'Student', icon: '🎓' },
    { value: 'faculty', label: 'Faculty', icon: '👨‍🏫' },
    { value: 'admin', label: 'Admin', icon: '⚙️' },
  ]

  return (
    <div className="min-h-screen light-blue-orange-gradient flex items-center justify-center px-4 relative overflow-hidden">
      {/* Flowing gradient overlay */}
      <div className="absolute inset-0 flowing-gradient pointer-events-none opacity-30"></div>
      
      {/* Floating shapes for depth */}
      <div className="absolute top-20 left-20 w-64 h-64 bg-blue-300/20 rounded-full blur-3xl float-animation"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-orange-300/20 rounded-full blur-3xl float-animation" style={{ animationDelay: '2s' }}></div>
      
      <div className="max-w-md w-full bg-white/30 backdrop-blur-xl rounded-3xl shadow-2xl p-8 relative z-10 border border-white/40">
        <div className="relative">
          {/* 2D Logo - Same as landing page */}
          <div className="flex justify-center mb-4">
            <div className="relative w-28 h-28 group">
              <svg className="w-full h-full" viewBox="0 0 128 128">
                {/* Horizontal orbit */}
                <ellipse cx="64" cy="64" rx="55" ry="20" 
                  fill="none" 
                  stroke="url(#loginBlueOrangeGradient)" 
                  strokeWidth="1.5" 
                  opacity="0.6"
                />
                {/* Vertical orbit */}
                <ellipse cx="64" cy="64" rx="20" ry="55" 
                  fill="none" 
                  stroke="url(#loginOrangeBlueGradient)" 
                  strokeWidth="1.5" 
                  opacity="0.6"
                />
                
                {/* Center Circle - Sphere */}
                <circle cx="64" cy="64" r="28" 
                  fill="url(#loginSphereGradient)" 
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
                  <linearGradient id="loginBlueOrangeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6"/>
                    <stop offset="100%" stopColor="#f97316"/>
                  </linearGradient>
                  <linearGradient id="loginOrangeBlueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f97316"/>
                    <stop offset="100%" stopColor="#3b82f6"/>
                  </linearGradient>
                  <radialGradient id="loginSphereGradient">
                    <stop offset="0%" stopColor="#60a5fa"/>
                    <stop offset="100%" stopColor="#3b82f6"/>
                  </radialGradient>
                </defs>
              </svg>
              
              {/* Letter U overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-4xl font-bold text-white/20">U</span>
              </div>
            </div>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-orange-600 bg-clip-text text-transparent text-center mb-2">
            UNISPHERE
          </h1>
          <p className="text-xl font-semibold text-navy text-center mb-1">
            Campus Management System
          </p>
          <p className="text-center text-navy/70 mb-8">
            Please login to continue
          </p>
        </div>
        
        {/* Role Selection Pills */}
        <div className="flex justify-center gap-2 mb-8">
          {roleOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setRole(option.value as UserRole)}
              className={`px-4 py-2 rounded-full transition-all duration-300 flex items-center gap-2 ${
                role === option.value
                  ? 'bg-gradient-to-r from-blue-400 to-orange-400 text-white shadow-lg scale-105'
                  : 'bg-white/50 text-navy hover:bg-white/70 border border-white/50'
              }`}
            >
              <span className="text-lg">{option.icon}</span>
              <span className="font-medium">{option.label}</span>
            </button>
          ))}
        </div>
        
        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="bg-red-100/80 border border-red-300 text-red-700 px-4 py-3 rounded-xl">
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <label htmlFor="sapId" className="block text-sm font-medium text-navy mb-2">
              SAP ID
            </label>
            <div className="relative">
              <input
                type="text"
                id="sapId"
                value={sapId}
                onChange={(e) => {
                  // Only allow numbers and limit to 11 characters
                  const value = e.target.value.replace(/\D/g, '').slice(0, 11)
                  setSapId(value)
                }}
                className="w-full px-4 py-3 bg-white/60 backdrop-blur border border-white/50 rounded-xl text-navy placeholder-navy/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
                placeholder="70522400XXX"
                maxLength={11}
                required
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-navy/50">🆔</span>
              </div>
            </div>
            <p className="text-xs text-navy/60 ml-1">Format: 70522400XXX (11 digits)</p>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-navy mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white/60 backdrop-blur border border-white/50 rounded-xl text-navy placeholder-navy/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
                placeholder="Enter your password"
                required
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-navy/50">🔒</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center text-navy/70">
              <input type="checkbox" className="mr-2 rounded accent-blue-500" />
              Remember me
            </label>
            <a href="#" className="text-blue-600 hover:text-blue-700 transition-colors font-medium">
              Forgot password?
            </a>
          </div>
          
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-orange-500 text-white py-3 px-4 rounded-xl hover:from-blue-600 hover:to-orange-600 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
          >
            Login as {roleOptions.find(r => r.value === role)?.label}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-navy/60 text-sm">
            Don&apos;t have an account?{' '}
            <a href="#" className="text-blue-600 hover:text-blue-700 transition-colors font-medium">
              Contact Admin
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}