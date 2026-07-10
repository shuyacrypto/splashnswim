"use client";

import { useState } from "react";
import { submitEnquiry } from "@/lib/actions";

/** A premium contact form that sends an enquiry (logged to the terminal in dev). */
export function EnquiryForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setStatus("sending");
    setError("");
    try {
      await submitEnquiry({ name, email, message });
      setStatus("sent");
      setName("");
      setEmail("");
      setMessage("");
    } catch (caught) {
      setStatus("error");
      setError(caught instanceof Error ? caught.message : "Something went wrong.");
    }
  }

  if (status === "sent") {
    return (
      <p className="rounded-lg border border-line bg-mist px-4 py-3 text-sm text-ink">
        Thank you. Your enquiry has been sent, and we will be in touch soon.
      </p>
    );
  }

  const field =
    "mt-1.5 block w-full rounded-lg border border-line bg-surface px-3.5 py-2.5 text-sm text-ink placeholder:text-slate/60 focus:border-ink focus:outline-none";
  const label = "text-sm font-medium text-ink";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label className="block">
        <span className={label}>Your name</span>
        <input value={name} onChange={(e) => setName(e.target.value)} className={field} autoComplete="name" />
      </label>
      <label className="block">
        <span className={label}>Your email</span>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={field} autoComplete="email" />
      </label>
      <label className="block">
        <span className={label}>Your message</span>
        <textarea rows={4} value={message} onChange={(e) => setMessage(e.target.value)} className={field} />
      </label>
      {error ? (
        <p role="alert" className="text-sm text-accent-deep">
          {error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full rounded-full bg-ink px-5 py-3 text-sm font-semibold text-surface transition-colors hover:bg-ink-deep disabled:opacity-50"
      >
        {status === "sending" ? "Sending" : "Send enquiry"}
      </button>
    </form>
  );
}
