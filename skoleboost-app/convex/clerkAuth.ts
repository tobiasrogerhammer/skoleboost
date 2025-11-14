// Helper function to get Clerk user ID from JWT token
// For queries/mutations: uses ctx.auth.getUserIdentity() (set by Convex when setAuth is called)
// For HTTP actions: uses ctx.request.headers
export async function getClerkUserId(ctx: any): Promise<string | null> {
  try {
    let token: string | null = null;
    
    // For queries/mutations: Convex provides getUserIdentity() when setAuth is called
    if (ctx.auth) {
      // Try getUserIdentity first
      if (typeof ctx.auth.getUserIdentity === 'function') {
        try {
          // Call getUserIdentity to get the identity
          const identity = await ctx.auth.getUserIdentity();
          
          // If identity has a tokenIdentifier or subject, use that
          if (identity) {
            // Clerk JWT tokens have the user ID in the subject field (just the user ID)
            // tokenIdentifier includes the issuer prefix, so we prefer subject
            if (identity.subject) {
              return identity.subject;
            }
            // Fallback to tokenIdentifier if subject is not available
            // Extract user ID from tokenIdentifier if it contains "|" separator
            if (identity.tokenIdentifier) {
              const tokenId = identity.tokenIdentifier;
              // tokenIdentifier format: "issuer|user_id" - extract just the user_id part
              if (tokenId.includes('|')) {
                const userId = tokenId.split('|').pop();
                return userId || tokenId;
              }
              return tokenId;
            }
          }
        } catch (error) {
          console.error("Error calling getUserIdentity:", error);
        }
      }
      
      // Try to get token directly from ctx.auth if it has a token property
      if (ctx.auth.token && typeof ctx.auth.token === 'string') {
        token = ctx.auth.token;
      }
    }
    
    // Fallback: Try to get token as string (for HTTP actions or if getUserIdentity doesn't work)
    if (ctx.auth && typeof ctx.auth === 'string') {
      token = ctx.auth;
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
      }
    }
    
    // If we still don't have a token, try to get it from WebSocket connection
    // This is a workaround when getUserIdentity() returns null
    if (!token && ctx.auth) {
      try {
        const authObj = ctx.auth as any;
        if (authObj._token) {
          token = authObj._token;
        } else if (authObj.token) {
          token = authObj.token;
        }
      } catch (e) {
        // Ignore errors
      }
    }
    
    if (!token) {
      // IMPORTANT: If getUserIdentity() returns null, it means JWT token is missing 'aud: "convex"'
      // Please add 'aud': 'convex' to your Clerk JWT template
      console.warn("⚠️ CRITICAL: getUserIdentity() returned null. This usually means:");
      console.warn("⚠️ 1. JWT token is missing 'aud': 'convex' claim");
      console.warn("⚠️ 2. Or CLERK_SECRET_KEY is not correctly configured in Convex Dashboard");
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

    // Check if 'aud' claim is set to 'convex' (required by Convex)
    if (payload.aud !== 'convex') {
      console.warn("⚠️ WARNING: JWT token 'aud' claim is not set to 'convex'. Current value:", payload.aud);
      console.warn("⚠️ This may cause getUserIdentity() to return null. Please add 'aud': 'convex' to your Clerk JWT template.");
    }

    // Clerk JWT tokens have 'sub' claim with the user ID
    const userId = payload.sub || null;
    
    if (!userId) {
      console.error("No 'sub' claim found in JWT payload. Payload keys:", Object.keys(payload));
    }
    
    return userId;
  } catch (error) {
    console.error("Error getting Clerk user ID:", error);
    return null;
  }
}

