import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Layout from '@/components/Layout'

interface Student {
  id: string
  name: string
  sapId: string
  attendance: number
  grade: string
  status: 'active' | 'inactive'
}

interface Batch {
  id: string
  batchCode: string
  subject: string
  semester: number
  year: number
  totalStudents: number
  activeStudents: number
  schedule: {
    day: string
    time: string
    room: string
  }[]
  avgAttendance: number
  avgGrade: string
  students?: Student[]
}

export default function FacultyBatches() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [showStudentList, setShowStudentList] = useState(false)

  const [batches] = useState<Batch[]>([
    {
      id: '1',
      batchCode: 'CS-3A',
      subject: 'Computer Science',
      semester: 5,
      year: 3,
      totalStudents: 35,
      activeStudents: 33,
      schedule: [
        { day: 'Monday', time: '9:00-10:00', room: 'Room 101' },
        { day: 'Friday', time: '9:00-10:00', room: 'Room 101' }
      ],
      avgAttendance: 85,
      avgGrade: 'B+',
      students: [
        { id: 's1', name: 'John Anderson', sapId: '70522400001', attendance: 90, grade: 'A', status: 'active' },
        { id: 's2', name: 'Emma Thompson', sapId: '70522400002', attendance: 85, grade: 'B+', status: 'active' },
        { id: 's3', name: 'Oliver Martinez', sapId: '70522400003', attendance: 78, grade: 'B', status: 'active' },
        { id: 's4', name: 'Sophia Rodriguez', sapId: '70522400004', attendance: 92, grade: 'A', status: 'active' },
        { id: 's5', name: 'William Lee', sapId: '70522400005', attendance: 70, grade: 'C+', status: 'inactive' },
      ]
    },
    {
      id: '2',
      batchCode: 'CS-3B',
      subject: 'Computer Science Lab',
      semester: 5,
      year: 3,
      totalStudents: 38,
      activeStudents: 38,
      schedule: [
        { day: 'Tuesday', time: '14:00-15:00', room: 'Lab 301' }
      ],
      avgAttendance: 88,
      avgGrade: 'A-',
      students: []
    },
    {
      id: '3',
      batchCode: 'CS-2A',
      subject: 'Data Structures',
      semester: 3,
      year: 2,
      totalStudents: 42,
      activeStudents: 40,
      schedule: [
        { day: 'Thursday', time: '15:00-16:00', room: 'Room 102' }
      ],
      avgAttendance: 82,
      avgGrade: 'B',
      students: []
    },
    {
      id: '4',
      batchCode: 'CS-2B',
      subject: 'Data Structures Lab',
      semester: 3,
      year: 2,
      totalStudents: 40,
      activeStudents: 39,
      schedule: [
        { day: 'Monday', time: '11:00-12:00', room: 'Room 102' }
      ],
      avgAttendance: 79,
      avgGrade: 'B+',
      students: []
    },
    {
      id: '5',
      batchCode: 'CS-4A',
      subject: 'Database Management',
      semester: 7,
      year: 4,
      totalStudents: 30,
      activeStudents: 30,
      schedule: [
        { day: 'Wednesday', time: '10:00-11:00', room: 'Room 202' }
      ],
      avgAttendance: 91,
      avgGrade: 'A',
      students: []
    },
    {
      id: '6',
      batchCode: 'IT-2A',
      subject: 'Web Development',
      semester: 4,
      year: 2,
      totalStudents: 28,
      activeStudents: 27,
      schedule: [
        { day: 'Tuesday', time: '11:00-12:00', room: 'Computer Lab 1' },
        { day: 'Thursday', time: '10:00-11:00', room: 'Computer Lab 1' }
      ],
      avgAttendance: 86,
      avgGrade: 'B+',
      students: []
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

  const filteredBatches = batches.filter(batch =>
    batch.batchCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    batch.subject.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalStats = {
    totalBatches: batches.length,
    totalStudents: batches.reduce((sum, b) => sum + b.totalStudents, 0),
    activeStudents: batches.reduce((sum, b) => sum + b.activeStudents, 0),
    avgAttendance: Math.round(batches.reduce((sum, b) => sum + b.avgAttendance, 0) / batches.length)
  }

  const handleViewStudents = (batch: Batch) => {
    setSelectedBatch(batch)
    setShowStudentList(true)
  }

  const getGradeColor = (grade: string) => {
    if (grade.includes('A')) return 'text-green-600'
    if (grade.includes('B')) return 'text-blue-600'
    if (grade.includes('C')) return 'text-orange-600'
    return 'text-red-600'
  }

  const getAttendanceColor = (attendance: number) => {
    if (attendance >= 85) return 'bg-green-500'
    if (attendance >= 75) return 'bg-blue-500'
    if (attendance >= 60) return 'bg-orange-500'
    return 'bg-red-500'
  }

  return (
    <Layout role="faculty">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-navy">My Batches</h1>
            <p className="text-navy/70 mt-2">Manage and monitor your teaching batches</p>
          </div>
          <div className="bg-gradient-to-r from-blue-500 to-orange-500 text-white px-6 py-3 rounded-xl shadow-lg">
            <p className="text-sm">Total Students</p>
            <p className="text-2xl font-bold">{totalStats.totalStudents}</p>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white/40 backdrop-blur-xl rounded-xl p-4 border border-white/50">
            <p className="text-sm text-navy/60">Total Batches</p>
            <p className="text-2xl font-bold text-navy">{totalStats.totalBatches}</p>
          </div>
          <div className="bg-white/40 backdrop-blur-xl rounded-xl p-4 border border-white/50">
            <p className="text-sm text-navy/60">Active Students</p>
            <p className="text-2xl font-bold text-green-600">
              {totalStats.activeStudents}/{totalStats.totalStudents}
            </p>
          </div>
          <div className="bg-white/40 backdrop-blur-xl rounded-xl p-4 border border-white/50">
            <p className="text-sm text-navy/60">Avg Attendance</p>
            <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-orange-600 bg-clip-text text-transparent">
              {totalStats.avgAttendance}%
            </p>
          </div>
          <div className="bg-white/40 backdrop-blur-xl rounded-xl p-4 border border-white/50">
            <p className="text-sm text-navy/60">Classes/Week</p>
            <p className="text-2xl font-bold text-navy">
              {batches.reduce((sum, b) => sum + b.schedule.length, 0)}
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search batches by code or subject..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-3 bg-white/60 backdrop-blur border border-white/50 rounded-xl text-navy placeholder-navy/50 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Batches Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBatches.map((batch) => (
            <div key={batch.id} className="bg-white/40 backdrop-blur-xl rounded-2xl p-6 border border-white/50 shadow-lg hover:scale-105 transition-all duration-300">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-navy">{batch.batchCode}</h3>
                  <p className="text-sm text-navy/70">{batch.subject}</p>
                  <p className="text-xs text-navy/60 mt-1">
                    Semester {batch.semester} • Year {batch.year}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-orange-600 bg-clip-text text-transparent">
                    {batch.totalStudents}
                  </p>
                  <p className="text-xs text-navy/60">students</p>
                </div>
              </div>

              {/* Student Status Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-navy/60">Active Students</span>
                  <span className="text-navy font-medium">
                    {batch.activeStudents}/{batch.totalStudents}
                  </span>
                </div>
                <div className="h-2 bg-gray-200/50 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-orange-500 rounded-full transition-all duration-300"
                    style={{ width: `${(batch.activeStudents / batch.totalStudents) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Schedule */}
              <div className="mb-4">
                <p className="text-xs text-navy/60 mb-2">Schedule</p>
                <div className="space-y-1">
                  {batch.schedule.map((s, idx) => (
                    <div key={idx} className="bg-white/30 rounded-lg px-3 py-2 text-xs">
                      <span className="font-medium text-navy">{s.day}</span>
                      <span className="text-navy/60"> • {s.time}</span>
                      <span className="text-navy/60"> • {s.room}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-gradient-to-r from-blue-50/50 to-orange-50/50 rounded-lg p-2">
                  <p className="text-xs text-navy/60">Avg Attendance</p>
                  <div className="flex items-center gap-2">
                    <p className="text-lg font-bold text-navy">{batch.avgAttendance}%</p>
                    <div className={`w-2 h-2 rounded-full ${getAttendanceColor(batch.avgAttendance)}`}></div>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-blue-50/50 to-orange-50/50 rounded-lg p-2">
                  <p className="text-xs text-navy/60">Avg Grade</p>
                  <p className={`text-lg font-bold ${getGradeColor(batch.avgGrade)}`}>
                    {batch.avgGrade}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button 
                  onClick={() => handleViewStudents(batch)}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-orange-500 text-white text-sm px-3 py-2 rounded-lg hover:from-blue-600 hover:to-orange-600 transition-colors"
                >
                  View Students
                </button>
                <button className="px-3 py-2 bg-white/50 text-navy text-sm rounded-lg hover:bg-white/70 transition-colors">
                  Analytics
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
              📊 Attendance Report
            </button>
            <button className="bg-white/50 backdrop-blur text-navy px-4 py-3 rounded-xl hover:bg-white/70 transition-all duration-300 font-medium border border-white/50 text-sm">
              📈 Grade Analysis
            </button>
            <button className="bg-white/50 backdrop-blur text-navy px-4 py-3 rounded-xl hover:bg-white/70 transition-all duration-300 font-medium border border-white/50 text-sm">
              📧 Email Batch
            </button>
            <button className="bg-white/50 backdrop-blur text-navy px-4 py-3 rounded-xl hover:bg-white/70 transition-all duration-300 font-medium border border-white/50 text-sm">
              📥 Export Data
            </button>
          </div>
        </div>
      </div>

      {/* Student List Modal */}
      {showStudentList && selectedBatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowStudentList(false)}
          ></div>
          
          <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 max-w-4xl w-full mx-4 border border-white/50 max-h-[80vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-navy mb-2">
              {selectedBatch.batchCode} - Student List
            </h2>
            <p className="text-navy/60 mb-6">{selectedBatch.subject}</p>

            {selectedBatch.students && selectedBatch.students.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-navy/20">
                      <th className="text-left py-2 text-navy">Name</th>
                      <th className="text-left py-2 text-navy">SAP ID</th>
                      <th className="text-center py-2 text-navy">Attendance</th>
                      <th className="text-center py-2 text-navy">Grade</th>
                      <th className="text-center py-2 text-navy">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedBatch.students.map((student) => (
                      <tr key={student.id} className="border-b border-navy/10">
                        <td className="py-3 text-navy">{student.name}</td>
                        <td className="py-3 text-navy/70">{student.sapId}</td>
                        <td className="py-3 text-center">
                          <span className={`font-medium ${
                            student.attendance >= 75 ? 'text-green-600' : 'text-orange-600'
                          }`}>
                            {student.attendance}%
                          </span>
                        </td>
                        <td className="py-3 text-center">
                          <span className={`font-bold ${getGradeColor(student.grade)}`}>
                            {student.grade}
                          </span>
                        </td>
                        <td className="py-3 text-center">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            student.status === 'active' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {student.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-navy/60">
                <p>Detailed student list not available for this batch.</p>
                <p className="text-sm mt-2">Total students: {selectedBatch.totalStudents}</p>
              </div>
            )}

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowStudentList(false)}
                className="bg-gradient-to-r from-blue-500 to-orange-500 text-white px-6 py-2 rounded-xl hover:from-blue-600 hover:to-orange-600 transition-all duration-300 font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}