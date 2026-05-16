import './BrushTitle.css';

interface BrushTitleProps {
  children: string;
  as?: 'h1' | 'h2' | 'h3';
  accent?: boolean;
}

export default function BrushTitle({
  children,
  as: Tag = 'h2',
  accent = false,
}: BrushTitleProps) {
  return (
    <div className={`brush-title ${accent ? 'brush-title--accent' : ''}`}>
      <Tag className="brush-title__text">{children}</Tag>
      <div className="brush-title__underline" />
    </div>
  );
}
