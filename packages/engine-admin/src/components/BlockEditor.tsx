"use client";

import { useState } from "react";
import type { Block } from "@swim-engine/engine-contracts";
import { BLOCK_LABELS, createBlock } from "../labels.js";
import { BlockFields } from "./blocks/editors.js";
import { Button, Card, ErrorText, SelectField } from "./ui.js";
import { move, removeAt, replaceAt } from "../array.js";
import { errorMessages } from "../helpers.js";

const BLOCK_TYPE_OPTIONS = (
  Object.keys(BLOCK_LABELS) as Block["type"][]
).map((type) => ({ value: type, label: BLOCK_LABELS[type] }));

export function BlockEditor({
  initialBlocks,
  onSave,
}: {
  initialBlocks: Block[];
  onSave: (blocks: Block[]) => Promise<void>;
}) {
  const [blocks, setBlocks] = useState<Block[]>(initialBlocks);
  const [newType, setNewType] = useState<Block["type"]>("hero");
  const [errors, setErrors] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [savedMessage, setSavedMessage] = useState("");

  function update(next: Block[]) {
    setBlocks(next);
    setSavedMessage("");
  }

  function addBlock() {
    update([...blocks, createBlock(newType, crypto.randomUUID())]);
  }

  function deleteBlock(index: number) {
    const label = BLOCK_LABELS[blocks[index]!.type];
    if (!window.confirm(`Remove this "${label}" block? This cannot be undone once saved.`)) {
      return;
    }
    update(removeAt(blocks, index));
  }

  async function save() {
    setErrors([]);
    setBusy(true);
    try {
      await onSave(blocks);
      setSavedMessage("Saved.");
    } catch (error) {
      setErrors(errorMessages(error));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      {blocks.map((block, index) => (
        <Card key={block.id}>
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-800">
              {BLOCK_LABELS[block.type]}
            </span>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                disabled={index === 0}
                onClick={() => update(move(blocks, index, index - 1))}
              >
                Move up
              </Button>
              <Button
                variant="secondary"
                disabled={index === blocks.length - 1}
                onClick={() => update(move(blocks, index, index + 1))}
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
            onChange={(next) => update(replaceAt(blocks, index, next))}
          />
        </Card>
      ))}

      {blocks.length === 0 ? (
        <p className="text-sm text-slate-500">
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

      <ErrorText messages={errors} />

      <div className="flex items-center gap-3">
        <Button onClick={save} disabled={busy}>
          {busy ? "Saving..." : "Save content"}
        </Button>
        {savedMessage ? (
          <span className="text-sm text-green-700">{savedMessage}</span>
        ) : null}
      </div>
    </div>
  );
}
