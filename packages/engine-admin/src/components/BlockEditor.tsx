"use client";

import { useState } from "react";
import type { Block } from "@swim-engine/engine-contracts";
import { BLOCK_LABELS, createBlock } from "../labels.js";
import { BlockFields } from "./blocks/editors.js";
import { Button, Card, SelectField } from "./ui.js";
import { move, removeAt, replaceAt } from "../array.js";

const BLOCK_TYPE_OPTIONS = (
  Object.keys(BLOCK_LABELS) as Block["type"][]
).map((type) => ({ value: type, label: BLOCK_LABELS[type] }));

/**
 * A controlled editor for a page's content blocks. The parent owns the block
 * list and saving, so the whole page saves with a single action.
 */
export function BlockEditor({
  blocks,
  onChange,
}: {
  blocks: Block[];
  onChange: (blocks: Block[]) => void;
}) {
  const [newType, setNewType] = useState<Block["type"]>("hero");

  function addBlock() {
    onChange([...blocks, createBlock(newType, crypto.randomUUID())]);
  }

  function deleteBlock(index: number) {
    const label = BLOCK_LABELS[blocks[index]!.type];
    if (!window.confirm(`Remove this "${label}" block? This cannot be undone once saved.`)) {
      return;
    }
    onChange(removeAt(blocks, index));
  }

  return (
    <div className="space-y-4">
      {blocks.map((block, index) => (
        <Card key={block.id}>
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-[var(--admin-text,#0f172a)]">
              {BLOCK_LABELS[block.type]}
            </span>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                disabled={index === 0}
                onClick={() => onChange(move(blocks, index, index - 1))}
              >
                Move up
              </Button>
              <Button
                variant="secondary"
                disabled={index === blocks.length - 1}
                onClick={() => onChange(move(blocks, index, index + 1))}
              >
                Move down
              </Button>
              <Button variant="danger" onClick={() => deleteBlock(index)}>
                Remove
              </Button>
            </div>
          </div>
          <BlockFields
            block={block}
            onChange={(next) => onChange(replaceAt(blocks, index, next))}
          />
        </Card>
      ))}

      {blocks.length === 0 ? (
        <p className="text-sm text-[var(--admin-muted,#64748b)]">
          This page has no content blocks yet. Add one below.
        </p>
      ) : null}

      <Card>
        <div className="flex items-end gap-3">
          <div className="flex-1">
            <SelectField
              label="Add a block"
              value={newType}
              options={BLOCK_TYPE_OPTIONS}
              onChange={(value) => setNewType(value as Block["type"])}
            />
          </div>
          <Button variant="secondary" onClick={addBlock}>
            Add block
          </Button>
        </div>
      </Card>
    </div>
  );
}
