"use client";

import { BroadcastScreen } from "@swim-engine/engine-admin";
import { sendBroadcast } from "@/lib/actions";
import { PRACTICE_RECIPIENT_COUNT } from "@/lib/constants";

export default function AdminBroadcastPage() {
  return (
    <BroadcastScreen
      recipientCount={PRACTICE_RECIPIENT_COUNT}
      audienceLabel="parents (practice list)"
      onSend={async (subject, message) => {
        await sendBroadcast(subject, message);
      }}
    />
  );
}
