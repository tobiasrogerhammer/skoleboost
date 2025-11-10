import { useState } from 'react'
import { BottomNav } from './components/BottomNav'
import { MainPage } from './components/MainPage'
import { SchedulePage } from './components/SchedulePage'
import { ProfilePage } from './components/ProfilePage'
import UserJourneyMap from './UserJourneyMap'
import AcademicJourneyMap from './AcademicJourneyMap'
import { toast } from 'sonner'
import { Map, BookOpen } from 'lucide-react'
import { Button } from './components/ui/button'

export default function App() {
  const [currentPage, setCurrentPage] = useState('main')
  const [currentPoints, setCurrentPoints] = useState(150) // Mock current points
  const totalEarned = 390 // Mock total points earned

  const handleRedeemCoupon = (couponId: string, cost: number) => {
    if (currentPoints >= cost) {
      setCurrentPoints(prev => prev - cost)
      toast.success('Kupong innløst! 🎉', {
        description: 'Vis denne varslingen til kafeteriapersonellet'
      })
    } else {
      toast.error('Ikke nok poeng til å innløse denne kupongen')
    }
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'main':
        return (
          <MainPage
            currentPoints={currentPoints}
            totalEarned={totalEarned}
            onRedeemCoupon={handleRedeemCoupon}
          />
        )
      case 'schedule':
        return <SchedulePage />
      case 'profile':
        return (
          <ProfilePage
            currentPoints={currentPoints}
            totalEarned={totalEarned}
          />
        )
      case 'journey-map':
        return <UserJourneyMap />
      case 'academic-journey-map':
        return <AcademicJourneyMap />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {(currentPage === 'journey-map' || currentPage === 'academic-journey-map') ? (
        <div className="relative">
          <div className="fixed top-4 left-4 z-50 flex gap-2">
            <Button
              onClick={() => setCurrentPage('main')}
              variant="outline"
              size="sm"
            >
              ← Back to App
            </Button>
            {currentPage === 'journey-map' && (
              <Button
                onClick={() => setCurrentPage('academic-journey-map')}
                variant="outline"
                size="sm"
              >
                <BookOpen className="size-4 mr-2" />
                Academic Version
              </Button>
            )}
            {currentPage === 'academic-journey-map' && (
              <Button
                onClick={() => setCurrentPage('journey-map')}
                variant="outline"
                size="sm"
              >
                <Map className="size-4 mr-2" />
                Visual Version
              </Button>
            )}
          </div>
          {renderCurrentPage()}
        </div>
      ) : (
        <div className="max-w-md mx-auto min-h-screen bg-[#FAF9F6] relative">
          <div className="absolute top-4 right-4 z-50">
            <Button
              onClick={() => setCurrentPage('journey-map')}
              variant="outline"
              size="icon"
            >
              <Map className="size-4" />
            </Button>
          </div>
          {renderCurrentPage()}
          <BottomNav currentPage={currentPage} onPageChange={setCurrentPage} />
        </div>
      )}
    </div>
  )
}