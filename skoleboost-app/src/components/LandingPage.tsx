import React, { useState, useEffect } from 'react'
import { Logo } from './Logo'
import { Button } from './ui/button'
import { GraduationCap, Calendar, Award, Sparkles, ArrowRight, Target, Users, TrendingUp, HelpCircle, AlertCircle } from 'lucide-react'

interface LandingPageProps {
  onGetStarted: () => void
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  const [isDesktop, setIsDesktop] = useState(false)
  const [isLargeDesktop, setIsLargeDesktop] = useState(false)

  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 768)
      setIsLargeDesktop(window.innerWidth >= 1024)
    }
    
    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])
  return (
    <div 
      className="bg-[#FAF9F6] flex flex-col overflow-y-auto"
      style={{
        minHeight: '100vh',
        paddingTop: isLargeDesktop ? '48px' : isDesktop ? '40px' : '0px',
        paddingBottom: isLargeDesktop ? '48px' : isDesktop ? '40px' : '0px'
      }}
    >
      <div 
        className="mx-auto w-full flex flex-col flex-1"
        style={{
          maxWidth: isLargeDesktop ? '1200px' : isDesktop ? '900px' : '448px'
        }}
      >
        {/* Header */}
        <div 
          className="flex items-center justify-center"
          style={{
            paddingTop: isLargeDesktop ? '24px' : isDesktop ? '20px' : '24px',
            paddingBottom: isLargeDesktop ? '32px' : isDesktop ? '28px' : '16px'
          }}
        >
          <div className="flex items-center gap-3 md:gap-5 lg:gap-6">
            <div style={{
              width: isLargeDesktop ? '112px' : isDesktop ? '96px' : '80px',
              height: isLargeDesktop ? '112px' : isDesktop ? '96px' : '80px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Logo size={isLargeDesktop ? 'md' : isDesktop ? 'sm-md' : 'sm-md'} />
            </div>
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold" style={{ color: '#006C75' }}>
              SkoleBoost
            </h1>
          </div>
        </div>

        {/* Main Content */}
        <div 
          className="flex-1 flex flex-col items-center w-full"
          style={{
            paddingLeft: isLargeDesktop ? '48px' : isDesktop ? '40px' : '24px',
            paddingRight: isLargeDesktop ? '48px' : isDesktop ? '40px' : '24px',
            paddingBottom: isLargeDesktop ? '40px' : isDesktop ? '32px' : '24px'
          }}
        >
        {/* Problem Statement Section */}
        <div 
          className="w-full"
          style={{
            maxWidth: isLargeDesktop ? '600px' : isDesktop ? '550px' : '100%',
            marginLeft: 'auto',
            marginRight: 'auto',
            marginTop: isLargeDesktop ? '32px' : isDesktop ? '28px' : '16px',
            marginBottom: isLargeDesktop ? '40px' : isDesktop ? '36px' : '16px'
          }}
        >
          <div 
            className="rounded-lg border-l-4" 
            style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              borderLeftColor: '#006C75',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
              padding: isLargeDesktop ? '16px' : isDesktop ? '20px' : '16px'
            }}
          >
            <div className="flex flex-col gap-2 md:gap-3 lg:gap-4 mb-1 md:mb-2 lg:mb-2">
              <div className="flex items-center gap-2 md:gap-3 lg:gap-4">
                <HelpCircle 
                  className="flex-shrink-0" 
                  style={{ 
                    color: '#006C75',
                    width: isLargeDesktop ? '20px' : isDesktop ? '18px' : '14px',
                    height: isLargeDesktop ? '20px' : isDesktop ? '18px' : '14px'
                  }} 
                />
                <h2 className="font-semibold uppercase tracking-wide" style={{ 
                  color: '#006C75', 
                  fontSize: isLargeDesktop ? '20px' : isDesktop ? '18px' : '14px' 
                }}>
                  Problemstilling
                </h2>
              </div>
              <p className="leading-relaxed" style={{ 
                color: 'rgba(0, 108, 117, 0.9)', 
                fontSize: isLargeDesktop ? '16px' : isDesktop ? '15px' : '14px' 
              }}>
              Hvordan kan en digital løsning bidra til å styrke skolemotivasjonen blant ungdomsskoleelever, redusere fravær, og samtidig bidra til utviklingen av et engasjerende og sosialt læringsmiljø?
              </p>
            </div>
          </div>
        </div>

        {/* Solution Section */}
        <div 
          className="w-full"
          style={{
            maxWidth: isLargeDesktop ? '600px' : isDesktop ? '550px' : '100%',
            marginLeft: 'auto',
            marginRight: 'auto',
            marginBottom: isLargeDesktop ? '48px' : isDesktop ? '44px' : '16px'
          }}
        >
          <div 
            className="rounded-lg border-l-4" 
            style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              borderLeftColor: '#00A7B3',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
              padding: isLargeDesktop ? '16px' : isDesktop ? '20px' : '16px'
            }}
          >
            <div className="flex flex-col gap-2 md:gap-3 lg:gap-4 mb-1 md:mb-2 lg:mb-2">
              <div className="flex items-center gap-2 md:gap-3 lg:gap-4">
                <TrendingUp 
                  className="flex-shrink-0" 
                  style={{ 
                    color: '#00A7B3',
                    width: isLargeDesktop ? '20px' : isDesktop ? '18px' : '14px',
                    height: isLargeDesktop ? '20px' : isDesktop ? '18px' : '14px'
                  }} 
                />
                <h2 className="font-semibold uppercase tracking-wide" style={{ 
                  color: '#00A7B3', 
                  fontSize: isLargeDesktop ? '20px' : isDesktop ? '18px' : '14px' 
                }}>
                  Vår Løsning
                </h2>
              </div>
              <p className="leading-relaxed mb-2 md:mb-3 lg:mb-4" style={{ 
                color: 'rgba(0, 108, 117, 0.9)', 
                fontSize: isLargeDesktop ? '16px' : isDesktop ? '15px' : '14px' 
              }}>
                SkoleBoost er en digital plattform som kombinerer timeplanhåndtering, oppmøtesporing, sosial deltakelse og belønningssystemer for å skape en mer engasjerende skoleopplevelse. Gjennom poengbaserte prestasjoner, arrangementer og transparent fremgangssporing, motiverer vi elever til aktiv deltakelse og reduserer fravær.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <Button
          onClick={onGetStarted}
          size="xl"
          className="font-bold shadow-lg hover:scale-105 transition-all"
          style={{
            background: 'linear-gradient(135deg, #006C75, #00A7B3)',
            color: 'white',
            border: '2px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 20px rgba(0, 108, 117, 0.3)',
            paddingLeft: isLargeDesktop ? '48px' : isDesktop ? '40px' : '48px',
            paddingRight: isLargeDesktop ? '48px' : isDesktop ? '40px' : '48px',
            paddingTop: isLargeDesktop ? '16px' : isDesktop ? '14px' : '16px',
            paddingBottom: isLargeDesktop ? '16px' : isDesktop ? '14px' : '16px',
            fontSize: isLargeDesktop ? '24px' : isDesktop ? '22px' : '20px',
            marginTop: isLargeDesktop ? '24px' : isDesktop ? '20px' : '0px'
          }}
        >
          Kom i gang
          <ArrowRight 
            className="ml-2 md:ml-4 lg:ml-5" 
            style={{
              width: isLargeDesktop ? '24px' : isDesktop ? '22px' : '20px',
              height: isLargeDesktop ? '24px' : isDesktop ? '22px' : '20px'
            }}
          />
        </Button>
        </div>

        {/* Footer */}
        <div 
          className="text-center border-t mt-auto"
          style={{ 
            borderColor: 'rgba(0, 108, 117, 0.2)',
            paddingTop: isLargeDesktop ? '32px' : isDesktop ? '24px' : '16px',
            paddingBottom: isLargeDesktop ? '24px' : isDesktop ? '20px' : '16px',
            marginTop: isLargeDesktop ? '48px' : isDesktop ? '32px' : '24px'
          }}
        >
          <p 
            style={{ 
              color: 'rgba(0, 108, 117, 0.7)',
              fontSize: isLargeDesktop ? '16px' : isDesktop ? '14px' : '12px',
              fontWeight: 500
            }}
          >
            © 2025 SkoleBoost - En digital løsning for skolemotivasjon og engasjement
          </p>
        </div>
      </div>
    </div>
  )
}

