import type { Block } from "@swim-engine/engine-contracts";
import { EnquiryForm } from "./EnquiryForm";

/**
 * The bespoke SplashNSwim rendering of the ten engine block types. Same data,
 * same engine; this skin dresses each block in the brand's look using the
 * semantic colour tokens (no raw hex here).
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
  return <div className="mx-auto max-w-5xl px-5 py-10">{children}</div>;
}

function renderBlock(block: Block) {
  switch (block.type) {
    case "hero":
      return (
        <div className="bg-gradient-to-b from-aqua/40 to-surface-muted">
          <div className="mx-auto max-w-5xl px-5 py-20 text-center">
            <span className="mb-4 inline-block rounded-full bg-accent-soft px-4 py-1 text-sm font-semibold text-accent">
              Premium 1-to-1 tuition
            </span>
            <h1 className="mx-auto max-w-3xl text-4xl font-extrabold leading-tight text-ink sm:text-5xl">
              {block.heading}
            </h1>
            {block.subheading ? (
              <p className="mx-auto mt-4 max-w-2xl text-lg text-muted">
                {block.subheading}
              </p>
            ) : null}
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {block.primaryCta ? (
                <a
                  href={block.primaryCta.href}
                  className="rounded-full bg-accent px-6 py-3 font-semibold text-surface shadow-sm transition-colors hover:bg-accent/90"
                >
                  {block.primaryCta.label}
                </a>
              ) : null}
              {block.secondaryCta ? (
                <a
                  href={block.secondaryCta.href}
                  className="rounded-full border border-primary px-6 py-3 font-semibold text-primary transition-colors hover:bg-primary hover:text-surface"
                >
                  {block.secondaryCta.label}
                </a>
              ) : null}
            </div>
          </div>
        </div>
      );

    case "rich_text":
      return (
        <Container>
          {block.heading ? (
            <h2 className="mb-3 text-3xl font-extrabold text-ink">{block.heading}</h2>
          ) : null}
          <p className="max-w-3xl whitespace-pre-wrap text-lg leading-relaxed text-muted">
            {block.content}
          </p>
        </Container>
      );

    case "image":
      return (
        <Container>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={block.image.src}
            alt={block.image.alt}
            className="w-full rounded-2xl shadow-sm"
          />
          {block.image.caption ? (
            <p className="mt-2 text-sm text-muted">{block.image.caption}</p>
          ) : null}
        </Container>
      );

    case "gallery":
      return (
        <Container>
          {block.heading ? (
            <h2 className="mb-4 text-3xl font-extrabold text-ink">{block.heading}</h2>
          ) : null}
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
          {block.heading ? (
            <h2 className="mb-4 text-3xl font-extrabold text-ink">{block.heading}</h2>
          ) : null}
          <div className="overflow-hidden rounded-2xl border border-aqua/50 bg-surface shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-primary text-surface">
                <tr>
                  <th className="px-4 py-3">Day</th>
                  <th className="px-4 py-3">Time</th>
                  <th className="px-4 py-3">Lesson</th>
                  <th className="px-4 py-3">Level</th>
                </tr>
              </thead>
              <tbody>
                {block.sessions.map((session, index) => (
                  <tr key={index} className="border-t border-aqua/30">
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
        <Container>
          {block.heading ? (
            <h2 className="mb-6 text-center text-3xl font-extrabold text-ink">
              {block.heading}
            </h2>
          ) : null}
          <div className="grid gap-6 sm:grid-cols-3">
            {block.tiers.map((tier, index) => (
              <div
                key={index}
                className={`flex flex-col rounded-2xl bg-surface p-6 shadow-sm ${
                  tier.highlighted ? "ring-2 ring-accent" : "border border-aqua/40"
                }`}
              >
                {tier.highlighted ? (
                  <span className="mb-2 inline-block self-start rounded-full bg-accent-soft px-3 py-0.5 text-xs font-semibold text-accent">
                    Most popular
                  </span>
                ) : null}
                <h3 className="text-lg font-bold text-ink">{tier.name}</h3>
                <p className="mt-1 text-3xl font-extrabold text-primary">{tier.price}</p>
                {tier.description ? (
                  <p className="mt-2 text-sm text-muted">{tier.description}</p>
                ) : null}
                <ul className="mt-4 space-y-2 text-sm text-ink">
                  {tier.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex gap-2">
                      <span className="text-accent">•</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                {tier.cta ? (
                  <a
                    href={tier.cta.href}
                    className="mt-6 rounded-full bg-primary px-4 py-2 text-center font-semibold text-surface transition-colors hover:bg-primary-dark"
                  >
                    {tier.cta.label}
                  </a>
                ) : null}
              </div>
            ))}
          </div>
        </Container>
      );

    case "faq":
      return (
        <Container>
          {block.heading ? (
            <h2 className="mb-6 text-3xl font-extrabold text-ink">{block.heading}</h2>
          ) : null}
          <div className="space-y-3">
            {block.items.map((item, index) => (
              <div
                key={index}
                className="rounded-2xl border border-aqua/40 bg-surface p-5 shadow-sm"
              >
                <p className="font-bold text-ink">{item.question}</p>
                <p className="mt-1 text-muted">{item.answer}</p>
              </div>
            ))}
          </div>
        </Container>
      );

    case "team":
      return (
        <Container>
          {block.heading ? (
            <h2 className="mb-6 text-3xl font-extrabold text-ink">{block.heading}</h2>
          ) : null}
          <div className="grid gap-6 sm:grid-cols-3">
            {block.members.map((member, index) => (
              <div key={index} className="rounded-2xl bg-surface p-6 text-center shadow-sm">
                {member.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={member.photo.src}
                    alt={member.photo.alt}
                    className="mx-auto h-24 w-24 rounded-full object-cover"
                  />
                ) : (
                  <div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-accent-soft text-2xl">
                    🦎
                  </div>
                )}
                <p className="mt-3 font-bold text-ink">{member.name}</p>
                <p className="text-sm text-muted">{member.role}</p>
                {member.bio ? (
                  <p className="mt-2 text-sm text-muted">{member.bio}</p>
                ) : null}
              </div>
            ))}
          </div>
        </Container>
      );

    case "cta_banner":
      return (
        <Container>
          <div className="rounded-2xl bg-gradient-to-r from-primary to-primary-dark p-10 text-center text-surface shadow-sm">
            <h2 className="text-3xl font-extrabold">{block.heading}</h2>
            {block.body ? (
              <p className="mx-auto mt-2 max-w-xl text-aqua">{block.body}</p>
            ) : null}
            <a
              href={block.cta.href}
              className="mt-6 inline-block rounded-full bg-accent px-6 py-3 font-semibold text-surface transition-colors hover:bg-accent/90"
            >
              {block.cta.label}
            </a>
          </div>
        </Container>
      );

    case "contact":
      return (
        <Container>
          <div className="rounded-2xl border border-aqua/40 bg-surface p-8 shadow-sm">
            {block.heading ? (
              <h2 className="mb-4 text-3xl font-extrabold text-ink">{block.heading}</h2>
            ) : null}
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-1 text-muted">
                {block.address ? <p>{block.address}</p> : null}
                {block.phone ? <p>{block.phone}</p> : null}
                {block.email ? (
                  <p>
                    <a href={`mailto:${block.email}`} className="text-primary hover:underline">
                      {block.email}
                    </a>
                  </p>
                ) : null}
              </div>
              {block.showEnquiryForm ? <EnquiryForm /> : null}
            </div>
          </div>
        </Container>
      );

    default: {
      const unreachable: never = block;
      return unreachable;
    }
  }
}
