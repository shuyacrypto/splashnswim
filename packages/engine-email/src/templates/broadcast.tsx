import { Text } from "@react-email/components";
import { EmailLayout } from "./layout.js";

/** A parent broadcast: the admin's message wrapped in the shared frame. */
export function BroadcastEmail({
  schoolName,
  message,
}: {
  schoolName: string;
  message: string;
}) {
  const paragraphs = message.split(/\n{2,}/).filter((part) => part.trim() !== "");
  const preview = message.replace(/\s+/g, " ").trim().slice(0, 80);

  return (
    <EmailLayout preview={preview} schoolName={schoolName}>
      {paragraphs.map((paragraph, index) => (
        <Text key={index} style={{ whiteSpace: "pre-wrap" }}>
          {paragraph}
        </Text>
      ))}
    </EmailLayout>
  );
}
