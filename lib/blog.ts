export type BlogStatus = "draft" | "published";

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  content: string;
  coverImage: string;
  status: BlogStatus;
  createdAt: string;
  updatedAt: string;
};

export function slugifyTitle(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function getExcerptFromHtml(html: string, maxLength = 160) {
  const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trimEnd()}...`;
}
