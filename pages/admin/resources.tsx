import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Layout from '@/components/Layout'

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

interface BookingRequest {
  id: string
  requestedBy: string
  requestedByRole: 'student' | 'faculty'
  resourceType: 'classroom' | 'lab' | 'facility'
  resourceName: string
  purpose: string
  date: string
  startTime: string
  endTime: string
  participants?: number
  status: 'pending' | 'approved' | 'rejected'
  requestDate: string
  priority: 'low' | 'medium' | 'high'
}

export default function AdminResources() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<'resources' | 'bookings'>('resources')
  const [activeCategory, setActiveCategory] = useState<'all' | 'classroom' | 'lab' | 'equipment' | 'facility'>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingResource, setEditingResource] = useState<Resource | null>(null)
  const [notifications, setNotifications] = useState<string[]>([])
  const [showNotification, setShowNotification] = useState(false)

  const [bookingRequests, setBookingRequests] = useState<BookingRequest[]>([
    {
      id: 'b1',
      requestedBy: 'John Anderson',
      requestedByRole: 'student',
      resourceType: 'classroom',
      resourceName: 'Room 103',
      purpose: 'Group study session for upcoming exams',
      date: '2024-12-15',
      startTime: '14:00',
      endTime: '16:00',
      participants: 8,
      status: 'pending',
      requestDate: '2024-12-10',
      priority: 'medium'
    },
    {
      id: 'b2',
      requestedBy: 'Dr. Smith Johnson',
      requestedByRole: 'faculty',
      resourceType: 'lab',
      resourceName: 'Computer Lab 2',
      purpose: 'Research project on AI/ML algorithms',
      date: '2024-12-16',
      startTime: '10:00',
      endTime: '13:00',
      participants: 5,
      status: 'pending',
      requestDate: '2024-12-11',
      priority: 'high'
    },
    {
      id: 'b3',
      requestedBy: 'Emma Thompson',
      requestedByRole: 'student',
      resourceType: 'facility',
      resourceName: 'Seminar Hall',
      purpose: 'Student council meeting and event planning',
      date: '2024-12-18',
      startTime: '15:00',
      endTime: '17:00',
      participants: 50,
      status: 'pending',
      requestDate: '2024-12-09',
      priority: 'low'
    },
    {
      id: 'b4',
      requestedBy: 'Prof. Emily Davis',
      requestedByRole: 'faculty',
      resourceType: 'classroom',
      resourceName: 'Room 105',
      purpose: 'Extra tutorial session for weak students',
      date: '2024-12-17',
      startTime: '16:00',
      endTime: '18:00',
      participants: 15,
      status: 'pending',
      requestDate: '2024-12-10',
      priority: 'medium'
    },
    {
      id: 'b5',
      requestedBy: 'Oliver Martinez',
      requestedByRole: 'student',
      resourceType: 'lab',
      resourceName: 'Physics Lab',
      purpose: 'Science club experiment demonstration',
      date: '2024-12-19',
      startTime: '14:00',
      endTime: '16:00',
      participants: 20,
      status: 'pending',
      requestDate: '2024-12-11',
      priority: 'low'
    }
  ])

  const [resources, setResources] = useState<Resource[]>([
    {
      id: '1',
      name: 'Room 101',
      type: 'classroom',
      capacity: 40,
      currentOccupancy: 35,
      status: 'occupied',
      location: 'Building A, Floor 1',
      features: ['Projector', 'AC', 'Whiteboard', 'WiFi'],
      bookedBy: 'Dr. Smith Johnson',
      bookedUntil: '10:00 AM'
    },
    {
      id: '2',
      name: 'Computer Lab 1',
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
      name: 'Chemistry Lab',
      type: 'lab',
      capacity: 25,
      currentOccupancy: 20,
      status: 'occupied',
      location: 'Building C, Floor 1',
      features: ['Lab Equipment', 'Safety Gear', 'Chemical Storage', 'Fume Hood'],
      bookedBy: 'Prof. Sarah Wilson',
      bookedUntil: '12:00 PM'
    },
    {
      id: '4',
      name: 'Projector Set A',
      type: 'equipment',
      status: 'available',
      location: 'Admin Office',
      features: ['4K Resolution', 'HDMI', 'Wireless Connection'],
      nextAvailable: 'Now'
    },
    {
      id: '5',
      name: 'Auditorium',
      type: 'facility',
      capacity: 500,
      currentOccupancy: 0,
      status: 'reserved',
      location: 'Main Building',
      features: ['Stage', 'Sound System', 'AC', 'Projection Screen'],
      bookedBy: 'Student Council',
      bookedUntil: 'Friday, 5:00 PM'
    },
    {
      id: '6',
      name: 'Room 202',
      type: 'classroom',
      capacity: 35,
      currentOccupancy: 0,
      status: 'maintenance',
      location: 'Building A, Floor 2',
      features: ['Smart Board', 'AC', 'WiFi'],
      nextAvailable: 'Monday, Dec 16'
    },
    {
      id: '7',
      name: 'Sports Equipment',
      type: 'equipment',
      status: 'available',
      location: 'Sports Complex',
      features: ['Basketballs', 'Footballs', 'Volleyball Nets', 'Cricket Kits'],
      nextAvailable: 'Now'
    },
    {
      id: '8',
      name: 'Seminar Hall',
      type: 'facility',
      capacity: 100,
      currentOccupancy: 0,
      status: 'available',
      location: 'Building D, Floor 3',
      features: ['Presentation Setup', 'AC', 'WiFi', 'Video Conference'],
      nextAvailable: 'Now'
    }
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

  const filteredResources = resources.filter(resource => {
    const matchesCategory = activeCategory === 'all' || resource.type === activeCategory
    const matchesSearch = resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          resource.location.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-500'
      case 'occupied': return 'bg-orange-500'
      case 'maintenance': return 'bg-red-500'
      case 'reserved': return 'bg-blue-500'
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

  const handleStatusChange = (resourceId: string, newStatus: Resource['status']) => {
    setResources(prev => prev.map(r => 
      r.id === resourceId ? { ...r, status: newStatus } : r
    ))
  }

  const handleCapacityUpdate = (resourceId: string, newCapacity: number) => {
    setResources(prev => prev.map(r => 
      r.id === resourceId && r.capacity ? { ...r, currentOccupancy: newCapacity } : r
    ))
  }

  const handleApproveBooking = (bookingId: string) => {
    const booking = bookingRequests.find(b => b.id === bookingId)
    if (!booking) return

    setBookingRequests(prev => prev.map(b => 
      b.id === bookingId ? { ...b, status: 'approved' } : b
    ))

    // Add notification
    const notification = `✅ Approved: ${booking.resourceName} booking for ${booking.requestedBy}`
    setNotifications(prev => [...prev, notification])
    setShowNotification(true)
    
    // Update resource status
    setResources(prev => prev.map(r => {
      if (r.name === booking.resourceName) {
        return {
          ...r,
          status: 'reserved' as const,
          bookedBy: booking.requestedBy,
          bookedUntil: `${booking.date} ${booking.endTime}`
        }
      }
      return r
    }))

    setTimeout(() => setShowNotification(false), 5000)
  }

  const handleRejectBooking = (bookingId: string) => {
    const booking = bookingRequests.find(b => b.id === bookingId)
    if (!booking) return

    setBookingRequests(prev => prev.map(b => 
      b.id === bookingId ? { ...b, status: 'rejected' } : b
    ))

    // Add notification
    const notification = `❌ Rejected: ${booking.resourceName} booking for ${booking.requestedBy}`
    setNotifications(prev => [...prev, notification])
    setShowNotification(true)

    setTimeout(() => setShowNotification(false), 5000)
  }

  const pendingBookingsCount = bookingRequests.filter(b => b.status === 'pending').length

  const stats = {
    total: resources.length,
    available: resources.filter(r => r.status === 'available').length,
    occupied: resources.filter(r => r.status === 'occupied').length,
    maintenance: resources.filter(r => r.status === 'maintenance').length,
  }

  const occupancyRate = resources
    .filter(r => r.capacity && r.currentOccupancy !== undefined)
    .reduce((acc, r) => acc + ((r.currentOccupancy! / r.capacity!) * 100), 0) / 
    resources.filter(r => r.capacity).length || 0

  return (
    <Layout role="admin">
      {/* Notification Banner */}
      {showNotification && notifications.length > 0 && (
        <div className="fixed top-4 right-4 z-50 bg-white/90 backdrop-blur-xl rounded-xl shadow-2xl p-4 border border-white/50 max-w-sm animate-pulse">
          <p className="text-navy font-semibold">Notification</p>
          <p className="text-sm text-navy/70 mt-1">{notifications[notifications.length - 1]}</p>
        </div>
      )}

      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-navy">Resource Management</h1>
            <p className="text-navy/70 mt-2">Manage campus resources and booking requests</p>
          </div>
          <div className="flex items-center gap-4">
            {pendingBookingsCount > 0 && (
              <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-2 rounded-xl shadow-lg animate-pulse">
                <p className="text-sm">Pending Bookings</p>
                <p className="text-xl font-bold">{pendingBookingsCount}</p>
              </div>
            )}
            {activeTab === 'resources' && (
              <button className="bg-gradient-to-r from-blue-500 to-orange-500 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-orange-600 transition-all duration-300 font-semibold shadow-md hover:shadow-lg">
                + Add Resource
              </button>
            )}
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-white/50 backdrop-blur rounded-xl p-1 border border-white/50 max-w-md">
          <button
            onClick={() => setActiveTab('resources')}
            className={`flex-1 px-4 py-2 rounded-lg transition-all duration-300 font-medium ${
              activeTab === 'resources'
                ? 'bg-gradient-to-r from-blue-500 to-orange-500 text-white'
                : 'text-navy hover:bg-white/30'
            }`}
          >
            Resources Overview
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`flex-1 px-4 py-2 rounded-lg transition-all duration-300 font-medium relative ${
              activeTab === 'bookings'
                ? 'bg-gradient-to-r from-blue-500 to-orange-500 text-white'
                : 'text-navy hover:bg-white/30'
            }`}
          >
            Booking Requests
            {pendingBookingsCount > 0 && activeTab !== 'bookings' && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {pendingBookingsCount}
              </span>
            )}
          </button>
        </div>

        {activeTab === 'resources' ? (
          <>
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-white/40 backdrop-blur-xl rounded-xl p-4 border border-white/50">
            <p className="text-sm text-navy/60">Total Resources</p>
            <p className="text-2xl font-bold text-navy">{stats.total}</p>
          </div>
          <div className="bg-white/40 backdrop-blur-xl rounded-xl p-4 border border-white/50">
            <p className="text-sm text-navy/60">Available</p>
            <p className="text-2xl font-bold text-green-600">{stats.available}</p>
          </div>
          <div className="bg-white/40 backdrop-blur-xl rounded-xl p-4 border border-white/50">
            <p className="text-sm text-navy/60">Occupied</p>
            <p className="text-2xl font-bold text-orange-600">{stats.occupied}</p>
          </div>
          <div className="bg-white/40 backdrop-blur-xl rounded-xl p-4 border border-white/50">
            <p className="text-sm text-navy/60">Maintenance</p>
            <p className="text-2xl font-bold text-red-600">{stats.maintenance}</p>
          </div>
          <div className="bg-white/40 backdrop-blur-xl rounded-xl p-4 border border-white/50">
            <p className="text-sm text-navy/60">Occupancy Rate</p>
            <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-orange-600 bg-clip-text text-transparent">
              {occupancyRate.toFixed(1)}%
            </p>
          </div>
        </div>

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
                onClick={() => setActiveCategory(category as any)}
                className={`px-4 py-2 rounded-lg transition-all duration-300 font-medium capitalize ${
                  activeCategory === category
                    ? 'bg-gradient-to-r from-blue-500 to-orange-500 text-white'
                    : 'text-navy hover:bg-white/30'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Resource Grid */}
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
                <div className="mb-4">
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
                <div className="mb-4">
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
                  <p className="text-xs text-navy/60">Booked by</p>
                  <p className="text-sm text-navy font-medium">{resource.bookedBy}</p>
                  {resource.bookedUntil && (
                    <p className="text-xs text-navy/60 mt-1">Until: {resource.bookedUntil}</p>
                  )}
                </div>
              )}

              {resource.nextAvailable && resource.status === 'available' && (
                <div className="bg-green-50/50 rounded-lg p-2 mb-3">
                  <p className="text-xs text-navy/60">Available</p>
                  <p className="text-sm text-green-600 font-medium">{resource.nextAvailable}</p>
                </div>
              )}

              <div className="flex gap-2">
                {resource.status === 'occupied' && resource.capacity && (
                  <button className="flex-1 bg-blue-500 text-white text-sm px-3 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                    Update Capacity
                  </button>
                )}
                {resource.status === 'available' && (
                  <button className="flex-1 bg-gradient-to-r from-blue-500 to-orange-500 text-white text-sm px-3 py-2 rounded-lg hover:from-blue-600 hover:to-orange-600 transition-colors">
                    Reserve
                  </button>
                )}
                {resource.status === 'maintenance' && (
                  <button className="flex-1 bg-green-500 text-white text-sm px-3 py-2 rounded-lg hover:bg-green-600 transition-colors">
                    Mark Available
                  </button>
                )}
                <button className="px-3 py-2 bg-white/50 text-navy text-sm rounded-lg hover:bg-white/70 transition-colors">
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-r from-blue-500/10 to-orange-500/10 backdrop-blur-xl rounded-2xl p-6 border border-white/50">
              <h3 className="text-lg font-semibold text-navy mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <button className="bg-white/50 backdrop-blur text-navy px-4 py-3 rounded-xl hover:bg-white/70 transition-all duration-300 font-medium border border-white/50 text-sm">
                  📊 Generate Report
                </button>
                <button className="bg-white/50 backdrop-blur text-navy px-4 py-3 rounded-xl hover:bg-white/70 transition-all duration-300 font-medium border border-white/50 text-sm">
                  🔧 Schedule Maintenance
                </button>
                <button className="bg-white/50 backdrop-blur text-navy px-4 py-3 rounded-xl hover:bg-white/70 transition-all duration-300 font-medium border border-white/50 text-sm">
                  📧 Send Notifications
                </button>
                <button className="bg-white/50 backdrop-blur text-navy px-4 py-3 rounded-xl hover:bg-white/70 transition-all duration-300 font-medium border border-white/50 text-sm">
                  📥 Import Resources
                </button>
              </div>
            </div>
          </>
        ) : (
          /* Booking Requests Tab */
          <>
            {/* Booking Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white/40 backdrop-blur-xl rounded-xl p-4 border border-white/50">
                <p className="text-sm text-navy/60">Total Requests</p>
                <p className="text-2xl font-bold text-navy">{bookingRequests.length}</p>
              </div>
              <div className="bg-white/40 backdrop-blur-xl rounded-xl p-4 border border-white/50">
                <p className="text-sm text-navy/60">Pending</p>
                <p className="text-2xl font-bold text-orange-600">{pendingBookingsCount}</p>
              </div>
              <div className="bg-white/40 backdrop-blur-xl rounded-xl p-4 border border-white/50">
                <p className="text-sm text-navy/60">Approved</p>
                <p className="text-2xl font-bold text-green-600">
                  {bookingRequests.filter(b => b.status === 'approved').length}
                </p>
              </div>
              <div className="bg-white/40 backdrop-blur-xl rounded-xl p-4 border border-white/50">
                <p className="text-sm text-navy/60">Rejected</p>
                <p className="text-2xl font-bold text-red-600">
                  {bookingRequests.filter(b => b.status === 'rejected').length}
                </p>
              </div>
            </div>

            {/* Booking Request Cards */}
            <div className="space-y-4">
              {bookingRequests.map((request) => (
                <div key={request.id} className="bg-white/40 backdrop-blur-xl rounded-2xl p-6 border border-white/50 shadow-lg">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-start gap-4">
                      <div className="text-3xl">
                        {request.requestedByRole === 'student' ? '👨‍🎓' : '👨‍🏫'}
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold text-navy">
                            {request.resourceName} Booking Request
                          </h3>
                          <span className={`px-3 py-1 rounded-full text-white text-xs font-semibold bg-gradient-to-r ${
                            request.priority === 'high' ? 'from-red-500 to-orange-500' :
                            request.priority === 'medium' ? 'from-yellow-500 to-orange-500' :
                            'from-green-500 to-blue-500'
                          }`}>
                            {request.priority.toUpperCase()}
                          </span>
                          {request.status !== 'pending' && (
                            <span className={`px-3 py-1 rounded-full text-white text-xs font-semibold ${
                              request.status === 'approved' ? 'bg-green-500' : 'bg-red-500'
                            }`}>
                              {request.status.toUpperCase()}
                            </span>
                          )}
                        </div>
                        <p className="text-navy/70 text-sm mb-1">
                          Requested by: <span className="font-semibold">{request.requestedBy}</span>
                          <span className="ml-2 px-2 py-0.5 bg-white/50 rounded text-xs">
                            {request.requestedByRole === 'student' ? 'Student' : 'Faculty'}
                          </span>
                        </p>
                        <p className="text-navy/70 text-sm">
                          Request Date: {request.requestDate}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-navy">{request.date}</p>
                      <p className="text-xs text-navy/60">{request.startTime} - {request.endTime}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="bg-white/30 rounded-lg p-3">
                      <p className="text-xs text-navy/60 mb-1">Resource Type</p>
                      <p className="text-navy font-medium capitalize">{request.resourceType}</p>
                    </div>
                    {request.participants && (
                      <div className="bg-white/30 rounded-lg p-3">
                        <p className="text-xs text-navy/60 mb-1">Expected Participants</p>
                        <p className="text-navy font-medium">{request.participants} people</p>
                      </div>
                    )}
                  </div>

                  <div className="bg-gradient-to-r from-blue-50/50 to-orange-50/50 rounded-lg p-3 mb-4">
                    <p className="text-xs text-navy/60 mb-1">Purpose</p>
                    <p className="text-navy">{request.purpose}</p>
                  </div>

                  {request.status === 'pending' && (
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleApproveBooking(request.id)}
                        className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 text-white py-2 px-4 rounded-xl hover:from-green-600 hover:to-blue-600 transition-all duration-300 font-semibold shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                      >
                        <span>✅</span> Approve Booking
                      </button>
                      <button
                        onClick={() => handleRejectBooking(request.id)}
                        className="flex-1 bg-gradient-to-r from-red-500 to-orange-500 text-white py-2 px-4 rounded-xl hover:from-red-600 hover:to-orange-600 transition-all duration-300 font-semibold shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                      >
                        <span>❌</span> Reject Request
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </Layout>
  )
}