import React, { useState } from 'react'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { Calendar, Users, TrendingDown, Plus, Bell, Gift, Calendar as CalendarIcon, CheckCircle, Clock, MapPin, X, Edit2, Trash2, Coins } from 'lucide-react'
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
  { _id: 'student1', name: 'Emil Hansen' },
  { _id: 'student2', name: 'Ingrid Nilsen' },
  { _id: 'student3', name: 'Sander Johansen' },
  { _id: 'student4', name: 'Mari Solberg' },
  { _id: 'student5', name: 'Tobias Larsen' },
  { _id: 'student6', name: 'Nora Berg' },
  { _id: 'student7', name: 'Jonas Eide' },
  { _id: 'student8', name: 'Emma Kristoffersen' },
  { _id: 'student9', name: 'Henrik Aas' },
  { _id: 'student10', name: 'Sofie Lunde' },
  { _id: 'student11', name: 'Marius Haugen' },
  { _id: 'student12', name: 'Thea Vik' },
]

export function TeacherDashboard({ teacher }: TeacherDashboardProps) {
  const [showAnnouncementDialog, setShowAnnouncementDialog] = useState(false)
  const [showCouponDialog, setShowCouponDialog] = useState(false)
  const [showEventDialog, setShowEventDialog] = useState(false)
  const [editingCoupon, setEditingCoupon] = useState<any | null>(null)
  const [editingEvent, setEditingEvent] = useState<any | null>(null)
  const [selectedClass, setSelectedClass] = useState<string | null>(null)
  const [selectedScheduleItem, setSelectedScheduleItem] = useState<any | null>(null)

  const classesQuery = useQuery(api.teachers.getTeacherClasses)
  const todayScheduleQuery = useQuery(api.teachers.getTodaySchedule)
  const announcementsQuery = useQuery(api.announcements.getAll)
  const couponsQuery = useQuery(api.coupons.getAll)
  const eventsQuery = useQuery(api.events.getAll)

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

  // Use mock data if queries return empty or undefined (for demo)
  const classes = (classesQuery && classesQuery.length > 0) ? classesQuery : mockClasses
  const todaySchedule = (todayScheduleQuery && todayScheduleQuery.length > 0) 
    ? todayScheduleQuery 
    : getMockTodaySchedule(teacher?.name)
  const announcements = (announcementsQuery && announcementsQuery.length > 0) ? announcementsQuery : mockAnnouncements

  // Mock attendance data
  const todayAttendance = (!usingMockData && todayAttendanceQuery && todayAttendanceQuery.total > 0)
    ? todayAttendanceQuery 
    : { present: 24, late: 2, absent: 1, total: 27 }

  const selectedClassObj = classes.find((c: any) => c._id === selectedClass) || classes[0]
  const classStudents = (!usingMockData && classStudentsQuery && classStudentsQuery.length > 0) 
    ? classStudentsQuery 
    : mockStudents

  // Calculate average absence
  const totalStudents = todayAttendance?.total || 27
  const present = todayAttendance?.present || 24
  const late = todayAttendance?.late || 2
  const absent = todayAttendance?.absent || 1
  const averageAbsence = totalStudents > 0 ? ((absent / totalStudents) * 100).toFixed(1) : '3.7'

  return (
    <div className="pb-20 px-3 sm:px-4 pt-4 sm:pt-6 max-w-md mx-auto space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="text-center mb-4 sm:mb-8 relative">
        <h1 className="mb-1 sm:mb-2 font-bold text-2xl sm:text-3xl" style={{ color: '#006C75' }}>
          Velkommen tilbake!
        </h1>
        <p className="text-sm sm:text-base font-medium" style={{ color: 'rgba(0, 108, 117, 0.8)' }}>
          Fortsett å inspirere og lære elevene dine
        </p>
      </div>

      {/* Attendance/Absence Cards */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        <Card className="p-3 sm:p-5 border-2" style={{ borderColor: 'rgba(0, 167, 179, 0.3)', borderRadius: '12px' }}>
          <div className="flex items-center justify-between mb-2 sm:mb-4">
            <h3 className="font-bold text-xs sm:text-base" style={{ color: '#006C75' }}>Dagens oppmøte</h3>
            <Calendar className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" style={{ color: '#00A7B3' }} />
          </div>
          <div className="flex flex-col gap-1 sm:gap-2">
            <div className="text-2xl sm:text-3xl font-bold" style={{ color: '#00A7B3' }}>
              {present + late}/{totalStudents}
            </div>
            <p className="text-[10px] sm:text-xs font-medium" style={{ color: 'rgba(0, 108, 117, 0.8)' }}>
              vis detaljer
            </p>
          </div>
        </Card>
        <Card className="p-3 sm:p-5 border-2" style={{ borderColor: 'rgba(255, 107, 157, 0.3)', borderRadius: '12px' }}>
          <div className="flex items-center justify-between mb-2 sm:mb-4">
            <h3 className="font-bold text-xs sm:text-base" style={{ color: '#FF6B9D' }}>Snitt fravær</h3>
            <TrendingDown className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" style={{ color: '#FF6B9D' }} />
          </div>
          <div className="flex flex-col gap-1 sm:gap-2">
            <div className="text-2xl sm:text-3xl font-bold" style={{ color: '#FF6B9D' }}>
              - {averageAbsence}%
            </div>
            <p className="text-[10px] sm:text-xs font-medium" style={{ color: 'rgba(255, 107, 157, 0.8)' }}>
              vis statistikk
            </p>
          </div>
        </Card>
      </div>

      {/* Today's Schedule */}
      <div>
        <h2 className="font-bold text-lg sm:text-xl mb-3 sm:mb-4" style={{ color: '#006C75' }}>Dagens timeplan</h2>
        {todaySchedule.length === 0 ? (
          <Card className="p-4 sm:p-6 text-center border-2" style={{ borderColor: 'rgba(0, 167, 179, 0.3)', borderRadius: '12px' }}>
            <p className="text-xs sm:text-sm" style={{ color: 'rgba(0, 108, 117, 0.7)' }}>Ingen timer i dag</p>
          </Card>
        ) : (
          <div className="space-y-3">
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
                  className="p-3 sm:p-4 border-2"
                  style={{
                    background: 'linear-gradient(to bottom right, rgba(0, 167, 179, 0.1), rgba(232, 246, 246, 0.5))',
                    borderColor: 'rgba(0, 167, 179, 0.3)',
                    borderRadius: '12px',
                  }}
                >
                  <div className="flex items-start justify-between mb-2 sm:mb-3 gap-2">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm sm:text-base truncate" style={{ color: '#006C75' }}>
                        {item.subject}
                      </h4>
                      <p className="text-xs sm:text-sm mt-0.5" style={{ color: 'rgba(0, 108, 117, 0.7)' }}>
                        {timeText}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => setSelectedScheduleItem(item)}
                      className="flex-shrink-0 text-xs sm:text-sm"
                      style={{ backgroundColor: '#00A7B3', color: 'white' }}
                    >
                      <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-1" />
                      <span className="hidden sm:inline">Ta Oppmøte</span>
                    </Button>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm" style={{ color: 'rgba(0, 108, 117, 0.7)' }}>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 flex-shrink-0" />
                      <span>{item.time}</span>
                    </div>
                    <span className="hidden sm:inline">•</span>
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

      {/* Announcements */}
      <div>
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h2 className="font-bold text-lg sm:text-xl" style={{ color: '#006C75' }}>Kunngjøringer</h2>
          <Dialog open={showAnnouncementDialog} onOpenChange={setShowAnnouncementDialog}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline" className="flex-shrink-0" style={{ borderColor: '#00A7B3', color: '#00A7B3' }}>
                <Plus className="w-4 h-4" />
              </Button>
            </DialogTrigger>
            <CreateAnnouncementDialog onClose={() => setShowAnnouncementDialog(false)} />
          </Dialog>
        </div>
        {announcements.length === 0 ? (
          <Card className="p-4 sm:p-6 text-center border-2" style={{ borderColor: 'rgba(0, 167, 179, 0.3)', borderRadius: '12px' }}>
            <p className="text-xs sm:text-sm" style={{ color: 'rgba(0, 108, 117, 0.7)' }}>Ingen kunngjøringer</p>
          </Card>
        ) : (
          <Card className="p-3 sm:p-4 border-2" style={{ borderColor: 'rgba(0, 167, 179, 0.3)', borderRadius: '12px' }}>
            <ul className="space-y-1.5 sm:space-y-2">
              {announcements.slice(0, 5).map((announcement: any) => (
                <li key={announcement._id} className="text-xs sm:text-sm truncate" style={{ color: '#006C75' }}>
                  • {announcement.title}
                </li>
              ))}
            </ul>
          </Card>
        )}
      </div>


      {/* Create Coupon and Event */}
      <div className="flex flex-col sm:flex-row gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            setEditingCoupon(null)
            setShowCouponDialog(true)
          }}
          className="flex items-center justify-center gap-2 flex-1"
          style={{ borderColor: '#00A7B3', color: '#00A7B3' }}
        >
          <Plus className="w-4 h-4 flex-shrink-0" />
          <span className="text-xs sm:text-sm">Ny kupong</span>
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            setEditingEvent(null)
            setShowEventDialog(true)
          }}
          className="flex items-center justify-center gap-2 flex-1"
          style={{ borderColor: '#E8A5FF', color: '#E8A5FF' }}
        >
          <Plus className="w-4 h-4 flex-shrink-0" />
          <span className="text-xs sm:text-sm">Nytt arrangement</span>
        </Button>
      </div>

      {/* Coupons List */}
      <div>
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h2 className="font-bold text-lg sm:text-xl" style={{ color: '#006C75' }}>Kuponger</h2>
        </div>
        {!couponsQuery || couponsQuery.length === 0 ? (
          <Card className="p-4 sm:p-6 text-center border-2" style={{ borderColor: 'rgba(0, 167, 179, 0.3)', borderRadius: '12px' }}>
            <p className="text-xs sm:text-sm" style={{ color: 'rgba(0, 108, 117, 0.7)' }}>Ingen kuponger</p>
          </Card>
        ) : (
          <div className="space-y-2 sm:space-y-3">
            {couponsQuery.map((coupon: any) => {
              const getCategoryColor = (category: string) => {
                const colors: Record<string, { bg: string; text: string; border: string }> = {
                  'Mat': { bg: 'rgba(251, 190, 158, 0.2)', text: '#006C75', border: 'rgba(251, 190, 158, 0.5)' },
                  'Drikke': { bg: 'rgba(0, 167, 179, 0.1)', text: '#006C75', border: 'rgba(0, 167, 179, 0.3)' },
                  'Aktivitet': { bg: 'rgba(232, 165, 255, 0.2)', text: '#006C75', border: 'rgba(232, 165, 255, 0.5)' },
                  'Annet': { bg: 'rgba(78, 205, 196, 0.2)', text: '#006C75', border: 'rgba(78, 205, 196, 0.5)' },
                }
                return colors[category] || colors['Annet']
              }

              return (
                <Card
                  key={coupon._id}
                  className="p-3 sm:p-4 border-2"
                  style={{ borderColor: 'rgba(0, 167, 179, 0.3)', borderRadius: '12px' }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2 sm:gap-3 flex-1 min-w-0">
                      <span className="text-xl sm:text-2xl flex-shrink-0">{coupon.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h4 className="font-bold text-sm sm:text-base truncate" style={{ color: '#006C75' }}>
                            {coupon.title}
                          </h4>
                          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full shadow-sm flex-shrink-0" style={{ background: 'linear-gradient(135deg, #00A7B3, #00C4D4)' }}>
                            <Coins className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                            <span className="font-extrabold text-white text-xs sm:text-sm whitespace-nowrap">{coupon.cost} p</span>
                          </div>
                        </div>
                        <p className="text-xs sm:text-sm mb-2 line-clamp-2" style={{ color: 'rgba(0, 108, 117, 0.7)' }}>
                          {coupon.description}
                        </p>
                        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                          {coupon.allergies && coupon.allergies.length > 0 ? (
                            coupon.allergies.map((allergy: string, idx: number) => (
                              <span 
                                key={idx}
                                className="text-[10px] sm:text-xs font-semibold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full" 
                                style={{ color: '#006C75', backgroundColor: '#FFF4E6', border: '1px solid rgba(251, 190, 158, 0.5)' }}
                              >
                                {allergy}
                              </span>
                            ))
                          ) : (
                            <span className="text-[10px] sm:text-xs font-semibold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full" style={{ color: '#00A7B3', backgroundColor: '#E8F6F6' }}>
                              Allergifri
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-1 sm:gap-2 flex-shrink-0">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setEditingCoupon(coupon)
                          setShowCouponDialog(true)
                        }}
                        className="p-1.5 sm:p-2"
                        style={{ color: '#00A7B3' }}
                      >
                        <Edit2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </Button>
                      <DeleteCouponButton couponId={coupon._id} />
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        )}
      </div>

      {/* Events List */}
      <div>
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h2 className="font-bold text-lg sm:text-xl" style={{ color: '#006C75' }}>Arrangementer</h2>
        </div>
        {!eventsQuery || eventsQuery.length === 0 ? (
          <Card className="p-4 sm:p-6 text-center border-2" style={{ borderColor: 'rgba(232, 165, 255, 0.3)', borderRadius: '12px' }}>
            <p className="text-xs sm:text-sm" style={{ color: 'rgba(0, 108, 117, 0.7)' }}>Ingen arrangementer</p>
          </Card>
        ) : (
          <div className="space-y-2 sm:space-y-3">
            {eventsQuery.map((event: any) => (
              <Card
                key={event._id}
                className="p-3 sm:p-4 border-2"
                style={{ borderColor: 'rgba(232, 165, 255, 0.3)', borderRadius: '12px' }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2 sm:gap-3 flex-1 min-w-0">
                    <span className="text-xl sm:text-2xl flex-shrink-0">{event.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm sm:text-base mb-1 truncate" style={{ color: '#006C75' }}>
                        {event.title}
                      </h4>
                      <p className="text-xs sm:text-sm mb-2 line-clamp-2" style={{ color: 'rgba(0, 108, 117, 0.7)' }}>
                        {event.description}
                      </p>
                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-3 text-[10px] sm:text-xs" style={{ color: 'rgba(0, 108, 117, 0.6)' }}>
                        <span>{event.date}</span>
                        <span className="hidden sm:inline">•</span>
                        <span>{event.time}</span>
                        <span className="hidden sm:inline">•</span>
                        <span>Påmeldt: {event.registered}/{event.capacity}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1 sm:gap-2 flex-shrink-0">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setEditingEvent(event)
                        setShowEventDialog(true)
                      }}
                      className="p-1.5 sm:p-2"
                      style={{ color: '#E8A5FF' }}
                    >
                      <Edit2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </Button>
                    <DeleteEventButton eventId={event._id} />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

            {/* Classes */}
            <div>
        <h2 className="font-bold text-lg sm:text-xl mb-3 sm:mb-4" style={{ color: '#006C75' }}>Dine klasser</h2>
        {classes.length === 0 ? (
          <Card className="p-4 sm:p-6 text-center border-2" style={{ borderColor: 'rgba(0, 167, 179, 0.3)', borderRadius: '12px' }}>
            <p className="text-xs sm:text-sm" style={{ color: 'rgba(0, 108, 117, 0.7)' }}>Ingen klasser</p>
          </Card>
        ) : (
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            {classes.map((cls: any) => (
              <Card
                key={cls._id}
                className="p-4 border-2 cursor-pointer"
                style={{
                  borderColor: selectedClass === cls._id ? '#00A7B3' : 'rgba(0, 167, 179, 0.3)',
                  borderRadius: '16px',
                  backgroundColor: selectedClass === cls._id ? 'rgba(0, 167, 179, 0.1)' : 'white',
                }}
                onClick={() => setSelectedClass(selectedClass === cls._id ? null : cls._id)}
              >
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" style={{ color: '#00A7B3' }} />
                  <span className="font-medium" style={{ color: '#006C75' }}>
                    {cls.name}
                  </span>
                </div>
              </Card>
            ))}
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
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{event ? 'Rediger arrangement' : 'Nytt arrangement'}</DialogTitle>
          <DialogDescription>
            {event ? 'Oppdater arrangementsinformasjon' : 'Opprett et nytt arrangement som elever kan melde seg på'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="emoji">Emoji</Label>
            <Input
              id="emoji"
              value={emoji}
              onChange={(e) => setEmoji(e.target.value)}
              placeholder="🎮"
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
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date">Dato</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="time">Tid</Label>
              <Input
                id="time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              />
            </div>
          </div>
          <div>
            <Label htmlFor="capacity">Kapasitet</Label>
            <Input
              id="capacity"
              type="number"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="colorTheme">Farge</Label>
            <Select value={colorTheme} onValueChange={setColorTheme}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="blue">Blå</SelectItem>
                <SelectItem value="purple">Lilla</SelectItem>
                <SelectItem value="pink">Rosa</SelectItem>
                <SelectItem value="green">Grønn</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Avbryt
            </Button>
            <Button type="submit" className="flex-1" style={{ backgroundColor: '#00A7B3', color: 'white' }}>
              {event ? 'Oppdater' : 'Opprett'}
            </Button>
          </div>
        </form>
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
          <div className="grid grid-cols-4 gap-2 text-sm font-bold" style={{ color: '#006C75' }}>
            <div>Navn</div>
            <div className="text-center text-green-600">M</div>
            <div className="text-center text-orange-600">G</div>
            <div className="text-center text-red-600">U</div>
          </div>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {classStudents.map((student: any) => (
              <div key={student._id} className="grid grid-cols-4 gap-2 items-center">
                <div className="text-sm" style={{ color: '#006C75' }}>
                  {student.name}
                </div>
                <div className="flex justify-center">
                  <input
                    type="radio"
                    name={`attendance-${student._id}`}
                    checked={attendance[student._id] === 'present'}
                    onChange={() => handleStatusChange(student._id, 'present')}
                    className="w-4 h-4"
                  />
                </div>
                <div className="flex justify-center">
                  <input
                    type="radio"
                    name={`attendance-${student._id}`}
                    checked={attendance[student._id] === 'late'}
                    onChange={() => handleStatusChange(student._id, 'late')}
                    className="w-4 h-4"
                  />
                </div>
                <div className="flex justify-center">
                  <input
                    type="radio"
                    name={`attendance-${student._id}`}
                    checked={attendance[student._id] === 'absent'}
                    onChange={() => handleStatusChange(student._id, 'absent')}
                    className="w-4 h-4"
                  />
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

