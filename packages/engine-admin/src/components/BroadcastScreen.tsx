"use client";

import { useState } from "react";
import type { BroadcastScreenProps } from "../types.js";
import { Button, Card, ErrorText, TextAreaField, TextField } from "./ui.js";
import { ConfirmDialog } from "./ConfirmDialog.js";
import { useToast } from "./Toast.js";
import { errorMessages } from "../helpers.js";

export function BroadcastScreen({ recipientCount, audienceLabel, onSend }: BroadcastScreenProps) {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { showToast } = useToast();

  function requestSend() {
    setErrors([]);
    if (subject.trim() === "" || message.trim() === "") {
      setErrors(["Please enter a subject and a message before sending."]);
      return;
    }
    setConfirmOpen(true);
  }

  async function confirmSend() {
    setConfirmOpen(false);
    setBusy(true);
    try {
      await onSend(subject, message);
      showToast("Your message has been sent.");
      setSubject("");
      setMessage("");
    } catch (error) {
      setErrors(errorMessages(error));
    } finally {
      setBusy(false);
    }
  }

  const noun = recipientCount === 1 ? "recipient" : "recipients";

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[var(--admin-text,#0f172a)]">
        Send a broadcast
      </h1>
      <p className="text-sm text-[var(--admin-muted,#64748b)]">
        This message will be sent to {recipientCount} {audienceLabel}.
      </p>

      <ErrorText messages={errors} />

      <Card>
        <TextField label="Subject" value={subject} onChange={setSubject} />
        <TextAreaField label="Message" value={message} onChange={setMessage} rows={10} />
        <Button onClick={requestSend} disabled={busy || recipientCount === 0}>
          {busy ? "Sending..." : "Send broadcast"}
        </Button>
      </Card>

      <ConfirmDialog
        open={confirmOpen}
        title="Send this broadcast?"
        message={`Send this message to ${recipientCount} ${noun}? This cannot be undone.`}
        confirmLabel={`Send to ${recipientCount} ${audienceLabel}`}
        onConfirm={confirmSend}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}
