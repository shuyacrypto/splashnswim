"use server";

import { createLogEmailer } from "@swim-engine/engine-email";
import { createServerSupabase } from "./supabase/server";

/**
 * Email actions run on the server. Until Resend is wired up, this uses the
 * "log to screen" emailer, which prints to the terminal instead of sending.
 */
const emailer = createLogEmailer();

/** The inbox that enquiry notifications go to. */
const NOTIFY_EMAIL = "boris@draupnir.capital";

/** A stand-in parent mailing list, until the real list is wired up. */
const BROADCAST_RECIPIENTS = ["parent@example.com"];

export interface EnquiryInput {
  name: string;
  email: string;
  message: string;
}

/** Public: handle a contact-form enquiry. */
export async function submitEnquiry(input: EnquiryInput): Promise<void> {
  const name = input.name.trim();
  const email = input.email.trim();
  const message = input.message.trim();
  if (name === "" || email === "" || message === "") {
    throw new Error("Please fill in your name, email and message.");
  }
  const enquiry = { name, email, message };
  await emailer.sendEnquiryNotification(enquiry, NOTIFY_EMAIL);
  await emailer.sendEnquiryAcknowledgement(enquiry);
}

/** Admin only: send a broadcast to the parent mailing list. */
export async function sendBroadcast(subject: string, message: string): Promise<void> {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("You must be signed in to send a broadcast.");
  await emailer.sendBroadcast(BROADCAST_RECIPIENTS, subject, message);
}
