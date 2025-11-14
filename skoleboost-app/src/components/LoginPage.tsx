import { useState } from "react";
import { useSignIn, useSignUp, useAuth } from "@clerk/clerk-react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { toast } from "sonner";

export function LoginPage() {
  const { signIn, setActive, isLoaded: signInLoaded } = useSignIn();
  const { signUp, isLoaded: signUpLoaded } = useSignUp();
  const { getToken } = useAuth();
  const createUser = useMutation(api.users.createUser);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [grade, setGrade] = useState("");
  const [loading, setLoading] = useState(false);
  const [pendingVerification, setPendingVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  
  const handleResendCode = async () => {
    if (!signUp) return;
    try {
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      toast.success("Ny verifiseringskode er sendt!");
    } catch (error: any) {
      console.error("Error resending code:", error);
      toast.error("Kunne ikke sende ny kode. Prøv igjen.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signInLoaded || !signUpLoaded) return;
    
    setLoading(true);

    try {
      if (isSignUp) {
        if (!signUp) {
          toast.error("Sign up ikke tilgjengelig");
          setLoading(false);
          return;
        }
        
        // If we're in verification mode, handle verification
        if (pendingVerification && signUp) {
          console.log("Attempting email verification with code:", verificationCode);
          
          // Check if already verified
          if (signUp.status === "complete") {
            console.log("Signup already complete, creating session...");
            try {
              await setActive({ session: signUp.createdSessionId });
              
              // Wait a bit for the session to be fully established and token to be available
              await new Promise(resolve => setTimeout(resolve, 500));
              
              // Verify token is available before creating user
              try {
                const token = await getToken();
                if (token) {
                  // Create user in Convex after successful signup
                  await createUser({
                    name,
                    email,
                    grade,
                  });
                  console.log("User created in Convex");
                } else {
                  console.warn("Token not available yet, user will be created via webhook");
                }
              } catch (userError: any) {
                console.log("User creation error:", userError);
                // User might be created via webhook, that's okay
              }
              toast.success("Konto opprettet! 🎉");
              setPendingVerification(false);
              setVerificationCode("");
            } catch (error: any) {
              console.error("Error setting active session:", error);
              toast.error("Kunne ikke fullføre innlogging. Prøv å logge inn.");
            }
            setLoading(false);
            return;
          }
          
          try {
            const completeResult = await signUp.attemptEmailAddressVerification({
              code: verificationCode,
            });
            
            console.log("Verification result status:", completeResult.status);
            console.log("Verification result details:", {
              status: completeResult.status,
              createdSessionId: completeResult.createdSessionId,
              createdUserId: completeResult.createdUserId,
              missingFields: completeResult.missingFields,
              unverifiedFields: completeResult.unverifiedFields,
            });
            
            if (completeResult.status === "complete") {
              await setActive({ session: completeResult.createdSessionId });
              
              // Wait a bit for the session to be fully established and token to be available
              await new Promise(resolve => setTimeout(resolve, 500));
              
              // Verify token is available before creating user
              try {
                const token = await getToken();
                if (!token) {
                  console.warn("Token not available yet, user will be created via webhook");
                  toast.success("Konto opprettet! 🎉");
                  setPendingVerification(false);
                  setVerificationCode("");
                  return;
                }
                
                // Create user in Convex after successful signup
                await createUser({
                  name,
                  email,
                  grade,
                });
                console.log("User created in Convex");
              } catch (userError: any) {
                console.log("User creation error:", userError);
                // User might be created via webhook, that's okay
              }
              toast.success("Konto opprettet! 🎉");
              setPendingVerification(false);
              setVerificationCode("");
            } else if (completeResult.status === "missing_requirements") {
              // Check what's missing
              const missingFields = completeResult.missingFields || [];
              const unverifiedFields = completeResult.unverifiedFields || [];
              
              console.log("Missing fields:", missingFields);
              console.log("Unverified fields:", unverifiedFields);
              
              // If email is still unverified, try preparing verification again
              if (unverifiedFields.includes("email_address") || missingFields.includes("email_address")) {
                toast.info("E-post må fortsatt verifiseres. Sjekk e-posten din for ny kode.");
                try {
                  await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
                  setVerificationCode(""); // Clear old code
                } catch (prepError: any) {
                  console.error("Error preparing verification again:", prepError);
                  toast.error("Kunne ikke sende ny verifiseringskode. Prøv 'Send ny kode'.");
                }
              } else {
                toast.error("Noe mangler for å fullføre registreringen. Prøv igjen.");
              }
            } else {
              toast.error("Ugyldig verifiseringskode. Prøv igjen.");
            }
          } catch (verifyError: any) {
            console.error("Verification error:", verifyError);
            const errorMsg = verifyError.errors?.[0]?.message || verifyError.message || "Ugyldig verifiseringskode";
            
            // Handle specific error cases
            if (errorMsg.includes("already been verified") || errorMsg.includes("already verified")) {
              // Already verified, try to complete signup
              console.log("Verification already completed, attempting to finish signup...");
              try {
                if (signUp.status === "complete" && signUp.createdSessionId) {
                  await setActive({ session: signUp.createdSessionId });
                  
                  // Wait a bit for the session to be fully established and token to be available
                  await new Promise(resolve => setTimeout(resolve, 500));
                  
                  try {
                    const token = await getToken();
                    if (token) {
                      await createUser({
                        name,
                        email,
                        grade,
                      });
                      console.log("User created in Convex");
                    } else {
                      console.warn("Token not available yet, user will be created via webhook");
                    }
                  } catch (userError: any) {
                    console.log("User creation error:", userError);
                    // User might be created via webhook, that's okay
                  }
                  toast.success("Konto opprettet! 🎉");
                  setPendingVerification(false);
                  setVerificationCode("");
                } else {
                  toast.info("E-posten er allerede verifisert. Prøv å logge inn.");
                  setPendingVerification(false);
                  setVerificationCode("");
                }
              } catch (error: any) {
                toast.error("Kunne ikke fullføre innlogging. Prøv å logge inn.");
                setPendingVerification(false);
                setVerificationCode("");
              }
            } else {
              toast.error(errorMsg);
            }
          }
          setLoading(false);
          return;
        }

        // Initial signup
        console.log("Starting signup process...");
        const result = await signUp.create({
          emailAddress: email,
          password,
          username: username || undefined, // Only include username if provided
        });

        console.log("Signup result status:", result.status);
        console.log("Signup result:", {
          status: result.status,
          createdSessionId: result.createdSessionId,
          createdUserId: result.createdUserId,
          missingFields: result.missingFields,
        });

        // Check if email verification is required
        if (result.status === "missing_requirements") {
          console.log("Email verification required, preparing verification...");
          try {
            await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
            setPendingVerification(true);
            toast.info("Sjekk e-posten din for verifiseringskode");
          } catch (prepError: any) {
            console.error("Error preparing verification:", prepError);
            toast.error("Kunne ikke sende verifiseringskode. Prøv igjen.");
          }
          setLoading(false);
          return;
        }

        // If signup is complete immediately (no email verification required)
        if (result.status === "complete") {
          console.log("Signup complete, creating session");
          await setActive({ session: result.createdSessionId });
          
          // Wait a bit for the session to be fully established and token to be available
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Verify token is available before creating user
          try {
            const token = await getToken();
            if (token) {
              // Create user in Convex after successful signup
              await createUser({
                name,
                email,
                grade,
              });
              console.log("User created in Convex");
            } else {
              console.warn("Token not available yet, user will be created via webhook");
            }
          } catch (userError: any) {
            console.log("User creation error:", userError);
            // User might be created via webhook, that's okay
          }
          toast.success("Konto opprettet! 🎉");
        } else {
          console.log("Unexpected signup status:", result.status);
          console.log("Signup result details:", {
            status: result.status,
            createdSessionId: result.createdSessionId,
            createdUserId: result.createdUserId,
            missingFields: result.missingFields,
          });
          toast.info(`Fullfør registreringen. Status: ${result.status}`);
        }
      } else {
        if (!signIn) {
          toast.error("Sign in ikke tilgjengelig");
          setLoading(false);
          return;
        }
        
        const result = await signIn.create({
          identifier: email,
          password,
        });

        if (result.status === "complete") {
          await setActive({ session: result.createdSessionId });
          toast.success("Innlogget! 🎉");
        } else {
          // Handle additional verification steps
          toast.info("Fullfør innloggingen");
        }
      }
    } catch (error: any) {
      console.error("Login error:", error);
      
      // Handle specific error cases
      let errorMessage = "Noe gikk galt";
      let shouldSwitchToLogin = false;
      
      // Check error message from different possible locations
      const errorText = error.message || 
                       error.errors?.[0]?.message || 
                       error.errors?.[0]?.longMessage || 
                       error.errors?.[0]?.code ||
                       "";
      
      console.log("Error text:", errorText);
      console.log("Full error object:", error);
      
      // Provide helpful messages for common errors
      if (errorText.includes("Couldn't find your account") || errorText.includes("not found")) {
        errorMessage = "Kontoen finnes ikke. Har du opprettet en konto?";
      } else if (errorText.includes("password") && errorText.includes("incorrect")) {
        errorMessage = "Feil passord. Prøv igjen.";
      } else if (errorText.includes("email") && (errorText.includes("taken") || errorText.includes("already") || errorText.includes("That email address is taken"))) {
        errorMessage = "Denne e-postadressen er allerede registrert. Prøv å logge inn i stedet.";
        shouldSwitchToLogin = true;
      } else if (errorText.includes("email")) {
        errorMessage = "Ugyldig e-postadresse.";
      } else if (error.errors && error.errors.length > 0) {
        // Try to get message from first error
        const firstError = error.errors[0];
        errorMessage = firstError.message || firstError.longMessage || firstError.code || errorMessage;
        
        // Check again for taken email
        if (errorMessage.includes("taken") || errorMessage.includes("already")) {
          errorMessage = "Denne e-postadressen er allerede registrert. Prøv å logge inn i stedet.";
          shouldSwitchToLogin = true;
        }
      } else if (error.message) {
        errorMessage = error.message;
        if (errorMessage.includes("taken") || errorMessage.includes("already")) {
          errorMessage = "Denne e-postadressen er allerede registrert. Prøv å logge inn i stedet.";
          shouldSwitchToLogin = true;
        }
      }
      
      toast.error(errorMessage);
      
      // Automatically switch to login mode if email is taken
      if (shouldSwitchToLogin && isSignUp) {
        setTimeout(() => {
          setIsSignUp(false);
          toast.info("Byttet til innlogging. Skriv inn passordet ditt.");
        }, 2000);
      }
      
      // Log full error for debugging
      if (error.errors) {
        console.error("Clerk errors:", error.errors);
      }
      if (error.status) {
        console.error("Error status:", error.status);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 shadow-2xl" style={{ borderRadius: '24px' }}>
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: '#006C75' }}>SkoleBoost</h1>
          <p className="text-sm" style={{ color: 'rgba(0, 108, 117, 0.7)' }}>
            {isSignUp ? "Opprett en ny konto" : "Logg inn på din konto"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && !pendingVerification && (
            <>
              <div>
                <Label htmlFor="username">Brukernavn</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  placeholder="ditt_brukernavn"
                />
              </div>
              <div>
                <Label htmlFor="name">Navn</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Ditt fulle navn"
                />
              </div>
              <div>
                <Label htmlFor="grade">Klasse</Label>
                <Input
                  id="grade"
                  type="text"
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  required
                  placeholder="f.eks. 10. klasse"
                />
              </div>
            </>
          )}

          {pendingVerification ? (
            <>
              <div className="mb-4 p-4 rounded-lg" style={{ backgroundColor: '#E8F6F6' }}>
                <p className="text-sm" style={{ color: '#006C75' }}>
                  Vi har sendt en verifiseringskode til <strong>{email}</strong>. 
                  Skriv inn koden nedenfor for å fullføre registreringen.
                </p>
              </div>
              <div>
                <Label htmlFor="verificationCode">Verifiseringskode</Label>
                <Input
                  id="verificationCode"
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  required
                  placeholder="123456"
                  maxLength={6}
                />
              </div>
              <Button
                type="submit"
                className="w-full font-bold"
                disabled={loading || verificationCode.length < 4}
                style={{
                  background: 'linear-gradient(135deg, #006C75, #00A7B3)',
                  color: 'white',
                }}
              >
                {loading ? "Verifiserer..." : "Verifiser e-post"}
              </Button>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={handleResendCode}
                  disabled={loading}
                >
                  Send ny kode
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setPendingVerification(false);
                    setVerificationCode("");
                  }}
                  disabled={loading}
                >
                  Tilbake
                </Button>
              </div>
            </>
          ) : (
            <>
              <div>
                <Label htmlFor="email">E-post</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="din@epost.no"
                  disabled={pendingVerification}
                />
              </div>

              <div>
                <Label htmlFor="password">Passord</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  minLength={8}
                  disabled={pendingVerification}
                />
              </div>

              <Button
                type="submit"
                className="w-full font-bold"
                disabled={loading}
                style={{
                  background: 'linear-gradient(135deg, #006C75, #00A7B3)',
                  color: 'white',
                }}
              >
                {loading ? "Laster..." : isSignUp ? "Opprett konto" : "Logg inn"}
              </Button>
            </>
          )}
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-sm font-medium"
            style={{ color: '#00A7B3' }}
          >
            {isSignUp
              ? "Har du allerede en konto? Logg inn"
              : "Har du ikke konto? Opprett en"}
          </button>
        </div>
      </Card>
    </div>
  );
}

