import React, { useEffect, useState, useMemo, useCallback, memo } from 'react'
import { Home, User, Calendar } from 'lucide-react'
import { createPortal } from 'react-dom'

interface BottomNavProps {
  currentPage: string
  onPageChange: (page: string) => void
}

// Move navItems outside component to avoid recreation
const NAV_ITEMS = [
  { id: 'main', icon: Home, label: 'Hjem' },
  { id: 'schedule', icon: Calendar, label: 'Timeplan' },
  { id: 'profile', icon: User, label: 'Profil' },
] as const

// Memoized nav item component
const NavItem = memo(({ 
  id, 
  Icon, 
  label, 
  isActive, 
  onClick 
}: { 
  id: string
  Icon: React.ComponentType<{ style?: React.CSSProperties }>
  label: string
  isActive: boolean
  onClick: () => void
}) => {
  const iconStyle = useMemo(() => ({
    width: isActive ? '24px' : '22px',
    height: isActive ? '24px' : '22px',
    color: isActive ? '#00A7B3' : 'rgba(0, 108, 117, 0.5)',
    strokeWidth: isActive ? 2.5 : 2,
  }), [isActive])

  const labelStyle = useMemo(() => ({
    fontSize: '11px',
    color: isActive ? '#00A7B3' : 'rgba(0, 108, 117, 0.6)',
    fontWeight: isActive ? 600 : 500,
  }), [isActive])

  const containerStyle = useMemo(() => ({
    position: 'relative' as const,
    padding: isActive ? '10px' : '8px',
    borderRadius: '16px',
    background: isActive
      ? 'linear-gradient(135deg, rgba(0, 167, 179, 0.15), rgba(0, 196, 212, 0.1))'
      : 'transparent',
    marginBottom: '4px',
  }), [isActive])

  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center relative flex-1 py-2 ease-out"
      style={{
        minHeight: '56px',
        cursor: 'pointer',
      }}
    >
      <div style={containerStyle}>
        <Icon style={iconStyle} />
      </div>
      <span className="font-medium" style={labelStyle}>
        {label}
      </span>
    </button>
  )
})

NavItem.displayName = 'NavItem'

export const BottomNav = memo(function BottomNav({ currentPage, onPageChange }: BottomNavProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handlePageChange = useCallback((pageId: string) => {
    onPageChange(pageId)
  }, [onPageChange])

  // Memoize container styles
  const containerStyle = useMemo(() => ({
    position: 'fixed' as const,
    bottom: 0,
    left: 0,
    right: 0,
    width: '100%',
    zIndex: 5,
    isolation: 'isolate' as const,
    transform: 'translateZ(0)',
    willChange: 'transform' as const,
  }), [])

  const backgroundStyle = useMemo(() => ({
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderTopLeftRadius: '24px',
    borderTopRightRadius: '24px',
    borderTop: '1px solid rgba(0, 167, 179, 0.15)',
    boxShadow: '0 -8px 32px rgba(0, 108, 117, 0.12), 0 -2px 8px rgba(0, 108, 117, 0.08)',
    paddingTop: '8px',
    paddingBottom: 'max(8px, env(safe-area-inset-bottom))',
  }), [])

  const navContent = (
    <div style={containerStyle}>
      <div style={backgroundStyle}>
        <div className="flex items-center justify-around px-2 max-w-md mx-auto">
          {NAV_ITEMS.map(({ id, icon: Icon, label }) => (
            <NavItem
              key={id}
              id={id}
              Icon={Icon}
              label={label}
              isActive={currentPage === id}
              onClick={() => handlePageChange(id)}
            />
          ))}
        </div>
      </div>
    </div>
  )

  if (!mounted) {
    return null
  }

  // Use portal to render directly in document.body to ensure fixed positioning works correctly
  // This ensures the nav is always visible regardless of scroll containers or transforms
  if (typeof document !== 'undefined' && mounted) {
    return createPortal(navContent, document.body)
  }

  return null
})