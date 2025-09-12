import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Layout from '@/components/Layout'

interface Club {
  id: string
  name: string
  logo: string
  members: number
  category: string
  description: string
}

interface Event {
  id: string
  clubId: string
  clubName: string
  clubLogo: string
  title: string
  image: string
  description: string
  date: string
  time: string
  venue: string
  registrations: number
  maxCapacity: number
  tags: string[]
  isLiked: boolean
  isRegistered: boolean
  postedTime: string
}

interface RegistrationForm {
  name: string
  email: string
  studentId: string
  phone: string
  year: string
  branch: string
  dietaryRestrictions: string
  additionalNotes: string
  emergencyContact: string
}

export default function EventsDiscovery() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<'feed' | 'clubs' | 'myevents'>('feed')
  const [selectedClub, setSelectedClub] = useState<Club | null>(null)
  const [showClubModal, setShowClubModal] = useState(false)
  const [showEventModal, setShowEventModal] = useState(false)
  const [showRegistrationModal, setShowRegistrationModal] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [filterCategory, setFilterCategory] = useState('all')
  const [registrationForm, setRegistrationForm] = useState<RegistrationForm>({
    name: '',
    email: '',
    studentId: '',
    phone: '',
    year: '',
    branch: '',
    dietaryRestrictions: '',
    additionalNotes: '',
    emergencyContact: ''
  })
  const [formErrors, setFormErrors] = useState<Partial<RegistrationForm>>({})

  // Mock data for clubs
  const [clubs] = useState<Club[]>([
    { id: '1', name: 'Tech Club', logo: '💻', members: 150, category: 'Technology', description: 'Exploring latest tech trends and innovations' },
    { id: '2', name: 'Photography Club', logo: '📸', members: 80, category: 'Arts', description: 'Capturing moments and creating memories' },
    { id: '3', name: 'Music Society', logo: '🎵', members: 120, category: 'Arts', description: 'Where melodies meet harmony' },
    { id: '4', name: 'Sports Club', logo: '⚽', members: 200, category: 'Sports', description: 'Fitness, fun, and friendship' },
    { id: '5', name: 'Debate Society', logo: '🎤', members: 60, category: 'Academic', description: 'Where ideas clash and minds grow' },
    { id: '6', name: 'Dance Crew', logo: '💃', members: 90, category: 'Arts', description: 'Express yourself through movement' },
    { id: '7', name: 'Eco Warriors', logo: '🌱', members: 70, category: 'Social', description: 'Making campus greener, one step at a time' },
    { id: '8', name: 'Coding Club', logo: '👨‍💻', members: 180, category: 'Technology', description: 'Code, create, innovate' },
  ])

  // Mock data for events (Instagram-like feed)
  const [events, setEvents] = useState<Event[]>([
    {
      id: '1',
      clubId: '1',
      clubName: 'Tech Club',
      clubLogo: '💻',
      title: 'AI/ML Workshop 2024',
      image: '🤖',
      description: 'Join us for an exciting workshop on Artificial Intelligence and Machine Learning! Learn from industry experts and build your first AI model.',
      date: 'Dec 20, 2024',
      time: '3:00 PM - 6:00 PM',
      venue: 'Tech Lab 301',
      registrations: 45,
      maxCapacity: 60,
      tags: ['AI', 'Workshop', 'Technology'],
      isLiked: false,
      isRegistered: false,
      postedTime: '2 hours ago'
    },
    {
      id: '2',
      clubId: '2',
      clubName: 'Photography Club',
      clubLogo: '📸',
      title: 'Golden Hour Photo Walk',
      image: '🌅',
      description: 'Capture the magic of golden hour! Join us for a photo walk around campus. Bring your camera or phone - all levels welcome!',
      date: 'Dec 15, 2024',
      time: '5:00 PM - 7:00 PM',
      venue: 'Main Campus Garden',
      registrations: 28,
      maxCapacity: 30,
      tags: ['Photography', 'Outdoor', 'Creative'],
      isLiked: true,
      isRegistered: false,
      postedTime: '5 hours ago'
    },
    {
      id: '3',
      clubId: '3',
      clubName: 'Music Society',
      clubLogo: '🎵',
      title: 'Winter Concert Night',
      image: '🎸',
      description: 'An evening of mesmerizing performances by our talented musicians. From classical to contemporary - experience it all!',
      date: 'Dec 22, 2024',
      time: '7:00 PM - 10:00 PM',
      venue: 'Main Auditorium',
      registrations: 180,
      maxCapacity: 200,
      tags: ['Music', 'Concert', 'Performance'],
      isLiked: false,
      isRegistered: true,
      postedTime: '1 day ago'
    },
    {
      id: '4',
      clubId: '4',
      clubName: 'Sports Club',
      clubLogo: '⚽',
      title: 'Inter-College Football Tournament',
      image: '🏆',
      description: 'Compete for glory! Register your team for the biggest football tournament of the year. Prizes worth $1000!',
      date: 'Dec 25-27, 2024',
      time: '9:00 AM onwards',
      venue: 'Sports Complex',
      registrations: 12,
      maxCapacity: 16,
      tags: ['Sports', 'Tournament', 'Competition'],
      isLiked: true,
      isRegistered: false,
      postedTime: '2 days ago'
    },
    {
      id: '5',
      clubId: '8',
      clubName: 'Coding Club',
      clubLogo: '👨‍💻',
      title: 'Hackathon 2024: Code for Good',
      image: '💡',
      description: '48-hour coding marathon! Build solutions for real-world problems. Amazing prizes and internship opportunities await!',
      date: 'Jan 5-7, 2025',
      time: 'All day event',
      venue: 'Innovation Hub',
      registrations: 85,
      maxCapacity: 100,
      tags: ['Hackathon', 'Coding', 'Competition'],
      isLiked: true,
      isRegistered: true,
      postedTime: '3 days ago'
    },
    {
      id: '6',
      clubId: '6',
      clubName: 'Dance Crew',
      clubLogo: '💃',
      title: 'Dance Battle Championship',
      image: '🕺',
      description: 'Show your moves! Solo and group categories open. Winners get to perform at the Annual Day celebration!',
      date: 'Dec 18, 2024',
      time: '4:00 PM - 8:00 PM',
      venue: 'Dance Studio',
      registrations: 35,
      maxCapacity: 50,
      tags: ['Dance', 'Competition', 'Performance'],
      isLiked: false,
      isRegistered: false,
      postedTime: '1 week ago'
    }
  ])

  // My registered events
  const myEvents = events.filter(event => event.isRegistered)

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
        // Pre-fill form with user data
        setRegistrationForm(prev => ({
          ...prev,
          name: parsedUser.name || '',
          email: parsedUser.email || '',
          studentId: parsedUser.studentId || ''
        }))
      }
    }
  }, [router])

  if (!user) return null

  const handleLike = (eventId: string) => {
    setEvents(prev => prev.map(event => 
      event.id === eventId ? { ...event, isLiked: !event.isLiked } : event
    ))
  }

  const openRegistrationForm = (event: Event) => {
    if (event.isRegistered) {
      // If already registered, allow cancellation
      if (confirm('Are you sure you want to cancel your registration?')) {
        setEvents(prev => prev.map(e => 
          e.id === event.id 
            ? { ...e, isRegistered: false, registrations: e.registrations - 1 }
            : e
        ))
      }
    } else {
      // Open registration form
      setSelectedEvent(event)
      setShowRegistrationModal(true)
      setShowEventModal(false)
    }
  }

  const validateForm = (): boolean => {
    const errors: Partial<RegistrationForm> = {}
    
    if (!registrationForm.name) errors.name = 'Name is required'
    if (!registrationForm.email) errors.email = 'Email is required'
    if (!registrationForm.studentId) errors.studentId = 'Student ID is required'
    if (!registrationForm.phone) errors.phone = 'Phone number is required'
    if (!registrationForm.year) errors.year = 'Year is required'
    if (!registrationForm.branch) errors.branch = 'Branch is required'
    if (!registrationForm.emergencyContact) errors.emergencyContact = 'Emergency contact is required'
    
    // Email validation
    if (registrationForm.email && !/\S+@\S+\.\S+/.test(registrationForm.email)) {
      errors.email = 'Invalid email format'
    }
    
    // Phone validation
    if (registrationForm.phone && !/^\d{10}$/.test(registrationForm.phone)) {
      errors.phone = 'Phone number must be 10 digits'
    }
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmitRegistration = () => {
    if (validateForm() && selectedEvent) {
      // Update event registration
      setEvents(prev => prev.map(event => 
        event.id === selectedEvent.id 
          ? { ...event, isRegistered: true, registrations: event.registrations + 1 }
          : event
      ))
      
      // Show success message
      alert(`Successfully registered for ${selectedEvent.title}!`)
      
      // Reset form and close modal
      setRegistrationForm({
        name: user.name || '',
        email: user.email || '',
        studentId: user.studentId || '',
        phone: '',
        year: '',
        branch: '',
        dietaryRestrictions: '',
        additionalNotes: '',
        emergencyContact: ''
      })
      setFormErrors({})
      setShowRegistrationModal(false)
      setSelectedEvent(null)
    }
  }

  const openEventDetails = (event: Event) => {
    setSelectedEvent(event)
    setShowEventModal(true)
  }

  const openClubDetails = (club: Club) => {
    setSelectedClub(club)
    setShowClubModal(true)
  }

  const categories = ['all', 'Technology', 'Arts', 'Sports', 'Academic', 'Social']
  const filteredEvents = filterCategory === 'all' 
    ? events 
    : events.filter(event => {
        const club = clubs.find(c => c.id === event.clubId)
        return club?.category === filterCategory
      })

  return (
    <Layout role="student">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-navy">Events Discovery</h1>
            <p className="text-navy/70 mt-2">Explore campus events and club activities</p>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={() => setActiveTab('feed')}
              className={`px-6 py-2.5 rounded-full font-semibold transition-all duration-300 ${
                activeTab === 'feed'
                  ? 'bg-gradient-to-r from-blue-500 to-orange-500 text-white shadow-lg'
                  : 'bg-white/50 text-navy border border-white/50'
              }`}
            >
              Event Feed
            </button>
            <button
              onClick={() => setActiveTab('clubs')}
              className={`px-6 py-2.5 rounded-full font-semibold transition-all duration-300 ${
                activeTab === 'clubs'
                  ? 'bg-gradient-to-r from-blue-500 to-orange-500 text-white shadow-lg'
                  : 'bg-white/50 text-navy border border-white/50'
              }`}
            >
              Clubs
            </button>
            <button
              onClick={() => setActiveTab('myevents')}
              className={`relative px-6 py-2.5 rounded-full font-semibold transition-all duration-300 ${
                activeTab === 'myevents'
                  ? 'bg-gradient-to-r from-blue-500 to-orange-500 text-white shadow-lg'
                  : 'bg-white/50 text-navy border border-white/50'
              }`}
            >
              My Events
              {myEvents.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                  {myEvents.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Category Filter (for feed) */}
        {activeTab === 'feed' && (
          <div className="flex gap-3 overflow-x-auto pb-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setFilterCategory(category)}
                className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition-all duration-300 ${
                  filterCategory === category
                    ? 'bg-gradient-to-r from-blue-500 to-orange-500 text-white shadow-md'
                    : 'bg-white/40 text-navy border border-white/50 hover:bg-white/60'
                }`}
              >
                {category === 'all' ? 'All Events' : category}
              </button>
            ))}
          </div>
        )}

        {/* Event Feed (Instagram-like) */}
        {activeTab === 'feed' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map(event => (
              <div
                key={event.id}
                className="bg-white/40 backdrop-blur-xl rounded-2xl border border-white/50 shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                {/* Club Header */}
                <div className="p-4 flex items-center justify-between border-b border-white/30">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-orange-500 flex items-center justify-center text-xl">
                      {event.clubLogo}
                    </div>
                    <div>
                      <p className="font-semibold text-navy">{event.clubName}</p>
                      <p className="text-xs text-navy/60">{event.postedTime}</p>
                    </div>
                  </div>
                  <button className="text-navy/60 hover:text-navy">
                    •••
                  </button>
                </div>

                {/* Event Image/Banner */}
                <div 
                  className="h-48 bg-gradient-to-br from-blue-500/20 to-orange-500/20 flex items-center justify-center text-6xl cursor-pointer"
                  onClick={() => openEventDetails(event)}
                >
                  {event.image}
                </div>

                {/* Action Buttons */}
                <div className="p-4 flex items-center gap-4 border-b border-white/30">
                  <button
                    onClick={() => handleLike(event.id)}
                    className={`text-2xl transition-all duration-300 ${
                      event.isLiked ? 'text-red-500 scale-110' : 'text-navy/60 hover:text-red-500'
                    }`}
                  >
                    {event.isLiked ? '❤️' : '🤍'}
                  </button>
                  <button 
                    onClick={() => openEventDetails(event)}
                    className="text-2xl text-navy/60 hover:text-navy transition-colors"
                  >
                    💬
                  </button>
                  <button className="text-2xl text-navy/60 hover:text-navy transition-colors">
                    📤
                  </button>
                  <button
                    onClick={() => openRegistrationForm(event)}
                    className={`ml-auto px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                      event.isRegistered
                        ? 'bg-green-500 text-white'
                        : 'bg-gradient-to-r from-blue-500 to-orange-500 text-white hover:from-blue-600 hover:to-orange-600'
                    }`}
                  >
                    {event.isRegistered ? 'Registered ✓' : 'Register'}
                  </button>
                </div>

                {/* Event Details */}
                <div className="p-4">
                  <h3 className="font-bold text-navy text-lg mb-2">{event.title}</h3>
                  <p className="text-sm text-navy/70 mb-3 line-clamp-2">{event.description}</p>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-navy/60">
                      <span>📅</span>
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-navy/60">
                      <span>⏰</span>
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-navy/60">
                      <span>📍</span>
                      <span>{event.venue}</span>
                    </div>
                    <div className="flex items-center gap-2 text-navy/60">
                      <span>👥</span>
                      <span>{event.registrations}/{event.maxCapacity} registered</span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {event.tags.map(tag => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-1 bg-white/50 text-navy rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Clubs Grid */}
        {activeTab === 'clubs' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {clubs.map(club => (
              <div
                key={club.id}
                onClick={() => openClubDetails(club)}
                className="bg-white/40 backdrop-blur-xl rounded-2xl p-6 border border-white/50 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer"
              >
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-orange-500 flex items-center justify-center text-4xl shadow-lg">
                  {club.logo}
                </div>
                <h3 className="font-bold text-navy text-center mb-2">{club.name}</h3>
                <p className="text-xs text-navy/60 text-center mb-3">{club.category}</p>
                <p className="text-sm text-navy/70 text-center mb-4 line-clamp-2">{club.description}</p>
                <div className="flex items-center justify-center gap-1 text-sm text-navy/60">
                  <span>👥</span>
                  <span>{club.members} members</span>
                </div>
                <button className="w-full mt-4 bg-gradient-to-r from-blue-500 to-orange-500 text-white py-2 rounded-full hover:from-blue-600 hover:to-orange-600 transition-all duration-300 font-semibold">
                  View Details
                </button>
              </div>
            ))}
          </div>
        )}

        {/* My Events */}
        {activeTab === 'myevents' && (
          <div className="space-y-4">
            {myEvents.length > 0 ? (
              myEvents.map(event => (
                <div
                  key={event.id}
                  className="bg-white/40 backdrop-blur-xl rounded-2xl p-6 border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500/20 to-orange-500/20 flex items-center justify-center text-3xl">
                      {event.image}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-bold text-navy text-lg">{event.title}</h3>
                          <p className="text-sm text-navy/60 mb-2">by {event.clubName}</p>
                        </div>
                        <span className="bg-green-500 text-white text-xs px-3 py-1 rounded-full">
                          Registered
                        </span>
                      </div>
                      <p className="text-sm text-navy/70 mb-3">{event.description}</p>
                      <div className="flex flex-wrap gap-4 text-sm text-navy/60">
                        <span className="flex items-center gap-1">
                          <span>📅</span> {event.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <span>⏰</span> {event.time}
                        </span>
                        <span className="flex items-center gap-1">
                          <span>📍</span> {event.venue}
                        </span>
                      </div>
                      <div className="flex gap-3 mt-4">
                        <button 
                          onClick={() => openEventDetails(event)}
                          className="px-4 py-2 bg-white/50 text-navy rounded-full hover:bg-white/70 transition-all duration-300 font-medium border border-white/50"
                        >
                          View Details
                        </button>
                        <button 
                          onClick={() => openRegistrationForm(event)}
                          className="px-4 py-2 bg-red-500/20 text-red-600 rounded-full hover:bg-red-500/30 transition-all duration-300 font-medium border border-red-500/30"
                        >
                          Cancel Registration
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white/40 backdrop-blur-xl rounded-2xl p-12 border border-white/50 text-center">
                <span className="text-6xl mb-4 block">📅</span>
                <h3 className="text-xl font-bold text-navy mb-2">No Registered Events</h3>
                <p className="text-navy/60 mb-4">You haven&apos;t registered for any events yet</p>
                <button
                  onClick={() => setActiveTab('feed')}
                  className="bg-gradient-to-r from-blue-500 to-orange-500 text-white px-6 py-2 rounded-full hover:from-blue-600 hover:to-orange-600 transition-all duration-300 font-semibold"
                >
                  Explore Events
                </button>
              </div>
            )}
          </div>
        )}

        {/* Event Details Modal */}
        {showEventModal && selectedEvent && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-bold text-navy">{selectedEvent.title}</h2>
                  <button
                    onClick={() => setShowEventModal(false)}
                    className="text-navy/60 hover:text-navy text-2xl"
                  >
                    ×
                  </button>
                </div>
                
                <div className="bg-gradient-to-br from-blue-500/20 to-orange-500/20 rounded-xl p-8 flex items-center justify-center text-6xl mb-6">
                  {selectedEvent.image}
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-orange-500 flex items-center justify-center text-2xl">
                      {selectedEvent.clubLogo}
                    </div>
                    <div>
                      <p className="font-semibold text-navy">{selectedEvent.clubName}</p>
                      <p className="text-sm text-navy/60">Organizer</p>
                    </div>
                  </div>

                  <p className="text-navy/70">{selectedEvent.description}</p>

                  <div className="bg-white/50 rounded-xl p-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">📅</span>
                      <div>
                        <p className="font-semibold text-navy">Date</p>
                        <p className="text-sm text-navy/60">{selectedEvent.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xl">⏰</span>
                      <div>
                        <p className="font-semibold text-navy">Time</p>
                        <p className="text-sm text-navy/60">{selectedEvent.time}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xl">📍</span>
                      <div>
                        <p className="font-semibold text-navy">Venue</p>
                        <p className="text-sm text-navy/60">{selectedEvent.venue}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xl">👥</span>
                      <div>
                        <p className="font-semibold text-navy">Registrations</p>
                        <p className="text-sm text-navy/60">{selectedEvent.registrations} / {selectedEvent.maxCapacity} spots filled</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => openRegistrationForm(selectedEvent)}
                      className={`flex-1 py-3 rounded-full font-semibold transition-all duration-300 ${
                        selectedEvent.isRegistered
                          ? 'bg-green-500 text-white'
                          : 'bg-gradient-to-r from-blue-500 to-orange-500 text-white hover:from-blue-600 hover:to-orange-600'
                      }`}
                    >
                      {selectedEvent.isRegistered ? 'Registered ✓' : 'Register for Event'}
                    </button>
                    <button
                      onClick={() => handleLike(selectedEvent.id)}
                      className={`px-6 py-3 rounded-full border-2 transition-all duration-300 ${
                        selectedEvent.isLiked
                          ? 'bg-red-500 text-white border-red-500'
                          : 'bg-white/50 text-navy border-navy/30 hover:bg-red-50 hover:text-red-500 hover:border-red-500'
                      }`}
                    >
                      {selectedEvent.isLiked ? '❤️' : '🤍'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Registration Form Modal */}
        {showRegistrationModal && selectedEvent && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-navy">Event Registration</h2>
                    <p className="text-navy/60 mt-1">Complete your registration for the event</p>
                  </div>
                  <button
                    onClick={() => {
                      setShowRegistrationModal(false)
                      setFormErrors({})
                    }}
                    className="text-navy/60 hover:text-navy text-2xl"
                  >
                    ×
                  </button>
                </div>

                {/* Event Details Summary */}
                <div className="bg-gradient-to-r from-blue-500/10 to-orange-500/10 rounded-xl p-4 mb-6">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-xl bg-white/50 flex items-center justify-center text-3xl">
                      {selectedEvent.image}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-navy text-lg">{selectedEvent.title}</h3>
                      <p className="text-sm text-navy/60 mb-2">Organized by {selectedEvent.clubName}</p>
                      <div className="flex flex-wrap gap-4 text-sm text-navy/70">
                        <span className="flex items-center gap-1">
                          <span>📅</span> {selectedEvent.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <span>⏰</span> {selectedEvent.time}
                        </span>
                        <span className="flex items-center gap-1">
                          <span>📍</span> {selectedEvent.venue}
                        </span>
                        <span className="flex items-center gap-1">
                          <span>👥</span> {selectedEvent.maxCapacity - selectedEvent.registrations} spots left
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Registration Form */}
                <form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Name */}
                    <div>
                      <label className="block text-sm font-semibold text-navy mb-2">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={registrationForm.name}
                        onChange={(e) => setRegistrationForm({...registrationForm, name: e.target.value})}
                        className={`w-full px-4 py-2 rounded-xl bg-white/50 border ${
                          formErrors.name ? 'border-red-500' : 'border-white/50'
                        } focus:outline-none focus:border-blue-500 transition-colors`}
                        placeholder="Enter your full name"
                      />
                      {formErrors.name && (
                        <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-semibold text-navy mb-2">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        value={registrationForm.email}
                        onChange={(e) => setRegistrationForm({...registrationForm, email: e.target.value})}
                        className={`w-full px-4 py-2 rounded-xl bg-white/50 border ${
                          formErrors.email ? 'border-red-500' : 'border-white/50'
                        } focus:outline-none focus:border-blue-500 transition-colors`}
                        placeholder="your.email@example.com"
                      />
                      {formErrors.email && (
                        <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
                      )}
                    </div>

                    {/* Student ID */}
                    <div>
                      <label className="block text-sm font-semibold text-navy mb-2">
                        Student ID <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={registrationForm.studentId}
                        onChange={(e) => setRegistrationForm({...registrationForm, studentId: e.target.value})}
                        className={`w-full px-4 py-2 rounded-xl bg-white/50 border ${
                          formErrors.studentId ? 'border-red-500' : 'border-white/50'
                        } focus:outline-none focus:border-blue-500 transition-colors`}
                        placeholder="Enter your student ID"
                      />
                      {formErrors.studentId && (
                        <p className="text-red-500 text-xs mt-1">{formErrors.studentId}</p>
                      )}
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-semibold text-navy mb-2">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        value={registrationForm.phone}
                        onChange={(e) => setRegistrationForm({...registrationForm, phone: e.target.value})}
                        className={`w-full px-4 py-2 rounded-xl bg-white/50 border ${
                          formErrors.phone ? 'border-red-500' : 'border-white/50'
                        } focus:outline-none focus:border-blue-500 transition-colors`}
                        placeholder="10-digit phone number"
                      />
                      {formErrors.phone && (
                        <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>
                      )}
                    </div>

                    {/* Year */}
                    <div>
                      <label className="block text-sm font-semibold text-navy mb-2">
                        Year <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={registrationForm.year}
                        onChange={(e) => setRegistrationForm({...registrationForm, year: e.target.value})}
                        className={`w-full px-4 py-2 rounded-xl bg-white/50 border ${
                          formErrors.year ? 'border-red-500' : 'border-white/50'
                        } focus:outline-none focus:border-blue-500 transition-colors`}
                      >
                        <option value="">Select Year</option>
                        <option value="1">First Year</option>
                        <option value="2">Second Year</option>
                        <option value="3">Third Year</option>
                        <option value="4">Fourth Year</option>
                      </select>
                      {formErrors.year && (
                        <p className="text-red-500 text-xs mt-1">{formErrors.year}</p>
                      )}
                    </div>

                    {/* Branch */}
                    <div>
                      <label className="block text-sm font-semibold text-navy mb-2">
                        Branch/Department <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={registrationForm.branch}
                        onChange={(e) => setRegistrationForm({...registrationForm, branch: e.target.value})}
                        className={`w-full px-4 py-2 rounded-xl bg-white/50 border ${
                          formErrors.branch ? 'border-red-500' : 'border-white/50'
                        } focus:outline-none focus:border-blue-500 transition-colors`}
                      >
                        <option value="">Select Branch</option>
                        <option value="CSE">Computer Science</option>
                        <option value="ECE">Electronics</option>
                        <option value="ME">Mechanical</option>
                        <option value="CE">Civil</option>
                        <option value="EE">Electrical</option>
                        <option value="IT">Information Technology</option>
                      </select>
                      {formErrors.branch && (
                        <p className="text-red-500 text-xs mt-1">{formErrors.branch}</p>
                      )}
                    </div>

                    {/* Emergency Contact */}
                    <div>
                      <label className="block text-sm font-semibold text-navy mb-2">
                        Emergency Contact <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        value={registrationForm.emergencyContact}
                        onChange={(e) => setRegistrationForm({...registrationForm, emergencyContact: e.target.value})}
                        className={`w-full px-4 py-2 rounded-xl bg-white/50 border ${
                          formErrors.emergencyContact ? 'border-red-500' : 'border-white/50'
                        } focus:outline-none focus:border-blue-500 transition-colors`}
                        placeholder="Emergency contact number"
                      />
                      {formErrors.emergencyContact && (
                        <p className="text-red-500 text-xs mt-1">{formErrors.emergencyContact}</p>
                      )}
                    </div>

                    {/* Dietary Restrictions */}
                    <div>
                      <label className="block text-sm font-semibold text-navy mb-2">
                        Dietary Restrictions (if any)
                      </label>
                      <input
                        type="text"
                        value={registrationForm.dietaryRestrictions}
                        onChange={(e) => setRegistrationForm({...registrationForm, dietaryRestrictions: e.target.value})}
                        className="w-full px-4 py-2 rounded-xl bg-white/50 border border-white/50 focus:outline-none focus:border-blue-500 transition-colors"
                        placeholder="Vegetarian, Vegan, Allergies, etc."
                      />
                    </div>
                  </div>

                  {/* Additional Notes */}
                  <div>
                    <label className="block text-sm font-semibold text-navy mb-2">
                      Additional Notes
                    </label>
                    <textarea
                      value={registrationForm.additionalNotes}
                      onChange={(e) => setRegistrationForm({...registrationForm, additionalNotes: e.target.value})}
                      className="w-full px-4 py-2 rounded-xl bg-white/50 border border-white/50 focus:outline-none focus:border-blue-500 transition-colors"
                      rows={3}
                      placeholder="Any special requirements or questions?"
                    />
                  </div>

                  {/* Terms and Conditions */}
                  <div className="bg-yellow-50/50 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <input type="checkbox" className="mt-1" required />
                      <div className="text-sm text-navy/70">
                        <p className="mb-2">By registering for this event, I agree to:</p>
                        <ul className="space-y-1 ml-4">
                          <li>• Follow all event guidelines and rules</li>
                          <li>• Be present at the specified venue on time</li>
                          <li>• Inform organizers if unable to attend</li>
                          <li>• Allow photos/videos to be taken during the event</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={handleSubmitRegistration}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-orange-500 text-white py-3 rounded-full hover:from-blue-600 hover:to-orange-600 transition-all duration-300 font-semibold"
                    >
                      Complete Registration
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowRegistrationModal(false)
                        setFormErrors({})
                      }}
                      className="px-6 py-3 bg-white/50 text-navy rounded-full hover:bg-white/70 transition-all duration-300 font-semibold border border-white/50"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Club Details Modal */}
        {showClubModal && selectedClub && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-bold text-navy">{selectedClub.name}</h2>
                  <button
                    onClick={() => setShowClubModal(false)}
                    className="text-navy/60 hover:text-navy text-2xl"
                  >
                    ×
                  </button>
                </div>

                <div className="text-center mb-6">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-orange-500 flex items-center justify-center text-5xl shadow-lg">
                    {selectedClub.logo}
                  </div>
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-600 rounded-full text-sm font-medium">
                    {selectedClub.category}
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="bg-white/50 rounded-xl p-4">
                    <h3 className="font-semibold text-navy mb-2">About</h3>
                    <p className="text-navy/70">{selectedClub.description}</p>
                  </div>

                  <div className="bg-white/50 rounded-xl p-4">
                    <h3 className="font-semibold text-navy mb-2">Club Statistics</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-2xl font-bold text-navy">{selectedClub.members}</p>
                        <p className="text-sm text-navy/60">Active Members</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-navy">
                          {events.filter(e => e.clubId === selectedClub.id).length}
                        </p>
                        <p className="text-sm text-navy/60">Upcoming Events</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/50 rounded-xl p-4">
                    <h3 className="font-semibold text-navy mb-3">Open Positions</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 bg-white/50 rounded-lg">
                        <span className="text-sm text-navy">Event Coordinator</span>
                        <span className="text-xs bg-green-500/20 text-green-600 px-2 py-1 rounded-full">Open</span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-white/50 rounded-lg">
                        <span className="text-sm text-navy">Social Media Manager</span>
                        <span className="text-xs bg-green-500/20 text-green-600 px-2 py-1 rounded-full">Open</span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-white/50 rounded-lg">
                        <span className="text-sm text-navy">Technical Lead</span>
                        <span className="text-xs bg-orange-500/20 text-orange-600 px-2 py-1 rounded-full">Filled</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/50 rounded-xl p-4">
                    <h3 className="font-semibold text-navy mb-3">Upcoming Events</h3>
                    <div className="space-y-2">
                      {events
                        .filter(e => e.clubId === selectedClub.id)
                        .slice(0, 3)
                        .map(event => (
                          <div key={event.id} className="flex items-center justify-between p-2 bg-white/50 rounded-lg">
                            <div>
                              <p className="text-sm font-medium text-navy">{event.title}</p>
                              <p className="text-xs text-navy/60">{event.date}</p>
                            </div>
                            <button
                              onClick={() => {
                                setShowClubModal(false)
                                openEventDetails(event)
                              }}
                              className="text-xs bg-blue-500/20 text-blue-600 px-3 py-1 rounded-full hover:bg-blue-500/30 transition-colors"
                            >
                              View
                            </button>
                          </div>
                        ))}
                    </div>
                  </div>

                  <button className="w-full bg-gradient-to-r from-blue-500 to-orange-500 text-white py-3 rounded-full hover:from-blue-600 hover:to-orange-600 transition-all duration-300 font-semibold">
                    Join Club
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}