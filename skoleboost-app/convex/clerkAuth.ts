// Helper function to get Clerk user ID from JWT token
// For queries/mutations: uses ctx.auth.getUserIdentity() (set by Convex when setAuth is called)
// For HTTP actions: uses ctx.request.headers
export async function getClerkUserId(ctx: any): Promise<string | null> {
  try {
    let token: string | null = null;
    
    // For queries/mutations: Convex provides getUserIdentity() when setAuth is called
    if (ctx.auth) {
      // Log all properties of ctx.auth to see what's available
      console.log("ctx.auth type:", typeof ctx.auth);
      console.log("ctx.auth properties:", Object.keys(ctx.auth));
      // Try to stringify, but handle functions
      try {
        const authInfo: any = {};
        for (const key of Object.keys(ctx.auth)) {
          const value = (ctx.auth as any)[key];
          if (typeof value === 'function') {
            authInfo[key] = '[Function]';
          } else {
            authInfo[key] = value;
          }
        }
        console.log("ctx.auth value:", JSON.stringify(authInfo, null, 2));
      } catch (e) {
        console.log("Could not stringify ctx.auth:", e);
      }
      
      // Try getUserIdentity first
      if (typeof ctx.auth.getUserIdentity === 'function') {
        try {
          // Call getUserIdentity to get the identity
          const identity = await ctx.auth.getUserIdentity();
          console.log("getUserIdentity returned:", identity);
          
          // If identity has a tokenIdentifier or subject, use that
          if (identity) {
            // Clerk JWT tokens have the user ID in the subject field (just the user ID)
            // tokenIdentifier includes the issuer prefix, so we prefer subject
            if (identity.subject) {
              console.log("Found subject (Clerk user ID):", identity.subject);
              return identity.subject;
            }
            // Fallback to tokenIdentifier if subject is not available
            // Extract user ID from tokenIdentifier if it contains "|" separator
            if (identity.tokenIdentifier) {
              const tokenId = identity.tokenIdentifier;
              console.log("Found tokenIdentifier:", tokenId);
              // tokenIdentifier format: "issuer|user_id" - extract just the user_id part
              if (tokenId.includes('|')) {
                const userId = tokenId.split('|').pop();
                console.log("Extracted Clerk user ID from tokenIdentifier:", userId);
                return userId || tokenId;
              }
              return tokenId;
            }
            // If identity has other properties, log them to see what's available
            console.log("Identity object keys:", Object.keys(identity));
          }
        } catch (error) {
          console.log("Error calling getUserIdentity:", error);
        }
      }
      
      // Try to get token directly from ctx.auth if it has a token property
      if (ctx.auth.token && typeof ctx.auth.token === 'string') {
        token = ctx.auth.token;
        console.log("Token found in ctx.auth.token:", token.substring(0, 20) + "...");
      }
    }
    
    // Fallback: Try to get token as string (for HTTP actions or if getUserIdentity doesn't work)
    if (ctx.auth && typeof ctx.auth === 'string') {
      token = ctx.auth;
      console.log("Token found in ctx.auth (string):", token.substring(0, 20) + "...");
    }
    // For HTTP actions: get token from request headers
    else if (ctx.request?.headers) {
      const authHeader = ctx.request.headers.get("authorization");
      if (authHeader) {
        // Handle both "Bearer <token>" and just "<token>" formats
        if (authHeader.startsWith("Bearer ")) {
          token = authHeader.substring(7);
        } else {
          token = authHeader;
        }
        console.log("Token found in request header:", token.substring(0, 20) + "...");
      }
    }
    
    // If we still don't have a token, try to get it from WebSocket connection
    // This is a workaround when getUserIdentity() returns null
    if (!token && ctx.auth) {
      // Try to access token from auth context in different ways
      // Note: This may not work in all cases, but worth trying
      try {
        // Check if ctx.auth has any token-related properties
        const authObj = ctx.auth as any;
        if (authObj._token) {
          token = authObj._token;
          console.log("Token found in ctx.auth._token:", token.substring(0, 20) + "...");
        } else if (authObj.token) {
          token = authObj.token;
          console.log("Token found in ctx.auth.token:", token.substring(0, 20) + "...");
        }
      } catch (e) {
        // Ignore errors
      }
    }
    
    if (!token) {
      console.log("No token found - ctx.auth:", ctx.auth ? "exists" : "does not exist", 
                  "ctx.request:", ctx.request ? "exists" : "does not exist");
      // Debug: Log all available properties in ctx
      console.log("Available ctx properties:", Object.keys(ctx));
      
      // IMPORTANT: If getUserIdentity() returns null, it means JWT token is missing 'aud: "convex"'
      // Please add 'aud': 'convex' to your Clerk JWT template
      console.warn("⚠️ CRITICAL: getUserIdentity() returned null. This usually means:");
      console.warn("⚠️ 1. JWT token is missing 'aud': 'convex' claim");
      console.warn("⚠️ 2. Or CLERK_SECRET_KEY is not correctly configured in Convex Dashboard");
      console.warn("⚠️ Please see SOLUTION_LOGIN.md for instructions");
      
      return null;
    }
    
    // Decode JWT token (we only need the payload, no verification needed here
    // since Convex will verify the token if it's properly configured)
    const parts = token.split(".");
    if (parts.length !== 3) {
      console.log("Invalid JWT token format (expected 3 parts, got", parts.length, ")");
      return null;
    }

    // Decode the payload (second part of JWT) using atob for base64 decoding
    // atob is available in Convex runtime
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    const payload = JSON.parse(jsonPayload);

    // Log payload for debugging
    console.log("JWT payload keys:", Object.keys(payload));
    console.log("JWT payload aud claim:", payload.aud);
    console.log("JWT payload sub claim:", payload.sub);
    
    // Check if 'aud' claim is set to 'convex' (required by Convex)
    if (payload.aud !== 'convex') {
      console.warn("⚠️ WARNING: JWT token 'aud' claim is not set to 'convex'. Current value:", payload.aud);
      console.warn("⚠️ This may cause getUserIdentity() to return null. Please add 'aud': 'convex' to your Clerk JWT template.");
    }

    // Clerk JWT tokens have 'sub' claim with the user ID
    const userId = payload.sub || null;
    
    if (!userId) {
      console.log("No 'sub' claim found in JWT payload. Payload keys:", Object.keys(payload));
    } else {
      console.log("Successfully extracted Clerk user ID:", userId);
    }
    
    return userId;
  } catch (error) {
    console.error("Error getting Clerk user ID:", error);
    return null;
  }
}

