import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Layout from '@/components/Layout'

export default function StudentProfile() {
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

  return (
    <Layout role="student">
      <h1 className="text-3xl font-bold text-navy mb-6">My Profile</h1>
      <p className="text-gray-600">Profile functionality coming soon...</p>
    </Layout>
  )
}