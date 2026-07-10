import { Heading, Text } from "@react-email/components";
import { EmailLayout } from "./layout.js";

/** Sent to the school to tell them about a new website enquiry. */
export function EnquiryNotificationEmail({
  schoolName,
  name,
  email,
  message,
}: {
  schoolName: string;
  name: string;
  email: string;
  message: string;
}) {
  return (
    <EmailLayout preview={`New enquiry from ${name}`} schoolName={schoolName}>
      <Heading style={{ fontSize: "18px", margin: "0 0 12px" }}>
        New website enquiry
      </Heading>
      <Text style={{ margin: "0 0 4px" }}>
        <strong>Name:</strong> {name}
      </Text>
      <Text style={{ margin: "0 0 4px" }}>
        <strong>Email:</strong> {email}
      </Text>
      <Text style={{ margin: "12px 0 4px" }}>
        <strong>Message:</strong>
      </Text>
      <Text style={{ whiteSpace: "pre-wrap" }}>{message}</Text>
    </EmailLayout>
  );
}
