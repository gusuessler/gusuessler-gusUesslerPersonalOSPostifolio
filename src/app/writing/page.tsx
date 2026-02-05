import Link from "next/link";
import fs from "node:fs";
import path from "node:path";

function getPosts() {
    const dir = path.join(process.cwd(), "src", "content", "writing");
    if (!fs.existsSync(dir)) return [];
    const files = fs.readdirSync(dir).filter((f) => f.endsWith(".mdx"));
    return files.map((f) => ({
        slug: f.replace(/\.mdx$/, ""),
        title: f.replace(/\.mdx$/, "").replace(/-/g, " "),
    }));
}

export default function Writing() {
    const posts = getPosts();
    return (
        <main className="mx-auto max-w-3xl p-6 space-y-6">
            <h1 className="text-3xl font-bold">Writing</h1>
            <ul className="space-y-2">
                {posts.map((p) => (
                    <li key={p.slug}>
                        <Link className="underline" href={`/writing/${p.slug}`}>
                            {p.title}
                        </Link>
                    </li>
                ))}
            </ul>
        </main>
    );
}
