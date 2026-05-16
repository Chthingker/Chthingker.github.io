import type { Tag } from '../../types/post';

interface TagCloudProps {
  tags: Tag[];
}

export default function TagCloud({ tags }: TagCloudProps) {
  return (
    <div className="tag-cloud">
      {tags.map((tag) => (
        <a
          key={tag.name}
          href={`#/filter/tag/${encodeURIComponent(tag.name)}`}
          className="tag-cloud__item"
        >
          {tag.name}
        </a>
      ))}
    </div>
  );
}
