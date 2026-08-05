"use client";

import { BroadcastScreen } from "@swim-engine/engine-admin";
import { sendBroadcast } from "@/lib/actions";
import { BROADCAST_RECIPIENT_COUNT } from "@/lib/constants";

export default function AdminBroadcastPage() {
  return (
    <BroadcastScreen
      recipientCount={BROADCAST_RECIPIENT_COUNT}
      audienceLabel="parents"
      onSend={async (subject, message) => {
        await sendBroadcast(subject, message);
      }}
    />
  );
}
