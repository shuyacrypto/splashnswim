import { Resend } from "resend";
import { render } from "@react-email/render";
import { EnquiryReceivedEmail } from "./templates/enquiry-received.js";
import { EnquiryNotificationEmail } from "./templates/enquiry-notification.js";
import { BroadcastEmail } from "./templates/broadcast.js";

export interface EmailConfig {
  /** The Resend API key for this school's account. */
  apiKey: string;
  /** The address emails are sent from, for example hello@school.co.uk. */
  fromEmail: string;
  /** The name shown as the sender, usually the school name. */
  fromName: string;
  /**
   * Optional brand colour for the email header (any CSS colour). Defaults to a
   * neutral slate so the engine stays design-agnostic; skins pass their token.
   */
  brandColor?: string;
  /** Optional accent colour for small highlights. Defaults to the brand colour. */
  accentColor?: string;
  /** Optional Reply-To for acknowledgements, usually the school inbox. */
  replyTo?: string;
}

/** One labelled detail shown in an enquiry email, for example a preferred pool. */
export interface EnquiryField {
  label: string;
  value: string;
}

export interface EnquiryDetails {
  name: string;
  email: string;
  message: string;
  /** Optional phone number. */
  phone?: string;
  /** Optional extra details the school's form collected, shown as rows. */
  fields?: EnquiryField[];
}

export interface BroadcastResult {
  /** How many recipients the broadcast was sent to. */
  sent: number;
}

export interface Emailer {
  sendEnquiryAcknowledgement(enquiry: EnquiryDetails): Promise<void>;
  sendEnquiryNotification(
    enquiry: EnquiryDetails,
    notifyEmail: string,
  ): Promise<void>;
  sendBroadcast(
    recipients: string[],
    subject: string,
    message: string,
  ): Promise<BroadcastResult>;
}

/** Resend allows up to 100 messages per batch. */
const BATCH_SIZE = 100;

/**
 * Creates the emailer for one school from its configuration. All sending goes
 * through here so templates and the "from" address are applied consistently.
 */
export function createEmailer(config: EmailConfig): Emailer {
  const resend = new Resend(config.apiKey);
  const from = `${config.fromName} <${config.fromEmail}>`;
  const brand = { brandColor: config.brandColor, accentColor: config.accentColor };

  async function sendEnquiryAcknowledgement(
    enquiry: EnquiryDetails,
  ): Promise<void> {
    const html = await render(
      <EnquiryReceivedEmail
        schoolName={config.fromName}
        name={enquiry.name}
        fields={enquiry.fields}
        {...brand}
      />,
    );
    const { error } = await resend.emails.send({
      from,
      to: enquiry.email,
      replyTo: config.replyTo,
      subject: `We have received your enquiry, ${enquiry.name}`,
      html,
    });
    if (error) throw new Error(error.message);
  }

  async function sendEnquiryNotification(
    enquiry: EnquiryDetails,
    notifyEmail: string,
  ): Promise<void> {
    const html = await render(
      <EnquiryNotificationEmail
        schoolName={config.fromName}
        name={enquiry.name}
        email={enquiry.email}
        message={enquiry.message}
        phone={enquiry.phone}
        fields={enquiry.fields}
        {...brand}
      />,
    );
    const { error } = await resend.emails.send({
      from,
      to: notifyEmail,
      // Replies go straight to the person who enquired.
      replyTo: enquiry.email,
      subject: `New website enquiry from ${enquiry.name}`,
      html,
    });
    if (error) throw new Error(error.message);
  }

  async function sendBroadcast(
    recipients: string[],
    subject: string,
    message: string,
  ): Promise<BroadcastResult> {
    const unique = [
      ...new Set(recipients.map((address) => address.trim()).filter((address) => address !== "")),
    ];
    if (unique.length === 0) return { sent: 0 };

    const html = await render(
      <BroadcastEmail schoolName={config.fromName} message={message} {...brand} />,
    );

    let sent = 0;
    for (let start = 0; start < unique.length; start += BATCH_SIZE) {
      const chunk = unique.slice(start, start + BATCH_SIZE);
      // One message per recipient, so no one sees anyone else's address.
      const { error } = await resend.batch.send(
        chunk.map((to) => ({ from, to, subject, html })),
      );
      if (error) throw new Error(error.message);
      sent += chunk.length;
    }
    return { sent };
  }

  return {
    sendEnquiryAcknowledgement,
    sendEnquiryNotification,
    sendBroadcast,
  };
}
