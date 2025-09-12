import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Layout from '@/components/Layout'
import FacultyRequestModal from '@/components/FacultyRequestModal'

interface TimetableEntry {
  id: string
  subject: string
  class: string
  room: string
  time: string
  day: string
  slot: string
  students: number
}

export default function FacultyTimetable() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [selectedWeek, setSelectedWeek] = useState('current')
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'reschedule' | 'cancel' | 'extra'>('reschedule')
  const [selectedEntry, setSelectedEntry] = useState<TimetableEntry | null>(null)
  const [showNotification, setShowNotification] = useState(false)
  const [notificationMessage, setNotificationMessage] = useState('')
  
  // Mock timetable data for logged-in faculty
  const [myTimetable] = useState<TimetableEntry[]>([
    { id: '1', subject: 'Computer Science', class: 'CS-3A', room: 'Room 101', time: '9:00-10:00', day: 'Monday', slot: '9:00', students: 35 },
    { id: '2', subject: 'Data Structures', class: 'CS-2B', room: 'Room 102', time: '11:00-12:00', day: 'Monday', slot: '11:00', students: 40 },
    { id: '3', subject: 'Computer Science', class: 'CS-3B', room: 'Lab 301', time: '14:00-15:00', day: 'Tuesday', slot: '14:00', students: 38 },
    { id: '4', subject: 'Database Management', class: 'CS-4A', room: 'Room 202', time: '10:00-11:00', day: 'Wednesday', slot: '10:00', students: 30 },
    { id: '5', subject: 'Data Structures', class: 'CS-2A', room: 'Room 102', time: '15:00-16:00', day: 'Thursday', slot: '15:00', students: 42 },
    { id: '6', subject: 'Computer Science', class: 'CS-3A', room: 'Room 101', time: '9:00-10:00', day: 'Friday', slot: '9:00', students: 35 },
  ])

  // Mock notifications for approved requests
  const [approvalNotifications] = useState([
    { id: 'n1', type: 'approved', message: 'Your request to reschedule Monday class has been approved', date: '2024-12-10' },
    { id: 'n2', type: 'pending', message: 'Your request for extra lecture is pending admin approval', date: '2024-12-11' },
  ])

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (!userData) {
      router.push('/login')
    } else {
      const parsedUser = JSON.parse(userData)
      if (parsedUser.role !== 'faculty') {
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

  const handleReschedule = (entry: TimetableEntry) => {
    setSelectedEntry(entry)
    setModalMode('reschedule')
    setModalOpen(true)
  }

  const handleCancel = (entry: TimetableEntry) => {
    setSelectedEntry(entry)
    setModalMode('cancel')
    setModalOpen(true)
  }

  const handleExtraLecture = () => {
    setSelectedEntry(null)
    setModalMode('extra')
    setModalOpen(true)
  }

  const handleSubmitRequest = (requestData: any) => {
    // Here you would normally send the request to the backend
    console.log('Submitting request:', requestData)
    
    // Show notification
    let message = ''
    if (modalMode === 'reschedule') {
      message = `Request to reschedule ${requestData.subject} has been sent to admin for approval`
    } else if (modalMode === 'cancel') {
      message = `Request to cancel ${requestData.subject} has been sent to admin for approval`
    } else {
      message = `Request for extra lecture has been sent to admin for approval`
    }
    
    setNotificationMessage(message)
    setShowNotification(true)
    setTimeout(() => setShowNotification(false), 5000)
    
    setModalOpen(false)
  }

  return (
    <Layout role="faculty">
      {/* Notification */}
      {showNotification && (
        <div className="fixed top-4 right-4 z-50 bg-white/90 backdrop-blur-xl rounded-xl shadow-2xl p-4 border border-white/50 max-w-sm animate-pulse">
          <p className="text-navy font-semibold">Request Sent</p>
          <p className="text-sm text-navy/70 mt-1">{notificationMessage}</p>
        </div>
      )}

      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-navy">My Timetable</h1>
            <p className="text-navy/70 mt-2">Your weekly teaching schedule</p>
          </div>
          
          <button
            onClick={handleExtraLecture}
            className="bg-gradient-to-r from-blue-500 to-orange-500 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-orange-600 transition-all duration-300 font-semibold shadow-md hover:shadow-lg"
          >
            + Request Extra Lecture
          </button>
        </div>

        {/* Notifications Panel */}
        {approvalNotifications.length > 0 && (
          <div className="bg-white/40 backdrop-blur-xl rounded-2xl p-4 border border-white/50">
            <h3 className="text-lg font-semibold text-navy mb-3">Recent Notifications</h3>
            <div className="space-y-2">
              {approvalNotifications.map(notification => (
                <div key={notification.id} className="flex items-center gap-3 p-3 bg-white/30 rounded-lg">
                  <span className="text-2xl">
                    {notification.type === 'approved' ? '✅' : '⏳'}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm text-navy">{notification.message}</p>
                    <p className="text-xs text-navy/60">{notification.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Week Selector */}
        <div className="flex items-center gap-4">
          <button className="bg-white/50 backdrop-blur text-navy px-4 py-2 rounded-xl hover:bg-white/70 transition-all duration-300 font-medium border border-white/50">
            ← Previous Week
          </button>
          <div className="bg-gradient-to-r from-blue-500/10 to-orange-500/10 px-6 py-2 rounded-xl border border-white/50">
            <p className="text-navy font-semibold">Current Week: Dec 9-13, 2024</p>
          </div>
          <button className="bg-white/50 backdrop-blur text-navy px-4 py-2 rounded-xl hover:bg-white/70 transition-all duration-300 font-medium border border-white/50">
            Next Week →
          </button>
        </div>

        {/* Timetable Grid */}
        <div className="bg-white/40 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-blue-500/20 to-orange-500/20">
                  <th className="px-4 py-3 text-left text-navy font-semibold border-b border-white/30">
                    Time
                  </th>
                  {days.map(day => (
                    <th key={day} className="px-4 py-3 text-center text-navy font-semibold border-b border-white/30 min-w-[150px]">
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {timeSlots.map(slot => (
                  <tr key={slot} className="border-b border-white/20 hover:bg-white/20 transition-colors">
                    <td className="px-4 py-2 text-navy font-medium border-r border-white/20">
                      {slot}
                    </td>
                    {days.map(day => {
                      const entry = getEntryForSlot(day, slot)
                      return (
                        <td key={`${day}-${slot}`} className="px-2 py-2 border-r border-white/20">
                          {entry ? (
                            <div className="bg-gradient-to-br from-blue-500/20 to-orange-500/20 rounded-lg p-3 min-h-[120px] border border-white/50">
                              <p className="font-semibold text-navy text-sm">{entry.subject}</p>
                              <p className="text-xs text-navy/70 mt-1">Class: {entry.class}</p>
                              <p className="text-xs text-navy/70">Room: {entry.room}</p>
                              <p className="text-xs text-navy/60 mt-1">
                                👥 {entry.students} students
                              </p>
                              
                              {/* Action Buttons */}
                              <div className="flex gap-1 mt-2">
                                <button
                                  onClick={() => handleReschedule(entry)}
                                  className="flex-1 bg-blue-500 text-white text-xs px-2 py-1 rounded hover:bg-blue-600 transition-colors"
                                  title="Reschedule"
                                >
                                  🔄
                                </button>
                                <button
                                  onClick={() => handleCancel(entry)}
                                  className="flex-1 bg-red-500 text-white text-xs px-2 py-1 rounded hover:bg-red-600 transition-colors"
                                  title="Cancel"
                                >
                                  ❌
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="bg-white/30 rounded-lg p-3 min-h-[120px] border border-dashed border-white/50 flex items-center justify-center">
                              <span className="text-navy/30 text-sm">Free Slot</span>
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

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white/40 backdrop-blur-xl rounded-xl p-4 border border-white/50">
            <p className="text-sm text-navy/60">Total Classes</p>
            <p className="text-2xl font-bold text-navy">{myTimetable.length}</p>
          </div>
          <div className="bg-white/40 backdrop-blur-xl rounded-xl p-4 border border-white/50">
            <p className="text-sm text-navy/60">Total Students</p>
            <p className="text-2xl font-bold text-navy">
              {myTimetable.reduce((sum, entry) => sum + entry.students, 0)}
            </p>
          </div>
          <div className="bg-white/40 backdrop-blur-xl rounded-xl p-4 border border-white/50">
            <p className="text-sm text-navy/60">Classes Today</p>
            <p className="text-2xl font-bold text-navy">2</p>
          </div>
          <div className="bg-white/40 backdrop-blur-xl rounded-xl p-4 border border-white/50">
            <p className="text-sm text-navy/60">Free Slots</p>
            <p className="text-2xl font-bold text-navy">{45 - myTimetable.length}</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gradient-to-r from-blue-500/10 to-orange-500/10 backdrop-blur-xl rounded-2xl p-6 border border-white/50">
          <h3 className="text-lg font-semibold text-navy mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <button 
              onClick={handleExtraLecture}
              className="bg-white/50 backdrop-blur text-navy px-4 py-3 rounded-xl hover:bg-white/70 transition-all duration-300 font-medium border border-white/50 text-sm flex items-center justify-center gap-2"
            >
              <span>➕</span> Request Extra Lecture
            </button>
            <button className="bg-white/50 backdrop-blur text-navy px-4 py-3 rounded-xl hover:bg-white/70 transition-all duration-300 font-medium border border-white/50 text-sm flex items-center justify-center gap-2">
              <span>📊</span> View Attendance
            </button>
            <button className="bg-white/50 backdrop-blur text-navy px-4 py-3 rounded-xl hover:bg-white/70 transition-all duration-300 font-medium border border-white/50 text-sm flex items-center justify-center gap-2">
              <span>📧</span> Notify Students
            </button>
          </div>
        </div>
      </div>

      {/* Request Modal */}
      <FacultyRequestModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmitRequest}
        mode={modalMode}
        initialData={selectedEntry}
      />
    </Layout>
  )
}