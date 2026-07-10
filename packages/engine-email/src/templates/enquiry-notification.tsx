import { Heading, Text } from "@react-email/components";
import { EmailLayout, type EmailBranding } from "./layout.js";
import type { EnquiryField } from "../client.js";

const labelCell = {
  padding: "9px 0",
  borderBottom: "1px solid #e2e8f0",
  color: "#64748b",
  fontSize: "13px",
  width: "38%",
  verticalAlign: "top" as const,
  textAlign: "left" as const,
};
const valueCell = {
  padding: "9px 0",
  borderBottom: "1px solid #e2e8f0",
  color: "#0f172a",
  fontSize: "14px",
  fontWeight: "bold" as const,
  textAlign: "left" as const,
};

/** Sent to the school to tell them about a new website enquiry. */
export function EnquiryNotificationEmail({
  schoolName,
  name,
  email,
  message,
  phone,
  fields,
  brandColor,
  accentColor,
}: {
  schoolName: string;
  name: string;
  email: string;
  message: string;
  phone?: string;
  fields?: EnquiryField[];
} & EmailBranding) {
  const rows: EnquiryField[] = [
    { label: "Name", value: name },
    { label: "Email", value: email },
    ...(phone ? [{ label: "Phone", value: phone }] : []),
    ...(fields ?? []),
  ];
  const accent = accentColor ?? brandColor ?? "#0f172a";

  return (
    <EmailLayout preview={`New enquiry from ${name}`} schoolName={schoolName} brandColor={brandColor} accentColor={accentColor}>
      <Text style={{ margin: "0 0 4px", color: accent, fontSize: "12px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "1px" }}>
        Website enquiry
      </Text>
      <Heading style={{ fontSize: "20px", margin: "0 0 16px", color: "#0f172a" }}>
        New enquiry from {name}
      </Heading>
      <table role="presentation" width="100%" style={{ borderCollapse: "collapse", borderTop: "1px solid #e2e8f0" }}>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              <td style={labelCell}>{row.label}</td>
              <td style={valueCell}>{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {message ? (
        <>
          <Text style={{ margin: "18px 0 4px", color: "#64748b", fontSize: "13px", fontWeight: "bold" }}>
            Message
          </Text>
          <Text style={{ whiteSpace: "pre-wrap", color: "#0f172a", fontSize: "14px", margin: 0, lineHeight: "1.55" }}>
            {message}
          </Text>
        </>
      ) : null}
      <Text style={{ margin: "22px 0 0", color: "#64748b", fontSize: "13px" }}>
        Reply directly to this email to respond to {name}.
      </Text>
    </EmailLayout>
  );
}
