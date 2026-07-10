"use server";

import {
  createEmailer,
  createLogEmailer,
  type Emailer,
  type EnquiryField,
} from "@swim-engine/engine-email";
import { createServerSupabase } from "./supabase/server";

// SplashNSwim brand colours for email, taken from the skin design tokens
// (app/globals.css): ocean-deep and coral. Email needs concrete colours, so
// the token values are mirrored here.
const BRAND_COLOR = "#0c5278";
const ACCENT_COLOR = "#ff7662";

/** The school inbox that enquiry notifications go to. */
const NOTIFY_EMAIL = process.env.ENQUIRY_NOTIFY_EMAIL ?? "info@splashnswim.net";

/**
 * Email actions run on the server. Live sending goes through Resend when a
 * RESEND_API_KEY is configured; otherwise we fall back to the "log to screen"
 * emailer so development still works without an account.
 */
function getEmailer(): Emailer {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return createLogEmailer();
  return createEmailer({
    apiKey,
    fromEmail: process.env.EMAIL_FROM_ADDRESS ?? "info@splashnswim.net",
    fromName: "SplashNSwim",
    brandColor: BRAND_COLOR,
    accentColor: ACCENT_COLOR,
    // Replies to the parent acknowledgement come back to the school inbox.
    replyTo: NOTIFY_EMAIL,
  });
}

const emailer = getEmailer();

/** A stand-in parent mailing list for the broadcast screen. */
const PRACTICE_RECIPIENTS = ["parent@example.com"];

export interface EnquiryInput {
  name: string;
  email: string;
  phone?: string;
  /** General enquiry, taster lesson, or SEN enquiry. */
  enquiryType?: string;
  /** Preferred pool, if the parent has one. */
  venue?: string;
  /** The swimmer's age, free text (for example "5" or "adult"). */
  swimmerAge?: string;
  message?: string;
}

/** Turn the enriched form fields into labelled rows for the email. */
function buildFields(input: EnquiryInput): EnquiryField[] {
  const fields: EnquiryField[] = [];
  if (input.enquiryType) fields.push({ label: "Enquiry about", value: input.enquiryType });
  if (input.venue) fields.push({ label: "Preferred pool", value: input.venue });
  if (input.swimmerAge) fields.push({ label: "Swimmer's age", value: input.swimmerAge });
  return fields;
}

/** Public: handle a contact-form enquiry. */
export async function submitEnquiry(input: EnquiryInput): Promise<void> {
  const name = input.name.trim();
  const email = input.email.trim();
  if (name === "" || email === "") {
    throw new Error("Please give us your name and email so we can reply.");
  }

  const enquiry = {
    name,
    email,
    phone: input.phone?.trim() || undefined,
    message: (input.message ?? "").trim(),
    fields: buildFields(input),
  };

  // The notification to the school is the critical path: it must succeed.
  await emailer.sendEnquiryNotification(enquiry, NOTIFY_EMAIL);

  // The acknowledgement to the parent is best effort. Sending it to an
  // arbitrary address needs a verified sending domain, so when Resend runs
  // without one (for example a Wix-hosted domain), this may fail. The school
  // has already been notified, so we log and carry on rather than error.
  try {
    await emailer.sendEnquiryAcknowledgement(enquiry);
  } catch (caught) {
    console.warn(
      "Enquiry acknowledgement not sent:",
      caught instanceof Error ? caught.message : caught,
    );
  }
}

/** Admin only: send a broadcast to the recipient list. */
export async function sendBroadcast(subject: string, message: string): Promise<void> {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("You must be signed in to send a broadcast.");
  await emailer.sendBroadcast(PRACTICE_RECIPIENTS, subject, message);
}
