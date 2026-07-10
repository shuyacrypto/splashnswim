/** Small immutable array helpers used by the editors. */

/** Returns a copy of `arr` with the item at `index` replaced. */
export function replaceAt<T>(arr: T[], index: number, value: T): T[] {
  return arr.map((item, i) => (i === index ? value : item));
}

/** Returns a copy of `arr` with the item at `index` removed. */
export function removeAt<T>(arr: T[], index: number): T[] {
  return arr.filter((_, i) => i !== index);
}

/** Returns a copy of `arr` with the item moved from one position to another. */
export function move<T>(arr: T[], from: number, to: number): T[] {
  if (to < 0 || to >= arr.length) return arr;
  const copy = arr.slice();
  const [item] = copy.splice(from, 1);
  if (item === undefined) return arr;
  copy.splice(to, 0, item);
  return copy;
}
