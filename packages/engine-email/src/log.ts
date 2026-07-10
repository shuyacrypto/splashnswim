import type { Emailer, EnquiryDetails, BroadcastResult } from "./client.js";

/**
 * A stand-in emailer for development. Instead of sending anything, it prints
 * a clear summary to the server console. Use this to prove the email flow end
 * to end without a Resend account.
 */
export function createLogEmailer(): Emailer {
  function line(title: string) {
    console.log(`\n----- EMAIL (${title}) -----`);
  }

  return {
    async sendEnquiryAcknowledgement(enquiry: EnquiryDetails): Promise<void> {
      line("enquiry acknowledgement");
      console.log(`To: ${enquiry.email}`);
      console.log("Subject: We have received your enquiry");
      console.log(`(Acknowledgement to ${enquiry.name})`);
    },

    async sendEnquiryNotification(
      enquiry: EnquiryDetails,
      notifyEmail: string,
    ): Promise<void> {
      line("enquiry notification");
      console.log(`To: ${notifyEmail}`);
      console.log(`Subject: New website enquiry from ${enquiry.name}`);
      console.log(`Reply-To: ${enquiry.name} <${enquiry.email}>`);
      if (enquiry.phone) console.log(`Phone: ${enquiry.phone}`);
      for (const field of enquiry.fields ?? []) {
        console.log(`${field.label}: ${field.value}`);
      }
      if (enquiry.message) console.log(`Message: ${enquiry.message}`);
    },

    async sendBroadcast(
      recipients: string[],
      subject: string,
      message: string,
    ): Promise<BroadcastResult> {
      const unique = [
        ...new Set(recipients.map((address) => address.trim()).filter((address) => address !== "")),
      ];
      line("broadcast");
      console.log(`Recipients: ${unique.length}`);
      console.log(`Subject: ${subject}`);
      console.log(`Message: ${message}`);
      return { sent: unique.length };
    },
  };
}
