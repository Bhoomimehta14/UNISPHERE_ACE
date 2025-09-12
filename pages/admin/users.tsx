import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Layout from '@/components/Layout'

export default function AdminUsers() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [selectedRole, setSelectedRole] = useState('all')

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

  const users = [
    { id: 1, name: 'John Smith', email: 'john.smith@campus.edu', role: 'student', status: 'Active' },
    { id: 2, name: 'Dr. Sarah Johnson', email: 'sarah.johnson@campus.edu', role: 'faculty', status: 'Active' },
    { id: 3, name: 'Emily Davis', email: 'emily.davis@campus.edu', role: 'student', status: 'Active' },
    { id: 4, name: 'Prof. Michael Brown', email: 'michael.brown@campus.edu', role: 'faculty', status: 'Active' },
    { id: 5, name: 'Alex Wilson', email: 'alex.wilson@campus.edu', role: 'admin', status: 'Active' },
    { id: 6, name: 'Lisa Anderson', email: 'lisa.anderson@campus.edu', role: 'student', status: 'Inactive' },
  ]

  const filteredUsers = selectedRole === 'all' 
    ? users 
    : users.filter(u => u.role === selectedRole)

  return (
    <Layout role="admin">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-navy">User Management</h1>
        <button className="bg-orange-accent text-white px-4 py-2 rounded-md hover:bg-opacity-90">
          Add New User
        </button>
      </div>

      <div className="mb-6">
        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-accent"
        >
          <option value="all">All Roles</option>
          <option value="student">Students</option>
          <option value="faculty">Faculty</option>
          <option value="admin">Administrators</option>
        </select>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-navy text-vanilla-cream">
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">Email</th>
              <th className="px-6 py-3 text-left">Role</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} className="border-b hover:bg-vanilla-cream">
                <td className="px-6 py-4">{user.name}</td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    user.role === 'admin' ? 'bg-red-100 text-red-800' :
                    user.role === 'faculty' ? 'bg-blue-100 text-blue-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {user.role.toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button className="text-orange-accent hover:underline mr-3">Edit</button>
                  <button className="text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  )
}