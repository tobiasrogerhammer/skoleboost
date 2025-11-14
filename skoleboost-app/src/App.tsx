import React, { useState } from 'react'
import { useQuery, useMutation, Authenticated, Unauthenticated, AuthLoading, useConvexAuth } from 'convex/react'
import { UserButton, useAuth, useClerk, SignIn, SignUp } from '@clerk/clerk-react'
import { api } from '../convex/_generated/api'
import { BottomNav } from './components/BottomNav'
import { MainPage } from './components/MainPage'
import { SchedulePage } from './components/SchedulePage'
import { ProfilePage } from './components/ProfilePage'
import UserJourneyMap from './UserJourneyMap'
import AcademicJourneyMap from './AcademicJourneyMap'
import { toast } from 'sonner'
import { Map, BookOpen } from 'lucide-react'
import { Button } from './components/ui/button'

// Helper function to decode JWT token and extract user ID
function decodeJWT(token: string): string | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
    
    // Log payload for debugging
    console.log("JWT payload keys:", Object.keys(payload));
    console.log("JWT payload aud claim:", payload.aud);
    console.log("JWT payload sub claim:", payload.sub);
    
    // Check if 'aud' claim is set to 'convex'
    if (payload.aud !== 'convex') {
      console.warn("⚠️ WARNING: JWT token 'aud' claim is not set to 'convex'. Current value:", payload.aud);
      console.warn("⚠️ This may cause getUserIdentity() to return null. Please add 'aud': 'convex' to your Clerk JWT template.");
    } else {
      console.log("✅ JWT token has 'aud': 'convex' claim - this is correct!");
    }
    
    return payload.sub || null;
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
}

export default function App() {
  const [currentPage, setCurrentPage] = useState('main')
  const [userCreationAttempted, setUserCreationAttempted] = useState(false)
  const [showSignUp, setShowSignUp] = useState(false)
  const [clerkUserId, setClerkUserId] = useState<string | null>(null)
  
  // Use Convex auth to check authentication state (ensures token is fetched and validated)
  const { isLoading: convexAuthLoading, isAuthenticated } = useConvexAuth()
  
  // Still need Clerk's useAuth to get user object for creating users
  const { user: clerkUser, getToken } = useAuth()
  const clerk = useClerk()
  
  // Get Clerk user ID directly from clerkUser object (fallback when getUserIdentity() returns null)
  React.useEffect(() => {
    if (clerkUser) {
      // Use clerkUser.id directly as fallback
      setClerkUserId(clerkUser.id);
      console.log("Using Clerk user ID from clerkUser object:", clerkUser.id);
      
      // Also decode token to check if it has aud: "convex" claim
      if (getToken) {
        getToken({ template: "convex" }).catch(() => getToken()).then((token) => {
          if (token) {
            decodeJWT(token); // This will log the payload for debugging
          }
        });
      }
    } else {
      setClerkUserId(null);
    }
  }, [clerkUser, getToken]);
  
  // Only run query when authenticated
  // Convex's <Authenticated> ensures the token is validated, so we can use the query directly
  // Query can get user ID from getUserIdentity() in backend, so we don't need to wait for clerkUserId
  const currentUser = useQuery(
    api.users.getCurrentUser, 
    isAuthenticated ? (clerkUserId ? { clerkUserId } : {}) : "skip"
  )
  const createUser = useMutation(api.users.createUser)
  const redeemCouponMutation = useMutation(api.users.redeemCoupon)
  
  // Check URL for sign-up route and handle navigation
  React.useEffect(() => {
    const updateSignUpState = () => {
      if (window.location.pathname === '/sign-up') {
        setShowSignUp(true)
      } else if (window.location.pathname === '/sign-in') {
        setShowSignUp(false)
      }
    }
    
    updateSignUpState()
    
    // Listen for popstate events (back/forward button)
    window.addEventListener('popstate', updateSignUpState)
    
    return () => {
      window.removeEventListener('popstate', updateSignUpState)
    }
  }, [])

  // Check if query is still loading (undefined means loading, null means loaded but no user)
  // Don't wait for clerkUserId - query can get it from backend
  const isLoading = convexAuthLoading || (isAuthenticated && currentUser === undefined)

  // Debug logging
  React.useEffect(() => {
    console.log("App state:", {
      convexAuthLoading,
      isAuthenticated,
      hasClerkUser: !!clerkUser,
      clerkUserId,
      currentUser: currentUser === undefined ? "loading" : currentUser === null ? "null (no user)" : "found",
      isLoading
    })
  }, [convexAuthLoading, isAuthenticated, clerkUser, clerkUserId, currentUser, isLoading])

  // If user is authenticated but doesn't exist in Convex, try to create them
  React.useEffect(() => {
    // Wait a bit for query to complete, then check if user needs to be created
    if (isAuthenticated && clerkUser && !convexAuthLoading && !userCreationAttempted) {
      // If query returned null (user doesn't exist) or has been loading for too long
      if (currentUser === null || (currentUser === undefined && clerkUserId)) {
        console.log("User authenticated but not found in Convex, attempting to create...", {
          clerkUserId: clerkUser.id,
          currentUser: currentUser === null ? "null" : "undefined"
        })
        setUserCreationAttempted(true)
        
        // Add a small delay to ensure everything is ready
        const timeoutId = setTimeout(async () => {
          try {
            const userId = await createUser({
              name: clerkUser.fullName || clerkUser.firstName || clerkUser.emailAddresses[0]?.emailAddress || "Bruker",
              email: clerkUser.emailAddresses[0]?.emailAddress || "",
              grade: "",
              clerkUserId: clerkUserId || clerkUser.id || undefined, // Pass user ID as fallback
            })
            console.log("User created successfully:", userId)
          } catch (error: any) {
            console.error("Error creating user:", error)
            // User might already exist or be created by webhook, that's okay
            // Reset flag after a delay to allow retry
            setTimeout(() => {
              setUserCreationAttempted(false)
            }, 3000)
          }
        }, 1000) // Wait 1 second to see if query completes
        
        return () => clearTimeout(timeoutId)
      }
    }
  }, [isAuthenticated, clerkUser, currentUser, convexAuthLoading, createUser, userCreationAttempted, clerkUserId])

  return (
    <>
      <Unauthenticated>
        <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center p-4">
          {showSignUp ? (
            <SignUp 
              appearance={{
                elements: {
                  rootBox: "mx-auto",
                  card: "shadow-2xl",
                },
              }}
              signInUrl="/sign-in"
              fallbackRedirectUrl="/"
            />
          ) : (
            <SignIn 
              appearance={{
                elements: {
                  rootBox: "mx-auto",
                  card: "shadow-2xl",
                },
              }}
              signUpUrl="/sign-up"
              fallbackRedirectUrl="/"
            />
          )}
        </div>
      </Unauthenticated>
      <AuthLoading>
        <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center">
          <div className="text-center">
            <p className="text-lg" style={{ color: '#006C75' }}>Laster...</p>
          </div>
        </div>
      </AuthLoading>
      <Authenticated>
        {isLoading ? (
          <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center">
            <div className="text-center">
              <p className="text-lg" style={{ color: '#006C75' }}>Laster brukerdata...</p>
            </div>
          </div>
        ) : currentUser ? (
          <AppContent 
            currentPage={currentPage} 
            setCurrentPage={setCurrentPage}
            currentUser={currentUser}
            redeemCouponMutation={redeemCouponMutation}
          />
        ) : (
          <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center p-4">
            <div className="text-center max-w-md">
              <p className="text-lg" style={{ color: '#006C75' }}>Oppretter bruker...</p>
              <p className="text-sm mt-2 mb-4" style={{ color: 'rgba(0, 108, 117, 0.7)' }}>
                Dette kan ta noen sekunder
              </p>
              <Button
                onClick={async () => {
                  // Force sign out if user creation is stuck
                  if (clerk) {
                    await clerk.signOut()
                  }
                  window.location.href = '/'
                }}
                variant="outline"
                style={{ color: '#006C75', borderColor: '#006C75' }}
              >
                Logg ut og prøv igjen
              </Button>
            </div>
          </div>
        )}
      </Authenticated>
    </>
  )
}

function AppContent({ 
  currentPage, 
  setCurrentPage, 
  currentUser,
  redeemCouponMutation 
}: { 
  currentPage: string
  setCurrentPage: (page: string) => void
  currentUser: any
  redeemCouponMutation: any
}) {
  const handleRedeemCoupon = async (couponId: string, cost: number) => {
    try {
      await redeemCouponMutation({ couponId: couponId as any })
      toast.success('Kupong innløst! 🎉', {
        description: 'Vis denne varslingen til kafeteriapersonellet'
      })
    } catch (error: any) {
      toast.error(error.message || 'Noe gikk galt')
    }
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'main':
        return (
          <MainPage
            currentPoints={currentUser.currentPoints}
            totalEarned={currentUser.totalEarned}
            onRedeemCoupon={handleRedeemCoupon}
          />
        )
      case 'schedule':
        return <SchedulePage />
      case 'profile':
        return (
          <ProfilePage
            currentPoints={currentUser.currentPoints}
            totalEarned={currentUser.totalEarned}
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
          <div className="absolute top-4 right-4 z-50 flex gap-2">
            <Button
              onClick={() => setCurrentPage('journey-map')}
              variant="outline"
              size="icon"
            >
              <Map className="size-4" />
            </Button>
            <UserButton afterSignOutUrl="/" />
          </div>
          {renderCurrentPage()}
          <BottomNav currentPage={currentPage} onPageChange={setCurrentPage} />
        </div>
      )}
    </div>
  )
}