"use client";

import { useState } from "react";
import type { Block } from "@swim-engine/engine-contracts";
import { BLOCK_ICONS, BLOCK_LABELS, createBlock } from "../labels.js";
import { BlockFields } from "./blocks/editors.js";
import { Button, Card, SelectField } from "./ui.js";
import { ConfirmDialog } from "./ConfirmDialog.js";
import { EmptyState } from "./EmptyState.js";
import { ChevronUp, ChevronDown, FileText } from "../icons.js";
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
  const [removeIndex, setRemoveIndex] = useState<number | null>(null);

  function addBlock() {
    onChange([...blocks, createBlock(newType, crypto.randomUUID())]);
  }

  function confirmRemove() {
    if (removeIndex === null) return;
    onChange(removeAt(blocks, removeIndex));
    setRemoveIndex(null);
  }

  return (
    <div className="space-y-4">
      {blocks.map((block, index) => {
        const Icon = BLOCK_ICONS[block.type];
        return (
          <Card key={block.id}>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm font-semibold text-[var(--admin-text,#0f172a)]">
                <Icon className="h-4 w-4 text-[var(--admin-muted,#64748b)]" />
                {BLOCK_LABELS[block.type]}
              </span>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  disabled={index === 0}
                  onClick={() => onChange(move(blocks, index, index - 1))}
                >
                  <ChevronUp className="h-4 w-4" />
                  Move up
                </Button>
                <Button
                  variant="secondary"
                  disabled={index === blocks.length - 1}
                  onClick={() => onChange(move(blocks, index, index + 1))}
                >
                  <ChevronDown className="h-4 w-4" />
                  Move down
                </Button>
                <Button variant="danger" onClick={() => setRemoveIndex(index)}>
                  Remove
                </Button>
              </div>
            </div>
            <BlockFields
              block={block}
              onChange={(next) => onChange(replaceAt(blocks, index, next))}
            />
          </Card>
        );
      })}

      {blocks.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No content blocks yet"
          description="Add one below to start building this page."
        />
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

      <ConfirmDialog
        open={removeIndex !== null}
        title="Remove this block?"
        message={
          removeIndex !== null
            ? `Remove this "${BLOCK_LABELS[blocks[removeIndex]!.type]}" block? This cannot be undone once saved.`
            : ""
        }
        confirmLabel="Remove block"
        danger
        onConfirm={confirmRemove}
        onCancel={() => setRemoveIndex(null)}
      />
    </div>
  );
}
