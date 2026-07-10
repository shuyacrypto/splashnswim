/**
 * engine-email sends email through Resend using React Email templates. It
 * covers the transactional emails around the contact form and the parent
 * broadcast. Create an emailer with a school's configuration, then call its
 * methods.
 */

export { createEmailer } from "./client.js";
export type {
  Emailer,
  EmailConfig,
  EnquiryDetails,
  BroadcastResult,
} from "./client.js";

export { EmailLayout } from "./templates/layout.js";
export { EnquiryReceivedEmail } from "./templates/enquiry-received.js";
export { EnquiryNotificationEmail } from "./templates/enquiry-notification.js";
export { BroadcastEmail } from "./templates/broadcast.js";
