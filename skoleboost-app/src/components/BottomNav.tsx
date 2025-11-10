import { Home, User, Calendar } from 'lucide-react'

interface BottomNavProps {
  currentPage: string
  onPageChange: (page: string) => void
}

export function BottomNav({ currentPage, onPageChange }: BottomNavProps) {
  const navItems = [
    { id: 'main', icon: Home, label: 'Hjem' },
    { id: 'schedule', icon: Calendar, label: 'Timeplan' },
    { id: 'profile', icon: User, label: 'Profil' },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 backdrop-blur-sm border-t-2 shadow-lg z-50" style={{ backgroundColor: 'rgba(255, 255, 255, 0.98)', borderColor: 'rgba(0, 167, 179, 0.3)' }}>
      <div className="flex items-center justify-around py-2 px-4 max-w-md mx-auto">
        {navItems.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => onPageChange(id)}
            className="flex flex-col items-center p-3 rounded-lg transition-all"
            style={currentPage === id
              ? { 
                  color: '#006C75', 
                  background: 'linear-gradient(to bottom right, #E8F6F6, rgba(0, 167, 179, 0.1))',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                }
              : { 
                  color: 'rgba(0, 108, 117, 0.6)'
                }
            }
            onMouseEnter={(e) => {
              if (currentPage !== id) {
                e.currentTarget.style.color = '#00A7B3'
                e.currentTarget.style.backgroundColor = 'rgba(232, 246, 246, 0.5)'
              }
            }}
            onMouseLeave={(e) => {
              if (currentPage !== id) {
                e.currentTarget.style.color = 'rgba(0, 108, 117, 0.6)'
                e.currentTarget.style.backgroundColor = 'transparent'
              }
            }}
          >
            <Icon className="w-5 h-5 mb-1" />
            <span className="text-xs font-medium">{label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}