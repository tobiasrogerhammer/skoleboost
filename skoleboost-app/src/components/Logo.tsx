import React from 'react'

// Import logo image
import logoImage from '../assets/skoleboost-removebg-preview.png'

export function Logo({ size = 'md' }: { size?: 'xs' | 'sm' | 'md' | 'lg' }) {
  const sizes = {
    xs: { icon: 32 },
    sm: { icon: 64 },
    md: { icon: 96 },
    lg: { icon: 128 }
  }
  
  const { icon: iconSize } = sizes[size]

  return (
    <div className="flex items-center justify-center">
      {/* Logo Icon - Using image file */}
      <div className="relative" style={{ width: `${iconSize}px`, height: `${iconSize}px` }}>
        <img 
          src={logoImage} 
          alt="SkoleBoost Logo" 
          className="w-full h-full object-contain"
          style={{ width: `${iconSize}px`, height: `${iconSize}px` }}
        />
      </div>
    </div>
  )
}
