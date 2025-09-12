import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Layout from '@/components/Layout'
import OrderModal from '@/components/OrderModal'

interface MenuItem {
  id: string
  category: 'breakfast' | 'lunch' | 'snacks' | 'beverages' | 'special'
  name: string
  price: number
  availability: 'available' | 'unavailable' | 'limited'
  description?: string
  rating: number
  dietary?: string[]
  prepTime?: string
}

export default function FacultyCanteen() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'breakfast' | 'lunch' | 'snacks' | 'beverages' | 'special'>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [showOrderModal, setShowOrderModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null)

  const menuItems: MenuItem[] = [
    // Breakfast
    { id: '1', category: 'breakfast', name: 'Masala Dosa', price: 60, availability: 'available', rating: 4.5, dietary: ['vegetarian'], prepTime: '15 min' },
    { id: '2', category: 'breakfast', name: 'Idli Sambar', price: 40, availability: 'available', rating: 4.3, dietary: ['vegetarian', 'vegan'], prepTime: '10 min' },
    { id: '3', category: 'breakfast', name: 'Poha', price: 35, availability: 'available', rating: 4.0, dietary: ['vegetarian'], prepTime: '10 min' },
    { id: '4', category: 'breakfast', name: 'Aloo Paratha', price: 50, availability: 'limited', rating: 4.6, dietary: ['vegetarian'], prepTime: '20 min' },
    
    // Lunch
    { id: '5', category: 'lunch', name: 'Veg Thali', price: 90, availability: 'available', rating: 4.4, dietary: ['vegetarian'], prepTime: '15 min' },
    { id: '6', category: 'lunch', name: 'Chicken Biryani', price: 120, availability: 'available', rating: 4.7, dietary: ['non-vegetarian'], prepTime: '20 min' },
    { id: '7', category: 'lunch', name: 'Paneer Butter Masala', price: 110, availability: 'available', rating: 4.5, dietary: ['vegetarian'], prepTime: '15 min' },
    { id: '8', category: 'lunch', name: 'Dal Makhani Combo', price: 100, availability: 'available', rating: 4.3, dietary: ['vegetarian'], prepTime: '15 min' },
    
    // Snacks
    { id: '9', category: 'snacks', name: 'Samosa (2 pcs)', price: 30, availability: 'available', rating: 4.2, dietary: ['vegetarian'], prepTime: '5 min' },
    { id: '10', category: 'snacks', name: 'Veg Sandwich', price: 45, availability: 'available', rating: 4.0, dietary: ['vegetarian'], prepTime: '10 min' },
    { id: '11', category: 'snacks', name: 'Pasta', price: 70, availability: 'limited', rating: 4.1, dietary: ['vegetarian'], prepTime: '15 min' },
    { id: '12', category: 'snacks', name: 'Spring Rolls', price: 60, availability: 'available', rating: 4.3, dietary: ['vegetarian'], prepTime: '10 min' },
    
    // Beverages
    { id: '13', category: 'beverages', name: 'Tea', price: 20, availability: 'available', rating: 4.5, prepTime: '5 min' },
    { id: '14', category: 'beverages', name: 'Coffee', price: 30, availability: 'available', rating: 4.4, prepTime: '5 min' },
    { id: '15', category: 'beverages', name: 'Fresh Juice', price: 50, availability: 'available', rating: 4.6, dietary: ['vegan'], prepTime: '5 min' },
    { id: '16', category: 'beverages', name: 'Lassi', price: 40, availability: 'available', rating: 4.3, dietary: ['vegetarian'], prepTime: '5 min' },
    
    // Today's Special
    { id: '17', category: 'special', name: 'Chole Bhature', price: 80, availability: 'limited', rating: 4.8, dietary: ['vegetarian'], prepTime: '15 min', description: 'Chef\'s special with extra bhature' },
    { id: '18', category: 'special', name: 'Fish Curry Rice', price: 130, availability: 'limited', rating: 4.6, dietary: ['non-vegetarian'], prepTime: '20 min', description: 'Fresh catch of the day' },
  ]

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

  const filteredItems = menuItems.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'available': return 'bg-green-500'
      case 'limited': return 'bg-orange-500'
      case 'unavailable': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'breakfast': return '🌅'
      case 'lunch': return '🍽️'
      case 'snacks': return '🍿'
      case 'beverages': return '☕'
      case 'special': return '⭐'
      default: return '🍴'
    }
  }

  return (
    <Layout role="faculty">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-navy">Campus Canteen Menu</h1>
            <p className="text-navy/70 mt-2">Today&apos;s menu and special offerings</p>
          </div>
          <div className="bg-gradient-to-r from-blue-500 to-orange-500 text-white px-6 py-3 rounded-xl shadow-lg">
            <p className="text-sm">Canteen Hours</p>
            <p className="text-lg font-bold">8:00 AM - 8:00 PM</p>
          </div>
        </div>

        {/* Today's Special Banner */}
        <div className="bg-gradient-to-r from-orange-500/20 to-blue-500/20 backdrop-blur-xl rounded-2xl p-6 border border-white/50">
          <div className="flex items-center gap-4">
            <div className="text-4xl">⭐</div>
            <div>
              <h2 className="text-2xl font-bold text-navy">Today&apos;s Special</h2>
              <p className="text-navy/70 mt-1">Chef&apos;s recommendations with special discounts!</p>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex gap-4 flex-col md:flex-row">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search menu items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 bg-white/60 backdrop-blur border border-white/50 rounded-xl text-navy placeholder-navy/50 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div className="flex bg-white/50 backdrop-blur rounded-xl p-1 border border-white/50">
            {['all', 'breakfast', 'lunch', 'snacks', 'beverages', 'special'].map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category as any)}
                className={`px-4 py-2 rounded-lg transition-all duration-300 font-medium capitalize ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-blue-500 to-orange-500 text-white'
                    : 'text-navy hover:bg-white/30'
                }`}
              >
                {category === 'all' ? 'All Items' : category}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div key={item.id} className="bg-white/40 backdrop-blur-xl rounded-2xl p-6 border border-white/50 shadow-lg hover:scale-105 transition-all duration-300">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">{getCategoryIcon(item.category)}</div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-navy">{item.name}</h3>
                    {item.description && (
                      <p className="text-sm text-navy/60 mt-1">{item.description}</p>
                    )}
                  </div>
                </div>
                <div className={`px-2 py-1 rounded-full text-white text-xs font-semibold ${getAvailabilityColor(item.availability)}`}>
                  {item.availability === 'available' ? 'Available' : 
                   item.availability === 'limited' ? 'Limited' : 'Unavailable'}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-orange-600 bg-clip-text text-transparent">
                    ₹{item.price}
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-500">★</span>
                    <span className="text-sm text-navy/70">{item.rating}</span>
                  </div>
                </div>

                {item.dietary && (
                  <div className="flex gap-2">
                    {item.dietary.map((diet, index) => (
                      <span key={index} className="px-2 py-1 bg-white/50 rounded text-xs text-navy capitalize">
                        {diet}
                      </span>
                    ))}
                  </div>
                )}

                {item.prepTime && (
                  <div className="flex items-center gap-2 text-sm text-navy/60">
                    <span>⏱️</span>
                    <span>{item.prepTime}</span>
                  </div>
                )}

                {item.availability === 'available' && (
                  <button 
                    onClick={() => {
                      setSelectedItem(item)
                      setShowOrderModal(true)
                    }}
                    className="w-full mt-3 bg-gradient-to-r from-blue-500 to-orange-500 text-white py-2 px-4 rounded-lg hover:from-blue-600 hover:to-orange-600 transition-all duration-300 font-medium"
                  >
                    Order Now
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/40 backdrop-blur-xl rounded-xl p-4 border border-white/50">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📱</span>
              <div>
                <p className="text-sm text-navy/60">Order Online</p>
                <p className="text-navy font-medium">Pre-order available</p>
              </div>
            </div>
          </div>
          <div className="bg-white/40 backdrop-blur-xl rounded-xl p-4 border border-white/50">
            <div className="flex items-center gap-3">
              <span className="text-2xl">💳</span>
              <div>
                <p className="text-sm text-navy/60">Payment</p>
                <p className="text-navy font-medium">Cash & Digital accepted</p>
              </div>
            </div>
          </div>
          <div className="bg-white/40 backdrop-blur-xl rounded-xl p-4 border border-white/50">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🚚</span>
              <div>
                <p className="text-sm text-navy/60">Delivery</p>
                <p className="text-navy font-medium">To faculty lounge available</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Order Modal */}
      <OrderModal
        isOpen={showOrderModal}
        onClose={() => {
          setShowOrderModal(false)
          setSelectedItem(null)
        }}
        item={selectedItem}
        userRole="faculty"
      />
    </Layout>
  )
}