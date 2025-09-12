import React, { useState, useEffect } from 'react'

interface TimetableModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: any) => void
  mode: 'schedule' | 'reschedule' | 'cancel'
  initialData?: {
    id?: string
    subject?: string
    faculty?: string
    student?: string
    date?: string
    time?: string
    room?: string
    day?: string
    slot?: string
  }
  viewMode: 'faculty' | 'student'
}

export default function TimetableModal({
  isOpen,
  onClose,
  onSave,
  mode,
  initialData = {},
  viewMode
}: TimetableModalProps) {
  const [formData, setFormData] = useState({
    subject: '',
    faculty: '',
    student: '',
    date: '',
    time: '',
    room: '',
    ...initialData
  })

  useEffect(() => {
    if (initialData) {
      setFormData({
        subject: initialData.subject || '',
        faculty: initialData.faculty || '',
        student: initialData.student || '',
        date: initialData.date || '',
        time: initialData.time || '',
        room: initialData.room || '',
      })
    }
  }, [initialData])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
    onClose()
  }

  const faculties = [
    'Dr. Smith Johnson',
    'Prof. Emily Davis',
    'Dr. Michael Brown',
    'Prof. Sarah Wilson',
    'Dr. Robert Taylor'
  ]

  const students = [
    'John Anderson',
    'Emma Thompson',
    'Oliver Martinez',
    'Sophia Rodriguez',
    'William Lee'
  ]

  const subjects = [
    'Computer Science',
    'Mathematics',
    'Physics',
    'Chemistry',
    'English Literature',
    'Data Structures',
    'Database Management',
    'Web Development'
  ]

  const rooms = [
    'Room 101',
    'Room 102',
    'Room 201',
    'Room 202',
    'Lab 301',
    'Lab 302',
    'Auditorium',
    'Seminar Hall'
  ]

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      
      {/* Modal */}
      <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 max-w-md w-full mx-4 border border-white/50">
        <h2 className="text-2xl font-bold text-navy mb-6">
          {mode === 'schedule' && 'Schedule New Class'}
          {mode === 'reschedule' && 'Reschedule Class'}
          {mode === 'cancel' && 'Cancel Class'}
        </h2>

        {mode === 'cancel' ? (
          <div>
            <p className="text-navy/70 mb-6">
              Are you sure you want to cancel this class?
            </p>
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
              <p className="font-semibold text-navy">{initialData.subject}</p>
              <p className="text-sm text-navy/60">
                {viewMode === 'faculty' ? `Faculty: ${initialData.faculty}` : `Student: ${initialData.student}`}
              </p>
              <p className="text-sm text-navy/60">Room: {initialData.room}</p>
              <p className="text-sm text-navy/60">Time: {initialData.time}</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  onSave({ ...initialData, cancelled: true })
                  onClose()
                }}
                className="flex-1 bg-red-500 text-white py-2 px-4 rounded-xl hover:bg-red-600 transition-all duration-300 font-semibold"
              >
                Confirm Cancel
              </button>
              <button
                onClick={onClose}
                className="flex-1 bg-white/50 text-navy py-2 px-4 rounded-xl hover:bg-white/70 transition-all duration-300 font-semibold border border-white/50"
              >
                Keep Class
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Subject */}
            <div>
              <label className="block text-sm font-medium text-navy mb-2">
                Subject
              </label>
              <select
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-4 py-2 bg-white/60 border border-white/50 rounded-xl text-navy focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              >
                <option value="">Select Subject</option>
                {subjects.map((subject) => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>

            {/* Faculty/Student Selector */}
            {viewMode === 'faculty' ? (
              <div>
                <label className="block text-sm font-medium text-navy mb-2">
                  Faculty
                </label>
                <select
                  value={formData.faculty}
                  onChange={(e) => setFormData({ ...formData, faculty: e.target.value })}
                  className="w-full px-4 py-2 bg-white/60 border border-white/50 rounded-xl text-navy focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                >
                  <option value="">Select Faculty</option>
                  {faculties.map((faculty) => (
                    <option key={faculty} value={faculty}>{faculty}</option>
                  ))}
                </select>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-navy mb-2">
                  Student
                </label>
                <select
                  value={formData.student}
                  onChange={(e) => setFormData({ ...formData, student: e.target.value })}
                  className="w-full px-4 py-2 bg-white/60 border border-white/50 rounded-xl text-navy focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                >
                  <option value="">Select Student</option>
                  {students.map((student) => (
                    <option key={student} value={student}>{student}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Date & Time */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-navy mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-2 bg-white/60 border border-white/50 rounded-xl text-navy focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy mb-2">
                  Time
                </label>
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="w-full px-4 py-2 bg-white/60 border border-white/50 rounded-xl text-navy focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>
            </div>

            {/* Room */}
            <div>
              <label className="block text-sm font-medium text-navy mb-2">
                Room/Location
              </label>
              <select
                value={formData.room}
                onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                className="w-full px-4 py-2 bg-white/60 border border-white/50 rounded-xl text-navy focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              >
                <option value="">Select Room</option>
                {rooms.map((room) => (
                  <option key={room} value={room}>{room}</option>
                ))}
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-blue-500 to-orange-500 text-white py-2 px-4 rounded-xl hover:from-blue-600 hover:to-orange-600 transition-all duration-300 font-semibold shadow-md hover:shadow-lg"
              >
                {mode === 'schedule' ? 'Schedule' : 'Update'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-white/50 text-navy py-2 px-4 rounded-xl hover:bg-white/70 transition-all duration-300 font-semibold border border-white/50"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}