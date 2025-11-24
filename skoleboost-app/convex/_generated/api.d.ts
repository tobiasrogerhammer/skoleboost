/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as achievements from "../achievements.js";
import type * as announcements from "../announcements.js";
import type * as auth from "../auth.js";
import type * as clerkAuth from "../clerkAuth.js";
import type * as comments from "../comments.js";
import type * as coupons from "../coupons.js";
import type * as events from "../events.js";
import type * as getUserId from "../getUserId.js";
import type * as http from "../http.js";
import type * as migrations from "../migrations.js";
import type * as schedule from "../schedule.js";
import type * as seed from "../seed.js";
import type * as teacherCoupons from "../teacherCoupons.js";
import type * as teacherEvents from "../teacherEvents.js";
import type * as teachers from "../teachers.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  achievements: typeof achievements;
  announcements: typeof announcements;
  auth: typeof auth;
  clerkAuth: typeof clerkAuth;
  comments: typeof comments;
  coupons: typeof coupons;
  events: typeof events;
  getUserId: typeof getUserId;
  http: typeof http;
  migrations: typeof migrations;
  schedule: typeof schedule;
  seed: typeof seed;
  teacherCoupons: typeof teacherCoupons;
  teacherEvents: typeof teacherEvents;
  teachers: typeof teachers;
  users: typeof users;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
