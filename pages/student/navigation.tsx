import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Layout from '@/components/Layout'

interface Room {
  id: string
  name: string
  type: 'classroom' | 'lab' | 'faculty' | 'admin' | 'facility' | 'stairs' | 'lift' | 'corridor' | 'entrance'
  floor: number
  x: number
  y: number
  width: number
  height: number
  capacity?: number
  available?: boolean
  description?: string
  amenities?: string[]
}

interface FloorPlan {
  floor: number
  name: string
  rooms: Room[]
}

export default function CampusNavigation() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [currentFloor, setCurrentFloor] = useState(1)
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [zoomLevel, setZoomLevel] = useState(100)
  const [showRoomInfo, setShowRoomInfo] = useState(false)
  const [navigationPath, setNavigationPath] = useState<string[]>([])
  const [currentLocation, setCurrentLocation] = useState<Room | null>(null)
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map')
  const [userPosition, setUserPosition] = useState<{ x: number; y: number }>({ x: 375, y: 315 })
  const [wandererPosition, setWandererPosition] = useState<{ x: number; y: number }>({ x: 170, y: 230 })

  // Elements positioned at corners and edges of white border
  const [floors] = useState<FloorPlan[]>([
    {
      floor: 1,
      name: '1st Floor',
      rooms: [
        // TOP EDGE - Against top border
        { id: 'CR101', name: 'Classroom 101', type: 'classroom', floor: 1, x: 160, y: 40, width: 100, height: 70, capacity: 40, available: true },
        { id: 'CR102', name: 'Classroom 102', type: 'classroom', floor: 1, x: 270, y: 40, width: 100, height: 70, capacity: 40, available: false },
        { id: 'CR103', name: 'Classroom 103', type: 'classroom', floor: 1, x: 380, y: 40, width: 100, height: 70, capacity: 40, available: true },
        { id: 'CR104', name: 'Classroom 104', type: 'classroom', floor: 1, x: 490, y: 40, width: 100, height: 70, capacity: 40, available: true },
        
        // TOP CORNERS - Faculty at corners
        { id: 'FA101', name: 'Faculty Wing A', type: 'faculty', floor: 1, x: 40, y: 40, width: 110, height: 70, capacity: 12 },
        { id: 'FA102', name: 'Faculty Wing B', type: 'faculty', floor: 1, x: 600, y: 40, width: 110, height: 70, capacity: 12 },
        
        // LEFT EDGE - Against left border
        { id: 'CL101', name: 'Computer Lab 1', type: 'lab', floor: 1, x: 40, y: 120, width: 110, height: 80, capacity: 30, available: true },
        { id: 'CR105', name: 'Classroom 105', type: 'classroom', floor: 1, x: 40, y: 210, width: 110, height: 80, capacity: 35, available: true },
        { id: 'CR106', name: 'Classroom 106', type: 'classroom', floor: 1, x: 40, y: 300, width: 110, height: 80, capacity: 35, available: false },
        { id: 'HL101', name: 'Hardware Lab', type: 'lab', floor: 1, x: 40, y: 390, width: 110, height: 80, capacity: 25, available: true },
        
        // RIGHT EDGE - Against right border
        { id: 'CL102', name: 'Computer Lab 2', type: 'lab', floor: 1, x: 600, y: 120, width: 110, height: 80, capacity: 30, available: false },
        { id: 'CR107', name: 'Classroom 107', type: 'classroom', floor: 1, x: 600, y: 210, width: 110, height: 80, capacity: 35, available: true },
        { id: 'CR108', name: 'Classroom 108', type: 'classroom', floor: 1, x: 600, y: 300, width: 110, height: 80, capacity: 35, available: true },
        { id: 'SR101', name: 'Seminar Room', type: 'classroom', floor: 1, x: 600, y: 390, width: 110, height: 80, capacity: 50, available: true },
        
        // CENTRAL CANTEEN - In the middle
        { id: 'CANTEEN', name: 'Central Canteen', type: 'facility', floor: 1, x: 300, y: 240, width: 150, height: 150, capacity: 200, available: true },
        
        // INNER CORRIDOR - Forms square around canteen
        { id: 'CORR-TOP', name: 'Corridor', type: 'corridor', floor: 1, x: 160, y: 220, width: 430, height: 10 },
        { id: 'CORR-BOTTOM', name: 'Corridor', type: 'corridor', floor: 1, x: 160, y: 400, width: 430, height: 10 },
        { id: 'CORR-LEFT', name: 'Corridor', type: 'corridor', floor: 1, x: 160, y: 120, width: 10, height: 360 },
        { id: 'CORR-RIGHT', name: 'Corridor', type: 'corridor', floor: 1, x: 580, y: 120, width: 10, height: 360 },
        
        // BOTTOM EDGE - Against bottom border
        { id: 'CR109', name: 'Classroom 109', type: 'classroom', floor: 1, x: 160, y: 520, width: 100, height: 70, capacity: 40, available: false },
        { id: 'ENTRANCE1', name: 'Main Entrance', type: 'entrance', floor: 1, x: 270, y: 520, width: 100, height: 70 },
        { id: 'CR110', name: 'Classroom 110', type: 'classroom', floor: 1, x: 380, y: 520, width: 100, height: 70, capacity: 40, available: true },
        { id: 'CR111', name: 'Classroom 111', type: 'classroom', floor: 1, x: 490, y: 520, width: 100, height: 70, capacity: 40, available: true },
        
        // BOTTOM CORNERS - Admin at corners
        { id: 'ADMIN', name: 'Admin Office', type: 'admin', floor: 1, x: 40, y: 480, width: 110, height: 110, capacity: 15 },
        { id: 'DEAN', name: 'Dean Office', type: 'admin', floor: 1, x: 600, y: 480, width: 110, height: 110, capacity: 10 },
        
        // FACILITIES - Inside corners
        { id: 'LIFT1', name: 'Lift', type: 'lift', floor: 1, x: 180, y: 250, width: 30, height: 30 },
        { id: 'STAIRS1', name: 'Stairs', type: 'stairs', floor: 1, x: 540, y: 250, width: 30, height: 30 },
        { id: 'TOILET1', name: 'Washroom M', type: 'facility', floor: 1, x: 180, y: 360, width: 30, height: 30 },
        { id: 'TOILET2', name: 'Washroom F', type: 'facility', floor: 1, x: 540, y: 360, width: 30, height: 30 },
      ]
    },
    {
      floor: 2,
      name: '2nd Floor',
      rooms: [
        // TOP EDGE - Against top border
        { id: 'LH201', name: 'Lecture Hall 201', type: 'classroom', floor: 2, x: 160, y: 40, width: 100, height: 70, capacity: 60, available: true },
        { id: 'LH202', name: 'Lecture Hall 202', type: 'classroom', floor: 2, x: 270, y: 40, width: 100, height: 70, capacity: 60, available: true },
        { id: 'LH203', name: 'Lecture Hall 203', type: 'classroom', floor: 2, x: 380, y: 40, width: 100, height: 70, capacity: 60, available: false },
        { id: 'CR201', name: 'Classroom 201', type: 'classroom', floor: 2, x: 490, y: 40, width: 100, height: 70, capacity: 45, available: true },
        
        // TOP CORNERS - Faculty at corners
        { id: 'FA201', name: 'Faculty Wing C', type: 'faculty', floor: 2, x: 40, y: 40, width: 110, height: 70, capacity: 10 },
        { id: 'FA202', name: 'Faculty Wing D', type: 'faculty', floor: 2, x: 600, y: 40, width: 110, height: 70, capacity: 10 },
        
        // LEFT EDGE - Against left border
        { id: 'AL201', name: 'AI/ML Lab', type: 'lab', floor: 2, x: 40, y: 120, width: 110, height: 80, capacity: 40, available: true },
        { id: 'CR202', name: 'Classroom 202', type: 'classroom', floor: 2, x: 40, y: 210, width: 110, height: 80, capacity: 45, available: false },
        { id: 'CR203', name: 'Classroom 203', type: 'classroom', floor: 2, x: 40, y: 300, width: 110, height: 80, capacity: 45, available: true },
        { id: 'SH201', name: 'Seminar Hall A', type: 'classroom', floor: 2, x: 40, y: 390, width: 110, height: 80, capacity: 80, available: true },
        
        // RIGHT EDGE - Against right border
        { id: 'AL202', name: 'Research Lab', type: 'lab', floor: 2, x: 600, y: 120, width: 110, height: 80, capacity: 40, available: false },
        { id: 'CR204', name: 'Classroom 204', type: 'classroom', floor: 2, x: 600, y: 210, width: 110, height: 80, capacity: 45, available: true },
        { id: 'CR205', name: 'Classroom 205', type: 'classroom', floor: 2, x: 600, y: 300, width: 110, height: 80, capacity: 45, available: true },
        { id: 'SH202', name: 'Seminar Hall B', type: 'classroom', floor: 2, x: 600, y: 390, width: 110, height: 80, capacity: 80, available: false },
        
        // CENTRAL STUDENT HUB - In the middle
        { id: 'SHUB', name: 'Student Hub', type: 'facility', floor: 2, x: 300, y: 240, width: 150, height: 150, capacity: 150, available: true },
        
        // INNER CORRIDOR - Forms square around hub
        { id: 'CORR2-TOP', name: 'Corridor', type: 'corridor', floor: 2, x: 160, y: 220, width: 430, height: 10 },
        { id: 'CORR2-BOTTOM', name: 'Corridor', type: 'corridor', floor: 2, x: 160, y: 400, width: 430, height: 10 },
        { id: 'CORR2-LEFT', name: 'Corridor', type: 'corridor', floor: 2, x: 160, y: 120, width: 10, height: 360 },
        { id: 'CORR2-RIGHT', name: 'Corridor', type: 'corridor', floor: 2, x: 580, y: 120, width: 10, height: 360 },
        
        // BOTTOM EDGE - Against bottom border
        { id: 'DR201', name: 'Discussion Rm 201', type: 'classroom', floor: 2, x: 160, y: 520, width: 100, height: 70, capacity: 20, available: true },
        { id: 'DR202', name: 'Discussion Rm 202', type: 'classroom', floor: 2, x: 270, y: 520, width: 100, height: 70, capacity: 20, available: false },
        { id: 'DR203', name: 'Discussion Rm 203', type: 'classroom', floor: 2, x: 380, y: 520, width: 100, height: 70, capacity: 20, available: true },
        { id: 'DR204', name: 'Discussion Rm 204', type: 'classroom', floor: 2, x: 490, y: 520, width: 100, height: 70, capacity: 20, available: true },
        
        // BOTTOM CORNERS - Conference rooms at corners
        { id: 'CONF201', name: 'Conference Hall', type: 'admin', floor: 2, x: 40, y: 480, width: 110, height: 110, capacity: 50 },
        { id: 'BOARD', name: 'Board Room', type: 'admin', floor: 2, x: 600, y: 480, width: 110, height: 110, capacity: 30 },
        
        // FACILITIES - Inside corners
        { id: 'LIFT2', name: 'Lift', type: 'lift', floor: 2, x: 180, y: 250, width: 30, height: 30 },
        { id: 'STAIRS2', name: 'Stairs', type: 'stairs', floor: 2, x: 540, y: 250, width: 30, height: 30 },
        { id: 'TOILET3', name: 'Washroom M', type: 'facility', floor: 2, x: 180, y: 360, width: 30, height: 30 },
        { id: 'TOILET4', name: 'Washroom F', type: 'facility', floor: 2, x: 540, y: 360, width: 30, height: 30 },
      ]
    },
    {
      floor: 3,
      name: '3rd Floor',
      rooms: [
        // TOP EDGE - Against top border
        { id: 'SR301', name: 'Study Room 301', type: 'classroom', floor: 3, x: 160, y: 40, width: 100, height: 70, capacity: 15, available: true },
        { id: 'SR302', name: 'Study Room 302', type: 'classroom', floor: 3, x: 270, y: 40, width: 100, height: 70, capacity: 15, available: false },
        { id: 'SR303', name: 'Study Room 303', type: 'classroom', floor: 3, x: 380, y: 40, width: 100, height: 70, capacity: 15, available: true },
        { id: 'SR304', name: 'Study Room 304', type: 'classroom', floor: 3, x: 490, y: 40, width: 100, height: 70, capacity: 15, available: true },
        
        // TOP CORNERS - Research wings at corners
        { id: 'RO301', name: 'Research Wing A', type: 'faculty', floor: 3, x: 40, y: 40, width: 110, height: 70, capacity: 8 },
        { id: 'RO302', name: 'Research Wing B', type: 'faculty', floor: 3, x: 600, y: 40, width: 110, height: 70, capacity: 8 },
        
        // LEFT EDGE - Against left border
        { id: 'DL301', name: 'Digital Library', type: 'facility', floor: 3, x: 40, y: 120, width: 110, height: 80, capacity: 40, available: true },
        { id: 'RA301', name: 'Reading Area A', type: 'classroom', floor: 3, x: 40, y: 210, width: 110, height: 80, capacity: 30, available: true },
        { id: 'RA302', name: 'Reading Area B', type: 'classroom', floor: 3, x: 40, y: 300, width: 110, height: 80, capacity: 30, available: true },
        { id: 'GS301', name: 'Group Study A', type: 'classroom', floor: 3, x: 40, y: 390, width: 110, height: 80, capacity: 20, available: true },
        
        // RIGHT EDGE - Against right border
        { id: 'MC301', name: 'Media Center', type: 'facility', floor: 3, x: 600, y: 120, width: 110, height: 80, capacity: 40, available: true },
        { id: 'RA303', name: 'Reading Area C', type: 'classroom', floor: 3, x: 600, y: 210, width: 110, height: 80, capacity: 30, available: true },
        { id: 'RA304', name: 'Reading Area D', type: 'classroom', floor: 3, x: 600, y: 300, width: 110, height: 80, capacity: 30, available: true },
        { id: 'GS302', name: 'Group Study B', type: 'classroom', floor: 3, x: 600, y: 390, width: 110, height: 80, capacity: 20, available: false },
        
        // CENTRAL LIBRARY - In the middle
        { id: 'LIBRARY', name: 'Central Library', type: 'facility', floor: 3, x: 300, y: 240, width: 150, height: 150, capacity: 300, available: true },
        
        // INNER CORRIDOR - Forms square around library
        { id: 'CORR3-TOP', name: 'Corridor', type: 'corridor', floor: 3, x: 160, y: 220, width: 430, height: 10 },
        { id: 'CORR3-BOTTOM', name: 'Corridor', type: 'corridor', floor: 3, x: 160, y: 400, width: 430, height: 10 },
        { id: 'CORR3-LEFT', name: 'Corridor', type: 'corridor', floor: 3, x: 160, y: 120, width: 10, height: 360 },
        { id: 'CORR3-RIGHT', name: 'Corridor', type: 'corridor', floor: 3, x: 580, y: 120, width: 10, height: 360 },
        
        // BOTTOM EDGE - Against bottom border
        { id: 'RC301', name: 'Research Ctr A', type: 'admin', floor: 3, x: 160, y: 520, width: 100, height: 70, capacity: 25, available: true },
        { id: 'RC302', name: 'Research Ctr B', type: 'admin', floor: 3, x: 270, y: 520, width: 100, height: 70, capacity: 25, available: false },
        { id: 'RC303', name: 'Research Ctr C', type: 'admin', floor: 3, x: 380, y: 520, width: 100, height: 70, capacity: 25, available: true },
        { id: 'RC304', name: 'Research Ctr D', type: 'admin', floor: 3, x: 490, y: 520, width: 100, height: 70, capacity: 25, available: true },
        
        // BOTTOM CORNERS - Library admin at corners
        { id: 'LIBADMIN', name: 'Library Admin', type: 'admin', floor: 3, x: 40, y: 480, width: 110, height: 110, capacity: 10 },
        { id: 'ARCHIVE', name: 'Archives', type: 'admin', floor: 3, x: 600, y: 480, width: 110, height: 110, capacity: 5 },
        
        // FACILITIES - Inside corners
        { id: 'LIFT3', name: 'Lift', type: 'lift', floor: 3, x: 180, y: 250, width: 30, height: 30 },
        { id: 'STAIRS3', name: 'Stairs', type: 'stairs', floor: 3, x: 540, y: 250, width: 30, height: 30 },
        { id: 'TOILET5', name: 'Washroom M', type: 'facility', floor: 3, x: 180, y: 360, width: 30, height: 30 },
        { id: 'TOILET6', name: 'Washroom F', type: 'facility', floor: 3, x: 540, y: 360, width: 30, height: 30 },
      ]
    }
  ])

  const currentFloorPlan = floors.find(f => f.floor === currentFloor) || floors[0]
  
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

  // Update user position when setting current location
  useEffect(() => {
    if (currentLocation) {
      setUserPosition({
        x: currentLocation.x + currentLocation.width / 2,
        y: currentLocation.y + currentLocation.height / 2
      })
    }
  }, [currentLocation])

  // Animate wandering character along corridors
  useEffect(() => {
    if (viewMode !== 'map') return

    const corridorPath = [
      { x: 170, y: 230 },  // Top corridor left
      { x: 300, y: 230 },  // Top corridor middle
      { x: 570, y: 230 },  // Top corridor right
      { x: 570, y: 315 },  // Right corridor middle
      { x: 570, y: 400 },  // Bottom corridor right
      { x: 375, y: 400 },  // Bottom corridor middle
      { x: 170, y: 400 },  // Bottom corridor left
      { x: 170, y: 315 },  // Left corridor middle
    ]

    let currentPoint = 0
    
    const moveCharacter = () => {
      const nextPoint = (currentPoint + 1) % corridorPath.length
      setWandererPosition(corridorPath[nextPoint])
      currentPoint = nextPoint
    }

    const interval = setInterval(moveCharacter, 4000) // Move every 4 seconds (slow)

    return () => clearInterval(interval)
  }, [viewMode, currentFloor])

  if (!user) return null

  const getRoomStyle = (room: Room) => {
    const isSelected = selectedRoom?.id === room.id
    const baseStyle = "absolute flex flex-col items-center justify-center text-center transition-all duration-300 cursor-pointer rounded-lg"
    
    let bgColor = ''
    let borderStyle = ''
    let hoverEffect = 'hover:shadow-xl hover:scale-105 hover:z-10'
    let extraStyle = ''
    
    if (room.type === 'corridor') {
      bgColor = 'bg-gradient-to-r from-gray-100 to-gray-50'
      borderStyle = 'border border-gray-300'
      hoverEffect = ''
      extraStyle = 'opacity-50'
    } else if (room.type === 'entrance') {
      bgColor = 'bg-gradient-to-br from-green-400 to-emerald-500'
      borderStyle = 'border-2 border-green-600 shadow-lg'
      extraStyle = 'text-white font-bold'
    } else if (isSelected) {
      bgColor = 'bg-gradient-to-br from-blue-500 to-orange-500 text-white'
      borderStyle = 'border-3 border-white shadow-2xl ring-4 ring-blue-400/50'
      extraStyle = 'z-20'
    } else {
      switch (room.type) {
        case 'classroom':
          bgColor = room.available 
            ? 'bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200' 
            : 'bg-gradient-to-br from-red-50 to-red-100 hover:from-red-100 hover:to-red-200'
          borderStyle = room.available 
            ? 'border-2 border-blue-400 shadow-md' 
            : 'border-2 border-red-400 shadow-md'
          break
        case 'lab':
          bgColor = room.available 
            ? 'bg-gradient-to-br from-orange-50 to-amber-100 hover:from-orange-100 hover:to-amber-200' 
            : 'bg-gradient-to-br from-red-50 to-red-100 hover:from-red-100 hover:to-red-200'
          borderStyle = room.available 
            ? 'border-2 border-orange-400 shadow-md' 
            : 'border-2 border-red-400 shadow-md'
          break
        case 'faculty':
          bgColor = 'bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200'
          borderStyle = 'border-2 border-purple-400 shadow-md'
          break
        case 'admin':
          bgColor = 'bg-gradient-to-br from-emerald-50 to-green-100 hover:from-emerald-100 hover:to-green-200'
          borderStyle = 'border-2 border-emerald-400 shadow-md'
          break
        case 'facility':
          bgColor = 'bg-gradient-to-br from-slate-50 to-gray-100 hover:from-slate-100 hover:to-gray-200'
          borderStyle = 'border-2 border-slate-400 shadow-md'
          break
        case 'lift':
          bgColor = 'bg-gradient-to-br from-yellow-100 to-amber-200 hover:from-yellow-200 hover:to-amber-300'
          borderStyle = 'border-2 border-yellow-500 shadow-md'
          extraStyle = 'animate-pulse'
          break
        case 'stairs':
          bgColor = 'bg-gradient-to-br from-indigo-50 to-blue-100 hover:from-indigo-100 hover:to-blue-200'
          borderStyle = 'border-2 border-indigo-400 shadow-md'
          break
        default:
          bgColor = 'bg-white hover:bg-gray-50'
          borderStyle = 'border-2 border-gray-300 shadow-sm'
      }
    }
    
    return `${baseStyle} ${bgColor} ${borderStyle} ${hoverEffect} ${extraStyle}`
  }

  const getRoomIcon = (type: string) => {
    switch (type) {
      case 'classroom': return '🏫'
      case 'lab': return '💻'
      case 'faculty': return '👨‍🏫'
      case 'admin': return '🏢'
      case 'facility': return '🚻'
      case 'lift': return '🛗'
      case 'stairs': return '🪜'
      case 'corridor': return ''
      case 'entrance': return '🚪'
      default: return '📍'
    }
  }

  const handleRoomClick = (room: Room) => {
    if (room.type !== 'corridor') {
      setSelectedRoom(room)
      setShowRoomInfo(true)
    }
  }

  const handleNavigation = () => {
    if (selectedRoom && currentLocation) {
      setNavigationPath([currentLocation.id, selectedRoom.id])
      alert(`Navigating from ${currentLocation.name} to ${selectedRoom.name}`)
    } else if (selectedRoom) {
      alert('Please set your current location first')
    }
  }

  const handleZoom = (delta: number) => {
    const newZoom = Math.max(50, Math.min(200, zoomLevel + delta))
    setZoomLevel(newZoom)
  }

  const searchRooms = () => {
    if (!searchQuery) return []
    
    const allRooms = floors.flatMap(floor => 
      floor.rooms.filter(room => room.type !== 'corridor').map(room => ({ ...room, floorName: floor.name }))
    )
    
    return allRooms.filter(room => 
      room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.type.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }

  const filteredRooms = searchQuery ? searchRooms() : currentFloorPlan.rooms.filter(r => r.type !== 'corridor')

  return (
    <Layout role="student">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-navy">Campus Navigation</h1>
            <p className="text-navy/70 mt-2">Interactive floor maps • Find your way around campus</p>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={() => setViewMode('map')}
              className={`px-6 py-2.5 rounded-full font-semibold transition-all duration-300 ${
                viewMode === 'map'
                  ? 'bg-gradient-to-r from-blue-500 to-orange-500 text-white shadow-lg'
                  : 'bg-white/50 text-navy border border-white/50'
              }`}
            >
              🗺️ Map View
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-6 py-2.5 rounded-full font-semibold transition-all duration-300 ${
                viewMode === 'list'
                  ? 'bg-gradient-to-r from-blue-500 to-orange-500 text-white shadow-lg'
                  : 'bg-white/50 text-navy border border-white/50'
              }`}
            >
              📋 List View
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white/40 backdrop-blur-xl rounded-2xl p-4 border border-white/50 shadow-lg">
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Search for rooms, labs, or facilities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-full bg-white/50 border border-white/50 focus:outline-none focus:border-blue-500 transition-colors"
            />
            <button className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-orange-500 text-white rounded-full hover:from-blue-600 hover:to-orange-600 transition-all duration-300 font-semibold">
              🔍 Search
            </button>
            {currentLocation && (
              <button
                onClick={() => setCurrentLocation(null)}
                className="px-4 py-2.5 bg-white/50 text-navy rounded-full hover:bg-white/70 transition-all duration-300 font-medium border border-white/50"
              >
                📍 Clear Location
              </button>
            )}
          </div>
          {currentLocation && (
            <div className="mt-3 flex items-center gap-2 text-sm text-navy/70">
              <span>📍 Current Location:</span>
              <span className="font-semibold text-navy">{currentLocation.name}</span>
            </div>
          )}
        </div>

        {viewMode === 'map' ? (
          <>
            {/* Floor Selector */}
            <div className="bg-white/40 backdrop-blur-xl rounded-2xl p-4 border border-white/50 shadow-lg">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setCurrentFloor(Math.max(1, currentFloor - 1))}
                  disabled={currentFloor === 1}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                    currentFloor === 1
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-500 to-orange-500 text-white hover:from-blue-600 hover:to-orange-600 shadow-md'
                  }`}
                >
                  ◀
                </button>
                
                <div className="flex gap-3">
                  {floors.map(floor => (
                    <button
                      key={floor.floor}
                      onClick={() => setCurrentFloor(floor.floor)}
                      className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
                        currentFloor === floor.floor
                          ? 'bg-gradient-to-r from-blue-500 to-orange-500 text-white shadow-md'
                          : 'bg-white/50 text-navy hover:bg-white/70 border border-white/50'
                      }`}
                    >
                      {floor.name}
                    </button>
                  ))}
                </div>
                
                <button
                  onClick={() => setCurrentFloor(Math.min(floors.length, currentFloor + 1))}
                  disabled={currentFloor === floors.length}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                    currentFloor === floors.length
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-500 to-orange-500 text-white hover:from-blue-600 hover:to-orange-600 shadow-md'
                  }`}
                >
                  ▶
                </button>
              </div>
            </div>

            {/* Map Container */}
            <div className="bg-white/40 backdrop-blur-xl rounded-2xl border border-white/50 shadow-lg overflow-hidden">
              {/* Map Title */}
              <div className="bg-gradient-to-r from-blue-500/10 to-orange-500/10 p-4 border-b border-white/30">
                <h3 className="text-lg font-bold text-navy">Floor Plan - {currentFloorPlan.name}</h3>
              </div>
              
              {/* Map Canvas - Full Screen */}
              <div 
                className="relative bg-gradient-to-br from-gray-50 to-white overflow-auto shadow-inner border-2 border-gray-200 flex items-center justify-center"
                style={{ height: 'calc(100vh - 280px)' }}
              >
                <div 
                  className="relative flex items-center justify-center"
                  style={{ 
                    width: '750px',
                    height: '630px',
                    transform: `scale(${zoomLevel / 100})`,
                    transformOrigin: 'center',
                    transition: 'transform 0.3s ease'
                  }}
                >
                  {/* Enhanced Grid Pattern Background - Full Width */}
                  <svg className="absolute inset-0" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
                    <defs>
                      <pattern id="smallGrid" width="10" height="10" patternUnits="userSpaceOnUse">
                        <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#f3f4f6" strokeWidth="0.5"/>
                      </pattern>
                      <pattern id="largeGrid" width="50" height="50" patternUnits="userSpaceOnUse">
                        <rect width="50" height="50" fill="url(#smallGrid)" />
                        <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#e5e7eb" strokeWidth="1"/>
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="white" />
                    <rect width="100%" height="100%" fill="url(#largeGrid)" />
                  </svg>
                  
                  {/* Floor Boundary - Adjusted for centered view */}
                  <div className="absolute inset-0 pointer-events-none">
                    <svg width="100%" height="100%" viewBox="0 0 750 630" preserveAspectRatio="xMidYMid meet">
                      <rect x="20" y="20" width="710" height="590" fill="none" stroke="#1e293b" strokeWidth="2" rx="8" opacity="0.3"/>
                      <rect x="25" y="25" width="700" height="580" fill="none" stroke="#1e293b" strokeWidth="1" rx="6" opacity="0.2"/>
                    </svg>
                  </div>
                  
                  {/* Floor Label - positioned at top center */}
                  <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-white px-8 py-3 rounded-full shadow-lg border-2 border-blue-500 z-50">
                    <span className="text-lg font-bold text-navy">{currentFloorPlan.name} - Floor Plan</span>
                  </div>
                  
                  {/* Rooms */}
                  {currentFloorPlan.rooms.map(room => (
                    <div
                      key={room.id}
                      onClick={() => handleRoomClick(room)}
                      className={getRoomStyle(room)}
                      style={{
                        left: `${room.x}px`,
                        top: `${room.y}px`,
                        width: `${room.width}px`,
                        height: `${room.height}px`,
                      }}
                    >
                      {room.type !== 'corridor' && (
                        <>
                          {/* Room Icon */}
                          <div className={`text-2xl mb-1 ${room.type === 'entrance' ? 'text-3xl' : ''}`}>
                            {getRoomIcon(room.type)}
                          </div>
                          
                          {/* Room Name */}
                          <span className={`font-bold leading-tight px-1 ${
                            selectedRoom?.id === room.id ? 'text-white text-xs' : 
                            room.type === 'entrance' ? 'text-white text-xs' :
                            'text-gray-800 text-[10px]'
                          }`}>
                            {room.name}
                          </span>
                          
                          {/* Room Details */}
                          {room.capacity && room.type !== 'entrance' && (
                            <span className={`text-[9px] mt-0.5 ${
                              selectedRoom?.id === room.id ? 'text-white/90' : 'text-gray-600'
                            }`}>
                              Capacity: {room.capacity}
                            </span>
                          )}
                          
                          {/* Availability Badge */}
                          {room.available !== undefined && 
                           room.type !== 'facility' && 
                           room.type !== 'lift' && 
                           room.type !== 'stairs' && 
                           room.type !== 'entrance' && (
                            <div className={`mt-1 px-2 py-0.5 rounded-full text-[9px] font-bold ${
                              room.available 
                                ? 'bg-green-500 text-white shadow-sm' 
                                : 'bg-red-500 text-white shadow-sm'
                            }`}>
                              {room.available ? 'AVAILABLE' : 'OCCUPIED'}
                            </div>
                          )}
                        </>
                      )}
                      
                      {/* Corridor Label */}
                      {room.type === 'corridor' && (
                        <div className="flex items-center justify-center h-full">
                          <div className="w-full h-0.5 bg-gray-400"></div>
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {/* Navigation Path */}
                  {navigationPath.length > 0 && currentLocation && selectedRoom && (
                    <svg className="absolute inset-0 pointer-events-none" style={{ width: '750px', height: '630px' }}>
                      <line
                        x1={currentLocation.x + currentLocation.width/2}
                        y1={currentLocation.y + currentLocation.height/2}
                        x2={selectedRoom.x + selectedRoom.width/2}
                        y2={selectedRoom.y + selectedRoom.height/2}
                        stroke="url(#pathGradient)"
                        strokeWidth="3"
                        strokeDasharray="5,5"
                        className="animate-pulse"
                      />
                      <defs>
                        <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#3B82F6" />
                          <stop offset="100%" stopColor="#FB923C" />
                        </linearGradient>
                      </defs>
                    </svg>
                  )}
                  
                  {/* User Position Character */}
                  {currentLocation && (
                    <div 
                      className="absolute z-30 pointer-events-none"
                      style={{
                        left: `${userPosition.x - 15}px`,
                        top: `${userPosition.y - 15}px`,
                        animation: 'bounce 2s infinite, walk 8s infinite'
                      }}
                    >
                      <div className="relative">
                        {/* Character Body */}
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-orange-500 rounded-full shadow-lg animate-pulse">
                          {/* Character Head */}
                          <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full shadow-md">
                            {/* Face */}
                            <div className="absolute top-1.5 left-1 w-1 h-1 bg-gray-800 rounded-full"></div>
                            <div className="absolute top-1.5 right-1 w-1 h-1 bg-gray-800 rounded-full"></div>
                            <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-0.5 bg-gray-800 rounded-full"></div>
                          </div>
                          {/* Arms */}
                          <div className="absolute top-2 -left-1 w-1.5 h-3 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full"></div>
                          <div className="absolute top-2 -right-1 w-1.5 h-3 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full"></div>
                          {/* Legs */}
                          <div className="absolute bottom-0 left-1.5 w-1.5 h-2 bg-gradient-to-b from-gray-700 to-gray-800 rounded-b-full"></div>
                          <div className="absolute bottom-0 right-1.5 w-1.5 h-2 bg-gradient-to-b from-gray-700 to-gray-800 rounded-b-full"></div>
                        </div>
                        {/* Shadow */}
                        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-6 h-1 bg-black/20 rounded-full blur-sm"></div>
                        {/* Location Label */}
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap bg-white/90 px-2 py-0.5 rounded-full text-xs font-semibold text-navy shadow-md">
                          You are here
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Wandering Character - Always visible, moves in corridors */}
                  <div 
                    className="absolute z-25 pointer-events-none transition-all duration-[4000ms] ease-in-out"
                    style={{
                      left: `${wandererPosition.x - 10}px`,
                      top: `${wandererPosition.y - 10}px`,
                    }}
                  >
                    <div className="relative">
                      {/* Simple Character */}
                      <div className="w-5 h-5 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full shadow-md relative">
                        {/* Simple head */}
                        <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-gradient-to-br from-pink-300 to-pink-400 rounded-full"></div>
                        {/* Walking animation legs */}
                        <div className="absolute bottom-0 left-0.5 w-1 h-1.5 bg-purple-600 rounded-b animate-walk-left"></div>
                        <div className="absolute bottom-0 right-0.5 w-1 h-1.5 bg-purple-600 rounded-b animate-walk-right"></div>
                      </div>
                      {/* Shadow */}
                      <div className="absolute -bottom-0.5 left-1/2 transform -translate-x-1/2 w-4 h-0.5 bg-black/10 rounded-full blur-sm"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Zoom Controls */}
              <div className="flex items-center justify-center gap-4 p-4 border-t border-white/30 bg-white/20">
                <button
                  onClick={() => handleZoom(-10)}
                  className="w-10 h-10 rounded-full bg-white/70 text-navy hover:bg-white transition-all duration-300 flex items-center justify-center font-bold shadow-md"
                >
                  −
                </button>
                <div className="px-4 py-2 bg-white/70 rounded-full shadow-md">
                  <span className="font-bold text-navy">{zoomLevel}%</span>
                </div>
                <button
                  onClick={() => handleZoom(10)}
                  className="w-10 h-10 rounded-full bg-white/70 text-navy hover:bg-white transition-all duration-300 flex items-center justify-center font-bold shadow-md"
                >
                  +
                </button>
                <button
                  onClick={() => setZoomLevel(100)}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-orange-500 text-white rounded-full hover:from-blue-600 hover:to-orange-600 transition-all duration-300 font-medium shadow-md"
                >
                  🔄 Reset
                </button>
              </div>
            </div>

            {/* Legend */}
            <div className="bg-white/40 backdrop-blur-xl rounded-2xl p-6 border border-white/50 shadow-lg">
              <h3 className="font-bold text-navy mb-4 text-lg">Map Legend</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-blue-50 border-2 border-blue-300 rounded"></div>
                  <span className="text-sm text-navy/70">Classroom (Available)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-orange-50 border-2 border-orange-300 rounded"></div>
                  <span className="text-sm text-navy/70">Laboratory</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-purple-50 border-2 border-purple-300 rounded"></div>
                  <span className="text-sm text-navy/70">Faculty Area</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-50 border-2 border-green-300 rounded"></div>
                  <span className="text-sm text-navy/70">Admin Office</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-red-50 border-2 border-red-300 rounded"></div>
                  <span className="text-sm text-navy/70">Occupied</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-yellow-50 border-2 border-yellow-400 rounded"></div>
                  <span className="text-sm text-navy/70">Lift/Stairs</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-gray-50 border-2 border-gray-300 rounded"></div>
                  <span className="text-sm text-navy/70">Facilities</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-orange-500 rounded"></div>
                  <span className="text-sm text-navy/70">Selected Room</span>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* List View */
          <div className="bg-white/40 backdrop-blur-xl rounded-2xl border border-white/50 shadow-lg p-6">
            <div className="space-y-4">
              {searchQuery && (
                <div className="text-sm text-navy/70 mb-4">
                  Found {filteredRooms.length} results for &quot;{searchQuery}&quot;
                </div>
              )}
              
              {filteredRooms.map(room => (
                <div
                  key={room.id}
                  onClick={() => handleRoomClick(room)}
                  className="bg-white/50 rounded-xl p-4 hover:bg-white/70 transition-all duration-300 cursor-pointer border border-white/50 hover:shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{getRoomIcon(room.type)}</span>
                      <div>
                        <h3 className="font-semibold text-navy">{room.name}</h3>
                        <p className="text-sm text-navy/60">
                          {currentFloorPlan.name} • {room.type.charAt(0).toUpperCase() + room.type.slice(1).replace('-', ' ')}
                          {room.capacity && ` • Capacity: ${room.capacity}`}
                        </p>
                      </div>
                    </div>
                    {room.available !== undefined && (
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        room.available 
                          ? 'bg-green-500/20 text-green-600' 
                          : 'bg-red-500/20 text-red-600'
                      }`}>
                        {room.available ? 'Available' : 'Occupied'}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Room Info Modal */}
        {showRoomInfo && selectedRoom && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end justify-center z-50 p-4">
            <div className="bg-white/95 backdrop-blur-xl rounded-t-3xl w-full max-w-2xl animate-slide-up shadow-2xl">
              <div className="p-6">
                <div className="w-16 h-1 bg-gray-300 rounded-full mx-auto mb-4"></div>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{getRoomIcon(selectedRoom.type)}</span>
                    <div>
                      <h2 className="text-2xl font-bold text-navy">{selectedRoom.name}</h2>
                      <p className="text-navy/60">{currentFloorPlan.name}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setShowRoomInfo(false)
                      setSelectedRoom(null)
                    }}
                    className="text-navy/60 hover:text-navy text-2xl"
                  >
                    ×
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-blue-500/10 to-orange-500/10 rounded-xl p-3 border border-white/50">
                      <p className="text-sm text-navy/60">Type</p>
                      <p className="font-semibold text-navy capitalize">{selectedRoom.type.replace('-', ' ')}</p>
                    </div>
                    {selectedRoom.capacity && (
                      <div className="bg-gradient-to-br from-blue-500/10 to-orange-500/10 rounded-xl p-3 border border-white/50">
                        <p className="text-sm text-navy/60">Capacity</p>
                        <p className="font-semibold text-navy">{selectedRoom.capacity} people</p>
                      </div>
                    )}
                    {selectedRoom.available !== undefined && (
                      <div className="bg-gradient-to-br from-blue-500/10 to-orange-500/10 rounded-xl p-3 border border-white/50">
                        <p className="text-sm text-navy/60">Status</p>
                        <p className={`font-semibold ${selectedRoom.available ? 'text-green-600' : 'text-red-600'}`}>
                          {selectedRoom.available ? 'Available Now' : 'Currently Occupied'}
                        </p>
                      </div>
                    )}
                  </div>

                  {selectedRoom.amenities && selectedRoom.amenities.length > 0 && (
                    <div>
                      <p className="text-sm text-navy/60 mb-2">Amenities</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedRoom.amenities.map(amenity => (
                          <span key={amenity} className="px-3 py-1 bg-white/50 text-navy rounded-full text-sm border border-white/50">
                            {amenity}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => {
                        setCurrentLocation(selectedRoom)
                        setShowRoomInfo(false)
                      }}
                      className="flex-1 bg-white/50 text-navy py-3 rounded-full hover:bg-white/70 transition-all duration-300 font-semibold border border-white/50"
                    >
                      📍 Set as Current Location
                    </button>
                    <button
                      onClick={handleNavigation}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-orange-500 text-white py-3 rounded-full hover:from-blue-600 hover:to-orange-600 transition-all duration-300 font-semibold shadow-lg"
                    >
                      🧭 Navigate Here
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        @keyframes walk {
          0% {
            transform: rotate(0deg);
          }
          25% {
            transform: rotate(-5deg);
          }
          75% {
            transform: rotate(5deg);
          }
          100% {
            transform: rotate(0deg);
          }
        }
        
        @keyframes walk-left {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-2px);
          }
        }
        
        @keyframes walk-right {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-2px);
          }
        }
        
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
        
        .animate-walk-left {
          animation: walk-left 0.5s infinite;
        }
        
        .animate-walk-right {
          animation: walk-right 0.5s infinite;
          animation-delay: 0.25s;
        }
      `}</style>
    </Layout>
  )
}