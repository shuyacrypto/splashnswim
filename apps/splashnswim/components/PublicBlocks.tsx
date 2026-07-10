import type { Block } from "@swim-engine/engine-contracts";
import { EnquiryForm } from "./EnquiryForm";
import { Waves, Bubbles, Caustics } from "./Brand";
import { TrustRow } from "./TrustStrip";

type RichVariant = "light" | "deep";

/**
 * Vibrant, animated SplashNSwim rendering of the ten engine block types.
 * Water gradients, drifting waves and bubbles, warm coral accents. Premium but
 * unmistakably about swimming. Responsive and photo-ready.
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
  return <h2 className={`text-balance text-3xl font-bold leading-tight sm:text-4xl ${className}`}>{children}</h2>;
}

function Check({ className = "text-aqua" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" aria-hidden className={`mt-0.5 h-5 w-5 flex-none ${className}`} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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
          <div className="relative overflow-hidden bg-gradient-to-b from-aqua via-ocean to-abyss">
            {photo ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photo.src} alt={photo.alt} className="absolute inset-0 h-full w-full object-cover" />
                <div aria-hidden className="absolute inset-0 bg-gradient-to-tr from-abyss/95 via-ocean-deep/70 to-ocean/30" />
              </>
            ) : (
              <>
                <Caustics />
                <Bubbles />
              </>
            )}
            <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-abyss/70 via-abyss/25 to-transparent" />
            <div className="relative mx-auto max-w-6xl px-5 pb-32 pt-20 sm:px-8 sm:pb-40 sm:pt-28">
              <div className="max-w-2xl">
                <p className="rise inline-block rounded-full bg-surface/15 px-4 py-1.5 text-xs font-bold uppercase tracking-eyebrow text-surface ring-1 ring-surface/25 backdrop-blur">
                  Private 1-to-1 tuition &middot; Essex
                </p>
                <h1 className="rise-2 mt-6 text-balance font-display text-5xl font-bold leading-[1.03] text-surface drop-shadow-md sm:text-6xl lg:text-7xl">
                  {block.heading}
                </h1>
                <span className="rise-2 mt-5 block h-2 w-28 rounded-full bg-coral" aria-hidden />
                {block.subheading ? (
                  <p className="rise-3 mt-6 max-w-xl text-lg leading-relaxed text-surface/85 sm:text-xl">
                    {block.subheading}
                  </p>
                ) : null}
                <div className="rise-3 mt-9 flex flex-wrap items-center gap-4">
                  {block.primaryCta ? (
                    <a href={block.primaryCta.href} className="rounded-full bg-coral px-8 py-4 font-bold text-ink shadow-lg transition-all hover:-translate-y-0.5 hover:bg-coral-deep hover:text-surface">
                      {block.primaryCta.label}
                    </a>
                  ) : null}
                  {block.secondaryCta ? (
                    <a href={block.secondaryCta.href} className="rounded-full bg-surface/10 px-8 py-4 font-bold text-surface ring-1 ring-surface/40 backdrop-blur transition-colors hover:bg-surface/20">
                      {block.secondaryCta.label}
                    </a>
                  ) : null}
                </div>
              </div>
            </div>
            <Waves colorClass="text-surface" />
          </div>
          <TrustRow />
        </>
      );
    }

    case "rich_text":
      if (variant === "deep") {
        return (
          <div className="relative overflow-hidden bg-gradient-to-b from-ocean-deep to-abyss text-surface">
            <Caustics />
            <Bubbles />
            <div className="relative mx-auto max-w-3xl px-5 py-24 text-center sm:px-8 sm:py-32">
              <div className="reveal">
                {block.heading ? <h2 className="text-balance font-display text-3xl font-bold leading-tight sm:text-4xl">{block.heading}</h2> : null}
                <p className="mx-auto mt-6 max-w-2xl whitespace-pre-wrap text-lg leading-relaxed text-surface/85">{block.content}</p>
              </div>
            </div>
            <Waves colorClass="text-surface" />
          </div>
        );
      }
      return (
        <Container>
          <div className="reveal mx-auto max-w-3xl text-center">
            <span className="mx-auto mb-6 block h-1.5 w-14 rounded-full bg-coral" aria-hidden />
            {block.heading ? <Heading className="text-ink">{block.heading}</Heading> : null}
            <p className="mx-auto mt-6 max-w-2xl whitespace-pre-wrap text-xl leading-relaxed text-slate">{block.content}</p>
          </div>
        </Container>
      );

    case "image":
      return (
        <Container>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={block.image.src} alt={block.image.alt} className="w-full rounded-3xl shadow-lg" />
          {block.image.caption ? <p className="mt-3 text-sm text-slate">{block.image.caption}</p> : null}
        </Container>
      );

    case "gallery":
      return (
        <Container>
          {block.heading ? <Heading className="mb-8 text-center text-ink">{block.heading}</Heading> : null}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {block.images.map((image, index) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={index} src={image.src} alt={image.alt} className="aspect-[4/5] w-full rounded-2xl object-cover shadow-sm" />
            ))}
          </div>
        </Container>
      );

    case "timetable":
      return (
        <Container>
          {block.heading ? <Heading className="mb-8 text-ink">{block.heading}</Heading> : null}
          <div className="overflow-hidden rounded-3xl border-2 border-foam shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-ocean font-display text-surface">
                <tr><th className="px-5 py-4">Day</th><th className="px-5 py-4">Time</th><th className="px-5 py-4">Lesson</th><th className="px-5 py-4">Level</th></tr>
              </thead>
              <tbody>
                {block.sessions.map((session, index) => (
                  <tr key={index} className="border-t border-foam">
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
        <div className="bg-foam">
          <Container>
            <div className="reveal mx-auto max-w-2xl text-center">
              <p className="text-xs font-bold uppercase tracking-eyebrow text-ocean">Lessons</p>
              {block.heading ? <Heading className="mt-3 text-ink">{block.heading}</Heading> : null}
            </div>
            <div className="reveal mt-14 grid gap-6 md:grid-cols-3">
              {block.tiers.map((tier, index) => (
                <div key={index} className={`relative flex flex-col rounded-3xl bg-surface p-8 shadow-sm transition-transform hover:-translate-y-1.5 ${tier.highlighted ? "border-2 border-coral ring-4 ring-coral/15" : "border-2 border-foam"}`}>
                  {tier.highlighted ? (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-coral px-3 py-1 text-xs font-bold text-ink shadow-sm">Most loved</span>
                  ) : null}
                  <h3 className="font-display text-xl font-bold text-ink">{tier.name}</h3>
                  {tier.description ? <p className="mt-2 text-sm text-slate">{tier.description}</p> : null}
                  <p className="mt-5 font-display text-4xl font-bold text-ocean">{tier.price}</p>
                  <ul className="mt-6 flex-1 space-y-3 text-sm text-ink">
                    {tier.features.map((feature, i) => (
                      <li key={i} className="flex gap-3"><Check /><span>{feature}</span></li>
                    ))}
                  </ul>
                  {tier.cta ? (
                    <a href={tier.cta.href} className={`mt-8 rounded-full px-5 py-3 text-center font-bold transition-all hover:-translate-y-0.5 ${tier.highlighted ? "bg-coral text-ink hover:bg-coral-deep hover:text-surface" : "bg-ocean text-surface hover:bg-ocean-deep"}`}>{tier.cta.label}</a>
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
          <div className="reveal mx-auto max-w-3xl">
            {block.heading ? <Heading className="mb-8 text-center text-ink">{block.heading}</Heading> : null}
            <div className="border-t border-foam">
              {block.items.map((item, index) => (
                <details key={index} className="group border-b border-foam">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-lg font-bold text-ink [&::-webkit-details-marker]:hidden">
                    {item.question}
                    <span className="grid h-7 w-7 flex-none place-items-center rounded-full bg-foam text-xl text-coral transition-transform duration-200 group-open:rotate-45">+</span>
                  </summary>
                  <p className="max-w-2xl pb-6 text-slate">{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </Container>
      );

    case "team":
      return (
        <Container>
          {block.heading ? <Heading className="mb-10 text-center text-ink">{block.heading}</Heading> : null}
          <div className="grid gap-8 sm:grid-cols-3">
            {block.members.map((member, index) => (
              <div key={index} className="text-center">
                {member.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={member.photo.src} alt={member.photo.alt} className="mx-auto h-40 w-40 rounded-full object-cover shadow-sm" />
                ) : (
                  <div className="mx-auto h-40 w-40 rounded-full bg-foam" />
                )}
                <p className="mt-5 font-display text-xl font-bold text-ink">{member.name}</p>
                <p className="mt-1 text-sm text-slate">{member.role}</p>
                {member.bio ? <p className="mt-3 text-sm text-slate">{member.bio}</p> : null}
              </div>
            ))}
          </div>
        </Container>
      );

    case "cta_banner":
      return (
        <div className="bg-gradient-to-br from-coral to-coral-deep">
          <div className="mx-auto max-w-4xl px-5 py-24 text-center sm:px-8 sm:py-28">
            <h2 className="text-balance font-display text-3xl font-bold leading-tight text-ink sm:text-5xl">{block.heading}</h2>
            {block.body ? <p className="mx-auto mt-4 max-w-xl text-lg text-ink/80">{block.body}</p> : null}
            <a href={block.cta.href} className="mt-9 inline-block rounded-full bg-ink px-8 py-4 font-bold text-surface shadow-lg transition-all hover:-translate-y-0.5 hover:bg-abyss">{block.cta.label}</a>
          </div>
        </div>
      );

    case "contact":
      return (
        <div className="bg-foam">
          <Container>
            <div className="grid gap-12 md:grid-cols-2">
              <div>
                {block.heading ? <Heading className="text-ink">{block.heading}</Heading> : null}
                <div className="mt-6 space-y-2 text-slate">
                  {block.address ? <p className="font-semibold text-ink">{block.address}</p> : null}
                  {block.phone ? <p>{block.phone}</p> : null}
                  {block.email ? <p><a href={`mailto:${block.email}`} className="font-bold text-ocean hover:underline">{block.email}</a></p> : null}
                </div>
                <p className="mt-8 max-w-md text-sm text-slate">Prefer to book straight away? Choose a pool and a time on our booking page.</p>
                <a href={BOOK_URL} className="mt-4 inline-block rounded-full bg-ocean px-6 py-3 text-sm font-bold text-surface transition-all hover:-translate-y-0.5 hover:bg-ocean-deep">Book a lesson</a>
              </div>
              {block.showEnquiryForm ? (
                <div className="rounded-3xl border-2 border-surface bg-surface p-6 shadow-sm sm:p-8">
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
