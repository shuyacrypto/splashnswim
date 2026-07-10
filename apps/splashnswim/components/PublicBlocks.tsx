import type { Block } from "@swim-engine/engine-contracts";
import { EnquiryForm } from "./EnquiryForm";
import { Ripples } from "./Brand";
import { TrustRow } from "./TrustStrip";

type RichVariant = "light" | "deep";

/**
 * Premium SplashNSwim rendering of the ten engine block types. Restrained,
 * editorial, responsive. Distinctiveness comes from typography, deep-navy and
 * coral, and generous space, not from illustration.
 */
export function PublicBlocks({ blocks }: { blocks: Block[] }) {
  let richCount = 0;
  return (
    <div>
      {blocks.map((block) => {
        let variant: RichVariant = "light";
        if (block.type === "rich_text") {
          variant = richCount % 2 === 0 ? "light" : "deep";
          richCount += 1;
        }
        return (
          <section key={block.id} id={block.id}>
            {renderBlock(block, variant)}
          </section>
        );
      })}
    </div>
  );
}

const BOOK_URL = "https://octoswim.co.uk/book/splashnswim";

function Container({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">{children}</div>;
}

function Heading({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <h2 className={`text-balance text-3xl leading-tight text-ink sm:text-4xl ${className}`}>
      {children}
    </h2>
  );
}

function Check() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden className="mt-1 h-4 w-4 flex-none text-accent" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 10.5l4 4 8-9" />
    </svg>
  );
}

function renderBlock(block: Block, variant: RichVariant) {
  switch (block.type) {
    case "hero": {
      const photo = block.backgroundImage?.src ? block.backgroundImage : null;
      return (
        <>
          <div className="relative overflow-hidden bg-ink-deep">
            {photo ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photo.src} alt={photo.alt} className="absolute inset-0 h-full w-full object-cover" />
                <div aria-hidden className="absolute inset-0 bg-gradient-to-tr from-ink-deep/95 via-ink-deep/70 to-ink-deep/40" />
              </>
            ) : (
              <Ripples className="pointer-events-none absolute inset-0 h-full w-full text-surface/25" />
            )}
            <div className="relative mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32 lg:py-40">
              <div className="max-w-2xl">
                <p className="rise text-xs font-semibold uppercase tracking-eyebrow text-accent">
                  Private 1-to-1 tuition &middot; Essex
                </p>
                <h1 className="rise-2 mt-6 text-balance font-display text-4xl leading-[1.08] text-surface sm:text-6xl lg:text-7xl">
                  {block.heading}
                </h1>
                {block.subheading ? (
                  <p className="rise-3 mt-6 max-w-xl text-lg leading-relaxed text-surface/70">
                    {block.subheading}
                  </p>
                ) : null}
                <div className="rise-3 mt-10 flex flex-wrap items-center gap-4">
                  {block.primaryCta ? (
                    <a
                      href={block.primaryCta.href}
                      className="rounded-full bg-accent px-7 py-3.5 font-semibold text-ink transition-colors hover:bg-accent-deep hover:text-surface"
                    >
                      {block.primaryCta.label}
                    </a>
                  ) : null}
                  {block.secondaryCta ? (
                    <a
                      href={block.secondaryCta.href}
                      className="rounded-full border border-white/30 px-7 py-3.5 font-semibold text-surface transition-colors hover:bg-white/10"
                    >
                      {block.secondaryCta.label}
                    </a>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
          <TrustRow />
        </>
      );
    }

    case "rich_text":
      if (variant === "deep") {
        return (
          <div className="bg-ink text-surface">
            <div className="mx-auto max-w-3xl px-5 py-24 text-center sm:px-8 sm:py-32">
              {block.heading ? (
                <h2 className="text-balance font-display text-3xl leading-tight sm:text-4xl">{block.heading}</h2>
              ) : null}
              <p className="mx-auto mt-6 max-w-prose whitespace-pre-wrap text-lg leading-relaxed text-surface/70">
                {block.content}
              </p>
            </div>
          </div>
        );
      }
      return (
        <Container>
          <div className="max-w-3xl">
            <span className="mb-7 block h-px w-16 bg-accent" aria-hidden />
            {block.heading ? <Heading>{block.heading}</Heading> : null}
            <p className="mt-6 max-w-prose whitespace-pre-wrap text-lg leading-relaxed text-slate">
              {block.content}
            </p>
          </div>
        </Container>
      );

    case "image":
      return (
        <Container>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={block.image.src} alt={block.image.alt} className="w-full rounded-lg" />
          {block.image.caption ? <p className="mt-3 text-sm text-slate">{block.image.caption}</p> : null}
        </Container>
      );

    case "gallery":
      return (
        <Container>
          {block.heading ? <Heading className="mb-8">{block.heading}</Heading> : null}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {block.images.map((image, index) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={index} src={image.src} alt={image.alt} className="aspect-[4/5] w-full rounded-lg object-cover" />
            ))}
          </div>
        </Container>
      );

    case "timetable":
      return (
        <Container>
          {block.heading ? <Heading className="mb-8">{block.heading}</Heading> : null}
          <div className="overflow-hidden rounded-lg border border-line">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-line bg-mist text-xs uppercase tracking-eyebrow text-slate">
                <tr>
                  <th className="px-5 py-4 font-semibold">Day</th>
                  <th className="px-5 py-4 font-semibold">Time</th>
                  <th className="px-5 py-4 font-semibold">Lesson</th>
                  <th className="px-5 py-4 font-semibold">Level</th>
                </tr>
              </thead>
              <tbody>
                {block.sessions.map((session, index) => (
                  <tr key={index} className="border-b border-line last:border-0">
                    <td className="px-5 py-4 capitalize text-ink">{session.day}</td>
                    <td className="px-5 py-4 text-slate">{session.startTime} to {session.endTime}</td>
                    <td className="px-5 py-4 text-ink">{session.title}</td>
                    <td className="px-5 py-4 text-slate">{session.level ?? ""}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Container>
      );

    case "pricing_table":
      return (
        <div className="bg-mist">
          <Container>
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-semibold uppercase tracking-eyebrow text-slate">Lessons</p>
              {block.heading ? <Heading className="mt-4">{block.heading}</Heading> : null}
            </div>
            <div className="mt-14 grid gap-6 md:grid-cols-3">
              {block.tiers.map((tier, index) => (
                <div
                  key={index}
                  className={`flex flex-col rounded-lg bg-surface p-8 ${
                    tier.highlighted ? "border border-accent shadow-[0_20px_60px_-30px_rgba(19,29,51,0.35)]" : "border border-line"
                  }`}
                >
                  {tier.highlighted ? (
                    <span className="mb-4 inline-block self-start rounded-full bg-accent px-3 py-1 text-xs font-semibold text-ink">
                      Recommended
                    </span>
                  ) : null}
                  <h3 className="font-display text-xl text-ink">{tier.name}</h3>
                  {tier.description ? <p className="mt-2 text-sm text-slate">{tier.description}</p> : null}
                  <p className="mt-6 font-display text-4xl text-ink">{tier.price}</p>
                  <ul className="mt-6 flex-1 space-y-3 text-sm text-slate">
                    {tier.features.map((feature, i) => (
                      <li key={i} className="flex gap-3">
                        <Check />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  {tier.cta ? (
                    <a
                      href={tier.cta.href}
                      className={`mt-8 rounded-full px-5 py-3 text-center font-semibold transition-colors ${
                        tier.highlighted
                          ? "bg-accent text-ink hover:bg-accent-deep hover:text-surface"
                          : "border border-ink/20 text-ink hover:bg-ink hover:text-surface"
                      }`}
                    >
                      {tier.cta.label}
                    </a>
                  ) : null}
                </div>
              ))}
            </div>
          </Container>
        </div>
      );

    case "faq":
      return (
        <Container>
          <div className="mx-auto max-w-3xl">
            {block.heading ? <Heading className="mb-8 text-center">{block.heading}</Heading> : null}
            <div className="border-t border-line">
              {block.items.map((item, index) => (
                <details key={index} className="group border-b border-line">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-lg text-ink [&::-webkit-details-marker]:hidden">
                    {item.question}
                    <span className="grid h-6 w-6 flex-none place-items-center text-xl text-accent transition-transform duration-200 group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="max-w-prose pb-6 text-slate">{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </Container>
      );

    case "team":
      return (
        <Container>
          {block.heading ? <Heading className="mb-10 text-center">{block.heading}</Heading> : null}
          <div className="grid gap-8 sm:grid-cols-3">
            {block.members.map((member, index) => (
              <div key={index} className="text-center">
                {member.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={member.photo.src} alt={member.photo.alt} className="mx-auto h-40 w-40 rounded-full object-cover" />
                ) : (
                  <div className="mx-auto h-40 w-40 rounded-full bg-mist" />
                )}
                <p className="mt-5 font-display text-xl text-ink">{member.name}</p>
                <p className="mt-1 text-sm text-slate">{member.role}</p>
                {member.bio ? <p className="mt-3 text-sm text-slate">{member.bio}</p> : null}
              </div>
            ))}
          </div>
        </Container>
      );

    case "cta_banner":
      return (
        <div className="bg-ink-deep">
          <div className="mx-auto max-w-4xl px-5 py-24 text-center sm:px-8 sm:py-28">
            <h2 className="text-balance font-display text-3xl leading-tight text-surface sm:text-5xl">
              {block.heading}
            </h2>
            {block.body ? <p className="mx-auto mt-5 max-w-xl text-lg text-surface/70">{block.body}</p> : null}
            <a
              href={block.cta.href}
              className="mt-10 inline-block rounded-full bg-accent px-8 py-4 font-semibold text-ink transition-colors hover:bg-accent-deep hover:text-surface"
            >
              {block.cta.label}
            </a>
          </div>
        </div>
      );

    case "contact":
      return (
        <div className="bg-mist">
          <Container>
            <div className="grid gap-12 md:grid-cols-2">
              <div>
                {block.heading ? <Heading>{block.heading}</Heading> : null}
                <div className="mt-6 space-y-2 text-slate">
                  {block.address ? <p className="text-ink">{block.address}</p> : null}
                  {block.phone ? <p>{block.phone}</p> : null}
                  {block.email ? (
                    <p>
                      <a href={`mailto:${block.email}`} className="text-ink underline decoration-accent decoration-2 underline-offset-4">
                        {block.email}
                      </a>
                    </p>
                  ) : null}
                </div>
                <p className="mt-8 max-w-prose text-sm text-slate">
                  Prefer to book straight away? Choose a pool and a time on our booking page.
                </p>
                <a
                  href={BOOK_URL}
                  className="mt-4 inline-block rounded-full border border-ink/20 px-6 py-3 text-sm font-semibold text-ink transition-colors hover:bg-ink hover:text-surface"
                >
                  Book a lesson
                </a>
              </div>
              {block.showEnquiryForm ? (
                <div className="rounded-lg border border-line bg-surface p-6 sm:p-8">
                  <EnquiryForm />
                </div>
              ) : null}
            </div>
          </Container>
        </div>
      );

    default: {
      const unreachable: never = block;
      return unreachable;
    }
  }
}
