import type { Block } from "@swim-engine/engine-contracts";
import { EnquiryForm } from "./EnquiryForm";

/**
 * Renders the content blocks for the public site. This is deliberately plain:
 * a real skin would style each block to its own design. It shows that every
 * one of the ten block types can be read from the database and displayed.
 */
export function PublicBlocks({ blocks }: { blocks: Block[] }) {
  return (
    <div className="space-y-12">
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
        <div className="rounded-lg bg-slate-100 p-8 text-center">
          <h1 className="text-3xl font-bold">{block.heading}</h1>
          {block.subheading ? (
            <p className="mt-2 text-lg text-slate-600">{block.subheading}</p>
          ) : null}
          {block.primaryCta ? (
            <a
              href={block.primaryCta.href}
              className="mt-4 inline-block rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white"
            >
              {block.primaryCta.label}
            </a>
          ) : null}
        </div>
      );
    case "rich_text":
      return (
        <div>
          {block.heading ? <h2 className="mb-2 text-2xl font-semibold">{block.heading}</h2> : null}
          <p className="whitespace-pre-wrap text-slate-700">{block.content}</p>
        </div>
      );
    case "image":
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <figure>
          <img src={block.image.src} alt={block.image.alt} className="w-full rounded-lg" />
          {block.image.caption ? (
            <figcaption className="mt-1 text-sm text-slate-500">{block.image.caption}</figcaption>
          ) : null}
        </figure>
      );
    case "gallery":
      return (
        <div>
          {block.heading ? <h2 className="mb-3 text-2xl font-semibold">{block.heading}</h2> : null}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {block.images.map((image, index) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={index} src={image.src} alt={image.alt} className="rounded-lg" />
            ))}
          </div>
        </div>
      );
    case "timetable":
      return (
        <div>
          {block.heading ? <h2 className="mb-3 text-2xl font-semibold">{block.heading}</h2> : null}
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b">
                <th className="py-2 pr-4">Day</th>
                <th className="py-2 pr-4">Time</th>
                <th className="py-2 pr-4">Class</th>
                <th className="py-2 pr-4">Level</th>
              </tr>
            </thead>
            <tbody>
              {block.sessions.map((session, index) => (
                <tr key={index} className="border-b">
                  <td className="py-2 pr-4 capitalize">{session.day}</td>
                  <td className="py-2 pr-4">
                    {session.startTime} to {session.endTime}
                  </td>
                  <td className="py-2 pr-4">{session.title}</td>
                  <td className="py-2 pr-4">{session.level ?? ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "pricing_table":
      return (
        <div>
          {block.heading ? <h2 className="mb-3 text-2xl font-semibold">{block.heading}</h2> : null}
          <div className="grid gap-4 sm:grid-cols-3">
            {block.tiers.map((tier, index) => (
              <div key={index} className="rounded-lg border border-slate-200 p-4">
                <h3 className="font-semibold">{tier.name}</h3>
                <p className="text-lg">{tier.price}</p>
                {tier.description ? (
                  <p className="text-sm text-slate-600">{tier.description}</p>
                ) : null}
                <ul className="mt-2 list-disc pl-5 text-sm text-slate-700">
                  {tier.features.map((feature, featureIndex) => (
                    <li key={featureIndex}>{feature}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      );
    case "faq":
      return (
        <div>
          {block.heading ? <h2 className="mb-3 text-2xl font-semibold">{block.heading}</h2> : null}
          <dl className="space-y-3">
            {block.items.map((item, index) => (
              <div key={index}>
                <dt className="font-medium">{item.question}</dt>
                <dd className="text-slate-700">{item.answer}</dd>
              </div>
            ))}
          </dl>
        </div>
      );
    case "team":
      return (
        <div>
          {block.heading ? <h2 className="mb-3 text-2xl font-semibold">{block.heading}</h2> : null}
          <div className="grid gap-4 sm:grid-cols-3">
            {block.members.map((member, index) => (
              <div key={index} className="text-center">
                {member.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={member.photo.src}
                    alt={member.photo.alt}
                    className="mx-auto h-24 w-24 rounded-full object-cover"
                  />
                ) : null}
                <p className="mt-2 font-medium">{member.name}</p>
                <p className="text-sm text-slate-600">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      );
    case "cta_banner":
      return (
        <div className="rounded-lg bg-slate-900 p-8 text-center text-white">
          <h2 className="text-2xl font-semibold">{block.heading}</h2>
          {block.body ? <p className="mt-2 text-slate-200">{block.body}</p> : null}
          <a
            href={block.cta.href}
            className="mt-4 inline-block rounded-md bg-white px-4 py-2 text-sm font-medium text-slate-900"
          >
            {block.cta.label}
          </a>
        </div>
      );
    case "contact":
      return (
        <div>
          {block.heading ? <h2 className="mb-3 text-2xl font-semibold">{block.heading}</h2> : null}
          {block.address ? <p className="text-slate-700">{block.address}</p> : null}
          {block.phone ? <p className="text-slate-700">{block.phone}</p> : null}
          {block.email ? <p className="text-slate-700">{block.email}</p> : null}
          {block.showEnquiryForm ? (
            <div className="mt-4">
              <EnquiryForm />
            </div>
          ) : null}
        </div>
      );
    default: {
      const unreachable: never = block;
      return unreachable;
    }
  }
}
