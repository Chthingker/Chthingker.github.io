export interface ChapterFile {
  title: string;
  order: number;
  content: string;
}

export interface Post {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  tags: string[];
  coverImage?: string;
  readingTime: number;
  featured?: boolean;
  content?: string;
  chapters?: ChapterFile[];
  type?: 'prose' | 'tech' | 'novel';
  subCategory?: string;
}

export interface Category {
  name: string;
  count: number;
  subCategories?: SubCategory[];
}

export interface SubCategory {
  name: string;
  count: number;
}

export interface Tag {
  name: string;
  count: number;
}
