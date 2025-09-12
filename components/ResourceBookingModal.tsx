import React, { useState, useEffect } from 'react'

interface ResourceBookingModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => void
  resource: {
    id?: string
    name?: string
    type?: string
    location?: string
    capacity?: number
  } | null
}

export default function ResourceBookingModal({
  isOpen,
  onClose,
  onSubmit,
  resource
}: ResourceBookingModalProps) {
  const [formData, setFormData] = useState({
    date: '',
    startTime: '',
    endTime: '',
    purpose: '',
    participants: '',
    requirements: '',
    recurring: false,
    recurringType: 'weekly' as 'daily' | 'weekly' | 'monthly',
    recurringEnd: '',
    priority: 'medium' as 'low' | 'medium' | 'high'
  })

  useEffect(() => {
    // Reset form when modal opens
    if (isOpen) {
      setFormData({
        date: '',
        startTime: '',
        endTime: '',
        purpose: '',
        participants: '',
        requirements: '',
        recurring: false,
        recurringType: 'weekly',
        recurringEnd: '',
        priority: 'medium'
      })
    }
  }, [isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const bookingData = {
      ...formData,
      resourceId: resource?.id,
      resourceName: resource?.name,
      resourceType: resource?.type,
      location: resource?.location,
      requestedBy: 'Dr. Smith Johnson', // This would come from the logged-in user
      requestedByRole: 'faculty',
      status: 'pending',
      requestDate: new Date().toISOString().split('T')[0]
    }
    
    onSubmit(bookingData)
    onClose()
  }

  const purposes = [
    'Extra Tutorial Session',
    'Research Project',
    'Guest Lecture',
    'Workshop',
    'Faculty Meeting',
    'Student Consultation',
    'Exam Preparation',
    'Lab Practice',
    'Presentation',
    'Other'
  ]

  const timeSlots = [
    '08:00', '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
  ]

  if (!isOpen || !resource) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      
      {/* Modal */}
      <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 max-w-2xl w-full mx-4 border border-white/50 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-navy mb-2">
          Book Resource
        </h2>
        <div className="mb-6">
          <p className="text-lg text-navy font-medium">{resource.name}</p>
          <p className="text-sm text-navy/60">{resource.location}</p>
          {resource.capacity && (
            <p className="text-sm text-navy/60">Capacity: {resource.capacity} people</p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Date and Time */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium text-navy mb-2">
                Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 py-2 bg-white/60 border border-white/50 rounded-xl text-navy focus:outline-none focus:ring-2 focus:ring-blue-400"
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-navy mb-2">
                Start Time <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                className="w-full px-4 py-2 bg-white/60 border border-white/50 rounded-xl text-navy focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              >
                <option value="">Select</option>
                {timeSlots.map((time) => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-navy mb-2">
                End Time <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                className="w-full px-4 py-2 bg-white/60 border border-white/50 rounded-xl text-navy focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              >
                <option value="">Select</option>
                {timeSlots.map((time) => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Purpose */}
          <div>
            <label className="block text-sm font-medium text-navy mb-2">
              Purpose <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.purpose}
              onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
              className="w-full px-4 py-2 bg-white/60 border border-white/50 rounded-xl text-navy focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            >
              <option value="">Select Purpose</option>
              {purposes.map((purpose) => (
                <option key={purpose} value={purpose}>{purpose}</option>
              ))}
            </select>
          </div>

          {/* Participants and Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-navy mb-2">
                Expected Participants
              </label>
              <input
                type="number"
                value={formData.participants}
                onChange={(e) => setFormData({ ...formData, participants: e.target.value })}
                placeholder="Number of participants"
                className="w-full px-4 py-2 bg-white/60 border border-white/50 rounded-xl text-navy focus:outline-none focus:ring-2 focus:ring-blue-400"
                min="1"
                max={resource.capacity}
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

          {/* Special Requirements */}
          <div>
            <label className="block text-sm font-medium text-navy mb-2">
              Special Requirements
            </label>
            <textarea
              value={formData.requirements}
              onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
              rows={2}
              className="w-full px-4 py-2 bg-white/60 border border-white/50 rounded-xl text-navy focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Any special equipment or setup needed..."
            />
          </div>

          {/* Recurring Booking */}
          <div className="bg-gradient-to-r from-blue-50/50 to-orange-50/50 rounded-xl p-4 border border-white/50">
            <label className="flex items-center gap-3 cursor-pointer mb-3">
              <input
                type="checkbox"
                checked={formData.recurring}
                onChange={(e) => setFormData({ ...formData, recurring: e.target.checked })}
                className="w-4 h-4 text-blue-500 rounded focus:ring-blue-400"
              />
              <span className="text-sm font-medium text-navy">Make this a recurring booking</span>
            </label>
            
            {formData.recurring && (
              <div className="grid grid-cols-2 gap-3 mt-3">
                <div>
                  <label className="block text-xs text-navy/60 mb-1">Repeat</label>
                  <select
                    value={formData.recurringType}
                    onChange={(e) => setFormData({ ...formData, recurringType: e.target.value as any })}
                    className="w-full px-3 py-1.5 bg-white/60 border border-white/50 rounded-lg text-sm text-navy focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-navy/60 mb-1">End Date</label>
                  <input
                    type="date"
                    value={formData.recurringEnd}
                    onChange={(e) => setFormData({ ...formData, recurringEnd: e.target.value })}
                    className="w-full px-3 py-1.5 bg-white/60 border border-white/50 rounded-lg text-sm text-navy focus:outline-none focus:ring-2 focus:ring-blue-400"
                    min={formData.date}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Info Box */}
          <div className="bg-blue-50/30 rounded-xl p-3 border border-blue-200/50">
            <p className="text-xs text-navy/70">
              📌 Your booking request will be sent to the admin for approval. 
              You will receive a notification once your request is processed.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-blue-500 to-orange-500 text-white py-2 px-4 rounded-xl hover:from-blue-600 hover:to-orange-600 transition-all duration-300 font-semibold shadow-md hover:shadow-lg"
            >
              Submit Booking Request
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