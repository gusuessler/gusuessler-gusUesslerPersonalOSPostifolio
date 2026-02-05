export default function Simple() {
    return (
        <main className="mx-auto max-w-3xl p-6 space-y-8">
            <header className="space-y-2">
                <h1 className="text-3xl font-bold">Gustavo Uessler</h1>
                <p className="opacity-80">
                    Brazilian-German software developer. Delphi + modern web. Building systems, sharing ideas.
                </p>
            </header>

            <section>
                <h2 className="text-xl font-semibold">Projects</h2>
                <ul className="list-disc pl-5">
                    <li>Knowledge module for Delphi apps (HTML content, videos, attachments)</li>
                    <li>Yuj: yoga social platform concept (teachers/students, maps, content tools)</li>
                </ul>
            </section>

            <section>
                <h2 className="text-xl font-semibold">Writing</h2>
                <p>Engineering, product, systems thinking, spirituality (practical + grounded).</p>
            </section>

            <section>
                <h2 className="text-xl font-semibold">Contact</h2>
                <p>Add email + GitHub + LinkedIn here.</p>
            </section>
        </main>
    );
}
