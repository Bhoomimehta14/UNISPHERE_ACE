import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Layout from '@/components/Layout'
import AssignmentModal from '@/components/AssignmentModal'

interface Assignment {
  id: string
  title: string
  subject: string
  class: string
  description: string
  dueDate: string
  createdDate: string
  totalMarks: number
  status: 'active' | 'past_due' | 'graded'
  submittedCount: number
  totalStudents: number
  attachments?: string[]
  type: 'homework' | 'project' | 'lab' | 'quiz'
  priority: 'low' | 'medium' | 'high'
}

export default function FacultyAssignments() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<'active' | 'past_due' | 'graded'>('active')
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null)
  const [showNotification, setShowNotification] = useState(false)
  const [notificationMessage, setNotificationMessage] = useState('')

  const [assignments, setAssignments] = useState<Assignment[]>([
    {
      id: '1',
      title: 'Data Structures Implementation',
      subject: 'Data Structures',
      class: 'CS-2B',
      description: 'Implement linked list, stack, and queue in Python with all basic operations',
      dueDate: '2024-12-20',
      createdDate: '2024-12-10',
      totalMarks: 100,
      status: 'active',
      submittedCount: 25,
      totalStudents: 40,
      type: 'homework',
      priority: 'high',
      attachments: ['assignment_sheet.pdf', 'sample_code.py']
    },
    {
      id: '2',
      title: 'Database Design Project',
      subject: 'Database Management',
      class: 'CS-4A',
      description: 'Design a complete database schema for an e-commerce platform',
      dueDate: '2024-12-25',
      createdDate: '2024-12-08',
      totalMarks: 150,
      status: 'active',
      submittedCount: 18,
      totalStudents: 30,
      type: 'project',
      priority: 'high',
      attachments: ['project_guidelines.pdf']
    },
    {
      id: '3',
      title: 'Algorithm Analysis Report',
      subject: 'Computer Science',
      class: 'CS-3A',
      description: 'Analyze time and space complexity of sorting algorithms',
      dueDate: '2024-12-05',
      createdDate: '2024-11-25',
      totalMarks: 50,
      status: 'past_due',
      submittedCount: 30,
      totalStudents: 35,
      type: 'homework',
      priority: 'medium',
      attachments: ['template.docx']
    },
    {
      id: '4',
      title: 'Lab Exercise 5',
      subject: 'Computer Science',
      class: 'CS-3B',
      description: 'Complete exercises on binary search trees',
      dueDate: '2024-12-01',
      createdDate: '2024-11-20',
      totalMarks: 25,
      status: 'graded',
      submittedCount: 38,
      totalStudents: 38,
      type: 'lab',
      priority: 'low',
      attachments: []
    },
    {
      id: '5',
      title: 'Mini Quiz - SQL Basics',
      subject: 'Database Management',
      class: 'CS-4A',
      description: 'Online quiz covering SQL SELECT, JOIN, and subqueries',
      dueDate: '2024-12-18',
      createdDate: '2024-12-12',
      totalMarks: 30,
      status: 'active',
      submittedCount: 5,
      totalStudents: 30,
      type: 'quiz',
      priority: 'medium',
      attachments: []
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

  const filteredAssignments = assignments.filter(assignment => {
    const matchesTab = activeTab === 'active' ? assignment.status === 'active' :
                       activeTab === 'past_due' ? assignment.status === 'past_due' :
                       assignment.status === 'graded'
    const matchesSearch = assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          assignment.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          assignment.class.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesTab && matchesSearch
  })

  const handleCreateAssignment = () => {
    setModalMode('create')
    setSelectedAssignment(null)
    setShowModal(true)
  }

  const handleEditAssignment = (assignment: Assignment) => {
    setModalMode('edit')
    setSelectedAssignment(assignment)
    setShowModal(true)
  }

  const handleDeleteAssignment = (assignmentId: string) => {
    if (confirm('Are you sure you want to delete this assignment?')) {
      setAssignments(prev => prev.filter(a => a.id !== assignmentId))
      setNotificationMessage('Assignment deleted successfully')
      setShowNotification(true)
      setTimeout(() => setShowNotification(false), 3000)
    }
  }

  const handleSaveAssignment = (data: any) => {
    if (modalMode === 'create') {
      const newAssignment: Assignment = {
        id: Date.now().toString(),
        ...data,
        createdDate: new Date().toISOString().split('T')[0],
        status: 'active',
        submittedCount: 0
      }
      setAssignments(prev => [...prev, newAssignment])
      setNotificationMessage('Assignment created successfully')
    } else if (modalMode === 'edit' && selectedAssignment) {
      setAssignments(prev => prev.map(a => 
        a.id === selectedAssignment.id ? { ...a, ...data } : a
      ))
      setNotificationMessage('Assignment updated successfully')
    }
    setShowNotification(true)
    setTimeout(() => setShowNotification(false), 3000)
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'homework': return '📚'
      case 'project': return '🚀'
      case 'lab': return '🔬'
      case 'quiz': return '❓'
      default: return '📝'
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

  const stats = {
    total: assignments.length,
    active: assignments.filter(a => a.status === 'active').length,
    pastDue: assignments.filter(a => a.status === 'past_due').length,
    graded: assignments.filter(a => a.status === 'graded').length,
    avgSubmission: Math.round(
      assignments.reduce((sum, a) => sum + (a.submittedCount / a.totalStudents * 100), 0) / assignments.length
    )
  }

  return (
    <Layout role="faculty">
      {/* Notification */}
      {showNotification && (
        <div className="fixed top-4 right-4 z-50 bg-white/90 backdrop-blur-xl rounded-xl shadow-2xl p-4 border border-white/50 max-w-sm animate-pulse">
          <p className="text-navy font-semibold">Success</p>
          <p className="text-sm text-navy/70 mt-1">{notificationMessage}</p>
        </div>
      )}

      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-navy">Assignment Management</h1>
            <p className="text-navy/70 mt-2">Create and manage assignments for your classes</p>
          </div>
          <button
            onClick={handleCreateAssignment}
            className="bg-gradient-to-r from-blue-500 to-orange-500 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-orange-600 transition-all duration-300 font-semibold shadow-md hover:shadow-lg"
          >
            + Create Assignment
          </button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-white/40 backdrop-blur-xl rounded-xl p-4 border border-white/50">
            <p className="text-sm text-navy/60">Total Assignments</p>
            <p className="text-2xl font-bold text-navy">{stats.total}</p>
          </div>
          <div className="bg-white/40 backdrop-blur-xl rounded-xl p-4 border border-white/50">
            <p className="text-sm text-navy/60">Active</p>
            <p className="text-2xl font-bold text-green-600">{stats.active}</p>
          </div>
          <div className="bg-white/40 backdrop-blur-xl rounded-xl p-4 border border-white/50">
            <p className="text-sm text-navy/60">Past Due</p>
            <p className="text-2xl font-bold text-orange-600">{stats.pastDue}</p>
          </div>
          <div className="bg-white/40 backdrop-blur-xl rounded-xl p-4 border border-white/50">
            <p className="text-sm text-navy/60">Graded</p>
            <p className="text-2xl font-bold text-blue-600">{stats.graded}</p>
          </div>
          <div className="bg-white/40 backdrop-blur-xl rounded-xl p-4 border border-white/50">
            <p className="text-sm text-navy/60">Avg Submission</p>
            <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-orange-600 bg-clip-text text-transparent">
              {stats.avgSubmission}%
            </p>
          </div>
        </div>

        {/* Search and Tabs */}
        <div className="flex gap-4 flex-col md:flex-row">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search assignments by title, subject, or class..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 bg-white/60 backdrop-blur border border-white/50 rounded-xl text-navy placeholder-navy/50 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div className="flex bg-white/50 backdrop-blur rounded-xl p-1 border border-white/50">
            <button
              onClick={() => setActiveTab('active')}
              className={`px-4 py-2 rounded-lg transition-all duration-300 font-medium ${
                activeTab === 'active'
                  ? 'bg-gradient-to-r from-blue-500 to-orange-500 text-white'
                  : 'text-navy hover:bg-white/30'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setActiveTab('past_due')}
              className={`px-4 py-2 rounded-lg transition-all duration-300 font-medium ${
                activeTab === 'past_due'
                  ? 'bg-gradient-to-r from-blue-500 to-orange-500 text-white'
                  : 'text-navy hover:bg-white/30'
              }`}
            >
              Past Due
            </button>
            <button
              onClick={() => setActiveTab('graded')}
              className={`px-4 py-2 rounded-lg transition-all duration-300 font-medium ${
                activeTab === 'graded'
                  ? 'bg-gradient-to-r from-blue-500 to-orange-500 text-white'
                  : 'text-navy hover:bg-white/30'
              }`}
            >
              Graded
            </button>
          </div>
        </div>

        {/* Assignments Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredAssignments.map((assignment) => (
            <div key={assignment.id} className="bg-white/40 backdrop-blur-xl rounded-2xl p-6 border border-white/50 shadow-lg hover:scale-[1.02] transition-all duration-300">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-start gap-3">
                  <div className="text-3xl">{getTypeIcon(assignment.type)}</div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-navy">{assignment.title}</h3>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-sm text-navy/60">{assignment.subject}</span>
                      <span className="text-sm text-navy/60">•</span>
                      <span className="text-sm text-navy/60">{assignment.class}</span>
                      <span className={`px-2 py-1 rounded-full text-white text-xs font-semibold bg-gradient-to-r ${getPriorityColor(assignment.priority)}`}>
                        {assignment.priority.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-navy/60">Due Date</p>
                  <p className="text-sm font-semibold text-navy">{assignment.dueDate}</p>
                </div>
              </div>

              <p className="text-sm text-navy/70 mb-4 line-clamp-2">{assignment.description}</p>

              {/* Submission Progress */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-navy/60">Submissions</span>
                  <span className="text-navy font-medium">
                    {assignment.submittedCount}/{assignment.totalStudents} students
                  </span>
                </div>
                <div className="h-2 bg-gray-200/50 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-orange-500 rounded-full transition-all duration-300"
                    style={{ width: `${(assignment.submittedCount / assignment.totalStudents) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Assignment Info */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-white/30 rounded-lg p-2">
                  <p className="text-xs text-navy/60">Total Marks</p>
                  <p className="text-navy font-medium">{assignment.totalMarks}</p>
                </div>
                <div className="bg-white/30 rounded-lg p-2">
                  <p className="text-xs text-navy/60">Type</p>
                  <p className="text-navy font-medium capitalize">{assignment.type}</p>
                </div>
              </div>

              {/* Attachments */}
              {assignment.attachments && assignment.attachments.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs text-navy/60 mb-2">Attachments</p>
                  <div className="flex flex-wrap gap-2">
                    {assignment.attachments.map((file, index) => (
                      <span key={index} className="px-2 py-1 bg-white/50 rounded text-xs text-navy">
                        📎 {file}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                {assignment.status === 'active' && (
                  <>
                    <button className="flex-1 bg-gradient-to-r from-blue-500 to-orange-500 text-white text-sm px-3 py-2 rounded-lg hover:from-blue-600 hover:to-orange-600 transition-colors">
                      View Submissions
                    </button>
                    <button 
                      onClick={() => handleEditAssignment(assignment)}
                      className="px-3 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      Edit
                    </button>
                  </>
                )}
                {assignment.status === 'past_due' && (
                  <button className="flex-1 bg-orange-500 text-white text-sm px-3 py-2 rounded-lg hover:bg-orange-600 transition-colors">
                    Grade Submissions
                  </button>
                )}
                {assignment.status === 'graded' && (
                  <button className="flex-1 bg-green-500 text-white text-sm px-3 py-2 rounded-lg hover:bg-green-600 transition-colors">
                    View Grades
                  </button>
                )}
                <button 
                  onClick={() => handleDeleteAssignment(assignment.id)}
                  className="px-3 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors"
                >
                  Delete
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
              📊 Assignment Analytics
            </button>
            <button className="bg-white/50 backdrop-blur text-navy px-4 py-3 rounded-xl hover:bg-white/70 transition-all duration-300 font-medium border border-white/50 text-sm">
              📥 Bulk Download
            </button>
            <button className="bg-white/50 backdrop-blur text-navy px-4 py-3 rounded-xl hover:bg-white/70 transition-all duration-300 font-medium border border-white/50 text-sm">
              📧 Send Reminders
            </button>
            <button className="bg-white/50 backdrop-blur text-navy px-4 py-3 rounded-xl hover:bg-white/70 transition-all duration-300 font-medium border border-white/50 text-sm">
              📁 Archive Old
            </button>
          </div>
        </div>
      </div>

      {/* Assignment Modal */}
      <AssignmentModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSaveAssignment}
        mode={modalMode}
        initialData={selectedAssignment}
      />
    </Layout>
  )
}