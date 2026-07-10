# engine-email

Email sending through Resend, using React Email templates.

## What is here

- **Templates** (`src/templates`): a shared layout plus three emails:
  - enquiry received (acknowledgement to the visitor),
  - enquiry notification (to the school),
  - broadcast (a parent message wrapped in the shared frame).
- **createEmailer** (`src/client.tsx`): builds an emailer from a school's
  configuration and exposes:
  - `sendEnquiryAcknowledgement`
  - `sendEnquiryNotification`
  - `sendBroadcast` (one message per recipient, so addresses stay private)

## Usage

```ts
import { createEmailer } from "@swim-engine/engine-email";

const emailer = createEmailer({
  apiKey: process.env.RESEND_API_KEY!,
  fromEmail: process.env.EMAIL_FROM_ADDRESS!,
  fromName: process.env.EMAIL_FROM_NAME!,
});

await emailer.sendBroadcast(recipients, "Pool closed on Monday", message);
```

The broadcast screen itself lives in `engine-admin` (with the other admin
screens); the consuming app wires its "send" action to `sendBroadcast`, and
supplies the recipient list. There are no parent accounts in v1, so the
recipient list is provided by the app (from booking data once that module is
enabled).

Configuration secrets go in a local `.env`, based on `.env.example`.
