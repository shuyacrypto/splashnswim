import { Heading, Text } from "@react-email/components";
import { EmailLayout, type EmailBranding } from "./layout.js";
import type { EnquiryField } from "../client.js";

const labelCell = {
  padding: "8px 0",
  borderBottom: "1px solid #e2e8f0",
  color: "#64748b",
  fontSize: "13px",
  width: "38%",
  verticalAlign: "top" as const,
  textAlign: "left" as const,
};
const valueCell = {
  padding: "8px 0",
  borderBottom: "1px solid #e2e8f0",
  color: "#0f172a",
  fontSize: "14px",
  fontWeight: "bold" as const,
  textAlign: "left" as const,
};

/** Sent to a visitor to confirm their enquiry has been received. */
export function EnquiryReceivedEmail({
  schoolName,
  name,
  fields,
  brandColor,
  accentColor,
}: {
  schoolName: string;
  name: string;
  fields?: EnquiryField[];
} & EmailBranding) {
  return (
    <EmailLayout
      preview={`Thank you for contacting ${schoolName}`}
      schoolName={schoolName}
      brandColor={brandColor}
      accentColor={accentColor}
    >
      <Heading style={{ fontSize: "20px", margin: "0 0 12px", color: "#0f172a" }}>
        Thank you for getting in touch
      </Heading>
      <Text style={{ color: "#0f172a", fontSize: "14px", lineHeight: "1.55", margin: "0 0 12px" }}>
        Hello {name},
      </Text>
      <Text style={{ color: "#0f172a", fontSize: "14px", lineHeight: "1.55", margin: "0 0 12px" }}>
        Thank you for your enquiry to {schoolName}. We have received it and one of
        our team will be in touch very soon.
      </Text>
      {fields && fields.length > 0 ? (
        <>
          <Text style={{ margin: "16px 0 4px", color: "#64748b", fontSize: "13px", fontWeight: "bold" }}>
            What you sent us
          </Text>
          <table role="presentation" width="100%" style={{ borderCollapse: "collapse", borderTop: "1px solid #e2e8f0" }}>
            <tbody>
              {fields.map((row, index) => (
                <tr key={index}>
                  <td style={labelCell}>{row.label}</td>
                  <td style={valueCell}>{row.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : null}
      <Text style={{ color: "#0f172a", fontSize: "14px", lineHeight: "1.55", margin: "18px 0 0" }}>
        Warm wishes,
        <br />
        The {schoolName} team
      </Text>
    </EmailLayout>
  );
}
