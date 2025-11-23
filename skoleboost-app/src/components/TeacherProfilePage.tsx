import React from 'react'
import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { User, GraduationCap, Users, TrendingUp, Calendar, Award, BookOpen, Clock, CheckCircle2, Bell, Sparkles } from 'lucide-react'
import { Card } from './ui/card'
import { Badge } from './ui/badge'

// Mock data for demo
const mockClasses = [
  { _id: 'class1', name: 'Klasse 8A', grade: '8. trinn', subject: 'Norsk' },
  { _id: 'class2', name: 'Klasse 8C', grade: '8. trinn', subject: 'Norsk' },
  { _id: 'class3', name: 'Klasse 9B', grade: '9. trinn', subject: 'Norsk' },
  { _id: 'class4', name: 'Klasse 9C', grade: '9. trinn', subject: 'Norsk' },
]

const getMockTodaySchedule = () => {
  const days = ['Søndag', 'Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag']
  const today = days[new Date().getDay()]
  
  const schedules: Record<string, any[]> = {
    'Mandag': [
      { _id: 's1', subject: 'Norsk', time: '10:45 - 11:30', room: 'Rom 207', day: 'Mandag', type: 'class' },
      { _id: 's2', subject: 'Norsk', time: '12:15 - 13:00', room: 'Rom 208', day: 'Mandag', type: 'class' },
    ],
    'Tirsdag': [
      { _id: 's3', subject: 'Norsk', time: '09:15 - 10:15', room: 'Rom 201', day: 'Tirsdag', type: 'class' },
      { _id: 's4', subject: 'Norsk', time: '13:45 - 14:45', room: 'Rom 201', day: 'Tirsdag', type: 'class' },
    ],
    'Onsdag': [
      { _id: 's5', subject: 'Norsk', time: '08:00 - 09:00', room: 'Rom 201', day: 'Onsdag', type: 'class' },
    ],
    'Torsdag': [
      { _id: 's6', subject: 'Norsk', time: '09:15 - 10:15', room: 'Rom 201', day: 'Torsdag', type: 'class' },
    ],
    'Fredag': [
      { _id: 's7', subject: 'Norsk', time: '08:00 - 09:00', room: 'Rom 201', day: 'Fredag', type: 'class' },
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
    content: 'Vi inviterer alle foreldre til foreldremøte tirsdag 21. oktober kl. 18:00. Vi vil diskutere elevens fremgang og mål for resten av skoleåret.',
    createdAt: Date.now() - 86400000,
  },
  {
    _id: 'ann2',
    title: 'Elevsamtaler uke 45',
    content: 'Elevsamtaler for alle klasser vil finne sted i uke 45. Book tid via skoleportalen. Vi ser frem til å snakke med dere!',
    createdAt: Date.now() - 172800000,
  },
  {
    _id: 'ann3',
    title: 'Norsk prøve uke 44',
    content: 'Husk at det er norskprøve i uke 44. Elevene har fått oppgaver og forberedelsesmateriale.',
    createdAt: Date.now() - 259200000,
  },
]

export function TeacherProfilePage() {
  const teacherQuery = useQuery(api.teachers.getCurrentTeacher, {})
  const classesQuery = useQuery(api.teachers.getTeacherClasses, {})
  const todayAttendanceQuery = useQuery(api.teachers.getTodayAttendance, {})
  const announcementsQuery = useQuery(api.announcements.getAll, {})
  const eventsQuery = useQuery(api.events.getAll, {})

  // Use mock data if queries return empty or undefined (for demo)
  const teacher = teacherQuery || { name: 'Kari Lærer', email: 'kari@skole.no', role: 'teacher' }
  const classes = (classesQuery && classesQuery.length > 0) ? classesQuery : mockClasses
  const todayAttendance = todayAttendanceQuery && todayAttendanceQuery.total > 0
    ? todayAttendanceQuery
    : { present: 24, late: 2, absent: 1, total: 27 }
  const announcements = (announcementsQuery && announcementsQuery.length > 0) ? announcementsQuery : mockAnnouncements
  const events = (eventsQuery && eventsQuery.length > 0) ? eventsQuery : []

  const totalStudents = 27 // Mock total students across all classes

  const averageAbsence = todayAttendance.total > 0 
    ? ((todayAttendance.absent / todayAttendance.total) * 100).toFixed(1) 
    : '3.7'
  
  // Calculate week's attendance percentage (mock data - in real app, this would come from API)
  const weekAttendanceRate = 89 // Mock weekly attendance rate
  
  // Count upcoming events (events in the future)
  const upcomingEventsCount = events.filter((event: any) => {
    // Filter events that are in the future (simplified - in real app would check dates)
    return true // For now, count all events as upcoming
  }).length

  return (
    <div className="pb-20 px-4 max-w-md mx-auto space-y-2" style={{ paddingTop: '2.5rem' }}>
      {/* Enhanced Profile Header */}
      <Card className="p-6 border-2 shadow-xl mt-4" style={{ background: 'linear-gradient(135deg, #E8A5FF 0%, #C77DFF 50%, #E8A5FF 100%)', borderColor: 'rgba(255, 255, 255, 0.3)', borderRadius: '16px', boxShadow: '0 10px 40px rgba(232, 165, 255, 0.3)' }}>
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center flex-shrink-0 border-2 border-white/60 shadow-lg">
            <GraduationCap className="w-7 h-7 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-white font-extrabold text-xl drop-shadow-lg truncate">{teacher.name}</h2>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className="text-white/95 text-sm font-semibold">Lærer</span>
              <span className="text-white/70">•</span>
              <span className="text-white/95 text-sm font-semibold truncate">{teacher.email}</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 gap-3">
        <Card 
          className="px-4 py-1 text-center shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] flex flex-col justify-center gap-2" 
          style={{ 
            background: 'linear-gradient(135deg, #E8A5FF 0%, #C77DFF 50%, #E8A5FF 100%)', 
            border: '3px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 10px 30px rgba(232, 165, 255, 0.3)'
          }}
        >
          <div className="flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-white drop-shadow-lg" />
          </div>
          <span className="font-extrabold text-white block drop-shadow-lg" style={{ fontSize: '2rem', lineHeight: '1', textShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>{weekAttendanceRate}%</span>
          <p className="text-sm text-white font-semibold tracking-wide uppercase">Ukens Oppmøte</p>
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
            <Sparkles className="w-10 h-10 text-white drop-shadow-lg" />
          </div>
          <span className="font-extrabold text-white block drop-shadow-lg" style={{ fontSize: '2rem', lineHeight: '1', textShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>{upcomingEventsCount}</span>
          <p className="text-xs text-white font-semibold tracking-wide uppercase">Arrangementer</p>
        </Card>
      </div>

      {/* Today's Stats */}
      <Card className="p-4 border-2 shadow-xl" style={{ background: 'linear-gradient(135deg, rgba(232, 165, 255, 0.08), #E8F6F6, rgba(232, 165, 255, 0.08))', borderColor: 'rgba(232, 165, 255, 0.3)', borderRadius: '16px' }}>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="mb-0.5 flex items-center gap-2 font-extrabold text-lg" style={{ color: '#006C75' }}>
              <Calendar className="w-5 h-5" style={{ color: '#E8A5FF' }} />
              Dagens Oppmøte
            </h3>
            <p className="text-xs font-medium" style={{ color: 'rgba(0, 108, 117, 0.7)' }}>Oversikt for i dag</p>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center p-3 rounded-lg transition-all hover:scale-[1.01]" style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', boxShadow: '0 2px 8px rgba(232, 165, 255, 0.1)' }}>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
              <span className="text-sm font-semibold" style={{ color: '#006C75' }}>Møtt</span>
            </div>
            <span className="font-extrabold text-lg" style={{ color: '#00A7B3' }}>{todayAttendance.present}</span>
          </div>
          <div className="flex justify-between items-center p-3 rounded-lg transition-all hover:scale-[1.01]" style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', boxShadow: '0 2px 8px rgba(232, 165, 255, 0.1)' }}>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-orange-500"></div>
              <span className="text-sm font-semibold" style={{ color: '#006C75' }}>Gyldig fravær</span>
            </div>
            <span className="font-extrabold text-lg" style={{ color: '#FF9F66' }}>{todayAttendance.late}</span>
          </div>
          <div className="flex justify-between items-center p-3 rounded-lg transition-all hover:scale-[1.01]" style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', boxShadow: '0 2px 8px rgba(232, 165, 255, 0.1)' }}>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
              <span className="text-sm font-semibold" style={{ color: '#006C75' }}>Ugyldig fravær</span>
            </div>
            <span className="font-extrabold text-lg" style={{ color: '#FF6B9D' }}>{todayAttendance.absent}</span>
          </div>
          <div className="flex justify-between items-center p-3 rounded-lg transition-all hover:scale-[1.01]" style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', boxShadow: '0 2px 8px rgba(232, 165, 255, 0.1)' }}>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#E8A5FF' }}></div>
              <span className="text-sm font-semibold" style={{ color: '#006C75' }}>Snitt fravær</span>
            </div>
            <span className="font-extrabold text-lg" style={{ color: '#E8A5FF' }}>{averageAbsence}%</span>
          </div>
        </div>
      </Card>

      {/* My Classes */}
      <Card className="p-4 border-2 shadow-xl" style={{ background: 'linear-gradient(135deg, rgba(232, 165, 255, 0.08), rgba(232, 246, 246, 0.5), rgba(232, 165, 255, 0.08))', borderColor: 'rgba(232, 165, 255, 0.3)', borderRadius: '16px' }}>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="mb-0.5 flex items-center gap-2 font-extrabold text-lg" style={{ color: '#006C75' }}>
              <BookOpen className="w-5 h-5" style={{ color: '#E8A5FF' }} />
              Mine Klasser
            </h3>
            <p className="text-xs font-medium" style={{ color: 'rgba(0, 108, 117, 0.7)' }}>Klasser du underviser</p>
          </div>
        </div>
        {classes.length === 0 ? (
          <p className="text-sm text-center py-4" style={{ color: 'rgba(0, 108, 117, 0.7)' }}>
            Ingen klasser ennå
          </p>
        ) : (
          <div className="space-y-2">
            {classes.map((cls: any) => (
              <div
                key={cls._id}
                className="flex items-center justify-between p-3 rounded-lg border-2 transition-all hover:scale-[1.01]"
                style={{
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(232, 246, 246, 0.5))',
                  borderColor: 'rgba(232, 165, 255, 0.3)',
                  borderRadius: '12px',
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #E8A5FF, #C77DFF)' }}>
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-base" style={{ color: '#006C75' }}>{cls.name}</h4>
                    {cls.subject && (
                      <p className="text-xs" style={{ color: 'rgba(0, 108, 117, 0.7)' }}>{cls.subject}</p>
                    )}
                  </div>
                </div>
                <Badge className="text-white border-0 font-extrabold px-3 py-1 shadow-md" style={{ background: 'linear-gradient(135deg, #E8A5FF, #C77DFF)' }}>
                  {cls.grade}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Recent Announcements */}
      <Card className="p-4 border-2 shadow-xl" style={{ background: 'linear-gradient(135deg, rgba(232, 165, 255, 0.08), #E8F6F6, rgba(232, 165, 255, 0.08))', borderColor: 'rgba(232, 165, 255, 0.3)', borderRadius: '16px' }}>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="mb-0.5 flex items-center gap-2 font-extrabold text-lg" style={{ color: '#006C75' }}>
              <Award className="w-5 h-5" style={{ color: '#E8A5FF' }} />
              Mine Kunngjøringer
            </h3>
            <p className="text-xs font-medium" style={{ color: 'rgba(0, 108, 117, 0.7)' }}>Siste kunngjøringer du har opprettet</p>
          </div>
        </div>
        {announcements.length === 0 ? (
          <p className="text-sm text-center py-4" style={{ color: 'rgba(0, 108, 117, 0.7)' }}>
            Ingen kunngjøringer ennå
          </p>
        ) : (
          <div className="space-y-2">
            {announcements.slice(0, 5).map((announcement: any) => (
              <div
                key={announcement._id}
                className="p-3 rounded-lg border-2 transition-all hover:scale-[1.01]"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  borderColor: 'rgba(232, 165, 255, 0.3)',
                  borderRadius: '12px',
                }}
              >
                <h4 className="font-bold text-base mb-1" style={{ color: '#006C75' }}>{announcement.title}</h4>
                <p className="text-sm" style={{ color: 'rgba(0, 108, 117, 0.7)' }}>{announcement.content}</p>
                <p className="text-xs mt-2" style={{ color: 'rgba(0, 108, 117, 0.5)' }}>
                  {new Date(announcement.createdAt).toLocaleDateString('nb-NO')}
                </p>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}

