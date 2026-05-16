import { useMemo } from 'react';
import CodeBlock from '../CodeBlock/CodeBlock';
import InkTable from '../InkTable/InkTable';
import Callout from '../Callout/Callout';
import { slugify } from '../../utils/slugify';
import type { TocItem } from '../TableOfContents/TableOfContents';
import './MarkdownRenderer.css';

interface MarkdownRendererProps {
  content: string;
  onHeadings?: (items: TocItem[]) => void;
}

/* ── inline formatting ── */
function renderInline(text: string): string {
  return text
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="ink-image" loading="lazy" />')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');
}

/* ── block-level parsing ── */

const BLOCK = {
  CodeFence: 'code-fence',
  Heading: 'heading',
  Table: 'table',
  Callout: 'callout',
  Blockquote: 'blockquote',
  List: 'list',
  Hr: 'hr',
  Paragraph: 'paragraph',
} as const;

type BlockType = (typeof BLOCK)[keyof typeof BLOCK];

interface Block {
  type: BlockType;
  raw: string;
}

/**
 * Split into blocks while keeping code fences intact.
 * Strategy: replace code fences with placeholders, split, then restore.
 */
const PLACEHOLDER_BASE = '%%CODE_FENCE_';

function splitBlocks(markdown: string): string[] {
  const fences: string[] = [];
  let counter = 0;

  // Replace fenced code blocks with placeholders
  const protectedMd = markdown.replace(/```\w*\n[\s\S]*?```/g, (match) => {
    fences.push(match);
    return `${PLACEHOLDER_BASE}${counter++}%%`;
  });

  // Split on double newlines
  const rawBlocks = protectedMd.split(/\n\n+/).map((b) => b.trim()).filter(Boolean);

  // Restore placeholders
  const blocks = rawBlocks.map((b) => {
    return b.replace(new RegExp(`${PLACEHOLDER_BASE}(\\d+)%%`, 'g'), (_, id) => {
      return fences[parseInt(id, 10)] ?? '';
    });
  });

  return blocks;
}

function classifyBlock(raw: string): Block {
  if (/^```\w*\n/.test(raw) || raw === '```') {
    return { type: BLOCK.CodeFence, raw };
  }

  if (/^\[!(NOTE|WARNING|TIP)\]/i.test(raw.trim())) {
    return { type: BLOCK.Callout, raw };
  }

  if (raw.includes('---') && raw.split('\n').every((l) => l.trim().startsWith('|'))) {
    return { type: BLOCK.Table, raw };
  }

  if (/^#{1,3}\s/.test(raw.trim())) {
    return { type: BLOCK.Heading, raw };
  }

  if (/^---+\s*$/.test(raw.trim())) {
    return { type: BLOCK.Hr, raw };
  }

  if (raw.trim().startsWith('> ')) {
    return { type: BLOCK.Blockquote, raw };
  }

  if (/^(\s*[-*]\s|\s*\d+\.\s)/m.test(raw.trim())) {
    return { type: BLOCK.List, raw };
  }

  return { type: BLOCK.Paragraph, raw };
}

function parseTable(raw: string): { headers: string[]; rows: string[][] } {
  const lines = raw.split('\n').map((l: string) => l.trim().replace(/^\||\|$/g, ''));
  const headers = lines[0].split('|').map((c: string) => c.trim());
  const rows = lines.slice(2).map((l: string) => l.split('|').map((c: string) => c.trim()));
  return { headers, rows };
}

function parseList(raw: string): { ordered: boolean; items: string[] } {
  const items = raw
    .split('\n')
    .map((l: string) => l.replace(/^(\s*)[-*\d]+\.\s+/, '$1').trim())
    .filter(Boolean);
  const ordered = /^\s*\d+\.\s/.test(raw.trim());
  return { ordered, items };
}

function parseCallout(raw: string): { type: 'note' | 'warning' | 'tip'; text: string } {
  const match = raw.trim().match(/^\[!(NOTE|WARNING|TIP)\]\s*([\s\S]*)/i);
  const type = (match?.[1]?.toLowerCase() ?? 'note') as 'note' | 'warning' | 'tip';
  const text = match?.[2]?.trim() ?? raw;
  return { type, text };
}

function parseHeading(raw: string): { level: number; text: string; id: string } {
  const trimmed = raw.trim();
  const level = trimmed.match(/^#+/)?.[0].length ?? 2;
  const text = trimmed.replace(/^#+\s+/, '');
  const id = slugify(text);
  return { level, text, id };
}

export default function MarkdownRenderer({ content, onHeadings }: MarkdownRendererProps) {
  const blocks: Block[] = useMemo(() => {
    const rawBlocks = splitBlocks(content);
    const bs: Block[] = [];
    const hs: TocItem[] = [];

    for (const raw of rawBlocks) {
      const block = classifyBlock(raw);
      if (block.type === BLOCK.Heading) {
        const h = parseHeading(raw);
        hs.push({ id: h.id, text: h.text, level: h.level });
      }
      bs.push(block);
    }

    setTimeout(() => onHeadings?.(hs), 0);
    return bs;
  }, [content, onHeadings]);

  return (
    <div className="markdown-body">
      {blocks.map((block: Block, i: number) => {
        switch (block.type) {
          case BLOCK.CodeFence: {
            const lines = block.raw.split('\n');
            const first = lines[0];
            const lang = first.replace('```', '').trim();
            const code = lines.slice(1).filter((l: string) => l !== '```').join('\n');
            return <CodeBlock key={i} code={code} language={lang || 'text'} />;
          }

          case BLOCK.Heading: {
            const h = parseHeading(block.raw);
            const Tag = `h${h.level}` as 'h2' | 'h3';
            return (
              <Tag key={i} id={h.id} className={`markdown-heading markdown-heading--h${h.level}`}>
                {h.text}
              </Tag>
            );
          }

          case BLOCK.Table: {
            const { headers, rows } = parseTable(block.raw);
            return <InkTable key={i} headers={headers} rows={rows} />;
          }

          case BLOCK.Callout: {
            const { type, text } = parseCallout(block.raw);
            return <Callout key={i} type={type}>{text}</Callout>;
          }

          case BLOCK.Blockquote: {
            const text = block.raw
              .split('\n')
              .map((l: string) => l.replace(/^>\s?/, ''))
              .join('\n');
            return (
              <blockquote key={i} className="markdown-blockquote">
                <div dangerouslySetInnerHTML={{ __html: renderInline(text) }} />
              </blockquote>
            );
          }

          case BLOCK.List: {
            const { ordered, items } = parseList(block.raw);
            const Tag = ordered ? 'ol' : 'ul';
            return (
              <Tag key={i} className="markdown-list">
                {items.map((item: string, j: number) => (
                  <li key={j} dangerouslySetInnerHTML={{ __html: renderInline(item) }} />
                ))}
              </Tag>
            );
          }

          case BLOCK.Hr:
            return <hr key={i} className="ink-divider" />;

          default: {
            const html = block.raw
              .split('\n')
              .filter(Boolean)
              .map((line: string) => renderInline(line))
              .join('<br/>');
            return (
              <p
                key={i}
                className="markdown-paragraph"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            );
          }
        }
      })}
    </div>
  );
}
