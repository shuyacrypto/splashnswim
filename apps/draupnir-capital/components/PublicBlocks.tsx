import type { ComponentType } from "react";
import type { Block } from "@swim-engine/engine-contracts";
import {
  Key,
  Landmark,
  Shield,
  TrendingUp,
  Handshake,
  CheckCircle,
  FileText,
  Globe,
  Layers,
  Users,
} from "@swim-engine/engine-admin";
import { EnquiryForm } from "./EnquiryForm";

// Matches engine-admin's FEATURE_ICON_OPTIONS keys (the fixed set an admin
// can choose from). An unrecognised or absent key simply renders no icon.
const FEATURE_ICONS: Record<string, ComponentType<{ className?: string }>> = {
  key: Key,
  landmark: Landmark,
  shield: Shield,
  "trending-up": TrendingUp,
  handshake: Handshake,
  "check-circle": CheckCircle,
  "file-text": FileText,
  globe: Globe,
  layers: Layers,
  users: Users,
};

function Container({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto max-w-5xl px-5 py-16 sm:py-24">{children}</div>;
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-mid">{children}</p>
  );
}

/** Renders every block type in Draupnir Capital's bordeaux/near-black brand. */
export function PublicBlocks({ blocks }: { blocks: Block[] }) {
  return (
    <div>
      {blocks.map((block) => (
        <section key={block.id}>{renderBlock(block)}</section>
      ))}
    </div>
  );
}

function renderBlock(block: Block) {
  switch (block.type) {
    case "hero":
      return (
        <div className="bg-ink text-surface">
          <Container>
            <h1 className="font-display text-4xl font-bold leading-tight sm:text-6xl">
              {block.heading}
            </h1>
            {block.subheading ? (
              <p className="mt-4 max-w-xl text-lg text-surface/70">{block.subheading}</p>
            ) : null}
            <div className="mt-8 flex flex-wrap gap-4">
              {block.primaryCta ? (
                <a
                  href={block.primaryCta.href}
                  className="rounded-full bg-brand-mid px-6 py-3 text-sm font-semibold text-surface transition hover:bg-brand-light"
                >
                  {block.primaryCta.label}
                </a>
              ) : null}
              {block.secondaryCta ? (
                <a
                  href={block.secondaryCta.href}
                  className="rounded-full border border-surface/30 px-6 py-3 text-sm font-semibold text-surface transition hover:border-surface"
                >
                  {block.secondaryCta.label}
                </a>
              ) : null}
            </div>
          </Container>
        </div>
      );

    case "rich_text":
      return (
        <Container>
          {block.heading ? (
            <h2 className="font-display text-3xl font-bold text-ink">{block.heading}</h2>
          ) : null}
          <div className="mt-4 max-w-2xl space-y-4 whitespace-pre-wrap text-base leading-relaxed text-ink/80">
            {block.content}
          </div>
        </Container>
      );

    case "stats":
      return (
        <div className="bg-ink text-surface">
          <Container>
            {block.heading ? (
              <h2 className="font-display text-2xl font-bold">{block.heading}</h2>
            ) : null}
            <div className="mt-8 grid gap-8 sm:grid-cols-3">
              {block.items.map((item, index) => (
                <div key={index}>
                  <p className="font-display text-4xl font-bold">{item.value}</p>
                  <p className="mt-2 text-sm text-surface/70">{item.label}</p>
                  {item.description ? (
                    <p className="mt-1 text-xs text-surface/50">{item.description}</p>
                  ) : null}
                </div>
              ))}
            </div>
          </Container>
        </div>
      );

    case "feature_grid":
      return (
        <Container>
          {block.heading ? (
            <h2 className="font-display text-2xl font-bold text-ink">{block.heading}</h2>
          ) : null}
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {block.items.map((item, index) => {
              const Icon = item.icon ? FEATURE_ICONS[item.icon] : undefined;
              return (
                <div key={index} className="rounded-2xl border border-ink/10 p-6">
                  {block.numbered ? (
                    <Eyebrow>{String(index + 1).padStart(2, "0")}</Eyebrow>
                  ) : Icon ? (
                    <Icon className="h-6 w-6 text-brand-mid" />
                  ) : null}
                  <p className="mt-2 font-display text-lg font-bold text-ink">{item.title}</p>
                  {item.description ? (
                    <p className="mt-2 text-sm text-ink/70">{item.description}</p>
                  ) : null}
                </div>
              );
            })}
          </div>
        </Container>
      );

    case "team":
      return (
        <Container>
          {block.heading ? (
            <h2 className="font-display text-2xl font-bold text-ink">{block.heading}</h2>
          ) : null}
          <div className="mt-8 grid gap-8 sm:grid-cols-2">
            {block.members.map((member, index) => (
              <div key={index} className="rounded-2xl border border-ink/10 p-6">
                {member.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={member.photo.src}
                    alt={member.photo.alt}
                    className="h-20 w-20 rounded-full object-cover"
                  />
                ) : null}
                <p className="mt-4 font-display text-lg font-bold text-ink">{member.name}</p>
                <p className="text-sm text-brand-mid">{member.role}</p>
                {member.bio ? <p className="mt-3 text-sm text-ink/70">{member.bio}</p> : null}
              </div>
            ))}
          </div>
        </Container>
      );

    case "cta_banner":
      return (
        <div className="bg-brand-dark text-surface">
          <Container>
            <div className="text-center">
              <h2 className="font-display text-3xl font-bold">{block.heading}</h2>
              {block.body ? (
                <p className="mx-auto mt-3 max-w-xl text-surface/70">{block.body}</p>
              ) : null}
              <a
                href={block.cta.href}
                className="mt-6 inline-block rounded-full bg-surface px-6 py-3 text-sm font-semibold text-ink transition hover:bg-surface/90"
              >
                {block.cta.label}
              </a>
            </div>
          </Container>
        </div>
      );

    case "contact":
      return (
        <Container>
          <div className="grid gap-12 sm:grid-cols-2">
            <div>
              {block.heading ? (
                <h2 className="font-display text-2xl font-bold text-ink">{block.heading}</h2>
              ) : null}
              <div className="mt-4 space-y-2 text-sm text-ink/70">
                {block.address ? <p>{block.address}</p> : null}
                {block.phone ? <p>{block.phone}</p> : null}
                {block.email ? (
                  <p>
                    <a href={`mailto:${block.email}`} className="font-semibold text-brand-mid hover:underline">
                      {block.email}
                    </a>
                  </p>
                ) : null}
              </div>
            </div>
            {block.showEnquiryForm ? <EnquiryForm /> : null}
          </div>
        </Container>
      );

    case "image":
      return (
        <Container>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={block.image.src} alt={block.image.alt} className="w-full rounded-2xl" />
          {block.image.caption ? (
            <p className="mt-2 text-sm text-ink/60">{block.image.caption}</p>
          ) : null}
        </Container>
      );

    case "gallery":
      return (
        <Container>
          {block.heading ? (
            <h2 className="font-display text-2xl font-bold text-ink">{block.heading}</h2>
          ) : null}
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {block.images.map((image, index) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={index} src={image.src} alt={image.alt} className="rounded-xl" />
            ))}
          </div>
        </Container>
      );

    case "timetable":
      return (
        <Container>
          {block.heading ? (
            <h2 className="font-display text-2xl font-bold text-ink">{block.heading}</h2>
          ) : null}
          <table className="mt-6 w-full border-collapse text-left text-sm">
            <tbody>
              {block.sessions.map((session, index) => (
                <tr key={index} className="border-b border-ink/10">
                  <td className="py-2 pr-4 capitalize">{session.day}</td>
                  <td className="py-2 pr-4">{session.startTime}–{session.endTime}</td>
                  <td className="py-2 pr-4">{session.title}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Container>
      );

    case "pricing_table":
      return (
        <Container>
          {block.heading ? (
            <h2 className="font-display text-2xl font-bold text-ink">{block.heading}</h2>
          ) : null}
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {block.tiers.map((tier, index) => (
              <div key={index} className="rounded-2xl border border-ink/10 p-6">
                <h3 className="font-display font-bold text-ink">{tier.name}</h3>
                <p className="mt-1 text-lg text-brand-mid">{tier.price}</p>
              </div>
            ))}
          </div>
        </Container>
      );

    case "faq":
      return (
        <Container>
          {block.heading ? (
            <h2 className="font-display text-2xl font-bold text-ink">{block.heading}</h2>
          ) : null}
          <dl className="mt-6 space-y-4">
            {block.items.map((item, index) => (
              <div key={index}>
                <dt className="font-semibold text-ink">{item.question}</dt>
                <dd className="mt-1 text-sm text-ink/70">{item.answer}</dd>
              </div>
            ))}
          </dl>
        </Container>
      );

    default: {
      const unreachable: never = block;
      return unreachable;
    }
  }
}
