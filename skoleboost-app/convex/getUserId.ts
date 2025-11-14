import { httpAction } from "./_generated/server";
import { getClerkUserId } from "./clerkAuth";

// HTTP action to get Clerk user ID from token
// This is a workaround since we can't get the token directly from ctx.auth in queries/mutations
export const getUserIdFromToken = httpAction(async (ctx, request) => {
  // Get token from request headers
  const authHeader = request.headers.get("authorization");
  if (!authHeader) {
    return new Response(JSON.stringify({ error: "No authorization header" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Extract token
  const token = authHeader.startsWith("Bearer ") 
    ? authHeader.substring(7) 
    : authHeader;

  // Create a mock ctx object with the token in request headers
  const mockCtx = {
    request: {
      headers: {
        get: (name: string) => {
          if (name === "authorization") return authHeader;
          return null;
        },
      },
    },
  };

  // Get user ID using clerkAuth helper
  const userId = await getClerkUserId(mockCtx as any);
  
  if (!userId) {
    return new Response(JSON.stringify({ error: "Could not extract user ID" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ userId }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});

