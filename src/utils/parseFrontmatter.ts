/**
 * Minimal frontmatter parser — zero dependencies, ~25 lines.
 * Supports strings, numbers, booleans, and inline arrays.
 */
export function parseFrontmatter(raw: string): { data: Record<string, unknown>; content: string } {
  const data: Record<string, unknown> = {};
  let content = raw;

  if (raw.startsWith('---\n')) {
    const end = raw.indexOf('\n---\n', 4);
    if (end === -1) return { data, content };

    const block = raw.slice(4, end);
    content = raw.slice(end + 5);

    for (const line of block.split('\n')) {
      const colonIdx = line.indexOf(':');
      if (colonIdx === -1) continue;
      const key = line.slice(0, colonIdx).trim();
      let val: unknown = line.slice(colonIdx + 1).trim();

      if (val === 'true') val = true;
      else if (val === 'false') val = false;
      else if (/^\d+$/.test(val as string)) val = Number(val);
      else if ((val as string).startsWith('[') && (val as string).endsWith(']')) {
        val = (val as string)
          .slice(1, -1)
          .split(',')
          .map((s) => s.trim().replace(/^["']|["']$/g, ''))
          .filter(Boolean);
      } else {
        val = (val as string).replace(/^["']|["']$/g, '');
      }

      if (key) data[key] = val;
    }
  }

  return { data, content: content.trimStart() };
}
