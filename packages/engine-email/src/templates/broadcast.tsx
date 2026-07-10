import { Text } from "@react-email/components";
import { EmailLayout, type EmailBranding } from "./layout.js";

/** A parent broadcast: the admin's message wrapped in the shared frame. */
export function BroadcastEmail({
  schoolName,
  message,
  brandColor,
  accentColor,
}: {
  schoolName: string;
  message: string;
} & EmailBranding) {
  const paragraphs = message.split(/\n{2,}/).filter((part) => part.trim() !== "");
  const preview = message.replace(/\s+/g, " ").trim().slice(0, 80);

  return (
    <EmailLayout preview={preview} schoolName={schoolName} brandColor={brandColor} accentColor={accentColor}>
      {paragraphs.map((paragraph, index) => (
        <Text key={index} style={{ whiteSpace: "pre-wrap", color: "#0f172a", fontSize: "14px", lineHeight: "1.55" }}>
          {paragraph}
        </Text>
      ))}
    </EmailLayout>
  );
}
