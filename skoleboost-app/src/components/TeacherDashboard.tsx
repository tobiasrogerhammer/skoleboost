import React, { useState, useMemo, useCallback } from 'react'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { Calendar, Users, TrendingDown, Plus, Bell, Gift, Calendar as CalendarIcon, CheckCircle, Clock, MapPin, X, Edit2, Trash2, Coins, ChevronRight, MessageSquare, Phone, Mail } from 'lucide-react'
import { UserButton } from '@clerk/clerk-react'
import { Card } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from './ui/dialog'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Label } from './ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { toast } from 'sonner'

interface TeacherDashboardProps {
  teacher: any
}

// Mock data for demo
const mockClasses = [
  { _id: 'class1', name: 'Klasse 8A', grade: '8. trinn', subject: 'Norsk' },
  { _id: 'class2', name: 'Klasse 8C', grade: '8. trinn', subject: 'Norsk' },
  { _id: 'class3', name: 'Klasse 9B', grade: '9. trinn', subject: 'Norsk' },
  { _id: 'class4', name: 'Klasse 9C', grade: '9. trinn', subject: 'Norsk' },
]

const getMockTodaySchedule = (teacherName?: string) => {
  const days = ['Søndag', 'Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag']
  const today = days[new Date().getDay()]
  
  // Return schedule based on today's day
  const schedules: Record<string, any[]> = {
    'Mandag': [
      { _id: 's1', subject: 'Norsk', teacher: teacherName || 'Lærer', time: '10:45 - 11:30', room: 'Rom 207', day: 'Mandag', type: 'class' },
      { _id: 's2', subject: 'Norsk', teacher: teacherName || 'Lærer', time: '12:15 - 13:00', room: 'Rom 208', day: 'Mandag', type: 'class' },
    ],
    'Tirsdag': [
      { _id: 's3', subject: 'Norsk', teacher: teacherName || 'Lærer', time: '09:15 - 10:15', room: 'Rom 201', day: 'Tirsdag', type: 'class' },
      { _id: 's4', subject: 'Norsk', teacher: teacherName || 'Lærer', time: '13:45 - 14:45', room: 'Rom 201', day: 'Tirsdag', type: 'class' },
    ],
    'Onsdag': [
      { _id: 's5', subject: 'Norsk', teacher: teacherName || 'Lærer', time: '08:00 - 09:00', room: 'Rom 201', day: 'Onsdag', type: 'class' },
    ],
    'Torsdag': [
      { _id: 's6', subject: 'Norsk', teacher: teacherName || 'Lærer', time: '09:15 - 10:15', room: 'Rom 201', day: 'Torsdag', type: 'class' },
    ],
    'Fredag': [
      { _id: 's7', subject: 'Norsk', teacher: teacherName || 'Lærer', time: '08:00 - 09:00', room: 'Rom 201', day: 'Fredag', type: 'class' },
    ],
    'Lørdag': [],
    'Søndag': [],
  }
  
  return schedules[today] || []
}

const mockAnnouncements = [
  {
    _id: 'ann1',
    title: 'Foreldremøte tirsdag 21 / 10 med klasse 9B',
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

const mockStudents = [
  { _id: 'student1', name: 'Emil Hansen', parentName: 'Kari Hansen', parentPhone: '+47 123 45 678', parentEmail: 'kari.hansen@email.com' },
  { _id: 'student2', name: 'Ingrid Nilsen', parentName: 'Ole Nilsen', parentPhone: '+47 234 56 789', parentEmail: 'ole.nilsen@email.com' },
  { _id: 'student3', name: 'Sander Johansen', parentName: 'Anne Johansen', parentPhone: '+47 345 67 890', parentEmail: 'anne.johansen@email.com' },
  { _id: 'student4', name: 'Mari Solberg', parentName: 'Per Solberg', parentPhone: '+47 456 78 901', parentEmail: 'per.solberg@email.com' },
  { _id: 'student5', name: 'Tobias Larsen', parentName: 'Lisa Larsen', parentPhone: '+47 567 89 012', parentEmail: 'lisa.larsen@email.com' },
  { _id: 'student6', name: 'Nora Berg', parentName: 'Tom Berg', parentPhone: '+47 678 90 123', parentEmail: 'tom.berg@email.com' },
  { _id: 'student7', name: 'Jonas Eide', parentName: 'Mette Eide', parentPhone: '+47 789 01 234', parentEmail: 'mette.eide@email.com' },
  { _id: 'student8', name: 'Emma Kristoffersen', parentName: 'Lars Kristoffersen', parentPhone: '+47 890 12 345', parentEmail: 'lars.kristoffersen@email.com' },
  { _id: 'student9', name: 'Henrik Aas', parentName: 'Silje Aas', parentPhone: '+47 901 23 456', parentEmail: 'silje.aas@email.com' },
  { _id: 'student10', name: 'Sofie Lunde', parentName: 'Erik Lunde', parentPhone: '+47 012 34 567', parentEmail: 'erik.lunde@email.com' },
  { _id: 'student11', name: 'Marius Haugen', parentName: 'Inger Haugen', parentPhone: '+47 123 45 678', parentEmail: 'inger.haugen@email.com' },
  { _id: 'student12', name: 'Thea Vik', parentName: 'Bjørn Vik', parentPhone: '+47 234 56 789', parentEmail: 'bjorn.vik@email.com' },
]

export function TeacherDashboard({ teacher }: TeacherDashboardProps) {
  const [showAnnouncementDialog, setShowAnnouncementDialog] = useState(false)
  const [showCouponDialog, setShowCouponDialog] = useState(false)
  const [showEventDialog, setShowEventDialog] = useState(false)
  const [editingCoupon, setEditingCoupon] = useState<any | null>(null)
  const [editingEvent, setEditingEvent] = useState<any | null>(null)
  const [selectedClass, setSelectedClass] = useState<string | null>(null)
  const [showClassDialog, setShowClassDialog] = useState(false)
  const [selectedScheduleItem, setSelectedScheduleItem] = useState<any | null>(null)

  const classesQuery = useQuery(api.teachers.getTeacherClasses, {})
  const todayScheduleQuery = useQuery(api.teachers.getTodaySchedule, {})
  const announcementsQuery = useQuery(api.announcements.getAll, {})
  const couponsQuery = useQuery(api.coupons.getAll, {})
  const eventsQuery = useQuery(api.events.getAll, {})

  // Check if we're using mock data (no real data from queries)
  const usingMockData = !classesQuery || classesQuery.length === 0

  // Only call queries with real IDs if we have real data
  const isRealClassId = selectedClass && !selectedClass.startsWith('class') // Mock IDs start with 'class'
  const todayAttendanceQuery = useQuery(
    api.teachers.getTodayAttendance, 
    !usingMockData && isRealClassId ? { classId: selectedClass as any } : "skip"
  )
  const classStudentsQuery = useQuery(
    api.teachers.getClassStudents,
    !usingMockData && isRealClassId ? { classId: selectedClass as any } : "skip"
  )

  // Memoize data processing to avoid recalculation on every render
  const classes = useMemo(() => 
    (classesQuery && classesQuery.length > 0) ? classesQuery : mockClasses,
    [classesQuery]
  )

  const todaySchedule = useMemo(() => 
    (todayScheduleQuery && todayScheduleQuery.length > 0) 
      ? todayScheduleQuery 
      : getMockTodaySchedule(teacher?.name),
    [todayScheduleQuery, teacher?.name]
  )

  const announcements = useMemo(() => 
    (announcementsQuery && announcementsQuery.length > 0) ? announcementsQuery : mockAnnouncements,
    [announcementsQuery]
  )

  // Mock attendance data
  const todayAttendance = useMemo(() => 
    (!usingMockData && todayAttendanceQuery && todayAttendanceQuery.total > 0)
      ? todayAttendanceQuery 
      : { present: 24, late: 2, absent: 1, total: 27 },
    [usingMockData, todayAttendanceQuery]
  )

  const selectedClassObj = useMemo(() => 
    classes.find((c: any) => c._id === selectedClass) || classes[0],
    [classes, selectedClass]
  )

  const classStudents = useMemo(() => 
    (!usingMockData && classStudentsQuery && classStudentsQuery.length > 0) 
      ? classStudentsQuery 
      : mockStudents,
    [usingMockData, classStudentsQuery]
  )

  // Calculate average absence
  const { totalStudents, present, late, absent, averageAbsence } = useMemo(() => {
    const total = todayAttendance?.total || 27
    const pres = todayAttendance?.present || 24
    const lat = todayAttendance?.late || 2
    const abs = todayAttendance?.absent || 1
    const avg = total > 0 ? ((abs / total) * 100).toFixed(1) : '3.7'
    return { totalStudents: total, present: pres, late: lat, absent: abs, averageAbsence: avg }
  }, [todayAttendance])

  return (
    <div className="pb-20 px-4 pt-16 sm:pt-20 max-w-md mx-auto space-y-4">
      {/* Header */}
      <div className="text-center mb-4 mt-6">
        <h1 className="mb-1 font-bold text-2xl" style={{ color: '#006C75' }}>Velkommen tilbake!</h1>
        <p className="text-sm font-medium" style={{ color: 'rgba(0, 108, 117, 0.8)' }}>Fortsett å inspirere og lære elevene dine 🚀</p>
      </div>

      {/* Attendance/Absence Cards */}
      <div className="grid grid-cols-2 gap-2">
        <Card 
          className="px-4 py-1 text-center shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] flex flex-col justify-center gap-2" 
          style={{ 
            background: 'linear-gradient(135deg, #E8A5FF 0%, #C77DFF 50%, #E8A5FF 100%)', 
            border: '3px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 10px 30px rgba(232, 165, 255, 0.3)'
          }}
        >
          <div className="flex items-center justify-center">
            <Calendar className="w-10 h-10 text-white drop-shadow-lg" />
          </div>
          <span className="font-extrabold text-white block drop-shadow-lg" style={{ fontSize: '2rem', lineHeight: '1', textShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>87%</span>
          <p className="text-sm text-white font-semibold tracking-wide uppercase">Dagens Oppmøte</p>
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
            <TrendingDown className="w-10 h-10 text-white drop-shadow-lg" />
          </div>
          <span className="font-extrabold text-white block drop-shadow-lg" style={{ fontSize: '2rem', lineHeight: '1', textShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>{averageAbsence}%</span>
          <p className="text-xs text-white font-semibold tracking-wide uppercase">Snitt Fravær</p>
        </Card>
      </div>

      {/* Today's Schedule */}
      <div>
        <h2 className="font-bold text-lg mb-3" style={{ color: '#006C75' }}>Dagens timeplan</h2>
        {todaySchedule.length === 0 ? (
          <Card className="p-4 text-center border-2" style={{ borderColor: 'rgba(232, 165, 255, 0.3)', borderRadius: '12px' }}>
            <p className="text-sm" style={{ color: 'rgba(0, 108, 117, 0.7)' }}>Ingen timer i dag</p>
          </Card>
        ) : (
          <div className="space-y-2">
            {todaySchedule.map((item: any) => {
              const now = new Date()
              const timeMatch = item.time.match(/(\d{2}):(\d{2})/)
              const startTime = timeMatch ? timeMatch[1] + ':' + timeMatch[2] : ''
              const [hours, minutes] = startTime.split(':').map(Number)
              const classTime = new Date()
              classTime.setHours(hours, minutes, 0, 0)
              const diffMs = classTime.getTime() - now.getTime()
              const diffMins = Math.floor(diffMs / 60000)
              const diffHours = Math.floor(diffMins / 60)
              const remainingMins = diffMins % 60

              let timeText = ''
              if (diffMins < 0) {
                timeText = 'Timer startet'
              } else if (diffHours > 0) {
                timeText = `${diffHours}t ${remainingMins}min til timen`
              } else {
                timeText = `${diffMins}min til timen`
              }

              return (
                <Card
                  key={item._id}
                  className="p-3 border-2"
                  style={{
                    background: 'linear-gradient(to bottom right, rgba(232, 165, 255, 0.1), rgba(232, 246, 246, 0.5))',
                    borderColor: 'rgba(232, 165, 255, 0.3)',
                    borderRadius: '12px',
                  }}
                >
                  <div className="flex items-start justify-between mb-2 gap-2">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm truncate" style={{ color: '#006C75' }}>
                        {item.subject}
                      </h4>
                      <p className="text-xs mt-0.5" style={{ color: 'rgba(0, 108, 117, 0.7)' }}>
                        {timeText}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => setSelectedScheduleItem(item)}
                      className="flex-shrink-0 text-xs"
                      style={{ backgroundColor: '#E8A5FF', color: 'white' }}
                    >
                      <CheckCircle className="w-3 h-3 mr-1" />
                      <span className="hidden sm:inline">Ta Oppmøte</span>
                    </Button>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs" style={{ color: 'rgba(0, 108, 117, 0.7)' }}>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 flex-shrink-0" />
                      <span>{item.time}</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate">{item.room}</span>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        )}
      </div>

      {/* Classes */}
      <div>
        <h2 className="font-bold text-lg mb-3" style={{ color: '#006C75' }}>Dine klasser</h2>
        {classes.length === 0 ? (
          <Card className="p-4 text-center border-2" style={{ borderColor: 'rgba(232, 165, 255, 0.3)', borderRadius: '12px' }}>
            <p className="text-sm" style={{ color: 'rgba(0, 108, 117, 0.7)' }}>Ingen klasser</p>
          </Card>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {classes.map((cls: any) => (
              <Card
                key={cls._id}
                className="p-3 border-2 cursor-pointer transition-all hover:scale-[1.02]"
                style={{
                  borderColor: selectedClass === cls._id ? '#E8A5FF' : 'rgba(232, 165, 255, 0.3)',
                  borderRadius: '12px',
                  backgroundColor: selectedClass === cls._id ? 'rgba(232, 165, 255, 0.1)' : 'white',
                  boxShadow: selectedClass === cls._id ? '0 4px 12px rgba(232, 165, 255, 0.2)' : '0 2px 4px rgba(0, 0, 0, 0.05)'
                }}
                onClick={() => {
                  setSelectedClass(cls._id)
                  setShowClassDialog(true)
                }}
              >
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg" style={{ background: 'linear-gradient(135deg, #E8A5FF, #C77DFF)' }}>
                    <Users className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="font-bold text-sm block truncate" style={{ color: '#006C75' }}>
                      {cls.name}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Announcements */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-lg" style={{ color: '#006C75' }}>Kunngjøringer</h2>
          <Dialog open={showAnnouncementDialog} onOpenChange={setShowAnnouncementDialog}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline" className="flex-shrink-0" style={{ borderColor: '#E8A5FF', color: '#E8A5FF' }}>
                <Plus className="w-4 h-4" />
              </Button>
            </DialogTrigger>
            <CreateAnnouncementDialog onClose={() => setShowAnnouncementDialog(false)} />
          </Dialog>
        </div>
        {announcements.length === 0 ? (
          <Card className="p-4 text-center border-2" style={{ borderColor: 'rgba(232, 165, 255, 0.3)', borderRadius: '12px' }}>
            <p className="text-sm" style={{ color: 'rgba(0, 108, 117, 0.7)' }}>Ingen kunngjøringer</p>
          </Card>
        ) : (
          <div className="space-y-2">
            {announcements.slice(0, 3).map((announcement: any) => {
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
                <Card
                  key={announcement._id}
                  className="p-3 border-2 transition-all hover:scale-[1.01] cursor-pointer"
                  style={{
                    background: 'linear-gradient(135deg, rgba(232, 165, 255, 0.1), rgba(255, 255, 255, 0.8))',
                    borderColor: 'rgba(232, 165, 255, 0.3)',
                    borderRadius: '12px',
                    boxShadow: '0 2px 8px rgba(232, 165, 255, 0.1)'
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div className="rounded-lg flex-shrink-0" style={{ background: 'linear-gradient(135deg, #E8A5FF, #C77DFF)', padding: '7px' }}>
                      <MessageSquare className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm mb-1" style={{ color: '#006C75' }}>
                        {announcement.title}
                      </h4>
                      <p className="text-xs mb-2 line-clamp-2" style={{ color: 'rgba(0, 108, 117, 0.7)' }}>
                        {announcement.content || announcement.description}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium" style={{ color: 'rgba(0, 108, 117, 0.6)' }}>
                          {timeAgo}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              )
            })}
            {announcements.length > 3 && (
              <Card 
                className="p-3 border-2 transition-all hover:scale-[1.01] cursor-pointer"
                style={{
                  background: 'linear-gradient(135deg, rgba(232, 165, 255, 0.05), rgba(255, 255, 255, 0.5))',
                  borderColor: 'rgba(232, 165, 255, 0.2)',
                  borderRadius: '12px'
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold" style={{ color: '#006C75' }}>
                    Se alle {announcements.length} kunngjøringer
                  </span>
                  <ChevronRight className="w-4 h-4" style={{ color: 'rgba(0, 108, 117, 0.6)' }} />
                </div>
              </Card>
            )}
          </div>
        )}
      </div>


      {/* Create Coupon and Event */}
      <div className="flex flex-row gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            setEditingCoupon(null)
            setShowCouponDialog(true)
          }}
          className="flex items-center justify-center gap-2 flex-1 py-3 min-h-[48px]"
          style={{ borderColor: '#00A7B3', color: '#00A7B3' }}
        >
          <Plus className="w-4 h-4 flex-shrink-0" />
          <span className="text-sm font-medium">Ny kupong</span>
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            setEditingEvent(null)
            setShowEventDialog(true)
          }}
          className="flex items-center justify-center gap-2 flex-1 py-3 min-h-[48px]"
          style={{ borderColor: '#E8A5FF', color: '#E8A5FF' }}
        >
          <Plus className="w-4 h-4 flex-shrink-0" />
          <span className="text-sm font-medium">Nytt arrangement</span>
        </Button>
      </div>

      {/* Coupons List */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-lg" style={{ color: '#006C75' }}>Kuponger</h2>
        </div>
        {!couponsQuery || couponsQuery.length === 0 ? (
          <Card className="p-4 text-center border-2" style={{ borderColor: 'rgba(232, 165, 255, 0.3)', borderRadius: '12px' }}>
            <p className="text-sm" style={{ color: 'rgba(0, 108, 117, 0.7)' }}>Ingen kuponger</p>
          </Card>
        ) : (
          <div className="space-y-2">
            {couponsQuery.slice(0, 3).map((coupon: any) => {
              const getCategoryColor = (category: string) => {
                const colors: Record<string, { bg: string; text: string; border: string; iconBg: string }> = {
                  'Mat': { bg: 'rgba(251, 190, 158, 0.15)', text: '#006C75', border: 'rgba(251, 190, 158, 0.4)', iconBg: 'linear-gradient(135deg, #FBBE9E, #FF9F66)' },
                  'Drikke': { bg: 'rgba(0, 167, 179, 0.1)', text: '#006C75', border: 'rgba(0, 167, 179, 0.3)', iconBg: 'linear-gradient(135deg, #00A7B3, #00C4D4)' },
                  'Aktivitet': { bg: 'rgba(232, 165, 255, 0.15)', text: '#006C75', border: 'rgba(232, 165, 255, 0.4)', iconBg: 'linear-gradient(135deg, #E8A5FF, #C77DFF)' },
                  'Annet': { bg: 'rgba(78, 205, 196, 0.15)', text: '#006C75', border: 'rgba(78, 205, 196, 0.4)', iconBg: 'linear-gradient(135deg, #4ECDC4, #44A08D)' },
                }
                return colors[category] || colors['Annet']
              }
              const categoryStyle = getCategoryColor(coupon.category || 'Annet')

              return (
                <Card
                  key={coupon._id}
                  className="p-3 border-2 transition-all hover:scale-[1.01]"
                  style={{ 
                    background: categoryStyle.bg,
                    borderColor: categoryStyle.border, 
                    borderRadius: '12px',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
                  }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="rounded-lg flex-shrink-0" style={{ background: categoryStyle.iconBg, padding: '10px' }}>
                        <span className="text-xl">{coupon.emoji}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h4 className="font-bold text-sm truncate" style={{ color: '#006C75' }}>
                            {coupon.title}
                          </h4>
                          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full shadow-sm flex-shrink-0" style={{ background: categoryStyle.iconBg }}>
                            <Coins className="w-3 h-3 text-white" />
                            <span className="font-extrabold text-white text-xs whitespace-nowrap">{coupon.cost} p</span>
                          </div>
                        </div>
                        <p className="text-xs mb-2 line-clamp-2" style={{ color: 'rgba(0, 108, 117, 0.7)' }}>
                          {coupon.description}
                        </p>
                        <div className="flex flex-wrap items-center gap-1.5">
                          {coupon.allergies && coupon.allergies.length > 0 ? (
                            coupon.allergies.map((allergy: string, idx: number) => (
                              <span 
                                key={idx}
                                className="text-xs font-semibold px-2 py-1 rounded-full" 
                                style={{ 
                                  color: '#8B4513', 
                                  backgroundColor: '#FFF4E6', 
                                  border: '1px solid rgba(251, 190, 158, 0.6)',
                                  boxShadow: '0 1px 3px rgba(251, 190, 158, 0.2)'
                                }}
                              >
                                {allergy}
                              </span>
                            ))
                          ) : (
                            <span 
                              className="text-xs font-semibold px-2 py-1 rounded-full" 
                              style={{ 
                                color: '#006C75', 
                                backgroundColor: '#E8F6F6',
                                border: '1px solid rgba(0, 167, 179, 0.3)',
                                boxShadow: '0 1px 3px rgba(0, 167, 179, 0.1)'
                              }}
                            >
                              Allergifri
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setEditingCoupon(coupon)
                          setShowCouponDialog(true)
                        }}
                        className="p-1.5"
                        style={{ color: '#E8A5FF' }}
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </Button>
                      <DeleteCouponButton couponId={coupon._id} />
                    </div>
                  </div>
                </Card>
              )
            })}
            {couponsQuery.length > 3 && (
              <Card 
                className="p-3 border-2 transition-all hover:scale-[1.01] cursor-pointer"
                style={{
                  background: 'linear-gradient(135deg, rgba(232, 165, 255, 0.05), rgba(255, 255, 255, 0.5))',
                  borderColor: 'rgba(232, 165, 255, 0.2)',
                  borderRadius: '12px'
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold" style={{ color: '#006C75' }}>
                    Se alle {couponsQuery.length} kuponger
                  </span>
                  <ChevronRight className="w-4 h-4" style={{ color: 'rgba(0, 108, 117, 0.6)' }} />
                </div>
              </Card>
            )}
          </div>
        )}
      </div>

      {/* Events List */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-lg" style={{ color: '#006C75' }}>Arrangementer</h2>
        </div>
        {!eventsQuery || eventsQuery.length === 0 ? (
          <Card className="p-4 text-center border-2" style={{ borderColor: 'rgba(232, 165, 255, 0.3)', borderRadius: '12px' }}>
            <p className="text-sm" style={{ color: 'rgba(0, 108, 117, 0.7)' }}>Ingen arrangementer</p>
          </Card>
        ) : (
          <div className="space-y-2">
            {eventsQuery.slice(0, 3).map((event: any) => {
              const getEventStyles = (colorTheme: string) => {
                switch (colorTheme) {
                  case 'blue':
                    return { bg: 'linear-gradient(135deg, rgba(0, 167, 179, 0.15), rgba(0, 196, 212, 0.1))', border: 'rgba(0, 167, 179, 0.4)', iconBg: 'linear-gradient(135deg, #00A7B3, #00C4D4)' }
                  case 'green':
                    return { bg: 'linear-gradient(135deg, rgba(78, 205, 196, 0.15), rgba(68, 160, 141, 0.1))', border: 'rgba(78, 205, 196, 0.4)', iconBg: 'linear-gradient(135deg, #4ECDC4, #44A08D)' }
                  case 'pink':
                    return { bg: 'linear-gradient(135deg, rgba(255, 107, 157, 0.15), rgba(255, 142, 155, 0.1))', border: 'rgba(255, 107, 157, 0.4)', iconBg: 'linear-gradient(135deg, #FF6B9D, #FF8E9B)' }
                  case 'purple':
                    return { bg: 'linear-gradient(135deg, rgba(232, 165, 255, 0.15), rgba(199, 125, 255, 0.1))', border: 'rgba(232, 165, 255, 0.4)', iconBg: 'linear-gradient(135deg, #E8A5FF, #C77DFF)' }
                  default:
                    return { bg: 'linear-gradient(135deg, rgba(0, 167, 179, 0.15), rgba(0, 196, 212, 0.1))', border: 'rgba(0, 167, 179, 0.4)', iconBg: 'linear-gradient(135deg, #00A7B3, #00C4D4)' }
                }
              }
              const eventStyle = getEventStyles(event.colorTheme || 'blue')
              const fillPercentage = event.capacity > 0 ? (event.registered / event.capacity) * 100 : 0
              const isFull = event.registered >= event.capacity

              return (
                <Card
                  key={event._id}
                  className="p-3 border-2 transition-all hover:scale-[1.01]"
                  style={{ 
                    background: eventStyle.bg,
                    borderColor: eventStyle.border, 
                    borderRadius: '12px',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
                  }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="rounded-lg flex-shrink-0" style={{ background: eventStyle.iconBg, padding: '10px' }}>
                        <span className="text-xl">{event.emoji}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-sm mb-1 truncate" style={{ color: '#006C75' }}>
                          {event.title}
                        </h4>
                        <p className="text-xs mb-2 line-clamp-2" style={{ color: 'rgba(0, 108, 117, 0.7)' }}>
                          {event.description}
                        </p>
                        <div className="flex flex-wrap items-center gap-1.5 mb-2">
                          <span 
                            className="text-xs font-semibold px-2 py-1 rounded-full" 
                            style={{ 
                              color: '#006C75', 
                              backgroundColor: 'rgba(255, 255, 255, 0.8)',
                              border: '1px solid rgba(0, 0, 0, 0.1)'
                            }}
                          >
                            📅 {event.date}
                          </span>
                          <span 
                            className="text-xs font-semibold px-2 py-1 rounded-full" 
                            style={{ 
                              color: '#006C75', 
                              backgroundColor: 'rgba(255, 255, 255, 0.8)',
                              border: '1px solid rgba(0, 0, 0, 0.1)'
                            }}
                          >
                            ⏰ {event.time}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <Users className="w-3 h-3" style={{ color: 'rgba(0, 108, 117, 0.7)' }} />
                            <span className="text-xs font-semibold" style={{ color: 'rgba(0, 108, 117, 0.7)' }}>
                              {event.registered}/{event.capacity}
                            </span>
                          </div>
                          <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(0, 0, 0, 0.1)' }}>
                            <div 
                              className="h-full rounded-full transition-all"
                              style={{ 
                                width: `${fillPercentage}%`,
                                background: isFull 
                                  ? 'linear-gradient(90deg, #EF4444, #F87171)' 
                                  : eventStyle.iconBg
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setEditingEvent(event)
                          setShowEventDialog(true)
                        }}
                        className="p-1.5"
                        style={{ color: '#E8A5FF' }}
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </Button>
                      <DeleteEventButton eventId={event._id} />
                    </div>
                  </div>
                </Card>
              )
            })}
            {eventsQuery.length > 3 && (
              <Card 
                className="p-3 border-2 transition-all hover:scale-[1.01] cursor-pointer"
                style={{
                  background: 'linear-gradient(135deg, rgba(232, 165, 255, 0.05), rgba(255, 255, 255, 0.5))',
                  borderColor: 'rgba(232, 165, 255, 0.2)',
                  borderRadius: '12px'
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold" style={{ color: '#006C75' }}>
                    Se alle {eventsQuery.length} arrangementer
                  </span>
                  <ChevronRight className="w-4 h-4" style={{ color: 'rgba(0, 108, 117, 0.6)' }} />
                </div>
              </Card>
            )}
          </div>
        )}
      </div>


      {/* Dialogs */}
      {showCouponDialog && (
        <CreateCouponDialog 
          coupon={editingCoupon}
          onClose={() => {
            setShowCouponDialog(false)
            setEditingCoupon(null)
          }} 
        />
      )}

      {showEventDialog && (
        <CreateEventDialog 
          event={editingEvent}
          onClose={() => {
            setShowEventDialog(false)
            setEditingEvent(null)
          }} 
        />
      )}

      {selectedScheduleItem && (
        <AttendanceDialog
          scheduleItem={selectedScheduleItem}
          classStudents={classStudents}
          usingMockData={usingMockData}
          onClose={() => setSelectedScheduleItem(null)}
        />
      )}

      {showClassDialog && selectedClass && (
        <ClassStudentsDialog
          classObj={selectedClassObj}
          classStudents={classStudents}
          usingMockData={usingMockData}
          onClose={() => {
            setShowClassDialog(false)
            setSelectedClass(null)
          }}
        />
      )}
    </div>
  )
}

// Create Announcement Dialog
function CreateAnnouncementDialog({ onClose }: { onClose: () => void }) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const createAnnouncement = useMutation(api.announcements.create)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createAnnouncement({ title, content })
      toast.success('Kunngjøring opprettet!')
      setTitle('')
      setContent('')
      onClose()
    } catch (error: any) {
      toast.error(error.message || 'Kunne ikke opprette kunngjøring')
    }
  }

  return (
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle>Ny kunngjøring</DialogTitle>
        <DialogDescription>
          Opprett en ny kunngjøring som vil vises til alle elever
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="title">Tittel</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="content">Info</Label>
          <Textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            required
          />
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={onClose} className="flex-1">
            Avbryt
          </Button>
          <Button type="submit" className="flex-1" style={{ backgroundColor: '#00A7B3', color: 'white' }}>
            Last opp
          </Button>
        </div>
      </form>
    </DialogContent>
  )
}

// Delete Coupon Button
function DeleteCouponButton({ couponId }: { couponId: any }) {
  const [showConfirm, setShowConfirm] = useState(false)
  const deleteCoupon = useMutation(api.teacherCoupons.deleteCoupon)

  const handleDelete = async () => {
    try {
      await deleteCoupon({ couponId })
      toast.success('Kupong slettet!')
      setShowConfirm(false)
    } catch (error: any) {
      toast.error(error.message || 'Kunne ikke slette kupong')
    }
  }

  if (showConfirm) {
    return (
      <div className="flex gap-1">
        <Button
          size="sm"
          variant="ghost"
          onClick={handleDelete}
          style={{ color: '#FF6B9D' }}
        >
          Bekreft
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setShowConfirm(false)}
        >
          Avbryt
        </Button>
      </div>
    )
  }

  return (
    <Button
      size="sm"
      variant="ghost"
      onClick={() => setShowConfirm(true)}
      className="p-1.5 sm:p-2"
      style={{ color: '#FF6B9D' }}
    >
      <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
    </Button>
  )
}

// Delete Event Button
function DeleteEventButton({ eventId }: { eventId: any }) {
  const [showConfirm, setShowConfirm] = useState(false)
  const deleteEvent = useMutation(api.teacherEvents.deleteEvent)

  const handleDelete = async () => {
    try {
      await deleteEvent({ eventId })
      toast.success('Arrangement slettet!')
      setShowConfirm(false)
    } catch (error: any) {
      toast.error(error.message || 'Kunne ikke slette arrangement')
    }
  }

  if (showConfirm) {
    return (
      <div className="flex gap-1">
        <Button
          size="sm"
          variant="ghost"
          onClick={handleDelete}
          style={{ color: '#FF6B9D' }}
        >
          Bekreft
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setShowConfirm(false)}
        >
          Avbryt
        </Button>
      </div>
    )
  }

  return (
    <Button
      size="sm"
      variant="ghost"
      onClick={() => setShowConfirm(true)}
      className="p-1.5 sm:p-2"
      style={{ color: '#FF6B9D' }}
    >
      <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
    </Button>
  )
}

// Create/Edit Coupon Dialog
function CreateCouponDialog({ coupon, onClose }: { coupon?: any, onClose: () => void }) {
  const [title, setTitle] = useState(coupon?.title || '')
  const [description, setDescription] = useState(coupon?.description || '')
  const [cost, setCost] = useState(coupon?.cost?.toString() || '')
  const [category, setCategory] = useState(coupon?.category || '')
  const [allergies, setAllergies] = useState(coupon?.allergies?.join(', ') || '')
  const [emoji, setEmoji] = useState(coupon?.emoji || '')
  const createCoupon = useMutation(api.teacherCoupons.createCoupon)
  const updateCoupon = useMutation(api.teacherCoupons.updateCoupon)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (coupon) {
        await updateCoupon({
          couponId: coupon._id,
          title,
          description,
          cost: parseInt(cost),
          category,
          allergies: allergies.split(',').map((a) => a.trim()).filter(Boolean),
          emoji,
        })
        toast.success('Kupong oppdatert!')
      } else {
        await createCoupon({
          title,
          description,
          cost: parseInt(cost),
          available: 999, // Set a high default value
          category,
          allergies: allergies.split(',').map((a) => a.trim()).filter(Boolean),
          emoji,
        })
        toast.success('Kupong opprettet!')
      }
      onClose()
    } catch (error: any) {
      toast.error(error.message || `Kunne ikke ${coupon ? 'oppdatere' : 'opprette'} kupong`)
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{coupon ? 'Rediger kupong' : 'Ny kupong'}</DialogTitle>
          <DialogDescription>
            {coupon ? 'Oppdater kuponginformasjon' : 'Opprett en ny kupong som elever kan løse inn med poeng'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="emoji">Emoji</Label>
            <Input
              id="emoji"
              value={emoji}
              onChange={(e) => setEmoji(e.target.value)}
              placeholder="🍕"
              required
            />
          </div>
          <div>
            <Label htmlFor="title">Tittel</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="description">Beskrivelse</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              required
            />
          </div>
          <div>
            <Label htmlFor="cost">Kostnad (poeng)</Label>
            <Input
              id="cost"
              type="number"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="category">Kategori</Label>
            <Input
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="allergies">Allergier (kommaseparert)</Label>
            <Input
              id="allergies"
              value={allergies}
              onChange={(e) => setAllergies(e.target.value)}
              placeholder="Gluten, Melk"
            />
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Avbryt
            </Button>
            <Button type="submit" className="flex-1" style={{ backgroundColor: '#00A7B3', color: 'white' }}>
              Opprett
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// Create/Edit Event Dialog
function CreateEventDialog({ event, onClose }: { event?: any, onClose: () => void }) {
  const [title, setTitle] = useState(event?.title || '')
  const [description, setDescription] = useState(event?.description || '')
  const [date, setDate] = useState(event?.date || '')
  const [time, setTime] = useState(event?.time || '')
  const [emoji, setEmoji] = useState(event?.emoji || '')
  const [capacity, setCapacity] = useState(event?.capacity?.toString() || '')
  const [colorTheme, setColorTheme] = useState(event?.colorTheme || 'blue')
  const createEvent = useMutation(api.teacherEvents.createEvent)
  const updateEvent = useMutation(api.teacherEvents.updateEvent)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (event) {
        await updateEvent({
          eventId: event._id,
          title,
          description,
          date,
          time,
          emoji,
          capacity: parseInt(capacity),
          colorTheme,
        })
        toast.success('Arrangement oppdatert!')
      } else {
        await createEvent({
          title,
          description,
          date,
          time,
          emoji,
          capacity: parseInt(capacity),
          colorTheme,
        })
        toast.success('Arrangement opprettet!')
      }
      onClose()
    } catch (error: any) {
      toast.error(error.message || `Kunne ikke ${event ? 'oppdatere' : 'opprette'} arrangement`)
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto" style={{ borderRadius: '20px' }}>
        <DialogHeader>
          <DialogTitle className="text-xl font-bold" style={{ color: '#006C75' }}>
            {event ? 'Rediger arrangement' : 'Nytt arrangement'}
          </DialogTitle>
          <DialogDescription className="text-sm" style={{ color: 'rgba(0, 108, 117, 0.7)' }}>
            {event ? 'Oppdater arrangementsinformasjon' : 'Opprett et nytt arrangement som elever kan melde seg på'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="emoji" className="text-sm font-semibold" style={{ color: '#006C75' }}>Emoji</Label>
              <Input
                id="emoji"
                value={emoji}
                onChange={(e) => setEmoji(e.target.value)}
                placeholder="🎮"
                className="mt-1"
                required
              />
            </div>
            <div>
              <Label htmlFor="colorTheme" className="text-sm font-semibold" style={{ color: '#006C75' }}>Farge</Label>
              <Select value={colorTheme} onValueChange={setColorTheme}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="blue">🔵 Blå</SelectItem>
                  <SelectItem value="purple">🟣 Lilla</SelectItem>
                  <SelectItem value="pink">🩷 Rosa</SelectItem>
                  <SelectItem value="green">🟢 Grønn</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label htmlFor="title" className="text-sm font-semibold" style={{ color: '#006C75' }}>Tittel</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1"
              placeholder="F.eks. Gaming Turnering"
              required
            />
          </div>
          <div>
            <Label htmlFor="description" className="text-sm font-semibold" style={{ color: '#006C75' }}>Beskrivelse</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="mt-1"
              placeholder="Beskriv hva arrangementet handler om..."
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date" className="text-sm font-semibold" style={{ color: '#006C75' }}>Dato</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="mt-1"
                required
              />
            </div>
            <div>
              <Label htmlFor="time" className="text-sm font-semibold" style={{ color: '#006C75' }}>Tid</Label>
              <Input
                id="time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="mt-1"
                required
              />
            </div>
          </div>
          <div>
            <Label htmlFor="capacity" className="text-sm font-semibold" style={{ color: '#006C75' }}>Kapasitet</Label>
            <Input
              id="capacity"
              type="number"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              className="mt-1"
              placeholder="Antall deltakere"
              min="1"
              required
            />
          </div>
          <div className="flex gap-2 pt-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose} 
              className="flex-1"
              style={{ borderColor: 'rgba(0, 108, 117, 0.3)', color: '#006C75' }}
            >
              Avbryt
            </Button>
            <Button 
              type="submit" 
              className="flex-1 font-semibold" 
              style={{ backgroundColor: '#E8A5FF', color: 'white' }}
            >
              {event ? 'Oppdater' : 'Opprett'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// Class Students Dialog
function ClassStudentsDialog({
  classObj,
  classStudents,
  usingMockData,
  onClose,
}: {
  classObj: any
  classStudents: any[]
  usingMockData: boolean
  onClose: () => void
}) {
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto" style={{ borderRadius: '20px' }}>
        <DialogHeader>
          <DialogTitle className="text-xl font-bold" style={{ color: '#006C75' }}>
            {classObj?.name || 'Klasse'} - Elever
          </DialogTitle>
          <DialogDescription className="text-sm" style={{ color: 'rgba(0, 108, 117, 0.7)' }}>
            Navneliste med kontaktinformasjon til foresatte
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 mt-4">
          {classStudents.length === 0 ? (
            <p className="text-sm text-center py-4" style={{ color: 'rgba(0, 108, 117, 0.7)' }}>
              Ingen elever i denne klassen
            </p>
          ) : (
            classStudents.map((student: any, index: number) => (
              <Card
                key={student._id || index}
                className="p-3 border-2"
                style={{
                  background: 'linear-gradient(135deg, rgba(232, 165, 255, 0.05), rgba(255, 255, 255, 0.8))',
                  borderColor: 'rgba(232, 165, 255, 0.3)',
                  borderRadius: '12px'
                }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg, #E8A5FF, #C77DFF)' }}>
                      <span className="text-white font-bold text-sm">{index + 1}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm mb-1" style={{ color: '#006C75' }}>
                        {student.name}
                      </h4>
                      {student.parentName && (
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Users className="w-3 h-3" style={{ color: 'rgba(0, 108, 117, 0.7)' }} />
                            <span className="text-xs" style={{ color: 'rgba(0, 108, 117, 0.7)' }}>
                              {student.parentName}
                            </span>
                          </div>
                          {student.parentPhone && (
                            <div className="flex items-center gap-2">
                              <Phone className="w-3 h-3" style={{ color: 'rgba(0, 108, 117, 0.7)' }} />
                              <a 
                                href={`tel:${student.parentPhone}`}
                                className="text-xs hover:underline" 
                                style={{ color: '#00A7B3' }}
                              >
                                {student.parentPhone}
                              </a>
                            </div>
                          )}
                          {student.parentEmail && (
                            <div className="flex items-center gap-2">
                              <Mail className="w-3 h-3" style={{ color: 'rgba(0, 108, 117, 0.7)' }} />
                              <a 
                                href={`mailto:${student.parentEmail}`}
                                className="text-xs hover:underline truncate" 
                                style={{ color: '#00A7B3' }}
                              >
                                {student.parentEmail}
                              </a>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
        <Button 
          onClick={onClose} 
          className="w-full mt-4" 
          style={{ backgroundColor: '#E8A5FF', color: 'white' }}
        >
          Lukk
        </Button>
      </DialogContent>
    </Dialog>
  )
}

// Attendance Dialog
function AttendanceDialog({
  scheduleItem,
  classStudents,
  usingMockData,
  onClose,
}: {
  scheduleItem: any
  classStudents: any[]
  usingMockData: boolean
  onClose: () => void
}) {
  const [attendance, setAttendance] = useState<Record<string, 'present' | 'late' | 'absent'>>({})
  const markAttendance = useMutation(api.teachers.markAttendance)
  const classesQuery = useQuery(api.teachers.getTeacherClasses)
  const classes = (classesQuery && classesQuery.length > 0) ? classesQuery : mockClasses
  
  // Find class by subject/teacher name (simplified - in real app use proper classId)
  const classObj = classes.find((c: any) => c.name.includes(scheduleItem.subject?.substring(0, 3) || '')) || classes[0]

  const handleStatusChange = async (studentId: string, status: 'present' | 'late' | 'absent') => {
    setAttendance((prev) => ({ ...prev, [studentId]: status }))
    
    // Don't try to save if using mock data
    if (usingMockData) {
      toast.success('Oppmøte markert! (Demo)')
      return
    }
    
    try {
      if (classObj && !classObj._id.startsWith('class') && typeof classObj._id !== 'string') {
        await markAttendance({
          studentId: studentId as any,
          classId: classObj._id as any,
          status,
        })
        toast.success('Oppmøte markert!')
      }
    } catch (error: any) {
      toast.error(error.message || 'Kunne ikke markere oppmøte')
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Oppmøte {scheduleItem.subject}</DialogTitle>
          <DialogDescription>
            Marker oppmøte for hver elev (M = Møtt, G = Gyldig fravær, U = Ugyldig fravær)
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold pb-2 border-b" style={{ color: '#006C75', borderColor: 'rgba(0, 108, 117, 0.2)' }}>
            <div className="flex-1">Navn</div>
            <div className="flex items-center gap-4">
              <div className="w-12 text-center">
                <span className="text-green-600 font-extrabold">M</span>
              </div>
              <div className="w-12 text-center">
                <span className="text-orange-600 font-extrabold">G</span>
              </div>
              <div className="w-12 text-center">
                <span className="text-red-600 font-extrabold">U</span>
              </div>
            </div>
          </div>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {classStudents.map((student: any) => (
              <div key={student._id} className="flex items-center gap-2 py-2 border-b" style={{ borderColor: 'rgba(0, 108, 117, 0.1)' }}>
                <div className="text-sm flex-1 min-w-0" style={{ color: '#006C75' }}>
                  {student.name}
                </div>
                <div className="flex items-center gap-4">
                  <label className="flex flex-col items-center gap-1.5 cursor-pointer p-2 rounded-lg transition-all hover:bg-green-50 hover:scale-105" style={{ minWidth: '48px' }}>
                    <span className="text-xs font-extrabold text-green-600">M</span>
                    <input
                      type="radio"
                      name={`attendance-${student._id}`}
                      checked={attendance[student._id] === 'present'}
                      onChange={() => handleStatusChange(student._id, 'present')}
                      className="w-5 h-5"
                      style={{ accentColor: '#10B981' }}
                    />
                  </label>
                  <label className="flex flex-col items-center gap-1.5 cursor-pointer p-2 rounded-lg transition-all hover:bg-orange-50 hover:scale-105" style={{ minWidth: '48px' }}>
                    <span className="text-xs font-extrabold text-orange-600">G</span>
                    <input
                      type="radio"
                      name={`attendance-${student._id}`}
                      checked={attendance[student._id] === 'late'}
                      onChange={() => handleStatusChange(student._id, 'late')}
                      className="w-5 h-5"
                      style={{ accentColor: '#F97316' }}
                    />
                  </label>
                  <label className="flex flex-col items-center gap-1.5 cursor-pointer p-2 rounded-lg transition-all hover:bg-red-50 hover:scale-105" style={{ minWidth: '48px' }}>
                    <span className="text-xs font-extrabold text-red-600">U</span>
                    <input
                      type="radio"
                      name={`attendance-${student._id}`}
                      checked={attendance[student._id] === 'absent'}
                      onChange={() => handleStatusChange(student._id, 'absent')}
                      className="w-5 h-5"
                      style={{ accentColor: '#EF4444' }}
                    />
                  </label>
                </div>
              </div>
            ))}
          </div>
          <Button onClick={onClose} className="w-full" style={{ backgroundColor: '#00A7B3', color: 'white' }}>
            Last opp
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

