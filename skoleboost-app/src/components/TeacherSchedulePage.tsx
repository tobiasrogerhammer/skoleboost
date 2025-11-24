import React, { useState, useMemo, useEffect } from 'react'
import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { Clock, MapPin, CheckCircle, Users, Calendar } from 'lucide-react'
import { Card } from './ui/card'
import { Button } from './ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog'
import { useMutation } from 'convex/react'
import { toast } from 'sonner'
import { Logo } from './Logo'

// Mock data for demo
const mockTeacherSchedule = [
  // Mandag
  { _id: 's1', subject: 'Norsk', teacher: 'Lærer', time: '08:00 - 09:00', room: 'Rom 201', day: 'Mandag', type: 'class' },
  { _id: 's2', subject: 'Samfunnsfag', teacher: 'Lærer', time: '09:15 - 10:15', room: 'Rom 205', day: 'Mandag', type: 'class' },
  { _id: 's3', subject: 'Norsk', teacher: 'Lærer', time: '10:45 - 11:30', room: 'Rom 207', day: 'Mandag', type: 'class' },
  { _id: 's4', subject: 'Norsk', teacher: 'Lærer', time: '12:15 - 13:00', room: 'Rom 208', day: 'Mandag', type: 'class' },
  // Tirsdag
  { _id: 's5', subject: 'Norsk', teacher: 'Lærer', time: '09:15 - 10:15', room: 'Rom 201', day: 'Tirsdag', type: 'class' },
  { _id: 's6', subject: 'Samfunnsfag', teacher: 'Lærer', time: '11:30 - 12:15', room: 'Rom 205', day: 'Tirsdag', type: 'class' },
  { _id: 's7', subject: 'Norsk', teacher: 'Lærer', time: '13:45 - 14:45', room: 'Rom 201', day: 'Tirsdag', type: 'class' },
  // Onsdag
  { _id: 's8', subject: 'Norsk', teacher: 'Lærer', time: '08:00 - 09:00', room: 'Rom 201', day: 'Onsdag', type: 'class' },
  { _id: 's9', subject: 'Samfunnsfag', teacher: 'Lærer', time: '10:00 - 11:00', room: 'Rom 205', day: 'Onsdag', type: 'class' },
  // Torsdag
  { _id: 's10', subject: 'Norsk', teacher: 'Lærer', time: '09:15 - 10:15', room: 'Rom 201', day: 'Torsdag', type: 'class' },
  { _id: 's11', subject: 'Samfunnsfag', teacher: 'Lærer', time: '13:00 - 14:00', room: 'Rom 205', day: 'Torsdag', type: 'class' },
  // Fredag
  { _id: 's12', subject: 'Norsk', teacher: 'Lærer', time: '08:00 - 09:00', room: 'Rom 201', day: 'Fredag', type: 'class' },
  { _id: 's13', subject: 'Samfunnsfag', teacher: 'Lærer', time: '11:00 - 12:00', room: 'Rom 205', day: 'Fredag', type: 'class' },
]

const mockClasses = [
  { _id: 'class1', name: 'Klasse 8A', grade: '8. trinn', subject: 'Norsk' },
  { _id: 'class5', name: 'Klasse 8A', grade: '8. trinn', subject: 'Samfunnsfag' },
  { _id: 'class6', name: 'Klasse 9B', grade: '9. trinn', subject: 'Samfunnsfag' },
  { _id: 'class2', name: 'Klasse 8C', grade: '8. trinn', subject: 'Norsk' },
  { _id: 'class3', name: 'Klasse 9B', grade: '9. trinn', subject: 'Norsk' },
  { _id: 'class4', name: 'Klasse 9C', grade: '9. trinn', subject: 'Norsk' },
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

export function TeacherSchedulePage() {
  const [selectedDay, setSelectedDay] = useState<string>(() => {
    const days = ['Søndag', 'Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag']
    return days[new Date().getDay()]
  })
  const [selectedScheduleItem, setSelectedScheduleItem] = useState<any | null>(null)

  const scheduleDataQuery = useQuery(api.teachers.getTeacherSchedule, {})
  const classesQuery = useQuery(api.teachers.getTeacherClasses, {})

  // Check if we're using mock data
  const usingMockData = !classesQuery || classesQuery.length === 0

  // Use mock data if queries return empty or undefined (for demo)
  const scheduleData = (scheduleDataQuery && scheduleDataQuery.length > 0) ? scheduleDataQuery : mockTeacherSchedule
  const classes = (classesQuery && classesQuery.length > 0) ? classesQuery : mockClasses

  const daysOfWeek = ['Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag', 'Søndag']

  // Filter schedule items by selected day
  const selectedDayItems = useMemo(() => {
    const items = scheduleData.filter((item: any) => item.day === selectedDay)
    // Sort by time
    return items.sort((a: any, b: any) => {
      const timeA = a.time.match(/(\d{2}):(\d{2})/)?.[0] || '00:00'
      const timeB = b.time.match(/(\d{2}):(\d{2})/)?.[0] || '00:00'
      return timeA.localeCompare(timeB)
    })
  }, [scheduleData, selectedDay])

  const getDayName = () => {
    const days = ['Søndag', 'Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag']
    return days[new Date().getDay()]
  }
  const currentDayName = getDayName()

  return (
    <div className="pb-20 px-4 max-w-md mx-auto space-y-4 relative" style={{ paddingTop: '2.5rem' }}>
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

      {/* Day Selector */}
      <Card className="p-4 border-2 shadow-lg" style={{ 
        marginTop: '2.5rem',
        background: 'linear-gradient(135deg, #E8A5FF, #C77DFF, #E8A5FF)', 
        borderColor: 'rgba(232, 165, 255, 0.6)', 
        borderRadius: '16px',
        boxShadow: '0 4px 12px rgba(232, 165, 255, 0.3)'
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
                    color: '#C77DFF',
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
                    borderColor: 'rgba(232, 165, 255, 0.3)',
                    boxShadow: '0 8px 24px rgba(232, 165, 255, 0.25)'
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
                          color: isSelected ? '#C77DFF' : (isToday ? '#C77DFF' : '#006C75'),
                          backgroundColor: isSelected ? 'rgba(232, 165, 255, 0.15)' : 'white',
                          fontWeight: isSelected ? '700' : (isToday ? '600' : '500'),
                          borderLeft: isSelected ? '3px solid #C77DFF' : '3px solid transparent',
                          borderBottom: index < daysOfWeek.length - 1 ? '1px solid rgba(232, 165, 255, 0.3)' : 'none',
                          padding: '12px 16px'
                        }}
                      >
                        {day}
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </Card>

      {/* Schedule Items */}
      <div>
        <h2 className="font-bold text-lg mb-3" style={{ color: '#006C75' }}>{selectedDay}s Timeplan</h2>
        {selectedDayItems.length === 0 ? (
          <Card className="p-6 text-center border-2" style={{ borderColor: 'rgba(232, 165, 255, 0.3)', borderRadius: '12px' }}>
            <p className="text-base font-medium" style={{ color: 'rgba(0, 108, 117, 0.7)' }}>Ingen timer på {selectedDay}</p>
            <p className="text-sm mt-2" style={{ color: 'rgba(0, 108, 117, 0.5)' }}>Nyt fridagen! 🎉</p>
          </Card>
        ) : (
          <div className="space-y-2">
            {selectedDayItems.map((item: any) => {
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

              // Determine if this is Samfunnsfag (orange) or other subject (purple)
              const isSamfunnsfag = item.subject === 'Samfunnsfag'
              
              // Orange colors for Samfunnsfag
              const cardBg = isSamfunnsfag 
                ? 'linear-gradient(to bottom right, rgba(255, 159, 102, 0.1), rgba(255, 245, 240, 0.5))'
                : 'linear-gradient(to bottom right, rgba(232, 165, 255, 0.1), rgba(232, 246, 246, 0.5))'
              const cardBorder = isSamfunnsfag
                ? 'rgba(255, 159, 102, 0.3)'
                : 'rgba(232, 165, 255, 0.3)'
              const badgeBg = isSamfunnsfag
                ? 'rgba(255, 159, 102, 0.2)'
                : 'rgba(232, 165, 255, 0.2)'
              const badgeColor = isSamfunnsfag
                ? '#FF9F66'
                : '#E8A5FF'
              const buttonBg = isSamfunnsfag
                ? '#FF9F66'
                : '#C77DFF'

              return (
                <Card
                  key={item._id}
                  className="p-3 border-2"
                  style={{
                    background: cardBg,
                    borderColor: cardBorder,
                    borderRadius: '12px',
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-bold text-sm" style={{ color: '#006C75' }}>
                          {item.subject}
                        </h4>
                        {selectedDay === currentDayName && (
                          <span className="text-xs font-medium px-2 py-1 rounded-full" style={{ backgroundColor: badgeBg, color: badgeColor }}>
                            {timeText}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs" style={{ color: 'rgba(0, 108, 117, 0.7)' }}>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{item.time}</span>
                        </div>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          <span>{item.room}</span>
                        </div>
                      </div>
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
                </Card>
              )
            })}
          </div>
        )}
      </div>

      {/* Attendance Dialog */}
      {selectedScheduleItem && (
        <AttendanceDialog
          scheduleItem={selectedScheduleItem}
          classes={classes}
          usingMockData={usingMockData}
          selectedDay={selectedDay}
          onClose={() => setSelectedScheduleItem(null)}
        />
      )}
    </div>
  )
}

// Attendance Dialog Component
function AttendanceDialog({
  scheduleItem,
  classes,
  usingMockData,
  onClose,
  selectedDay,
}: {
  scheduleItem: any
  classes: any[]
  usingMockData: boolean
  onClose: () => void
  selectedDay: string
}) {
  const markAttendance = useMutation(api.teachers.markAttendance)
  
  // Find class by subject/teacher name (simplified - in real app use proper classId)
  const classObj = classes.find((c: any) => c.name.includes(scheduleItem.subject?.substring(0, 3) || '')) || classes[0]
  
  // Convert day name to date string (format: "DD.MM.YYYY")
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

  const attendanceDate = getDateForDay(selectedDay)
  
  // Only query if we have a real class ID (not mock)
  const isRealClassId = classObj && !classObj._id.startsWith('class')
  const classStudentsQuery = useQuery(
    api.teachers.getClassStudents,
    !usingMockData && isRealClassId && classObj ? { classId: classObj._id } : "skip"
  )
  const classStudents = (!usingMockData && classStudentsQuery && classStudentsQuery.length > 0) 
    ? classStudentsQuery 
    : mockStudents

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

  return (
    <Dialog open onOpenChange={onClose} key={`${scheduleItem._id}-${attendanceDate}`}>
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
            {classStudents.length === 0 ? (
              <p className="text-sm text-center py-4" style={{ color: 'rgba(0, 108, 117, 0.7)' }}>
                Ingen elever i denne klassen
              </p>
            ) : (
              classStudents.map((student: any) => (
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
              ))
            )}
          </div>
          <Button onClick={onClose} className="w-full" style={{ backgroundColor: '#00A7B3', color: 'white' }}>
            Last opp
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

