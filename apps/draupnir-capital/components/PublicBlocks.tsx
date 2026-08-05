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

function Container({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`mx-auto max-w-6xl px-6 sm:px-10 ${className}`}>{children}</div>;
}

function Eyebrow({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <p
      className={`text-xs font-semibold uppercase tracking-[0.16em] ${
        dark ? "text-surface/50" : "text-brand-mid"
      }`}
    >
      {children}
    </p>
  );
}

/**
 * Draupnir Capital's mark, used as a faint, oversized watermark. Echoes the
 * brand guide's "shine gradient as texture" and "concentric forms,
 * repetition" imagery direction, rather than stock photography.
 */
function Watermark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1201 1267"
      aria-hidden="true"
      className={className}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1024.88 242.251C1259.19 476.567 1259.2 856.469 1024.88 1090.78C790.567 1325.1 410.676 1325.08 176.361 1090.77C-56.1215 858.29 -57.9544 482.493 170.891 247.769L417.985 0.603027L600.593 183.109L783.246 0.603027L1024.88 242.251ZM704.248 285.35L849.196 430.452C976.854 564.752 974.792 777.125 843.016 908.906C709.142 1042.78 492.089 1042.78 358.216 908.906C226.439 777.125 224.377 564.752 352.035 430.452L496.972 285.35L417.985 206.363L271.036 353.538C101.782 531.6 104.513 813.171 279.229 987.892C456.726 1165.39 744.506 1165.4 922.002 987.904C1099.5 810.408 1099.5 522.628 922.002 345.131L783.246 206.363L704.248 285.35ZM600.64 387.537L457.532 530.633C384.056 607.932 385.25 730.176 461.096 806.025C538.151 883.079 663.081 883.08 740.136 806.025C815.982 730.176 817.175 607.932 743.699 530.633L600.64 387.537Z"
        fill="currentColor"
      />
    </svg>
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
        <div className="relative overflow-hidden bg-ink text-surface">
          <Watermark className="pointer-events-none absolute -right-40 -top-40 h-[640px] w-[640px] text-brand-mid/10 sm:-right-24 sm:h-[720px] sm:w-[720px]" />
          <Container className="relative py-28 sm:py-40">
            <h1 className="max-w-3xl text-balance font-display text-5xl font-medium leading-[1.03] tracking-[-0.02em] sm:text-7xl">
              {block.heading}
            </h1>
            {block.subheading ? (
              <p className="mt-7 max-w-lg text-lg leading-relaxed text-surface/60">
                {block.subheading}
              </p>
            ) : null}
            <div className="mt-10 flex flex-wrap items-center gap-8">
              {block.primaryCta ? (
                <a
                  href={block.primaryCta.href}
                  className="rounded-md bg-brand-mid px-7 py-3.5 text-sm font-semibold text-surface transition hover:bg-brand-light"
                >
                  {block.primaryCta.label}
                </a>
              ) : null}
              {block.secondaryCta ? (
                <a
                  href={block.secondaryCta.href}
                  className="text-sm font-semibold text-surface underline decoration-surface/30 decoration-2 underline-offset-4 transition hover:decoration-surface"
                >
                  {block.secondaryCta.label} &rarr;
                </a>
              ) : null}
            </div>
          </Container>
        </div>
      );

    case "rich_text":
      return (
        <Container className="py-24 sm:py-32">
          {block.heading ? (
            <h2 className="max-w-2xl text-balance font-display text-3xl font-medium tracking-[-0.01em] text-ink sm:text-4xl">
              {block.heading}
            </h2>
          ) : null}
          <div className="mt-6 max-w-2xl space-y-5 whitespace-pre-wrap text-[17px] leading-[1.75] text-ink/70">
            {block.content}
          </div>
        </Container>
      );

    case "stats":
      return (
        <div className="bg-ink text-surface">
          <Container className="py-20 sm:py-28">
            {block.heading ? (
              <h2 className="font-display text-2xl font-medium tracking-[-0.01em]">
                {block.heading}
              </h2>
            ) : null}
            <div className="mt-12 grid gap-10 sm:grid-cols-3 sm:gap-16">
              {block.items.map((item, index) => (
                <div key={index} className="border-t border-brand-mid pt-5">
                  <p className="font-display text-5xl font-medium tracking-[-0.02em] tabular-nums sm:text-6xl">
                    {item.value}
                  </p>
                  <p className="mt-3 text-sm font-semibold uppercase tracking-[0.1em] text-surface/60">
                    {item.label}
                  </p>
                  {item.description ? (
                    <p className="mt-2 text-sm leading-relaxed text-surface/40">{item.description}</p>
                  ) : null}
                </div>
              ))}
            </div>
          </Container>
        </div>
      );

    case "feature_grid":
      return (
        <Container className="py-24 sm:py-32">
          {block.heading ? (
            <h2 className="max-w-2xl text-balance font-display text-3xl font-medium tracking-[-0.01em] text-ink sm:text-4xl">
              {block.heading}
            </h2>
          ) : null}
          <div className="mt-14 grid gap-x-10 gap-y-14 sm:grid-cols-3">
            {block.items.map((item, index) => {
              const Icon = item.icon ? FEATURE_ICONS[item.icon] : undefined;
              return (
                <div key={index} className="border-t border-ink/10 pt-6">
                  {block.numbered ? (
                    <Eyebrow>{String(index + 1).padStart(2, "0")}</Eyebrow>
                  ) : Icon ? (
                    <Icon className="h-5 w-5 text-brand-mid" />
                  ) : null}
                  <p className="mt-3 font-display text-lg font-medium text-ink">{item.title}</p>
                  {item.description ? (
                    <p className="mt-3 text-[15px] leading-relaxed text-ink/60">{item.description}</p>
                  ) : null}
                </div>
              );
            })}
          </div>
        </Container>
      );

    case "team":
      return (
        <Container className="py-24 sm:py-32">
          {block.heading ? (
            <h2 className="max-w-2xl text-balance font-display text-3xl font-medium tracking-[-0.01em] text-ink sm:text-4xl">
              {block.heading}
            </h2>
          ) : null}
          <div className="mt-14 grid gap-14 sm:grid-cols-2 sm:gap-20">
            {block.members.map((member, index) => (
              <div key={index} className="border-t border-ink/10 pt-8">
                {member.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={member.photo.src}
                    alt={member.photo.alt}
                    className="h-16 w-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-ink font-display text-lg text-surface">
                    {member.name
                      .split(" ")
                      .map((part) => part[0])
                      .join("")
                      .slice(0, 2)}
                  </div>
                )}
                <p className="mt-5 font-display text-xl font-medium text-ink">{member.name}</p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-brand-mid">
                  {member.role}
                </p>
                {member.bio ? (
                  <p className="mt-4 max-w-md text-[15px] leading-relaxed text-ink/60">{member.bio}</p>
                ) : null}
              </div>
            ))}
          </div>
        </Container>
      );

    case "cta_banner":
      return (
        <div className="relative overflow-hidden bg-brand-dark text-surface">
          <Watermark className="pointer-events-none absolute -bottom-32 -left-32 h-[420px] w-[420px] text-surface/[0.06]" />
          <Container className="relative py-24 text-center sm:py-32">
            <h2 className="mx-auto max-w-xl text-balance font-display text-3xl font-medium tracking-[-0.01em] sm:text-4xl">
              {block.heading}
            </h2>
            {block.body ? (
              <p className="mx-auto mt-4 max-w-md text-surface/60">{block.body}</p>
            ) : null}
            <a
              href={block.cta.href}
              className="mt-9 inline-block rounded-md bg-surface px-7 py-3.5 text-sm font-semibold text-ink transition hover:bg-surface/90"
            >
              {block.cta.label}
            </a>
          </Container>
        </div>
      );

    case "contact":
      return (
        <Container className="py-24 sm:py-32">
          <div className="grid gap-16 sm:grid-cols-2 sm:gap-24">
            <div>
              {block.heading ? (
                <h2 className="font-display text-3xl font-medium tracking-[-0.01em] text-ink">
                  {block.heading}
                </h2>
              ) : null}
              <div className="mt-6 space-y-2 text-[15px] text-ink/60">
                {block.address ? <p>{block.address}</p> : null}
                {block.phone ? <p>{block.phone}</p> : null}
                {block.email ? (
                  <p>
                    <a
                      href={`mailto:${block.email}`}
                      className="font-semibold text-brand-mid underline decoration-brand-mid/30 decoration-2 underline-offset-4 hover:decoration-brand-mid"
                    >
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
        <Container className="py-24 sm:py-32">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={block.image.src} alt={block.image.alt} className="w-full" />
          {block.image.caption ? (
            <p className="mt-3 text-sm text-ink/50">{block.image.caption}</p>
          ) : null}
        </Container>
      );

    case "gallery":
      return (
        <Container className="py-24 sm:py-32">
          {block.heading ? (
            <h2 className="font-display text-3xl font-medium tracking-[-0.01em] text-ink">
              {block.heading}
            </h2>
          ) : null}
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {block.images.map((image, index) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={index} src={image.src} alt={image.alt} />
            ))}
          </div>
        </Container>
      );

    case "timetable":
      return (
        <Container className="py-24 sm:py-32">
          {block.heading ? (
            <h2 className="font-display text-3xl font-medium tracking-[-0.01em] text-ink">
              {block.heading}
            </h2>
          ) : null}
          <table className="mt-10 w-full border-collapse text-left text-sm">
            <tbody>
              {block.sessions.map((session, index) => (
                <tr key={index} className="border-t border-ink/10">
                  <td className="py-3 pr-4 capitalize">{session.day}</td>
                  <td className="py-3 pr-4">{session.startTime}–{session.endTime}</td>
                  <td className="py-3 pr-4">{session.title}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Container>
      );

    case "pricing_table":
      return (
        <Container className="py-24 sm:py-32">
          {block.heading ? (
            <h2 className="font-display text-3xl font-medium tracking-[-0.01em] text-ink">
              {block.heading}
            </h2>
          ) : null}
          <div className="mt-10 grid gap-10 sm:grid-cols-3">
            {block.tiers.map((tier, index) => (
              <div key={index} className="border-t border-ink/10 pt-6">
                <h3 className="font-display text-lg font-medium text-ink">{tier.name}</h3>
                <p className="mt-1 text-brand-mid">{tier.price}</p>
              </div>
            ))}
          </div>
        </Container>
      );

    case "faq":
      return (
        <Container className="py-24 sm:py-32">
          {block.heading ? (
            <h2 className="font-display text-3xl font-medium tracking-[-0.01em] text-ink">
              {block.heading}
            </h2>
          ) : null}
          <dl className="mt-10 max-w-2xl space-y-8">
            {block.items.map((item, index) => (
              <div key={index} className="border-t border-ink/10 pt-6">
                <dt className="font-medium text-ink">{item.question}</dt>
                <dd className="mt-2 text-[15px] leading-relaxed text-ink/60">{item.answer}</dd>
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
