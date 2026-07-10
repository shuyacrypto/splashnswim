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
          <div className="relative overflow-hidden bg-gradient-to-b from-foam to-surface">
            <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[1.03fr_0.97fr] lg:gap-16">
              {/* Left: message */}
              <div>
                <p className="rise text-xs font-bold uppercase tracking-eyebrow text-ocean-deep">
                  Private 1-to-1 tuition &middot; Essex
                </p>
                <h1 className="rise-2 mt-5 text-balance font-display text-4xl font-bold leading-[1.05] text-ink sm:text-5xl lg:text-6xl">
                  {block.heading}
                </h1>
                <span className="rise-2 mt-5 block h-2 w-24 rounded-full bg-coral" aria-hidden />
                {block.subheading ? (
                  <p className="rise-3 mt-6 max-w-md text-lg leading-relaxed text-slate">
                    {block.subheading}
                  </p>
                ) : null}
                <div className="rise-3 mt-8 flex flex-wrap items-center gap-4">
                  {block.primaryCta ? (
                    <a href={block.primaryCta.href} className="rounded-full bg-coral px-7 py-3.5 font-bold text-ink shadow-lg shadow-coral/20 transition-all hover:-translate-y-0.5 hover:bg-coral-deep hover:text-surface">
                      {block.primaryCta.label}
                    </a>
                  ) : null}
                  {block.secondaryCta ? (
                    <a href={block.secondaryCta.href} className="rounded-full border-2 border-ocean px-7 py-3.5 font-bold text-ocean-deep transition-colors hover:bg-ocean hover:text-surface">
                      {block.secondaryCta.label}
                    </a>
                  ) : null}
                </div>
                <p className="mt-8 text-sm font-semibold text-slate">
                  Eastwood &middot; Benfleet &middot; Rochford
                </p>
              </div>

              {/* Right: framed pool panel (holds a photo when one is set) */}
              <div className="rise-3 relative">
                <div aria-hidden className="absolute -right-6 -top-6 h-40 w-40 rounded-full bg-coral/20 blur-2xl" />
                <div aria-hidden className="absolute -bottom-8 -left-8 h-44 w-44 rounded-full bg-aqua/30 blur-2xl" />
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2rem] shadow-2xl ring-1 ring-ink/10">
                  {photo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={photo.src} alt={photo.alt} className="absolute inset-0 h-full w-full object-cover" />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-aqua via-ocean to-abyss">
                      <Caustics />
                      <Bubbles />
                      <div aria-hidden className="absolute inset-y-0 left-[30%] w-px bg-surface/20" />
                      <div aria-hidden className="absolute inset-y-0 left-[55%] w-px bg-surface/15" />
                      <div aria-hidden className="absolute inset-y-0 left-[78%] w-px bg-surface/10" />
                    </div>
                  )}
                </div>
                {/* floating credibility badge */}
                <div className="absolute -bottom-5 left-4 flex items-center gap-3 rounded-2xl bg-surface p-4 shadow-xl ring-1 ring-ink/5 sm:-left-6">
                  <span className="grid h-10 w-10 flex-none place-items-center rounded-full bg-coral/15 text-coral-deep">
                    <svg viewBox="0 0 20 20" aria-hidden className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 10.5l4 4 8-9" /></svg>
                  </span>
                  <div>
                    <p className="font-display text-sm font-bold text-ink">One to one, always</p>
                    <p className="text-xs text-slate">Every lesson is private</p>
                  </div>
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
