import { Heading, Text } from "@react-email/components";
import { EmailLayout } from "./layout.js";

/** Sent to a visitor to confirm their enquiry has been received. */
export function EnquiryReceivedEmail({
  schoolName,
  name,
}: {
  schoolName: string;
  name: string;
}) {
  return (
    <EmailLayout
      preview={`Thank you for contacting ${schoolName}`}
      schoolName={schoolName}
    >
      <Heading style={{ fontSize: "18px", margin: "0 0 12px" }}>
        Thank you for getting in touch
      </Heading>
      <Text>Hello {name},</Text>
      <Text>
        We have received your enquiry and one of our team will reply as soon as
        we can.
      </Text>
      <Text>Best wishes,</Text>
      <Text>{schoolName}</Text>
    </EmailLayout>
  );
}
