import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Layout from '@/components/Layout'
import ResourceBookingModal from '@/components/ResourceBookingModal'

interface Resource {
  id: string
  name: string
  type: 'classroom' | 'lab' | 'equipment' | 'facility'
  capacity?: number
  currentOccupancy?: number
  status: 'available' | 'occupied' | 'maintenance' | 'reserved'
  location: string
  features: string[]
  nextAvailable?: string
  bookedBy?: string
  bookedUntil?: string
}

interface MyBooking {
  id: string
  resourceName: string
  resourceType: string
  date: string
  startTime: string
  endTime: string
  purpose: string
  status: 'upcoming' | 'active' | 'completed' | 'cancelled'
  room: string
}

export default function FacultyResources() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<'available' | 'mybookings'>('available')
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'classroom' | 'lab' | 'equipment' | 'facility'>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null)
  const [showNotification, setShowNotification] = useState(false)
  const [notificationMessage, setNotificationMessage] = useState('')

  const [resources] = useState<Resource[]>([
    {
      id: '1',
      name: 'Room 103',
      type: 'classroom',
      capacity: 40,
      currentOccupancy: 0,
      status: 'available',
      location: 'Building A, Floor 1',
      features: ['Projector', 'AC', 'Whiteboard', 'WiFi'],
      nextAvailable: 'Now'
    },
    {
      id: '2',
      name: 'Computer Lab 2',
      type: 'lab',
      capacity: 30,
      currentOccupancy: 0,
      status: 'available',
      location: 'Building B, Floor 2',
      features: ['30 Computers', 'AC', 'Projector', 'Software: VS Code, Python'],
      nextAvailable: 'Now'
    },
    {
      id: '3',
      name: 'Physics Lab',
      type: 'lab',
      capacity: 25,
      currentOccupancy: 20,
      status: 'occupied',
      location: 'Building C, Floor 1',
      features: ['Lab Equipment', 'Safety Gear', 'Chemical Storage'],
      bookedBy: 'Dr. Michael Brown',
      bookedUntil: '12:00 PM'
    },
    {
      id: '4',
      name: 'Projector Set B',
      type: 'equipment',
      status: 'available',
      location: 'Faculty Lounge',
      features: ['4K Resolution', 'HDMI', 'Wireless Connection', 'Portable'],
      nextAvailable: 'Now'
    },
    {
      id: '5',
      name: 'Seminar Hall',
      type: 'facility',
      capacity: 100,
      currentOccupancy: 0,
      status: 'available',
      location: 'Building D, Floor 3',
      features: ['Presentation Setup', 'AC', 'WiFi', 'Video Conference'],
      nextAvailable: 'Now'
    },
    {
      id: '6',
      name: 'Room 205',
      type: 'classroom',
      capacity: 35,
      currentOccupancy: 0,
      status: 'available',
      location: 'Building A, Floor 2',
      features: ['Smart Board', 'AC', 'WiFi'],
      nextAvailable: 'Now'
    },
    {
      id: '7',
      name: 'Conference Room',
      type: 'facility',
      capacity: 20,
      currentOccupancy: 0,
      status: 'reserved',
      location: 'Admin Building, Floor 2',
      features: ['Video Conference', 'Whiteboard', 'AC', 'Coffee Machine'],
      bookedBy: 'Faculty Meeting',
      bookedUntil: 'Friday, 5:00 PM'
    },
    {
      id: '8',
      name: 'Laptop Cart',
      type: 'equipment',
      status: 'available',
      location: 'IT Department',
      features: ['20 Laptops', 'Charging Station', 'Windows 11', 'MS Office'],
      nextAvailable: 'Now'
    }
  ])

  const [myBookings] = useState<MyBooking[]>([
    {
      id: 'b1',
      resourceName: 'Room 101',
      resourceType: 'classroom',
      date: '2024-12-15',
      startTime: '14:00',
      endTime: '16:00',
      purpose: 'Extra Tutorial Session',
      status: 'upcoming',
      room: 'Building A, Floor 1'
    },
    {
      id: 'b2',
      resourceName: 'Computer Lab 1',
      resourceType: 'lab',
      date: '2024-12-14',
      startTime: '10:00',
      endTime: '12:00',
      purpose: 'Programming Workshop',
      status: 'upcoming',
      room: 'Building B, Floor 2'
    },
    {
      id: 'b3',
      resourceName: 'Seminar Hall',
      resourceType: 'facility',
      date: '2024-12-12',
      startTime: '15:00',
      endTime: '17:00',
      purpose: 'Guest Lecture on AI',
      status: 'completed',
      room: 'Building D, Floor 3'
    },
    {
      id: 'b4',
      resourceName: 'Projector Set A',
      resourceType: 'equipment',
      date: '2024-12-13',
      startTime: '09:00',
      endTime: '10:00',
      purpose: 'Class Presentation',
      status: 'active',
      room: 'Room 101'
    }
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

  const filteredResources = resources.filter(resource => {
    const matchesCategory = selectedCategory === 'all' || resource.type === selectedCategory
    const matchesSearch = resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          resource.location.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const availableResources = filteredResources.filter(r => r.status === 'available')

  const handleBookResource = (resource: Resource) => {
    setSelectedResource(resource)
    setShowBookingModal(true)
  }

  const handleBookingSubmit = (bookingData: any) => {
    // Here you would normally send the booking request to the backend
    console.log('Booking submitted:', bookingData)
    
    setNotificationMessage(`Booking request for ${selectedResource?.name} has been sent for approval`)
    setShowNotification(true)
    setTimeout(() => setShowNotification(false), 5000)
    
    setShowBookingModal(false)
    setSelectedResource(null)
  }

  const handleCancelBooking = (bookingId: string) => {
    if (confirm('Are you sure you want to cancel this booking?')) {
      setNotificationMessage('Booking cancelled successfully')
      setShowNotification(true)
      setTimeout(() => setShowNotification(false), 3000)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-500'
      case 'occupied': return 'bg-orange-500'
      case 'maintenance': return 'bg-red-500'
      case 'reserved': return 'bg-blue-500'
      default: return 'bg-gray-500'
    }
  }

  const getBookingStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-500'
      case 'active': return 'bg-green-500'
      case 'completed': return 'bg-gray-500'
      case 'cancelled': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'classroom': return '🏫'
      case 'lab': return '🔬'
      case 'equipment': return '🎒'
      case 'facility': return '🏢'
      default: return '📦'
    }
  }

  return (
    <Layout role="faculty">
      {/* Notification */}
      {showNotification && (
        <div className="fixed top-4 right-4 z-50 bg-white/90 backdrop-blur-xl rounded-xl shadow-2xl p-4 border border-white/50 max-w-sm animate-pulse">
          <p className="text-navy font-semibold">Notification</p>
          <p className="text-sm text-navy/70 mt-1">{notificationMessage}</p>
        </div>
      )}

      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-navy">Resource Management</h1>
            <p className="text-navy/70 mt-2">Book classrooms, labs, and equipment for your classes</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-navy/60">Available Resources</p>
            <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-orange-600 bg-clip-text text-transparent">
              {availableResources.length}/{resources.length}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex bg-white/50 backdrop-blur rounded-xl p-1 border border-white/50 max-w-md">
          <button
            onClick={() => setActiveTab('available')}
            className={`flex-1 px-4 py-2 rounded-lg transition-all duration-300 font-medium ${
              activeTab === 'available'
                ? 'bg-gradient-to-r from-blue-500 to-orange-500 text-white'
                : 'text-navy hover:bg-white/30'
            }`}
          >
            Available Resources
          </button>
          <button
            onClick={() => setActiveTab('mybookings')}
            className={`flex-1 px-4 py-2 rounded-lg transition-all duration-300 font-medium ${
              activeTab === 'mybookings'
                ? 'bg-gradient-to-r from-blue-500 to-orange-500 text-white'
                : 'text-navy hover:bg-white/30'
            }`}
          >
            My Bookings
          </button>
        </div>

        {activeTab === 'available' ? (
          <>
            {/* Search and Filter */}
            <div className="flex gap-4 flex-col md:flex-row">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search resources by name or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 bg-white/60 backdrop-blur border border-white/50 rounded-xl text-navy placeholder-navy/50 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div className="flex bg-white/50 backdrop-blur rounded-xl p-1 border border-white/50">
                {['all', 'classroom', 'lab', 'equipment', 'facility'].map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category as any)}
                    className={`px-4 py-2 rounded-lg transition-all duration-300 font-medium capitalize ${
                      selectedCategory === category
                        ? 'bg-gradient-to-r from-blue-500 to-orange-500 text-white'
                        : 'text-navy hover:bg-white/30'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Resources Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources.map((resource) => (
                <div key={resource.id} className="bg-white/40 backdrop-blur-xl rounded-2xl p-6 border border-white/50 shadow-lg hover:scale-105 transition-all duration-300">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-start gap-3">
                      <div className="text-3xl">{getTypeIcon(resource.type)}</div>
                      <div>
                        <h3 className="text-xl font-semibold text-navy">{resource.name}</h3>
                        <p className="text-sm text-navy/60">{resource.location}</p>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-white text-xs font-semibold ${getStatusColor(resource.status)}`}>
                      {resource.status.toUpperCase()}
                    </div>
                  </div>

                  {resource.capacity && (
                    <div className="mb-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-navy/60">Capacity</span>
                        <span className="text-navy font-medium">
                          {resource.currentOccupancy || 0}/{resource.capacity}
                        </span>
                      </div>
                      <div className="h-2 bg-gray-200/50 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-blue-500 to-orange-500 rounded-full transition-all duration-300"
                          style={{ width: `${((resource.currentOccupancy || 0) / resource.capacity) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {resource.features && (
                    <div className="mb-3">
                      <p className="text-xs text-navy/60 mb-2">Features</p>
                      <div className="flex flex-wrap gap-1">
                        {resource.features.slice(0, 3).map((feature, index) => (
                          <span key={index} className="px-2 py-1 bg-white/50 rounded text-xs text-navy">
                            {feature}
                          </span>
                        ))}
                        {resource.features.length > 3 && (
                          <span className="px-2 py-1 bg-white/50 rounded text-xs text-navy">
                            +{resource.features.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {resource.bookedBy && (
                    <div className="bg-gradient-to-r from-blue-50/50 to-orange-50/50 rounded-lg p-2 mb-3">
                      <p className="text-xs text-navy/60">Currently booked by</p>
                      <p className="text-sm text-navy font-medium">{resource.bookedBy}</p>
                      {resource.bookedUntil && (
                        <p className="text-xs text-navy/60 mt-1">Until: {resource.bookedUntil}</p>
                      )}
                    </div>
                  )}

                  {resource.status === 'available' ? (
                    <button 
                      onClick={() => handleBookResource(resource)}
                      className="w-full bg-gradient-to-r from-blue-500 to-orange-500 text-white py-2 px-4 rounded-lg hover:from-blue-600 hover:to-orange-600 transition-all duration-300 font-medium"
                    >
                      Book Now
                    </button>
                  ) : (
                    <button disabled className="w-full bg-gray-300/50 text-gray-500 py-2 px-4 rounded-lg font-medium cursor-not-allowed">
                      Not Available
                    </button>
                  )}
                </div>
              ))}
            </div>
          </>
        ) : (
          /* My Bookings Tab */
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {myBookings.map((booking) => (
                <div key={booking.id} className="bg-white/40 backdrop-blur-xl rounded-2xl p-6 border border-white/50 shadow-lg">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-navy">{booking.resourceName}</h3>
                      <p className="text-sm text-navy/60">{booking.room}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-white text-xs font-semibold ${getBookingStatusColor(booking.status)}`}>
                      {booking.status.toUpperCase()}
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-navy/60">Date:</span>
                      <span className="text-sm text-navy font-medium">{booking.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-navy/60">Time:</span>
                      <span className="text-sm text-navy font-medium">{booking.startTime} - {booking.endTime}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-navy/60">Type:</span>
                      <span className="text-sm text-navy font-medium capitalize">{booking.resourceType}</span>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-blue-50/50 to-orange-50/50 rounded-lg p-3 mb-4">
                    <p className="text-xs text-navy/60 mb-1">Purpose</p>
                    <p className="text-sm text-navy">{booking.purpose}</p>
                  </div>

                  {(booking.status === 'upcoming' || booking.status === 'active') && (
                    <div className="flex gap-2">
                      {booking.status === 'upcoming' && (
                        <button 
                          onClick={() => handleCancelBooking(booking.id)}
                          className="flex-1 bg-red-500 text-white text-sm px-3 py-2 rounded-lg hover:bg-red-600 transition-colors"
                        >
                          Cancel Booking
                        </button>
                      )}
                      <button className="flex-1 bg-blue-500 text-white text-sm px-3 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                        View Details
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {myBookings.length === 0 && (
              <div className="text-center py-12">
                <p className="text-navy/60">No bookings found</p>
              </div>
            )}
          </>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white/40 backdrop-blur-xl rounded-xl p-4 border border-white/50">
            <p className="text-sm text-navy/60">Total Resources</p>
            <p className="text-2xl font-bold text-navy">{resources.length}</p>
          </div>
          <div className="bg-white/40 backdrop-blur-xl rounded-xl p-4 border border-white/50">
            <p className="text-sm text-navy/60">Available Now</p>
            <p className="text-2xl font-bold text-green-600">{availableResources.length}</p>
          </div>
          <div className="bg-white/40 backdrop-blur-xl rounded-xl p-4 border border-white/50">
            <p className="text-sm text-navy/60">My Active Bookings</p>
            <p className="text-2xl font-bold text-blue-600">
              {myBookings.filter(b => b.status === 'upcoming' || b.status === 'active').length}
            </p>
          </div>
          <div className="bg-white/40 backdrop-blur-xl rounded-xl p-4 border border-white/50">
            <p className="text-sm text-navy/60">Completed Bookings</p>
            <p className="text-2xl font-bold text-gray-600">
              {myBookings.filter(b => b.status === 'completed').length}
            </p>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <ResourceBookingModal
        isOpen={showBookingModal}
        onClose={() => {
          setShowBookingModal(false)
          setSelectedResource(null)
        }}
        onSubmit={handleBookingSubmit}
        resource={selectedResource}
      />
    </Layout>
  )
}