export type Article = {
  slug: string;
  title: string;
  category: string;
  date: string;
  readingTime: string;
  excerpt: string;
  lead: string;
  body: string;
};

const articleModules = import.meta.glob("../content/blog/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

function cleanValue(value: string) {
  const trimmed = value.trim();
  if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

export function parseArticle(source: string, fallbackSlug = "untitled"): Article {
  const normalized = source.replace(/\r\n/g, "\n");
  const match = normalized.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  const metadata: Record<string, string> = {};
  const body = match ? match[2].trim() : normalized.trim();

  if (match) {
    for (const line of match[1].split("\n")) {
      const separator = line.indexOf(":");
      if (separator < 0) continue;
      metadata[line.slice(0, separator).trim()] = cleanValue(line.slice(separator + 1));
    }
  }

  return {
    slug: metadata.slug || fallbackSlug,
    title: metadata.title || "未命名文章",
    category: metadata.category || "随笔",
    date: metadata.date || "",
    readingTime: metadata.readingTime || "5 分钟",
    excerpt: metadata.excerpt || "",
    lead: metadata.lead || metadata.excerpt || "",
    body,
  };
}

export function serializeArticle(article: Article) {
  const safe = (value: string) => value.replace(/\r?\n/g, " ").trim();
  return `---\ntitle: ${safe(article.title)}\nslug: ${safe(article.slug)}\ncategory: ${safe(article.category)}\ndate: ${safe(article.date)}\nreadingTime: ${safe(article.readingTime)}\nexcerpt: ${safe(article.excerpt)}\nlead: ${safe(article.lead)}\n---\n\n${article.body.trim()}\n`;
}

export const articles = Object.entries(articleModules)
  .map(([path, source]) => parseArticle(source, path.split("/").pop()?.replace(/\.md$/, "") || "untitled"))
  .sort((a, b) => b.date.localeCompare(a.date));
