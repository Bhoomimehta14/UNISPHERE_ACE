import React, { useState, useEffect } from 'react'

interface FacultyRequestModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => void
  mode: 'reschedule' | 'cancel' | 'extra'
  initialData?: {
    id?: string
    subject?: string
    class?: string
    room?: string
    time?: string
    day?: string
    students?: number
  } | null
}

export default function FacultyRequestModal({
  isOpen,
  onClose,
  onSubmit,
  mode,
  initialData
}: FacultyRequestModalProps) {
  const [formData, setFormData] = useState({
    subject: '',
    class: '',
    currentTime: '',
    currentDay: '',
    currentRoom: '',
    proposedTime: '',
    proposedDay: '',
    proposedRoom: '',
    reason: '',
    affectedStudents: 0,
    priority: 'medium' as 'low' | 'medium' | 'high'
  })

  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({
        ...prev,
        subject: initialData.subject || '',
        class: initialData.class || '',
        currentTime: initialData.time || '',
        currentDay: initialData.day || '',
        currentRoom: initialData.room || '',
        affectedStudents: initialData.students || 0
      }))
    }
  }, [initialData])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const requestData = {
      type: mode,
      ...formData,
      requestedBy: 'Dr. Smith Johnson', // This would come from the logged-in user
      requestedByRole: 'faculty',
      date: new Date().toISOString().split('T')[0],
      status: 'pending'
    }
    
    onSubmit(requestData)
    onClose()
  }

  const rooms = [
    'Room 101', 'Room 102', 'Room 103', 'Room 104', 'Room 105',
    'Room 201', 'Room 202', 'Room 203',
    'Lab 301', 'Lab 302', 'Computer Lab 1', 'Computer Lab 2',
    'Auditorium', 'Seminar Hall'
  ]

  const subjects = [
    'Computer Science', 'Mathematics', 'Physics', 'Chemistry',
    'Data Structures', 'Database Management', 'Web Development',
    'Artificial Intelligence', 'Machine Learning'
  ]

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const timeSlots = [
    '9:00-10:00', '10:00-11:00', '11:00-12:00', '12:00-13:00',
    '14:00-15:00', '15:00-16:00', '16:00-17:00', '17:00-18:00'
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
      <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 max-w-2xl w-full mx-4 border border-white/50 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-navy mb-6">
          {mode === 'reschedule' && 'Request Lecture Reschedule'}
          {mode === 'cancel' && 'Request Lecture Cancellation'}
          {mode === 'extra' && 'Request Extra Lecture'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Subject and Class */}
          <div className="grid grid-cols-2 gap-4">
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
            <div>
              <label className="block text-sm font-medium text-navy mb-2">
                Class/Section
              </label>
              <input
                type="text"
                value={formData.class}
                onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                placeholder="e.g., CS-3A"
                className="w-full px-4 py-2 bg-white/60 border border-white/50 rounded-xl text-navy focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
          </div>

          {/* Current Schedule (for reschedule and cancel) */}
          {(mode === 'reschedule' || mode === 'cancel') && (
            <>
              <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-200/50">
                <p className="text-sm font-medium text-navy mb-3">Current Schedule</p>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs text-navy/60 mb-1">Day</label>
                    <select
                      value={formData.currentDay}
                      onChange={(e) => setFormData({ ...formData, currentDay: e.target.value })}
                      className="w-full px-3 py-1.5 bg-white/60 border border-white/50 rounded-lg text-sm text-navy focus:outline-none focus:ring-2 focus:ring-blue-400"
                      required
                    >
                      <option value="">Select Day</option>
                      {days.map((day) => (
                        <option key={day} value={day}>{day}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-navy/60 mb-1">Time</label>
                    <select
                      value={formData.currentTime}
                      onChange={(e) => setFormData({ ...formData, currentTime: e.target.value })}
                      className="w-full px-3 py-1.5 bg-white/60 border border-white/50 rounded-lg text-sm text-navy focus:outline-none focus:ring-2 focus:ring-blue-400"
                      required
                    >
                      <option value="">Select Time</option>
                      {timeSlots.map((time) => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-navy/60 mb-1">Room</label>
                    <select
                      value={formData.currentRoom}
                      onChange={(e) => setFormData({ ...formData, currentRoom: e.target.value })}
                      className="w-full px-3 py-1.5 bg-white/60 border border-white/50 rounded-lg text-sm text-navy focus:outline-none focus:ring-2 focus:ring-blue-400"
                      required
                    >
                      <option value="">Select Room</option>
                      {rooms.map((room) => (
                        <option key={room} value={room}>{room}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Proposed Schedule (for reschedule and extra) */}
          {(mode === 'reschedule' || mode === 'extra') && (
            <div className="bg-green-50/50 rounded-xl p-4 border border-green-200/50">
              <p className="text-sm font-medium text-navy mb-3">
                {mode === 'reschedule' ? 'Proposed New Schedule' : 'Proposed Schedule'}
              </p>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs text-navy/60 mb-1">Day</label>
                  <select
                    value={formData.proposedDay}
                    onChange={(e) => setFormData({ ...formData, proposedDay: e.target.value })}
                    className="w-full px-3 py-1.5 bg-white/60 border border-white/50 rounded-lg text-sm text-navy focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                  >
                    <option value="">Select Day</option>
                    {days.map((day) => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-navy/60 mb-1">Time</label>
                  <select
                    value={formData.proposedTime}
                    onChange={(e) => setFormData({ ...formData, proposedTime: e.target.value })}
                    className="w-full px-3 py-1.5 bg-white/60 border border-white/50 rounded-lg text-sm text-navy focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                  >
                    <option value="">Select Time</option>
                    {timeSlots.map((time) => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-navy/60 mb-1">Room</label>
                  <select
                    value={formData.proposedRoom}
                    onChange={(e) => setFormData({ ...formData, proposedRoom: e.target.value })}
                    className="w-full px-3 py-1.5 bg-white/60 border border-white/50 rounded-lg text-sm text-navy focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                  >
                    <option value="">Select Room</option>
                    {rooms.map((room) => (
                      <option key={room} value={room}>{room}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Reason */}
          <div>
            <label className="block text-sm font-medium text-navy mb-2">
              Reason for {mode === 'reschedule' ? 'Rescheduling' : mode === 'cancel' ? 'Cancellation' : 'Extra Lecture'}
            </label>
            <textarea
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 bg-white/60 border border-white/50 rounded-xl text-navy focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Please provide a detailed reason..."
              required
            />
          </div>

          {/* Additional Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-navy mb-2">
                Affected Students
              </label>
              <input
                type="number"
                value={formData.affectedStudents}
                onChange={(e) => setFormData({ ...formData, affectedStudents: parseInt(e.target.value) })}
                className="w-full px-4 py-2 bg-white/60 border border-white/50 rounded-xl text-navy focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Number of students"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-navy mb-2">
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                className="w-full px-4 py-2 bg-white/60 border border-white/50 rounded-xl text-navy focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          {/* Notice */}
          <div className="bg-gradient-to-r from-blue-50/50 to-orange-50/50 rounded-xl p-3 border border-white/50">
            <p className="text-xs text-navy/70">
              📌 This request will be sent to the admin for approval. Once approved, affected students will be automatically notified of the changes.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-blue-500 to-orange-500 text-white py-2 px-4 rounded-xl hover:from-blue-600 hover:to-orange-600 transition-all duration-300 font-semibold shadow-md hover:shadow-lg"
            >
              Submit Request
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
      </div>
    </div>
  )
}