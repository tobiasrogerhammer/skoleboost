import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { Clock, MapPin, Coins, CheckCircle, XCircle, Camera, Palette, Music, TreePine, Gamepad2, Users, UserPlus, UserCheck, MessageCircle, Image, Heart, ChevronRight, ChevronDown, ChevronUp, Calendar } from 'lucide-react'
import { Card } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Textarea } from './ui/textarea'
import { Avatar } from './ui/avatar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { toast } from 'sonner'
import { Logo } from './Logo'
import { EventCard } from './EventCard'

interface Comment {
  id: string
  author: string
  message: string
  timestamp: string
  avatar?: string
}

interface Photo {
  id: string
  author: string
  url: string
  caption: string
  timestamp: string
  likes: number
}

interface ScheduleItem {
  _id?: string
  id?: string
  subject: string
  teacher?: string
  time: string
  room: string
  points: number
  attended: boolean
  day: string
  type: 'class' | 'event' | 'trip'
  description?: string
  cost?: number
  emoji?: string
  colorTheme?: string
  capacity?: number
  registered?: number
  registeredUsers?: string[]
  isRegistered?: boolean
  comments?: Comment[]
  photos?: Photo[]
  participationCount?: number
}

const mockSchedule: ScheduleItem[] = [
  {
    id: '1',
    subject: 'Matte',
    teacher: 'Agnete',
    time: '08:00 - 09:30',
    room: 'Rom 101',
    points: 10,
    attended: true,
    day: 'I dag',
    type: 'class'
  },
  {
    id: '2',
    subject: 'Engelsk',
    teacher: 'Brynjar',
    time: '09:45 - 11:15',
    room: 'Rom 205',
    points: 10,
    attended: true,
    day: 'I dag',
    type: 'class'
  },
  {
    id: '3',
    subject: 'Fotografiklubb Møte',
    teacher: 'Ragnhild',
    time: '11:30 - 12:30',
    room: 'Mediesenter',
    points: 0,
    attended: false,
    day: 'I dag',
    type: 'event',
    description: '📸 Lær portrettfotografiteknikk og rediger dine beste bilder!',
    emoji: '📸',
    colorTheme: 'purple',
    capacity: 15,
    registered: 8,
    registeredUsers: ['Alex Johnson', 'Sarah Chen', 'Mike Rodriguez', 'Emma Davis', 'Jason Kim', 'Lisa Wang', 'David Brown', 'Maya Patel'],
    isRegistered: false,
    participationCount: 12,
    comments: [
      {
        id: '1',
        author: 'Emil Hansen',
        message: 'Can\'t wait to learn about portrait lighting! 📸',
        timestamp: '2 hours ago'
      },
      {
        id: '2',
        author: 'Kaja Haug',
        message: 'Should I bring my own camera or will there be equipment?',
        timestamp: '1 hour ago'
      }
    ],
    photos: [
      {
        id: '1',
        author: 'Emma Stigen',
        url: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400',
        caption: 'Last week\'s sunset portraits were amazing!',
        timestamp: '3 days ago',
        likes: 12
      }
    ]
  },
  {
    id: '4',
    subject: 'Fysikk',
    teacher: 'Rolf',
    time: '13:00 - 14:30',
    room: 'Lab 3',
    points: 15,
    attended: false,
    day: 'I dag',
    type: 'class'
  },
  {
    id: '5',
    subject: 'Vinter Kunstutstilling',
    time: '15:00 - 17:00',
    room: 'Skolegalleriet',
    points: 0,
    attended: false,
    day: 'I dag',
    type: 'event',
    description: '🎨 Vis frem din kreativitet! Vis frem ditt kunstverk og se fantastiske elevkreasjoner',
    emoji: '🎨',
    colorTheme: 'pink',
    capacity: 50,
    registered: 23,
    registeredUsers: ['Alex Johnson'],
    isRegistered: true,
    participationCount: 45,
    comments: [
      {
        id: '1',
        author: 'Art Teacher',
        message: 'Remember to bring your portfolio if you want to display your work!',
        timestamp: '4 hours ago'
      },
      {
        id: '2',
        author: 'Lisa Wang',
        message: 'So excited to see everyone\'s winter-themed pieces! ❄️🎨',
        timestamp: '2 hours ago'
      }
    ],
    photos: [
      {
        id: '1',
        author: 'Maya Patel',
        url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
        caption: 'Setting up my winter landscape series!',
        timestamp: '1 day ago',
        likes: 18
      },
      {
        id: '2',
        author: 'David Brown',
        url: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400',
        caption: 'My sculpture is finally ready to display 🗿',
        timestamp: '6 hours ago',
        likes: 7
      }
    ]
  },
  {
    id: '6',
    subject: 'Kjemi',
    teacher: 'Dr. Brown',
    time: '08:00 - 09:30',
    room: 'Lab 1',
    points: 15,
    attended: true,
    day: 'I morgen',
    type: 'class'
  },
  {
    id: '7',
    subject: 'Musikk Jam Session',
    teacher: 'Mr. Rodriguez',
    time: '10:00 - 11:30',
    room: 'Musikkrom',
    points: 0,
    attended: false,
    day: 'I morgen',
    type: 'event',
    description: '🎵 Ta med instrumentene dine! Åpen jam-session med snacks og gode vibber',
    emoji: '🎵',
    colorTheme: 'orange',
    capacity: 20,
    registered: 12,
    registeredUsers: ['Alex Johnson'],
    isRegistered: true,
    participationCount: 18,
    comments: [
      {
        id: '1',
        author: 'Mr. Rodriguez',
        message: 'We\'ll have drums, keyboard, and amps available. Feel free to bring acoustic instruments!',
        timestamp: '1 day ago'
      },
      {
        id: '2',
        author: 'Jason Kim',
        message: 'I\'ll bring my guitar! Anyone want to jam to some indie rock? 🎸',
        timestamp: '8 hours ago'
      }
    ]
  },
  {
    id: '8',
    subject: 'Kunst',
    teacher: 'Ms. Wilson',
    time: '12:00 - 13:30',
    room: 'Kunststudio',
    points: 12,
    attended: false,
    day: 'I morgen',
    type: 'class'
  },
  {
    id: '9',
    subject: 'Eventyrpark Utflukt',
    time: '14:00 - 18:00',
    room: 'Møt ved Hovedinngangen',
    points: 0,
    attended: false,
    day: 'I morgen',
    type: 'trip',
    description: '🎢 Episk dag på Eventyrverden! Berg-og-dal-baner, spill og gruppeutfordringer',
    emoji: '🎢',
    colorTheme: 'green',
    capacity: 25,
    registered: 22,
    registeredUsers: ['Alex Johnson', 'Sarah Chen', 'Mike Rodriguez'],
    isRegistered: true,
    participationCount: 25,
    comments: [
      {
        id: '1',
        author: 'Trip Coordinator',
        message: 'Don\'t forget to bring water bottles and wear comfortable shoes!',
        timestamp: '2 days ago'
      },
      {
        id: '2',
        author: 'Emma Davis',
        message: 'Who\'s ready for the roller coaster challenge? 🎢😱',
        timestamp: '1 day ago'
      },
      {
        id: '3',
        author: 'Mike Rodriguez',
        message: 'Can\'t wait! Last few spots available, register soon!',
        timestamp: '12 hours ago'
      }
    ]
  },
  {
    id: '10',
    subject: 'Gaming Turnering',
    time: '16:00 - 19:00',
    room: 'Dataverksted',
    points: 0,
    attended: false,
    day: 'Fredag',
    type: 'event',
    description: '🎮 Episk gaming-konkurranse! Premier til vinnerne og pizza til alle',
    emoji: '🎮',
    colorTheme: 'blue',
    capacity: 16,
    registered: 14,
    registeredUsers: ['Alex Johnson'],
    isRegistered: true,
    participationCount: 16,
    comments: [
      {
        id: '1',
        author: 'Gaming Club President',
        message: 'Tournament bracket will be posted tomorrow! Games: Smash Bros, Rocket League, and FIFA',
        timestamp: '2 days ago'
      },
      {
        id: '2',
        author: 'David Brown',
        message: 'Ready to defend my Rocket League championship! 🏆⚽',
        timestamp: '1 day ago'
      }
    ]
  },
  {
    id: '11',
    subject: 'Natur Turgåing',
    time: '09:00 - 15:00',
    room: 'Furutrær Sti',
    points: 0,
    attended: false,
    day: 'Lørdag',
    type: 'trip',
    description: '🌲 Utforsk vakre stier, ta fantastiske bilder og nyt en pikniklunsj!',
    emoji: '🌲',
    colorTheme: 'emerald',
    capacity: 12,
    registered: 9,
    registeredUsers: ['Sarah Chen', 'Emma Davis', 'Lisa Wang'],
    isRegistered: false,
    participationCount: 12,
    comments: [
      {
        id: '1',
        author: 'Nature Club Leader',
        message: 'Weather looks perfect! We\'ll provide lunch and water. Bring cameras! 📸🥾',
        timestamp: '3 days ago'
      },
      {
        id: '2',
        author: 'Lisa Wang',
        message: 'Hope we see some wildlife! Last hike we spotted deer and beautiful birds 🦌🐦',
        timestamp: '1 day ago'
      }
    ],
    photos: [
      {
        id: '1',
        author: 'Sarah Chen',
        url: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=400',
        caption: 'Amazing view from last month\'s hike!',
        timestamp: '1 month ago',
        likes: 23
      }
    ]
  }
]

export function SchedulePage() {
  const scheduleData = useQuery(api.schedule.getByUser) || []
  const socialEventsQuery = useQuery(api.events.getAll) || []
  
  // Sort events by date
  const socialEvents = useMemo(() => {
    const parseDate = (dateStr: string): Date => {
      // Parse "DD. MMM" format (e.g., "15. okt")
      const parts = dateStr.split('. ')
      if (parts.length !== 2) return new Date(0) // Invalid date, put at end
      
      const day = parseInt(parts[0], 10)
      const monthStr = parts[1].toLowerCase()
      const monthMap: { [key: string]: number } = {
        'jan': 0, 'feb': 1, 'mar': 2, 'apr': 3, 'mai': 4, 'jun': 5,
        'jul': 6, 'aug': 7, 'sep': 8, 'okt': 9, 'nov': 10, 'des': 11
      }
      const month = monthMap[monthStr] ?? 0
      
      // Events are seeded for 2025 (nov-des), so use 2025 as the year
      const eventYear = 2025
      return new Date(eventYear, month, day)
    }
    
    return [...socialEventsQuery].sort((a: any, b: any) => {
      const dateA = parseDate(a.date || '')
      const dateB = parseDate(b.date || '')
      if (dateA.getTime() === dateB.getTime()) {
        // If same date, sort by time
        const timeA = a.time || '00:00'
        const timeB = b.time || '00:00'
        return timeA.localeCompare(timeB)
      }
      return dateA.getTime() - dateB.getTime()
    })
  }, [socialEventsQuery])
  const markAttendedMutation = useMutation(api.schedule.markAttended)
  const registerEventMutation = useMutation(api.events.register)
  const setupScheduleMutation = useMutation(api.schedule.setupDefaultSchedule)
  const userRegistrations = useQuery(api.events.getUserRegistrations) || []
  const registeredEventsSet = useMemo(() => new Set(userRegistrations), [userRegistrations])
  const [timeRemaining, setTimeRemaining] = useState<{ hours: number; minutes: number; seconds: number } | null>(null)
  const [isSettingUp, setIsSettingUp] = useState(false)
  const [showAllEvents, setShowAllEvents] = useState(false)
  
  // Get current day name
  const getDayName = useCallback(() => {
    const days = ['Søndag', 'Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag']
    return days[new Date().getDay()]
  }, [])
  const currentDayName = getDayName()
  
  // State for selected day
  const [selectedDay, setSelectedDay] = useState<string>(() => {
    const days = ['Søndag', 'Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag']
    return days[new Date().getDay()]
  })
  
  // Filter schedule items by selected day
  const selectedDayItems = useMemo(() => {
    const items = scheduleData.filter((item: any) => item.day === selectedDay)
    // Sort by time (extract start time from "HH:MM - HH:MM" format)
    return items.sort((a: any, b: any) => {
      const timeA = a.time.match(/(\d{2}):(\d{2})/)?.[0] || '00:00'
      const timeB = b.time.match(/(\d{2}):(\d{2})/)?.[0] || '00:00'
      return timeA.localeCompare(timeB)
    })
  }, [scheduleData, selectedDay])
  
  const todayItems = useMemo(() => scheduleData.filter((item: any) => item.day === currentDayName), [scheduleData, currentDayName])
  const tomorrowItems = useMemo(() => {
    const days = ['Søndag', 'Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag']
    const tomorrowIndex = (new Date().getDay() + 1) % 7
    const tomorrowName = days[tomorrowIndex]
    return scheduleData.filter((item: any) => item.day === tomorrowName)
  }, [scheduleData])
  // Use socialEvents to show same events as MainPage
  const upcomingEvents = useMemo(() => {
    // Convert socialEvents to same format as schedule events for EventCard
    return socialEvents.map((event: any) => ({
      _id: event._id,
      subject: event.title,
      description: event.description,
      day: event.date,
      time: event.time,
      room: '',
      emoji: event.emoji,
      colorTheme: event.colorTheme,
      capacity: event.capacity,
      registered: event.registered,
      isRegistered: registeredEventsSet.has(event._id.toString()),
      type: 'event' as const,
    }))
  }, [socialEvents, registeredEventsSet])
  
  // Auto-setup schedule if empty
  React.useEffect(() => {
    if (scheduleData !== undefined && scheduleData.length === 0 && !isSettingUp) {
      setIsSettingUp(true)
      setupScheduleMutation()
        .then(() => {
          toast.success('Timeplan opprettet! 📚')
        })
        .catch((error: any) => {
          console.error('Error setting up schedule:', error)
          toast.error('Kunne ikke opprette timeplan')
          setIsSettingUp(false)
        })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scheduleData?.length, isSettingUp])
  const attendedSelectedDay = selectedDayItems.filter(item => item.attended).length
  const totalPointsSelectedDay = selectedDayItems.filter(item => item.attended && item.type === 'class').reduce((sum, item) => sum + item.points, 0)

  // Find first upcoming class that hasn't started (only for today)
  const getFirstUpcomingClass = useCallback(() => {
    if (selectedDay !== currentDayName) return null
    
    const now = new Date()
    const currentTime = now.getHours() * 60 + now.getMinutes() // minutes since midnight
    
    for (const item of selectedDayItems) {
      if (item.type === 'class' && !item.attended) {
        const timeMatch = item.time.match(/(\d{2}):(\d{2})/)
        if (timeMatch) {
          const startHour = parseInt(timeMatch[1])
          const startMinute = parseInt(timeMatch[2])
          const startTime = startHour * 60 + startMinute
          
          if (startTime > currentTime) {
            return { item, startTime }
          }
        }
      }
    }
    return null
  }, [selectedDayItems, selectedDay, currentDayName])

  // Calculate countdown
  useEffect(() => {
    const upcoming = getFirstUpcomingClass()
    if (!upcoming) {
      setTimeRemaining(null)
      return
    }

    const startTime = upcoming.startTime

    const updateCountdown = () => {
      const now = new Date()
      const currentTime = now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60
      const diff = startTime - currentTime
      
      if (diff <= 0) {
        setTimeRemaining(null)
        return
      }
      
      const hours = Math.floor(diff / 60)
      const minutes = Math.floor(diff % 60)
      const seconds = Math.floor((diff % 1) * 60)
      
      setTimeRemaining({ hours, minutes, seconds })
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)
    
    return () => clearInterval(interval)
  }, [getFirstUpcomingClass])

  const handleRSVP = async (eventId: string) => {
    try {
      const result = await registerEventMutation({ eventId: eventId as any })
      toast.success(result.registered ? 'Påmeldt arrangement!' : 'Avmeldt fra arrangement')
      // The query will automatically refetch and update registeredEventsSet
    } catch (error: any) {
      toast.error(error.message || 'Noe gikk galt')
    }
  }


  const getItemIcon = (item: any) => {
    if (item.type === 'event') {
      switch (item.colorTheme) {
        case 'purple': return Camera
        case 'pink': return Palette
        case 'orange': return Music
        case 'blue': return Gamepad2
        default: return Users
      }
    } else if (item.type === 'trip') {
      switch (item.colorTheme) {
        case 'green': return TreePine
        case 'emerald': return TreePine
        default: return TreePine
      }
    }
    return null
  }

    const getItemStyles = (item: ScheduleItem, colorIndex?: number): { background?: string, borderColor?: string, className?: string } => {
      if (item.type === 'class') {
        // Colorful class cards - use provided colorIndex if available, otherwise fallback to ID-based
        const classColors = [
          { bg: 'linear-gradient(to bottom right, rgba(0, 167, 179, 0.2), #E8F6F6, rgba(0, 167, 179, 0.2))', border: 'rgba(0, 167, 179, 0.5)' },
          { bg: 'linear-gradient(to bottom right, rgba(251, 190, 158, 0.2), #FFF4E6, rgba(251, 190, 158, 0.2))', border: 'rgba(251, 190, 158, 0.5)' },
          { bg: 'linear-gradient(to bottom right, rgba(232, 165, 255, 0.2), #F5E6FF, rgba(232, 165, 255, 0.2))', border: 'rgba(232, 165, 255, 0.5)' },
          { bg: 'linear-gradient(to bottom right, rgba(78, 205, 196, 0.2), #E8F6F6, rgba(78, 205, 196, 0.2))', border: 'rgba(78, 205, 196, 0.5)' },
        ]
        const index = colorIndex !== undefined ? colorIndex : (typeof item._id === 'string' ? parseInt(item._id.replace(/\D/g, '')) % classColors.length : 0)
        return { background: classColors[index % classColors.length].bg, borderColor: classColors[index % classColors.length].border, className: 'shadow-md' }
      }
    
    switch (item.colorTheme) {
      case 'purple':
          return { background: 'linear-gradient(to bottom right, #E8A5FF, #C77DFF, #E8A5FF)', borderColor: 'rgba(232, 165, 255, 0.5)', className: 'shadow-md hover:shadow-xl transition-all' }
      case 'pink':
          return { background: 'linear-gradient(to bottom right, #FF6B9D, #FF8E9B, #FF6B9D)', borderColor: 'rgba(255, 107, 157, 0.5)', className: 'shadow-md hover:shadow-xl transition-all' }
      case 'orange':
          return { background: 'linear-gradient(to bottom right, #FBBE9E, #FF9F66, #FBBE9E)', borderColor: 'rgba(251, 190, 158, 0.5)', className: 'shadow-md hover:shadow-xl transition-all' }
      case 'green':
          return { background: 'linear-gradient(to bottom right, #4ECDC4, #44A08D, #4ECDC4)', borderColor: 'rgba(78, 205, 196, 0.5)', className: 'shadow-md hover:shadow-xl transition-all' }
      case 'blue':
          return { background: 'linear-gradient(to bottom right, #00A7B3, #00C4D4, #00A7B3)', borderColor: 'rgba(0, 167, 179, 0.5)', className: 'shadow-md hover:shadow-xl transition-all' }
      case 'emerald':
          return { background: 'linear-gradient(to bottom right, #4ECDC4, #44A08D, #4ECDC4)', borderColor: 'rgba(78, 205, 196, 0.5)', className: 'shadow-md hover:shadow-xl transition-all' }
      default:
          return { background: 'linear-gradient(to bottom right, #00A7B3, #00C4D4, #00A7B3)', borderColor: 'rgba(0, 167, 179, 0.5)', className: 'shadow-md hover:shadow-xl transition-all' }
      }
    }

  const daysOfWeek = ['Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag', 'Søndag']

  // Show loading state while setting up schedule
  if (scheduleData === undefined || (scheduleData.length === 0 && isSettingUp)) {
    return (
      <div className="pb-20 px-4 max-w-md mx-auto space-y-6" style={{ paddingTop: '2.5rem' }}>
        <div className="text-center mb-8">
          <div className="inline-block mb-3 p-3 rounded-2xl" style={{ background: 'linear-gradient(135deg, rgba(0, 167, 179, 0.1), rgba(232, 246, 246, 0.5))' }}>
            <span className="text-4xl">📚</span>
          </div>
          <h1 className="mb-2 font-bold text-3xl" style={{ color: '#006C75' }}>Din Timeplan</h1>
          <p className="text-base font-semibold mb-1" style={{ color: 'rgba(0, 108, 117, 0.9)' }}>Setter opp timeplan...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 max-w-md mx-auto space-y-6 relative" style={{ paddingTop: '2.5rem', paddingBottom: '200px' }}>
      <style>{`
        [data-slot="select-content"] [data-slot="select-item"] > span.absolute,
        [data-slot="select-content"] [data-slot="select-item"] svg,
        [data-slot="select-content"] [data-slot="select-item"] [data-radix-select-item-indicator] {
          display: none !important;
        }
      `}</style>
      {/* Logo and Brand Name - Top Left */}
      <div className="absolute top-4 left-4 z-50 flex items-center gap-2">
        <Logo size="xs" />
        <h1 className="font-bold text-base" style={{ color: '#006C75' }}>Skoleboost</h1>
      </div>

      {/* Enhanced Selected Day's Stats */}
      <Card className="p-5 mt-8 border-2 shadow-2xl transition-all duration-300 hover:shadow-3xl" style={{ 
        background: 'linear-gradient(135deg, #00A7B3 0%, #00C4D4 50%, #4ECDC4 100%)', 
        borderColor: 'rgba(255, 255, 255, 0.3)', 
        borderRadius: '20px', 
        boxShadow: '0 10px 40px rgba(0, 167, 179, 0.3)'
      }}>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-white font-extrabold text-xl drop-shadow-lg mb-0.5">{selectedDay}s Fremgang</h3>
            <p className="text-xs text-white/90 font-medium">Din daglige oversikt</p>
          </div>
          <div className="bg-white/30 p-3 rounded-xl backdrop-blur-md shadow-lg border border-white/20">
            <CheckCircle className="w-6 h-6 text-white" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="bg-white/30 backdrop-blur-md rounded-xl p-4 shadow-lg border border-white/20 transition-all duration-300 hover:bg-white/40 hover:scale-105">
            <div className="text-3xl font-extrabold text-white drop-shadow-lg mb-1.5">{attendedSelectedDay}</div>
            <div className="text-xs text-white font-semibold uppercase tracking-wide">Deltatt</div>
          </div>
          <div className="bg-white/30 backdrop-blur-md rounded-xl p-4 shadow-lg border border-white/20 transition-all duration-300 hover:bg-white/40 hover:scale-105">
            <div className="text-3xl font-extrabold text-white drop-shadow-lg mb-1.5">{selectedDayItems.length - attendedSelectedDay}</div>
            <div className="text-xs text-white font-semibold uppercase tracking-wide">Gjenstår</div>
          </div>
          <div className="bg-white/30 backdrop-blur-md rounded-xl p-4 shadow-lg border border-white/20 transition-all duration-300 hover:bg-white/40 hover:scale-105">
            <div className="flex items-center justify-center mb-1.5">
              <Coins className="w-6 h-6 text-white mr-1 drop-shadow-lg" />
              <span className="text-3xl font-extrabold text-white drop-shadow-lg">{totalPointsSelectedDay}</span>
            </div>
            <div className="text-xs text-white font-semibold uppercase tracking-wide">Poeng</div>
          </div>
        </div>
      </Card>

      {/* Day Selector */}
      <Card className="p-4 border-2 shadow-lg" style={{ 
        background: 'linear-gradient(135deg, #FBBE9E, #FF9F66, #FBBE9E)', 
        borderColor: 'rgba(255, 159, 102, 0.6)', 
        borderRadius: '16px',
        boxShadow: '0 4px 12px rgba(255, 159, 102, 0.3)'
      }}>
        <div>
          <label className="text-xs font-semibold block mb-1" style={{ color: 'white' }}>Velg dag</label>
          <div className="flex gap-3 items-center">
            <div className="p-3 rounded-lg flex-shrink-0" style={{ background: 'rgba(255, 255, 255, 0.3)', backdropFilter: 'blur(10px)' }}>
              <Calendar className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <Select value={selectedDay} onValueChange={setSelectedDay}>
              <SelectTrigger 
                className="flex-1 font-semibold transition-all duration-200 hover:shadow-md" 
                style={{ 
                  color: '#FF9F66',
                  backgroundColor: 'white',
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                  borderWidth: '2px',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                }}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent 
                className="bg-white border-2 shadow-xl rounded-lg [&_button[data-slot='select-scroll-up-button']]:hidden [&_button[data-slot='select-scroll-down-button']]:hidden [&_[data-slot='select-item']>span.absolute]:!hidden [&_[data-slot='select-item']_svg]:!hidden [&_[data-slot='select-item']_[data-radix-select-item-indicator]]:!hidden"
                style={{ 
                  borderColor: 'rgba(251, 190, 158, 0.3)',
                  boxShadow: '0 8px 24px rgba(251, 190, 158, 0.25)'
                }}
              >
                {daysOfWeek.map((day, index) => {
                  const isToday = day === currentDayName
                  const isSelected = day === selectedDay
                  return (
                    <SelectItem 
                      key={day} 
                      value={day}
                      className="transition-all duration-150 cursor-pointer [&>span.absolute]:!hidden [&_svg]:!hidden !pr-4"
                      style={{ 
                        color: isSelected ? '#FF9F66' : (isToday ? '#FF9F66' : '#006C75'),
                        backgroundColor: isSelected ? 'rgba(251, 190, 158, 0.15)' : 'white',
                        fontWeight: isSelected ? '700' : (isToday ? '600' : '500'),
                        borderLeft: isSelected ? '3px solid #FF9F66' : '3px solid transparent',
                        borderBottom: index < daysOfWeek.length - 1 ? '1px solid rgba(251, 190, 158, 0.3)' : 'none',
                        padding: '10px 16px',
                        margin: '0'
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.backgroundColor = isToday ? 'rgba(251, 190, 158, 0.15)' : 'rgba(251, 190, 158, 0.08)'
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = isSelected ? 'rgba(251, 190, 158, 0.15)' : 'white'
                      }}
                    >
                      <span className="flex items-center justify-between w-full gap-2">
                        <span>{day}</span>
                        {isToday && (
                          <span 
                            className="flex-shrink-0 w-2 h-2 rounded-full" 
                            style={{ backgroundColor: '#FF9F66' }}
                            title="I dag"
                          />
                        )}
                      </span>
                    </SelectItem>
                  )
                })}
              </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        {scheduleData.length === 0 && (
          <div className="mt-3 pt-3 border-t" style={{ borderColor: 'rgba(255, 255, 255, 0.3)' }}>
            <Button
              onClick={async () => {
                setIsSettingUp(true)
                try {
                  await setupScheduleMutation()
                  toast.success('Timeplan opprettet! 📚')
                } catch (error: any) {
                  console.error('Error setting up schedule:', error)
                  toast.error('Kunne ikke opprette timeplan')
                  setIsSettingUp(false)
                }
              }}
              disabled={isSettingUp}
              className="w-full"
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', color: '#FF9F66', fontWeight: '600' }}
            >
              {isSettingUp ? 'Oppretter timeplan...' : 'Sett opp timeplan'}
            </Button>
          </div>
        )}
      </Card>

      {/* Subtle Separator */}
      <div className="mt-4 mb-4">
        <div className="h-1 w-full rounded-full" style={{ background: 'rgba(0, 167, 179, 0.3)' }}></div>
      </div>

      {/* Enhanced Selected Day's Schedule */}
      <div>
        {selectedDayItems.length === 0 ? (
          <Card className="p-10 text-center border-2 shadow-lg" style={{ 
            background: 'linear-gradient(135deg, rgba(251, 190, 158, 0.1), rgba(255, 159, 102, 0.05))',
            borderColor: 'rgba(251, 190, 158, 0.3)', 
            borderRadius: '20px',
            boxShadow: '0 4px 12px rgba(251, 190, 158, 0.2)'
          }}>
            <p className="text-xl font-bold mb-2" style={{ color: '#006C75' }}>Ingen timer på {selectedDay}</p>
            <p className="text-sm font-medium" style={{ color: 'rgba(0, 108, 117, 0.7)' }}>Nyt fridagen! Ta en pause og lad opp batteriene</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {selectedDayItems.map((item: any, index: number) => {
            const upcoming = getFirstUpcomingClass()
            const isFirstUpcoming = upcoming && upcoming.item._id === item._id && item.type === 'class' && !item.attended
            const IconComponent = getItemIcon(item)
            
            // Find the last class on the day
            const isSpecialDay = ['Mandag', 'Tirsdag', 'Torsdag'].includes(selectedDay)
            let isLastClass = false
            if (isSpecialDay && item.type === 'class') {
              // Find the last class in the array
              for (let i = selectedDayItems.length - 1; i >= 0; i--) {
                if (selectedDayItems[i].type === 'class') {
                  isLastClass = (item._id === selectedDayItems[i]._id)
                  break
                }
              }
            }
            
            // Calculate color index for non-attended classes to ensure no two consecutive have same color
            let colorIndex: number | undefined = undefined
            if (item.type === 'class' && !item.attended) {
              // Count how many non-attended classes come before this one
              let nonAttendedCount = 0
              for (let i = 0; i < index; i++) {
                if (selectedDayItems[i].type === 'class' && !selectedDayItems[i].attended) {
                  nonAttendedCount++
                }
              }
              colorIndex = nonAttendedCount
            }
            
            const itemStyle = getItemStyles(item, colorIndex)
            
            // Override background for last class on special days
            let finalBackground = item.type === 'class' && item.attended ? '#F3F4F6' : itemStyle.background
            if (isLastClass && item.type === 'class' && !item.attended) {
              // Use a different color for the last class - let's use a different gradient
              finalBackground = 'linear-gradient(to bottom right, rgba(255, 182, 193, 0.3), #FFE4E6, rgba(255, 182, 193, 0.3))'
            }
            return (
              <Card 
                key={item._id} 
                className={`${item.type === 'class' ? 'p-5' : 'p-4'} border-2 ${itemStyle.className || ''} transition-all duration-300 hover:shadow-xl hover:scale-[1.01] ${isFirstUpcoming ? 'ring-2 ring-offset-2' : ''}`} 
                style={{ 
                  background: finalBackground, 
                  borderColor: item.type === 'class' && item.attended ? '#D1D5DB' : (isFirstUpcoming ? '#00A7B3' : (isLastClass && item.type === 'class' && !item.attended ? 'rgba(255, 182, 193, 0.5)' : itemStyle.borderColor)),
                  borderRadius: '16px',
                  boxShadow: isFirstUpcoming 
                    ? '0 8px 24px rgba(0, 167, 179, 0.3)' 
                    : item.type === 'class' && item.attended 
                      ? '0 2px 8px rgba(0, 0, 0, 0.1)' 
                      : '0 4px 12px rgba(0, 167, 179, 0.15)',
                  ringColor: isFirstUpcoming ? '#00A7B3' : undefined,
                  opacity: item.type === 'class' && item.attended ? 0.85 : 1
                }}
              >
                {isFirstUpcoming && timeRemaining && (
                  <div className="px-3 py-2 rounded-xl border-2 border-white/30" style={{ 
                    background: 'linear-gradient(135deg, #00A7B3, #00C4D4)', 
                    boxShadow: '0 4px 16px rgba(0, 167, 179, 0.4)'
                  }}>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-white flex-shrink-0" />
                      <span className="text-white/90 font-medium text-xs">
                        Neste time starter om:
                      </span>
                      <span className="text-white font-extrabold text-sm whitespace-nowrap px-2 py-0.5 rounded-md bg-white/20">
                        {timeRemaining.hours > 0 && `${timeRemaining.hours}t : `}{timeRemaining.minutes}min : {timeRemaining.seconds}s
                      </span>
                    </div>
                  </div>
                )}
                {item.type === 'class' ? (
                  // Clean two-row layout with better spacing
                  <div className="space-y-3.5">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <h4 className="font-bold text-base truncate" style={{ color: item.attended ? '#6B7280' : '#006C75' }}>{item.subject}</h4>
                        <div className="flex items-center gap-1.5 text-sm font-medium" style={{ color: item.attended ? '#9CA3AF' : 'rgba(0, 108, 117, 0.7)' }}>
                          <Clock className="w-4 h-4 flex-shrink-0" />
                        <span>{item.time}</span>
                      </div>
                          {item.attended && <CheckCircle className="w-5 h-5 flex-shrink-0" style={{ color: '#6B7280' }} />}
                      </div>
                      <div className="flex items-center gap-2.5 flex-shrink-0">
                        <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold shadow-sm transition-all duration-200 hover:scale-105" style={{ 
                          border: '1px solid',
                          borderColor: item.attended ? '#D1D5DB' : 'rgba(0, 167, 179, 0.3)',
                          backgroundColor: item.attended ? '#E5E7EB' : 'rgba(255, 255, 255, 0.9)',
                          boxShadow: item.attended ? '0 1px 3px rgba(0, 0, 0, 0.1)' : '0 2px 6px rgba(0, 167, 179, 0.2)'
                        }}>
                          <Coins className="w-4 h-4" style={{ color: item.attended ? '#6B7280' : '#00A7B3' }} />
                          <span style={{ color: item.attended ? '#6B7280' : '#006C75' }}>{item.points} p</span>
                    </div>
                        </div>
                          </div>
                    <div className="flex items-center gap-3 text-sm font-medium" style={{ color: item.attended ? '#9CA3AF' : 'rgba(0, 108, 117, 0.7)' }}>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">{item.room}</span>
                      </div>
                      {item.teacher && (
                        <>
                          <span>•</span>
                          <span className="truncate">{item.teacher}</span>
                        </>
                    )}
                  </div>
                        </div>
                ) : (
                  // Simplified Event/Trip card layout
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      {item.emoji && (
                        <span className="text-2xl">{item.emoji}</span>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold drop-shadow-md" style={{ color: 'white' }}>{item.subject}</h4>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-white/90">
                          <span>{item.time}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            )
          })}
          </div>
        )}
      </div>

      {/* Enhanced Upcoming Events */}
      {upcomingEvents.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="h-1 flex-1 rounded-full" style={{ background: 'linear-gradient(90deg, #006C75, #00A7B3)' }}></div>
            <h2 className="font-extrabold text-2xl whitespace-nowrap flex-shrink-0" style={{ color: '#006C75' }}>Kommende Arrangementer</h2>
            <div className="h-1 flex-1 rounded-full" style={{ background: 'linear-gradient(90deg, #006C75, #00A7B3)' }}></div>
          </div>
          <div className="space-y-3">
            {(showAllEvents ? upcomingEvents : upcomingEvents.slice(0, 5)).map((event: any) => {
              const eventIdString = typeof event._id === 'string' ? event._id : event._id.toString()
              return (
                <EventCard
                  key={event._id}
                  event={{
                    _id: event._id,
                    subject: event.subject,
                    description: event.description,
                    day: event.day,
                    time: event.time,
                    room: event.room,
                    emoji: event.emoji,
                    colorTheme: event.colorTheme,
                    capacity: event.capacity,
                    registered: event.registered,
                    isRegistered: registeredEventsSet.has(eventIdString) || event.isRegistered,
                  }}
                  eventType="scheduleItem"
                  onRSVP={handleRSVP}
                  registeredEvents={registeredEventsSet}
                />
              )
            })}
          </div>
          {upcomingEvents.length > 5 && (
            <Button
              onClick={() => setShowAllEvents(!showAllEvents)}
              className="w-full mt-4 flex items-center justify-center gap-2 hover:bg-opacity-10 transition-all"
              style={{
                background: 'transparent',
                color: '#006C75',
                border: '2px solid rgba(0, 108, 117, 0.3)',
                borderRadius: '12px',
                padding: '12px',
                fontWeight: '600'
              }}
            >
              {showAllEvents ? (
                <>
                  <ChevronUp className="w-5 h-5" />
                  Vis færre
                </>
              ) : (
                <>
                  <ChevronDown className="w-5 h-5" />
                  Se alle arrangementer ({upcomingEvents.length})
                </>
              )}
            </Button>
          )}
        </div>
      )}

    </div>
  )
}