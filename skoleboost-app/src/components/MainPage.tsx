import React, { useState } from 'react'
import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { Coins, ShoppingBag, Star, TrendingUp, Calendar, Users, UserPlus, UserMinus, ChevronRight, CheckCircle2, Bell } from 'lucide-react'
import { Card } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { Logo } from './Logo'

interface Coupon {
  id: string
  title: string
  description: string
  cost: number
  available: number
  category: string
  allergies: string[]
  emoji: string
}

interface MainPageProps {
  currentPoints: number
  totalEarned: number
  onRedeemCoupon: (couponId: string, cost: number) => void
}

const mockCoupons: Coupon[] = [
  {
    id: '1',
    title: 'Valgfritt Pizzastykke',
    description: 'Få en gratis pizzabit fra kafeteriaen, vi har pepperoni, margherita og vegetar',
    cost: 50,
    available: 15,
    category: 'Mat',
    allergies: ['Gluten', 'Melk'],
    emoji: '🍕'
  },
  {
    id: '2',
    title: 'Burger Meny',
    description: 'Burger med pommes frites og drikke',
    cost: 100,
    available: 8,
    category: 'Mat',
    allergies: ['Gluten', 'Melk'],
    emoji: '🍔'
  },
  {
    id: '3',
    title: 'Smoothie',
    description: 'Fersk fruktsmoothie etter ditt valg. Vi har banan-blåbær, eple-mango og protein-smoothie',
    cost: 30,
    available: 20,
    category: 'Drikke',
    allergies: ['Melk'],
    emoji: '🥤'
  },
  {
    id: '4',
    title: 'Salatbar',
    description: 'Sunn salatbar med pasta, grønnsaker, kylling, egg og dressing',
    cost: 40,
    available: 12,
    category: 'Mat',
    allergies: [],
    emoji: '🥗'
  },
  {
    id: '5',
    title: 'Cookies',
    description: 'Pakke med 4 aunt mables cookies',
    cost: 25,
    available: 25,
    category: 'Snacks',
    allergies: ['Gluten', 'Egg', 'Melk'],
    emoji: '🍪'
  },
  {
    id: '6',
    title: 'Energidrikk',
    description: 'Redbull, Monster, eller Burn',
    cost: 35,
    available: 10,
    category: 'Drikke',
    allergies: [],
    emoji: '⚡'
  }
]

interface SocialEvent {
  id: string
  title: string
  description: string
  date: string
  time: string
  emoji: string
  registered: number
  capacity: number
  colorTheme: string
}

const mockSocialEvents: SocialEvent[] = [
  {
    id: '1',
    title: 'Gaming Turnering',
    description: 'Episk gaming-konkurranse med premier og pizza!',
    date: 'Fredag',
    time: '16:00',
    emoji: '🎮',
    registered: 14,
    capacity: 16,
    colorTheme: 'blue'
  },
  {
    id: '2',
    title: 'Skogstur og båltenning',
    description: 'Utforsk vakre stier og nyt en pikniklunsj med båltenning',
    date: 'Lørdag',
    time: '09:00',
    emoji: '🌲',
    registered: 9,
    capacity: 12,
    colorTheme: 'green'
  },
  {
    id: '3',
    title: 'Vinter Kunstutstilling',
    description: 'Vises frem og beundres fantastisk elevkunst',
    date: 'I dag',
    time: '15:00',
    emoji: '🎨',
    registered: 23,
    capacity: 50,
    colorTheme: 'pink'
  }
]

const mockAnnouncements = [
  {
    _id: 'ann1',
    title: 'Foreldremøte tirsdag 21 / 10',
    content: 'Vi inviterer alle foreldre til foreldremøte tirsdag 21. oktober kl. 18:00',
    createdAt: Date.now() - 86400000,
  },
  {
    _id: 'ann2',
    title: 'Elevsamtaler uke 45',
    content: 'Elevsamtaler for alle klasser vil finne sted i uke 45. Book tid via skoleportalen.',
    createdAt: Date.now() - 172800000,
  },
]

export function MainPage({ currentPoints, totalEarned, onRedeemCoupon }: MainPageProps) {
  const coupons = useQuery(api.coupons.getAll) || []
  const socialEvents = useQuery(api.events.getAll) || []
  const announcementsQuery = useQuery(api.announcements.getAll)
  // Use mock data if query is undefined or returns empty array
  const announcements = (announcementsQuery !== undefined && announcementsQuery.length > 0) ? announcementsQuery : mockAnnouncements
  const todayPoints = 15 // Mock today's earned points
  const attendanceRate = 80
  const classesAttended = 12
  const totalClasses = 28 // 28 timer per uke (ikke inkludert lunsj)
  const [showAllEvents, setShowAllEvents] = useState(false)
  const [registeredEvents, setRegisteredEvents] = useState<Set<string>>(new Set())
  const [redeemedCoupon, setRedeemedCoupon] = useState<{ coupon: any, cost: number, newBalance: number } | null>(null)
  
  // Time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return { text: 'God morgen!', emoji: '🌅' }
    if (hour < 17) return { text: 'God ettermiddag!', emoji: '☀️' }
    return { text: 'God kveld!', emoji: '🌙' }
  }
  const greeting = getGreeting()

  const getEventStyles = (colorTheme: string) => {
    switch (colorTheme) {
      case 'blue':
        return { bg: 'linear-gradient(to bottom right, #00A7B3, #00C4D4, #00A7B3)', border: 'rgba(0, 167, 179, 0.5)' }
      case 'green':
        return { bg: 'linear-gradient(to bottom right, #4ECDC4, #44A08D, #4ECDC4)', border: 'rgba(78, 205, 196, 0.5)' }
      case 'pink':
        return { bg: 'linear-gradient(to bottom right, #FF6B9D, #FF8E9B, #FF6B9D)', border: 'rgba(255, 107, 157, 0.5)' }
      default:
        return { bg: 'linear-gradient(to bottom right, #E8F6F6, rgba(0, 167, 179, 0.2))', border: 'rgba(0, 167, 179, 0.3)' }
    }
  }

  return (
    <div className="pb-20 px-4 max-w-md mx-auto space-y-4" style={{ paddingTop: '2.5rem' }}>
      {/* Enhanced Header */}
      <div className="text-center mb-4">
        <div className="flex justify-center mb-1">
          <Logo size="md" />
        </div>
        <h1 className="mb-1 font-bold text-2xl" style={{ color: '#006C75' }}>{greeting.text}</h1>
        <p className="text-sm font-medium" style={{ color: 'rgba(0, 108, 117, 0.8)' }}>Du gjør det bra! Fortsett sånn! 🚀</p>
      </div>

      {/* Enhanced Points Summary */}
      <div className="grid grid-cols-2 gap-2">
        <Card 
          className="px-4 py-1 text-center shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] flex flex-col justify-center gap-2" 
          style={{ 
            background: 'linear-gradient(135deg, #00A7B3 0%, #00C4D4 50%, #4ECDC4 100%)', 
            border: '3px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 10px 30px rgba(0, 167, 179, 0.3)'
          }}
        >
          <div className="flex items-center justify-center">
            <Coins className="w-10 h-10 text-white drop-shadow-lg" />
          </div>
          <span className="font-extrabold text-white block drop-shadow-lg" style={{ fontSize: '2rem', lineHeight: '1', textShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>{currentPoints}</span>
          <p className="text-sm text-white font-semibold tracking-wide uppercase">Nåværende Poeng</p>
        </Card>

        <Card 
          className="px-4 py-1 text-center shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] flex flex-col justify-center gap-2" 
          style={{ 
            background: 'linear-gradient(135deg, #FBBE9E 0%, #FF9F66 50%, #FFB84D 100%)', 
            border: '3px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 10px 30px rgba(251, 190, 158, 0.3)'
          }}
        >
          <div className="flex items-center justify-center">
            <TrendingUp className="w-10 h-10 text-white drop-shadow-lg" />
          </div>
          <span className="font-extrabold text-white block drop-shadow-lg" style={{ fontSize: '2rem', lineHeight: '1', textShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>+{todayPoints}</span>
          <p className="text-sm text-white font-semibold tracking-wide uppercase">Dagens Poeng</p>
        </Card>
      </div>

      {/* Enhanced Progress Stats - Compact Design */}
      <Card className="p-3 shadow-xl" style={{ background: 'linear-gradient(135deg, rgba(0, 167, 179, 0.08), #E8F6F6, rgba(0, 167, 179, 0.08))', border: '2px solid rgba(0, 167, 179, 0.3)', borderRadius: '20px' }}>
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-base" style={{ color: '#006C75' }}>Ukens Fremgang</h3>
          <div className="p-3 rounded-xl shadow-md animate-pulse" style={{ background: 'linear-gradient(135deg, #FFD700, #FFA500)' }}>
            <Star className="w-4 h-4 text-white fill-white" />
          </div>
        </div>
        {/* Kunngjøringer */}
        {announcements.length > 0 && (
          <div className="mb-2 pb-2 border-b" style={{ borderColor: 'rgba(0, 167, 179, 0.2)' }}>
            <div className="flex items-center gap-2 mb-1.5">
              <Bell className="w-3.5 h-3.5" style={{ color: '#00A7B3' }} />
              <span className="text-m font-semibold" style={{ color: '#006C75' }}>Kunngjøringer</span>
            </div>
            <div className="space-y-1.5">
              {announcements.slice(0, 2).map((announcement: any) => {
                const timeAgo = announcement.createdAt 
                  ? (() => {
                      const diff = Date.now() - announcement.createdAt
                      const hours = Math.floor(diff / 3600000)
                      const days = Math.floor(hours / 24)
                      if (days > 0) return `${days} ${days === 1 ? 'dag' : 'dager'} siden`
                      if (hours > 0) return `${hours} ${hours === 1 ? 'time' : 'timer'} siden`
                      return 'Nylig'
                    })()
                  : 'Nylig'
                
                return (
                  <div 
                    key={announcement._id} 
                    className="px-2 py-1.5 rounded-lg transition-all hover:scale-[1.01]"
                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.6)', boxShadow: '0 1px 3px rgba(0, 167, 179, 0.1)' }}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-[9px] font-bold mb-0.5 truncate" style={{ color: '#006C75' }}>
                          {announcement.title}
                        </h4>
                        <p className="text-[8px] line-clamp-1" style={{ color: 'rgba(0, 108, 117, 0.7)' }}>
                          {announcement.content || announcement.description}
                        </p>
                      </div>
                      <span className="text-[8px] font-medium flex-shrink-0" style={{ color: 'rgba(0, 108, 117, 0.6)' }}>
                        {timeAgo}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
        <div className="grid grid-cols-3 gap-2">
          <div className="px-2 py-2 rounded-lg transition-all hover:scale-[1.02]" style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', boxShadow: '0 2px 6px rgba(0, 167, 179, 0.1)' }}>
            <div className="text-center">
              <div className="text-xs font-medium mb-1" style={{ color: 'rgba(0, 108, 117, 0.7)' }}>Totale Poeng</div>
              <div className="font-extrabold text-lg" style={{ color: '#00A7B3' }}>{totalEarned}</div>
            </div>
          </div>
          <div className="px-2 py-2 rounded-lg transition-all hover:scale-[1.02]" style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', boxShadow: '0 2px 6px rgba(0, 167, 179, 0.1)' }}>
            <div className="text-center">
              <div className="text-xs font-medium mb-1" style={{ color: 'rgba(0, 108, 117, 0.7)' }}>Timer</div>
              <div className="font-extrabold text-lg mb-1" style={{ color: '#00A7B3' }}>{classesAttended}/{totalClasses}</div>
              <div className="w-full h-1 rounded-full" style={{ backgroundColor: 'rgba(0, 167, 179, 0.2)' }}>
                <div className="h-full rounded-full transition-all" style={{ width: `${(classesAttended / totalClasses) * 100}%`, background: 'linear-gradient(to right, #00A7B3, #00C4D4)' }}></div>
              </div>
            </div>
          </div>
          <div className="px-2 py-2 rounded-lg transition-all hover:scale-[1.02]" style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', boxShadow: '0 2px 6px rgba(0, 167, 179, 0.1)' }}>
            <div className="text-center">
              <div className="text-xs font-medium mb-1" style={{ color: 'rgba(0, 108, 117, 0.7)' }}>Oppmøte</div>
              <div className="font-extrabold text-lg mb-1" style={{ color: '#00A7B3' }}>{attendanceRate}%</div>
              <div className="w-full h-1 rounded-full" style={{ backgroundColor: 'rgba(0, 167, 179, 0.2)' }}>
                <div className="h-full rounded-full transition-all" style={{ width: `${attendanceRate}%`, background: 'linear-gradient(to right, #00A7B3, #00C4D4)' }}></div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Social Events Preview Card */}
      {socialEvents.length > 0 && (
        <Card 
          className="p-3 border-2 active:scale-[0.98] transition-all duration-200 cursor-pointer" 
          style={{ 
            background: 'linear-gradient(135deg, rgba(251, 190, 158, 0.1), rgba(255, 159, 102, 0.05))', 
            borderColor: 'rgba(251, 190, 158, 0.3)',
            borderRadius: '16px'
          }}
          onClick={() => setShowAllEvents(true)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 flex-1">
              <div className="p-3 rounded-xl" style={{ background: 'linear-gradient(135deg, #FBBE9E, #FF9F66)' }}>
                <Calendar className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-sm mb-0.5" style={{ color: '#006C75' }}>Kommende Arrangementer</h3>
                <p className="text-xs font-medium" style={{ color: 'rgba(0, 108, 117, 0.7)' }}>
                  {socialEvents.length} {socialEvents.length !== 1 ? 'arrangement' : 'arrangement'} kommer
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4" style={{ color: 'rgba(0, 108, 117, 0.6)' }} />
        </div>

            {/* Preview of first three events */}
            <div className="mt-2 grid grid-cols-3 gap-2">
              {socialEvents.slice(0, 3).map((event: any, index: number) => {
              const eventStyle = getEventStyles(event.colorTheme)
                return (
                  <div
                    key={event._id}
                    className="p-1.5 rounded-lg border flex flex-col items-center text-center"
                    style={{
                      background: eventStyle.bg,
                      borderColor: eventStyle.border,
                      minHeight: '70px'
                    }}
                  >
                    <span className="text-lg mb-0.5">{event.emoji}</span>
                    <h4 
                      className="font-bold text-xs mb-0.5 text-white drop-shadow-sm" 
                      style={{ 
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        lineHeight: '1.2'
                      }}
                    >
                      {event.title}
                    </h4>
                    <p className="text-xs font-medium text-white/90 drop-shadow-sm">{event.date}</p>
                  </div>
                )
            })}
          </div>
        </Card>
      )}

      {/* All Events Dialog */}
      <Dialog open={showAllEvents} onOpenChange={setShowAllEvents}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto" style={{ borderRadius: '20px' }}>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold" style={{ color: '#006C75' }}>Sosiale Arrangementer & Utflukter 🎉</DialogTitle>
          </DialogHeader>
          <div className="space-y-2 mt-4">
            {socialEvents.map((event: any) => {
              const eventStyle = getEventStyles(event.colorTheme)
              const isRegistered = registeredEvents.has(event._id)
              const currentRegistered = isRegistered ? event.registered + 1 : event.registered
              const isFull = currentRegistered >= event.capacity
              const fillPercentage = (currentRegistered / event.capacity) * 100

              const handleToggleRegistration = () => {
                setRegisteredEvents(prev => {
                  const newSet = new Set(prev)
                  if (newSet.has(event._id)) {
                    newSet.delete(event._id)
                  } else {
                    newSet.add(event._id)
                  }
                  return newSet
                })
              }

              return (
                <Card 
                  key={event._id} 
                  className="p-3 border-2" 
                  style={{ 
                    background: eventStyle.bg, 
                    borderColor: eventStyle.border,
                    borderRadius: '12px'
                  }}
                >
                  <div className="flex items-start gap-2 mb-2">
                    <span className="text-2xl flex-shrink-0">{event.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-bold text-base mb-1 drop-shadow-lg line-clamp-1">{event.title}</h4>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <Badge className="text-xs bg-white/40 text-white border-white/50 backdrop-blur-md font-bold px-1.5 py-0.5">
                          {event.date}
                        </Badge>
                        <div className="text-white font-semibold bg-white/40 px-2 py-0.5 rounded-full backdrop-blur-md text-xs">
                          ⏰ {event.time}
                        </div>
                        <div className="flex items-center gap-1 text-white font-semibold bg-white/40 px-2 py-0.5 rounded-full backdrop-blur-md text-xs">
                          <Users className="w-3 h-3" />
                          <span>{currentRegistered}/{event.capacity}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-xs text-white/95 mb-2 font-medium line-clamp-2">{event.description}</p>
                  
                  <div className="mb-2">
                    <div className="text-xs text-white font-bold bg-white/40 px-2 py-0.5 rounded-full w-fit backdrop-blur-md">
                      🎉 GRATIS
                    </div>
                  </div>

                  <Button
                    size="sm"
                    variant={isFull && !isRegistered ? "outline" : "default"}
                    disabled={isFull && !isRegistered}
                    onClick={handleToggleRegistration}
                    className={`w-full font-bold transition-all duration-200 text-sm py-1.5`}
                    style={isFull && !isRegistered ? {
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      borderColor: 'rgba(255, 255, 255, 0.4)',
                      backdropFilter: 'blur(10px)'
                    } : isRegistered ? {
                      backgroundColor: '#EF4444',
                      color: 'white',
                      border: 'none',
                      boxShadow: '0 2px 8px rgba(239, 68, 68, 0.4)'
                    } : {
                      backgroundColor: 'white',
                      color: '#000000',
                      border: 'none',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
                    }}
                  >
                    {isFull && !isRegistered ? (
                      '❌ Fullt'
                    ) : isRegistered ? (
                      <><UserMinus className="w-3.5 h-3.5 mr-1" />Meld av</>
                    ) : (
                      <><UserPlus className="w-3.5 h-3.5 mr-1" />Meld deg på!</>
                    )}
                  </Button>
                  
                  <div className="mt-2">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-xs font-semibold text-white/90">Påmelding</span>
                      <span className="text-xs font-bold text-white">{Math.round(fillPercentage)}%</span>
                    </div>
                    <div className="w-full bg-white/30 rounded-full h-1.5 backdrop-blur-sm">
                      <div 
                        className="h-full rounded-full transition-all"
                        style={{ 
                          background: isFull 
                            ? 'linear-gradient(90deg, #FF6B6B, #FF8E8E)' 
                            : 'linear-gradient(90deg, white, rgba(255, 255, 255, 0.8))',
                          width: `${fillPercentage}%`
                        }}
                      />
                    </div>
                  </div>
                </Card>
              )
            })}
        </div>
        </DialogContent>
      </Dialog>

      {/* Enhanced Coupon Store */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-bold text-xl mb-0.5" style={{ color: '#006C75' }}>Kafeteria Kuponger</h2>
            <p className="text-xs font-medium" style={{ color: 'rgba(0, 108, 117, 0.7)' }}>Innlos dine poeng for godterier!</p>
          </div>
          <div className="p-3 rounded-xl shadow-md" style={{ background: 'linear-gradient(135deg, #00A7B3, #00C4D4)' }}>
            <ShoppingBag className="w-5 h-5 text-white" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {coupons.map((coupon: any, index: number) => {
            const getCategoryColor = (category: string) => {
              switch (category) {
                case 'Mat':
                  return { bg: 'linear-gradient(to right, #FBBE9E, #FF9F66)', text: 'white', border: '#FBBE9E' }
                case 'Drikke':
                  return { bg: 'linear-gradient(to right, #00A7B3, #00C4D4)', text: 'white', border: '#00A7B3' }
                case 'Snacks':
                  return { bg: 'linear-gradient(to right, #E8A5FF, #C77DFF)', text: 'white', border: '#E8A5FF' }
                default:
                  return { bg: '#E8F6F6', text: '#006C75', border: 'rgba(0, 167, 179, 0.3)' }
              }
            }
            
            const cardGradients = [
              { bg: 'linear-gradient(to bottom right, #E8F6F6, rgba(0, 167, 179, 0.1), #E8F6F6)', border: 'rgba(0, 167, 179, 0.3)' },
              { bg: 'linear-gradient(to bottom right, #FFF4E6, rgba(251, 190, 158, 0.2), #FFF4E6)', border: 'rgba(0, 167, 179, 0.3)' },
              { bg: 'linear-gradient(to bottom right, #E8F6F6, rgba(0, 167, 179, 0.1), #E8F6F6)', border: 'rgba(0, 167, 179, 0.3)' },
              { bg: 'linear-gradient(to bottom right, #FFF4E6, rgba(251, 190, 158, 0.2), #FFF4E6)', border: 'rgba(0, 167, 179, 0.3)' },
              { bg: 'linear-gradient(to bottom right, #E8F6F6, rgba(0, 167, 179, 0.1), #E8F6F6)', border: 'rgba(0, 167, 179, 0.3)' },
              { bg: 'linear-gradient(to bottom right, #FFF4E6, rgba(251, 190, 158, 0.2), #FFF4E6)', border: 'rgba(0, 167, 179, 0.3)' },
            ]
            const gradient = cardGradients[index % cardGradients.length]
            
            const canAfford = currentPoints >= coupon.cost && coupon.available > 0

            return (
            <Card 
              key={coupon._id} 
              className="p-4 border-2 active:scale-[0.98] transition-all duration-200" 
              style={{ 
                background: gradient.bg, 
                borderColor: gradient.border,
                borderRadius: '16px'
              }}
            >
              {/* Header Row */}
                <div className="flex items-start justify-between">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <span className="text-2xl flex-shrink-0">{coupon.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-base mb-1 truncate" style={{ color: '#006C75' }}>{coupon.title}</h4>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge className="text-xs border font-bold px-2 py-0.5 inline-block" style={{ background: getCategoryColor(coupon.category).bg, color: getCategoryColor(coupon.category).text, borderColor: getCategoryColor(coupon.category).border }}>
                        {coupon.category}
                      </Badge>
                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full shadow-sm flex-shrink-0" style={{ background: 'linear-gradient(135deg, #00A7B3, #00C4D4)' }}>
                        <Coins className="w-4 h-4 text-white" />
                        <span className="font-extrabold text-white text-sm whitespace-nowrap">{coupon.cost} pts</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm font-medium leading-snug" style={{ color: 'rgba(0, 108, 117, 0.8)' }}>
                {coupon.description}
              </p>

              {/* Allergies Row */}
              <div className="flex items-center gap-2 flex-wrap">
                {coupon.allergies.length > 0 ? (
                  coupon.allergies.map((allergy, idx) => (
                    <span 
                      key={idx}
                      className="text-xs font-semibold px-2 py-1 rounded-full" 
                      style={{ color: '#006C75', backgroundColor: '#FFF4E6', border: '1px solid rgba(251, 190, 158, 0.5)' }}
                    >
                      {allergy}
                    </span>
                  ))
                ) : (
                  <span className="text-xs font-semibold px-2 py-1 rounded-full" style={{ color: '#00A7B3', backgroundColor: '#E8F6F6' }}>
                    Allergifri
                  </span>
                )}
                </div>
                
              {/* Action Button - Full Width for Mobile */}
              <Button
                variant={canAfford ? "default" : "outline"}
                disabled={!canAfford}
                onClick={() => {
                  setRedeemedCoupon({
                    coupon: coupon,
                    cost: coupon.cost,
                    newBalance: currentPoints - coupon.cost
                  })
                  onRedeemCoupon(coupon._id, coupon.cost)
                }}
                className={`w-full font-bold py-3 text-base transition-all duration-200 ${
                  canAfford ? 'active:scale-[0.98]' : ''
                }`}
                style={canAfford ? {
                  background: 'linear-gradient(135deg, #006C75, #00A7B3)',
                  color: 'white',
                  border: 'none',
                  boxShadow: '0 4px 12px rgba(0, 167, 179, 0.3)'
                } : {
                  borderColor: 'rgba(0, 167, 179, 0.3)'
                }}
              >
                {canAfford ? 'Innløs Nå' : currentPoints < coupon.cost ? `Trenger ${coupon.cost - currentPoints} flere poeng` : '❌ Utsolgt'}
              </Button>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Coupon Redemption Confirmation Modal */}
      <Dialog open={redeemedCoupon !== null} onOpenChange={(open) => !open && setRedeemedCoupon(null)}>
        <DialogContent className="max-w-md" style={{ borderRadius: '20px' }}>
          <DialogHeader>
            <div className="flex items-center justify-center mb-4">
              <div className="p-4 rounded-full" style={{ background: 'linear-gradient(135deg, #10B981, #059669)' }}>
                <CheckCircle2 className="w-12 h-12 text-white" />
              </div>
            </div>
            <DialogTitle className="text-2xl font-bold text-center" style={{ color: '#006C75' }}>
              Kupong Innløst! 🎉
            </DialogTitle>
          </DialogHeader>
          
          {redeemedCoupon && (
            <div className="space-y-4 mt-4">
              {/* Coupon Details */}
              <Card className="p-4 border-2" style={{ 
                background: 'linear-gradient(135deg, #E8F6F6, rgba(0, 167, 179, 0.1))', 
                borderColor: 'rgba(0, 167, 179, 0.3)',
                borderRadius: '16px'
              }}>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-4xl">{redeemedCoupon.coupon.emoji}</span>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg" style={{ color: '#006C75' }}>
                      {redeemedCoupon.coupon.title}
                    </h3>
                    <Badge className="mt-1 text-xs" style={{ 
                      background: 'linear-gradient(135deg, #00A7B3, #00C4D4)', 
                      color: 'white',
                      border: 'none'
                    }}>
                      {redeemedCoupon.coupon.category}
                    </Badge>
                  </div>
                </div>
                <p className="text-sm font-medium" style={{ color: 'rgba(0, 108, 117, 0.8)' }}>
                  {redeemedCoupon.coupon.description}
                </p>
              </Card>

              {/* Points Information */}
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: '#FFE8CC' }}>
                  <span className="font-semibold" style={{ color: '#006C75' }}>Poeng trukket:</span>
                  <div className="flex items-center gap-1">
                    <Coins className="w-5 h-5" style={{ color: '#F59E0B' }} />
                    <span className="font-bold text-lg" style={{ color: '#F59E0B' }}>
                      -{redeemedCoupon.cost}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: '#B2E5E8' }}>
                  <span className="font-semibold" style={{ color: '#006C75' }}>Ny saldo:</span>
                  <div className="flex items-center gap-1">
                    <Coins className="w-5 h-5" style={{ color: '#00A7B3' }} />
                    <span className="font-bold text-lg" style={{ color: '#00A7B3' }}>
                      {redeemedCoupon.newBalance}
                    </span>
                  </div>
                </div>
              </div>

              {/* Instructions */}
              <div className="p-4 rounded-lg border-2" style={{ 
                backgroundColor: '#FFF9E6',
                borderColor: '#FBBE9E',
                borderRadius: '12px'
              }}>
                <p className="text-sm font-semibold text-center" style={{ color: '#006C75' }}>
                   Vis denne skjermen til kafeteriapersonellet
                </p>
              </div>

              {/* Close Button */}
              <Button
                onClick={() => setRedeemedCoupon(null)}
                className="w-full font-bold py-3 text-base"
                style={{
                  background: 'linear-gradient(135deg, #006C75, #00A7B3)',
                  color: 'white',
                  border: 'none'
                }}
              >
                Lukk
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

    </div>
  )
}