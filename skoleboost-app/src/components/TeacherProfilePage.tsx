import React from 'react'
import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { User, GraduationCap, Users, TrendingUp, Calendar, Award, BookOpen } from 'lucide-react'
import { Card } from './ui/card'
import { Badge } from './ui/badge'

// Mock data for demo
const mockClasses = [
  { _id: 'class1', name: 'Klasse 8A', grade: '8. trinn', subject: 'Norsk' },
  { _id: 'class2', name: 'Klasse 8C', grade: '8. trinn', subject: 'Norsk' },
  { _id: 'class3', name: 'Klasse 9B', grade: '9. trinn', subject: 'Norsk' },
  { _id: 'class4', name: 'Klasse 9C', grade: '9. trinn', subject: 'Norsk' },
]

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
  const teacherQuery = useQuery(api.teachers.getCurrentTeacher)
  const classesQuery = useQuery(api.teachers.getTeacherClasses)
  const todayAttendanceQuery = useQuery(api.teachers.getTodayAttendance)
  const announcementsQuery = useQuery(api.announcements.getAll)

  // Use mock data if queries return empty or undefined (for demo)
  const teacher = teacherQuery || { name: 'Kari Lærer', email: 'kari@skole.no', role: 'teacher' }
  const classes = (classesQuery && classesQuery.length > 0) ? classesQuery : mockClasses
  const todayAttendance = todayAttendanceQuery && todayAttendanceQuery.total > 0
    ? todayAttendanceQuery
    : { present: 24, late: 2, absent: 1, total: 27 }
  const announcements = (announcementsQuery && announcementsQuery.length > 0) ? announcementsQuery : mockAnnouncements

  const totalStudents = 27 // Mock total students across all classes

  const averageAbsence = todayAttendance.total > 0 
    ? ((todayAttendance.absent / todayAttendance.total) * 100).toFixed(1) 
    : '3.7'

  return (
    <div className="pb-20 px-4 pt-6 max-w-md mx-auto space-y-6">
      {/* Enhanced Profile Header */}
      <Card className="p-8 text-center border-2 shadow-2xl" style={{ background: 'linear-gradient(135deg, #E8A5FF 0%, #C77DFF 50%, #E8A5FF 100%)', borderColor: 'rgba(255, 255, 255, 0.3)', borderRadius: '24px', boxShadow: '0 10px 40px rgba(232, 165, 255, 0.3)' }}>
        <div className="relative mb-5">
          <div className="w-24 h-24 bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center mx-auto border-4 border-white/60 shadow-2xl transform hover:scale-105 transition-transform duration-300">
            <GraduationCap className="w-12 h-12 text-white" />
          </div>
          <div className="absolute -bottom-1 -right-1 bg-white/40 backdrop-blur-md rounded-full p-2 border-2 border-white/60 shadow-lg">
            <Award className="w-5 h-5 text-yellow-400 fill-yellow-400" />
          </div>
        </div>
        <h2 className="mb-2 text-white font-extrabold text-2xl drop-shadow-lg">{teacher.name}</h2>
        <p className="text-white/95 mb-4 font-semibold text-base">Lærer</p>
        <div className="flex justify-center gap-4 text-sm text-white/95 bg-white/30 px-5 py-2.5 rounded-full backdrop-blur-md w-fit mx-auto shadow-lg border border-white/30">
          <span className="font-semibold">E-post: {teacher.email}</span>
        </div>
      </Card>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-5 text-center border-2 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]" style={{ background: 'linear-gradient(135deg, #00A7B3 0%, #00C4D4 100%)', borderColor: 'rgba(255, 255, 255, 0.3)', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0, 167, 179, 0.3)' }}>
          <div className="bg-white/30 p-2 rounded-xl backdrop-blur-md w-fit mx-auto mb-3">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div className="text-4xl font-extrabold text-white mb-2 drop-shadow-lg">{classes.length}</div>
          <p className="text-sm text-white font-semibold tracking-wide uppercase">Klasser</p>
        </Card>
        <Card className="p-5 text-center border-2 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]" style={{ background: 'linear-gradient(135deg, #FBBE9E 0%, #FF9F66 100%)', borderColor: 'rgba(255, 255, 255, 0.3)', borderRadius: '20px', boxShadow: '0 10px 30px rgba(251, 190, 158, 0.3)' }}>
          <div className="bg-white/30 p-2 rounded-xl backdrop-blur-md w-fit mx-auto mb-3">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div className="text-4xl font-extrabold text-white mb-2 drop-shadow-lg">{todayAttendance.total}</div>
          <p className="text-sm text-white font-semibold tracking-wide uppercase">Elever</p>
        </Card>
      </div>

      {/* Today's Stats */}
      <Card className="p-5 border-2 shadow-xl" style={{ background: 'linear-gradient(135deg, rgba(0, 167, 179, 0.08), #E8F6F6, rgba(0, 167, 179, 0.08))', borderColor: 'rgba(0, 167, 179, 0.3)', borderRadius: '20px' }}>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="mb-1 flex items-center gap-2 font-extrabold text-xl" style={{ color: '#006C75' }}>
              <Calendar className="w-6 h-6" style={{ color: '#00A7B3' }} />
              Dagens Oppmøte
            </h3>
            <p className="text-xs font-medium" style={{ color: 'rgba(0, 108, 117, 0.7)' }}>Oversikt for i dag</p>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-center p-4 rounded-xl transition-all hover:scale-[1.02]" style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', boxShadow: '0 2px 8px rgba(0, 167, 179, 0.1)' }}>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-sm font-semibold" style={{ color: '#006C75' }}>Møtt</span>
            </div>
            <span className="font-extrabold text-xl" style={{ color: '#00A7B3' }}>{todayAttendance.present}</span>
          </div>
          <div className="flex justify-between items-center p-4 rounded-xl transition-all hover:scale-[1.02]" style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', boxShadow: '0 2px 8px rgba(0, 167, 179, 0.1)' }}>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-orange-500"></div>
              <span className="text-sm font-semibold" style={{ color: '#006C75' }}>Gyldig fravær</span>
            </div>
            <span className="font-extrabold text-xl" style={{ color: '#FF9F66' }}>{todayAttendance.late}</span>
          </div>
          <div className="flex justify-between items-center p-4 rounded-xl transition-all hover:scale-[1.02]" style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', boxShadow: '0 2px 8px rgba(0, 167, 179, 0.1)' }}>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-sm font-semibold" style={{ color: '#006C75' }}>Ugyldig fravær</span>
            </div>
            <span className="font-extrabold text-xl" style={{ color: '#FF6B9D' }}>{todayAttendance.absent}</span>
          </div>
          <div className="flex justify-between items-center p-4 rounded-xl transition-all hover:scale-[1.02]" style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', boxShadow: '0 2px 8px rgba(0, 167, 179, 0.1)' }}>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#00A7B3' }}></div>
              <span className="text-sm font-semibold" style={{ color: '#006C75' }}>Snitt fravær</span>
            </div>
            <span className="font-extrabold text-xl" style={{ color: '#00A7B3' }}>{averageAbsence}%</span>
          </div>
        </div>
      </Card>

      {/* My Classes */}
      <Card className="p-5 border-2 shadow-xl" style={{ background: 'linear-gradient(135deg, rgba(232, 165, 255, 0.08), rgba(232, 246, 246, 0.5), rgba(232, 165, 255, 0.08))', borderColor: 'rgba(232, 165, 255, 0.3)', borderRadius: '20px' }}>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="mb-1 flex items-center gap-2 font-extrabold text-xl" style={{ color: '#006C75' }}>
              <BookOpen className="w-6 h-6" style={{ color: '#E8A5FF' }} />
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
          <div className="space-y-3">
            {classes.map((cls: any) => (
              <div
                key={cls._id}
                className="flex items-center justify-between p-4 rounded-xl border-2 transition-all hover:scale-[1.02]"
                style={{
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(232, 246, 246, 0.5))',
                  borderColor: 'rgba(232, 165, 255, 0.3)',
                  borderRadius: '16px',
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
      <Card className="p-5 border-2 shadow-xl" style={{ background: 'linear-gradient(135deg, rgba(0, 167, 179, 0.08), #E8F6F6, rgba(0, 167, 179, 0.08))', borderColor: 'rgba(0, 167, 179, 0.3)', borderRadius: '20px' }}>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="mb-1 flex items-center gap-2 font-extrabold text-xl" style={{ color: '#006C75' }}>
              <Award className="w-6 h-6" style={{ color: '#00A7B3' }} />
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
          <div className="space-y-3">
            {announcements.slice(0, 5).map((announcement: any) => (
              <div
                key={announcement._id}
                className="p-4 rounded-xl border-2 transition-all hover:scale-[1.02]"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  borderColor: 'rgba(0, 167, 179, 0.3)',
                  borderRadius: '16px',
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

