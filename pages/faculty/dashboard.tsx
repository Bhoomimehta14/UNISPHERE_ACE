import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Layout from '@/components/Layout'

export default function FacultyDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)

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

  return (
    <Layout role="faculty">
      <h1 className="text-3xl font-bold text-navy mb-6">Faculty Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-vanilla-cream p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-navy mb-2">Current Courses</h2>
          <p className="text-3xl font-bold text-orange-accent">4</p>
          <p className="text-gray-600">Teaching this semester</p>
        </div>
        
        <div className="bg-vanilla-cream p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-navy mb-2">Total Students</h2>
          <p className="text-3xl font-bold text-orange-accent">125</p>
          <p className="text-gray-600">Across all courses</p>
        </div>
        
        <div className="bg-vanilla-cream p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-navy mb-2">Pending</h2>
          <p className="text-3xl font-bold text-orange-accent">18</p>
          <p className="text-gray-600">Assignments to grade</p>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold text-navy mb-4">Today&apos;s Schedule</h2>
        <div className="space-y-4">
          <div className="border-l-4 border-orange-accent pl-4 py-2">
            <h3 className="font-semibold text-navy">CS101 - Introduction to Computer Science</h3>
            <p className="text-gray-600">10:00 AM - 11:00 AM | Room 204</p>
          </div>
          <div className="border-l-4 border-orange-accent pl-4 py-2">
            <h3 className="font-semibold text-navy">CS301 - Data Structures</h3>
            <p className="text-gray-600">2:00 PM - 3:30 PM | Room 305</p>
          </div>
          <div className="border-l-4 border-orange-accent pl-4 py-2">
            <h3 className="font-semibold text-navy">Office Hours</h3>
            <p className="text-gray-600">4:00 PM - 5:00 PM | Office 412</p>
          </div>
        </div>
      </div>
    </Layout>
  )
}