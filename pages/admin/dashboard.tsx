import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Layout from '@/components/Layout'

export default function AdminDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)

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

  return (
    <Layout role="admin">
      <h1 className="text-3xl font-bold text-navy mb-6">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-vanilla-cream p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-navy mb-2">Total Students</h2>
          <p className="text-3xl font-bold text-orange-accent">2,450</p>
          <p className="text-gray-600">Active enrollments</p>
        </div>
        
        <div className="bg-vanilla-cream p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-navy mb-2">Faculty Members</h2>
          <p className="text-3xl font-bold text-orange-accent">145</p>
          <p className="text-gray-600">Active faculty</p>
        </div>
        
        <div className="bg-vanilla-cream p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-navy mb-2">Courses</h2>
          <p className="text-3xl font-bold text-orange-accent">320</p>
          <p className="text-gray-600">This semester</p>
        </div>
        
        <div className="bg-vanilla-cream p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-navy mb-2">Departments</h2>
          <p className="text-3xl font-bold text-orange-accent">12</p>
          <p className="text-gray-600">Active departments</p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold text-navy mb-4">System Activity</h2>
          <div className="space-y-4">
            <div className="border-l-4 border-orange-accent pl-4 py-2">
              <h3 className="font-semibold text-navy">New Student Registration</h3>
              <p className="text-gray-600">45 new students registered today</p>
            </div>
            <div className="border-l-4 border-orange-accent pl-4 py-2">
              <h3 className="font-semibold text-navy">Course Updates</h3>
              <p className="text-gray-600">12 course schedules modified</p>
            </div>
            <div className="border-l-4 border-orange-accent pl-4 py-2">
              <h3 className="font-semibold text-navy">System Maintenance</h3>
              <p className="text-gray-600">Scheduled for this weekend</p>
            </div>
          </div>
        </div>
        
        <div>
          <h2 className="text-2xl font-bold text-navy mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <button className="bg-navy text-white p-4 rounded-lg hover:bg-opacity-90">
              Add New User
            </button>
            <button className="bg-navy text-white p-4 rounded-lg hover:bg-opacity-90">
              Create Course
            </button>
            <button className="bg-navy text-white p-4 rounded-lg hover:bg-opacity-90">
              Generate Report
            </button>
            <button className="bg-navy text-white p-4 rounded-lg hover:bg-opacity-90">
              System Settings
            </button>
          </div>
        </div>
      </div>
    </Layout>
  )
}