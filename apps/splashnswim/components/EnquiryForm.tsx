"use client";

import { useEffect, useState } from "react";
import { submitEnquiry } from "@/lib/actions";

const ENQUIRY_TYPES = ["General enquiry", "Taster lesson (£20)", "SEN enquiry"] as const;
const VENUES = ["No preference", "Ashingdon", "Benfleet", "Eastwood"] as const;

/** A premium contact form that sends an enquiry to the school inbox. */
export function EnquiryForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [enquiryType, setEnquiryType] = useState<string>(ENQUIRY_TYPES[0]);
  const [venue, setVenue] = useState<string>(VENUES[0]);
  const [swimmerAge, setSwimmerAge] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");
  const [sentToEmail, setSentToEmail] = useState("");

  // Preselect the taster option when arriving from a "Book a taster" link.
  useEffect(() => {
    const type = new URLSearchParams(window.location.search).get("type");
    if (type === "taster") setEnquiryType("Taster lesson (£20)");
  }, []);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setStatus("sending");
    setError("");
    try {
      await submitEnquiry({
        name,
        email,
        phone,
        enquiryType,
        venue: venue === "No preference" ? "" : venue,
        swimmerAge,
        message,
      });
      setSentToEmail(email.trim());
      setStatus("sent");
      setName("");
      setEmail("");
      setPhone("");
      setEnquiryType(ENQUIRY_TYPES[0]);
      setVenue(VENUES[0]);
      setSwimmerAge("");
      setMessage("");
    } catch (caught) {
      setStatus("error");
      setError(caught instanceof Error ? caught.message : "Something went wrong.");
    }
  }

  if (status === "sent") {
    return (
      <div className="rounded-2xl border-2 border-foam bg-foam p-6 text-center">
        <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-ocean text-surface">
          <svg viewBox="0 0 20 20" aria-hidden className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 10.5l4 4 8-9" /></svg>
        </span>
        <p className="mt-4 font-display text-lg font-bold text-ink">Enquiry submitted</p>
        <p className="mt-2 text-sm leading-relaxed text-slate">
          Thank you. We have your enquiry and will be in touch soon
          {sentToEmail ? <> at <span className="font-semibold text-ink">{sentToEmail}</span></> : null}.
        </p>
      </div>
    );
  }

  const field =
    "mt-1.5 block w-full rounded-xl border-2 border-foam bg-surface px-3.5 py-2.5 text-sm text-ink placeholder:text-slate/60 focus:border-ocean focus:outline-none";
  const label = "text-sm font-medium text-ink";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className={label}>Your name</span>
          <input value={name} onChange={(e) => setName(e.target.value)} className={field} autoComplete="name" />
        </label>
        <label className="block">
          <span className={label}>Your email</span>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={field} autoComplete="email" />
        </label>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className={label}>Phone (optional)</span>
          <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={field} autoComplete="tel" />
        </label>
        <label className="block">
          <span className={label}>Swimmer&apos;s age (optional)</span>
          <input value={swimmerAge} onChange={(e) => setSwimmerAge(e.target.value)} className={field} placeholder="For example 5, or adult" />
        </label>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className={label}>What is your enquiry about?</span>
          <select value={enquiryType} onChange={(e) => setEnquiryType(e.target.value)} className={field}>
            {ENQUIRY_TYPES.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className={label}>Preferred pool</span>
          <select value={venue} onChange={(e) => setVenue(e.target.value)} className={field}>
            {VENUES.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </label>
      </div>
      <label className="block">
        <span className={label}>Your message (optional)</span>
        <textarea rows={4} value={message} onChange={(e) => setMessage(e.target.value)} className={field} />
      </label>
      {error ? (
        <p role="alert" className="text-sm text-coral-deep">
          {error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full rounded-full bg-ocean px-5 py-3 text-sm font-bold text-surface transition-colors hover:bg-ocean-deep disabled:opacity-50"
      >
        {status === "sending" ? "Sending" : "Send enquiry"}
      </button>
    </form>
  );
}
