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
    return <p className="text-sm text-green-700">Thank you. Your enquiry has been sent.</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md space-y-3">
      <input
        aria-label="Your name"
        placeholder="Your name"
        value={name}
        onChange={(event) => setName(event.target.value)}
        className="block w-full rounded border border-slate-300 px-3 py-2 text-sm"
      />
      <input
        aria-label="Your email"
        type="email"
        placeholder="Your email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        className="block w-full rounded border border-slate-300 px-3 py-2 text-sm"
      />
      <textarea
        aria-label="Your message"
        placeholder="Your message"
        rows={4}
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        className="block w-full rounded border border-slate-300 px-3 py-2 text-sm"
      />
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      <button
        type="submit"
        disabled={status === "sending"}
        className="rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white disabled:opacity-50"
      >
        {status === "sending" ? "Sending..." : "Send enquiry"}
      </button>
    </form>
  );
}
