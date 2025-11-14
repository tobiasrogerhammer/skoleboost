import React, { useState, useEffect, useCallback } from 'react'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { Clock, MapPin, Coins, CheckCircle, XCircle, Camera, Palette, Music, TreePine, Gamepad2, Users, UserPlus, UserCheck, MessageCircle, Image, Heart } from 'lucide-react'
import { Card } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Textarea } from './ui/textarea'
import { Avatar } from './ui/avatar'
import { toast } from 'sonner'

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
  const markAttendedMutation = useMutation(api.schedule.markAttended)
  const registerEventMutation = useMutation(api.events.register)
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null)
  const [newComment, setNewComment] = useState('')
  const [timeRemaining, setTimeRemaining] = useState<{ hours: number; minutes: number; seconds: number } | null>(null)
  
  const todayItems = scheduleData.filter((item: any) => item.day === 'I dag')
  const tomorrowItems = scheduleData.filter((item: any) => item.day === 'I morgen')
  const upcomingEvents = scheduleData.filter((item: any) => ['Fredag', 'Lørdag'].includes(item.day))
  const attendedToday = todayItems.filter(item => item.attended).length
  const totalPointsToday = todayItems.filter(item => item.attended && item.type === 'class').reduce((sum, item) => sum + item.points, 0)

  // Find first upcoming class that hasn't started
  const getFirstUpcomingClass = useCallback(() => {
    const now = new Date()
    const currentTime = now.getHours() * 60 + now.getMinutes() // minutes since midnight
    
    for (const item of todayItems) {
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
  }, [todayItems])

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
  }, [scheduleData, getFirstUpcomingClass])

  const handleRSVP = async (eventId: string) => {
    try {
      const result = await registerEventMutation({ eventId: eventId as any })
      toast.success(result.registered ? 'Påmeldt arrangement!' : 'Avmeldt fra arrangement')
      // Refresh selected event if it's the one we just registered for
      if (selectedEvent && (selectedEvent._id === eventId || selectedEvent.id === eventId)) {
        setSelectedEvent({ ...selectedEvent, isRegistered: result.registered })
      }
    } catch (error: any) {
      toast.error(error.message || 'Noe gikk galt')
    }
  }

  const handleAddComment = (eventId: string) => {
    if (!newComment.trim()) return
    // TODO: Implement comment functionality in Convex
    setNewComment('')
    toast.success('Kommentar lagt til!')
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

    const getItemStyles = (item: ScheduleItem): { background?: string, borderColor?: string, className?: string } => {
      if (item.type === 'class') {
        // Colorful class cards based on subject
        const classColors = [
          { bg: 'linear-gradient(to bottom right, rgba(0, 167, 179, 0.2), #E8F6F6, rgba(0, 167, 179, 0.2))', border: 'rgba(0, 167, 179, 0.5)' },
          { bg: 'linear-gradient(to bottom right, rgba(251, 190, 158, 0.2), #FFF4E6, rgba(251, 190, 158, 0.2))', border: 'rgba(251, 190, 158, 0.5)' },
          { bg: 'linear-gradient(to bottom right, rgba(232, 165, 255, 0.2), #F5E6FF, rgba(232, 165, 255, 0.2))', border: 'rgba(232, 165, 255, 0.5)' },
          { bg: 'linear-gradient(to bottom right, rgba(78, 205, 196, 0.2), #E8F6F6, rgba(78, 205, 196, 0.2))', border: 'rgba(78, 205, 196, 0.5)' },
        ]
        const index = typeof item._id === 'string' ? parseInt(item._id.replace(/\D/g, '')) % classColors.length : 0
        return { background: classColors[index].bg, borderColor: classColors[index].border, className: 'shadow-md' }
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

  // Get current day name
  const getDayName = () => {
    const days = ['Søndag', 'Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag']
    return days[new Date().getDay()]
  }
  const dayName = getDayName()

  return (
    <div className="pb-20 px-4 pt-6 max-w-md mx-auto space-y-6">
      {/* Enhanced Header */}
      <div className="text-center mb-8">
        <div className="inline-block mb-3 p-3 rounded-2xl" style={{ background: 'linear-gradient(135deg, rgba(0, 167, 179, 0.1), rgba(232, 246, 246, 0.5))' }}>
          <span className="text-4xl">📚</span>
        </div>
        <h1 className="mb-2 font-bold text-3xl" style={{ color: '#006C75' }}>Din Timeplan</h1>
        <p className="text-base font-semibold mb-1" style={{ color: 'rgba(0, 108, 117, 0.9)' }}>{dayName}s Timer & Arrangementer</p>
        <p className="text-sm font-medium" style={{ color: 'rgba(0, 108, 117, 0.7)' }}>Følg oppmøte og tjen poeng! 💪</p>
      </div>

      {/* Enhanced Today's Stats */}
      <Card className="p-5 border-2 shadow-2xl" style={{ background: 'linear-gradient(135deg, #00A7B3 0%, #00C4D4 50%, #4ECDC4 100%)', borderColor: 'rgba(255, 255, 255, 0.3)', borderRadius: '20px', boxShadow: '0 10px 40px rgba(0, 167, 179, 0.3)' }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-extrabold text-xl drop-shadow-lg">Dagens Fremgang</h3>
          <div className="bg-white/30 p-2 rounded-xl backdrop-blur-md">
            <CheckCircle className="w-5 h-5 text-white" />
          </div>
          </div>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="bg-white/30 backdrop-blur-md rounded-xl p-3 shadow-lg border border-white/20">
            <div className="text-3xl font-extrabold text-white drop-shadow-lg mb-1">{attendedToday}</div>
            <div className="text-xs text-white font-semibold uppercase tracking-wide">Deltatt</div>
            <div className="text-xs text-white/80 mt-1">✅ Fullført</div>
            </div>
          <div className="bg-white/30 backdrop-blur-md rounded-xl p-3 shadow-lg border border-white/20">
            <div className="text-3xl font-extrabold text-white drop-shadow-lg mb-1">{todayItems.length - attendedToday}</div>
            <div className="text-xs text-white font-semibold uppercase tracking-wide">Gjenstår</div>
            <div className="text-xs text-white/80 mt-1">⏳ Igjen</div>
          </div>
          <div className="bg-white/30 backdrop-blur-md rounded-xl p-3 shadow-lg border border-white/20">
            <div className="flex items-center justify-center mb-1">
              <Coins className="w-6 h-6 text-white mr-1 drop-shadow-lg" />
              <span className="text-3xl font-extrabold text-white drop-shadow-lg">{totalPointsToday}</span>
            </div>
            <div className="text-xs text-white font-semibold uppercase tracking-wide">Poeng</div>
            <div className="text-xs text-white/80 mt-1">💰 Tjent</div>
          </div>
        </div>
      </Card>

      {/* Enhanced Today's Schedule */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="h-1 w-12 rounded-full" style={{ background: 'linear-gradient(90deg, #00A7B3, #00C4D4)' }}></div>
          <h2 className="font-extrabold text-2xl" style={{ color: '#006C75' }}>Dagens Timeplan</h2>
          <div className="h-1 flex-1 rounded-full" style={{ background: 'linear-gradient(90deg, #00A7B3, transparent)' }}></div>
        </div>
        <div className="space-y-3">
          {todayItems.map((item: any, index: number) => {
            const upcoming = getFirstUpcomingClass()
            const isFirstUpcoming = upcoming && upcoming.item._id === item._id && item.type === 'class' && !item.attended
            const IconComponent = getItemIcon(item)
            const itemStyle = getItemStyles(item)
            return (
              <Card 
                key={item._id} 
                className={`${item.type === 'class' ? 'p-5' : 'p-4'} border-2 ${itemStyle.className || ''} transition-all duration-300 hover:shadow-xl ${isFirstUpcoming ? 'ring-2 ring-offset-2' : ''}`} 
                style={{ 
                  background: item.type === 'class' && item.attended ? 'rgba(0, 0, 0, 0.05)' : itemStyle.background, 
                  borderColor: item.type === 'class' && item.attended ? 'rgba(0, 0, 0, 0.2)' : (isFirstUpcoming ? '#00A7B3' : itemStyle.borderColor),
                  borderRadius: '16px',
                  boxShadow: isFirstUpcoming ? '0 8px 24px rgba(0, 167, 179, 0.3)' : undefined,
                  ringColor: isFirstUpcoming ? '#00A7B3' : undefined
                }}
              >
                {isFirstUpcoming && timeRemaining && (
                  <div className="mb-2.5 p-2.5 rounded-xl" style={{ background: 'linear-gradient(135deg, #00A7B3, #00C4D4)', boxShadow: '0 4px 12px rgba(0, 167, 179, 0.3)' }}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-white" />
                        <span className="text-white font-bold text-xs">Neste time starter om:</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {timeRemaining.hours > 0 && (
                          <div className="bg-white/30 backdrop-blur-md px-2 py-1 rounded-lg text-center min-w-[45px]">
                            <div className="text-white font-extrabold text-base leading-none">{timeRemaining.hours}</div>
                            <div className="text-white/90 text-[10px] font-semibold mt-0.5">t{timeRemaining.hours !== 1 ? 'imer' : 'ime'}</div>
                          </div>
                        )}
                        <div className="bg-white/30 backdrop-blur-md px-2 py-1 rounded-lg text-center min-w-[45px]">
                          <div className="text-white font-extrabold text-base leading-none">{timeRemaining.minutes}</div>
                          <div className="text-white/90 text-[10px] font-semibold mt-0.5">min{timeRemaining.minutes !== 1 ? 'utter' : 'utt'}</div>
                    </div>
                        <div className="bg-white/30 backdrop-blur-md px-2 py-1 rounded-lg text-center min-w-[45px]">
                          <div className="text-white font-extrabold text-base leading-none">{timeRemaining.seconds}</div>
                          <div className="text-white/90 text-[10px] font-semibold mt-0.5">sek</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {item.type === 'class' ? (
                  // Clean two-row layout with better spacing
                  <div className="space-y-3.5">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <h4 className="font-bold text-base truncate" style={{ color: '#006C75' }}>{item.subject}</h4>
                        <div className="flex items-center gap-1.5 text-sm font-medium" style={{ color: 'rgba(0, 108, 117, 0.7)' }}>
                          <Clock className="w-4 h-4 flex-shrink-0" />
                        <span>{item.time}</span>
                      </div>
                          <CheckCircle className="w-5 h-5 flex-shrink-0" style={{ color: '#00A7B3' }} />
                      </div>
                      <div className="flex items-center gap-2.5 flex-shrink-0">
                        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-bold" style={{ 
                          border: '1px solid',
                          borderColor: item.attended ? 'rgba(0, 167, 179, 0.5)' : 'rgba(0, 167, 179, 0.3)',
                          backgroundColor: item.attended ? 'rgba(0, 167, 179, 0.1)' : 'transparent'
                        }}>
                          <Coins className="w-4 h-4" style={{ color: item.attended ? '#00A7B3' : 'rgba(0, 167, 179, 0.6)' }} />
                          <span style={{ color: item.attended ? '#00A7B3' : 'rgba(0, 108, 117, 0.7)' }}>{item.points} p</span>
                    </div>
                        </div>
                          </div>
                    <div className="flex items-center gap-3 text-sm font-medium" style={{ color: 'rgba(0, 108, 117, 0.7)' }}>
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
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              onClick={() => setSelectedEvent(item)}
                          className="text-white hover:bg-white/20"
                            >
                          <MessageCircle className="w-4 h-4 mr-1" />
                          Se Detaljer
                            </Button>
                          </DialogTrigger>
                        </Dialog>
                  </div>
                )}
              </Card>
            )
          })}
        </div>
      </div>

      {/* Enhanced Tomorrow's Schedule Preview */}
      {tomorrowItems.length > 0 && (
      <div>
        <div className="flex items-center gap-3 mb-5">
          <div className="h-1 w-12 rounded-full" style={{ background: 'linear-gradient(90deg, #FBBE9E, #FF9F66)' }}></div>
          <h2 className="font-extrabold text-2xl" style={{ color: '#006C75' }}>Morgendagens Forhåndsvisning</h2>
          <div className="h-1 flex-1 rounded-full" style={{ background: 'linear-gradient(90deg, #FBBE9E, transparent)' }}></div>
        </div>
        <div className="space-y-3">
          {tomorrowItems.map((item: any) => {
            const IconComponent = getItemIcon(item)
            const tomorrowItemStyle = getItemStyles(item)
            return (
              <Card key={item._id} className={`p-4 border-2 opacity-80 ${tomorrowItemStyle.className || ''}`} style={{ background: tomorrowItemStyle.background, borderColor: tomorrowItemStyle.borderColor, backgroundColor: 'rgba(236, 236, 240, 0.3)' }}>
                {item.type === 'class' ? (
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {item.emoji && (
                        <span className="text-base">{item.emoji}</span>
                      )}
                      {IconComponent && (
                          <IconComponent className="w-4 h-4" style={{ color: '#00A7B3' }} />
                        )}
                        <h4 style={{ color: '#006C75' }}>{item.subject}</h4>
                    </div>
                      <div className="flex items-center gap-4 text-sm font-medium" style={{ color: 'rgba(0, 108, 117, 0.7)' }}>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{item.time}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span>{item.room}</span>
                      </div>
                    </div>
                        </div>
                      <Badge variant="outline">
                        <Coins className="w-3 h-3 mr-1" />
                      {item.points} p
                      </Badge>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      {item.emoji && (
                        <span className="text-2xl">{item.emoji}</span>
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold drop-shadow-md mb-1" style={{ color: 'white' }}>{item.subject}</h4>
                        <div className="flex items-center gap-2 text-xs text-white/90">
                          <span>{item.time}</span>
                        </div>
                      </div>
                    </div>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              onClick={() => setSelectedEvent(item)}
                          className="text-white hover:bg-white/20"
                            >
                          <MessageCircle className="w-4 h-4 mr-1" />
                          Se Detaljer
                            </Button>
                          </DialogTrigger>
                        </Dialog>
                  </div>
                )}
              </Card>
            )
          })}
        </div>
      </div>
      )}

      {/* Enhanced Upcoming Events */}
      {upcomingEvents.length > 0 && (
        <div>
          <div className="flex items-center gap-3 mb-5">
            <div className="h-1 w-12 rounded-full" style={{ background: 'linear-gradient(90deg, #E8A5FF, #C77DFF)' }}></div>
            <h2 className="font-extrabold text-2xl" style={{ color: '#006C75' }}>🌟 Kommende Arrangementer</h2>
            <div className="h-1 flex-1 rounded-full" style={{ background: 'linear-gradient(90deg, #E8A5FF, transparent)' }}></div>
          </div>
          <div className="space-y-3">
            {upcomingEvents.map((event: any) => {
              const IconComponent = getItemIcon(event)
              const eventStyle = getItemStyles(event)
              return (
                <Card key={event._id} className={`p-4 border-2 border-dashed ${eventStyle.className || ''}`} style={{ background: eventStyle.background, borderColor: eventStyle.borderColor }}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                        {event.emoji && (
                        <span className="text-2xl">{event.emoji}</span>
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white font-bold drop-shadow-md mb-1">{event.subject}</h4>
                        <div className="flex items-center gap-2 text-xs text-white/90">
                          <Badge className="text-xs text-white backdrop-blur-sm font-semibold" style={{ backgroundColor: 'rgba(255, 255, 255, 0.3)', borderColor: 'rgba(255, 255, 255, 0.4)' }}>
                          {event.day}
                        </Badge>
                          <span>•</span>
                          <span>{event.time}</span>
                        </div>
                        </div>
                      </div>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                onClick={() => setSelectedEvent(event)}
                          className="text-white hover:bg-white/20"
                              >
                          <MessageCircle className="w-4 h-4 mr-1" />
                          Se Detaljer
                              </Button>
                            </DialogTrigger>
                          </Dialog>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {/* Event Detail Modal */}
      {selectedEvent && (
        <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {selectedEvent.emoji && <span className="text-xl">{selectedEvent.emoji}</span>}
                {selectedEvent.subject}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              {/* Event Info */}
              <div className="p-4 border-2 rounded-lg" style={{ background: 'linear-gradient(to bottom right, #E8F6F6, white)', borderColor: 'rgba(0, 167, 179, 0.3)' }}>
                <p className="text-sm mb-3 font-medium" style={{ color: '#006C75' }}>{selectedEvent.description}</p>
                <div className="flex items-center gap-4 text-sm font-medium" style={{ color: 'rgba(0, 108, 117, 0.8)' }}>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{selectedEvent.time}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span>{selectedEvent.room}</span>
                  </div>
                </div>
                {selectedEvent.capacity && (
                  <div className="mt-3 text-sm">
                    <span className="font-medium" style={{ color: '#006C75' }}>Kapasitet: </span>
                    <span className="font-bold text-lg" style={{ color: (selectedEvent.registered || 0) >= selectedEvent.capacity ? '#FBBE9E' : '#00A7B3' }}>
                      {selectedEvent.registered}/{selectedEvent.capacity}
                    </span>
                  </div>
                )}
              </div>

              {/* RSVP Section */}
              <div className="flex gap-2">
                <Button
                  variant={selectedEvent.isRegistered ? "outline" : "secondary"}
                  onClick={() => handleRSVP(selectedEvent._id)}
                  disabled={!selectedEvent.isRegistered && (selectedEvent.registered || 0) >= (selectedEvent.capacity || 0)}
                  className="flex-1"
                >
                  {selectedEvent.isRegistered ? (
                    <><UserCheck className="w-4 h-4 mr-2" />Påmeldt</>
                  ) : (selectedEvent.registered || 0) >= (selectedEvent.capacity || 0) ? (
                    'Arrangement Fullt'
                  ) : (
                    <><UserPlus className="w-4 h-4 mr-2" />Meld deg på nå</>
                  )}
                </Button>
              </div>

              {/* Photos Section */}
              {selectedEvent.photos && selectedEvent.photos.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Image className="w-4 h-4" />
                    Arrangementsbilder
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedEvent.photos.map((photo) => (
                      <div key={photo.id} className="space-y-1">
                        <img 
                          src={photo.url} 
                          alt={photo.caption}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <div className="text-xs">
                          <p className="font-bold" style={{ color: '#006C75' }}>{photo.author}</p>
                          <p className="font-medium" style={{ color: 'rgba(0, 108, 117, 0.8)' }}>{photo.caption}</p>
                          <div className="flex items-center gap-1 mt-1">
                            <Heart className="w-3 h-3" style={{ color: '#FF6B9D', fill: '#FF6B9D' }} />
                            <span className="font-medium" style={{ color: '#006C75' }}>{photo.likes}</span>
                            <span style={{ color: 'rgba(0, 108, 117, 0.6)' }}>• {photo.timestamp}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Comments Section */}
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  Kommentarer ({selectedEvent.comments?.length || 0})
                </h4>
                
                <div className="space-y-3 mb-3 max-h-40 overflow-y-auto">
                  {selectedEvent.comments?.map((comment) => (
                    <div key={comment.id} className="flex gap-2">
                      <Avatar className="w-6 h-6 text-xs">
                        {comment.author.charAt(0)}
                      </Avatar>
                      <div className="flex-1 text-sm">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold" style={{ color: '#006C75' }}>{comment.author}</span>
                          <span className="text-xs" style={{ color: 'rgba(0, 108, 117, 0.6)' }}>{comment.timestamp}</span>
                        </div>
                        <p className="font-medium" style={{ color: 'rgba(0, 108, 117, 0.9)' }}>{comment.message}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Comment */}
                <div className="flex gap-2">
                  <Textarea
                    placeholder="Legg til en kommentar..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="flex-1 min-h-[60px] resize-none"
                  />
                  <Button 
                    size="sm" 
                    onClick={() => handleAddComment(selectedEvent._id)}
                    disabled={!newComment.trim()}
                  >
                    Publiser
                  </Button>
                </div>
              </div>

              {/* Participation Stats */}
              {selectedEvent.participationCount && (
                <div className="text-center p-3 rounded-lg border" style={{ backgroundColor: '#E8F6F6', borderColor: 'rgba(0, 167, 179, 0.2)' }}>
                  <div className="text-lg font-bold" style={{ color: '#006C75' }}>{selectedEvent.participationCount}</div>
                  <div className="text-xs text-muted-foreground">
                    elever har deltatt i lignende arrangementer
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}