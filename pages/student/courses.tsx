import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Layout from '@/components/Layout'

export default function StudentCourses() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)

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

  const courses = [
    { id: 1, code: 'CS101', name: 'Introduction to Computer Science', instructor: 'Dr. Smith', schedule: 'MWF 10:00-11:00' },
    { id: 2, code: 'MATH201', name: 'Calculus II', instructor: 'Prof. Johnson', schedule: 'TTh 2:00-3:30' },
    { id: 3, code: 'ENG102', name: 'English Composition', instructor: 'Dr. Brown', schedule: 'MWF 1:00-2:00' },
    { id: 4, code: 'PHY101', name: 'Physics I', instructor: 'Prof. Davis', schedule: 'TTh 10:00-11:30' },
    { id: 5, code: 'HIST201', name: 'World History', instructor: 'Dr. Wilson', schedule: 'MWF 3:00-4:00' },
  ]

  return (
    <Layout role="student">
      <h1 className="text-3xl font-bold text-navy mb-6">My Courses</h1>
      
      <div className="grid gap-4">
        {courses.map((course) => (
          <div key={course.id} className="bg-vanilla-cream p-6 rounded-lg hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold text-navy">{course.code}: {course.name}</h2>
                <p className="text-gray-600 mt-1">Instructor: {course.instructor}</p>
                <p className="text-gray-600">Schedule: {course.schedule}</p>
              </div>
              <button className="bg-orange-accent text-white px-4 py-2 rounded-md hover:bg-opacity-90">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  )
}