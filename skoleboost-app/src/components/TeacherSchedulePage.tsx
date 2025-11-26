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
        className="max-h-[90vh] overflow-y-auto"
        style={{ maxWidth: '95vw', width: '95vw', overflowX: 'hidden' }}
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
          {classStudents.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm font-medium" style={{ color: 'rgba(0, 108, 117, 0.7)' }}>
                Ingen elever i denne klassen
              </p>
            </div>
          ) : (
            classStudents.map((student: any) => {
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
            })
          )}
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

