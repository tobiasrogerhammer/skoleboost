import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { User, Award, TrendingUp, Calendar, Target, Star, Coins, Map } from 'lucide-react'
import { Card } from './ui/card'
import { Badge } from './ui/badge'
import { Progress } from './ui/progress'
import { Button } from './ui/button'
import { EventParticipation } from './EventParticipation'

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
  const currentUser = useQuery(api.users.getCurrentUser)
  const achievements = useQuery(api.users.getAchievements) || mockAchievements
  const earnedAchievements = achievements.filter((achievement: any) => achievement.earned)
  const studentInfo = getStudentInfo(currentUser)
  
  return (
    <div className="pb-20 px-4 pt-6 max-w-md mx-auto space-y-6">
      {/* Enhanced Profile Header */}
      <Card className="p-8 text-center border-2 shadow-2xl" style={{ background: 'linear-gradient(135deg, #00A7B3 0%, #00C4D4 50%, #4ECDC4 100%)', borderColor: 'rgba(255, 255, 255, 0.3)', borderRadius: '24px', boxShadow: '0 10px 40px rgba(0, 167, 179, 0.3)' }}>
        <div className="relative mb-5">
          <div className="w-24 h-24 bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center mx-auto border-4 border-white/60 shadow-2xl transform hover:scale-105 transition-transform duration-300">
            <User className="w-12 h-12 text-white" />
          </div>
          <div className="absolute -bottom-1 -right-1 bg-white/40 backdrop-blur-md rounded-full p-2 border-2 border-white/60 shadow-lg">
            <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
          </div>
        </div>
        <h2 className="mb-2 text-white font-extrabold text-2xl drop-shadow-lg">{studentInfo.name}</h2>
        <p className="text-white/95 mb-4 font-semibold text-base">{studentInfo.grade}</p>
        <div className="flex justify-center gap-4 text-sm text-white/95 bg-white/30 px-5 py-2.5 rounded-full backdrop-blur-md w-fit mx-auto shadow-lg border border-white/30">
          <span className="font-semibold">ID: {studentInfo.studentId}</span>
          <span>•</span>
          <span className="font-semibold">Siden {studentInfo.joinDate}</span>
        </div>
      </Card>

      {/* Enhanced Stats Overview */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-5 text-center border-2 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]" style={{ background: 'linear-gradient(135deg, #00A7B3 0%, #00C4D4 100%)', borderColor: 'rgba(255, 255, 255, 0.3)', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0, 167, 179, 0.3)' }}>
          <div className="bg-white/30 p-2 rounded-xl backdrop-blur-md w-fit mx-auto mb-3">
            <Coins className="w-6 h-6 text-white" />
          </div>
          <div className="text-4xl font-extrabold text-white mb-2 drop-shadow-lg" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>{currentPoints}</div>
          <p className="text-sm text-white font-semibold tracking-wide uppercase">Nåværende Poeng</p>
        </Card>
        <Card className="p-5 text-center border-2 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]" style={{ background: 'linear-gradient(135deg, #FBBE9E 0%, #FF9F66 100%)', borderColor: 'rgba(255, 255, 255, 0.3)', borderRadius: '20px', boxShadow: '0 10px 30px rgba(251, 190, 158, 0.3)' }}>
          <div className="bg-white/30 p-2 rounded-xl backdrop-blur-md w-fit mx-auto mb-3">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div className="text-4xl font-extrabold text-white mb-2 drop-shadow-lg" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>{studentInfo.attendanceRate}%</div>
          <p className="text-sm text-white font-semibold tracking-wide uppercase">Oppmøteprosent</p>
        </Card>
      </div>

      {/* Enhanced Detailed Stats */}
      <Card className="p-5 border-2 shadow-xl" style={{ background: 'linear-gradient(135deg, rgba(0, 167, 179, 0.08), #E8F6F6, rgba(0, 167, 179, 0.08))', borderColor: 'rgba(0, 167, 179, 0.3)', borderRadius: '20px' }}>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="mb-1 flex items-center gap-2 font-extrabold text-xl" style={{ color: '#006C75' }}>
              <TrendingUp className="w-6 h-6" style={{ color: '#00A7B3' }} />
              Akademisk Statistikk
        </h3>
            <p className="text-xs font-medium" style={{ color: 'rgba(0, 108, 117, 0.7)' }}>Din fantastiske fremgang! 📈</p>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-center p-4 rounded-xl transition-all hover:scale-[1.02]" style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', boxShadow: '0 2px 8px rgba(0, 167, 179, 0.1)' }}>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#00A7B3' }}></div>
              <span className="text-sm font-semibold" style={{ color: '#006C75' }}>Totale Poeng Tjent</span>
            </div>
            <span className="font-extrabold text-xl" style={{ color: '#00A7B3' }}>{totalEarned}</span>
          </div>
          <div className="flex justify-between items-center p-4 rounded-xl transition-all hover:scale-[1.02]" style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', boxShadow: '0 2px 8px rgba(0, 167, 179, 0.1)' }}>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#00A7B3' }}></div>
              <span className="text-sm font-semibold" style={{ color: '#006C75' }}>Klasserangering</span>
            </div>
            <Badge className="text-white border-0 font-extrabold px-3 py-1 shadow-md" style={{ background: 'linear-gradient(135deg, #00A7B3, #00C4D4)' }}>
              🏆 #{studentInfo.rank} av {studentInfo.totalStudents}
            </Badge>
          </div>
          <div className="flex justify-between items-center p-4 rounded-xl transition-all hover:scale-[1.02]" style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', boxShadow: '0 2px 8px rgba(0, 167, 179, 0.1)' }}>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#00A7B3' }}></div>
              <span className="text-sm font-semibold" style={{ color: '#006C75' }}>Månedens Timer</span>
            </div>
            <div className="text-right">
              <span className="font-extrabold text-xl" style={{ color: '#00A7B3' }}>18/22</span>
              <div className="w-20 h-1.5 rounded-full mt-1" style={{ backgroundColor: 'rgba(0, 167, 179, 0.2)' }}>
                <div className="h-full rounded-full transition-all" style={{ width: `${(18 / 22) * 100}%`, background: 'linear-gradient(to right, #00A7B3, #00C4D4)' }}></div>
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center p-4 rounded-xl transition-all hover:scale-[1.02]" style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', boxShadow: '0 2px 8px rgba(0, 167, 179, 0.1)' }}>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#00A7B3' }}></div>
              <span className="text-sm font-semibold" style={{ color: '#006C75' }}>Prestasjoner Oppnådd</span>
            </div>
            <div className="text-right">
              <span className="font-extrabold text-xl" style={{ color: '#00A7B3' }}>{earnedAchievements.length}/{mockAchievements.length}</span>
              <div className="w-20 h-1.5 rounded-full mt-1" style={{ backgroundColor: 'rgba(0, 167, 179, 0.2)' }}>
                <div className="h-full rounded-full transition-all" style={{ width: `${(earnedAchievements.length / mockAchievements.length) * 100}%`, background: 'linear-gradient(to right, #00A7B3, #00C4D4)' }}></div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Enhanced Achievements */}
      <Card className="p-5 border-2 shadow-xl" style={{ background: 'linear-gradient(135deg, rgba(0, 167, 179, 0.08), #E8F6F6, rgba(0, 167, 179, 0.08))', borderColor: 'rgba(0, 167, 179, 0.3)', borderRadius: '20px' }}>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="mb-1 flex items-center gap-2 font-extrabold text-xl" style={{ color: '#006C75' }}>
              <Award className="w-6 h-6" style={{ color: '#00A7B3' }} />
              Prestasjoner
        </h3>
            <p className="text-xs font-medium" style={{ color: 'rgba(0, 108, 117, 0.7)' }}>Lås opp ditt potensial! ⭐</p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-3">
          {mockAchievements.map((achievement) => (
            <div
              key={achievement.id}
                  className="flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-300 hover:scale-[1.02]"
                  style={achievement.earned
                    ? { 
                        background: 'linear-gradient(135deg, #E8F6F6, white, #E8F6F6)', 
                        borderColor: 'rgba(0, 167, 179, 0.5)', 
                        boxShadow: '0 4px 12px rgba(0, 167, 179, 0.2)',
                        borderRadius: '16px'
                      }
                    : { 
                        backgroundColor: '#f9fafb', 
                        borderColor: '#e5e7eb',
                        borderRadius: '16px'
                      }
                  }
                >
                  <div className="text-4xl transform hover:scale-110 transition-transform">{achievement.icon}</div>
              <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-extrabold text-base" style={{ color: achievement.earned ? '#006C75' : 'rgba(0, 108, 117, 0.7)' }}>{achievement.title}</h4>
                      {achievement.earned && (
                        <div className="bg-yellow-400/20 p-1 rounded-full">
                          <Star className="w-5 h-5" style={{ color: '#FFD700', fill: '#FFD700' }} />
                        </div>
                      )}
                </div>
                    <p className="text-sm mb-3 font-medium leading-relaxed" style={{ color: achievement.earned ? 'rgba(0, 108, 117, 0.8)' : 'rgba(0, 108, 117, 0.6)' }}>
                  {achievement.description}
                </p>
                {!achievement.earned && achievement.progress && (
                      <div className="mt-2">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs font-semibold" style={{ color: '#006C75' }}>Fremgang</span>
                          <span className="text-xs font-extrabold" style={{ color: '#00A7B3' }}>{achievement.progress}%</span>
                        </div>
                        <div className="w-full h-2.5 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(0, 167, 179, 0.1)' }}>
                          <div 
                            className="h-full rounded-full transition-all duration-500"
                            style={{ 
                              width: `${achievement.progress}%`, 
                              background: 'linear-gradient(90deg, #00A7B3, #00C4D4)',
                              boxShadow: '0 0 10px rgba(0, 167, 179, 0.3)'
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

      {/* User Journey Map Button */}
      {onNavigateToJourneyMap && (
        <Card className="p-5 border-2 cursor-pointer hover:shadow-xl transition-all duration-300" 
          style={{ 
            background: 'linear-gradient(135deg, rgba(0, 167, 179, 0.1), rgba(232, 246, 246, 0.5))', 
            borderColor: 'rgba(0, 167, 179, 0.3)', 
            borderRadius: '20px' 
          }}
          onClick={onNavigateToJourneyMap}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center" 
              style={{ background: 'linear-gradient(135deg, #00A7B3, #00C4D4)' }}>
              <Map className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg mb-1" style={{ color: '#006C75' }}>User Journey Map</h3>
              <p className="text-sm" style={{ color: 'rgba(0, 108, 117, 0.7)' }}>
                Se din reise gjennom appen
              </p>
            </div>
            <Button variant="ghost" size="sm" style={{ color: '#00A7B3' }}>
              →
            </Button>
          </div>
        </Card>
      )}

      {/* Event Participation */}
      <EventParticipation />

      {/* Enhanced Goals */}
      <Card className="p-5 border-2 shadow-xl" style={{ background: 'linear-gradient(135deg, rgba(0, 167, 179, 0.08), #E8F6F6, rgba(0, 167, 179, 0.08))', borderColor: 'rgba(0, 167, 179, 0.3)', borderRadius: '20px' }}>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="mb-1 flex items-center gap-2 font-extrabold text-xl" style={{ color: '#006C75' }}>
              <Target className="w-6 h-6" style={{ color: '#00A7B3' }} />
          Nåværende Mål
        </h3>
            <p className="text-xs font-medium" style={{ color: 'rgba(0, 108, 117, 0.7)' }}>Fortsett å jobbe mot målet! 🎯</p>
          </div>
        </div>
        <div className="space-y-4">
          <div className="p-5 rounded-xl border-2 shadow-xl transition-all hover:scale-[1.02]" style={{ background: 'linear-gradient(135deg, #00A7B3 0%, #00C4D4 100%)', borderColor: 'rgba(255, 255, 255, 0.3)', borderRadius: '16px', boxShadow: '0 8px 25px rgba(0, 167, 179, 0.3)' }}>
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
          
          <div className="p-5 rounded-xl border-2 shadow-xl transition-all hover:scale-[1.02]" style={{ background: 'linear-gradient(135deg, #FBBE9E 0%, #FF9F66 100%)', borderColor: 'rgba(255, 255, 255, 0.3)', borderRadius: '16px', boxShadow: '0 8px 25px rgba(251, 190, 158, 0.3)' }}>
            <div className="flex justify-between items-center mb-3">
              <div>
                <h4 className="text-white font-extrabold text-lg mb-1">📅 Perfekt Oppmøte Måned</h4>
                <p className="text-xs text-white/90 font-medium">Hold deg konsistent!</p>
              </div>
              <span className="text-sm text-white font-extrabold px-3 py-1.5 rounded-full shadow-md" style={{ backgroundColor: 'rgba(255, 255, 255, 0.3)' }}>18/22 dager</span>
            </div>
            <div className="w-full h-4 rounded-full overflow-hidden shadow-inner" style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}>
              <div 
                className="h-full rounded-full transition-all duration-500 shadow-lg"
                style={{ 
                  width: `${(18 / 22) * 100}%`, 
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