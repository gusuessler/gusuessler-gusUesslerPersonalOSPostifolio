import fs from "node:fs";
import path from "node:path";
import { notFound } from "next/navigation";

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const file = path.join(process.cwd(), "src", "content", "writing", `${slug}.mdx`);

    if (!fs.existsSync(file)) return notFound();

    // With Next MDX, we can import directly by path alias if it's under app routes,
    // but since we store in /content, we'll do a simple read + render via MDX route import later.
    // For now: keep posts inside app routes OR use a proper MDX bundler.
    // Quick approach: move posts into src/app/writing-posts/... or use contentlayer.
    return (
        <main className="mx-auto max-w-3xl p-6">
            <p className="opacity-70">
                I found the file, but rendering MDX from /content needs a content pipeline (Contentlayer/Velite) or colocated MDX.
            </p>
            <p className="mt-2">
                Tell me and I'll set up the clean pipeline (I recommend Velite or Contentlayer).
            </p>
        </main>
    );
}
