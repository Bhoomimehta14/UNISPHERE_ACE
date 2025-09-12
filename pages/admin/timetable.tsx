import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Layout from '@/components/Layout'
import TimetableModal from '@/components/TimetableModal'

interface TimetableEntry {
  id: string
  subject: string
  faculty: string
  student?: string
  room: string
  time: string
  day: string
  slot: string
}

export default function AdminTimetable() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [viewMode, setViewMode] = useState<'faculty' | 'student'>('faculty')
  const [selectedWeek, setSelectedWeek] = useState('current')
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'schedule' | 'reschedule' | 'cancel'>('schedule')
  const [selectedEntry, setSelectedEntry] = useState<TimetableEntry | null>(null)
  const [selectedSlot, setSelectedSlot] = useState({ day: '', slot: '' })
  
  // Mock timetable data
  const [timetableData, setTimetableData] = useState<TimetableEntry[]>([
    { id: '1', subject: 'Computer Science', faculty: 'Dr. Smith Johnson', room: 'Room 101', time: '9:00-10:00', day: 'Monday', slot: '9:00' },
    { id: '2', subject: 'Mathematics', faculty: 'Prof. Emily Davis', room: 'Room 201', time: '10:00-11:00', day: 'Monday', slot: '10:00' },
    { id: '3', subject: 'Physics', faculty: 'Dr. Michael Brown', room: 'Lab 301', time: '11:00-12:00', day: 'Tuesday', slot: '11:00' },
    { id: '4', subject: 'Chemistry', faculty: 'Prof. Sarah Wilson', room: 'Lab 302', time: '14:00-15:00', day: 'Wednesday', slot: '14:00' },
    { id: '5', subject: 'Data Structures', faculty: 'Dr. Smith Johnson', room: 'Room 102', time: '15:00-16:00', day: 'Thursday', slot: '15:00' },
    { id: '6', subject: 'Database Management', faculty: 'Dr. Robert Taylor', room: 'Room 202', time: '9:00-10:00', day: 'Friday', slot: '9:00' },
  ])

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (!userData) {
      router.push('/login')
    } else {
      const parsedUser = JSON.parse(userData)
      if (parsedUser.role !== 'admin') {
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
    return timetableData.find(entry => entry.day === day && entry.slot === slot)
  }

  const handleSchedule = (day: string, slot: string) => {
    setSelectedSlot({ day, slot })
    setSelectedEntry(null)
    setModalMode('schedule')
    setModalOpen(true)
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

  const handleSave = (data: any) => {
    if (modalMode === 'schedule') {
      const newEntry: TimetableEntry = {
        id: Date.now().toString(),
        subject: data.subject,
        faculty: data.faculty || '',
        student: data.student || '',
        room: data.room,
        time: `${selectedSlot.slot}-${parseInt(selectedSlot.slot) + 1}:00`,
        day: selectedSlot.day,
        slot: selectedSlot.slot
      }
      setTimetableData([...timetableData, newEntry])
    } else if (modalMode === 'reschedule' && selectedEntry) {
      const updated = timetableData.map(entry =>
        entry.id === selectedEntry.id
          ? { ...entry, ...data }
          : entry
      )
      setTimetableData(updated)
    } else if (modalMode === 'cancel' && selectedEntry) {
      const filtered = timetableData.filter(entry => entry.id !== selectedEntry.id)
      setTimetableData(filtered)
    }
    
    // Simulate updating other dashboards
    console.log('Updating Faculty and Student dashboards...')
  }

  return (
    <Layout role="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-navy">Timetable Management</h1>
            <p className="text-navy/70 mt-2">Manage class schedules for faculty and students</p>
          </div>
          
          {/* View Toggle */}
          <div className="flex items-center gap-4">
            <div className="flex bg-white/50 backdrop-blur rounded-xl p-1 border border-white/50">
              <button
                onClick={() => setViewMode('faculty')}
                className={`px-4 py-2 rounded-lg transition-all duration-300 font-medium ${
                  viewMode === 'faculty'
                    ? 'bg-gradient-to-r from-blue-500 to-orange-500 text-white'
                    : 'text-navy hover:bg-white/30'
                }`}
              >
                Faculty View
              </button>
              <button
                onClick={() => setViewMode('student')}
                className={`px-4 py-2 rounded-lg transition-all duration-300 font-medium ${
                  viewMode === 'student'
                    ? 'bg-gradient-to-r from-blue-500 to-orange-500 text-white'
                    : 'text-navy hover:bg-white/30'
                }`}
              >
                Student View
              </button>
            </div>
          </div>
        </div>

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
                            <div className="bg-gradient-to-br from-blue-500/20 to-orange-500/20 rounded-lg p-2 min-h-[100px] border border-white/50">
                              <p className="font-semibold text-navy text-sm">{entry.subject}</p>
                              <p className="text-xs text-navy/70 mt-1">
                                {viewMode === 'faculty' ? entry.faculty : `Student: ${entry.student || 'All'}`}
                              </p>
                              <p className="text-xs text-navy/70">{entry.room}</p>
                              
                              {/* Action Buttons */}
                              <div className="flex gap-1 mt-2">
                                <button
                                  onClick={() => handleReschedule(entry)}
                                  className="flex-1 bg-blue-500 text-white text-xs px-2 py-1 rounded hover:bg-blue-600 transition-colors"
                                  title="Reschedule"
                                >
                                  📝
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
                            <div className="bg-white/30 rounded-lg p-2 min-h-[100px] border border-dashed border-white/50 flex items-center justify-center group hover:bg-white/40 transition-colors">
                              <button
                                onClick={() => handleSchedule(day, slot)}
                                className="opacity-0 group-hover:opacity-100 bg-gradient-to-r from-blue-500 to-orange-500 text-white text-sm px-3 py-1 rounded-lg transition-opacity"
                              >
                                + Schedule
                              </button>
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

        {/* Legend */}
        <div className="bg-white/40 backdrop-blur-xl rounded-2xl p-4 border border-white/50">
          <h3 className="text-lg font-semibold text-navy mb-3">Quick Actions Guide</h3>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-orange-500 rounded flex items-center justify-center text-white text-xs">+</div>
              <span className="text-sm text-navy/70">Schedule new class</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center text-white text-xs">📝</div>
              <span className="text-sm text-navy/70">Reschedule existing class</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-red-500 rounded flex items-center justify-center text-white text-xs">❌</div>
              <span className="text-sm text-navy/70">Cancel class</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white/40 backdrop-blur-xl rounded-xl p-4 border border-white/50">
            <p className="text-sm text-navy/60">Total Classes</p>
            <p className="text-2xl font-bold text-navy">{timetableData.length}</p>
          </div>
          <div className="bg-white/40 backdrop-blur-xl rounded-xl p-4 border border-white/50">
            <p className="text-sm text-navy/60">Active Faculty</p>
            <p className="text-2xl font-bold text-navy">5</p>
          </div>
          <div className="bg-white/40 backdrop-blur-xl rounded-xl p-4 border border-white/50">
            <p className="text-sm text-navy/60">Rooms Used</p>
            <p className="text-2xl font-bold text-navy">8</p>
          </div>
          <div className="bg-white/40 backdrop-blur-xl rounded-xl p-4 border border-white/50">
            <p className="text-sm text-navy/60">Free Slots</p>
            <p className="text-2xl font-bold text-navy">{45 - timetableData.length}</p>
          </div>
        </div>
      </div>

      {/* Modal */}
      <TimetableModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        mode={modalMode}
        initialData={selectedEntry || { day: selectedSlot.day, slot: selectedSlot.slot }}
        viewMode={viewMode}
      />
    </Layout>
  )
}