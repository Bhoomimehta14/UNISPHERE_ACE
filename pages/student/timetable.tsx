import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Layout from '@/components/Layout'

interface TimetableEntry {
  id: string
  subject: string
  faculty: string
  room: string
  time: string
  day: string
  slot: string
}

export default function StudentTimetable() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [selectedWeek, setSelectedWeek] = useState('current')
  const [showNotifications, setShowNotifications] = useState(false)
  
  // Admin-created timetable (read-only for students)
  const [myTimetable] = useState<TimetableEntry[]>([
    { id: '1', subject: 'Mathematics', faculty: 'Dr. Smith', room: 'Room 204', time: '9:00-10:00', day: 'Monday', slot: '9:00' },
    { id: '2', subject: 'Physics', faculty: 'Prof. Johnson', room: 'Room 301', time: '10:00-11:00', day: 'Monday', slot: '10:00' },
    { id: '3', subject: 'Computer Science', faculty: 'Dr. Williams', room: 'Lab 102', time: '11:00-12:00', day: 'Monday', slot: '11:00' },
    { id: '4', subject: 'English', faculty: 'Ms. Brown', room: 'Room 105', time: '14:00-15:00', day: 'Monday', slot: '14:00' },
    
    { id: '5', subject: 'Chemistry', faculty: 'Dr. Davis', room: 'Lab 201', time: '9:00-10:00', day: 'Tuesday', slot: '9:00' },
    { id: '6', subject: 'Mathematics', faculty: 'Dr. Smith', room: 'Room 204', time: '10:00-11:00', day: 'Tuesday', slot: '10:00' },
    { id: '7', subject: 'Biology', faculty: 'Prof. Garcia', room: 'Lab 103', time: '11:00-12:00', day: 'Tuesday', slot: '11:00' },
    { id: '8', subject: 'Physics Lab', faculty: 'Prof. Johnson', room: 'Lab 301', time: '14:00-16:00', day: 'Tuesday', slot: '14:00' },
    
    { id: '9', subject: 'Computer Science', faculty: 'Dr. Williams', room: 'Lab 102', time: '9:00-10:00', day: 'Wednesday', slot: '9:00' },
    { id: '10', subject: 'Mathematics', faculty: 'Dr. Smith', room: 'Room 204', time: '10:00-11:00', day: 'Wednesday', slot: '10:00' },
    { id: '11', subject: 'English', faculty: 'Ms. Brown', room: 'Room 105', time: '11:00-12:00', day: 'Wednesday', slot: '11:00' },
    { id: '12', subject: 'Chemistry', faculty: 'Dr. Davis', room: 'Lab 201', time: '14:00-15:00', day: 'Wednesday', slot: '14:00' },
    
    { id: '13', subject: 'Physics', faculty: 'Prof. Johnson', room: 'Room 301', time: '9:00-10:00', day: 'Thursday', slot: '9:00' },
    { id: '14', subject: 'Biology', faculty: 'Prof. Garcia', room: 'Lab 103', time: '10:00-11:00', day: 'Thursday', slot: '10:00' },
    { id: '15', subject: 'Computer Science Lab', faculty: 'Dr. Williams', room: 'Lab 102', time: '11:00-13:00', day: 'Thursday', slot: '11:00' },
    { id: '16', subject: 'Mathematics', faculty: 'Dr. Smith', room: 'Room 204', time: '14:00-15:00', day: 'Thursday', slot: '14:00' },
    
    { id: '17', subject: 'English', faculty: 'Ms. Brown', room: 'Room 105', time: '9:00-10:00', day: 'Friday', slot: '9:00' },
    { id: '18', subject: 'Chemistry', faculty: 'Dr. Davis', room: 'Lab 201', time: '10:00-11:00', day: 'Friday', slot: '10:00' },
    { id: '19', subject: 'Physics', faculty: 'Prof. Johnson', room: 'Room 301', time: '11:00-12:00', day: 'Friday', slot: '11:00' },
    { id: '20', subject: 'Biology', faculty: 'Prof. Garcia', room: 'Lab 103', time: '14:00-15:00', day: 'Friday', slot: '14:00' },
  ])

  // Notifications for class changes
  const [classNotifications] = useState([
    { id: 'n1', type: 'cancellation', subject: 'Physics', message: 'Physics class cancelled on Monday due to faculty meeting', date: 'Today', time: '10:00 AM', isNew: true },
    { id: 'n2', type: 'rescheduled', subject: 'Mathematics', message: 'Mathematics class rescheduled from 9:00 AM to 11:00 AM', date: 'Tomorrow', time: '9:00 AM → 11:00 AM', isNew: true },
    { id: 'n3', type: 'extra', subject: 'Computer Science', message: 'Extra Computer Science lab session', date: 'Jan 18', time: '4:00 PM', isNew: false },
    { id: 'n4', type: 'room_change', subject: 'English', message: 'English class moved from Room 105 to Room 203', date: 'Jan 19', time: '9:00 AM', isNew: false },
  ])

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

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
  const timeSlots = [
    '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'
  ]

  const getEntryForSlot = (day: string, slot: string) => {
    return myTimetable.find(entry => entry.day === day && entry.slot === slot)
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'cancellation': return '❌'
      case 'rescheduled': return '🔄'
      case 'extra': return '➕'
      case 'room_change': return '📍'
      default: return '📢'
    }
  }

  const getNotificationStyle = (type: string) => {
    switch (type) {
      case 'cancellation': return 'border-red-500'
      case 'rescheduled': return 'border-yellow-500'
      case 'extra': return 'border-green-500'
      case 'room_change': return 'border-blue-500'
      default: return 'border-gray-500'
    }
  }

  const newNotificationCount = classNotifications.filter(n => n.isNew).length

  return (
    <Layout role="student">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-navy">My Timetable</h1>
            <p className="text-navy/70 mt-2">Your weekly class schedule • Admin managed</p>
          </div>
          
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative bg-gradient-to-r from-blue-500 to-orange-500 text-white px-6 py-3 rounded-full hover:from-blue-600 hover:to-orange-600 transition-all duration-300 font-semibold shadow-md hover:shadow-lg flex items-center gap-2"
          >
            <span>📢</span>
            <span>Class Updates</span>
            {newNotificationCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center animate-pulse">
                {newNotificationCount}
              </span>
            )}
          </button>
        </div>

        {/* Notifications Panel */}
        {showNotifications && (
          <div className="bg-white/40 backdrop-blur-xl rounded-2xl p-6 border border-white/50 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-navy flex items-center gap-2">
                <span>🔔</span> Class Notifications
              </h3>
              <span className="text-sm text-navy/60">
                {newNotificationCount} new update{newNotificationCount !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {classNotifications.map(notification => (
                <div 
                  key={notification.id} 
                  className={`bg-white/50 rounded-xl p-4 border-l-4 ${getNotificationStyle(notification.type)} hover:bg-white/60 transition-all duration-300`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-xl mt-1">{getNotificationIcon(notification.type)}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-navy">{notification.subject}</p>
                        {notification.isNew && (
                          <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">NEW</span>
                        )}
                      </div>
                      <p className="text-sm text-navy/70">{notification.message}</p>
                      <p className="text-xs text-navy/50 mt-2">
                        {notification.date} • {notification.time}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Week Selector */}
        <div className="flex flex-wrap items-center gap-4">
          <button className="bg-white/50 backdrop-blur text-navy px-5 py-2.5 rounded-full hover:bg-white/70 transition-all duration-300 font-medium border border-white/50 shadow-md hover:shadow-lg">
            ← Previous Week
          </button>
          <div className="bg-gradient-to-r from-blue-500/10 to-orange-500/10 px-6 py-2.5 rounded-full border border-white/50">
            <p className="text-navy font-semibold">Week: Dec 9-13, 2024</p>
          </div>
          <button className="bg-white/50 backdrop-blur text-navy px-5 py-2.5 rounded-full hover:bg-white/70 transition-all duration-300 font-medium border border-white/50 shadow-md hover:shadow-lg">
            Next Week →
          </button>
        </div>

        {/* Timetable Grid */}
        <div className="bg-white/40 backdrop-blur-xl rounded-2xl shadow-lg border border-white/50 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500/20 to-orange-500/20 p-4 border-b border-white/30">
            <p className="text-sm text-navy/80 font-medium">📅 Weekly Schedule • Read-only view</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-white/30">
                  <th className="px-4 py-3 text-left text-navy font-semibold border-b border-r border-white/30">
                    Time
                  </th>
                  {days.map(day => (
                    <th key={day} className="px-4 py-3 text-center text-navy font-semibold border-b border-r border-white/30 min-w-[160px]">
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {timeSlots.map(slot => (
                  <tr key={slot} className="hover:bg-white/10 transition-colors">
                    <td className="px-4 py-3 text-navy font-medium border-r border-b border-white/20 bg-white/20">
                      {slot}
                    </td>
                    {days.map(day => {
                      const entry = getEntryForSlot(day, slot)
                      return (
                        <td key={`${day}-${slot}`} className="p-2 border-r border-b border-white/20">
                          {entry ? (
                            <div className="bg-gradient-to-br from-blue-500/20 to-orange-500/20 rounded-xl p-3 min-h-[100px] border border-white/50 hover:shadow-md transition-all duration-300">
                              <p className="font-semibold text-navy text-sm mb-1">{entry.subject}</p>
                              <p className="text-xs text-navy/70">👨‍🏫 {entry.faculty}</p>
                              <p className="text-xs text-navy/70">📍 {entry.room}</p>
                              <p className="text-xs text-navy/60 mt-2">⏰ {entry.time}</p>
                            </div>
                          ) : (
                            <div className="bg-white/20 rounded-xl p-3 min-h-[100px] border border-dashed border-white/40 flex items-center justify-center">
                              <span className="text-navy/30 text-sm">Free Period</span>
                            </div>
                          )}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/40 backdrop-blur-xl rounded-2xl p-5 border border-white/50 shadow-lg hover:scale-105 transition-transform duration-300">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">📚</span>
              <p className="text-sm text-navy/60">Total Classes</p>
            </div>
            <p className="text-3xl font-bold text-navy">{myTimetable.length}</p>
          </div>
          <div className="bg-white/40 backdrop-blur-xl rounded-2xl p-5 border border-white/50 shadow-lg hover:scale-105 transition-transform duration-300">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">📅</span>
              <p className="text-sm text-navy/60">Today&apos;s Classes</p>
            </div>
            <p className="text-3xl font-bold text-navy">4</p>
          </div>
          <div className="bg-white/40 backdrop-blur-xl rounded-2xl p-5 border border-white/50 shadow-lg hover:scale-105 transition-transform duration-300">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">⏳</span>
              <p className="text-sm text-navy/60">Free Periods</p>
            </div>
            <p className="text-3xl font-bold text-navy">{45 - myTimetable.length}</p>
          </div>
          <div className="bg-white/40 backdrop-blur-xl rounded-2xl p-5 border border-white/50 shadow-lg hover:scale-105 transition-transform duration-300">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">🔔</span>
              <p className="text-sm text-navy/60">New Updates</p>
            </div>
            <p className="text-3xl font-bold text-navy">{newNotificationCount}</p>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-gradient-to-br from-blue-500/10 to-orange-500/10 backdrop-blur-xl rounded-2xl p-6 border border-white/50 shadow-lg">
          <div className="flex items-start gap-4">
            <span className="text-3xl">ℹ️</span>
            <div className="flex-1">
              <h3 className="font-bold text-navy mb-3 text-lg">Important Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-start gap-2">
                  <span className="text-navy/60">•</span>
                  <p className="text-sm text-navy/70">This timetable is created and managed by administration</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-navy/60">•</span>
                  <p className="text-sm text-navy/70">Check Class Updates regularly for any changes</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-navy/60">•</span>
                  <p className="text-sm text-navy/70">Contact your academic coordinator for queries</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-navy/60">•</span>
                  <p className="text-sm text-navy/70">All schedule changes will be notified in advance</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}