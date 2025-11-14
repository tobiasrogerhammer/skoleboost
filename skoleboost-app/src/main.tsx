import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ClerkProvider, useAuth } from "@clerk/clerk-react";
import App from "./App.tsx";
import "./index.css";

const convexUrl = (import.meta as any).env.VITE_CONVEX_URL;
const PUBLISHABLE_KEY = (import.meta as any).env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Clerk Publishable Key. Please set VITE_CLERK_PUBLISHABLE_KEY in your .env.local file.");
}

// Validate publishable key format
if (!PUBLISHABLE_KEY.startsWith("pk_test_") && !PUBLISHABLE_KEY.startsWith("pk_live_")) {
  console.warn("Warning: Clerk Publishable Key format looks incorrect. Should start with 'pk_test_' or 'pk_live_'");
}

// Log key for debugging (first 20 chars only for security)
console.log("Clerk Publishable Key loaded:", PUBLISHABLE_KEY.substring(0, 20) + "...");

if (!convexUrl) {
  console.error("Missing VITE_CONVEX_URL environment variable. Please run 'npx convex dev' to set up your Convex backend.");
}

// Create Convex client
const convex = new ConvexReactClient(convexUrl || "https://placeholder.convex.cloud");

const root = createRoot(document.getElementById("root")!);

root.render(
  <StrictMode>
    <ClerkProvider 
      publishableKey={PUBLISHABLE_KEY} 
      signUpUrl="/sign-up"
      signInUrl="/sign-in"
      appearance={{
        elements: {
          rootBox: { display: "contents" },
        },
      }}
      // Disable CAPTCHA in development to avoid iframe sandbox issues
      // Note: This may not be a valid prop, but won't cause errors if ignored
      {...(process.env.NODE_ENV === 'development' && {
        // @ts-ignore - captchaOptions may not be in types but helps in some Clerk versions
        captchaOptions: {
          captchaType: "none",
        }
      })}
    >
      <ConvexProviderWithClerk 
        client={convex} 
        useAuth={useAuth}
        children={
          convexUrl ? <App /> : (
            <div style={{ padding: "2rem", textAlign: "center" }}>
              <h1>Konfigurasjon mangler</h1>
              <p>Kjør 'npx convex dev' for å sette opp Convex backend.</p>
            </div>
          )
        }
      />
    </ClerkProvider>
  </StrictMode>
);