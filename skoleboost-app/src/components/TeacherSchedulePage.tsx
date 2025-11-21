import React, { useState, useMemo } from 'react'
import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { Clock, MapPin, CheckCircle, Users, Calendar } from 'lucide-react'
import { Card } from './ui/card'
import { Button } from './ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog'
import { useMutation } from 'convex/react'
import { toast } from 'sonner'

// Mock data for demo
const mockTeacherSchedule = [
  // Mandag
  { _id: 's1', subject: 'Norsk', teacher: 'Lærer', time: '08:00 - 09:00', room: 'Rom 201', day: 'Mandag', type: 'class' },
  { _id: 's2', subject: 'Norsk', teacher: 'Lærer', time: '10:45 - 11:30', room: 'Rom 207', day: 'Mandag', type: 'class' },
  { _id: 's3', subject: 'Norsk', teacher: 'Lærer', time: '12:15 - 13:00', room: 'Rom 208', day: 'Mandag', type: 'class' },
  // Tirsdag
  { _id: 's4', subject: 'Norsk', teacher: 'Lærer', time: '09:15 - 10:15', room: 'Rom 201', day: 'Tirsdag', type: 'class' },
  { _id: 's5', subject: 'Norsk', teacher: 'Lærer', time: '13:45 - 14:45', room: 'Rom 201', day: 'Tirsdag', type: 'class' },
  // Onsdag
  { _id: 's6', subject: 'Norsk', teacher: 'Lærer', time: '08:00 - 09:00', room: 'Rom 201', day: 'Onsdag', type: 'class' },
  // Torsdag
  { _id: 's7', subject: 'Norsk', teacher: 'Lærer', time: '09:15 - 10:15', room: 'Rom 201', day: 'Torsdag', type: 'class' },
  // Fredag
  { _id: 's8', subject: 'Norsk', teacher: 'Lærer', time: '08:00 - 09:00', room: 'Rom 201', day: 'Fredag', type: 'class' },
]

const mockClasses = [
  { _id: 'class1', name: 'Klasse 8A', grade: '8. trinn', subject: 'Norsk' },
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
    <div className="pb-20 px-4 pt-16 sm:pt-20 max-w-md mx-auto space-y-4">
      {/* Header */}
      <div className="text-center mb-4 mt-6">
        <h1 className="mb-1 font-bold text-2xl" style={{ color: '#006C75' }}>Min Timeplan</h1>
        <p className="text-sm font-medium" style={{ color: 'rgba(0, 108, 117, 0.8)' }}>Oversikt over alle timer 📚</p>
      </div>

      {/* Day Selector */}
      <Card className="p-3 border-2" style={{ borderColor: 'rgba(232, 165, 255, 0.3)', borderRadius: '12px' }}>
        <div className="flex items-center gap-3">
          <label className="text-sm font-semibold" style={{ color: '#006C75' }}>Velg dag:</label>
          <Select value={selectedDay} onValueChange={setSelectedDay}>
            <SelectTrigger className="flex-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {daysOfWeek.map((day) => (
                <SelectItem key={day} value={day}>
                  {day}
                  {day === currentDayName && ' (I dag)'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-bold text-sm" style={{ color: '#006C75' }}>
                          {item.subject}
                        </h4>
                        {selectedDay === currentDayName && (
                          <span className="text-xs font-medium px-2 py-1 rounded-full" style={{ backgroundColor: 'rgba(232, 165, 255, 0.2)', color: '#E8A5FF' }}>
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
                    {selectedDay === currentDayName && (
                      <Button
                        size="sm"
                        onClick={() => setSelectedScheduleItem(item)}
                        className="text-xs"
                        style={{ backgroundColor: '#E8A5FF', color: 'white' }}
                      >
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Ta Oppmøte
                      </Button>
                    )}
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
}: {
  scheduleItem: any
  classes: any[]
  usingMockData: boolean
  onClose: () => void
}) {
  const [attendance, setAttendance] = useState<Record<string, 'present' | 'late' | 'absent'>>({})
  const markAttendance = useMutation(api.teachers.markAttendance)
  
  // Find class by subject/teacher name (simplified - in real app use proper classId)
  const classObj = classes.find((c: any) => c.name.includes(scheduleItem.subject?.substring(0, 3) || '')) || classes[0]
  
  // Only query if we have a real class ID (not mock)
  const isRealClassId = classObj && !classObj._id.startsWith('class')
  const classStudentsQuery = useQuery(
    api.teachers.getClassStudents,
    !usingMockData && isRealClassId && classObj ? { classId: classObj._id } : "skip"
  )
  const classStudents = (!usingMockData && classStudentsQuery && classStudentsQuery.length > 0) 
    ? classStudentsQuery 
    : mockStudents

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
            {classStudents.length === 0 ? (
              <p className="text-sm text-center py-4" style={{ color: 'rgba(0, 108, 117, 0.7)' }}>
                Ingen elever i denne klassen
              </p>
            ) : (
              classStudents.map((student: any) => (
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
              ))
            )}
          </div>
          <Button onClick={onClose} className="w-full" style={{ backgroundColor: '#00A7B3', color: 'white' }}>
            Lukk
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

