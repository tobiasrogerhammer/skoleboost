import React from 'react'
import { Card } from './ui/card'
import { Badge } from './ui/badge'
import { Camera, Palette, Music, TreePine, Gamepad2, Calendar, Users, Trophy } from 'lucide-react'

interface ParticipationEvent {
  id: string
  name: string
  type: 'event' | 'trip'
  date: string
  participated: boolean
  emoji: string
  colorTheme: string
}

const mockParticipationHistory: ParticipationEvent[] = [
  {
    id: '1',
    name: 'Høst Fotografikurs',
    type: 'event',
    date: '2 uker siden',
    participated: true,
    emoji: '📸',
    colorTheme: 'purple'
  },
  {
    id: '2',
    name: 'Vitenskapsmuseum Utflukt',
    type: 'trip',
    date: '1 måned siden',
    participated: true,
    emoji: '🔬',
    colorTheme: 'blue'
  },
  {
    id: '3',
    name: 'Kunstgalleri Åpning',
    type: 'event',
    date: '3 uker siden',
    participated: true,
    emoji: '🎨',
    colorTheme: 'pink'
  },
  {
    id: '4',
    name: 'Musikkfestival',
    type: 'event',
    date: '1 måned siden',
    participated: false,
    emoji: '🎵',
    colorTheme: 'orange'
  },
  {
    id: '5',
    name: 'Gaming Mesterskap',
    type: 'event',
    date: '2 måneder siden',
    participated: true,
    emoji: '🎮',
    colorTheme: 'blue'
  }
]

export function EventParticipation() {
  const participatedEvents = mockParticipationHistory.filter(event => event.participated)
  const totalEvents = mockParticipationHistory.length
  const participationRate = Math.round((participatedEvents.length / totalEvents) * 100)

  const getEventIcon = (event: ParticipationEvent) => {
    switch (event.colorTheme) {
      case 'purple': return Camera
      case 'pink': return Palette
      case 'orange': return Music
      case 'blue': return event.type === 'trip' ? TreePine : Gamepad2
      default: return Users
    }
  }

  const getEventStyles = (event: ParticipationEvent) => {
    switch (event.colorTheme) {
      case 'purple':
        return { borderLeft: '4px solid #E8A5FF', background: 'linear-gradient(to right, rgba(232, 165, 255, 0.2), rgba(199, 125, 255, 0.1))' }
      case 'pink':
        return { borderLeft: '4px solid #FF6B9D', background: 'linear-gradient(to right, rgba(255, 107, 157, 0.2), rgba(255, 142, 155, 0.1))' }
      case 'orange':
        return { borderLeft: '4px solid #FBBE9E', background: 'linear-gradient(to right, rgba(251, 190, 158, 0.2), rgba(255, 159, 102, 0.1))' }
      case 'blue':
        return { borderLeft: '4px solid #00A7B3', background: 'linear-gradient(to right, rgba(0, 167, 179, 0.2), rgba(0, 196, 212, 0.1))' }
      default:
        return { borderLeft: '4px solid #9ca3af', backgroundColor: '#f9fafb' }
    }
  }

  return (
    <Card className="p-5 border-2 shadow-xl" style={{ background: 'linear-gradient(135deg, rgba(0, 167, 179, 0.08), #E8F6F6, rgba(0, 167, 179, 0.08))', borderColor: 'rgba(0, 167, 179, 0.3)', borderRadius: '20px' }}>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="mb-1 flex items-center gap-2 font-extrabold text-xl" style={{ color: '#006C75' }}>
            <Calendar className="w-6 h-6" style={{ color: '#00A7B3' }} />
            Arrangementsdeltakelse
          </h3>
          <p className="text-xs font-medium" style={{ color: 'rgba(0, 108, 117, 0.7)' }}>Din sosiale aktivitet! 🎉</p>
        </div>
      </div>

      {/* Enhanced Participation Stats */}
      <div className="grid grid-cols-3 gap-3 mb-5 text-center">
        <div className="p-4 rounded-xl border-2 shadow-lg transition-all hover:scale-105" style={{ background: 'linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%)', borderColor: 'rgba(255, 255, 255, 0.3)', borderRadius: '16px', boxShadow: '0 8px 20px rgba(78, 205, 196, 0.3)' }}>
          <div className="text-2xl font-extrabold text-white drop-shadow-lg mb-1">{participatedEvents.length}</div>
          <div className="text-xs text-white font-semibold uppercase tracking-wide">Arrangementer Deltatt</div>
        </div>
        <div className="p-4 rounded-xl border-2 shadow-lg transition-all hover:scale-105" style={{ background: 'linear-gradient(135deg, #00A7B3 0%, #00C4D4 100%)', borderColor: 'rgba(255, 255, 255, 0.3)', borderRadius: '16px', boxShadow: '0 8px 20px rgba(0, 167, 179, 0.3)' }}>
          <div className="text-2xl font-extrabold text-white drop-shadow-lg mb-1">{participationRate}%</div>
          <div className="text-xs text-white font-semibold uppercase tracking-wide">Deltakelse</div>
        </div>
        <div className="p-4 rounded-xl border-2 shadow-lg transition-all hover:scale-105" style={{ background: 'linear-gradient(135deg, #E8A5FF 0%, #C77DFF 100%)', borderColor: 'rgba(255, 255, 255, 0.3)', borderRadius: '16px', boxShadow: '0 8px 20px rgba(232, 165, 255, 0.3)' }}>
          <div className="text-2xl font-extrabold text-white drop-shadow-lg mb-1">{totalEvents}</div>
          <div className="text-xs text-white font-semibold uppercase tracking-wide">Totalt Invitert</div>
        </div>
      </div>

      {/* Enhanced Recent Events */}
      <div>
        <h4 className="mb-4 flex items-center gap-2 text-base font-extrabold" style={{ color: '#006C75' }}>
          <Trophy className="w-5 h-5" style={{ color: '#00A7B3' }} />
          Nylige Arrangementer
        </h4>
        <div className="space-y-2">
          {mockParticipationHistory.slice(0, 5).map((event) => {
            const IconComponent = getEventIcon(event)
            return (
              <div
                key={event.id}
                className="p-4 rounded-xl transition-all duration-300 hover:scale-[1.02]"
                style={{ ...getEventStyles(event), opacity: !event.participated ? 0.7 : 1, borderRadius: '14px' }}
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{event.emoji}</span>
                    <div className="bg-white/30 p-1.5 rounded-lg backdrop-blur-sm">
                      <IconComponent className="w-5 h-5" style={{ color: '#00A7B3' }} />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h5 className="text-sm font-extrabold" style={{ color: event.participated ? '#006C75' : 'rgba(0, 108, 117, 0.6)' }}>{event.name}</h5>
                      <Badge 
                        className="text-xs font-bold px-2 py-0.5 shadow-sm"
                        style={event.participated 
                          ? { background: 'linear-gradient(135deg, #00A7B3, #00C4D4)', color: 'white', border: 'none' }
                          : { borderColor: 'rgba(0, 167, 179, 0.3)', color: '#006C75', backgroundColor: 'rgba(0, 167, 179, 0.1)' }
                        }
                      >
                        {event.type === 'event' ? '🎉 Arrangement' : '🚌 Utflukt'}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-semibold">
                      <span className="px-2 py-1 rounded-full" style={{ color: 'rgba(0, 108, 117, 0.8)', backgroundColor: 'rgba(255, 255, 255, 0.3)' }}>{event.date}</span>
                      <span className="font-extrabold px-2 py-1 rounded-full" style={{ 
                        color: event.participated ? '#00A7B3' : '#FBBE9E',
                        backgroundColor: event.participated ? 'rgba(0, 167, 179, 0.1)' : 'rgba(251, 190, 158, 0.1)'
                      }}>
                        {event.participated ? '✅ Deltatt' : '⏳ Gått glipp av'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Enhanced Participation Achievements */}
      <div className="mt-5 p-5 rounded-xl border-2 shadow-xl transition-all hover:scale-[1.02]" style={{ background: 'linear-gradient(135deg, #00A7B3 0%, #00C4D4 50%, #E8A5FF 100%)', borderColor: 'rgba(255, 255, 255, 0.3)', borderRadius: '16px', boxShadow: '0 8px 25px rgba(0, 167, 179, 0.3)' }}>
        <div className="flex items-center justify-between">
          <div>
            <h5 className="text-base font-extrabold text-white drop-shadow-lg mb-1">
              Sosial Sommerfugl 🦋
            </h5>
            <p className="text-xs text-white/95 font-semibold">
              Deltatt på {participatedEvents.length} arrangementer dette semesteret
            </p>
          </div>
          <div className="text-right bg-white/40 px-4 py-3 rounded-2xl backdrop-blur-md shadow-lg border border-white/30">
            <div className="text-2xl font-extrabold text-white drop-shadow-lg">{participatedEvents.length}/5</div>
            <div className="text-xs text-white/90 font-semibold uppercase tracking-wide">Mål</div>
            <div className="w-16 h-1.5 rounded-full mt-2" style={{ backgroundColor: 'rgba(255, 255, 255, 0.3)' }}>
              <div 
                className="h-full rounded-full transition-all"
                style={{ 
                  width: `${(participatedEvents.length / 5) * 100}%`, 
                  background: 'white',
                  boxShadow: '0 0 10px rgba(255, 255, 255, 0.5)'
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}