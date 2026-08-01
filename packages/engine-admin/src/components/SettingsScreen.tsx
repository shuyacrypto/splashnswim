"use client";

import { useState } from "react";
import type { SettingsScreenProps } from "../types.js";
import { Button, Card, ErrorText, TextField, Toggle } from "./ui.js";
import { useToast } from "./Toast.js";
import { errorMessages } from "../helpers.js";

export function SettingsScreen({ settings, onSave }: SettingsScreenProps) {
  const [schoolName, setSchoolName] = useState(settings?.schoolName ?? "");
  const [contactEmail, setContactEmail] = useState(settings?.contactEmail ?? "");
  const [contactPhone, setContactPhone] = useState(settings?.contactPhone ?? "");
  const [bookingEnabled, setBookingEnabled] = useState(settings?.bookingEnabled ?? false);
  const [facebook, setFacebook] = useState(settings?.socialLinks?.facebook ?? "");
  const [instagram, setInstagram] = useState(settings?.socialLinks?.instagram ?? "");
  const [tiktok, setTiktok] = useState(settings?.socialLinks?.tiktok ?? "");
  const [errors, setErrors] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const { showToast } = useToast();

  async function save() {
    setErrors([]);
    const socialLinks = {
      ...(facebook ? { facebook } : {}),
      ...(instagram ? { instagram } : {}),
      ...(tiktok ? { tiktok } : {}),
    };
    setBusy(true);
    try {
      await onSave({
        schoolName,
        contactEmail,
        contactPhone: contactPhone === "" ? undefined : contactPhone,
        bookingEnabled,
        socialLinks,
      });
      showToast("Settings saved.");
    } catch (error) {
      setErrors(errorMessages(error));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold text-[var(--admin-text,#0f172a)]">Site settings</h1>

      <ErrorText messages={errors} />

      <Card>
        <h2 className="text-sm font-semibold text-[var(--admin-text,#0f172a)]">School details</h2>
        <TextField label="School name" value={schoolName} onChange={setSchoolName} />
        <TextField label="Contact email" type="email" value={contactEmail} onChange={setContactEmail} />
        <TextField label="Contact phone (optional)" value={contactPhone} onChange={setContactPhone} />
      </Card>

      <Card>
        <h2 className="text-sm font-semibold text-[var(--admin-text,#0f172a)]">Social links (optional)</h2>
        <TextField label="Facebook" type="url" value={facebook} onChange={setFacebook} />
        <TextField label="Instagram" type="url" value={instagram} onChange={setInstagram} />
        <TextField label="TikTok" type="url" value={tiktok} onChange={setTiktok} />
      </Card>

      <Card>
        <h2 className="text-sm font-semibold text-[var(--admin-text,#0f172a)]">Modules</h2>
        <Toggle label="Enable booking and billing" checked={bookingEnabled} onChange={setBookingEnabled} />
        <p className="text-sm text-[var(--admin-muted,#64748b)]">
          Booking and billing is an optional add-on set up separately for your school. When it is
          switched on, the booking screens appear in the admin. If nothing changes after enabling
          it, the module is not set up for your school yet.
        </p>
      </Card>

      <Button onClick={save} disabled={busy}>
        {busy ? "Saving..." : "Save settings"}
      </Button>
    </div>
  );
}
