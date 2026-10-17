/**
 * Prefixes a /public path with the deploy base path (e.g. /Los3Cerditos on GitHub Pages).
 * next/link and metadata files get it automatically; raw src strings do not.
 */
export function asset(path: string) {
  return `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${path}`;
}
