import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Layout from '@/components/Layout'

interface Resource {
  id: string
  name: string
  type: 'classroom' | 'study-room' | 'lab' | 'auditorium' | 'conference'
  capacity: number
  location: string
  amenities: string[]
  image: string
  available: boolean
  description: string
}

interface BookingRequest {
  id: string
  resourceId: string
  resourceName: string
  date: string
  startTime: string
  endTime: string
  purpose: string
  attendees: number
  status: 'pending' | 'approved' | 'rejected'
  requestDate: string
  adminResponse?: string
  notificationRead: boolean
}

interface BookingForm {
  resourceId: string
  date: string
  startTime: string
  endTime: string
  purpose: string
  attendees: string
  requirements: string
  contactNumber: string
}

export default function ResourceBooking() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<'browse' | 'bookings' | 'notifications'>('browse')
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null)
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [filterType, setFilterType] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [bookingForm, setBookingForm] = useState<BookingForm>({
    resourceId: '',
    date: '',
    startTime: '',
    endTime: '',
    purpose: '',
    attendees: '',
    requirements: '',
    contactNumber: ''
  })
  const [formErrors, setFormErrors] = useState<Partial<BookingForm>>({})

  // Mock data for resources
  const [resources] = useState<Resource[]>([
    {
      id: '1',
      name: 'Classroom A-101',
      type: 'classroom',
      capacity: 40,
      location: 'Building A, First Floor',
      amenities: ['Projector', 'Whiteboard', 'AC', 'WiFi'],
      image: '🏫',
      available: true,
      description: 'Standard classroom with modern teaching facilities'
    },
    {
      id: '2',
      name: 'Study Room S-201',
      type: 'study-room',
      capacity: 8,
      location: 'Library, Second Floor',
      amenities: ['Whiteboard', 'Power Outlets', 'WiFi', 'Round Table'],
      image: '📚',
      available: true,
      description: 'Quiet study space for group discussions'
    },
    {
      id: '3',
      name: 'Computer Lab CL-301',
      type: 'lab',
      capacity: 30,
      location: 'Tech Building, Third Floor',
      amenities: ['30 PCs', 'Projector', 'AC', 'Software Suite'],
      image: '💻',
      available: false,
      description: 'Fully equipped computer lab with latest software'
    },
    {
      id: '4',
      name: 'Main Auditorium',
      type: 'auditorium',
      capacity: 500,
      location: 'Central Building',
      amenities: ['Stage', 'Sound System', 'Projector', 'AC', 'Green Room'],
      image: '🎭',
      available: true,
      description: 'Large auditorium for events and presentations'
    },
    {
      id: '5',
      name: 'Conference Room C-102',
      type: 'conference',
      capacity: 20,
      location: 'Admin Building, First Floor',
      amenities: ['Video Conferencing', 'Projector', 'Whiteboard', 'AC'],
      image: '👥',
      available: true,
      description: 'Professional meeting room with video conferencing'
    },
    {
      id: '6',
      name: 'Study Room S-202',
      type: 'study-room',
      capacity: 6,
      location: 'Library, Second Floor',
      amenities: ['Whiteboard', 'Power Outlets', 'WiFi'],
      image: '📖',
      available: true,
      description: 'Small group study room'
    },
    {
      id: '7',
      name: 'Classroom B-205',
      type: 'classroom',
      capacity: 60,
      location: 'Building B, Second Floor',
      amenities: ['Smart Board', 'AC', 'WiFi', 'Audio System'],
      image: '🎓',
      available: true,
      description: 'Large classroom with smart teaching tools'
    },
    {
      id: '8',
      name: 'Physics Lab PL-401',
      type: 'lab',
      capacity: 25,
      location: 'Science Building, Fourth Floor',
      amenities: ['Lab Equipment', 'Projector', 'AC', 'Safety Equipment'],
      image: '🔬',
      available: true,
      description: 'Well-equipped physics laboratory'
    }
  ])

  // Mock booking requests
  const [bookingRequests, setBookingRequests] = useState<BookingRequest[]>([
    {
      id: 'b1',
      resourceId: '1',
      resourceName: 'Classroom A-101',
      date: '2024-12-20',
      startTime: '10:00',
      endTime: '12:00',
      purpose: 'Group Project Discussion',
      attendees: 15,
      status: 'approved',
      requestDate: '2024-12-10',
      adminResponse: 'Approved for use',
      notificationRead: false
    },
    {
      id: 'b2',
      resourceId: '2',
      resourceName: 'Study Room S-201',
      date: '2024-12-22',
      startTime: '14:00',
      endTime: '16:00',
      purpose: 'Exam Preparation',
      attendees: 6,
      status: 'pending',
      requestDate: '2024-12-11',
      notificationRead: true
    },
    {
      id: 'b3',
      resourceId: '4',
      resourceName: 'Main Auditorium',
      date: '2024-12-25',
      startTime: '18:00',
      endTime: '21:00',
      purpose: 'Cultural Event Practice',
      attendees: 100,
      status: 'rejected',
      requestDate: '2024-12-09',
      adminResponse: 'Auditorium already booked for another event',
      notificationRead: false
    }
  ])

  // Notifications (approved/rejected bookings)
  const notifications = bookingRequests.filter(
    booking => booking.status !== 'pending' && !booking.notificationRead
  )

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

  const getResourceTypeIcon = (type: string) => {
    switch (type) {
      case 'classroom': return '🏫'
      case 'study-room': return '📚'
      case 'lab': return '💻'
      case 'auditorium': return '🎭'
      case 'conference': return '👥'
      default: return '🏢'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-500'
      case 'rejected': return 'bg-red-500'
      case 'pending': return 'bg-yellow-500'
      default: return 'bg-gray-500'
    }
  }

  const filteredResources = resources.filter(resource => {
    const matchesType = filterType === 'all' || resource.type === filterType
    const matchesSearch = resource.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.location.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesType && matchesSearch
  })

  const openBookingModal = (resource: Resource) => {
    setSelectedResource(resource)
    setBookingForm({
      ...bookingForm,
      resourceId: resource.id
    })
    setShowBookingModal(true)
  }

  const validateBookingForm = (): boolean => {
    const errors: Partial<BookingForm> = {}
    
    if (!bookingForm.date) errors.date = 'Date is required'
    if (!bookingForm.startTime) errors.startTime = 'Start time is required'
    if (!bookingForm.endTime) errors.endTime = 'End time is required'
    if (!bookingForm.purpose) errors.purpose = 'Purpose is required'
    if (!bookingForm.attendees) errors.attendees = 'Number of attendees is required'
    if (!bookingForm.contactNumber) errors.contactNumber = 'Contact number is required'
    
    // Validate date is not in the past
    const selectedDate = new Date(bookingForm.date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    if (selectedDate < today) {
      errors.date = 'Cannot book for past dates'
    }
    
    // Validate time
    if (bookingForm.startTime && bookingForm.endTime) {
      if (bookingForm.startTime >= bookingForm.endTime) {
        errors.endTime = 'End time must be after start time'
      }
    }
    
    // Validate attendees doesn't exceed capacity
    if (selectedResource && parseInt(bookingForm.attendees) > selectedResource.capacity) {
      errors.attendees = `Cannot exceed capacity of ${selectedResource.capacity}`
    }
    
    // Phone validation
    if (bookingForm.contactNumber && !/^\d{10}$/.test(bookingForm.contactNumber)) {
      errors.contactNumber = 'Phone number must be 10 digits'
    }
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmitBooking = () => {
    if (validateBookingForm() && selectedResource) {
      // Create new booking request
      const newBooking: BookingRequest = {
        id: `b${bookingRequests.length + 1}`,
        resourceId: selectedResource.id,
        resourceName: selectedResource.name,
        date: bookingForm.date,
        startTime: bookingForm.startTime,
        endTime: bookingForm.endTime,
        purpose: bookingForm.purpose,
        attendees: parseInt(bookingForm.attendees),
        status: 'pending',
        requestDate: new Date().toISOString().split('T')[0],
        notificationRead: true
      }
      
      setBookingRequests([...bookingRequests, newBooking])
      
      // Show success message
      alert(`Booking request submitted successfully! You will be notified once admin reviews your request.`)
      
      // Reset form and close modal
      setBookingForm({
        resourceId: '',
        date: '',
        startTime: '',
        endTime: '',
        purpose: '',
        attendees: '',
        requirements: '',
        contactNumber: ''
      })
      setFormErrors({})
      setShowBookingModal(false)
      setSelectedResource(null)
      
      // Switch to bookings tab
      setActiveTab('bookings')
    }
  }

  const markNotificationAsRead = (bookingId: string) => {
    setBookingRequests(prev => prev.map(booking =>
      booking.id === bookingId ? { ...booking, notificationRead: true } : booking
    ))
  }

  const cancelBooking = (bookingId: string) => {
    if (confirm('Are you sure you want to cancel this booking request?')) {
      setBookingRequests(prev => prev.filter(booking => booking.id !== bookingId))
    }
  }

  const resourceTypes = [
    { value: 'all', label: 'All Resources' },
    { value: 'classroom', label: 'Classrooms' },
    { value: 'study-room', label: 'Study Rooms' },
    { value: 'lab', label: 'Labs' },
    { value: 'auditorium', label: 'Auditorium' },
    { value: 'conference', label: 'Conference Rooms' }
  ]

  return (
    <Layout role="student">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-navy">Resource Booking</h1>
            <p className="text-navy/70 mt-2">Book classrooms, labs, and study spaces</p>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={() => setActiveTab('browse')}
              className={`px-6 py-2.5 rounded-full font-semibold transition-all duration-300 ${
                activeTab === 'browse'
                  ? 'bg-gradient-to-r from-blue-500 to-orange-500 text-white shadow-lg'
                  : 'bg-white/50 text-navy border border-white/50'
              }`}
            >
              Browse Resources
            </button>
            <button
              onClick={() => setActiveTab('bookings')}
              className={`px-6 py-2.5 rounded-full font-semibold transition-all duration-300 ${
                activeTab === 'bookings'
                  ? 'bg-gradient-to-r from-blue-500 to-orange-500 text-white shadow-lg'
                  : 'bg-white/50 text-navy border border-white/50'
              }`}
            >
              My Bookings
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`relative px-6 py-2.5 rounded-full font-semibold transition-all duration-300 ${
                activeTab === 'notifications'
                  ? 'bg-gradient-to-r from-blue-500 to-orange-500 text-white shadow-lg'
                  : 'bg-white/50 text-navy border border-white/50'
              }`}
            >
              Notifications
              {notifications.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center animate-pulse">
                  {notifications.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Browse Resources */}
        {activeTab === 'browse' && (
          <>
            {/* Search and Filter */}
            <div className="flex gap-4 flex-wrap">
              <div className="flex-1 min-w-[300px]">
                <input
                  type="text"
                  placeholder="Search by name or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-full bg-white/50 border border-white/50 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
              <div className="flex gap-2 overflow-x-auto">
                {resourceTypes.map(type => (
                  <button
                    key={type.value}
                    onClick={() => setFilterType(type.value)}
                    className={`px-4 py-2.5 rounded-full font-medium whitespace-nowrap transition-all duration-300 ${
                      filterType === type.value
                        ? 'bg-gradient-to-r from-blue-500 to-orange-500 text-white shadow-md'
                        : 'bg-white/40 text-navy border border-white/50 hover:bg-white/60'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Resources Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources.map(resource => (
                <div
                  key={resource.id}
                  className="bg-white/40 backdrop-blur-xl rounded-2xl border border-white/50 shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  {/* Resource Header */}
                  <div className="h-32 bg-gradient-to-br from-blue-500/20 to-orange-500/20 flex items-center justify-center text-5xl">
                    {resource.image}
                  </div>

                  {/* Resource Details */}
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-bold text-navy text-lg">{resource.name}</h3>
                        <p className="text-sm text-navy/60">{resource.location}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        resource.available 
                          ? 'bg-green-500/20 text-green-600' 
                          : 'bg-red-500/20 text-red-600'
                      }`}>
                        {resource.available ? 'Available' : 'Occupied'}
                      </span>
                    </div>

                    <p className="text-sm text-navy/70 mb-3">{resource.description}</p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-navy/60">
                        <span>👥</span>
                        <span>Capacity: {resource.capacity} people</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-navy/60">
                        <span>🏷️</span>
                        <span className="capitalize">{resource.type.replace('-', ' ')}</span>
                      </div>
                    </div>

                    {/* Amenities */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {resource.amenities.map(amenity => (
                        <span
                          key={amenity}
                          className="text-xs px-2 py-1 bg-white/50 text-navy rounded-full"
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>

                    <button
                      onClick={() => openBookingModal(resource)}
                      disabled={!resource.available}
                      className={`w-full py-2.5 rounded-full font-semibold transition-all duration-300 ${
                        resource.available
                          ? 'bg-gradient-to-r from-blue-500 to-orange-500 text-white hover:from-blue-600 hover:to-orange-600'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {resource.available ? 'Book Now' : 'Not Available'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* My Bookings */}
        {activeTab === 'bookings' && (
          <div className="space-y-4">
            {bookingRequests.length > 0 ? (
              bookingRequests.map(booking => (
                <div
                  key={booking.id}
                  className="bg-white/40 backdrop-blur-xl rounded-2xl p-6 border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="font-bold text-navy text-lg">{booking.resourceName}</h3>
                        <span className={`${getStatusColor(booking.status)} text-white text-xs px-3 py-1 rounded-full`}>
                          {booking.status.toUpperCase()}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-2 text-navy/70">
                          <span>📅</span>
                          <span>Date: {booking.date}</span>
                        </div>
                        <div className="flex items-center gap-2 text-navy/70">
                          <span>⏰</span>
                          <span>Time: {booking.startTime} - {booking.endTime}</span>
                        </div>
                        <div className="flex items-center gap-2 text-navy/70">
                          <span>📝</span>
                          <span>Purpose: {booking.purpose}</span>
                        </div>
                        <div className="flex items-center gap-2 text-navy/70">
                          <span>👥</span>
                          <span>Attendees: {booking.attendees}</span>
                        </div>
                      </div>

                      {booking.adminResponse && (
                        <div className="mt-3 p-3 bg-white/30 rounded-xl">
                          <p className="text-sm font-semibold text-navy mb-1">Admin Response:</p>
                          <p className="text-sm text-navy/70">{booking.adminResponse}</p>
                        </div>
                      )}

                      <div className="flex items-center gap-2 mt-4 text-xs text-navy/50">
                        <span>Request Date: {booking.requestDate}</span>
                      </div>
                    </div>

                    {booking.status === 'pending' && (
                      <button
                        onClick={() => cancelBooking(booking.id)}
                        className="px-4 py-2 bg-red-500/20 text-red-600 rounded-full hover:bg-red-500/30 transition-all duration-300 font-medium text-sm"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white/40 backdrop-blur-xl rounded-2xl p-12 border border-white/50 text-center">
                <span className="text-6xl mb-4 block">📋</span>
                <h3 className="text-xl font-bold text-navy mb-2">No Booking Requests</h3>
                <p className="text-navy/60 mb-4">You haven&apos;t made any resource booking requests yet</p>
                <button
                  onClick={() => setActiveTab('browse')}
                  className="bg-gradient-to-r from-blue-500 to-orange-500 text-white px-6 py-2 rounded-full hover:from-blue-600 hover:to-orange-600 transition-all duration-300 font-semibold"
                >
                  Browse Resources
                </button>
              </div>
            )}
          </div>
        )}

        {/* Notifications */}
        {activeTab === 'notifications' && (
          <div className="space-y-4">
            {notifications.length > 0 ? (
              notifications.map(notification => (
                <div
                  key={notification.id}
                  className={`bg-white/40 backdrop-blur-xl rounded-2xl p-6 border-l-4 ${
                    notification.status === 'approved' ? 'border-green-500' : 'border-red-500'
                  } shadow-lg hover:shadow-xl transition-all duration-300`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">
                          {notification.status === 'approved' ? '✅' : '❌'}
                        </span>
                        <h3 className="font-bold text-navy text-lg">
                          Booking {notification.status === 'approved' ? 'Approved' : 'Rejected'}
                        </h3>
                      </div>
                      
                      <p className="text-navy/70 mb-3">
                        Your booking request for <strong>{notification.resourceName}</strong> on {notification.date} has been {notification.status}.
                      </p>

                      <div className="bg-white/30 rounded-xl p-3 mb-3">
                        <p className="text-sm font-semibold text-navy mb-1">Booking Details:</p>
                        <div className="grid grid-cols-2 gap-2 text-sm text-navy/70">
                          <span>📅 Date: {notification.date}</span>
                          <span>⏰ Time: {notification.startTime} - {notification.endTime}</span>
                          <span>📝 Purpose: {notification.purpose}</span>
                          <span>👥 Attendees: {notification.attendees}</span>
                        </div>
                      </div>

                      {notification.adminResponse && (
                        <div className="bg-yellow-50/50 rounded-xl p-3">
                          <p className="text-sm font-semibold text-navy mb-1">Admin Message:</p>
                          <p className="text-sm text-navy/70">{notification.adminResponse}</p>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => markNotificationAsRead(notification.id)}
                      className="px-4 py-2 bg-white/50 text-navy rounded-full hover:bg-white/70 transition-all duration-300 font-medium text-sm border border-white/50"
                    >
                      Mark as Read
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white/40 backdrop-blur-xl rounded-2xl p-12 border border-white/50 text-center">
                <span className="text-6xl mb-4 block">🔔</span>
                <h3 className="text-xl font-bold text-navy mb-2">No New Notifications</h3>
                <p className="text-navy/60">All notifications have been read</p>
              </div>
            )}
          </div>
        )}

        {/* Booking Modal */}
        {showBookingModal && selectedResource && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-navy">Book Resource</h2>
                    <p className="text-navy/60 mt-1">Submit a booking request for approval</p>
                  </div>
                  <button
                    onClick={() => {
                      setShowBookingModal(false)
                      setFormErrors({})
                      setSelectedResource(null)
                    }}
                    className="text-navy/60 hover:text-navy text-2xl"
                  >
                    ×
                  </button>
                </div>

                {/* Resource Summary */}
                <div className="bg-gradient-to-r from-blue-500/10 to-orange-500/10 rounded-xl p-4 mb-6">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-xl bg-white/50 flex items-center justify-center text-3xl">
                      {selectedResource.image}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-navy text-lg">{selectedResource.name}</h3>
                      <p className="text-sm text-navy/60">{selectedResource.location}</p>
                      <div className="flex gap-4 mt-2 text-sm text-navy/70">
                        <span>👥 Capacity: {selectedResource.capacity}</span>
                        <span>🏷️ Type: {selectedResource.type.replace('-', ' ')}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Booking Form */}
                <form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Date */}
                    <div>
                      <label className="block text-sm font-semibold text-navy mb-2">
                        Booking Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={bookingForm.date}
                        onChange={(e) => setBookingForm({...bookingForm, date: e.target.value})}
                        min={new Date().toISOString().split('T')[0]}
                        className={`w-full px-4 py-2 rounded-xl bg-white/50 border ${
                          formErrors.date ? 'border-red-500' : 'border-white/50'
                        } focus:outline-none focus:border-blue-500 transition-colors`}
                      />
                      {formErrors.date && (
                        <p className="text-red-500 text-xs mt-1">{formErrors.date}</p>
                      )}
                    </div>

                    {/* Start Time */}
                    <div>
                      <label className="block text-sm font-semibold text-navy mb-2">
                        Start Time <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="time"
                        value={bookingForm.startTime}
                        onChange={(e) => setBookingForm({...bookingForm, startTime: e.target.value})}
                        className={`w-full px-4 py-2 rounded-xl bg-white/50 border ${
                          formErrors.startTime ? 'border-red-500' : 'border-white/50'
                        } focus:outline-none focus:border-blue-500 transition-colors`}
                      />
                      {formErrors.startTime && (
                        <p className="text-red-500 text-xs mt-1">{formErrors.startTime}</p>
                      )}
                    </div>

                    {/* End Time */}
                    <div>
                      <label className="block text-sm font-semibold text-navy mb-2">
                        End Time <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="time"
                        value={bookingForm.endTime}
                        onChange={(e) => setBookingForm({...bookingForm, endTime: e.target.value})}
                        className={`w-full px-4 py-2 rounded-xl bg-white/50 border ${
                          formErrors.endTime ? 'border-red-500' : 'border-white/50'
                        } focus:outline-none focus:border-blue-500 transition-colors`}
                      />
                      {formErrors.endTime && (
                        <p className="text-red-500 text-xs mt-1">{formErrors.endTime}</p>
                      )}
                    </div>

                    {/* Number of Attendees */}
                    <div>
                      <label className="block text-sm font-semibold text-navy mb-2">
                        Number of Attendees <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        value={bookingForm.attendees}
                        onChange={(e) => setBookingForm({...bookingForm, attendees: e.target.value})}
                        min="1"
                        max={selectedResource.capacity}
                        className={`w-full px-4 py-2 rounded-xl bg-white/50 border ${
                          formErrors.attendees ? 'border-red-500' : 'border-white/50'
                        } focus:outline-none focus:border-blue-500 transition-colors`}
                        placeholder={`Max: ${selectedResource.capacity}`}
                      />
                      {formErrors.attendees && (
                        <p className="text-red-500 text-xs mt-1">{formErrors.attendees}</p>
                      )}
                    </div>

                    {/* Contact Number */}
                    <div>
                      <label className="block text-sm font-semibold text-navy mb-2">
                        Contact Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        value={bookingForm.contactNumber}
                        onChange={(e) => setBookingForm({...bookingForm, contactNumber: e.target.value})}
                        className={`w-full px-4 py-2 rounded-xl bg-white/50 border ${
                          formErrors.contactNumber ? 'border-red-500' : 'border-white/50'
                        } focus:outline-none focus:border-blue-500 transition-colors`}
                        placeholder="10-digit phone number"
                      />
                      {formErrors.contactNumber && (
                        <p className="text-red-500 text-xs mt-1">{formErrors.contactNumber}</p>
                      )}
                    </div>
                  </div>

                  {/* Purpose */}
                  <div>
                    <label className="block text-sm font-semibold text-navy mb-2">
                      Purpose of Booking <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={bookingForm.purpose}
                      onChange={(e) => setBookingForm({...bookingForm, purpose: e.target.value})}
                      className={`w-full px-4 py-2 rounded-xl bg-white/50 border ${
                        formErrors.purpose ? 'border-red-500' : 'border-white/50'
                      } focus:outline-none focus:border-blue-500 transition-colors`}
                      placeholder="e.g., Group Study, Project Meeting, Event Practice"
                    />
                    {formErrors.purpose && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.purpose}</p>
                    )}
                  </div>

                  {/* Special Requirements */}
                  <div>
                    <label className="block text-sm font-semibold text-navy mb-2">
                      Special Requirements (Optional)
                    </label>
                    <textarea
                      value={bookingForm.requirements}
                      onChange={(e) => setBookingForm({...bookingForm, requirements: e.target.value})}
                      className="w-full px-4 py-2 rounded-xl bg-white/50 border border-white/50 focus:outline-none focus:border-blue-500 transition-colors"
                      rows={3}
                      placeholder="Any special equipment or setup requirements?"
                    />
                  </div>

                  {/* Important Note */}
                  <div className="bg-yellow-50/50 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <span className="text-xl">⚠️</span>
                      <div className="text-sm text-navy/70">
                        <p className="font-semibold mb-1">Important Notes:</p>
                        <ul className="space-y-1">
                          <li>• Your booking request will be sent to admin for approval</li>
                          <li>• You will receive a notification once your request is reviewed</li>
                          <li>• Please book at least 24 hours in advance</li>
                          <li>• Ensure the resource is used responsibly and left clean</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={handleSubmitBooking}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-orange-500 text-white py-3 rounded-full hover:from-blue-600 hover:to-orange-600 transition-all duration-300 font-semibold"
                    >
                      Submit Booking Request
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowBookingModal(false)
                        setFormErrors({})
                        setSelectedResource(null)
                      }}
                      className="px-6 py-3 bg-white/50 text-navy rounded-full hover:bg-white/70 transition-all duration-300 font-semibold border border-white/50"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Info Box */}
        <div className="bg-gradient-to-br from-blue-500/10 to-orange-500/10 backdrop-blur-xl rounded-2xl p-6 border border-white/50 shadow-lg">
          <div className="flex items-start gap-4">
            <span className="text-3xl">ℹ️</span>
            <div className="flex-1">
              <h3 className="font-bold text-navy mb-3 text-lg">Resource Booking Guidelines</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-start gap-2">
                  <span className="text-navy/60">•</span>
                  <p className="text-sm text-navy/70">Book resources at least 24 hours in advance</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-navy/60">•</span>
                  <p className="text-sm text-navy/70">All bookings require admin approval</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-navy/60">•</span>
                  <p className="text-sm text-navy/70">You&apos;ll receive notifications for approval status</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-navy/60">•</span>
                  <p className="text-sm text-navy/70">Cancel bookings if your plans change</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}