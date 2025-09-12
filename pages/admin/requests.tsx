import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Layout from '@/components/Layout'

interface Request {
  id: string
  type: 'reschedule' | 'extra_lecture' | 'cancel_lecture'
  requestedBy: string
  requestedByRole: 'faculty'
  subject?: string
  currentTime?: string
  proposedTime?: string
  room?: string
  reason: string
  affectedStudents?: number
  status: 'pending' | 'approved' | 'rejected'
  date: string
  priority: 'low' | 'medium' | 'high'
}

export default function AdminRequests() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<'all' | 'reschedule' | 'extra' | 'cancel'>('all')
  const [requests, setRequests] = useState<Request[]>([
    {
      id: '1',
      type: 'reschedule',
      requestedBy: 'Dr. Smith Johnson',
      requestedByRole: 'faculty',
      subject: 'Computer Science',
      currentTime: 'Monday, 9:00-10:00',
      proposedTime: 'Tuesday, 11:00-12:00',
      room: 'Room 101',
      reason: 'Conference attendance on Monday',
      affectedStudents: 35,
      status: 'pending',
      date: '2024-12-10',
      priority: 'high'
    },
    {
      id: '2',
      type: 'extra_lecture',
      requestedBy: 'Prof. Emily Davis',
      requestedByRole: 'faculty',
      subject: 'Mathematics',
      proposedTime: 'Friday, 4:00-5:00',
      room: 'Room 201',
      reason: 'Additional practice session before exams',
      affectedStudents: 28,
      status: 'pending',
      date: '2024-12-11',
      priority: 'medium'
    },
    {
      id: '3',
      type: 'cancel_lecture',
      requestedBy: 'Dr. Michael Brown',
      requestedByRole: 'faculty',
      subject: 'Physics Lab',
      currentTime: 'Thursday, 2:00-4:00',
      room: 'Lab 301',
      reason: 'Equipment maintenance required',
      affectedStudents: 30,
      status: 'pending',
      date: '2024-12-12',
      priority: 'high'
    },
    {
      id: '4',
      type: 'reschedule',
      requestedBy: 'Prof. Sarah Wilson',
      requestedByRole: 'faculty',
      subject: 'Chemistry',
      currentTime: 'Wednesday, 10:00-11:00',
      proposedTime: 'Wednesday, 3:00-4:00',
      room: 'Lab 302',
      reason: 'Lab equipment delivery delay in morning',
      affectedStudents: 25,
      status: 'pending',
      date: '2024-12-11',
      priority: 'medium'
    },
    {
      id: '5',
      type: 'extra_lecture',
      requestedBy: 'Dr. Robert Taylor',
      requestedByRole: 'faculty',
      subject: 'Database Management',
      proposedTime: 'Saturday, 10:00-12:00',
      room: 'Computer Lab 1',
      reason: 'Project submission guidance and doubt clearing session',
      affectedStudents: 40,
      status: 'pending',
      date: '2024-12-14',
      priority: 'low'
    }
  ])

  const [notifications, setNotifications] = useState<string[]>([])
  const [showNotification, setShowNotification] = useState(false)

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

  const handleApprove = (requestId: string) => {
    const request = requests.find(r => r.id === requestId)
    if (!request) return

    setRequests(prev => prev.map(r => 
      r.id === requestId ? { ...r, status: 'approved' } : r
    ))

    // Add notification
    const notification = `✅ Approved: ${request.type.replace('_', ' ')} request from ${request.requestedBy}`
    setNotifications(prev => [...prev, notification])
    setShowNotification(true)
    
    // Auto-update timetable simulation
    console.log('Updating timetable automatically...')
    console.log(`Notifying ${request.affectedStudents} students about the change`)

    setTimeout(() => setShowNotification(false), 5000)
  }

  const handleReject = (requestId: string) => {
    const request = requests.find(r => r.id === requestId)
    if (!request) return

    setRequests(prev => prev.map(r => 
      r.id === requestId ? { ...r, status: 'rejected' } : r
    ))

    // Add notification
    const notification = `❌ Rejected: ${request.type.replace('_', ' ')} request from ${request.requestedBy}`
    setNotifications(prev => [...prev, notification])
    setShowNotification(true)

    setTimeout(() => setShowNotification(false), 5000)
  }

  const filteredRequests = requests.filter(request => {
    if (activeTab === 'all') return true
    if (activeTab === 'reschedule') return request.type === 'reschedule'
    if (activeTab === 'extra') return request.type === 'extra_lecture'
    if (activeTab === 'cancel') return request.type === 'cancel_lecture'
    return true
  })

  const pendingCount = requests.filter(r => r.status === 'pending').length

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'reschedule': return '🔄'
      case 'extra_lecture': return '➕'
      case 'cancel_lecture': return '❌'
      default: return '📋'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'from-red-500 to-orange-500'
      case 'medium': return 'from-yellow-500 to-orange-500'
      case 'low': return 'from-green-500 to-blue-500'
      default: return 'from-gray-500 to-gray-600'
    }
  }

  return (
    <Layout role="admin">
      {/* Notification Banner */}
      {showNotification && notifications.length > 0 && (
        <div className="fixed top-4 right-4 z-50 bg-white/90 backdrop-blur-xl rounded-xl shadow-2xl p-4 border border-white/50 max-w-sm animate-pulse">
          <p className="text-navy font-semibold">Recent Notification</p>
          <p className="text-sm text-navy/70 mt-1">{notifications[notifications.length - 1]}</p>
        </div>
      )}

      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-navy">Faculty Requests & Approvals</h1>
            <p className="text-navy/70 mt-2">Manage lecture scheduling requests from faculty</p>
          </div>
          <div className="bg-gradient-to-r from-blue-500 to-orange-500 text-white px-6 py-3 rounded-xl shadow-lg">
            <p className="text-sm">Pending Requests</p>
            <p className="text-2xl font-bold">{pendingCount}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex bg-white/50 backdrop-blur rounded-xl p-1 border border-white/50">
          <button
            onClick={() => setActiveTab('all')}
            className={`flex-1 px-4 py-2 rounded-lg transition-all duration-300 font-medium ${
              activeTab === 'all'
                ? 'bg-gradient-to-r from-blue-500 to-orange-500 text-white'
                : 'text-navy hover:bg-white/30'
            }`}
          >
            All Requests
          </button>
          <button
            onClick={() => setActiveTab('reschedule')}
            className={`flex-1 px-4 py-2 rounded-lg transition-all duration-300 font-medium ${
              activeTab === 'reschedule'
                ? 'bg-gradient-to-r from-blue-500 to-orange-500 text-white'
                : 'text-navy hover:bg-white/30'
            }`}
          >
            Reschedule
          </button>
          <button
            onClick={() => setActiveTab('extra')}
            className={`flex-1 px-4 py-2 rounded-lg transition-all duration-300 font-medium ${
              activeTab === 'extra'
                ? 'bg-gradient-to-r from-blue-500 to-orange-500 text-white'
                : 'text-navy hover:bg-white/30'
            }`}
          >
            Extra Lectures
          </button>
          <button
            onClick={() => setActiveTab('cancel')}
            className={`flex-1 px-4 py-2 rounded-lg transition-all duration-300 font-medium ${
              activeTab === 'cancel'
                ? 'bg-gradient-to-r from-blue-500 to-orange-500 text-white'
                : 'text-navy hover:bg-white/30'
            }`}
          >
            Cancellations
          </button>
        </div>

        {/* Request Cards */}
        <div className="space-y-4">
          {filteredRequests.map((request) => (
            <div key={request.id} className="bg-white/40 backdrop-blur-xl rounded-2xl p-6 border border-white/50 shadow-lg">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-start gap-4">
                  <div className="text-3xl">{getTypeIcon(request.type)}</div>
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-navy">
                        {request.type.replace('_', ' ').charAt(0).toUpperCase() + request.type.replace('_', ' ').slice(1)}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-white text-xs font-semibold bg-gradient-to-r ${getPriorityColor(request.priority)}`}>
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
                    <p className="text-navy/70 text-sm mb-3">
                      Faculty: <span className="font-semibold">{request.requestedBy}</span>
                    </p>
                  </div>
                </div>
                <p className="text-sm text-navy/60">{request.date}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {request.subject && (
                  <div className="bg-white/30 rounded-lg p-3">
                    <p className="text-xs text-navy/60 mb-1">Subject</p>
                    <p className="text-navy font-medium">{request.subject}</p>
                  </div>
                )}
                {request.currentTime && (
                  <div className="bg-white/30 rounded-lg p-3">
                    <p className="text-xs text-navy/60 mb-1">Current Time</p>
                    <p className="text-navy font-medium">{request.currentTime}</p>
                  </div>
                )}
                {request.proposedTime && (
                  <div className="bg-white/30 rounded-lg p-3">
                    <p className="text-xs text-navy/60 mb-1">Proposed Time</p>
                    <p className="text-navy font-medium">{request.proposedTime}</p>
                  </div>
                )}
                {request.room && (
                  <div className="bg-white/30 rounded-lg p-3">
                    <p className="text-xs text-navy/60 mb-1">Room/Location</p>
                    <p className="text-navy font-medium">{request.room}</p>
                  </div>
                )}
              </div>

              <div className="bg-gradient-to-r from-blue-50/50 to-orange-50/50 rounded-lg p-3 mb-4">
                <p className="text-xs text-navy/60 mb-1">Reason</p>
                <p className="text-navy">{request.reason}</p>
              </div>

              {request.affectedStudents && (
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-sm text-navy/60">Affected Students:</span>
                  <span className="font-semibold text-navy">{request.affectedStudents}</span>
                </div>
              )}

              {request.status === 'pending' && (
                <div className="flex gap-3">
                  <button
                    onClick={() => handleApprove(request.id)}
                    className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 text-white py-2 px-4 rounded-xl hover:from-green-600 hover:to-blue-600 transition-all duration-300 font-semibold shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                  >
                    <span>✅</span> Approve & Update Timetable
                  </button>
                  <button
                    onClick={() => handleReject(request.id)}
                    className="flex-1 bg-gradient-to-r from-red-500 to-orange-500 text-white py-2 px-4 rounded-xl hover:from-red-600 hover:to-orange-600 transition-all duration-300 font-semibold shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                  >
                    <span>❌</span> Reject Request
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white/40 backdrop-blur-xl rounded-xl p-4 border border-white/50">
            <p className="text-sm text-navy/60">Total Requests</p>
            <p className="text-2xl font-bold text-navy">{requests.length}</p>
          </div>
          <div className="bg-white/40 backdrop-blur-xl rounded-xl p-4 border border-white/50">
            <p className="text-sm text-navy/60">Pending</p>
            <p className="text-2xl font-bold text-orange-600">{pendingCount}</p>
          </div>
          <div className="bg-white/40 backdrop-blur-xl rounded-xl p-4 border border-white/50">
            <p className="text-sm text-navy/60">Approved Today</p>
            <p className="text-2xl font-bold text-green-600">
              {requests.filter(r => r.status === 'approved').length}
            </p>
          </div>
          <div className="bg-white/40 backdrop-blur-xl rounded-xl p-4 border border-white/50">
            <p className="text-sm text-navy/60">Rejected Today</p>
            <p className="text-2xl font-bold text-red-600">
              {requests.filter(r => r.status === 'rejected').length}
            </p>
          </div>
        </div>
      </div>
    </Layout>
  )
}