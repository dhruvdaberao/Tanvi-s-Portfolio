import { notFound } from "next/navigation";
import { getDb } from "@/lib/db";

type BlogArticleProps = {
  params: Promise<{ slug: string }>;
};

export default async function BlogArticlePage({ params }: BlogArticleProps) {
  const { slug } = await params;
  const db = await getDb();

  const post = await db.collection("blog_posts").findOne({ slug, status: "published" });
  if (!post) notFound();

  return (
    <main className="min-h-screen bg-background px-6 py-16">
      <article className="mx-auto max-w-3xl">
        <p className="mb-3 text-xs uppercase tracking-[0.2em] text-primary">Published article</p>
        <h1 className="font-serif text-5xl leading-tight">{post.title}</h1>
        {post.coverImage ? (
          <img src={post.coverImage} alt={post.title || "Blog cover"} className="mt-8 w-full rounded-xl border border-border object-cover" />
        ) : null}
        <div className="editorial-content mt-10" dangerouslySetInnerHTML={{ __html: String(post.content || "") }} />
      </article>
    </main>
  );
}
