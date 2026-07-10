"use client";

import { useState } from "react";
import { submitEnquiry } from "@/lib/actions";

/** A plain contact form that sends an enquiry (logged to the terminal). */
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
      <p className="rounded-xl bg-blossom/50 px-4 py-3 text-sm font-bold text-coral-deep">
        Thank you. Your enquiry has been sent.
      </p>
    );
  }

  const fieldClasses =
    "block w-full rounded-xl border-2 border-sky bg-surface px-3 py-2 text-sm text-navy focus:border-ocean focus:outline-none";

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        aria-label="Your name"
        placeholder="Your name"
        value={name}
        onChange={(event) => setName(event.target.value)}
        className={fieldClasses}
      />
      <input
        aria-label="Your email"
        type="email"
        placeholder="Your email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        className={fieldClasses}
      />
      <textarea
        aria-label="Your message"
        placeholder="Your message"
        rows={4}
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        className={fieldClasses}
      />
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      <button
        type="submit"
        disabled={status === "sending"}
        className="rounded-full bg-coral px-5 py-2.5 text-sm font-bold text-surface transition-colors hover:bg-coral-deep disabled:opacity-50"
      >
        {status === "sending" ? "Sending..." : "Send enquiry"}
      </button>
    </form>
  );
}
