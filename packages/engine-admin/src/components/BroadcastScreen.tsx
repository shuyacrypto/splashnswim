"use client";

import { useState } from "react";
import type { BroadcastScreenProps } from "../types.js";
import { Button, Card, ErrorText, TextAreaField, TextField } from "./ui.js";
import { errorMessages } from "../helpers.js";

export function BroadcastScreen({
  recipientCount,
  audienceLabel,
  onSend,
}: BroadcastScreenProps) {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [sentMessage, setSentMessage] = useState("");

  async function send() {
    setErrors([]);
    setSentMessage("");
    if (subject.trim() === "" || message.trim() === "") {
      setErrors(["Please enter a subject and a message before sending."]);
      return;
    }
    const noun = recipientCount === 1 ? "recipient" : "recipients";
    if (
      !window.confirm(
        `Send this message to ${recipientCount} ${noun}? This cannot be undone.`,
      )
    ) {
      return;
    }
    setBusy(true);
    try {
      await onSend(subject, message);
      setSentMessage("Your message has been sent.");
      setSubject("");
      setMessage("");
    } catch (error) {
      setErrors(errorMessages(error));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-lg font-semibold">Send a broadcast</h1>
      <p className="text-sm text-slate-600">
        This message will be sent to {recipientCount} {audienceLabel}.
      </p>

      <ErrorText messages={errors} />

      <Card>
        <TextField label="Subject" value={subject} onChange={setSubject} />
        <TextAreaField label="Message" value={message} onChange={setMessage} rows={10} />
        <div className="flex items-center gap-3">
          <Button onClick={send} disabled={busy || recipientCount === 0}>
            {busy ? "Sending..." : "Send broadcast"}
          </Button>
          {sentMessage ? (
            <span className="text-sm text-green-700">{sentMessage}</span>
          ) : null}
        </div>
      </Card>
    </div>
  );
}
