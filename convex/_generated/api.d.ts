/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as admin_blog from "../admin/blog.js";
import type * as admin_dashboard from "../admin/dashboard.js";
import type * as admin_experiences from "../admin/experiences.js";
import type * as admin_media from "../admin/media.js";
import type * as admin_profile from "../admin/profile.js";
import type * as admin_projects from "../admin/projects.js";
import type * as admin_skills from "../admin/skills.js";
import type * as adminAuth from "../adminAuth.js";
import type * as analytics from "../analytics.js";
import type * as blog from "../blog.js";
import type * as contact from "../contact.js";
import type * as experiences from "../experiences.js";
import type * as guestbook from "../guestbook.js";
import type * as lib_adminAuth from "../lib/adminAuth.js";
import type * as lib_media from "../lib/media.js";
import type * as lib_password from "../lib/password.js";
import type * as projects from "../projects.js";
import type * as reactions from "../reactions.js";
import type * as seed from "../seed.js";
import type * as siteProfile from "../siteProfile.js";
import type * as siteStatus from "../siteStatus.js";
import type * as skills from "../skills.js";
import type * as validators from "../validators.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  "admin/blog": typeof admin_blog;
  "admin/dashboard": typeof admin_dashboard;
  "admin/experiences": typeof admin_experiences;
  "admin/media": typeof admin_media;
  "admin/profile": typeof admin_profile;
  "admin/projects": typeof admin_projects;
  "admin/skills": typeof admin_skills;
  adminAuth: typeof adminAuth;
  analytics: typeof analytics;
  blog: typeof blog;
  contact: typeof contact;
  experiences: typeof experiences;
  guestbook: typeof guestbook;
  "lib/adminAuth": typeof lib_adminAuth;
  "lib/media": typeof lib_media;
  "lib/password": typeof lib_password;
  projects: typeof projects;
  reactions: typeof reactions;
  seed: typeof seed;
  siteProfile: typeof siteProfile;
  siteStatus: typeof siteStatus;
  skills: typeof skills;
  validators: typeof validators;
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
