import React, { useState, useEffect } from 'react'

interface OrderModalProps {
  isOpen: boolean
  onClose: () => void
  item: {
    name: string
    price: number
    category: string
    prepTime?: string
  } | null
  userRole: 'student' | 'faculty'
}

export default function OrderModal({
  isOpen,
  onClose,
  item,
  userRole
}: OrderModalProps) {
  const [orderNumber, setOrderNumber] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [specialInstructions, setSpecialInstructions] = useState('')
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [estimatedTime, setEstimatedTime] = useState('')

  useEffect(() => {
    if (isOpen && item) {
      // Generate unique order number
      const prefix = userRole === 'faculty' ? 'F' : 'S'
      const timestamp = Date.now().toString().slice(-6)
      const random = Math.floor(Math.random() * 100).toString().padStart(2, '0')
      setOrderNumber(`${prefix}${timestamp}${random}`)
      
      // Calculate estimated time
      const prepMinutes = parseInt(item.prepTime?.match(/\d+/)?.[0] || '15')
      const totalMinutes = prepMinutes + (quantity - 1) * 2
      const now = new Date()
      now.setMinutes(now.getMinutes() + totalMinutes)
      setEstimatedTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }))
      
      // Reset state
      setOrderPlaced(false)
      setQuantity(1)
      setSpecialInstructions('')
    }
  }, [isOpen, item, userRole, quantity])

  const handlePlaceOrder = () => {
    setOrderPlaced(true)
    
    // Auto-close after 5 seconds
    setTimeout(() => {
      onClose()
      setOrderPlaced(false)
    }, 5000)
  }

  const getCategoryEmoji = (category: string) => {
    switch (category) {
      case 'breakfast': return '🌅'
      case 'lunch': return '🍽️'
      case 'snacks': return '🍿'
      case 'beverages': return '☕'
      case 'special': return '⭐'
      default: return '🍴'
    }
  }

  if (!isOpen || !item) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      
      {/* Modal */}
      <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 max-w-md w-full mx-4 border border-white/50">
        {!orderPlaced ? (
          <>
            <h2 className="text-2xl font-bold text-navy mb-2">Place Order</h2>
            
            {/* Item Details */}
            <div className="bg-gradient-to-r from-blue-50/50 to-orange-50/50 rounded-xl p-4 mb-4 border border-white/50">
              <div className="flex items-start gap-3">
                <span className="text-3xl">{getCategoryEmoji(item.category)}</span>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-navy">{item.name}</h3>
                  <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-orange-600 bg-clip-text text-transparent mt-1">
                    ₹{item.price}
                  </p>
                </div>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-navy mb-2">
                Quantity
              </label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 bg-white/50 border border-white/50 rounded-lg text-navy font-bold hover:bg-white/70 transition-colors"
                  type="button"
                >
                  -
                </button>
                <span className="text-xl font-bold text-navy w-12 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(10, quantity + 1))}
                  className="w-10 h-10 bg-white/50 border border-white/50 rounded-lg text-navy font-bold hover:bg-white/70 transition-colors"
                  type="button"
                >
                  +
                </button>
              </div>
            </div>

            {/* Special Instructions */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-navy mb-2">
                Special Instructions (Optional)
              </label>
              <textarea
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                rows={2}
                className="w-full px-4 py-2 bg-white/60 border border-white/50 rounded-xl text-navy placeholder-navy/50 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="E.g., Less spicy, no onions..."
              />
            </div>

            {/* Order Summary */}
            <div className="bg-white/30 rounded-xl p-3 mb-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-navy/60">Item Total</span>
                <span className="text-navy font-medium">₹{item.price * quantity}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-navy/60">Prep Time</span>
                <span className="text-navy font-medium">{item.prepTime || '15 min'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-navy/60">Ready By</span>
                <span className="text-navy font-medium">{estimatedTime}</span>
              </div>
              <div className="border-t border-navy/10 pt-2">
                <div className="flex justify-between">
                  <span className="text-navy font-semibold">Total Amount</span>
                  <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-orange-600 bg-clip-text text-transparent">
                    ₹{item.price * quantity}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handlePlaceOrder}
                className="flex-1 bg-gradient-to-r from-blue-500 to-orange-500 text-white py-3 px-4 rounded-xl hover:from-blue-600 hover:to-orange-600 transition-all duration-300 font-semibold shadow-md hover:shadow-lg"
              >
                Confirm Order
              </button>
              <button
                onClick={onClose}
                className="flex-1 bg-white/50 text-navy py-3 px-4 rounded-xl hover:bg-white/70 transition-all duration-300 font-semibold border border-white/50"
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          /* Order Confirmation */
          <div className="text-center">
            <div className="mb-6">
              <div className="text-6xl mb-4">✅</div>
              <h2 className="text-2xl font-bold text-navy mb-2">Order Placed Successfully!</h2>
              <p className="text-navy/70">Your order has been sent to the canteen</p>
            </div>

            <div className="bg-gradient-to-r from-blue-500/20 to-orange-500/20 rounded-2xl p-6 mb-6 border border-white/50">
              <p className="text-sm text-navy/60 mb-2">Your Order Number</p>
              <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-orange-600 bg-clip-text text-transparent mb-4">
                {orderNumber}
              </p>
              <div className="space-y-2 text-left">
                <div className="flex justify-between text-sm">
                  <span className="text-navy/60">Item</span>
                  <span className="text-navy font-medium">{item.name} x{quantity}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-navy/60">Amount</span>
                  <span className="text-navy font-medium">₹{item.price * quantity}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-navy/60">Ready By</span>
                  <span className="text-navy font-medium">{estimatedTime}</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50/30 rounded-xl p-3 mb-6 border border-blue-200/50">
              <p className="text-sm text-navy/70">
                📱 You will receive a notification when your order is ready for pickup.
                Please show your order number at the counter.
              </p>
            </div>

            <button
              onClick={onClose}
              className="w-full bg-gradient-to-r from-blue-500 to-orange-500 text-white py-3 px-4 rounded-xl hover:from-blue-600 hover:to-orange-600 transition-all duration-300 font-semibold shadow-md hover:shadow-lg"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  )
}