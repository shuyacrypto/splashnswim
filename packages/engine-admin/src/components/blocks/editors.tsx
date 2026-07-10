"use client";

import type {
  Block,
  HeroBlock,
  RichTextBlock,
  ImageBlock,
  GalleryBlock,
  TimetableBlock,
  TimetableSession,
  PricingTableBlock,
  FaqBlock,
  TeamBlock,
  CtaBannerBlock,
  ContactBlock,
} from "@swim-engine/engine-contracts";
import {
  CtaFields,
  ImageFields,
  Row,
  RowList,
  SelectField,
  TextAreaField,
  TextField,
  Toggle,
} from "../ui.js";
import { removeAt, replaceAt } from "../../array.js";

const DAY_OPTIONS: { value: string; label: string }[] = [
  { value: "monday", label: "Monday" },
  { value: "tuesday", label: "Tuesday" },
  { value: "wednesday", label: "Wednesday" },
  { value: "thursday", label: "Thursday" },
  { value: "friday", label: "Friday" },
  { value: "saturday", label: "Saturday" },
  { value: "sunday", label: "Sunday" },
];

function HeroEditor({
  block,
  onChange,
}: {
  block: HeroBlock;
  onChange: (block: HeroBlock) => void;
}) {
  return (
    <div className="space-y-3">
      <TextField
        label="Heading"
        value={block.heading}
        onChange={(v) => onChange({ ...block, heading: v })}
      />
      <TextField
        label="Subheading (optional)"
        value={block.subheading ?? ""}
        onChange={(v) => onChange({ ...block, subheading: v === "" ? undefined : v })}
      />
      <ImageFields
        value={block.backgroundImage ?? { src: "", alt: "" }}
        includeCaption={false}
        onChange={(image) =>
          onChange({ ...block, backgroundImage: image.src === "" ? undefined : image })
        }
      />
      <CtaFields
        legend="Primary button (optional)"
        value={block.primaryCta}
        onChange={(cta) => onChange({ ...block, primaryCta: cta })}
      />
      <CtaFields
        legend="Secondary button (optional)"
        value={block.secondaryCta}
        onChange={(cta) => onChange({ ...block, secondaryCta: cta })}
      />
    </div>
  );
}

function RichTextEditor({
  block,
  onChange,
}: {
  block: RichTextBlock;
  onChange: (block: RichTextBlock) => void;
}) {
  return (
    <div className="space-y-3">
      <TextField
        label="Heading (optional)"
        value={block.heading ?? ""}
        onChange={(v) => onChange({ ...block, heading: v === "" ? undefined : v })}
      />
      <TextAreaField
        label="Text"
        value={block.content}
        rows={6}
        onChange={(v) => onChange({ ...block, content: v })}
      />
    </div>
  );
}

function ImageEditor({
  block,
  onChange,
}: {
  block: ImageBlock;
  onChange: (block: ImageBlock) => void;
}) {
  return (
    <ImageFields
      value={block.image}
      onChange={(image) => onChange({ ...block, image })}
    />
  );
}

function GalleryEditor({
  block,
  onChange,
}: {
  block: GalleryBlock;
  onChange: (block: GalleryBlock) => void;
}) {
  return (
    <div className="space-y-3">
      <TextField
        label="Heading (optional)"
        value={block.heading ?? ""}
        onChange={(v) => onChange({ ...block, heading: v === "" ? undefined : v })}
      />
      <RowList
        addLabel="Add image"
        onAdd={() => onChange({ ...block, images: [...block.images, { src: "", alt: "" }] })}
      >
        {block.images.map((image, index) => (
          <Row
            key={index}
            onRemove={() => onChange({ ...block, images: removeAt(block.images, index) })}
          >
            <ImageFields
              value={image}
              onChange={(next) =>
                onChange({ ...block, images: replaceAt(block.images, index, next) })
              }
            />
          </Row>
        ))}
      </RowList>
    </div>
  );
}

function TimetableEditor({
  block,
  onChange,
}: {
  block: TimetableBlock;
  onChange: (block: TimetableBlock) => void;
}) {
  const setSession = (index: number, next: TimetableSession) =>
    onChange({ ...block, sessions: replaceAt(block.sessions, index, next) });

  return (
    <div className="space-y-3">
      <TextField
        label="Heading (optional)"
        value={block.heading ?? ""}
        onChange={(v) => onChange({ ...block, heading: v === "" ? undefined : v })}
      />
      <RowList
        addLabel="Add session"
        onAdd={() =>
          onChange({
            ...block,
            sessions: [
              ...block.sessions,
              { day: "monday", startTime: "09:00", endTime: "09:30", title: "New session" },
            ],
          })
        }
      >
        {block.sessions.map((session, index) => (
          <Row
            key={index}
            onRemove={() => onChange({ ...block, sessions: removeAt(block.sessions, index) })}
          >
            <SelectField
              label="Day"
              value={session.day}
              options={DAY_OPTIONS}
              onChange={(v) => setSession(index, { ...session, day: v as TimetableSession["day"] })}
            />
            <TextField
              label="Start time"
              type="time"
              value={session.startTime}
              onChange={(v) => setSession(index, { ...session, startTime: v })}
            />
            <TextField
              label="End time"
              type="time"
              value={session.endTime}
              onChange={(v) => setSession(index, { ...session, endTime: v })}
            />
            <TextField
              label="Class name"
              value={session.title}
              onChange={(v) => setSession(index, { ...session, title: v })}
            />
            <TextField
              label="Level (optional)"
              value={session.level ?? ""}
              onChange={(v) => setSession(index, { ...session, level: v === "" ? undefined : v })}
            />
            <TextField
              label="Location (optional)"
              value={session.location ?? ""}
              onChange={(v) =>
                setSession(index, { ...session, location: v === "" ? undefined : v })
              }
            />
          </Row>
        ))}
      </RowList>
    </div>
  );
}

function PricingTableEditor({
  block,
  onChange,
}: {
  block: PricingTableBlock;
  onChange: (block: PricingTableBlock) => void;
}) {
  return (
    <div className="space-y-3">
      <TextField
        label="Heading (optional)"
        value={block.heading ?? ""}
        onChange={(v) => onChange({ ...block, heading: v === "" ? undefined : v })}
      />
      <RowList
        addLabel="Add option"
        onAdd={() =>
          onChange({
            ...block,
            tiers: [
              ...block.tiers,
              { name: "New option", price: "", features: [], highlighted: false },
            ],
          })
        }
      >
        {block.tiers.map((tier, index) => (
          <Row
            key={index}
            onRemove={() => onChange({ ...block, tiers: removeAt(block.tiers, index) })}
          >
            <TextField
              label="Name"
              value={tier.name}
              onChange={(v) =>
                onChange({ ...block, tiers: replaceAt(block.tiers, index, { ...tier, name: v }) })
              }
            />
            <TextField
              label="Price (as shown, for example £45 per month)"
              value={tier.price}
              onChange={(v) =>
                onChange({ ...block, tiers: replaceAt(block.tiers, index, { ...tier, price: v }) })
              }
            />
            <TextField
              label="Description (optional)"
              value={tier.description ?? ""}
              onChange={(v) =>
                onChange({
                  ...block,
                  tiers: replaceAt(block.tiers, index, {
                    ...tier,
                    description: v === "" ? undefined : v,
                  }),
                })
              }
            />
            <TextAreaField
              label="Features (one per line)"
              value={tier.features.join("\n")}
              onChange={(v) =>
                onChange({
                  ...block,
                  tiers: replaceAt(block.tiers, index, { ...tier, features: v.split("\n") }),
                })
              }
            />
            <Toggle
              label="Highlight this option"
              checked={tier.highlighted}
              onChange={(checked) =>
                onChange({
                  ...block,
                  tiers: replaceAt(block.tiers, index, { ...tier, highlighted: checked }),
                })
              }
            />
          </Row>
        ))}
      </RowList>
    </div>
  );
}

function FaqEditor({
  block,
  onChange,
}: {
  block: FaqBlock;
  onChange: (block: FaqBlock) => void;
}) {
  return (
    <div className="space-y-3">
      <TextField
        label="Heading (optional)"
        value={block.heading ?? ""}
        onChange={(v) => onChange({ ...block, heading: v === "" ? undefined : v })}
      />
      <RowList
        addLabel="Add question"
        onAdd={() =>
          onChange({
            ...block,
            items: [...block.items, { question: "New question", answer: "New answer." }],
          })
        }
      >
        {block.items.map((item, index) => (
          <Row
            key={index}
            onRemove={() => onChange({ ...block, items: removeAt(block.items, index) })}
          >
            <TextField
              label="Question"
              value={item.question}
              onChange={(v) =>
                onChange({ ...block, items: replaceAt(block.items, index, { ...item, question: v }) })
              }
            />
            <TextAreaField
              label="Answer"
              value={item.answer}
              onChange={(v) =>
                onChange({ ...block, items: replaceAt(block.items, index, { ...item, answer: v }) })
              }
            />
          </Row>
        ))}
      </RowList>
    </div>
  );
}

function TeamEditor({
  block,
  onChange,
}: {
  block: TeamBlock;
  onChange: (block: TeamBlock) => void;
}) {
  return (
    <div className="space-y-3">
      <TextField
        label="Heading (optional)"
        value={block.heading ?? ""}
        onChange={(v) => onChange({ ...block, heading: v === "" ? undefined : v })}
      />
      <RowList
        addLabel="Add person"
        onAdd={() =>
          onChange({ ...block, members: [...block.members, { name: "New person", role: "Role" }] })
        }
      >
        {block.members.map((member, index) => (
          <Row
            key={index}
            onRemove={() => onChange({ ...block, members: removeAt(block.members, index) })}
          >
            <TextField
              label="Name"
              value={member.name}
              onChange={(v) =>
                onChange({
                  ...block,
                  members: replaceAt(block.members, index, { ...member, name: v }),
                })
              }
            />
            <TextField
              label="Role"
              value={member.role}
              onChange={(v) =>
                onChange({
                  ...block,
                  members: replaceAt(block.members, index, { ...member, role: v }),
                })
              }
            />
            <TextAreaField
              label="Short bio (optional)"
              value={member.bio ?? ""}
              onChange={(v) =>
                onChange({
                  ...block,
                  members: replaceAt(block.members, index, {
                    ...member,
                    bio: v === "" ? undefined : v,
                  }),
                })
              }
            />
            <ImageFields
              value={member.photo ?? { src: "", alt: "" }}
              includeCaption={false}
              onChange={(image) =>
                onChange({
                  ...block,
                  members: replaceAt(block.members, index, {
                    ...member,
                    photo: image.src === "" ? undefined : image,
                  }),
                })
              }
            />
          </Row>
        ))}
      </RowList>
    </div>
  );
}

function CtaBannerEditor({
  block,
  onChange,
}: {
  block: CtaBannerBlock;
  onChange: (block: CtaBannerBlock) => void;
}) {
  return (
    <div className="space-y-3">
      <TextField
        label="Heading"
        value={block.heading}
        onChange={(v) => onChange({ ...block, heading: v })}
      />
      <TextAreaField
        label="Body (optional)"
        value={block.body ?? ""}
        onChange={(v) => onChange({ ...block, body: v === "" ? undefined : v })}
      />
      <TextField
        label="Button label"
        value={block.cta.label}
        onChange={(v) => onChange({ ...block, cta: { ...block.cta, label: v } })}
      />
      <TextField
        label="Button link"
        value={block.cta.href}
        onChange={(v) => onChange({ ...block, cta: { ...block.cta, href: v } })}
      />
    </div>
  );
}

function ContactEditor({
  block,
  onChange,
}: {
  block: ContactBlock;
  onChange: (block: ContactBlock) => void;
}) {
  return (
    <div className="space-y-3">
      <TextField
        label="Heading (optional)"
        value={block.heading ?? ""}
        onChange={(v) => onChange({ ...block, heading: v === "" ? undefined : v })}
      />
      <TextField
        label="Address (optional)"
        value={block.address ?? ""}
        onChange={(v) => onChange({ ...block, address: v === "" ? undefined : v })}
      />
      <TextField
        label="Phone (optional)"
        value={block.phone ?? ""}
        onChange={(v) => onChange({ ...block, phone: v === "" ? undefined : v })}
      />
      <TextField
        label="Email (optional)"
        type="email"
        value={block.email ?? ""}
        onChange={(v) => onChange({ ...block, email: v === "" ? undefined : v })}
      />
      <TextField
        label="Map embed address (optional)"
        type="url"
        value={block.mapEmbedUrl ?? ""}
        onChange={(v) => onChange({ ...block, mapEmbedUrl: v === "" ? undefined : v })}
      />
      <Toggle
        label="Show an enquiry form"
        checked={block.showEnquiryForm}
        onChange={(checked) => onChange({ ...block, showEnquiryForm: checked })}
      />
    </div>
  );
}

/** Shows the correct editor for whichever block type this is. */
export function BlockFields({
  block,
  onChange,
}: {
  block: Block;
  onChange: (block: Block) => void;
}) {
  switch (block.type) {
    case "hero":
      return <HeroEditor block={block} onChange={onChange} />;
    case "rich_text":
      return <RichTextEditor block={block} onChange={onChange} />;
    case "image":
      return <ImageEditor block={block} onChange={onChange} />;
    case "gallery":
      return <GalleryEditor block={block} onChange={onChange} />;
    case "timetable":
      return <TimetableEditor block={block} onChange={onChange} />;
    case "pricing_table":
      return <PricingTableEditor block={block} onChange={onChange} />;
    case "faq":
      return <FaqEditor block={block} onChange={onChange} />;
    case "team":
      return <TeamEditor block={block} onChange={onChange} />;
    case "cta_banner":
      return <CtaBannerEditor block={block} onChange={onChange} />;
    case "contact":
      return <ContactEditor block={block} onChange={onChange} />;
    default: {
      const unreachable: never = block;
      return unreachable;
    }
  }
}
