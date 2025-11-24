import React from 'react'
import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { User, Award, TrendingUp, Calendar, Target, Star, Coins, Map, CheckCircle2, Lock, Mail, GraduationCap } from 'lucide-react'
import { Card } from './ui/card'
import { Badge } from './ui/badge'
import { Progress } from './ui/progress'
import { Button } from './ui/button'
import { EventParticipation } from './EventParticipation'
import { Logo } from './Logo'
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar'

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  earned: boolean
  progress?: number
}

interface ProfilePageProps {
  currentPoints: number
  totalEarned: number
  onNavigateToJourneyMap?: () => void
}

const mockAchievements: Achievement[] = [
  {
    id: '1',
    title: 'Perfekt Uke',
    description: 'Deltatt på alle timer i en hel uke',
    icon: '🏆',
    earned: true
  },
  {
    id: '2',
    title: 'Morgenfugl',
    description: 'Ankom tidlig til 10 timer på rad',
    icon: '🌅',
    earned: true
  },
  {
    id: '3',
    title: 'Poengmester',
    description: 'Tjent 500 totale poeng',
    icon: '💎',
    earned: false,
    progress: 78
  },
  {
    id: '4',
    title: 'Sosial Sommerfugl',
    description: 'Deltatt på 5 skolearrangementer',
    icon: '🦋',
    earned: false,
    progress: 60
  },
  {
    id: '5',
    title: 'Konsistent Lærer',
    description: 'Opprettholdt 90% oppmøte i en måned',
    icon: '📚',
    earned: true
  },
  {
    id: '6',
    title: 'Hjelpende Hånd',
    description: 'Hjalp klassekamerater 20 ganger',
    icon: '🤝',
    earned: false,
    progress: 45
  }
]

const getStudentInfo = (user: any) => ({
  name: user?.name || 'Alex Johnson',
  grade: user?.grade || '10th Grade',
  studentId: user?.studentId || 'ST2024001',
  joinDate: user?.joinDate || 'September 2024',
  attendanceRate: user?.attendanceRate || 85,
  rank: user?.rank || 12,
  totalStudents: user?.totalStudents || 250
})

export function ProfilePage({ currentPoints, totalEarned, onNavigateToJourneyMap }: ProfilePageProps) {
  const currentUser = useQuery(api.users.getCurrentUser, {})
  const achievements = useQuery(api.users.getAchievements, {}) || mockAchievements
  const earnedAchievements = achievements.filter((achievement: any) => achievement.earned)
  const studentInfo = getStudentInfo(currentUser)
  
  return (
    <div className="pb-20 px-4 max-w-md mx-auto space-y-2 relative" style={{ paddingTop: '2.5rem' }}>
      {/* Logo and Brand Name - Top Left */}
      <div className="absolute top-4 left-4 z-50 flex items-center gap-2">
        <Logo size="xs" />
        <h1 className="font-bold text-base" style={{ color: '#006C75' }}>Skoleboost</h1>
      </div>
      {/* Enhanced Profile Header */}
      <Card className="p-4 border-2 shadow-xl mt-8" style={{ background: 'linear-gradient(135deg, #00A7B3 0%, #00C4D4 50%, #4ECDC4 100%)', borderColor: 'rgba(255, 255, 255, 0.3)', borderRadius: '16px', boxShadow: '0 10px 40px rgba(0, 167, 179, 0.3)' }}>
        <div className="flex flex-col gap-3">
          {/* Top Row: Avatar and Name */}
          <div className="flex items-center gap-3">
            <Avatar className="w-16 h-16 border-3 border-white/60 shadow-xl flex-shrink-0">
              <AvatarImage src={currentUser?.imageUrl} alt={studentInfo.name} />
              <AvatarFallback className="bg-white/40 backdrop-blur-md text-white text-xl font-extrabold" style={{ backgroundColor: 'rgba(255, 255, 255, 0.3)' }}>
                {studentInfo.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h2 className="text-white font-extrabold text-xl drop-shadow-lg truncate mb-1">{studentInfo.name}</h2>
              <div className="flex items-center gap-2">
                {currentUser?.role === 'student' ? (
                  <Badge className="bg-white/30 text-white border-white/50 font-semibold px-2 py-0.5">
                    <User className="w-3 h-3 mr-1" />
                    Elev
                  </Badge>
                ) : (
                  <Badge className="bg-white/30 text-white border-white/50 font-semibold px-2 py-0.5">
                    <GraduationCap className="w-3 h-3 mr-1" />
                    Lærer
                  </Badge>
                )}
                {studentInfo.grade && (
                  <>
                    <span className="text-white">•</span>
                    <span className="text-white text-sm font-semibold truncate">{studentInfo.grade}</span>
                  </>
                )}
              </div>
            </div>
          </div>
          
          {/* Bottom Row: Email and Additional Info */}
          <div className="flex items-center gap-2 pt-2 border-t border-white/20">
            <Mail className="w-4 h-4 text-white flex-shrink-0" />
            <span className="text-white text-sm font-medium truncate flex-1">{currentUser?.email || 'Ingen e-post registrert'}</span>
          </div>
        </div>
      </Card>

      {/* Enhanced Stats Overview */}
      <div className="grid grid-cols-2 gap-3">
      <Card 
          className="px-4 py-1 text-center shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] flex flex-col justify-center gap-2" 
          style={{ 
            background: 'linear-gradient(135deg, #00A7B3 0%, #00C4D4 50%, #4ECDC4 100%)', 
            border: '3px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 10px 30px rgba(0, 167, 179, 0.3)'
          }}
        >
          <div className="flex items-center justify-center">
            <Coins className="w-10 h-10 text-white drop-shadow-lg" />
          </div>
          <span className="font-extrabold text-white block drop-shadow-lg" style={{ fontSize: '2rem', lineHeight: '1', textShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>{currentPoints}</span>
          <p className="text-sm text-white font-semibold tracking-wide uppercase">Nåværende Poeng</p>
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
            <TrendingUp className="w-10 h-10 text-white drop-shadow-lg" />
          </div>
          <span className="font-extrabold text-white block drop-shadow-lg" style={{ fontSize: '2rem', lineHeight: '1', textShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>{studentInfo.attendanceRate}%</span>
          <p className="text-xs text-white font-semibold tracking-wide uppercase">Oppmøteprosent</p>
        </Card>
      </div>

      {/* Enhanced Detailed Stats */}
      <Card className="p-4 border-2 shadow-xl" style={{ background: 'linear-gradient(135deg, rgba(0, 167, 179, 0.08), #E8F6F6, rgba(0, 167, 179, 0.08))', borderColor: 'rgba(0, 167, 179, 0.3)', borderRadius: '16px' }}>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="mb-0.5 flex items-center gap-2 font-extrabold text-lg" style={{ color: '#006C75' }}>
              <TrendingUp className="w-5 h-5" style={{ color: '#00A7B3' }} />
              Akademisk Statistikk
        </h3>
            <p className="text-xs font-medium" style={{ color: 'rgba(0, 108, 117, 0.7)' }}>Din fantastiske fremgang!</p>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center p-3 rounded-lg transition-all hover:scale-[1.01]" style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', boxShadow: '0 2px 8px rgba(0, 167, 179, 0.1)' }}>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#00A7B3' }}></div>
              <span className="text-sm font-semibold" style={{ color: '#006C75' }}>Totale Poeng Tjent</span>
            </div>
            <span className="font-extrabold text-lg" style={{ color: '#00A7B3' }}>{totalEarned}</span>
          </div>
          <div className="flex justify-between items-center p-3 rounded-lg transition-all hover:scale-[1.01]" style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', boxShadow: '0 2px 8px rgba(0, 167, 179, 0.1)' }}>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#00A7B3' }}></div>
              <span className="text-sm font-semibold" style={{ color: '#006C75' }}>Månedens Timer</span>
            </div>
            <div className="text-right">
              <span className="font-extrabold text-lg" style={{ color: '#00A7B3' }}>12/30</span>
              <div className="w-16 h-1 rounded-full mt-0.5" style={{ backgroundColor: 'rgba(0, 167, 179, 0.2)' }}>
                <div className="h-full rounded-full transition-all" style={{ width: `${(12 / 30) * 100}%`, background: 'linear-gradient(to right, #00A7B3, #00C4D4)' }}></div>
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center p-3 rounded-lg transition-all hover:scale-[1.01]" style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', boxShadow: '0 2px 8px rgba(0, 167, 179, 0.1)' }}>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#00A7B3' }}></div>
              <span className="text-sm font-semibold" style={{ color: '#006C75' }}>Prestasjoner Oppnådd</span>
            </div>
            <div className="text-right">
              <span className="font-extrabold text-lg" style={{ color: '#00A7B3' }}> 3/{mockAchievements.length}</span>
              <div className="w-16 h-1 rounded-full mt-0.5" style={{ backgroundColor: 'rgba(0, 167, 179, 0.2)' }}>
                <div className="h-full rounded-full transition-all" style={{ width: `${(3 / 6) * 100}%`, background: 'linear-gradient(to right, #00A7B3, #00C4D4)' }}></div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Enhanced Achievements */}
      <Card className="p-5 border-2 shadow-xl" style={{ background: 'linear-gradient(135deg, rgba(251, 190, 158, 0.15), #FFF5F0, rgba(251, 190, 158, 0.15))', borderColor: 'rgba(251, 190, 158, 0.4)', borderRadius: '20px' }}>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="mb-1 flex items-center gap-2 font-extrabold text-xl" style={{ color: '#B45309' }}>
              <Award className="w-6 h-6" style={{ color: '#FF9F66' }} />
              Prestasjoner
        </h3>
            <p className="text-xs font-medium" style={{ color: 'rgba(180, 83, 9, 0.7)' }}>Lås opp ditt potensial! ⭐</p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-3">
          {mockAchievements.map((achievement) => (
            <div
              key={achievement.id}
                  className="flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-300 hover:scale-[1.02] relative"
                  style={achievement.earned
                    ? { 
                        background: 'linear-gradient(135deg, #FFF5F0, white, #FFF5F0)', 
                        borderColor: '#FF9F66', 
                        borderWidth: '2px',
                        boxShadow: '0 4px 16px rgba(251, 190, 158, 0.3)',
                        borderRadius: '16px'
                      }
                    : { 
                        backgroundColor: '#f3f4f6', 
                        borderColor: '#d1d5db',
                        borderWidth: '2px',
                        borderRadius: '16px',
                        opacity: 0.7
                      }
                  }
                >
                  <div className={`text-4xl transform hover:scale-110 transition-transform relative ${achievement.earned ? '' : 'grayscale opacity-60'}`}>
                    {achievement.icon}
                    {achievement.earned && (
                      <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-0.5 border-2 border-white">
                      </div>
                    )}
                    {!achievement.earned && (
                      <div className="absolute -top-1 -right-1 bg-gray-400 rounded-full p-0.5 border-2 border-white">
                        <Lock className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
              <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className={`font-extrabold text-base ${achievement.earned ? '' : 'opacity-60'}`} style={{ color: achievement.earned ? '#B45309' : '#6b7280' }}>
                        {achievement.title}
                      </h4>
                      {achievement.earned && (
                        <Badge className="bg-green-500 text-white border-0 font-bold px-2 py-0.5 text-xs shadow-md">
                          Oppnådd
                        </Badge>
                      )}
                      {!achievement.earned && (
                        <Badge className="bg-gray-400 text-white border-0 font-bold px-2 py-0.5 text-xs shadow-md">
                          <Lock className="w-3 h-3 mr-1" />
                          Låst
                        </Badge>
                      )}
                </div>
                    <p className={`text-sm mb-3 font-medium leading-relaxed ${achievement.earned ? '' : 'opacity-60'}`} style={{ color: achievement.earned ? 'rgba(180, 83, 9, 0.9)' : '#6b7280' }}>
                  {achievement.description}
                </p>
                {!achievement.earned && achievement.progress && (
                      <div className="mt-2">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs font-semibold" style={{ color: '#6b7280' }}>Fremgang</span>
                          <span className="text-xs font-extrabold" style={{ color: '#FF9F66' }}>{achievement.progress}%</span>
                        </div>
                        <div className="w-full h-2.5 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(251, 190, 158, 0.2)' }}>
                          <div 
                            className="h-full rounded-full transition-all duration-500"
                            style={{ 
                              width: `${achievement.progress}%`, 
                              background: 'linear-gradient(90deg, #FF9F66, #FFB84D)',
                              boxShadow: '0 0 10px rgba(251, 190, 158, 0.3)'
                            }}
                          ></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Event Participation */}
      <EventParticipation />

      {/* Enhanced Goals */}
      <Card className="p-5 border-2 shadow-xl" style={{ background: 'linear-gradient(135deg, rgba(251, 190, 158, 0.15), #FFF5F0, rgba(251, 190, 158, 0.15))', borderColor: 'rgba(251, 190, 158, 0.4)', borderRadius: '20px' }}>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="mb-1 flex items-center gap-2 font-extrabold text-xl" style={{ color: '#B45309' }}>
              <Target className="w-6 h-6" style={{ color: '#FF9F66' }} />
          Nåværende Mål
        </h3>
            <p className="text-xs font-medium" style={{ color: 'rgba(180, 83, 9, 0.7)' }}>Fortsett å jobbe mot målet! 🎯</p>
          </div>
        </div>
        <div className="space-y-4">
          <div className="p-5 rounded-xl border-2 shadow-xl transition-all hover:scale-[1.02]" style={{ background: 'linear-gradient(135deg, #FBBE9E 0%, #FF9F66 100%)', borderColor: 'rgba(255, 255, 255, 0.3)', borderRadius: '16px', boxShadow: '0 8px 25px rgba(251, 190, 158, 0.3)' }}>
            <div className="flex justify-between items-center mb-3">
              <div>
                <h4 className="text-white font-extrabold text-lg mb-1">🎯 Nå 500 Poeng</h4>
                <p className="text-xs text-white/90 font-medium">Du er nesten der!</p>
              </div>
              <span className="text-sm text-white font-extrabold px-3 py-1.5 rounded-full shadow-md" style={{ backgroundColor: 'rgba(255, 255, 255, 0.3)' }}>{totalEarned}/500</span>
            </div>
            <div className="w-full h-4 rounded-full overflow-hidden shadow-inner" style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}>
              <div 
                className="h-full rounded-full transition-all duration-500 shadow-lg"
                style={{ 
                  width: `${(totalEarned / 500) * 100}%`, 
                  background: 'linear-gradient(90deg, white, rgba(255, 255, 255, 0.8))',
                  boxShadow: '0 0 15px rgba(255, 255, 255, 0.5)'
                }}
              ></div>
            </div>
            <p className="text-xs text-white/90 font-semibold mt-2">{500 - totalEarned} poeng igjen!</p>
          </div>
          
          <div className="p-5 rounded-xl border-2 shadow-xl transition-all hover:scale-[1.02]" style={{ background: 'linear-gradient(135deg, #00A7B3 0%, #00C4D4 100%)', borderColor: 'rgba(255, 255, 255, 0.3)', borderRadius: '16px', boxShadow: '0 8px 25px rgba(0, 167, 179, 0.3)' }}>
            <div className="flex justify-between items-center mb-3">
              <div>
                <h4 className="text-white font-extrabold text-lg mb-1">📅 Perfekt Oppmøte Måned</h4>
                <p className="text-xs text-white/90 font-medium">Hold deg konsistent!</p>
              </div>
              <span className="text-sm text-white font-extrabold px-3 py-1.5 rounded-full shadow-md" style={{ backgroundColor: 'rgba(255, 255, 255, 0.3)' }}>18/30 dager</span>
            </div>
            <div className="w-full h-4 rounded-full overflow-hidden shadow-inner" style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}>
              <div 
                className="h-full rounded-full transition-all duration-500 shadow-lg"
                style={{ 
                  width: `${(18 / 30) * 100}%`, 
                  background: 'linear-gradient(90deg, white, rgba(255, 255, 255, 0.8))',
                  boxShadow: '0 0 15px rgba(255, 255, 255, 0.5)'
                }}
              ></div>
            </div>
            <p className="text-xs text-white/90 font-semibold mt-2">4 dager igjen til perfekt oppmøte!</p>
          </div>
        </div>
      </Card>
    </div>
  )
}