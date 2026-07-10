import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import type { ReactNode } from "react";

/** Branding a caller may pass through to any email. */
export interface EmailBranding {
  /** Header background colour. Defaults to neutral slate. */
  brandColor?: string;
  /** Accent colour for small highlights. Defaults to the brand colour. */
  accentColor?: string;
}

/**
 * Shared frame for every email. Email clients need inline styles, so plain
 * values are used here. Colours default to neutral, keeping the engine
 * design-agnostic; a skin can pass its own brand colour.
 */
export function EmailLayout({
  preview,
  schoolName,
  brandColor,
  children,
}: {
  preview: string;
  schoolName: string;
  children: ReactNode;
} & EmailBranding) {
  const header = brandColor ?? "#0f172a";

  return (
    <Html lang="en-GB">
      <Head />
      <Preview>{preview}</Preview>
      <Body style={{ backgroundColor: "#f1f5f9", fontFamily: "Arial, Helvetica, sans-serif", margin: 0, padding: 0 }}>
        <Container style={{ margin: "0 auto", maxWidth: "560px", padding: "24px" }}>
          <Section style={{ backgroundColor: header, borderRadius: "12px 12px 0 0", padding: "18px 24px" }}>
            <Text style={{ color: "#ffffff", fontSize: "18px", fontWeight: "bold", margin: 0 }}>
              {schoolName}
            </Text>
          </Section>
          <Section
            style={{
              backgroundColor: "#ffffff",
              border: "1px solid #e2e8f0",
              borderTop: "none",
              borderRadius: "0 0 12px 12px",
              padding: "24px",
            }}
          >
            {children}
          </Section>
          <Text style={{ color: "#94a3b8", fontSize: "12px", textAlign: "center", margin: "16px 0 0" }}>
            {schoolName} · sent from the website
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
