"use client";

import type { ReactNode } from "react";
import type { Cta, Image } from "@swim-engine/engine-contracts";

/**
 * Generic admin UI primitives. The admin panel is deliberately plain and
 * identical for every school, so these use a fixed neutral style and are
 * never themed per client.
 */

type ButtonVariant = "primary" | "secondary" | "danger";

const BUTTON_STYLES: Record<ButtonVariant, string> = {
  primary: "bg-slate-900 text-white hover:bg-slate-700",
  secondary: "border border-slate-300 bg-white text-slate-900 hover:bg-slate-50",
  danger: "border border-red-300 bg-white text-red-700 hover:bg-red-50",
};

export function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  disabled = false,
}: {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  variant?: ButtonVariant;
  disabled?: boolean;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${BUTTON_STYLES[variant]}`}
    >
      {children}
    </button>
  );
}

export function TextField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: "text" | "email" | "url" | "time";
}) {
  return (
    <label className="block space-y-1">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-slate-500 focus:outline-none"
      />
    </label>
  );
}

export function TextAreaField({
  label,
  value,
  onChange,
  rows = 4,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
}) {
  return (
    <label className="block space-y-1">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <textarea
        value={value}
        rows={rows}
        onChange={(event) => onChange(event.target.value)}
        className="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-slate-500 focus:outline-none"
      />
    </label>
  );
}

export function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="block space-y-1">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-slate-500 focus:outline-none"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-2">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-4 w-4 rounded border-slate-300"
      />
      <span className="text-sm text-slate-700">{label}</span>
    </label>
  );
}

export function Card({ children }: { children: ReactNode }) {
  return (
    <div className="space-y-3 rounded-lg border border-slate-200 bg-white p-4">
      {children}
    </div>
  );
}

export function ErrorText({ messages }: { messages: string[] }) {
  if (messages.length === 0) return null;
  return (
    <ul className="list-disc space-y-1 rounded-md bg-red-50 py-2 pl-8 pr-3 text-sm text-red-700">
      {messages.map((message, index) => (
        <li key={index}>{message}</li>
      ))}
    </ul>
  );
}

export function RowList({
  children,
  onAdd,
  addLabel,
}: {
  children: ReactNode;
  onAdd: () => void;
  addLabel: string;
}) {
  return (
    <div className="space-y-3">
      {children}
      <Button variant="secondary" onClick={onAdd}>
        {addLabel}
      </Button>
    </div>
  );
}

export function Row({
  children,
  onRemove,
}: {
  children: ReactNode;
  onRemove: () => void;
}) {
  return (
    <div className="space-y-2 rounded-md border border-slate-200 p-3">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={onRemove}
          className="text-xs font-medium text-red-600 hover:underline"
        >
          Remove
        </button>
      </div>
      {children}
    </div>
  );
}

/** Editor for an optional call-to-action button (label plus link). */
export function CtaFields({
  legend,
  value,
  onChange,
}: {
  legend: string;
  value?: Cta;
  onChange: (cta?: Cta) => void;
}) {
  const label = value?.label ?? "";
  const href = value?.href ?? "";
  const update = (nextLabel: string, nextHref: string) => {
    onChange(
      nextLabel === "" && nextHref === ""
        ? undefined
        : { label: nextLabel, href: nextHref },
    );
  };
  return (
    <fieldset className="space-y-2 rounded-md border border-slate-200 p-3">
      <legend className="px-1 text-xs font-medium text-slate-500">{legend}</legend>
      <TextField label="Button label" value={label} onChange={(v) => update(v, href)} />
      <TextField label="Button link" value={href} onChange={(v) => update(label, v)} />
    </fieldset>
  );
}

/** Editor for a required image (address plus description). */
export function ImageFields({
  value,
  onChange,
  includeCaption = true,
}: {
  value: Image;
  onChange: (image: Image) => void;
  includeCaption?: boolean;
}) {
  return (
    <div className="space-y-2">
      <TextField
        label="Image address (URL)"
        value={value.src}
        onChange={(v) => onChange({ ...value, src: v })}
      />
      <TextField
        label="Description of the image (alt text)"
        value={value.alt}
        onChange={(v) => onChange({ ...value, alt: v })}
      />
      {includeCaption ? (
        <TextField
          label="Caption (optional)"
          value={value.caption ?? ""}
          onChange={(v) => onChange({ ...value, caption: v === "" ? undefined : v })}
        />
      ) : null}
    </div>
  );
}
