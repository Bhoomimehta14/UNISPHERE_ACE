import { ReactNode } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

interface LayoutProps {
  children: ReactNode
  role: 'student' | 'faculty' | 'admin'
}

export default function Layout({ children, role }: LayoutProps) {
  const router = useRouter()
  
  const handleLogout = () => {
    localStorage.removeItem('user')
    router.push('/login')
  }

  const getSidebarLinks = () => {
    switch (role) {
      case 'student':
        return [
          { href: '/student/dashboard', label: 'Dashboard', icon: '🏠' },
          { href: '/student/courses', label: 'My Courses', icon: '📚' },
          { href: '/student/timetable', label: 'Timetable', icon: '📅' },
          { href: '/student/events', label: 'Events Discovery', icon: '🎉' },
          { href: '/student/resources', label: 'Resource Booking', icon: '🏫' },
          { href: '/student/navigation', label: 'Campus Navigation', icon: '🗺️' },
          { href: '/student/canteen', label: 'Canteen Menu', icon: '🍽️' },
          { href: '/student/profile', label: 'Profile', icon: '👤' },
        ]
      case 'faculty':
        return [
          { href: '/faculty/dashboard', label: 'Dashboard', icon: '🏠' },
          { href: '/faculty/assignments', label: 'Assignments', icon: '📝' },
          { href: '/faculty/batches', label: 'My Batches', icon: '👥' },
          { href: '/faculty/timetable', label: 'My Timetable', icon: '📅' },
          { href: '/faculty/resources', label: 'Resources', icon: '🏫' },
          { href: '/faculty/canteen', label: 'Canteen Menu', icon: '🍽️' },
          { href: '/faculty/profile', label: 'Profile', icon: '👤' },
        ]
      case 'admin':
        return [
          { href: '/admin/dashboard', label: 'Dashboard', icon: '🏠' },
          { href: '/admin/users', label: 'Users', icon: '👥' },
          { href: '/admin/timetable', label: 'Timetable', icon: '📅' },
          { href: '/admin/requests', label: 'Requests & Approvals', icon: '📋' },
          { href: '/admin/resources', label: 'Resource Management', icon: '🏫' },
        ]
      default:
        return []
    }
  }

  const links = getSidebarLinks()

  return (
    <div className="flex min-h-screen darker-blue-orange-gradient relative">
      {/* Flowing gradient overlay */}
      <div className="absolute inset-0 flowing-gradient pointer-events-none opacity-20"></div>
      
      {/* Floating elements */}
      <div className="fixed top-32 right-20 w-32 h-32 bg-blue-400/10 rounded-full blur-3xl pointer-events-none float-animation"></div>
      <div className="fixed bottom-32 right-40 w-48 h-48 bg-orange-400/10 rounded-full blur-3xl pointer-events-none float-animation" style={{ animationDelay: '3s' }}></div>
      
      {/* Sidebar */}
      <aside className="w-64 bg-white/20 backdrop-blur-xl relative z-10 border-r border-white/30">
        <div className="p-6 h-full flex flex-col">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              {/* 2D Logo - Same as landing page (compact version) */}
              <div className="w-12 h-12 relative group">
                <svg className="w-full h-full" viewBox="0 0 48 48">
                  {/* Background circle */}
                  <circle cx="24" cy="24" r="20" fill="url(#sidebarLogoGradient)" opacity="0.1"/>
                  
                  {/* Orbit rings */}
                  <ellipse cx="24" cy="24" rx="18" ry="7" fill="none" stroke="#3b82f6" strokeWidth="1" opacity="0.4"/>
                  <ellipse cx="24" cy="24" rx="7" ry="18" fill="none" stroke="#f97316" strokeWidth="1" opacity="0.4"/>
                  
                  {/* Center sphere */}
                  <circle cx="24" cy="24" r="10" fill="url(#sidebarSphereGradient)"/>
                  <ellipse cx="21" cy="20" rx="3" ry="2" fill="white" opacity="0.3"/>
                  
                  {/* Book icon */}
                  <g transform="translate(24, 24)">
                    <path d="M -4 -1 Q -4 -3, -2 -3 L 0 -3 L 2 -3 Q 4 -3, 4 -1 L 4 2 Q 4 3, 2 3 L 0 2 L -2 3 Q -4 3, -4 2 Z" 
                      fill="white" opacity="0.8"/>
                    <line x1="0" y1="-3" x2="0" y2="2" stroke="#1e3a8a" strokeWidth="0.5"/>
                  </g>
                  
                  {/* Graduation cap at top */}
                  <g transform="translate(24, 10)">
                    <path d="M -3 0 L 0 -1.5 L 3 0 L 0 1.5 Z" fill="#1e3a8a" opacity="0.6"/>
                    <line x1="0" y1="0" x2="1.5" y2="2" stroke="#1e3a8a" strokeWidth="0.5"/>
                    <circle cx="1.5" cy="2.5" r="0.5" fill="#1e3a8a"/>
                  </g>
                  
                  {/* Dots */}
                  <circle cx="10" cy="24" r="1" fill="#f97316" opacity="0.6" className="group-hover:opacity-100"/>
                  <circle cx="38" cy="24" r="1" fill="#3b82f6" opacity="0.6" className="group-hover:opacity-100"/>
                  
                  <defs>
                    <linearGradient id="sidebarLogoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#3b82f6"/>
                      <stop offset="100%" stopColor="#f97316"/>
                    </linearGradient>
                    <radialGradient id="sidebarSphereGradient">
                      <stop offset="0%" stopColor="#60a5fa"/>
                      <stop offset="100%" stopColor="#3b82f6"/>
                    </radialGradient>
                  </defs>
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-orange-600 bg-clip-text text-transparent">UNISPHERE</h2>
                <p className="text-xs text-navy/70">Campus Management</p>
              </div>
            </div>
            <p className="text-navy/60 text-sm mt-1">
              {role.charAt(0).toUpperCase() + role.slice(1)} Portal
            </p>
          </div>
          
          <nav className="flex-1 space-y-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                  router.pathname === link.href
                    ? 'bg-gradient-to-r from-blue-500 to-orange-500 text-white shadow-lg'
                    : 'text-navy/80 hover:bg-white/30 hover:text-navy'
                }`}
              >
                <span className={`text-xl transition-transform duration-300 ${
                  router.pathname === link.href ? '' : 'group-hover:scale-110'
                }`}>
                  {link.icon}
                </span>
                <span className="font-medium">{link.label}</span>
                {router.pathname === link.href && (
                  <div className="ml-auto w-1 h-6 bg-white rounded-full"></div>
                )}
              </Link>
            ))}
          </nav>
          
          <div className="mt-auto pt-6 border-t border-white/20">
            <div className="flex items-center gap-3 mb-4 px-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-orange-500 flex items-center justify-center text-white font-bold shadow-md">
                {role[0].toUpperCase()}
              </div>
              <div className="flex-1">
                <p className="text-navy font-medium text-sm">
                  {role.charAt(0).toUpperCase() + role.slice(1)} User
                </p>
                <p className="text-navy/60 text-xs">Online</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full bg-gradient-to-r from-blue-500 to-orange-500 text-white py-2 px-4 rounded-xl hover:from-blue-600 hover:to-orange-600 transition-all duration-300 font-semibold shadow-md hover:shadow-lg"
            >
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 relative z-10">
        <div className="bg-white/30 backdrop-blur-xl rounded-3xl shadow-xl p-8 min-h-full border border-white/40">
          {children}
        </div>
      </main>
    </div>
  )
}