import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Layout from '@/components/Layout'
import OrderModal from '@/components/OrderModal'

interface MenuItem {
  id: number
  name: string
  price: string
  category: string
  icon: string
  available: boolean
  description: string
  priceNum?: number
  prepTime?: string
}

export default function StudentCanteen() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showOrderModal, setShowOrderModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState<any>(null)

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

  const categories = [
    { id: 'all', label: 'All Items', icon: '🍽️' },
    { id: 'breakfast', label: 'Breakfast', icon: '🌅' },
    { id: 'lunch', label: 'Lunch', icon: '☀️' },
    { id: 'snacks', label: 'Snacks', icon: '🍿' },
    { id: 'beverages', label: 'Beverages', icon: '☕' },
  ]

  const menuItems: MenuItem[] = [
    { id: 1, name: 'Healthy Bowl', price: '₹120', priceNum: 120, category: 'lunch', icon: '🥗', available: true, description: 'Fresh vegetables with quinoa', prepTime: '15 min' },
    { id: 2, name: 'Pizza Special', price: '₹180', priceNum: 180, category: 'lunch', icon: '🍕', available: true, description: 'Daily special pizza slice', prepTime: '20 min' },
    { id: 3, name: 'Asian Delights', price: '₹150', priceNum: 150, category: 'lunch', icon: '🍜', available: true, description: 'Noodles with vegetables', prepTime: '15 min' },
    { id: 4, name: 'Pancakes', price: '₹100', priceNum: 100, category: 'breakfast', icon: '🥞', available: true, description: 'Fluffy pancakes with syrup', prepTime: '10 min' },
    { id: 5, name: 'Omelette', price: '₹80', priceNum: 80, category: 'breakfast', icon: '🍳', available: true, description: 'Three egg omelette with cheese', prepTime: '10 min' },
    { id: 6, name: 'Sandwich', price: '₹60', priceNum: 60, category: 'snacks', icon: '🥪', available: false, description: 'Club sandwich', prepTime: '10 min' },
    { id: 7, name: 'Coffee', price: '₹30', priceNum: 30, category: 'beverages', icon: '☕', available: true, description: 'Freshly brewed coffee', prepTime: '5 min' },
    { id: 8, name: 'Smoothie', price: '₹70', priceNum: 70, category: 'beverages', icon: '🥤', available: true, description: 'Fruit smoothie', prepTime: '5 min' },
    { id: 9, name: 'Burger', price: '₹130', priceNum: 130, category: 'lunch', icon: '🍔', available: true, description: 'Classic beef burger', prepTime: '15 min' },
    { id: 10, name: 'Fruit Bowl', price: '₹60', priceNum: 60, category: 'snacks', icon: '🍓', available: true, description: 'Mixed seasonal fruits', prepTime: '5 min' },
  ]

  const filteredItems = selectedCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory)

  const todaySpecial = {
    name: "Chef's Special Pasta",
    price: '₹200',
    priceNum: 200,
    description: 'Creamy alfredo pasta with grilled chicken',
    icon: '🍝',
    category: 'special',
    prepTime: '20 min'
  }

  return (
    <Layout role="student">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-navy mb-2">Canteen Menu</h1>
          <p className="text-navy/70">Today&apos;s delicious offerings</p>
        </div>

        {/* Today's Special */}
        <div className="bg-gradient-to-r from-blue-100/50 via-white/50 to-orange-100/50 backdrop-blur-sm rounded-2xl p-6 border border-white/30 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-navy mb-2 flex items-center gap-2">
                <span>⭐</span> Today&apos;s Special
              </h2>
              <div className="flex items-start gap-4">
                <span className="text-5xl">{todaySpecial.icon}</span>
                <div>
                  <h3 className="text-xl font-semibold text-navy">{todaySpecial.name}</h3>
                  <p className="text-navy/60 mt-1">{todaySpecial.description}</p>
                  <p className="text-2xl font-bold text-orange-600 mt-2">{todaySpecial.price}</p>
                </div>
              </div>
            </div>
            <button 
              onClick={() => {
                setSelectedItem({
                  name: todaySpecial.name,
                  price: todaySpecial.priceNum,
                  category: todaySpecial.category,
                  prepTime: todaySpecial.prepTime
                })
                setShowOrderModal(true)
              }}
              className="bg-orange-accent text-white px-6 py-3 rounded-xl hover:bg-orange-600 transition-colors font-semibold"
            >
              Order Now
            </button>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 flex-wrap">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full transition-all duration-300 flex items-center gap-2 ${
                selectedCategory === category.id
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                  : 'bg-white/60 text-navy hover:bg-white/80 border border-white/30'
              }`}
            >
              <span>{category.icon}</span>
              <span className="font-medium">{category.label}</span>
            </button>
          ))}
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className={`bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/30 shadow-lg hover:scale-105 transition-all duration-300 ${
                !item.available ? 'opacity-60' : ''
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-4xl">{item.icon}</span>
                {item.available ? (
                  <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">
                    Available
                  </span>
                ) : (
                  <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full font-medium">
                    Sold Out
                  </span>
                )}
              </div>
              <h3 className="text-lg font-semibold text-navy mb-1">{item.name}</h3>
              <p className="text-sm text-navy/60 mb-3">{item.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-orange-600">{item.price}</span>
                <button
                  disabled={!item.available}
                  onClick={() => {
                    if (item.available) {
                      setSelectedItem({
                        name: item.name,
                        price: item.priceNum,
                        category: item.category,
                        prepTime: item.prepTime
                      })
                      setShowOrderModal(true)
                    }
                  }}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    item.available
                      ? 'bg-gradient-to-r from-blue-500 to-orange-500 text-white hover:from-blue-600 hover:to-orange-600'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {item.available ? 'Order Now' : 'Unavailable'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Operating Hours */}
        <div className="bg-gradient-to-br from-orange-50/50 via-white/50 to-blue-50/50 backdrop-blur-sm rounded-2xl p-6 border border-white/30 shadow-lg">
          <h2 className="text-2xl font-bold text-navy mb-4 flex items-center gap-2">
            <span>🕐</span> Operating Hours
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/70 rounded-xl p-4">
              <p className="font-semibold text-navy">Breakfast</p>
              <p className="text-navy/60">7:00 AM - 10:30 AM</p>
            </div>
            <div className="bg-white/70 rounded-xl p-4">
              <p className="font-semibold text-navy">Lunch</p>
              <p className="text-navy/60">11:30 AM - 3:00 PM</p>
            </div>
            <div className="bg-white/70 rounded-xl p-4">
              <p className="font-semibold text-navy">Snacks & Beverages</p>
              <p className="text-navy/60">All Day</p>
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
        userRole="student"
      />
    </Layout>
  )
}