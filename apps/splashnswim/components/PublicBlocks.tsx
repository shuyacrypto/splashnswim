import type { Block } from "@swim-engine/engine-contracts";
import { EnquiryForm } from "./EnquiryForm";
import { Wave } from "./Brand";

/**
 * The bespoke SplashNSwim rendering of the ten engine block types. Same data,
 * same engine; this skin dresses each block in the brand's playful, watery
 * look using semantic colour tokens (no raw hex here).
 */
export function PublicBlocks({ blocks }: { blocks: Block[] }) {
  return (
    <div>
      {blocks.map((block) => (
        <section key={block.id} id={block.id}>
          {renderBlock(block)}
        </section>
      ))}
    </div>
  );
}

function Container({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto max-w-5xl px-5 py-14">{children}</div>;
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-6 text-3xl font-bold text-navy sm:text-4xl">{children}</h2>
  );
}

function renderBlock(block: Block) {
  switch (block.type) {
    case "hero":
      return (
        <div className="relative overflow-hidden bg-gradient-to-b from-sky to-surface">
          {/* Ambient bubbles */}
          <span className="pointer-events-none absolute left-[8%] top-24 h-4 w-4 rounded-full bg-blossom/60" aria-hidden />
          <span className="pointer-events-none absolute left-[14%] top-40 h-2.5 w-2.5 rounded-full bg-ocean/30" aria-hidden />
          <span className="pointer-events-none absolute right-[10%] bottom-24 h-3 w-3 rounded-full bg-sunshine/50" aria-hidden />
          <div className="mx-auto grid max-w-5xl items-center gap-8 px-5 py-16 sm:py-20 md:grid-cols-2">
            <div>
              <span className="inline-block rounded-full bg-blossom/50 px-4 py-1 text-sm font-bold text-coral-deep">
                Premium 1-to-1 tuition
              </span>
              <h1 className="mt-4 text-4xl font-bold leading-[1.1] text-navy sm:text-5xl">
                {block.heading}
              </h1>
              {block.subheading ? (
                <p className="mt-4 max-w-md text-lg text-navy/70">{block.subheading}</p>
              ) : null}
              <div className="mt-8 flex flex-wrap gap-3">
                {block.primaryCta ? (
                  <a
                    href={block.primaryCta.href}
                    className="rounded-full bg-coral px-6 py-3 font-bold text-surface shadow-sm transition-colors hover:bg-coral-deep"
                  >
                    {block.primaryCta.label}
                  </a>
                ) : null}
                {block.secondaryCta ? (
                  <a
                    href={block.secondaryCta.href}
                    className="rounded-full border-2 border-ocean px-6 py-3 font-bold text-ocean transition-colors hover:bg-ocean hover:text-surface"
                  >
                    {block.secondaryCta.label}
                  </a>
                ) : null}
              </div>
            </div>
            <div className="flex justify-center md:justify-end">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/brand/axolotl-hero.png"
                alt="SplashNSwim axolotl mascot swimming"
                className="w-72 animate-float drop-shadow-sm sm:w-96"
              />
            </div>
          </div>
          <Wave fillClass="fill-surface" />
        </div>
      );

    case "rich_text":
      return (
        <Container>
          {block.heading ? <SectionHeading>{block.heading}</SectionHeading> : null}
          <p className="max-w-3xl whitespace-pre-wrap text-lg leading-relaxed text-navy/75">
            {block.content}
          </p>
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
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
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
          <div className="overflow-hidden rounded-3xl border-2 border-sky bg-surface shadow-sm">
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
        <div className="bg-sky/50">
          <Container>
            {block.heading ? (
              <h2 className="mb-8 text-center text-3xl font-bold text-navy sm:text-4xl">
                {block.heading}
              </h2>
            ) : null}
            <div className="grid gap-6 sm:grid-cols-3">
              {block.tiers.map((tier, index) => (
                <div
                  key={index}
                  className={`relative flex flex-col rounded-3xl bg-surface p-6 shadow-sm ${
                    tier.highlighted ? "border-2 border-coral" : "border-2 border-sky"
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
                  <ul className="mt-4 flex-1 space-y-2 text-sm text-navy">
                    {tier.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-2">
                        <span className="mt-1 h-2 w-2 flex-none rounded-full bg-blossom" aria-hidden />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  {tier.cta ? (
                    <a
                      href={tier.cta.href}
                      className={`mt-6 rounded-full px-4 py-2.5 text-center font-bold transition-colors ${
                        tier.highlighted
                          ? "bg-coral text-surface hover:bg-coral-deep"
                          : "bg-ocean text-surface hover:bg-ocean-deep"
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
          <div className="space-y-3">
            {block.items.map((item, index) => (
              <div key={index} className="rounded-2xl border-2 border-sky bg-surface p-5 shadow-sm">
                <p className="flex items-center gap-2 font-display font-bold text-navy">
                  <span className="grid h-6 w-6 flex-none place-items-center rounded-full bg-blossom/60 text-xs text-coral-deep">
                    ?
                  </span>
                  {item.question}
                </p>
                <p className="mt-2 pl-8 text-navy/75">{item.answer}</p>
              </div>
            ))}
          </div>
        </Container>
      );

    case "team":
      return (
        <Container>
          {block.heading ? <SectionHeading>{block.heading}</SectionHeading> : null}
          <div className="grid gap-6 sm:grid-cols-3">
            {block.members.map((member, index) => (
              <div key={index} className="rounded-3xl border-2 border-sky bg-surface p-6 text-center shadow-sm">
                {member.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={member.photo.src}
                    alt={member.photo.alt}
                    className="mx-auto h-24 w-24 rounded-full object-cover"
                  />
                ) : (
                  <div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-blossom/50 text-3xl">
                    🐣
                  </div>
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
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-ocean to-ocean-deep p-10 text-surface shadow-sm">
            <div className="max-w-lg">
              <h2 className="text-3xl font-bold sm:text-4xl">{block.heading}</h2>
              {block.body ? <p className="mt-2 text-sky">{block.body}</p> : null}
              <a
                href={block.cta.href}
                className="mt-6 inline-block rounded-full bg-coral px-6 py-3 font-bold text-surface transition-colors hover:bg-coral-deep"
              >
                {block.cta.label}
              </a>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/axolotl-armbands.png"
              alt=""
              aria-hidden
              className="pointer-events-none absolute -bottom-4 right-2 hidden w-52 opacity-95 sm:block"
            />
          </div>
        </Container>
      );

    case "contact":
      return (
        <div className="bg-sky/50">
          <Container>
            <div className="rounded-3xl border-2 border-sky bg-surface p-8 shadow-sm">
              {block.heading ? <SectionHeading>{block.heading}</SectionHeading> : null}
              <div className="grid gap-8 sm:grid-cols-2">
                <div className="space-y-2 text-navy/75">
                  {block.address ? <p>{block.address}</p> : null}
                  {block.phone ? <p>{block.phone}</p> : null}
                  {block.email ? (
                    <p>
                      <a href={`mailto:${block.email}`} className="font-bold text-ocean hover:underline">
                        {block.email}
                      </a>
                    </p>
                  ) : null}
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
