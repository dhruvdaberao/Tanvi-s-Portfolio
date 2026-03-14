import Link from "next/link";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/db";
import { getExcerptFromHtml } from "@/lib/blog";

export default async function BlogListingPage() {
  const db = await getDb();
  const posts = await db.collection("blog_posts").find({ status: "published" }).sort({ createdAt: -1 }).toArray();

  return (
    <main className="min-h-screen bg-background px-6 py-16">
      <div className="mx-auto max-w-5xl">
        <p className="mb-4 text-sm uppercase tracking-[0.24em] text-primary">Tanvi&apos;s Journal</p>
        <h1 className="font-serif text-5xl">Published Articles</h1>

        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {posts.map((post) => {
            const id = post._id instanceof ObjectId ? post._id.toString() : String(post._id);
            const href = `/blog/${post.slug}`;
            return (
              <article key={id} className="rounded-2xl border border-border bg-card p-5">
                {post.coverImage ? (
                  <img src={post.coverImage} alt={post.title || "Blog cover"} className="mb-5 aspect-[3/2] w-full rounded-lg object-cover" />
                ) : null}
                <h2 className="font-serif text-2xl">{post.title}</h2>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">{getExcerptFromHtml(post.content || "")}</p>
                <Link href={href} className="mt-4 inline-block text-sm font-medium text-primary">
                  Read article →
                </Link>
              </article>
            );
          })}
          {posts.length === 0 ? (
            <p className="rounded-xl border border-dashed border-border p-8 text-center text-muted-foreground">No published articles yet.</p>
          ) : null}
        </div>
      </div>
    </main>
  );
}
