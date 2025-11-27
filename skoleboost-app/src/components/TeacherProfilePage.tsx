import React, { useState } from 'react'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { User, GraduationCap, Users, TrendingUp, Calendar, Award, BookOpen, Clock, CheckCircle2, Bell, Sparkles, Mail, Phone, ChevronRight, BarChart3, Edit2, Trash2 } from 'lucide-react'
import { Card } from './ui/card'
import { Badge } from './ui/badge'
import { Logo } from './Logo'
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Label } from './ui/label'
import { toast } from 'sonner'

// Mock data for demo
const mockClasses = [
  { _id: 'class1', name: 'Klasse 8A', grade: '8. trinn', subject: 'Norsk' },
  { _id: 'class2', name: 'Klasse 8C', grade: '8. trinn', subject: 'Norsk' },
  { _id: 'class3', name: 'Klasse 9B', grade: '9. trinn', subject: 'Norsk' },
  { _id: 'class4', name: 'Klasse 9C', grade: '9. trinn', subject: 'Norsk' },
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
  const [selectedClass, setSelectedClass] = useState<string | null>(null)
  const [showClassDialog, setShowClassDialog] = useState(false)
  const [editingAnnouncement, setEditingAnnouncement] = useState<any | null>(null)

  const teacherQuery = useQuery(api.teachers.getCurrentTeacher, {})
  const classesQuery = useQuery(api.teachers.getTeacherClasses, {})
  const todayAttendanceQuery = useQuery(api.teachers.getTodayAttendance, {})
  const announcementsQuery = useQuery(api.announcements.getAll, {})
  const eventsQuery = useQuery(api.events.getAll, {})

  // Check if we're using mock data
  const usingMockData = !classesQuery || classesQuery.length === 0

  // Use mock data if queries return empty or undefined (for demo)
  const teacher = teacherQuery || { name: 'Kari Lærer', email: 'kari@skole.no', role: 'teacher' }
  const classes = (classesQuery && classesQuery.length > 0) ? classesQuery : mockClasses
  const todayAttendance = todayAttendanceQuery && todayAttendanceQuery.total > 0
    ? todayAttendanceQuery
    : { present: 24, late: 2, absent: 1, total: 27 }
  const announcements = (announcementsQuery && announcementsQuery.length > 0) ? announcementsQuery : mockAnnouncements
  const events = (eventsQuery && eventsQuery.length > 0) ? eventsQuery : []

  // Get selected class object
  const selectedClassObj = classes.find((c: any) => c._id === selectedClass) || null

  // Only call query with real IDs if we have real data
  const isRealClassId = selectedClass && !selectedClass.startsWith('class')
  const classStudentsQuery = useQuery(
    api.teachers.getClassStudents,
    !usingMockData && isRealClassId ? { classId: selectedClass as any } : "skip"
  )

  const classStudents = (!usingMockData && classStudentsQuery && classStudentsQuery.length > 0) 
    ? classStudentsQuery 
    : mockStudents

  const totalStudents = 27 // Mock total students across all classes

  const averageAbsence = todayAttendance.total > 0 
    ? ((todayAttendance.absent / todayAttendance.total) * 100).toFixed(1) 
    : '3.7'
  
  // Calculate week's attendance percentage (mock data - in real app, this would come from API)
  const weekAttendanceRate = 89 // Mock weekly attendance rate
  
  // Mock monthly attendance data (last 4 weeks) - with more variation
  const monthlyAttendanceData = [
    { week: 'Uke 1', rate: 65 },
    { week: 'Uke 2', rate: 100 },
    { week: 'Uke 3', rate: 55 },
    { week: 'Uke 4', rate: 90 },
  ]
  
  // Count upcoming events (events in the future)
  const upcomingEventsCount = events.filter((event: any) => {
    // Filter events that are in the future (simplified - in real app would check dates)
    return true // For now, count all events as upcoming
  }).length

  return (
    <div className="pb-20 px-4 max-w-md mx-auto space-y-6 relative" style={{ paddingTop: '2.5rem' }}>
      {/* Logo and Brand Name - Top Left */}
      <div className="absolute top-4 left-4 z-50 flex items-center gap-2">
        <Logo size="xs" />
        <h1 className="font-bold text-base" style={{ color: '#006C75' }}>Skoleboost</h1>
      </div>
      {/* Enhanced Profile Header */}
      <Card className="p-4 border-2 shadow-xl mt-8" style={{ background: 'linear-gradient(135deg, #E8A5FF 0%, #C77DFF 50%, #E8A5FF 100%)', borderColor: 'rgba(255, 255, 255, 0.3)', borderRadius: '16px', boxShadow: '0 10px 40px rgba(232, 165, 255, 0.3)' }}>
        <div className="flex flex-col gap-3">
          {/* Top Row: Avatar and Name */}
          <div className="flex items-center gap-3">
            <Avatar className="w-16 h-16 border-3 border-white/60 shadow-xl flex-shrink-0">
              <AvatarImage src={teacherQuery?.imageUrl} alt={teacher.name} />
              <AvatarFallback className="bg-white/40 backdrop-blur-md text-white text-xl font-extrabold" style={{ backgroundColor: 'rgba(255, 255, 255, 0.3)' }}>
                {teacher.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h2 className="text-white font-extrabold text-xl drop-shadow-lg truncate mb-1">{teacher.name}</h2>
              <div className="flex items-center gap-2">
                <Badge className="bg-white/30 text-white border-white/50 font-semibold px-2 py-0.5">
                  <GraduationCap className="w-3 h-3 mr-1" />
                  Lærer
                </Badge>
              </div>
            </div>
          </div>
          
          {/* Bottom Row: Email and Additional Info */}
          <div className="flex items-center gap-2 pt-2 border-t border-white/20">
            <Mail className="w-4 h-4 text-white flex-shrink-0" />
            <span className="text-white text-sm font-medium truncate flex-1">{teacher.email || 'Ingen e-post registrert'}</span>
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
          className="px-4 py-3 text-center shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] flex flex-col justify-center gap-2" 
          style={{ 
            background: 'linear-gradient(135deg, #FBBE9E 0%, #FF9F66 50%, #FFB84D 100%)', 
            border: '3px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 10px 30px rgba(251, 190, 158, 0.3)',
            minHeight: '160px',
            overflow: 'visible',
            position: 'relative',
            zIndex: 1
          }}
        >
          <p className="text-xs text-white font-semibold tracking-wide uppercase mb-2" style={{ zIndex: 2, position: 'relative' }}>Månedens Oppmøte</p>
          <div className="flex items-end mt-8 justify-center gap-2" style={{ height: '80px', paddingBottom: '10px', overflow: 'visible', position: 'relative', zIndex: 2, alignItems: 'flex-end' }}>
            {monthlyAttendanceData.map((data, index) => {
              const maxHeight = 60
              const height = Math.max((data.rate / 100) * maxHeight, 4)
              return (
                <div key={index} className="flex flex-col items-center justify-end gap-1" style={{ width: '20%', maxWidth: '24px', position: 'relative', zIndex: 3, alignSelf: 'flex-end' }}>
                  <div 
                    className="rounded-t transition-all hover:opacity-80"
                    style={{ 
                      width: '100%',
                      height: `${height}px`,
                      background: 'linear-gradient(to top, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.7))',
                      minHeight: '4px',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                      position: 'relative',
                      zIndex: 4,
                      flexShrink: 0
                    }}
                    title={`${data.week}: ${data.rate}%`}
                  />
                  <span className="text-white font-bold opacity-90 whitespace-nowrap" style={{ position: 'relative', zIndex: 3, marginTop: '2px', fontSize: '11px' }}>{data.rate}%</span>
                </div>
              )
            })}
          </div>
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
      <Card className="p-4 border-2 shadow-xl" style={{ background: 'linear-gradient(135deg, rgba(255, 159, 102, 0.08), rgba(255, 245, 240, 0.5), rgba(255, 159, 102, 0.08))', borderColor: 'rgba(255, 159, 102, 0.3)', borderRadius: '16px' }}>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="mb-0.5 flex items-center gap-2 font-extrabold text-lg" style={{ color: '#006C75' }}>
              <BookOpen className="w-5 h-5" style={{ color: '#FF9F66' }} />
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
                className="flex items-center justify-between p-3 rounded-lg border-2 transition-all hover:scale-[1.01] cursor-pointer"
                style={{
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 245, 240, 0.5))',
                  borderColor: 'rgba(255, 159, 102, 0.3)',
                  borderRadius: '12px',
                }}
                onClick={() => {
                  setSelectedClass(cls._id)
                  setShowClassDialog(true)
                }}
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #FF9F66, #FBBE9E)' }}>
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-base" style={{ color: '#006C75' }}>{cls.name}</h4>
                    {cls.subject && (
                      <p className="text-xs" style={{ color: 'rgba(0, 108, 117, 0.7)' }}>{cls.subject}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="text-white border-0 font-extrabold px-3 py-1 shadow-md" style={{ background: 'linear-gradient(135deg, #FF9F66, #FBBE9E)' }}>
                    {cls.grade}
                  </Badge>
                  <ChevronRight className="w-4 h-4" style={{ color: 'rgba(255, 159, 102, 0.6)' }} />
                </div>
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
                <div className="flex flex-col">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-base mb-1" style={{ color: '#006C75' }}>{announcement.title}</h4>
                    <p className="text-sm mb-2" style={{ color: 'rgba(0, 108, 117, 0.7)' }}>{announcement.content}</p>
                    <p className="text-xs mb-2" style={{ color: 'rgba(0, 108, 117, 0.5)' }}>
                      {new Date(announcement.createdAt).toLocaleDateString('nb-NO')}
                    </p>
                  </div>
                  <div className="flex gap-1 justify-end flex-shrink-0">
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
            ))}
          </div>
        )}
        {editingAnnouncement && (
          <EditAnnouncementDialog 
            announcement={editingAnnouncement}
            onClose={() => setEditingAnnouncement(null)} 
          />
        )}
      </Card>

      {/* Class Students Dialog */}
      {showClassDialog && selectedClassObj && (
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
      <DialogContent className="max-w-[90vw] md:max-w-[500px] lg:max-w-[600px] max-h-[90vh] overflow-y-auto" style={{ borderRadius: '20px', overflowX: 'hidden' }}>
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

