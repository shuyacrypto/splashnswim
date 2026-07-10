import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import type { ReactNode } from "react";

/**
 * Shared frame for every email. Email clients need inline styles, so plain
 * neutral values are used here. This is generic engine styling, not a skin.
 */
export function EmailLayout({
  preview,
  schoolName,
  children,
}: {
  preview: string;
  schoolName: string;
  children: ReactNode;
}) {
  return (
    <Html lang="en-GB">
      <Head />
      <Preview>{preview}</Preview>
      <Body style={{ backgroundColor: "#f8fafc", fontFamily: "Arial, Helvetica, sans-serif" }}>
        <Container style={{ margin: "0 auto", maxWidth: "560px", padding: "24px" }}>
          <Section
            style={{
              backgroundColor: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
              padding: "24px",
            }}
          >
            {children}
          </Section>
          <Hr style={{ borderColor: "#e2e8f0", marginTop: "16px" }} />
          <Text style={{ color: "#64748b", fontSize: "12px" }}>{schoolName}</Text>
        </Container>
      </Body>
    </Html>
  );
}
