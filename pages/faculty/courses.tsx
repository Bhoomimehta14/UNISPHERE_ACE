import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Layout from '@/components/Layout'

export default function FacultyCourses() {
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

  const courses = [
    { id: 1, code: 'CS101', name: 'Introduction to Computer Science', students: 35, room: '204', schedule: 'MWF 10:00-11:00' },
    { id: 2, code: 'CS201', name: 'Object-Oriented Programming', students: 28, room: '302', schedule: 'TTh 10:00-11:30' },
    { id: 3, code: 'CS301', name: 'Data Structures', students: 32, room: '305', schedule: 'MWF 2:00-3:00' },
    { id: 4, code: 'CS401', name: 'Software Engineering', students: 30, room: '401', schedule: 'TTh 2:00-3:30' },
  ]

  return (
    <Layout role="faculty">
      <h1 className="text-3xl font-bold text-navy mb-6">My Courses</h1>
      
      <div className="grid gap-4">
        {courses.map((course) => (
          <div key={course.id} className="bg-vanilla-cream p-6 rounded-lg hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold text-navy">{course.code}: {course.name}</h2>
                <p className="text-gray-600 mt-1">Students: {course.students}</p>
                <p className="text-gray-600">Room: {course.room}</p>
                <p className="text-gray-600">Schedule: {course.schedule}</p>
              </div>
              <div className="space-x-2">
                <button className="bg-orange-accent text-white px-4 py-2 rounded-md hover:bg-opacity-90">
                  Manage
                </button>
                <button className="bg-navy text-white px-4 py-2 rounded-md hover:bg-opacity-90">
                  Grade Book
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  )
}