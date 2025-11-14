import { httpRouter } from "convex/server";
import { clerkWebhook } from "./auth";
import { getUserIdFromToken } from "./getUserId";

const http = httpRouter();

http.route({
  path: "/clerk-webhook",
  method: "POST",
  handler: clerkWebhook,
});

http.route({
  path: "/get-user-id",
  method: "GET",
  handler: getUserIdFromToken,
});

export default http;

