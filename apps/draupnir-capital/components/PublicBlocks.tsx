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
    case "hero": {
      // A hero with primary/secondary CTAs is the homepage's full moment; a
      // hero without them is an inner page's shorter title band. Both show
      // the brand mark, scaled to match.
      const isHome = Boolean(block.primaryCta || block.secondaryCta);
      return (
        <div className="bg-ink text-surface">
          <Container
            className={
              isHome
                ? "flex flex-col items-center gap-16 py-24 sm:py-28 lg:min-h-[82vh] lg:flex-row lg:justify-between lg:gap-12 lg:py-0"
                : "flex flex-col items-center gap-12 py-20 sm:py-28 lg:flex-row lg:justify-between"
            }
          >
            <div className={`text-center lg:text-left ${isHome ? "max-w-xl" : "max-w-2xl"}`}>
              {block.eyebrow ? <Eyebrow dark>{block.eyebrow}</Eyebrow> : null}
              <h1
                className={`mt-4 text-balance font-display font-medium leading-[1.03] tracking-[-0.02em] ${
                  isHome ? "text-5xl sm:text-7xl" : "text-4xl sm:text-5xl"
                }`}
              >
                {block.heading}
              </h1>
              {block.subheading ? (
                <p className="mx-auto mt-7 max-w-lg text-lg leading-relaxed text-surface/60 lg:mx-0">
                  {block.subheading}
                </p>
              ) : null}
              <div className="mt-10 flex flex-wrap items-center justify-center gap-8 lg:justify-start">
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
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/sign_gold_white.svg"
              alt=""
              className={
                isHome
                  ? "h-48 w-48 shrink-0 opacity-95 sm:h-64 sm:w-64 lg:h-80 lg:w-80"
                  : "h-28 w-28 shrink-0 opacity-90 sm:h-36 sm:w-36"
              }
            />
          </Container>
        </div>
      );
    }

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
          <div className="mt-14 grid gap-16 sm:grid-cols-2 sm:gap-14">
            {block.members.map((member, index) => (
              <div key={index}>
                {member.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={member.photo.src}
                    alt={member.photo.alt}
                    className="aspect-[4/5] w-full max-w-[280px] object-cover grayscale"
                  />
                ) : (
                  <div className="flex aspect-[4/5] w-full max-w-[280px] items-center justify-center bg-ink font-display text-2xl text-surface">
                    {member.name
                      .split(" ")
                      .map((part) => part[0])
                      .join("")
                      .slice(0, 2)}
                  </div>
                )}
                <div className="mt-6 border-t border-ink/10 pt-5">
                  <p className="font-display text-xl font-medium text-ink">{member.name}</p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-brand-mid">
                    {member.role}
                  </p>
                  {member.bio ? (
                    <p className="mt-4 max-w-md text-[15px] leading-relaxed text-ink/60">{member.bio}</p>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </Container>
      );

    case "cta_banner":
      return (
        <div className="bg-brand-dark text-surface">
          <Container className="py-24 text-center sm:py-32">
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
              <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-ink/60">
                Tell us about your business, the facility you have in mind, and your timeline.
                We reply directly, usually within a day.
              </p>
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
