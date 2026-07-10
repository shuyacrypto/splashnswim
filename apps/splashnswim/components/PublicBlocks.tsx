import type { Block } from "@swim-engine/engine-contracts";
import { EnquiryForm } from "./EnquiryForm";
import { Wave } from "./Brand";
import { Bubbles } from "./Bubbles";
import { LightRays } from "./LightRays";
import { TrustStrip } from "./TrustStrip";

type RichVariant = "light" | "deep";

/**
 * The bespoke SplashNSwim rendering of the ten engine block types. Same data,
 * same engine. The skin gives the page an "above and below the water" rhythm:
 * an immersive underwater hero, then sections that alternate between bright
 * surface, warm blossom, and deep navy so it never reads as one flat wash.
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

function Container({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto max-w-5xl px-5 py-16 sm:py-20">{children}</div>;
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return <h2 className="text-3xl font-bold text-navy sm:text-4xl">{children}</h2>;
}

function renderBlock(block: Block, variant: RichVariant) {
  switch (block.type) {
    case "hero":
      return (
        <>
          <div className="relative overflow-hidden bg-gradient-to-b from-ocean-deep via-ocean-deep to-navy">
            <LightRays />
            <Bubbles />
            {/* sunlit surface glow */}
            <div
              aria-hidden
              className="pointer-events-none absolute -top-32 left-1/2 h-80 w-[52rem] max-w-[95%] -translate-x-1/2 rounded-full bg-white/25 blur-3xl"
            />
            <div className="relative mx-auto grid w-full max-w-5xl items-center gap-10 px-5 pb-24 pt-20 md:grid-cols-[1.05fr_0.95fr]">
              <div className="reveal">
                <span className="inline-block rounded-full bg-white/15 px-4 py-1 text-sm font-bold text-surface ring-1 ring-white/30 backdrop-blur">
                  Premium 1-to-1 swimming · Essex
                </span>
                <h1 className="mt-5 text-5xl font-bold leading-[1.02] text-surface drop-shadow-md sm:text-6xl lg:text-7xl">
                  {block.heading}
                </h1>
                <span className="mt-4 block h-2 w-32 rounded-full bg-coral" aria-hidden />
                {block.subheading ? (
                  <p className="mt-6 max-w-md text-lg text-white/90 drop-shadow-sm">
                    {block.subheading}
                  </p>
                ) : null}
                <div className="mt-9 flex flex-wrap gap-3">
                  {block.primaryCta ? (
                    <a
                      href={block.primaryCta.href}
                      className="rounded-full bg-coral px-8 py-4 font-bold text-surface shadow-lg transition-transform hover:-translate-y-0.5 hover:bg-coral-deep"
                    >
                      {block.primaryCta.label}
                    </a>
                  ) : null}
                  {block.secondaryCta ? (
                    <a
                      href={block.secondaryCta.href}
                      className="rounded-full border-2 border-white/70 px-8 py-4 font-bold text-surface backdrop-blur transition-colors hover:bg-white/10"
                    >
                      {block.secondaryCta.label}
                    </a>
                  ) : null}
                </div>
                <p className="mt-7 text-sm font-semibold text-white/75">
                  Eastwood &middot; Benfleet &middot; Rochford
                </p>
              </div>
              <div className="relative flex justify-center md:justify-end">
                <div aria-hidden className="absolute inset-4 rounded-full bg-blossom/30 blur-3xl" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/brand/axolotl-goggles.png"
                  alt="The SplashNSwim axolotl mascot swimming in goggles and armbands"
                  className="relative w-full max-w-lg animate-float drop-shadow-2xl"
                />
              </div>
            </div>
            <Wave fillClass="fill-surface" />
          </div>
          <TrustStrip />
        </>
      );

    case "rich_text":
      if (variant === "deep") {
        return (
          <div className="relative overflow-hidden bg-navy text-surface">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-ocean/30 blur-3xl"
            />
            <div className="relative mx-auto grid max-w-5xl items-center gap-10 px-5 py-20 md:grid-cols-2">
              <div>
                {block.heading ? (
                  <h2 className="text-3xl font-bold sm:text-4xl">{block.heading}</h2>
                ) : null}
                <p className="mt-5 whitespace-pre-wrap text-lg leading-relaxed text-sky">
                  {block.content}
                </p>
              </div>
              <div className="flex justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/brand/axolotl-ring.png"
                  alt=""
                  aria-hidden
                  className="w-64 animate-float drop-shadow-xl sm:w-80"
                />
              </div>
            </div>
          </div>
        );
      }
      return (
        <Container>
          <div className="relative max-w-3xl">
            <div
              aria-hidden
              className="pointer-events-none absolute -left-10 -top-10 h-28 w-28 rounded-full bg-coral/10 blur-2xl"
            />
            {block.heading ? <SectionHeading>{block.heading}</SectionHeading> : null}
            <p className="mt-4 whitespace-pre-wrap text-lg leading-relaxed text-navy/75">
              {block.content}
            </p>
          </div>
        </Container>
      );

    case "image":
      return (
        <Container>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={block.image.src} alt={block.image.alt} className="w-full rounded-3xl shadow-sm" />
          {block.image.caption ? (
            <p className="mt-2 text-sm text-navy/60">{block.image.caption}</p>
          ) : null}
        </Container>
      );

    case "gallery":
      return (
        <Container>
          {block.heading ? <SectionHeading>{block.heading}</SectionHeading> : null}
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {block.images.map((image, index) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={index}
                src={image.src}
                alt={image.alt}
                className="aspect-square w-full rounded-2xl object-cover shadow-sm"
              />
            ))}
          </div>
        </Container>
      );

    case "timetable":
      return (
        <Container>
          {block.heading ? <SectionHeading>{block.heading}</SectionHeading> : null}
          <div className="mt-6 overflow-hidden rounded-3xl border-2 border-sky bg-surface shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-ocean text-surface">
                <tr>
                  <th className="px-4 py-3 font-display">Day</th>
                  <th className="px-4 py-3 font-display">Time</th>
                  <th className="px-4 py-3 font-display">Lesson</th>
                  <th className="px-4 py-3 font-display">Level</th>
                </tr>
              </thead>
              <tbody>
                {block.sessions.map((session, index) => (
                  <tr key={index} className="border-t border-sky">
                    <td className="px-4 py-3 capitalize">{session.day}</td>
                    <td className="px-4 py-3">
                      {session.startTime} to {session.endTime}
                    </td>
                    <td className="px-4 py-3">{session.title}</td>
                    <td className="px-4 py-3">{session.level ?? ""}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Container>
      );

    case "pricing_table":
      return (
        <div className="bg-blossom/20">
          <Container>
            {block.heading ? (
              <h2 className="text-center text-3xl font-bold text-navy sm:text-4xl">
                {block.heading}
              </h2>
            ) : null}
            <div className="mt-10 grid gap-6 sm:grid-cols-3">
              {block.tiers.map((tier, index) => (
                <div
                  key={index}
                  className={`relative flex flex-col rounded-3xl bg-surface p-7 shadow-md transition-all duration-200 hover:-translate-y-1.5 ${
                    tier.highlighted ? "border-2 border-coral ring-4 ring-coral/15" : "border-2 border-sky hover:border-coral"
                  }`}
                >
                  {tier.highlighted ? (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-sunshine px-3 py-0.5 text-xs font-bold text-navy shadow-sm">
                      Most loved
                    </span>
                  ) : null}
                  <h3 className="font-display text-lg font-bold text-navy">{tier.name}</h3>
                  <p className="mt-1 text-3xl font-bold text-ocean">{tier.price}</p>
                  {tier.description ? (
                    <p className="mt-2 text-sm text-navy/70">{tier.description}</p>
                  ) : null}
                  <ul className="mt-5 flex-1 space-y-2.5 text-sm text-navy">
                    {tier.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-2.5">
                        <span className="mt-1 h-2 w-2 flex-none rounded-full bg-coral" aria-hidden />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  {tier.cta ? (
                    <a
                      href={tier.cta.href}
                      className={`mt-6 rounded-full px-4 py-3 text-center font-bold transition-transform hover:-translate-y-0.5 ${
                        tier.highlighted
                          ? "bg-coral text-surface hover:bg-coral-deep"
                          : "bg-navy text-surface hover:bg-ocean-deep"
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
          {block.heading ? <SectionHeading>{block.heading}</SectionHeading> : null}
          <div className="mt-6 space-y-3">
            {block.items.map((item, index) => (
              <div key={index} className="rounded-2xl border-2 border-sky bg-surface p-5 shadow-sm">
                <p className="flex items-center gap-3 font-display font-bold text-navy">
                  <span className="grid h-7 w-7 flex-none place-items-center rounded-full bg-blossom/60 text-sm text-coral-deep">
                    ?
                  </span>
                  {item.question}
                </p>
                <p className="mt-2 pl-10 text-navy/75">{item.answer}</p>
              </div>
            ))}
          </div>
        </Container>
      );

    case "team":
      return (
        <Container>
          {block.heading ? <SectionHeading>{block.heading}</SectionHeading> : null}
          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            {block.members.map((member, index) => (
              <div key={index} className="rounded-3xl border-2 border-sky bg-surface p-6 text-center shadow-sm">
                {member.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={member.photo.src} alt={member.photo.alt} className="mx-auto h-24 w-24 rounded-full object-cover" />
                ) : (
                  <div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-blossom/50 text-3xl">🐣</div>
                )}
                <p className="mt-3 font-display font-bold text-navy">{member.name}</p>
                <p className="text-sm text-navy/70">{member.role}</p>
                {member.bio ? <p className="mt-2 text-sm text-navy/70">{member.bio}</p> : null}
              </div>
            ))}
          </div>
        </Container>
      );

    case "cta_banner":
      return (
        <Container>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-coral to-coral-deep p-10 text-navy shadow-lg sm:p-14">
            <div
              aria-hidden
              className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full bg-sunshine/40 blur-3xl"
            />
            <div className="relative z-10 max-w-lg">
              <h2 className="text-3xl font-bold sm:text-4xl">{block.heading}</h2>
              {block.body ? <p className="mt-3 text-lg text-navy/80">{block.body}</p> : null}
              <a
                href={block.cta.href}
                className="mt-7 inline-block rounded-full bg-navy px-8 py-4 font-bold text-surface shadow-sm transition-transform hover:-translate-y-0.5 hover:bg-navy/90"
              >
                {block.cta.label}
              </a>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/axolotl-armbands.png"
              alt=""
              aria-hidden
              className="pointer-events-none absolute -bottom-6 right-0 hidden w-64 opacity-95 lg:block"
            />
          </div>
        </Container>
      );

    case "contact":
      return (
        <div className="bg-sky/70">
          <Container>
            <div className="rounded-3xl border-2 border-surface bg-surface p-8 shadow-md sm:p-10">
              {block.heading ? <SectionHeading>{block.heading}</SectionHeading> : null}
              <div className="mt-6 grid gap-8 sm:grid-cols-2">
                <div className="space-y-3 text-navy/75">
                  {block.address ? <p className="font-semibold text-navy">{block.address}</p> : null}
                  {block.phone ? <p>{block.phone}</p> : null}
                  {block.email ? (
                    <p>
                      <a href={`mailto:${block.email}`} className="font-bold text-ocean hover:underline">
                        {block.email}
                      </a>
                    </p>
                  ) : null}
                  <p className="text-sm text-navy/60">
                    Prefer to book straight away? Use the Book a lesson button and pick a time that suits you.
                  </p>
                </div>
                {block.showEnquiryForm ? <EnquiryForm /> : null}
              </div>
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
