import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Layout from '@/components/Layout'

export default function StudentDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (!userData) {
      router.push('/login')
    } else {
      const parsedUser = JSON.parse(userData)
      if (parsedUser.role !== 'student') {
        router.push('/login')
      } else {
        setUser(parsedUser)
      }
    }
  }, [router])

  if (!user) return null

  const stats = [
    { label: 'Current Courses', value: '5', icon: '📚', gradient: 'from-blue-400 to-blue-600' },
    { label: 'GPA', value: '3.65', icon: '🎯', gradient: 'from-green-400 to-green-600' },
    { label: 'Assignments Due', value: '3', icon: '📝', gradient: 'from-orange-400 to-orange-600' },
    { label: 'Attendance', value: '92%', icon: '✅', gradient: 'from-purple-400 to-purple-600' },
  ]

  const announcements = [
    { id: 1, title: 'Math 101: Midterm Exam', desc: 'Scheduled for next Monday at 10:00 AM', priority: 'high' },
    { id: 2, title: 'Library Hours Extended', desc: 'Library will be open until midnight during exam week', priority: 'medium' },
    { id: 3, title: 'Campus Event: Tech Fair', desc: 'Join us this Friday for the annual Tech Fair', priority: 'low' },
  ]

  const upcomingClasses = [
    { time: '10:00 AM', subject: 'Computer Science', room: 'Room 204', duration: '1 hour' },
    { time: '2:00 PM', subject: 'Mathematics', room: 'Room 301', duration: '1.5 hours' },
    { time: '4:00 PM', subject: 'Physics Lab', room: 'Lab 102', duration: '2 hours' },
  ]

  return (
    <Layout role="student">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-navy mb-2">Welcome Back!</h1>
          <p className="text-navy/70">Here&apos;s your academic overview for today</p>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white/40 backdrop-blur-xl rounded-2xl p-6 hover:scale-105 transition-all duration-300 group cursor-pointer border border-white/50 shadow-lg"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform shadow-md`}>
                {stat.icon}
              </div>
              <p className="text-3xl font-bold text-navy mb-1">{stat.value}</p>
              <p className="text-sm text-navy/60">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Today's Schedule and Announcements */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Today's Classes */}
          <div className="bg-white/40 backdrop-blur-xl rounded-2xl p-6 border border-white/50 shadow-lg">
            <h2 className="text-2xl font-bold text-navy mb-4 flex items-center gap-2">
              <span>📅</span> Today&apos;s Classes
            </h2>
            <div className="space-y-3">
              {upcomingClasses.map((cls, index) => (
                <div
                  key={index}
                  className="bg-white/50 rounded-xl p-4 hover:bg-white/60 transition-all duration-300 cursor-pointer group"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-semibold text-navy group-hover:text-blue-600 transition-colors">
                        {cls.subject}
                      </p>
                      <p className="text-sm text-navy/60 mt-1">{cls.room} • {cls.duration}</p>
                    </div>
                    <span className="text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-orange-500 px-3 py-1 rounded-full">
                      {cls.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Announcements */}
          <div className="bg-white/40 backdrop-blur-xl rounded-2xl p-6 border border-white/50 shadow-lg">
            <h2 className="text-2xl font-bold text-navy mb-4 flex items-center gap-2">
              <span>📢</span> Recent Announcements
            </h2>
            <div className="space-y-3">
              {announcements.map((announcement) => (
                <div
                  key={announcement.id}
                  className="bg-white/50 rounded-xl p-4 hover:bg-white/60 transition-all duration-300 cursor-pointer border-l-4 border-blue-500"
                >
                  <h3 className="font-semibold text-navy">{announcement.title}</h3>
                  <p className="text-sm text-navy/60 mt-1">{announcement.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white/40 backdrop-blur-xl rounded-2xl p-6 border border-white/50 shadow-lg">
          <h2 className="text-2xl font-bold text-navy mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-3">
            <button 
              onClick={() => router.push('/student/timetable')}
              className="bg-gradient-to-r from-blue-500 to-orange-500 text-white px-6 py-2 rounded-full hover:from-blue-600 hover:to-orange-600 transition-all duration-300 font-semibold shadow-md hover:shadow-lg">
              View Timetable
            </button>
            <button 
              onClick={() => router.push('/student/events')}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full hover:from-purple-600 hover:to-pink-600 transition-all duration-300 font-semibold shadow-md hover:shadow-lg">
              🎉 Events Discovery
            </button>
            <button className="bg-white/50 backdrop-blur text-navy px-6 py-2 rounded-full hover:bg-white/70 transition-all duration-300 font-semibold shadow-md hover:shadow-lg border border-white/50">
              Submit Assignment
            </button>
            <button 
              onClick={() => router.push('/student/resources')}
              className="bg-white/50 backdrop-blur text-navy px-6 py-2 rounded-full hover:bg-white/70 transition-all duration-300 font-semibold shadow-md hover:shadow-lg border border-white/50">
              🏫 Book Resources
            </button>
            <button 
              onClick={() => router.push('/student/navigation')}
              className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-6 py-2 rounded-full hover:from-green-600 hover:to-teal-600 transition-all duration-300 font-semibold shadow-md hover:shadow-lg">
              🗺️ Campus Navigation
            </button>
            <button className="bg-gradient-to-r from-blue-500 to-orange-500 text-white px-6 py-2 rounded-full hover:from-blue-600 hover:to-orange-600 transition-all duration-300 font-semibold shadow-md hover:shadow-lg">
              Contact Faculty
            </button>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="bg-gradient-to-br from-blue-500/10 to-orange-500/10 backdrop-blur-xl rounded-2xl p-6 border border-white/50 shadow-lg">
          <h2 className="text-2xl font-bold text-navy mb-4 flex items-center gap-2">
            <span>📈</span> Semester Progress
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/60 rounded-xl p-4">
              <p className="text-sm text-navy/60 mb-1">Completed Credits</p>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-orange-600 bg-clip-text text-transparent">45</span>
                <span className="text-sm text-navy/60">/ 60</span>
              </div>
              <div className="mt-2 h-2 bg-gray-200/50 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-500 to-orange-500 rounded-full" style={{ width: '75%' }}></div>
              </div>
            </div>
            <div className="bg-white/60 rounded-xl p-4">
              <p className="text-sm text-navy/60 mb-1">Assignments Submitted</p>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">28</span>
                <span className="text-sm text-navy/60">/ 35</span>
              </div>
              <div className="mt-2 h-2 bg-gray-200/50 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-green-500 to-blue-500 rounded-full" style={{ width: '80%' }}></div>
              </div>
            </div>
            <div className="bg-white/60 rounded-xl p-4">
              <p className="text-sm text-navy/60 mb-1">Days Until Finals</p>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">42</span>
                <span className="text-sm text-navy/60">days</span>
              </div>
              <div className="mt-2 h-2 bg-gray-200/50 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full" style={{ width: '60%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}