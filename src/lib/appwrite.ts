import { Client, Databases, ID, Query } from "node-appwrite";
import { env } from "./env";

export { ID, Query };

export const COLLECTIONS = {
  contacts: "contacts",
  campaigns: "campaigns",
  sequences: "sequences",
  sequenceSteps: "sequence_steps",
  enrollments: "enrollments",
  sends: "sends",
  suppressions: "suppressions",
  warmup: "warmup_state",
} as const;

let _db: Databases | null = null;

/** Server-side Appwrite Databases client (singleton). */
export function db(): Databases {
  if (_db) return _db;
  const client = new Client()
    .setEndpoint(env.appwriteEndpoint())
    .setProject(env.appwriteProjectId())
    .setKey(env.appwriteApiKey());
  _db = new Databases(client);
  return _db;
}

export const DB = () => env.databaseId();

// ── Typed document shapes ─────────────────────────────────

export type ContactStatus = "active" | "unsubscribed" | "bounced" | "complained";

export interface Contact {
  $id: string;
  email: string;
  firstName: string;
  lastName?: string;
  company?: string;
  status: ContactStatus;
  source: "cold" | "lead_magnet" | "manual" | "import";
  tags: string[];
  notes?: string;
}

export interface Campaign {
  $id: string;
  name: string;
  type: "cold" | "lead_magnet" | "nurture";
  status: "draft" | "active" | "paused" | "completed";
  sequenceId: string;
  fromEmail: string;
  dailyLimit: number;
  sentToday: number;
  sentTodayDate: string; // YYYY-MM-DD, resets daily
}

export interface Sequence {
  $id: string;
  name: string;
  description?: string;
}

export interface SequenceStep {
  $id: string;
  sequenceId: string;
  order: number;
  templateKey: string;
  subject: string;
  delayHours: number; // delay after the previous step (0 for first step)
  condition: "always" | "no_reply" | "no_open";
}

export interface Enrollment {
  $id: string;
  contactId: string;
  campaignId: string;
  sequenceId: string;
  currentStep: number; // order of the NEXT step to send
  status: "active" | "completed" | "paused" | "replied" | "stopped";
  nextSendAt: string; // ISO datetime
}

export interface Send {
  $id: string;
  contactId: string;
  campaignId?: string;
  templateKey: string;
  subject: string;
  resendId?: string;
  category: "cold" | "lead_magnet" | "transactional" | "warmup" | "nurture";
  status: "sent" | "delivered" | "opened" | "clicked" | "bounced" | "complained";
  sentAt: string;
}

export interface Suppression {
  $id: string;
  email: string;
  reason: "unsubscribe" | "bounce" | "complaint" | "manual";
}

export interface WarmupState {
  $id: string;
  day: number;
  targetVolume: number;
  sentToday: number;
  date: string; // YYYY-MM-DD
  status: "active" | "paused" | "completed";
  startedAt: string;
}

// ── Helpers ───────────────────────────────────────────────

export async function listAll<T>(
  collectionId: string,
  queries: string[] = []
): Promise<T[]> {
  const res = await db().listDocuments(DB(), collectionId, [
    Query.limit(500),
    ...queries,
  ]);
  return res.documents as unknown as T[];
}

export async function isSuppressed(email: string): Promise<boolean> {
  const res = await db().listDocuments(DB(), COLLECTIONS.suppressions, [
    Query.equal("email", email.toLowerCase()),
    Query.limit(1),
  ]);
  return res.total > 0;
}

export async function suppress(
  email: string,
  reason: Suppression["reason"]
): Promise<void> {
  if (await isSuppressed(email)) return;
  await db().createDocument(DB(), COLLECTIONS.suppressions, ID.unique(), {
    email: email.toLowerCase(),
    reason,
  });
}
