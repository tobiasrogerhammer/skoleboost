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
import { toast } from 'sonner'
import { Logo } from './Logo'

interface TeacherDashboardProps {
  teacher: any
}

// Mock data for demo
const mockClasses = [
  { _id: 'class1', name: 'Klasse 8A', grade: '8. trinn', subject: 'Norsk' },
  { _id: 'class2', name: 'Klasse 8C', grade: '8. trinn', subject: 'Norsk' },
  { _id: 'class3', name: 'Klasse 9B', grade: '9. trinn', subject: 'Norsk' },
  { _id: 'class4', name: 'Klasse 9C', grade: '9. trinn', subject: 'Norsk' },
  { _id: 'class5', name: 'Klasse 8A', grade: '8. trinn', subject: 'Samfunnsfag' },
  { _id: 'class6', name: 'Klasse 9B', grade: '9. trinn', subject: 'Samfunnsfag' },
]

const getMockTodaySchedule = (teacherName?: string) => {
  const days = ['Søndag', 'Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag']
  const today = days[new Date().getDay()]
  
  // Return schedule based on today's day
  const schedules: Record<string, any[]> = {
    'Mandag': [
      { _id: 's1', subject: 'Norsk', teacher: teacherName || 'Lærer', time: '08:00 - 09:00', room: 'Rom 201', day: 'Mandag', type: 'class' },
      { _id: 's2', subject: 'Samfunnsfag', teacher: teacherName || 'Lærer', time: '09:15 - 10:15', room: 'Rom 205', day: 'Mandag', type: 'class' },
      { _id: 's3', subject: 'Norsk', teacher: teacherName || 'Lærer', time: '10:45 - 11:30', room: 'Rom 207', day: 'Mandag', type: 'class' },
      { _id: 's4', subject: 'Norsk', teacher: teacherName || 'Lærer', time: '12:15 - 13:00', room: 'Rom 208', day: 'Mandag', type: 'class' },
    ],
    'Tirsdag': [
      { _id: 's5', subject: 'Norsk', teacher: teacherName || 'Lærer', time: '09:15 - 10:15', room: 'Rom 201', day: 'Tirsdag', type: 'class' },
      { _id: 's6', subject: 'Samfunnsfag', teacher: teacherName || 'Lærer', time: '11:30 - 12:15', room: 'Rom 205', day: 'Tirsdag', type: 'class' },
      { _id: 's7', subject: 'Norsk', teacher: teacherName || 'Lærer', time: '13:45 - 14:45', room: 'Rom 201', day: 'Tirsdag', type: 'class' },
    ],
    'Onsdag': [
      { _id: 's8', subject: 'Norsk', teacher: teacherName || 'Lærer', time: '08:00 - 09:00', room: 'Rom 201', day: 'Onsdag', type: 'class' },
      { _id: 's9', subject: 'Samfunnsfag', teacher: teacherName || 'Lærer', time: '10:00 - 11:00', room: 'Rom 205', day: 'Onsdag', type: 'class' },
    ],
    'Torsdag': [
      { _id: 's10', subject: 'Norsk', teacher: teacherName || 'Lærer', time: '09:15 - 10:15', room: 'Rom 201', day: 'Torsdag', type: 'class' },
      { _id: 's11', subject: 'Samfunnsfag', teacher: teacherName || 'Lærer', time: '13:00 - 14:00', room: 'Rom 205', day: 'Torsdag', type: 'class' },
    ],
    'Fredag': [
      { _id: 's12', subject: 'Norsk', teacher: teacherName || 'Lærer', time: '08:00 - 09:00', room: 'Rom 201', day: 'Fredag', type: 'class' },
      { _id: 's13', subject: 'Samfunnsfag', teacher: teacherName || 'Lærer', time: '11:00 - 12:00', room: 'Rom 205', day: 'Fredag', type: 'class' },
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
  const [editingAnnouncement, setEditingAnnouncement] = useState<any | null>(null)
  const [showCouponDialog, setShowCouponDialog] = useState(false)
  const [showEventDialog, setShowEventDialog] = useState(false)
  const [showAllCouponsDialog, setShowAllCouponsDialog] = useState(false)
  const [showAllEventsDialog, setShowAllEventsDialog] = useState(false)
  const [editingCoupon, setEditingCoupon] = useState<any | null>(null)
  const [editingEvent, setEditingEvent] = useState<any | null>(null)
  const [selectedClass, setSelectedClass] = useState<string | null>(null)
  const [showClassDialog, setShowClassDialog] = useState(false)
  const [selectedScheduleItem, setSelectedScheduleItem] = useState<any | null>(null)
  const [currentTime, setCurrentTime] = useState(new Date())
  
  // Update current time every second for countdown
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

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
    <div className="px-4 max-w-md mx-auto space-y-4 relative" style={{ paddingTop: '2.5rem', paddingBottom: '150px' }}>
      {/* Logo and Brand Name - Top Left */}
      <div className="absolute top-4 left-4 z-50 flex items-center gap-2">
        <Logo size="xs" />
        <h1 className="font-bold text-base" style={{ color: '#006C75' }}>Skoleboost</h1>
      </div>



      {/* Attendance/Absence Cards */}
      <div className="grid grid-cols-2 gap-2" style={{ paddingTop: '2.5rem' }}>
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

      {/* Today's Schedule - Show only current or next class, or tomorrow's first class */}
      <div>
        {(() => {
          const now = currentTime
          const days = ['Søndag', 'Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag']
          const today = days[now.getDay()]
          const tomorrowIndex = (now.getDay() + 1) % 7
          const tomorrow = days[tomorrowIndex]
          
          // Get all schedule data (for finding tomorrow's classes)
          const allScheduleData = usingMockData 
            ? (() => {
                const schedules: Record<string, any[]> = {
                  'Mandag': [
                    { _id: 's1', subject: 'Norsk', teacher: teacher?.name || 'Lærer', time: '08:00 - 09:00', room: 'Rom 201', day: 'Mandag', type: 'class' },
                    { _id: 's2', subject: 'Samfunnsfag', teacher: teacher?.name || 'Lærer', time: '09:15 - 10:15', room: 'Rom 205', day: 'Mandag', type: 'class' },
                    { _id: 's3', subject: 'Norsk', teacher: teacher?.name || 'Lærer', time: '10:45 - 11:30', room: 'Rom 207', day: 'Mandag', type: 'class' },
                    { _id: 's4', subject: 'Norsk', teacher: teacher?.name || 'Lærer', time: '12:15 - 13:00', room: 'Rom 208', day: 'Mandag', type: 'class' },
                  ],
                  'Tirsdag': [
                    { _id: 's5', subject: 'Norsk', teacher: teacher?.name || 'Lærer', time: '09:15 - 10:15', room: 'Rom 201', day: 'Tirsdag', type: 'class' },
                    { _id: 's6', subject: 'Samfunnsfag', teacher: teacher?.name || 'Lærer', time: '11:30 - 12:15', room: 'Rom 205', day: 'Tirsdag', type: 'class' },
                    { _id: 's7', subject: 'Norsk', teacher: teacher?.name || 'Lærer', time: '13:45 - 14:45', room: 'Rom 201', day: 'Tirsdag', type: 'class' },
                  ],
                  'Onsdag': [
                    { _id: 's8', subject: 'Norsk', teacher: teacher?.name || 'Lærer', time: '08:00 - 09:00', room: 'Rom 201', day: 'Onsdag', type: 'class' },
                    { _id: 's9', subject: 'Samfunnsfag', teacher: teacher?.name || 'Lærer', time: '10:00 - 11:00', room: 'Rom 205', day: 'Onsdag', type: 'class' },
                  ],
                  'Torsdag': [
                    { _id: 's10', subject: 'Norsk', teacher: teacher?.name || 'Lærer', time: '09:15 - 10:15', room: 'Rom 201', day: 'Torsdag', type: 'class' },
                    { _id: 's11', subject: 'Samfunnsfag', teacher: teacher?.name || 'Lærer', time: '13:00 - 14:00', room: 'Rom 205', day: 'Torsdag', type: 'class' },
                  ],
                  'Fredag': [
                    { _id: 's12', subject: 'Norsk', teacher: teacher?.name || 'Lærer', time: '08:00 - 09:00', room: 'Rom 201', day: 'Fredag', type: 'class' },
                    { _id: 's13', subject: 'Samfunnsfag', teacher: teacher?.name || 'Lærer', time: '11:00 - 12:00', room: 'Rom 205', day: 'Fredag', type: 'class' },
                  ],
                  'Lørdag': [],
                  'Søndag': [],
                }
                return schedules
              })()
            : {} // For real data, we'd need to fetch all schedule data
          
          // Find current class (started but not ended) or next upcoming class in today's schedule
          let currentOrNextClass: any = null
          let isTomorrowClass = false
          let displayDay = today
          
          if (todaySchedule.length === 0) {
            // No classes today, find tomorrow's first class (or Monday's if weekend)
            const targetDay = (tomorrow === 'Lørdag' || tomorrow === 'Søndag') ? 'Mandag' : tomorrow
            const targetSchedule = allScheduleData[targetDay] || []
            if (targetSchedule.length > 0) {
              // Sort by time and get first class
              const sorted = targetSchedule.sort((a: any, b: any) => {
                const timeA = a.time.match(/(\d{2}):(\d{2})/)?.[0] || '00:00'
                const timeB = b.time.match(/(\d{2}):(\d{2})/)?.[0] || '00:00'
                return timeA.localeCompare(timeB)
              })
              currentOrNextClass = sorted[0]
              isTomorrowClass = true
              displayDay = targetDay
            }
          } else {
            for (const item of todaySchedule) {
              const timeMatch = item.time.match(/(\d{2}):(\d{2})\s*-\s*(\d{2}):(\d{2})/)
              if (!timeMatch) continue
              
              const startHours = parseInt(timeMatch[1])
              const startMinutes = parseInt(timeMatch[2])
              const endHours = parseInt(timeMatch[3])
              const endMinutes = parseInt(timeMatch[4])
              
              const startTime = new Date()
              startTime.setHours(startHours, startMinutes, 0, 0)
              
              const endTime = new Date()
              endTime.setHours(endHours, endMinutes, 0, 0)
              
              // Check if this is the current class (started but not ended)
              if (now >= startTime && now <= endTime) {
                currentOrNextClass = { ...item, isCurrent: true, startTime, endTime }
                break
              }
              
              // If no current class found yet, check if this is the next upcoming class
              if (!currentOrNextClass && now < startTime) {
                currentOrNextClass = { ...item, isCurrent: false, startTime, endTime }
              }
            }
            
            // If no current or next class found today, find tomorrow's first class
            if (!currentOrNextClass) {
              const targetDay = (tomorrow === 'Lørdag' || tomorrow === 'Søndag') ? 'Mandag' : tomorrow
              const targetSchedule = allScheduleData[targetDay] || []
              if (targetSchedule.length > 0) {
                const sorted = targetSchedule.sort((a: any, b: any) => {
                  const timeA = a.time.match(/(\d{2}):(\d{2})/)?.[0] || '00:00'
                  const timeB = b.time.match(/(\d{2}):(\d{2})/)?.[0] || '00:00'
                  return timeA.localeCompare(timeB)
                })
                currentOrNextClass = sorted[0]
                isTomorrowClass = true
                displayDay = targetDay
              } else {
                // Fallback to last class of today if no tomorrow classes
                currentOrNextClass = { ...todaySchedule[todaySchedule.length - 1], isCurrent: false }
              }
            }
          }
          
          if (!currentOrNextClass) {
            return (
      <div>
        <h2 className="font-bold text-lg mb-3" style={{ color: '#006C75' }}>Dagens timeplan</h2>
          <Card className="p-4 text-center border-2" style={{ borderColor: 'rgba(232, 165, 255, 0.3)', borderRadius: '12px' }}>
            <p className="text-sm" style={{ color: 'rgba(0, 108, 117, 0.7)' }}>Ingen timer i dag</p>
          </Card>
              </div>
            )
          }
          
          const item = currentOrNextClass
              const timeMatch = item.time.match(/(\d{2}):(\d{2})/)
          const startTimeStr = timeMatch ? timeMatch[1] + ':' + timeMatch[2] : ''
          const [hours, minutes] = startTimeStr.split(':').map(Number)
          
          // For tomorrow's classes, calculate time until tomorrow at that time
          let classTime = new Date()
          if (isTomorrowClass) {
            // Set to target day at the class time
            const targetDayIndex = days.indexOf(displayDay)
            let daysUntilTarget = (targetDayIndex - now.getDay() + 7) % 7
            if (daysUntilTarget === 0) daysUntilTarget = 7 // If same day, it's next week
            classTime.setDate(now.getDate() + daysUntilTarget)
          }
              classTime.setHours(hours, minutes, 0, 0)
          
              const diffMs = classTime.getTime() - now.getTime()
              const diffMins = Math.floor(diffMs / 60000)
              const diffHours = Math.floor(diffMins / 60)
              const remainingMins = diffMins % 60

              let timeText = ''
          if (item.isCurrent && !isTomorrowClass) {
            // Calculate time until end of class
            const endTime = item.endTime || classTime
            const endDiffMs = endTime.getTime() - now.getTime()
            const endDiffMins = Math.floor(endDiffMs / 60000)
            const endDiffHours = Math.floor(endDiffMins / 60)
            const endRemainingMins = endDiffMins % 60
            
            if (endDiffHours > 0) {
              timeText = `Pågår nå - ${endDiffHours}t ${endRemainingMins}min igjen`
            } else if (endDiffMins > 0) {
              timeText = `Pågår nå - ${endDiffMins}min igjen`
            } else {
              timeText = 'Pågår nå'
            }
          } else {
            // For tomorrow's classes or upcoming today's classes
            if (isTomorrowClass) {
              const daysUntil = Math.floor(diffHours / 24)
              const hoursUntil = diffHours % 24
              if (daysUntil > 0) {
                timeText = `${daysUntil} ${daysUntil === 1 ? 'dag' : 'dager'} og ${hoursUntil}t til timen`
              } else if (diffHours > 0) {
                timeText = `${diffHours}t ${remainingMins}min til timen`
              } else {
                timeText = `${diffMins}min til timen`
              }
            } else {
              if (diffMins < 0) {
                timeText = 'Timer startet'
              } else if (diffHours > 0) {
                timeText = `${diffHours}t ${remainingMins}min til timen`
              } else {
                timeText = `${diffMins}min til timen`
              }
            }
          }
          
          // Determine title based on whether it's tomorrow's class
          const sectionTitle = isTomorrowClass 
            ? `${displayDay}s første time` 
            : 'Dagens timeplan'

          // Determine if this is Samfunnsfag (orange) or other subject (purple)
          const isSamfunnsfag = item.subject === 'Samfunnsfag'
          
          // Orange colors for Samfunnsfag
          const cardBg = isSamfunnsfag 
            ? 'linear-gradient(to bottom right, rgba(255, 159, 102, 0.1), rgba(255, 245, 240, 0.5))'
            : 'linear-gradient(to bottom right, rgba(232, 165, 255, 0.1), rgba(232, 246, 246, 0.5))'
          const cardBorder = isSamfunnsfag
            ? 'rgba(255, 159, 102, 0.3)'
            : 'rgba(232, 165, 255, 0.3)'
          const buttonBg = isSamfunnsfag
            ? '#FF9F66'
            : '#C77DFF'

              return (
            <>
              <h2 className="font-bold text-lg mb-3" style={{ color: '#006C75' }}>{sectionTitle}</h2>
                <Card
                  key={item._id}
                  className="p-3 border-2"
                  style={{
                  background: cardBg,
                  borderColor: cardBorder,
                    borderRadius: '12px',
                  }}
                >
                {isTomorrowClass && (
                  <div className="px-3 py-2 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200">
                    <div className="flex items-center gap-2">
                      <span className="text-base">✅</span>
                      <p className="text-xs font-semibold" style={{ color: '#006C75' }}>
                        Dagens timeplan er ferdig! Her er {displayDay === 'Mandag' && (tomorrow === 'Lørdag' || tomorrow === 'Søndag') 
                          ? 'mandagens' 
                          : 'morgendagens'} første time:
                      </p>
                    </div>
                  </div>
                )}
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
                  className="text-xs"
                  style={{ backgroundColor: buttonBg, color: 'white' }}
                    >
                      <CheckCircle className="w-3 h-3 mr-1" />
                  Ta Oppmøte
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
            </>
              )
        })()}
      </div>

      {/* Classes */}
      <div>
        <h2 className="font-bold text-lg mb-3" style={{ color: '#006C75' }}>Mine klasser</h2>
        {classes.length === 0 ? (
          <Card className="p-4 text-center border-2" style={{ borderColor: 'rgba(251, 190, 158, 0.3)', borderRadius: '12px' }}>
            <p className="text-sm" style={{ color: 'rgba(0, 108, 117, 0.7)' }}>Ingen klasser</p>
          </Card>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {classes.map((cls: any) => (
              <Card
                key={cls._id}
                className="p-3 border-2 cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  borderColor: selectedClass === cls._id ? '#FF9F66' : 'rgba(251, 190, 158, 0.3)',
                  borderRadius: '12px',
                  backgroundColor: selectedClass === cls._id ? 'rgba(251, 190, 158, 0.1)' : 'white',
                  boxShadow: selectedClass === cls._id ? '0 4px 12px rgba(251, 190, 158, 0.2)' : '0 2px 4px rgba(0, 0, 0, 0.05)'
                }}
                onMouseEnter={(e) => {
                  if (selectedClass !== cls._id) {
                    e.currentTarget.style.borderColor = 'rgba(251, 190, 158, 0.5)'
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(251, 190, 158, 0.15)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedClass !== cls._id) {
                    e.currentTarget.style.borderColor = 'rgba(251, 190, 158, 0.3)'
                    e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.05)'
                  }
                }}
                onClick={() => {
                  setSelectedClass(cls._id)
                  setShowClassDialog(true)
                }}
              >
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg" style={{ background: 'linear-gradient(135deg, #FF9F66, #FBBE9E)' }}>
                    <Users className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="font-bold text-sm block truncate" style={{ color: '#006C75' }}>
                      {cls.name}
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 flex-shrink-0" style={{ color: 'rgba(255, 159, 102, 0.6)' }} />
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
          {editingAnnouncement && (
            <EditAnnouncementDialog 
              announcement={editingAnnouncement}
              onClose={() => setEditingAnnouncement(null)} 
            />
          )}
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
                  className="p-3 border-2 transition-all hover:scale-[1.01]"
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
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium" style={{ color: 'rgba(0, 108, 117, 0.6)' }}>
                          {timeAgo}
                        </span>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0"
                            onClick={(e) => {
                              e.stopPropagation()
                              setEditingAnnouncement(announcement)
                            }}
                          >
                            <Edit2 className="w-3 h-3" style={{ color: '#006C75' }} />
                          </Button>
                          <DeleteAnnouncementButton announcementId={announcement._id} />
                        </div>
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


      {/* Coupons List */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-lg" style={{ color: '#006C75' }}>Kuponger</h2>
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            setEditingCoupon(null)
            setShowCouponDialog(true)
          }}
            className="flex-shrink-0"
          style={{ borderColor: '#00A7B3', color: '#00A7B3' }}
        >
            <Plus className="w-4 h-4" />
        </Button>
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
                onClick={() => setShowAllCouponsDialog(true)}
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
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setEditingEvent(null)
              setShowEventDialog(true)
            }}
            className="flex-shrink-0"
            style={{ borderColor: '#E8A5FF', color: '#E8A5FF' }}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        {!eventsQuery || eventsQuery.length === 0 ? (
          <Card className="p-4 text-center border-2" style={{ borderColor: 'rgba(232, 165, 255, 0.3)', borderRadius: '12px' }}>
            <p className="text-sm" style={{ color: 'rgba(0, 108, 117, 0.7)' }}>Ingen arrangementer</p>
          </Card>
        ) : (
          <div className="space-y-2">
            {eventsQuery.slice(0, 3).map((event: any) => {
              const getEventStyles = (colorTheme?: string) => {
                switch (colorTheme) {
                  case 'blue':
                    return { bg: 'linear-gradient(to bottom right, #00A7B3, #00C4D4, #00A7B3)', border: 'rgba(0, 167, 179, 0.5)' }
                  case 'green':
                    return { bg: 'linear-gradient(to bottom right, #4ECDC4, #44A08D, #4ECDC4)', border: 'rgba(78, 205, 196, 0.5)' }
                  case 'pink':
                    return { bg: 'linear-gradient(to bottom right, #FF6B9D, #FF8E9B, #FF6B9D)', border: 'rgba(255, 107, 157, 0.5)' }
                  case 'purple':
                    return { bg: 'linear-gradient(to bottom right, #E8A5FF, #C77DFF, #E8A5FF)', border: 'rgba(232, 165, 255, 0.5)' }
                  case 'orange':
                    return { bg: 'linear-gradient(to bottom right, #FBBE9E, #FF9F66, #FBBE9E)', border: 'rgba(251, 190, 158, 0.5)' }
                  default:
                    return { bg: 'linear-gradient(to bottom right, #00A7B3, #00C4D4, #00A7B3)', border: 'rgba(0, 167, 179, 0.5)' }
                }
              }
              const eventStyle = getEventStyles(event.colorTheme || 'blue')

              return (
              <Card
                key={event._id}
                className="p-4 border-2 transition-all duration-300 hover:shadow-xl hover:scale-[1.01]"
                  style={{ 
                    background: eventStyle.bg,
                    borderColor: eventStyle.border, 
                  borderRadius: '16px',
                  boxShadow: '0 4px 12px rgba(0, 167, 179, 0.15)'
                }}
              >
                <div className="flex items-center gap-3 flex-1">
                  {event.emoji && (
                    <span className="text-2xl flex-shrink-0">{event.emoji}</span>
                  )}
                    <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-base drop-shadow-md line-clamp-1" style={{ color: 'white' }}>{event.title}</h4>
                      </div>
                    <div className="flex items-center gap-2 text-xs" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                      {event.date && (
                        <Badge className="text-xs bg-white/40 text-white border-white/50 backdrop-blur-md font-bold px-2 py-0.5">
                          {event.date}
                        </Badge>
                      )}
                      <span>{event.time}</span>
                      {event.capacity && (
                        <>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            <span>{event.registered || 0}/{event.capacity}</span>
                    </div>
                        </>
                      )}
                      </div>
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditingEvent(event)
                        setShowEventDialog(true)
                      }}
                      className="p-1.5 bg-white/20 border-white/50 hover:bg-white/30"
                    >
                      <Edit2 className="w-4 h-4 text-white" />
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
                onClick={() => setShowAllEventsDialog(true)}
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

      {/* All Coupons Dialog */}
      <Dialog open={showAllCouponsDialog} onOpenChange={setShowAllCouponsDialog}>
        <DialogContent className="max-w-[90vw] md:max-w-[500px] lg:max-w-[600px] max-h-[90vh] overflow-y-auto" style={{ borderRadius: '20px' }}>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold" style={{ color: '#006C75' }}>Alle Kuponger</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 mt-4">
            {(couponsQuery || []).map((coupon: any, index: number) => {
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

              return (
                <Card
                  key={coupon._id}
                  className="p-4 border-2 transition-all duration-200"
                  style={{
                    background: gradient.bg,
                    borderColor: gradient.border,
                    borderRadius: '16px'
                  }}
                >
                  {/* Header Row */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center flex-1 min-w-0">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-base truncate" style={{ color: '#006C75' }}>{coupon.title}</h4>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge className="text-xs border font-bold px-2 py-0.5 inline-block" style={{ background: getCategoryColor(coupon.category || 'Annet').bg, color: getCategoryColor(coupon.category || 'Annet').text, borderColor: getCategoryColor(coupon.category || 'Annet').border }}>
                            {coupon.category || 'Annet'}
                          </Badge>
                          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full shadow-sm flex-shrink-0" style={{ background: 'linear-gradient(135deg, #00A7B3, #00C4D4)' }}>
                            <Coins className="w-4 h-4 text-white" />
                            <span className="font-extrabold text-white text-sm whitespace-nowrap">{coupon.cost} pts</span>
    </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditingCoupon(coupon)
                          setShowCouponDialog(true)
                          setShowAllCouponsDialog(false)
                        }}
                        className="p-1.5"
                      >
                        <Edit2 className="w-4 h-4" style={{ color: '#006C75' }} />
                      </Button>
                      <DeleteCouponButton couponId={coupon._id} />
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm font-medium leading-snug" style={{ color: 'rgba(0, 108, 117, 0.8)' }}>
                    {coupon.description}
                  </p>

                  {/* Allergies Row */}
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    {coupon.allergies && coupon.allergies.length > 0 ? (
                      coupon.allergies.map((allergy: string, idx: number) => (
                        <span 
                          key={idx}
                          className="text-xs font-semibold px-2 py-1 rounded-full" 
                          style={{ color: '#006C75', backgroundColor: '#FFF4E6', border: '1px solid rgba(251, 190, 158, 0.5)' }}
                        >
                          {allergy}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs font-semibold px-2 rounded-full" style={{ color: '#00A7B3', backgroundColor: '#E8F6F6' }}>
                        Allergifri
                      </span>
                    )}
                  </div>

                  {/* Availability */}
                  <div className="text-xs font-semibold" style={{ color: 'rgba(0, 108, 117, 0.7)' }}>
                    {coupon.available} tilgjengelig
                  </div>
                </Card>
              )
            })}
          </div>
        </DialogContent>
      </Dialog>

      {/* All Events Dialog */}
      <Dialog open={showAllEventsDialog} onOpenChange={setShowAllEventsDialog}>
        <DialogContent className="max-w-[90vw] md:max-w-[500px] lg:max-w-[600px] max-h-[90vh] overflow-y-auto" style={{ borderRadius: '20px' }}>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold" style={{ color: '#006C75' }}>Alle Arrangementer</DialogTitle>
          </DialogHeader>
          <div className="space-y-2 mt-4">
            {(eventsQuery || []).map((event: any) => {
              const getEventStyles = (colorTheme?: string) => {
                switch (colorTheme) {
                  case 'blue':
                    return { bg: 'linear-gradient(to bottom right, #00A7B3, #00C4D4, #00A7B3)', border: 'rgba(0, 167, 179, 0.5)' }
                  case 'green':
                    return { bg: 'linear-gradient(to bottom right, #4ECDC4, #44A08D, #4ECDC4)', border: 'rgba(78, 205, 196, 0.5)' }
                  case 'pink':
                    return { bg: 'linear-gradient(to bottom right, #FF6B9D, #FF8E9B, #FF6B9D)', border: 'rgba(255, 107, 157, 0.5)' }
                  case 'purple':
                    return { bg: 'linear-gradient(to bottom right, #E8A5FF, #C77DFF, #E8A5FF)', border: 'rgba(232, 165, 255, 0.5)' }
                  case 'orange':
                    return { bg: 'linear-gradient(to bottom right, #FBBE9E, #FF9F66, #FBBE9E)', border: 'rgba(251, 190, 158, 0.5)' }
                  default:
                    return { bg: 'linear-gradient(to bottom right, #00A7B3, #00C4D4, #00A7B3)', border: 'rgba(0, 167, 179, 0.5)' }
                }
              }
              
              const eventStyle = getEventStyles(event.colorTheme)
              
              return (
                <Card
                  key={event._id}
                  className="p-4 border-2 transition-all duration-300"
                  style={{
                    background: eventStyle.bg,
                    borderColor: eventStyle.border,
                    borderRadius: '16px',
                    boxShadow: '0 4px 12px rgba(0, 167, 179, 0.15)'
                  }}
                >
                  <div className="flex items-center gap-3 flex-1">
                    {event.emoji && (
                      <span className="text-2xl flex-shrink-0">{event.emoji}</span>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-base drop-shadow-md line-clamp-1" style={{ color: 'white' }}>{event.title}</h4>
                      </div>
                      <div className="flex items-center gap-2 text-xs mb-2" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                        {event.date && (
                          <Badge className="text-xs bg-white/40 text-white border-white/50 backdrop-blur-md font-bold px-2 py-0.5">
                            {event.date}
                          </Badge>
                        )}
                        <span>{event.time}</span>
                        {event.capacity && (
                          <>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              <span>{event.registered || 0}/{event.capacity}</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditingEvent(event)
                          setShowEventDialog(true)
                          setShowAllEventsDialog(false)
                        }}
                        className="p-1.5 bg-white/20 border-white/50 hover:bg-white/30"
                      >
                        <Edit2 className="w-4 h-4 text-white" />
                      </Button>
                      <DeleteEventButton eventId={event._id} />
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </DialogContent>
      </Dialog>
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
    <DialogContent className="max-w-[90vw]">
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

// Edit Announcement Dialog
function EditAnnouncementDialog({ announcement, onClose }: { announcement: any, onClose: () => void }) {
  const [title, setTitle] = useState(announcement.title || '')
  const [content, setContent] = useState(announcement.content || '')
  const updateAnnouncement = useMutation(api.announcements.update)

  React.useEffect(() => {
    setTitle(announcement.title || '')
    setContent(announcement.content || '')
  }, [announcement])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await updateAnnouncement({ 
        announcementId: announcement._id,
        title, 
        content 
      })
      toast.success('Kunngjøring oppdatert!')
      onClose()
    } catch (error: any) {
      toast.error(error.message || 'Kunne ikke oppdatere kunngjøring')
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-[90vw]">
        <DialogHeader>
          <DialogTitle>Rediger kunngjøring</DialogTitle>
          <DialogDescription>
            Oppdater kunngjøringen
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="edit-title">Tittel</Label>
            <Input
              id="edit-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="edit-content">Info</Label>
            <Textarea
              id="edit-content"
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
              Oppdater
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// Delete Announcement Button
function DeleteAnnouncementButton({ announcementId }: { announcementId: any }) {
  const [showConfirm, setShowConfirm] = useState(false)
  const deleteAnnouncement = useMutation(api.announcements.deleteAnnouncement)

  const handleDelete = async () => {
    try {
      await deleteAnnouncement({ announcementId })
      toast.success('Kunngjøring slettet!')
      setShowConfirm(false)
    } catch (error: any) {
      toast.error(error.message || 'Kunne ikke slette kunngjøring')
    }
  }

  return (
    <>
      <Button
        size="sm"
        variant="ghost"
        className="h-6 w-6 p-0"
        onClick={(e) => {
          e.stopPropagation()
          setShowConfirm(true)
        }}
      >
        <Trash2 className="w-3 h-3" style={{ color: '#dc2626' }} />
      </Button>
      {showConfirm && (
        <Dialog open onOpenChange={setShowConfirm}>
          <DialogContent className="max-w-[90vw]">
            <DialogHeader>
              <DialogTitle>Slett kunngjøring</DialogTitle>
              <DialogDescription>
                Er du sikker på at du vil slette denne kunngjøringen? Denne handlingen kan ikke angres.
              </DialogDescription>
            </DialogHeader>
            <div className="flex gap-2 mt-4">
              <Button variant="outline" onClick={() => setShowConfirm(false)} className="flex-1">
                Avbryt
              </Button>
              <Button 
                onClick={handleDelete} 
                className="flex-1" 
                style={{ backgroundColor: '#dc2626', color: 'white' }}
              >
                Slett
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
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
      variant="outline"
      onClick={() => setShowConfirm(true)}
      className="p-1.5 bg-white/20 border-white/50 hover:bg-white/30"
    >
      <Trash2 className="w-4 h-4 text-white" />
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
      <DialogContent className="max-w-[90vw] md:max-w-[500px] lg:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{coupon ? 'Rediger kupong' : 'Ny kupong'}</DialogTitle>
          <DialogDescription>
            {coupon ? 'Oppdater kuponginformasjon' : 'Opprett en ny kupong som elever kan løse inn med poeng'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-4">
            <div className="w-20 flex-shrink-0">
            <Label htmlFor="emoji">Emoji</Label>
            <Input
              id="emoji"
              value={emoji}
              onChange={(e) => setEmoji(e.target.value)}
              placeholder="🍕"
              required
            />
          </div>
            <div className="flex-1">
            <Label htmlFor="title">Tittel</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            </div>
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
          <div className="flex gap-4">
            <div className="flex-1">
            <Label htmlFor="cost">Kostnad (poeng)</Label>
            <Input
              id="cost"
              type="number"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              required
            />
          </div>
            <div className="flex-1">
            <Label htmlFor="category">Kategori</Label>
            <Input
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
            </div>
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
  // Helper function to convert "DD. MMM" to "YYYY-MM-DD" for date input
  const parseDateForInput = (dateStr: string): string => {
    if (!dateStr) return ''
    // Check if already in YYYY-MM-DD format
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr
    
    // Parse "DD. MMM" format (e.g., "27. nov")
    const parts = dateStr.split('. ')
    if (parts.length !== 2) return ''
    
    const day = parseInt(parts[0], 10)
    const monthStr = parts[1].toLowerCase()
    const monthMap: { [key: string]: number } = {
      'jan': 0, 'feb': 1, 'mar': 2, 'apr': 3, 'mai': 4, 'jun': 5,
      'jul': 6, 'aug': 7, 'sep': 8, 'okt': 9, 'nov': 10, 'des': 11
    }
    const month = monthMap[monthStr] ?? 0
    
    // Use 2025 as the year (events are for 2025)
    const date = new Date(2025, month, day)
    const year = date.getFullYear()
    const monthPadded = String(month + 1).padStart(2, '0')
    const dayPadded = String(day).padStart(2, '0')
    return `${year}-${monthPadded}-${dayPadded}`
  }

  // Helper function to convert "YYYY-MM-DD" to "DD. MMM" for database
  const formatDateForDatabase = (dateStr: string): string => {
    if (!dateStr) return ''
    // Check if already in "DD. MMM" format
    if (/^\d{1,2}\. [a-z]{3}$/i.test(dateStr)) return dateStr
    
    // Parse "YYYY-MM-DD" format
    const date = new Date(dateStr)
    if (isNaN(date.getTime())) return ''
    
    const day = date.getDate()
    const month = date.toLocaleDateString('no-NO', { month: 'short' })
    return `${day}. ${month}`
  }

  const [title, setTitle] = useState(event?.title || '')
  const [description, setDescription] = useState(event?.description || '')
  const [date, setDate] = useState(parseDateForInput(event?.date || ''))
  const [time, setTime] = useState(event?.time || '')
  const [emoji, setEmoji] = useState(event?.emoji || '')
  const [capacity, setCapacity] = useState(event?.capacity?.toString() || '')
  // Color theme is set automatically based on event type, not editable - keep existing or default to blue
  const [colorTheme] = useState(event?.colorTheme || 'blue')
  const createEvent = useMutation(api.teacherEvents.createEvent)
  const updateEvent = useMutation(api.teacherEvents.updateEvent)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // Convert date from YYYY-MM-DD to DD. MMM format
      const formattedDate = formatDateForDatabase(date)
      
      if (event) {
        await updateEvent({
          eventId: event._id,
          title,
          description,
          date: formattedDate,
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
          date: formattedDate,
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
      <DialogContent className="max-w-[90vw] md:max-w-[500px] lg:max-w-[600px] max-h-[90vh] overflow-y-auto" style={{ borderRadius: '20px' }}>
        <DialogHeader>
          <DialogTitle className="text-xl font-bold" style={{ color: '#006C75' }}>
            {event ? 'Rediger arrangement' : 'Nytt arrangement'}
          </DialogTitle>
          <DialogDescription className="text-sm" style={{ color: 'rgba(0, 108, 117, 0.7)' }}>
            {event ? 'Oppdater arrangementsinformasjon' : 'Opprett et nytt arrangement som elever kan melde seg på'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="flex gap-4">
            <div className="w-20 flex-shrink-0">
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
            <div className="flex-1">
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
              className="flex-1 font-bold transition-all duration-200 hover:scale-105" 
              style={{ 
                background: 'linear-gradient(135deg, #9D4EDD 0%, #C77DFF 50%, #E8A5FF 100%)', 
                color: 'white',
                border: 'none',
                boxShadow: '0 4px 16px rgba(157, 78, 221, 0.5)',
                fontWeight: 'bold'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, #7B2CBF 0%, #9D4EDD 50%, #C77DFF 100%)'
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(157, 78, 221, 0.6)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, #9D4EDD 0%, #C77DFF 50%, #E8A5FF 100%)'
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(157, 78, 221, 0.5)'
              }}
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
      <DialogContent className="max-w-[90vw] md:max-w-[500px] lg:max-w-[600px] max-h-[90vh] overflow-y-auto" style={{ borderRadius: '20px' }}>
        <DialogHeader>
          <DialogTitle className="text-xl font-bold" style={{ color: '#006C75' }}>
            {classObj?.name || 'Klasse'} - Elever
          </DialogTitle>
          <DialogDescription className="text-sm" style={{ color: 'rgba(0, 108, 117, 0.7)' }}>
            Navneliste med kontaktinformasjon til foresatte
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2 mt-4">
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
                <div className="flex items-start gap-2.5">
                  <div className="rounded-full flex items-center justify-center flex-shrink-0 shadow-sm mr-1" style={{ background: 'linear-gradient(135deg, #E8A5FF, #C77DFF)', padding: '8px 12px', minWidth: '32px', height: '32px' }}>
                    <span className="text-white font-bold" style={{ fontSize: '11px' }}>{index + 1}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                    <h4 className="font-bold mb-1.5 truncate" style={{ color: '#006C75', fontSize: '15px', lineHeight: '1.3' }}>
                        {student.name}
                      </h4>
                      {student.parentName && (
                        <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          <Users className="w-3 h-3 flex-shrink-0" style={{ color: 'rgba(0, 108, 117, 0.7)' }} />
                          <span className="truncate font-semibold" style={{ color: '#006C75', fontSize: '12px' }}>
                              {student.parentName}
                            </span>
                          </div>
                          {(student.parentPhone || student.parentEmail) && (
                            <div className="flex items-center gap-3 flex-wrap">
                              {student.parentPhone && (
                              <div className="flex items-center gap-1.5 flex-1 min-w-0">
                                <Phone className="w-3 h-3 flex-shrink-0" style={{ color: 'rgba(0, 108, 117, 0.6)' }} />
                                  <a 
                                    href={`tel:${student.parentPhone}`}
                                  className="hover:underline truncate" 
                                  style={{ color: '#00A7B3', fontSize: '11px' }}
                                  >
                                    {student.parentPhone}
                                  </a>
                                </div>
                              )}
                              {student.parentPhone && student.parentEmail && (
                              <span className="text-[10px] flex-shrink-0" style={{ color: 'rgba(0, 108, 117, 0.4)' }}>•</span>
                              )}
                              {student.parentEmail && (
                              <div className="flex items-center gap-1.5 min-w-0 flex-1">
                                <Mail className="w-3 h-3 flex-shrink-0" style={{ color: 'rgba(0, 108, 117, 0.6)' }} />
                                  <a 
                                    href={`mailto:${student.parentEmail}`}
                                  className="hover:underline truncate" 
                                  style={{ color: '#00A7B3', fontSize: '11px' }}
                                  >
                                    {student.parentEmail}
                                  </a>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}
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
  const markAttendance = useMutation(api.teachers.markAttendance)
  const classesQuery = useQuery(api.teachers.getTeacherClasses)
  const classes = (classesQuery && classesQuery.length > 0) ? classesQuery : mockClasses
  
  // Find class by subject/teacher name (simplified - in real app use proper classId)
  const classObj = classes.find((c: any) => c.name.includes(scheduleItem.subject?.substring(0, 3) || '')) || classes[0]

  // Get date for the schedule item's day
  const getDateForDay = (dayName: string): string => {
    const days = ['Søndag', 'Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag']
    const dayIndex = days.indexOf(dayName)
    if (dayIndex === -1) return new Date().toLocaleDateString("nb-NO")
    
    const today = new Date()
    const currentDayIndex = today.getDay()
    const daysUntilTarget = (dayIndex - currentDayIndex + 7) % 7
    const targetDate = new Date(today)
    targetDate.setDate(today.getDate() + daysUntilTarget)
    return targetDate.toLocaleDateString("nb-NO")
  }

  const attendanceDate = scheduleItem.day ? getDateForDay(scheduleItem.day) : new Date().toLocaleDateString("nb-NO")

  // Load existing attendance for this schedule item and date
  const existingAttendanceQuery = useQuery(
    api.teachers.getScheduleAttendance,
    !usingMockData && scheduleItem._id && !scheduleItem._id.toString().startsWith('item') 
      ? { scheduleItemId: scheduleItem._id, date: attendanceDate }
      : "skip"
  )
  
  const [attendance, setAttendance] = useState<Record<string, 'present' | 'late' | 'absent'>>({})
  
  // Update attendance state when existing attendance is loaded or when dialog opens
  React.useEffect(() => {
    if (existingAttendanceQuery) {
      setAttendance(existingAttendanceQuery)
    } else {
      // Reset to empty if query returns undefined/null (e.g., when dialog first opens)
      setAttendance({})
    }
  }, [existingAttendanceQuery, scheduleItem._id, attendanceDate])

  const handleStatusChange = async (studentId: string, status: 'present' | 'late' | 'absent') => {
    setAttendance((prev) => ({ ...prev, [studentId]: status }))
    
    // Don't try to save if using mock data
    if (usingMockData) {
      toast.success('Oppmøte markert! (Demo)')
      return
    }
    
    try {
      if (classObj && !classObj._id.startsWith('class') && typeof classObj._id !== 'string' && scheduleItem._id) {
        await markAttendance({
          studentId: studentId as any,
          classId: classObj._id as any,
          scheduleItemId: scheduleItem._id,
          date: attendanceDate,
          status,
        })
        toast.success('Oppmøte lagret!')
      }
    } catch (error: any) {
      toast.error(error.message || 'Kunne ikke lagre oppmøte')
    }
  }

  const getStatusCounts = () => {
    const counts = { present: 0, late: 0, absent: 0, unregistered: 0 }
    classStudents.forEach((student: any) => {
      const status = attendance[student._id]
      if (status === 'present') counts.present++
      else if (status === 'late') counts.late++
      else if (status === 'absent') counts.absent++
      else counts.unregistered++
    })
    return counts
  }

  const counts = getStatusCounts()

  return (
    <Dialog open onOpenChange={onClose} key={`${scheduleItem._id}-${attendanceDate}`}>
      <DialogContent 
        className="max-w-[90vw] md:max-w-[500px] lg:max-w-[600px] max-h-[90vh] overflow-y-auto"
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-extrabold" style={{ color: '#006C75' }}>
            Oppmøte - {scheduleItem.subject}
          </DialogTitle>
          <DialogDescription className="text-sm" style={{ color: 'rgba(0, 108, 117, 0.7)' }}>
            {attendanceDate}
          </DialogDescription>
        </DialogHeader>
        
        {/* Legend */}
        <div className="flex items-center justify-center mb-4 p-4 rounded-lg border" style={{ 
          backgroundColor: 'rgba(0, 167, 179, 0.05)',
          borderColor: 'rgba(0, 167, 179, 0.2)'  
        }}>
          <div className="flex flex-col items-center gap-1" style={{ marginRight: '2rem' }}>
            <span className="font-extrabold text-2xl text-green-600" style={{ lineHeight: '1' }}>M</span>
            <span className="text-xs font-medium whitespace-nowrap" style={{ color: '#006C75', lineHeight: '1' }}>Møtt</span>
              </div>
          <div className="flex flex-col items-center gap-1" style={{ marginRight: '2rem' }}>
            <span className="font-extrabold text-2xl text-orange-600" style={{ lineHeight: '1' }}>G</span>
            <span className="text-xs font-medium whitespace-nowrap" style={{ color: '#006C75', lineHeight: '1' }}>Gyldig fravær</span>
              </div>
          <div className="flex flex-col items-center gap-1">
            <span className="font-extrabold text-2xl" style={{ lineHeight: '1', color: '#EF4444' }}>U</span>
            <span className="text-xs font-medium whitespace-nowrap" style={{ color: '#006C75', lineHeight: '1' }}>Ugyldig fravær</span>
              </div>
            </div>

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {classStudents.map((student: any) => {
            const currentStatus = attendance[student._id]
            return (
              <div 
                key={student._id} 
                className="p-4 rounded-xl border-2 transition-all hover:shadow-lg"
                style={{ 
                  backgroundColor: currentStatus === 'present' 
                    ? 'rgba(16, 185, 129, 0.05)' 
                    : currentStatus === 'late'
                    ? 'rgba(249, 115, 22, 0.05)'
                    : currentStatus === 'absent'
                    ? 'rgba(239, 68, 68, 0.05)'
                    : 'white',
                  borderColor: currentStatus === 'present'
                    ? 'rgba(16, 185, 129, 0.3)'
                    : currentStatus === 'late'
                    ? 'rgba(249, 115, 22, 0.3)'
                    : currentStatus === 'absent'
                    ? 'rgba(239, 68, 68, 0.3)'
                    : 'rgba(0, 108, 117, 0.1)',
                  boxShadow: currentStatus ? '0 4px 12px rgba(0, 0, 0, 0.08)' : 'none'
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-bold text-base mb-1" style={{ color: '#006C75' }}>
                  {student.name}
                    </h4>
                </div>
                  <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleStatusChange(student._id, 'present')}
                        className={`px-4 py-2 rounded-lg font-extrabold text-base transition-all ${
                          currentStatus === 'present'
                            ? 'text-white shadow-lg scale-105'
                            : 'text-green-600 hover:bg-green-50'
                        }`}
                        style={{
                          background: currentStatus === 'present'
                            ? 'linear-gradient(135deg, #10B981, #059669)'
                            : 'transparent',
                          border: currentStatus === 'present' ? 'none' : '2px solid rgba(16, 185, 129, 0.3)'
                        }}
                      >
                        M
                      </button>
                      <button
                        onClick={() => handleStatusChange(student._id, 'late')}
                        className={`px-4 py-2 rounded-lg font-extrabold text-base transition-all ${
                          currentStatus === 'late'
                            ? 'text-white shadow-lg scale-105'
                            : 'text-orange-600 hover:bg-orange-50'
                        }`}
                        style={{
                          background: currentStatus === 'late'
                            ? 'linear-gradient(135deg, #F97316, #EA580C)'
                            : 'transparent',
                          border: currentStatus === 'late' ? 'none' : '2px solid rgba(249, 115, 22, 0.3)'
                        }}
                      >
                        G
                      </button>
                      <button
                        onClick={() => handleStatusChange(student._id, 'absent')}
                        className={`px-4 py-2 rounded-lg font-extrabold text-base transition-all ${
                          currentStatus === 'absent'
                            ? 'text-white shadow-lg scale-105'
                            : 'text-red-600 hover:bg-red-50'
                        }`}
                        style={{
                          background: currentStatus === 'absent'
                            ? 'linear-gradient(135deg, #EF4444, #DC2626)'
                            : 'transparent',
                          border: currentStatus === 'absent' ? 'none' : '2px solid rgba(239, 68, 68, 0.3)',
                          color: currentStatus === 'absent' ? 'white' : '#EF4444'
                        }}
                      >
                        <span style={{ color: currentStatus === 'absent' ? 'white' : '#EF4444' }}>U</span>
                      </button>
                </div>
              </div>
          </div>
            )
          })}
        </div>
        
        {/* Summary at bottom */}
        <div className="mt-6 p-4 rounded-xl border-2" style={{ 
          backgroundColor: 'rgba(0, 167, 179, 0.05)', 
          borderColor: 'rgba(0, 167, 179, 0.2)' 
        }}>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold" style={{ color: '#006C75' }}>Møtt:</span>
              <span className="text-lg font-extrabold" style={{ color: '#10B981' }}>{counts.present}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold" style={{ color: '#006C75' }}>Gyldig fravær:</span>
              <span className="text-lg font-extrabold" style={{ color: '#F97316' }}>{counts.late}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold" style={{ color: '#006C75' }}>Ugyldig fravær:</span>
              <span className="text-lg font-extrabold" style={{ color: '#EF4444' }}>{counts.absent}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold" style={{ color: '#006C75' }}>Mangler registrering:</span>
              <span className="text-lg font-extrabold" style={{ color: '#000000' }}>
                {counts.unregistered}
              </span>
            </div>
          </div>
        </div>
        
        <Button 
          onClick={onClose} 
          className="w-full mt-4 font-bold text-base py-6 shadow-lg hover:shadow-xl transition-all"
          style={{ 
            background: 'linear-gradient(135deg, #00A7B3, #00C4D4)', 
            color: 'white',
            border: 'none'
          }}
        >
          Lagre oppmøte
        </Button>
      </DialogContent>
    </Dialog>
  )
}

