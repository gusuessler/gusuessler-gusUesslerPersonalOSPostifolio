"use client";

import React, { useState, useRef, useEffect } from "react";
import WeatherWidget from "./WeatherWidget";
import ClockWidget from "./ClockWidget";

// Images
import logoTriad from "@/assets/logoTriad.png";
import gustavoLogo from "@/assets/GustavoUesslerCNlogo.jpg";
import userImage from "@/assets/userImageCartoon.png";
import facePic from "@/assets/facePic.jpg";

type AppId = "about" | "cv" | "contact" | "terminal" | "browser" | "trash" | "yuj";

type WindowState = {
    id: string;
    app: AppId;
    title: string;
    x: number;
    y: number;
    z: number;
    width?: number;
    height?: number;
    isMinimized?: boolean;
    isMaximized?: boolean;
    contentData?: any; // For passing URLs or content to the browser app
    origin?: { x: number; y: number }; // Click source for animation
    restoreRect?: { x: number; y: number; width: number; height: number }; // Rect to animate from when restoring
};

const APP_META: Record<AppId, { title: string; icon: React.ReactNode }> = {
    about: {
        title: "README.md",
        icon: <span className="text-4xl drop-shadow-md">📃</span>
    },

    cv: {
        title: "CV.pdf",
        icon: <span className="text-4xl drop-shadow-md">📄</span>
    },
    contact: {
        title: "Contact",
        icon: <span className="text-4xl drop-shadow-md">✉️</span>
    },
    terminal: {
        title: "Terminal",
        icon: (
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-700 to-black shadow-lg flex items-center justify-center text-white transform transition-transform active:scale-95">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                    <polyline points="4 17 10 11 4 5" />
                    <line x1="12" x2="20" y1="19" y2="19" />
                </svg>
            </div>
        )
    },
    browser: {
        title: "Browser",
        icon: (
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-400 to-indigo-600 shadow-lg flex items-center justify-center text-white transform transition-transform active:scale-95">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="2" x2="22" y1="12" y2="12" />
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
            </div>
        )
    },
    yuj: {
        title: "Yuj Academy",
        icon: (
            <div className="w-10 h-10 flex items-center justify-center transform transition-transform active:scale-95 drop-shadow-md">
                <img src={logoTriad.src} alt="Yuj Academy" className="w-full h-full object-contain" />
            </div>
        )
    },
    trash: {
        title: "Trash",
        icon: <span className="text-4xl drop-shadow-md">🗑️</span>
    },
};

/* --- Menu Data --- */
type MenuItem = {
    label: string;
    icon?: string;
    children?: MenuItem[];
    url?: string;
};

const MENU_DATA: MenuItem[] = [
    // { label: "Pricing", url: "/pricing" },
    // {
    //     label: "Docs",
    //     children: [
    //         { label: "Overview", icon: "📄", url: "/docs" },
    //         {
    //             label: "Product OS",
    //             icon: "📦",
    //             children: [
    //                 { label: "App Analysis", url: "/docs/app" },
    //                 { label: "Toolbar", url: "/docs/toolbar" },
    //             ]
    //         },
    //         { label: "Product Analytics", icon: "📊", url: "/docs/analytics" },
    //         { label: "Web Analytics", icon: "🕸️", url: "/docs/web-analytics" },
    //         { label: "Session Replay", icon: "📼", url: "/docs/session-replay" },
    //         { label: "Feature Flags", icon: "🚩", url: "/docs/flags" },
    //         {
    //             label: "Installation",
    //             icon: "💾",
    //             children: [
    //                 { label: "JavaScript", url: "/install/js" },
    //                 { label: "React", url: "/install/react" },
    //                 { label: "Next.js", url: "/install/nextjs" },
    //                 { label: "Python", url: "/install/python" },
    //                 { label: "Go", url: "/install/go" },
    //             ]
    //         },
    //     ]
    // },
    // {
    //     label: "Community",
    //     children: [
    //         { label: "GitHub", icon: "🐙", url: "https://github.com" },
    //         { label: "Discord", icon: "💬", url: "https://discord.com" },
    //         { label: "Twitter", icon: "🐦", url: "https://twitter.com" },
    //     ]
    // },
    // {
    //     label: "Company",
    //     children: [
    //         { label: "About", url: "/about" },
    //         { label: "Careers", url: "/careers" },
    //         { label: "Handbook", url: "/handbook" },
    //     ]
    // },
    // { label: "More", children: [{ label: "Merch", url: "/shop" }] },
];

/* --- Terminal Component --- */
function TerminalApp({ isDarkMode }: { isDarkMode: boolean }) {
    const [history, setHistory] = useState<string[]>(["Welcome to the system v1.0", "Type 'help' for commands."]);
    const [input, setInput] = useState("");
    const endRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [history]);

    function handleCommand(e: React.FormEvent) {
        e.preventDefault();
        if (!input.trim()) return;
        const cmd = input.trim().toLowerCase();

        let output = "";
        switch (cmd) {
            case "help":
                output = "Available commands: help, clear, whoami, cat_name, date";
                break;
            case "whoami":
                output = "guest@gustavo-portfolio";
                break;
            case "cat_name":
                output = "🐱 Frido";
                break;
            case "date":
                output = new Date().toString();
                break;
            case "clear":
                setHistory([]);
                setInput("");
                return;
            default:
                output = `Command not found: ${cmd}`;
        }

        setHistory([...history, `> ${input}`, output]);
        setInput("");
    }

    return (
        <div className={`flex h-full flex-col p-4 font-mono text-sm ${isDarkMode ? 'bg-[#1e1e1e] text-[#ce9178]' : 'bg-[#1e1e1e] text-[#ce9178]'}`}>
            <div className="flex-1 overflow-y-auto space-y-1">
                {history.map((line, i) => (
                    <div key={i} className="whitespace-pre-wrap">{line}</div>
                ))}
                <div ref={endRef} />
            </div>
            <form onSubmit={handleCommand} className="mt-2 flex items-center border-t border-white/10 pt-2">
                <span className="mr-2 text-blue-400">$</span>
                <input
                    className="flex-1 bg-transparent text-[#d4d4d4] outline-none placeholder:text-gray-600"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    autoFocus
                    placeholder="Type a command..."
                />
            </form>
        </div>
    );
}

/* --- Browser Component --- */
/* --- Browser Component --- */
function BrowserApp({ url, isDarkMode }: { url: string; isDarkMode: boolean }) {
    return (
        <div className={`flex h-full flex-col ${isDarkMode ? 'bg-[#1a1a1a]' : 'bg-white'}`}>
            <div className={`flex items-center gap-2 border-b p-2 text-sm ${isDarkMode ? 'bg-[#2d2d2d] border-gray-700 text-gray-300' : 'bg-gray-50 border-gray-200 text-gray-600'}`}>
                <div className="flex gap-1">
                    <button className={`rounded px-2 ${isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}>←</button>
                    <button className={`rounded px-2 ${isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}>→</button>
                    <button className={`rounded px-2 ${isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}>↻</button>
                </div>
                <div className={`flex-1 rounded-md px-3 py-1 font-mono text-xs ${isDarkMode ? 'bg-[#1a1a1a] text-gray-300' : 'bg-gray-200 text-gray-600'}`}>{url || "about:blank"}</div>
            </div>
            <div className={`flex-1 flex items-center justify-center p-8 text-center ${isDarkMode ? 'bg-[#1a1a1a]' : 'bg-gray-50'}`}>
                <div>
                    <h3 className={`text-xl font-bold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>404 - Simulation Mode</h3>
                    <p className={`mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>This simulates a browser window for: <br /><span className="font-mono text-blue-600">{url}</span></p>
                    <p className="mt-4 text-xs text-gray-400">Implement an iframe here if you want real content.</p>
                </div>
            </div>
        </div>
    );
}

/* --- Contact App Component --- */
function ContactApp({ isDarkMode }: { isDarkMode: boolean }) {
    const [copied, setCopied] = useState(false);

    const handleCopyEmail = (e: React.MouseEvent) => {
        e.preventDefault();
        navigator.clipboard.writeText("gustavouessler@gmail.com");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className={`flex h-full items-center justify-center p-8 ${isDarkMode ? 'bg-[#1a1a1a]' : 'bg-white'}`}>
            <div className="max-w-md w-full">
                <h3 className={`text-2xl font-bold mb-8 text-center ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>Get in touch</h3>

                <div className="space-y-6">
                    {/* Email - Copy Interaction */}
                    <button
                        onClick={handleCopyEmail}
                        className={`flex items-center gap-4 transition-all group w-full text-left ${isDarkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-700 hover:text-blue-600'}`}
                    >
                        <div className={`p-3 border rounded-xl transition-colors shadow-sm relative ${isDarkMode ? 'bg-[#2d2d2d] border-gray-700 text-gray-400 group-hover:text-blue-400 group-hover:border-blue-800' : 'bg-white border-gray-200 text-gray-500 group-hover:text-blue-600 group-hover:border-blue-200'}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
                            {/* Copied Feedback Popover */}
                            {copied && (
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] font-bold py-1 px-2 rounded shadow-lg animate-in fade-in slide-in-from-bottom-2 whitespace-nowrap z-50">
                                    Copied!
                                </div>
                            )}
                        </div>
                        <div>
                            <div className="text-xs font-semibold uppercase text-gray-400">Email</div>
                            <span className="font-medium">gustavouessler@gmail.com</span>
                        </div>
                    </button>

                    {/* WhatsApp - Color & Scale Interaction */}
                    <a
                        href="https://wa.me/5547991312568"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-4 text-green-600 transition-all duration-200 group active:scale-105 origin-left"
                    >
                        <div className={`p-3 border rounded-xl transition-colors shadow-sm ${isDarkMode ? 'bg-green-900/20 border-green-800 text-green-500 group-hover:bg-green-900/30' : 'bg-green-50 border-green-200 text-green-600 group-hover:bg-green-100 group-active:bg-green-200 group-active:border-green-300'}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                        </div>
                        <div className="group-hover:text-green-700 group-active:text-green-800 transition-colors">
                            <div className="text-xs font-semibold uppercase opacity-60">WhatsApp</div>
                            <span className="font-medium">+55 (47) 9 9131-2568</span>
                        </div>
                    </a>

                    {/* Instagram - Color & Scale Interaction */}
                    <a
                        href="https://instagram.com/gusuessler"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-4 text-pink-600 transition-all duration-200 group active:scale-105 origin-left"
                    >
                        <div className={`p-3 border rounded-xl transition-colors shadow-sm ${isDarkMode ? 'bg-pink-900/20 border-pink-800 text-pink-500 group-hover:bg-pink-900/30' : 'bg-pink-50 border-pink-200 text-pink-600 group-hover:bg-pink-100 group-active:bg-pink-200 group-active:border-pink-300'}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
                        </div>
                        <div className="group-hover:text-pink-700 group-active:text-pink-800 transition-colors">
                            <div className="text-xs font-semibold uppercase opacity-60">Instagram</div>
                            <span className="font-medium">@gusuessler</span>
                        </div>
                    </a>
                </div>
            </div>
        </div>
    )
}

/* --- Trash App Component --- */
function TrashApp({ isDarkMode }: { isDarkMode: boolean }) {
    const handleSpicyClick = () => {
        window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ", "_blank");
    };

    return (
        <div className={`flex h-full items-center justify-center p-8 ${isDarkMode ? 'bg-[#1a1a1a]' : 'bg-white'}`}>
            <div className="max-w-md w-full">
                <h3 className={`text-2xl font-bold mb-8 text-center ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>🗑️ Trash</h3>

                <div className={`rounded-lg border p-6 shadow-sm ${isDarkMode ? 'bg-[#2d2d2d] border-gray-700' : 'bg-white border-gray-200'}`}>
                    <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>1 item</p>

                    <button
                        onClick={handleSpicyClick}
                        className="w-full group cursor-pointer"
                    >
                        <div className={`flex items-center gap-4 p-4 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
                            <div className="relative">
                                <div className={`w-16 h-16 rounded-lg blur-md opacity-60 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                                <div className="absolute inset-0 flex items-center justify-center text-2xl">🌶️</div>
                            </div>
                            <div className="flex-1 text-left">
                                <div className={`font-medium transition-colors ${isDarkMode ? 'text-gray-200 group-hover:text-blue-400' : 'text-gray-900 group-hover:text-blue-600'}`}>spicystuff.mp4</div>
                                <div className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>Click to open</div>
                            </div>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
}

/* --- App Content Switcher --- */
function AppContent({ app, data, isDarkMode }: { app: AppId; data?: any; isDarkMode: boolean }) {
    switch (app) {
        case "yuj":
            return (
                <div className={`flex h-full items-center justify-center text-2xl font-bold font-sans ${isDarkMode ? 'text-white' : 'text-black'}`}>
                    Work in progress!
                </div>
            );
        case "browser":
            return <BrowserApp url={data?.url} isDarkMode={isDarkMode} />;
        case "about":
            return (
                <div className={`p-8 md:p-12 max-w-4xl mx-auto space-y-4 font-sans leading-relaxed selection:bg-yellow-200 selection:text-black ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>
                    {/* Header */}
                    <h1 className={`text-4xl font-extrabold tracking-tight mb-2 ${isDarkMode ? 'text-white' : 'text-black'}`}>Gustavo Fermino Uessler</h1>

                    {/* Blockquote */}
                    <div className={`border-l-4 pl-4 py-1 my-6 italic opacity-80 ${isDarkMode ? 'border-blue-500 bg-blue-900/10' : 'border-blue-600 bg-blue-50'}`}>
                        <p>Software engineer by trade. Systems thinker by obsession.</p>
                        <p>This repository is not a product — it’s a process.</p>
                    </div>

                    <hr className={`my-8 border-t-2 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`} />

                    {/* Why this exists */}
                    <section>
                        <h2 className={`text-2xl font-bold mb-4 pb-2 border-b ${isDarkMode ? 'text-gray-100 border-gray-700' : 'text-gray-900 border-gray-200'}`}>Why this exists</h2>
                        <p className="mb-4">
                            Most personal websites try to <em>summarize</em> a person. <br />
                            This one is trying to <strong>observe</strong> one.
                        </p>
                        <p className="mb-4">
                            I don’t believe people are static objects that can be fully explained by a résumé, a tech stack, or a list of achievements.
                            I believe we’re closer to evolving systems — influenced by code, culture, spirituality, mistakes, curiosity, and long walks where ideas suddenly connect.
                        </p>
                        <p>This project is a digital space where those layers can coexist.</p>
                    </section>

                    <hr className={`my-8 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`} />

                    {/* Who I am */}
                    <section>
                        <h2 className={`text-2xl font-bold mb-4 pb-2 border-b ${isDarkMode ? 'text-gray-100 border-gray-700' : 'text-gray-900 border-gray-200'}`}>Who I am (for now)</h2>
                        <p className="mb-4">
                            Based in <strong>Blumenau, Brazil</strong> (though I spent 8 transformative months living in Ireland).
                        </p>
                        <p className="mb-4">
                            I work with software because I like <strong>making complex things usable</strong>. <br />
                            I stay interested because I like <strong>asking why things exist at all</strong>.
                        </p>
                        <p className="mb-4">My background lives somewhere between:</p>
                        <ul className="list-disc list-outside ml-6 space-y-2 mb-4">
                            <li>Engineering and systems design.</li>
                            <li>Knowledge organization and teaching.</li>
                            <li>A constant curiosity about how humans, tools, and meaning intersect.</li>
                        </ul>
                        <p>
                            I enjoy structure — but only if it stays flexible. <br />
                            I enjoy abstraction — but only if it still touches reality.
                        </p>
                    </section>

                    <hr className={`my-8 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`} />

                    {/* What you'll find */}
                    <section>
                        <h2 className={`text-2xl font-bold mb-4 pb-2 border-b ${isDarkMode ? 'text-gray-100 border-gray-700' : 'text-gray-900 border-gray-200'}`}>What you’ll eventually find here</h2>
                        <p className="mb-4">This repository (and the site it powers) is meant to grow into a personal operating system of sorts:</p>
                        <ul className="list-none space-y-3 mb-6">
                            <li>✍️ Essays and notes about technology, work, identity, and learning.</li>
                            <li>🛠️ Projects, experiments, and half-finished ideas.</li>
                            <li>🎨 Visual explorations, symbols, and interface concepts.</li>
                            <li>🧭 Reflections on where I’ve been — and what I want to build next.</li>
                        </ul>
                        <p className="italic opacity-80">
                            Some things will be polished. <br />
                            Some things will be rough. <br />
                            That’s intentional.
                        </p>
                    </section>

                    <hr className={`my-8 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`} />

                    {/* What this is not */}
                    <section>
                        <h2 className={`text-2xl font-bold mb-4 pb-2 border-b ${isDarkMode ? 'text-gray-100 border-gray-700' : 'text-gray-900 border-gray-200'}`}>What this is <em>not</em></h2>
                        <ul className="list-disc list-outside ml-6 space-y-2 mb-4">
                            <li>Not a portfolio pretending to be a person</li>
                            <li>Not a blog chasing engagement</li>
                            <li>Not a manifesto claiming certainty</li>
                        </ul>
                        <p className="font-medium">This is closer to a <strong>workbench</strong> than a showroom.</p>
                    </section>

                    <hr className={`my-8 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`} />

                    {/* Note to future me */}
                    <section>
                        <h2 className={`text-2xl font-bold mb-4 pb-2 border-b ${isDarkMode ? 'text-gray-100 border-gray-700' : 'text-gray-900 border-gray-200'}`}>A note to future me (and curious visitors)</h2>
                        <p className="mb-4">If you’re reading this later:</p>
                        <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-amber-900/10 border-amber-800 text-amber-200' : 'bg-amber-50 border-amber-200 text-amber-800'}`}>
                            <p>You’re allowed to contradict yourself.</p>
                            <p>You’re allowed to delete things that no longer feel true.</p>
                            <p>You’re allowed to rebuild this entire system if it stops serving you.</p>
                        </div>
                        <p className="mt-4 font-bold text-lg">Growth beats consistency.</p>
                    </section>

                    <hr className={`my-8 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`} />

                    {/* Status */}
                    <section>
                        <h2 className={`text-2xl font-bold mb-4 pb-2 border-b ${isDarkMode ? 'text-gray-100 border-gray-700' : 'text-gray-900 border-gray-200'}`}>Status</h2>
                        <p className="mb-4">🚧 <strong>Under construction</strong> — permanently.</p>
                        <p>If something here sparks a thought, a disagreement, or a collaboration idea, that’s already a success.</p>
                    </section>

                    <hr className={`my-8 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`} />

                    <p className="text-sm opacity-60 italic text-center">Last updated when this version of me thought this made sense.</p>
                </div>
            );



        case "cv":
            return (
                <div className={`mx-auto max-w-5xl px-12 py-12 font-sans ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                    {/* Header */}
                    <div className={`mb-12 flex items-end justify-between border-b pb-6 ${isDarkMode ? 'border-gray-700' : 'border-gray-300'}`}>
                        <div className="flex items-center gap-8">
                            <img
                                src={facePic.src}
                                alt="Gustavo Fermino Uessler"
                                className={`h-28 w-28 rounded-full border-4 object-cover shadow-sm ${isDarkMode ? 'border-[#1a1a1a]' : 'border-gray-50'}`}
                            />
                            <div>
                                <h2 className={`text-4xl font-extrabold tracking-tight ${isDarkMode ? 'text-white' : 'text-black'}`}>Gustavo Fermino Uessler</h2>
                                <p className={`mt-2 text-lg font-medium text-left ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Software Engineer/Developer/Programmer</p>
                            </div>
                        </div>
                        <button className={`rounded-full px-6 py-2.5 text-sm font-bold transition-transform hover:scale-105 shadow-sm mb-4 ${isDarkMode ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800'}`}>
                            Download PDF
                        </button>
                    </div>

                    {/* Experience Section */}
                    <div className="mb-16">
                        <h3 className="mb-8 text-xs font-bold uppercase tracking-[0.2em] text-gray-400">Core Experience</h3>
                        <div className={`relative border-l ml-2 pl-10 space-y-12 ${isDarkMode ? 'border-gray-700' : 'border-gray-300'}`}>

                            {/* SCI */}
                            <div className="relative">
                                <div className={`absolute -left-[45px] top-1.5 h-4 w-4 rounded-full ring-4 ${isDarkMode ? 'bg-white ring-[#1a1a1a]' : 'bg-black ring-white'}`}></div>
                                <div>
                                    <h4 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>Software Developer</h4>
                                    <div className={`text-md font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>SCI Sistemas Contábeis</div>
                                    <p className={`text-sm mt-1 mb-4 font-mono ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Nov 2025 – Present | Blumenau, Brazil</p>
                                </div>

                                <p className={`mb-6 max-w-2xl leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Working on accounting and fiscal systems used by real companies in production.</p>

                                <div className="grid gap-6 md:grid-cols-2">
                                    <div className={`p-6 rounded-xl border ${isDarkMode ? 'bg-[#2d2d2d] border-gray-700' : 'bg-gray-50 border-gray-100'}`}>
                                        <strong className="block text-xs font-bold uppercase text-gray-400 mb-3 tracking-wider">What I do</strong>
                                        <ul className={`list-none space-y-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                            <li className="flex gap-3"><span className="text-gray-300">•</span> Develop & maintain critical accounting software</li>
                                            <li className="flex gap-3"><span className="text-gray-300">•</span> Implement legal/fiscal requirements</li>
                                            <li className="flex gap-3"><span className="text-gray-300">•</span> Legacy code refactoring & bug fixing</li>
                                            <li className="flex gap-3"><span className="text-gray-300">•</span> Direct technical user support</li>
                                        </ul>
                                    </div>
                                    <div className={`p-6 rounded-xl border ${isDarkMode ? 'bg-[#2d2d2d] border-gray-700' : 'bg-gray-50 border-gray-100'}`}>
                                        <strong className="block text-xs font-bold uppercase text-gray-400 mb-3 tracking-wider">What it represents</strong>
                                        <ul className={`list-none space-y-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                            <li className="flex gap-3"><span className="text-gray-300">•</span> Deep responsibility & precision</li>
                                            <li className="flex gap-3"><span className="text-gray-300">•</span> Complex domain rules mastery</li>
                                            <li className="flex gap-3"><span className="text-gray-300">•</span> Long-term system evolution</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Bremen */}
                            <div className="relative">
                                <div className={`absolute -left-[44px] top-2 h-3 w-3 rounded-full ring-4 ${isDarkMode ? 'bg-gray-400 ring-[#1a1a1a]' : 'bg-gray-400 ring-white'}`}></div>
                                <div>
                                    <h4 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>Software Developer (Contract)</h4>
                                    <div className={`text-md font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Bremen Sistemas</div>
                                    <p className={`text-sm mt-1 mb-4 font-mono ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Aug 2023 – Nov 2025 | Blumenau, Brazil</p>
                                </div>
                                <p className={`mb-6 max-w-2xl leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Specialized Wingraph ERP development for the printing industry.</p>

                                <div className={`p-6 rounded-xl border ${isDarkMode ? 'bg-[#2d2d2d] border-gray-700' : 'bg-gray-50 border-gray-100'}`}>
                                    <div className="grid md:grid-cols-2 gap-8">
                                        <div>
                                            <strong className="block text-xs font-bold uppercase text-gray-400 mb-3 tracking-wider">Contributions</strong>
                                            <ul className={`list-none space-y-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                                <li className="flex gap-3"><span className="text-gray-300">•</span> Feature planning & maintenance</li>
                                                <li className="flex gap-3"><span className="text-gray-300">•</span> Delphi, MySQL, Git workflows</li>
                                                <li className="flex gap-3"><span className="text-gray-300">•</span> ERP module validation</li>
                                            </ul>
                                        </div>
                                        <div>
                                            <strong className="block text-xs font-bold uppercase text-gray-400 mb-3 tracking-wider">Sharpened Skills</strong>
                                            <ul className={`list-none space-y-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                                <li className="flex gap-3"><span className="text-gray-300">•</span> Business process modeling</li>
                                                <li className="flex gap-3"><span className="text-gray-300">•</span> Domain-specific software logic</li>
                                                <li className="flex gap-3"><span className="text-gray-300">•</span> Legacy system respect</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Custom IT */}
                            <div className="relative">
                                <div className={`absolute -left-[44px] top-2 h-3 w-3 rounded-full ring-4 ${isDarkMode ? 'bg-gray-500 ring-[#1a1a1a]' : 'bg-gray-300 ring-white'}`}></div>
                                <div>
                                    <h4 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Junior Front-end Developer</h4>
                                    <div className={`text-sm font-semibold ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Custom IT</div>
                                    <p className="text-xs text-gray-400 mt-1 font-mono">Nov 2018 – Feb 2019</p>
                                </div>
                                <p className={`mt-2 text-sm max-w-xl ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Interface development (C#) & client interaction. Learned that UX problems are often communication problems.
                                </p>
                            </div>

                            {/* Previous Roles Grouped */}
                            <div className="relative">
                                <div className={`absolute -left-[44px] top-2 h-3 w-3 rounded-full ring-4 ${isDarkMode ? 'bg-gray-600 ring-[#1a1a1a]' : 'bg-gray-200 ring-white'}`}></div>
                                <div className="space-y-6">
                                    <div>
                                        <h4 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>SAP MM Support Agent</h4>
                                        <div className={`text-sm font-semibold ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>T-Systems</div>
                                        <p className="text-xs text-gray-400 mt-1 font-mono">Sep 2017 – May 2018</p>
                                        <p className={`mt-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Enterprise support for international clients (English/German).</p>
                                    </div>
                                    <div>
                                        <h4 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Junior Developer / Support</h4>
                                        <div className={`text-sm font-semibold ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Eventials</div>
                                        <p className="text-xs text-gray-400 mt-1 font-mono">May 2017 – Sep 2017</p>
                                        <p className={`mt-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Full lifecycle exposure: Code, QA, and Support.</p>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                    <hr className={`my-12 ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`} />

                    <div className="grid gap-16 md:grid-cols-2">
                        {/* Education */}
                        <div>
                            <h3 className="mb-8 text-xs font-bold uppercase tracking-[0.2em] text-gray-400">Education</h3>
                            <div className="space-y-8">
                                <div className="group">
                                    <h4 className={`text-lg font-bold border-l-2 pl-4 ${isDarkMode ? 'text-white border-white' : 'text-black border-black'}`}>IFSC – Instituto Federal de Santa Catarina</h4>
                                    <div className="pl-4 mt-1">
                                        <div className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>Information System Analysis and Development</div>
                                        <p className="text-xs text-gray-500 mt-1 font-mono">Feb 2017 – Oct 2020 | Technologist</p>
                                    </div>
                                </div>
                                <div className="group">
                                    <h4 className={`text-lg font-bold border-l-2 pl-4 ${isDarkMode ? 'text-white border-gray-700' : 'text-gray-900 border-gray-200'}`}>SENAI/SC</h4>
                                    <div className="pl-4 mt-1">
                                        <div className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>Curso Técnico Integrado, IT</div>
                                        <p className="text-xs text-gray-500 mt-1 font-mono">Feb 2015 – Oct 2016</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Languages & Certs */}
                        <div className="space-y-12">
                            {/* Languages */}
                            <div>
                                <h3 className="mb-6 text-xs font-bold uppercase tracking-[0.2em] text-gray-400">Languages</h3>
                                <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                                    <div>
                                        <div className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>Portuguese</div>
                                        <div className="text-xs text-gray-500">Native</div>
                                    </div>
                                    <div>
                                        <div className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>English</div>
                                        <div className="text-xs text-gray-500">Full Professional (C2)</div>
                                    </div>
                                    <div>
                                        <div className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>German</div>
                                        <div className="text-xs text-gray-500">Elementary</div>
                                    </div>
                                    <div>
                                        <div className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Spanish</div>
                                        <div className="text-xs text-gray-500">Elementary</div>
                                    </div>
                                </div>
                            </div>

                            {/* Certifications */}
                            <div>
                                <h3 className="mb-6 text-xs font-bold uppercase tracking-[0.2em] text-gray-400">Certifications</h3>
                                <div className={`flex items-start gap-4 p-4 border rounded-lg transition-colors ${isDarkMode ? 'bg-[#2d2d2d] border-gray-700 hover:border-white' : 'bg-white border-gray-200 hover:border-black'}`}>
                                    <div className={`h-10 w-10 flex items-center justify-center rounded font-bold text-xs shrink-0 ${isDarkMode ? 'bg-white text-black' : 'bg-black text-white'}`}>AWS</div>
                                    <div>
                                        <div className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-black'}`}>AWS Certified Cloud Practitioner</div>
                                        <div className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Amazon Web Services</div>
                                        <div className="text-[10px] text-gray-400 mt-2 font-mono uppercase">Expires Apr 2025</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );

        case "terminal":
            return <TerminalApp isDarkMode={isDarkMode} />;

        case "contact":
            return <ContactApp isDarkMode={isDarkMode} />;

        case "trash":
            return <TrashApp isDarkMode={isDarkMode} />;
    }
}

/* --- Active Windows List Component --- */

function ActiveWindowsList({
    wins,
    onFocus,
    onClose,
    onCloseAll,
    isDarkMode,
}: {
    wins: WindowState[];
    onFocus: (id: string) => void;
    onClose: (id: string) => void;
    onCloseAll: () => void;
    isDarkMode: boolean;
}) {
    return (
        <div className={`w-72 rounded-md border shadow-xl backdrop-blur-sm transition-colors flex flex-col overflow-hidden h-full ${isDarkMode ? 'bg-[#2d2d2d]/95 border-gray-700' : 'bg-white/95 border-gray-200'}`}>
            {/* Header */}
            <div className={`flex items-center justify-between p-3 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                <span className={`font-bold text-sm ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>Active windows</span>
                <button
                    onClick={onCloseAll}
                    className={`text-xs flex items-center gap-1 transition-colors ${isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-800'}`}
                >
                    Close all <span className="text-[10px]">›</span>
                </button>
            </div>

            {/* List */}
            <div className="overflow-y-auto p-2 space-y-1 flex-1">
                {wins.length === 0 ? (
                    <div className={`flex flex-col items-center justify-center h-full text-center p-8 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-3 opacity-50"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><line x1="9" y1="3" x2="9" y2="21" /></svg>
                        <p className="text-sm font-medium">No active windows</p>
                        <p className="text-xs mt-1">Open an app to get started</p>
                    </div>
                ) : (
                    wins.map(win => (
                        <div
                            key={win.id}
                            className={`group flex items-center justify-between p-2 rounded-md cursor-pointer transition-all ${isDarkMode
                                ? `hover:bg-gray-700/50 ${!win.isMinimized ? 'bg-gray-700/30' : 'opacity-60 hover:opacity-100'}`
                                : `hover:bg-gray-100 ${!win.isMinimized ? 'bg-gray-50' : 'opacity-60 hover:opacity-100'}`
                                }`}
                            onClick={() => onFocus(win.id)}
                        >
                            <div className="flex items-center gap-2 overflow-hidden">
                                {/* Dot indicator for active state (or minimized state contrast) */}
                                <div className={`w-1.5 h-1.5 rounded-full shrink-0 transition-colors ${!win.isMinimized ? (isDarkMode ? 'bg-green-400' : 'bg-green-600') : 'bg-transparent border border-current opacity-40'}`} />
                                <span className={`text-sm truncate select-none ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>{win.title}</span>
                            </div>
                            <button
                                onClick={(e) => { e.stopPropagation(); onClose(win.id); }}
                                className={`p-1 rounded opacity-0 group-hover:opacity-100 transition-all ${isDarkMode ? 'hover:bg-gray-600 text-gray-400' : 'hover:bg-gray-200 text-gray-500'}`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

/* --- Window Manager --- */
function Window({
    win,
    onFocus,
    onClose,
    onMove,
    onMinimize,
    onMaximize,
    onResize,
    getMinimizedTarget,
    isDarkMode,
}: {
    win: WindowState;
    onFocus: () => void;
    onClose: () => void;
    onMove: (dx: number, dy: number) => void;
    onMinimize: () => void;
    onMaximize: () => void;
    onResize: (dw: number, dh: number, direction: 'corner' | 'right' | 'bottom' | 'left') => void;
    getMinimizedTarget?: () => DOMRect | undefined;
    isDarkMode: boolean;
}) {
    const [dragging, setDragging] = useState(false);
    const [resizing, setResizing] = useState(false);
    const [resizeDirection, setResizeDirection] = useState<'corner' | 'right' | 'bottom' | 'left'>('corner');
    const dragStateRef = useRef<{ x: number; y: number } | null>(null);
    const resizeStateRef = useRef<{ x: number; y: number } | null>(null);

    // Determine default width/height if not specified
    const defaultWidth = win.app === 'terminal' || win.app === 'browser' ? 800 : 520;
    const defaultHeight = win.app === 'terminal' || win.app === 'browser' ? 500 : "auto";

    // Opening Animation Logic
    const [animStyles, setAnimStyles] = useState<React.CSSProperties | null>(
        win.origin ? { opacity: 0, transform: 'scale(0)' } : null
    );

    useEffect(() => {
        if (!win.origin) return;

        // Strategy: Use transform-origin to make the window grow FROM the icon.
        // We calculate the position of the icon relative to the window's top-left corner.
        // Transform Origin X = Icon Center X - Window X
        // Transform Origin Y = Icon Center Y - Window Y

        const originX = win.origin.x - (win.x ?? 0);
        const originY = win.origin.y - (win.y ?? 0);

        // 1. Set initial state: Scale 0 at the custom origin
        setAnimStyles({
            opacity: 0,
            transform: 'scale(0)',
            transformOrigin: `${originX}px ${originY}px`,
            transition: 'none',
        });

        // 2. Animate to final state
        const raf = requestAnimationFrame(() => {
            // Force reflow/paint
            requestAnimationFrame(() => {
                setAnimStyles({
                    opacity: 1,
                    transform: 'scale(1)',
                    transformOrigin: `${originX}px ${originY}px`, // Keep origin stable during anim
                    transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease-out',
                });

                // 3. Cleanup
                setTimeout(() => {
                    setAnimStyles(null);
                }, 400);
            });
        });

        return () => cancelAnimationFrame(raf);
    }, []); // Run once on mount

    useEffect(() => {
        if (!dragging) return;

        const handleMouseMove = (e: MouseEvent) => {
            if (!dragStateRef.current) return;

            requestAnimationFrame(() => {
                const dx = e.clientX - dragStateRef.current!.x;
                const dy = e.clientY - dragStateRef.current!.y;
                dragStateRef.current = { x: e.clientX, y: e.clientY };
                onMove(dx, dy);
            });
        };

        const handleMouseUp = () => {
            setDragging(false);
            dragStateRef.current = null;
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [dragging, onMove]);

    useEffect(() => {
        if (!resizing) return;

        const handleMouseMove = (e: MouseEvent) => {
            if (!resizeStateRef.current) return;

            requestAnimationFrame(() => {
                const dx = e.clientX - resizeStateRef.current!.x;
                const dy = e.clientY - resizeStateRef.current!.y;
                resizeStateRef.current = { x: e.clientX, y: e.clientY };
                onResize(dx, dy, resizeDirection);
            });
        };

        const handleMouseUp = () => {
            setResizing(false);
            resizeStateRef.current = null;
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [resizing, onResize, resizeDirection]);

    // Minimize / Restore Animation Logic
    const [renderMinimized, setRenderMinimized] = useState(!!win.isMinimized);
    const prevMinimizedRef = useRef(!!win.isMinimized);

    useEffect(() => {
        // Only run animation if minimized state CHANGED (cast to boolean to handle undefined vs false)
        if (prevMinimizedRef.current === !!win.isMinimized) return;
        prevMinimizedRef.current = !!win.isMinimized;

        if (win.isMinimized) {
            // MINIMIZE ANIMATION
            const target = getMinimizedTarget?.();
            if (target) {
                const targetCenterX = target.left + target.width / 2;
                const targetCenterY = target.top + target.height / 2;

                // Calculate origin relative to window position
                const currentX = win.isMaximized ? 0 : (win.x ?? 0);
                const currentY = win.isMaximized ? 40 : (win.y ?? 0); // 40px estimated top offset if maximized

                const originX = targetCenterX - currentX;
                const originY = targetCenterY - currentY;

                setAnimStyles({
                    opacity: 0,
                    transform: 'scale(0.1)',
                    transformOrigin: `${originX}px ${originY}px`,
                    transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s ease-out'
                });

                // Hide after animation
                const timer = setTimeout(() => {
                    setRenderMinimized(true);
                }, 400);
                return () => clearTimeout(timer);
            } else {
                setRenderMinimized(true);
            }
        } else {
            // RESTORE ANIMATION (Window appearing from tab/button)
            setRenderMinimized(false);

            // Determine source center
            let sourceCenterX = 0;
            let sourceCenterY = 0;
            const target = getMinimizedTarget?.();

            if (win.restoreRect) {
                sourceCenterX = win.restoreRect.x + win.restoreRect.width / 2;
                sourceCenterY = win.restoreRect.y + win.restoreRect.height / 2;
            } else if (target) {
                sourceCenterX = target.left + target.width / 2;
                sourceCenterY = target.top + target.height / 2;
            }

            // Only animate if we found a source
            if (sourceCenterX && sourceCenterY) {
                const currentX = win.isMaximized ? 0 : (win.x ?? 0);
                const currentY = win.isMaximized ? 40 : (win.y ?? 0);

                const originX = sourceCenterX - currentX;
                const originY = sourceCenterY - currentY;

                setAnimStyles({
                    opacity: 0,
                    transform: 'scale(0.1)',
                    transformOrigin: `${originX}px ${originY}px`,
                    transition: 'none'
                });

                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        setAnimStyles({
                            opacity: 1,
                            transform: 'scale(1)',
                            transformOrigin: `${originX}px ${originY}px`,
                            transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease-out'
                        });
                        // Cleanup
                        setTimeout(() => setAnimStyles(null), 400);
                    });
                });
            }
        }
    }, [win.isMinimized, win.restoreRect, getMinimizedTarget]);

    function onMouseDown(e: React.MouseEvent) {
        if (win.isMaximized) {
            // Don't prevent default when maximized - allow button clicks
            return;
        }
        e.preventDefault();
        e.stopPropagation();
        setDragging(true);
        dragStateRef.current = { x: e.clientX, y: e.clientY };
        onFocus();
    }

    function onResizeMouseDown(e: React.MouseEvent, direction: 'corner' | 'right' | 'bottom' | 'left') {
        if (win.isMaximized) return;
        e.preventDefault();
        e.stopPropagation();
        setResizing(true);
        setResizeDirection(direction);
        resizeStateRef.current = { x: e.clientX, y: e.clientY };
        onFocus();
    }

    // Check if minimized (after animation checks)
    if (win.isMinimized && renderMinimized) return null;

    return (
        <div
            className={`${win.isMaximized ? 'fixed' : 'absolute'} flex flex-col overflow-hidden rounded-md border shadow-[0_8px_30px_rgb(0,0,0,0.12)]
        ${win.app === 'terminal' ? "bg-[#1e1e1e] border-gray-800" : isDarkMode ? "bg-[#2d2d2d] border-gray-700" : "bg-white border-gray-200"}`}
            style={{
                left: win.isMaximized ? 0 : win.x,
                top: win.isMaximized ? 40 : win.y,
                width: win.isMaximized ? "100vw" : (win.width ?? defaultWidth),
                height: win.isMaximized ? "calc(100vh - 40px)" : (win.height ?? defaultHeight),
                zIndex: win.z,
                willChange: dragging ? 'left, top' : 'auto',
                transition: dragging ? 'none' : 'box-shadow 0.3s',
                // Don't apply animStyles when maximized to avoid transform creating stacking context
                ...(win.isMaximized ? {} : (animStyles || {}))
            }}
            onMouseDown={onFocus}
        >
            {/* Minimalist Title Bar */}
            <div
                className={`flex h-9 shrink-0 select-none items-center justify-center border-b px-3 ${win.isMaximized ? 'cursor-default' : 'cursor-move'} relative
          ${win.app === 'terminal' ? "bg-[#252526] border-black text-gray-400" : isDarkMode ? "bg-[#3d3d3d] border-gray-600 text-gray-300" : "bg-[#f5f5f5] border-gray-200 text-gray-500"}`}
                onMouseDown={onMouseDown}
            >
                {/* Centered Title */}
                <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 pointer-events-none">
                    <span className="text-xs font-mono font-medium opacity-80">{win.title}</span>
                </div>

                {/* Minimal Controls: _ □ X - Positioned on the right */}
                <div className="flex items-center gap-0.5 ml-auto">
                    <button
                        onClick={(e) => { e.stopPropagation(); onMinimize(); }}
                        className={`flex h-6 w-6 items-center justify-center rounded transition-colors ${isDarkMode && win.app !== 'terminal' ? 'hover:bg-white/10' : 'hover:bg-black/5'}`}
                        title="Minimize"
                    >
                        <div className={`h-[1.5px] w-3 ${win.app === 'terminal' ? "bg-gray-400" : isDarkMode ? "bg-gray-300" : "bg-gray-600"}`} />
                    </button>
                    <button
                        className={`flex h-6 w-6 items-center justify-center rounded transition-colors ${isDarkMode && win.app !== 'terminal' ? 'hover:bg-white/10' : 'hover:bg-black/5'}`}
                        onClick={(e) => { e.stopPropagation(); onMaximize(); }}
                        title="Maximize/Restore"
                    >
                        {win.isMaximized ? (
                            <div className="relative h-3 w-3">
                                <div className={`absolute top-0 right-0 h-2 w-2 border-[1.5px] ${win.app === 'terminal' ? "border-gray-400 bg-[#252526]" : isDarkMode ? "border-gray-300 bg-[#3d3d3d]" : "border-gray-600 bg-[#f5f5f5]"}`} />
                                <div className={`absolute bottom-0 left-0 h-2 w-2 border-[1.5px] ${win.app === 'terminal' ? "border-gray-400" : isDarkMode ? "border-gray-300" : "border-gray-600"}`} />
                            </div>
                        ) : (
                            <div className={`h-3 w-3 border-[1.5px] ${win.app === 'terminal' ? "border-gray-400" : isDarkMode ? "border-gray-300" : "border-gray-600"}`} />
                        )}
                    </button>
                    <button
                        className="flex h-6 w-6 items-center justify-center rounded hover:bg-red-500 hover:text-white transition-colors"
                        onClick={(e) => { e.stopPropagation(); onClose(); }}
                        title="Close"
                    >
                        <span className="text-lg font-bold leading-none flex items-center justify-center">×</span>
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className={`flex-1 overflow-auto ${win.app === 'terminal' ? "p-0" : "p-0"}`}>
                <AppContent app={win.app} data={win.contentData} isDarkMode={isDarkMode} />
            </div>

            {/* Resize Handles */}
            {!win.isMaximized && (
                <>
                    {/* Left Edge - Horizontal Resize */}
                    <div
                        className="absolute top-0 left-0 w-1 h-full cursor-ew-resize hover:bg-blue-400/30 transition-colors z-20"
                        onMouseDown={(e) => onResizeMouseDown(e, 'left')}
                    />

                    {/* Right Edge - Horizontal Resize */}
                    <div
                        className="absolute top-0 right-0 w-1 h-full cursor-ew-resize hover:bg-blue-400/30 transition-colors z-20"
                        onMouseDown={(e) => onResizeMouseDown(e, 'right')}
                    />

                    {/* Bottom Edge - Vertical Resize */}
                    <div
                        className="absolute bottom-0 left-0 w-full h-1 cursor-ns-resize hover:bg-blue-400/30 transition-colors"
                        onMouseDown={(e) => onResizeMouseDown(e, 'bottom')}
                    />

                    {/* Bottom Right Corner - Both Directions */}
                    <div
                        className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize group z-10"
                        onMouseDown={(e) => onResizeMouseDown(e, 'corner')}
                    >
                        <div className="absolute bottom-1 right-1 w-3 h-3 border-r-2 border-b-2 border-gray-400 opacity-50 group-hover:opacity-100 transition-opacity" />
                    </div>
                </>
            )}
        </div>
    );
}

/* --- Dropdown Components --- */
function SubMenu({ items, onNavigate, isDarkMode }: { items: MenuItem[]; onNavigate: (url: string) => void; isDarkMode: boolean }) {
    return (
        /* Wrapper with padding-left (pl-1) acts as an invisible bridge */
        <div className="absolute left-full top-[calc(0px-4px)] pl-2 w-48 animate-in fade-in zoom-in-95 duration-100 z-50">
            <div className={`rounded-md border py-1 shadow-lg ${isDarkMode ? 'bg-[#2d2d2d] border-gray-700' : 'bg-white border-gray-200'}`}>
                {items.map((item, i) => (
                    <MenuItemRow key={i} item={item} onNavigate={onNavigate} isDarkMode={isDarkMode} />
                ))}
            </div>
        </div>
    );
}

function MenuItemRow({ item, onNavigate, isDarkMode }: { item: MenuItem; onNavigate: (url: string) => void; isDarkMode: boolean }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div
            className="relative px-1"
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
            onClick={(e) => {
                e.stopPropagation();
                if (item.url) onNavigate(item.url);
            }}
        >
            <div className={`flex cursor-pointer items-center justify-between rounded px-3 py-1.5 text-sm transition-colors ${isDarkMode ? 'text-gray-200 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'} ${isOpen ? (isDarkMode ? 'bg-gray-700' : 'bg-gray-100') : ''}`}>
                <div className="flex items-center gap-2">
                    {item.icon && <span>{item.icon}</span>}
                    <span>{item.label}</span>
                </div>
                {item.children && <span className={isDarkMode ? 'text-gray-400' : 'text-gray-400'}>›</span>}
            </div>
            {isOpen && item.children && <SubMenu items={item.children} onNavigate={onNavigate} isDarkMode={isDarkMode} />}
        </div>
    );
}

function TopMenuItem({ item, onNavigate, isDarkMode }: { item: MenuItem; onNavigate: (url: string) => void; isDarkMode: boolean }) {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div
            className="relative h-full flex items-center"
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
            onClick={() => {
                if (item.url) onNavigate(item.url);
            }}
        >
            <button className={`text-sm font-sans font-bold transition-colors ${isDarkMode ? 'text-gray-300 hover:text-gray-100' : 'text-gray-600 hover:text-black'} ${isOpen ? (isDarkMode ? 'text-gray-100' : 'text-black') : ''}`}>
                {item.label}
            </button>
            {item.children && isOpen && (
                /* Wrapper with padding-top (pt-2) acts as invisible bridge */
                <div className="absolute left-0 top-full mt-1 w-48 animate-in fade-in zoom-in-95 duration-100 z-50">
                    <div className={`rounded-md border py-1 shadow-lg ${isDarkMode ? 'bg-[#2d2d2d] border-gray-700' : 'bg-white border-gray-200'}`}>
                        {item.children.map((child, i) => (
                            <MenuItemRow key={i} item={child} onNavigate={onNavigate} isDarkMode={isDarkMode} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default function Desktop() {
    const [zTop, setZTop] = useState(100);
    const [wins, setWins] = useState<WindowState[]>([
        { id: "w1", app: "about", title: APP_META.about.title, x: 100, y: 50, z: 100, width: 800, height: 600 },
    ]);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showLogoutDialog, setShowLogoutDialog] = useState(false);
    const [isLoggedOut, setIsLoggedOut] = useState(false);
    const [loginTime] = useState(new Date());
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [showWindowList, setShowWindowList] = useState(false);
    const mainRef = useRef<HTMLElement>(null);
    const activeWindowsButtonRef = useRef<HTMLButtonElement>(null);
    const bounceElRef = useRef<HTMLImageElement>(null);

    // --- Bouncing Logo Logic ---
    const DVD_FILTERS = [
        "sepia(1) saturate(10) hue-rotate(320deg) contrast(1.2)", // Red
        "sepia(1) saturate(10) hue-rotate(80deg) contrast(1.2)", // Green
        "sepia(1) saturate(10) hue-rotate(200deg) contrast(1.2)", // Blue
        "sepia(1) saturate(10) hue-rotate(20deg) contrast(1.2)", // Yellow
        "sepia(1) saturate(10) hue-rotate(260deg) contrast(1.2)", // Magenta
        "sepia(1) saturate(10) hue-rotate(140deg) contrast(1.2)", // Cyan
        "grayscale(1) brightness(3)" // White
    ];

    const [isBouncing, setIsBouncing] = useState(false);
    const bounceRef = useRef({ x: 0, y: 0, dx: 0, dy: 0, colorIdx: 0 });
    const requestRef = useRef<number | undefined>(undefined);

    const startBouncing = () => {
        const startX = window.innerWidth / 2 - 60;
        const startY = 14;
        const angle = Math.random() * 2 * Math.PI;
        const speed = 5; // Faster pace

        bounceRef.current = {
            x: startX,
            y: startY,
            dx: Math.cos(angle) * speed || 1,
            dy: Math.sin(angle) * speed || 1,
            colorIdx: Math.floor(Math.random() * DVD_FILTERS.length)
        };
        setIsBouncing(true);
    };

    const stopBouncing = () => {
        setIsBouncing(false);
    };

    useEffect(() => {
        if (!isBouncing) return;

        // Apply initial color
        if (bounceElRef.current) {
            bounceElRef.current.style.filter = DVD_FILTERS[bounceRef.current.colorIdx];
        }

        const animate = () => {
            const state = bounceRef.current;
            const el = bounceElRef.current;

            if (el) {
                const rect = el.getBoundingClientRect();
                const screenW = window.innerWidth;
                const screenH = window.innerHeight;

                let hit = false;
                state.x += state.dx;
                state.y += state.dy;

                if (state.x <= 0) { state.x = 0; state.dx = Math.abs(state.dx); hit = true; }
                else if (state.x + rect.width >= screenW) { state.x = screenW - rect.width; state.dx = -Math.abs(state.dx); hit = true; }

                if (state.y <= 0) { state.y = 0; state.dy = Math.abs(state.dy); hit = true; }
                else if (state.y + rect.height >= screenH) { state.y = screenH - rect.height; state.dy = -Math.abs(state.dy); hit = true; }

                if (hit) {
                    // Pick a random NEW color
                    let newIdx = state.colorIdx;
                    while (newIdx === state.colorIdx) {
                        newIdx = Math.floor(Math.random() * DVD_FILTERS.length);
                    }
                    state.colorIdx = newIdx;
                    el.style.filter = DVD_FILTERS[state.colorIdx];
                }
                el.style.transform = `translate(${state.x}px, ${state.y}px)`;
            }
            requestRef.current = requestAnimationFrame(animate);
        };
        requestRef.current = requestAnimationFrame(animate);
        return () => { if (requestRef.current) cancelAnimationFrame(requestRef.current); };
    }, [isBouncing]);

    useEffect(() => {
        // Check system preference
        if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            setIsDarkMode(true);
        }
    }, []);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (showWindowList &&
                !(e.target as Element).closest('.active-windows-panel') &&
                !(e.target as Element).closest('.active-windows-toggle')) {
                setShowWindowList(false);
            }
        };

        if (showWindowList) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showWindowList]);

    function openApp(app: AppId, data?: any, sourceRect?: DOMRect) {
        const id = crypto.randomUUID();
        const nextZ = zTop + 1;
        setZTop(nextZ);

        // Get screen dimensions
        const screenW = typeof window !== 'undefined' ? window.innerWidth : 1200;
        const screenH = typeof window !== 'undefined' ? window.innerHeight : 800;

        // Dimensions of the "Main" workspace area 
        // (Screen Width - Left Sidebar 96px - Right Sidebar 96px)
        const mainWidth = screenW - 192;
        // (Screen Height - Header 40px)
        const mainHeight = screenH - 40;

        // Desired Window Size: Fill most of the main area but leave a gap
        // Use Math.min to ensure we don't exceed the container if it's small
        const targetW = Math.max(600, mainWidth - 100); // 50px margin on each side
        const targetH = Math.max(400, mainHeight - 80); // 40px margin top/bottom

        // Center within the Main area
        // Since 'Window' is rendered inside 'main', (0,0) is the top-left of main.
        const startX = (mainWidth - targetW) / 2;
        const startY = (mainHeight - targetH) / 2;

        // Slight random offset for stacking multiple windows
        const offset = (wins.length % 5) * 20;

        // Origin for animation
        let origin: { x: number; y: number } | undefined;

        if (sourceRect && mainRef.current) {
            const mainRect = mainRef.current.getBoundingClientRect();
            // Calculate center relative to main container logic
            // x = (Left relative to main) + (Half width)
            origin = {
                x: (sourceRect.left - mainRect.left) + (sourceRect.width / 2),
                y: (sourceRect.top - mainRect.top) + (sourceRect.height / 2)
            };
        } else if (sourceRect) {
            origin = {
                x: (sourceRect.left - 96) + (sourceRect.width / 2),
                y: (sourceRect.top - 40) + (sourceRect.height / 2)
            };
        }

        setWins((w) => [
            ...w,
            {
                id,
                app,
                title: APP_META[app].title,
                x: startX + offset,
                y: startY + offset,
                width: targetW,
                height: targetH,
                z: nextZ,
                contentData: data,
                origin, // Pass the origin for animation
            },
        ]);
    }

    function focus(id: string, restoreRectSource?: DOMRect) {
        setZTop(z => z + 1);
        setWins((w) => {
            const maxZ = w.reduce((max, win) => Math.max(max, win.z), 100);
            const nextZ = maxZ + 1;

            return w.map((win) => {
                if (win.id !== id) return win;

                // If a restore rect source is provided (clicked from list), save it
                // Otherwise keep existing or undefined
                const newRestoreRect = restoreRectSource
                    ? { x: restoreRectSource.left, y: restoreRectSource.top, width: restoreRectSource.width, height: restoreRectSource.height }
                    : win.restoreRect;

                return {
                    ...win,
                    z: nextZ,
                    isMinimized: false,
                    restoreRect: newRestoreRect
                };
            });
        });
    }

    function close(id: string) {
        setWins((w) => w.filter((x) => x.id !== id));
    }

    function minimize(id: string) {
        setWins((w) => w.map(win => win.id === id ? { ...win, isMinimized: true } : win));
    }

    function toggleMaximize(id: string) {
        setWins((w) => w.map(win => win.id === id ? { ...win, isMaximized: !win.isMaximized } : win));
    }

    function move(id: string, dx: number, dy: number) {
        setWins((w) =>
            w.map((win) => (win.id === id ? { ...win, x: win.x + dx, y: win.y + dy } : win))
        );
    }

    function resize(id: string, dw: number, dh: number, direction: 'corner' | 'right' | 'bottom' | 'left') {
        setWins((w) =>
            w.map((win) => {
                if (win.id !== id) return win;
                const currentWidth = typeof win.width === 'number' ? win.width : 520;
                const currentHeight = typeof win.height === 'number' ? win.height : 400;

                // Apply resize based on direction
                let newWidth = currentWidth;
                let newHeight = currentHeight;
                let newX = win.x;

                if (direction === 'right' || direction === 'corner') {
                    newWidth = Math.max(300, currentWidth + dw);
                }
                if (direction === 'bottom' || direction === 'corner') {
                    newHeight = Math.max(200, currentHeight + dh);
                }
                if (direction === 'left') {
                    newWidth = Math.max(300, currentWidth - dw);
                    newX = win.x + (currentWidth - newWidth);
                }

                return {
                    ...win,
                    width: newWidth,
                    height: newHeight,
                    x: newX,
                };
            })
        );
    }

    function handleMenuNavigate(url: string, rect?: DOMRect) {
        if (url.startsWith("http")) {
            // External link
            window.open(url, "_blank");
        } else {
            // Internal "Browser" window
            openApp("browser", { url }, rect);
        }
    }

    const leftApps: AppId[] = ["about", "yuj"];
    const rightApps: AppId[] = ["cv", "terminal", "contact", "trash"];

    const formatLoginTime = () => {
        const now = new Date();
        const diff = Math.floor((now.getTime() - loginTime.getTime()) / 1000);
        if (diff < 60) return `${diff} seconds`;
        if (diff < 3600) return `${Math.floor(diff / 60)} minutes`;
        return `${Math.floor(diff / 3600)} hours`;
    };

    if (isLoggedOut) {
        return (
            <div className="h-screen w-screen bg-[#0000AA] flex items-center justify-center p-8 font-mono text-white">
                <div className="max-w-3xl">
                    <h1 className="text-4xl font-bold mb-8">A problem has been detected and the system has been shut down.</h1>
                    <p className="mb-4">USER_INITIATED_LOGOUT</p>
                    <p className="mb-8">If this is the first time you've seen this stop error screen, restart your browser. If this screen appears again, follow these steps:</p>
                    <p className="mb-4">Check to make sure you really wanted to log out. If you didn't mean to log out, please refresh the page to continue your session.</p>
                    <p className="mb-8">If problems continue, disable or remove any newly installed hardware or software. Disable BIOS memory options such as caching or shadowing.</p>
                    <p className="mb-4">Technical information:</p>
                    <p className="mb-2">*** STOP: 0x000000C5 (0x00000002, 0x00000001, 0x00000000, 0x00000000)</p>
                    <p className="mt-8 text-sm">Refresh the page to log back in...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`flex h-screen flex-col overflow-hidden text-sm ${isDarkMode ? 'bg-[#1a1a1a]' : 'bg-[#f0f0f0]'}`}>
            <style dangerouslySetInnerHTML={{
                __html: `
                    @keyframes marquee {
                        from { transform: translateX(0); }
                        to { transform: translateX(-50%); }
                    }
                    .animate-marquee {
                        animation: marquee 60s linear infinite;
                    }
                    .animate-marquee-reverse {
                        animation: marquee 60s linear infinite reverse;
                    }
                    
                    ${isDarkMode ? `
                    /* Dark mode scrollbar styles */
                    * {
                        scrollbar-width: thin;
                        scrollbar-color: #3a3a3a #1a1a1a;
                    }
                    
                    *::-webkit-scrollbar {
                        width: 12px;
                        height: 12px;
                    }
                    
                    *::-webkit-scrollbar-track {
                        background: #1a1a1a;
                    }
                    
                    *::-webkit-scrollbar-thumb {
                        background-color: #3a3a3a;
                        border-radius: 6px;
                        border: 2px solid #1a1a1a;
                    }
                    
                    *::-webkit-scrollbar-thumb:hover {
                        background-color: #4a4a4a;
                    }
                    ` : ''}
                `}} />
            {/* 1. Top Bar: System Menu */}
            <header className={`relative flex h-10 shrink-0 items-center justify-between border-b pl-0 pr-4 shadow-sm z-[10002] ${isDarkMode ? 'bg-[#2d2d2d] border-gray-700' : 'bg-[#e9e9e9] border-gray-300'}`}>
                <div className="flex h-full items-center gap-6">
                    <ClockWidget />
                    {/* Brazil Flag SVG - Windows safe */}
                    <a href="https://en.wikipedia.org/wiki/Brazil" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity" title="Brazil - Wikipedia">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 700" className="w-6 h-auto shadow-sm rounded-[1px]">
                            <rect width="1000" height="700" fill="#009b3a" />
                            <path d="M500 127L873 350 500 573 127 350z" fill="#fedf00" />
                            <circle cx="500" cy="350" r="175" fill="#002776" />
                            <path d="M370 410c50-40 130-50 260 0" stroke="#fff" strokeWidth="30" fill="none" />
                        </svg>
                    </a>
                    <WeatherWidget isDarkMode={isDarkMode} />
                    <nav className="flex gap-4">
                        {MENU_DATA.map((item, i) => (
                            <TopMenuItem key={i} item={item} onNavigate={(url) => handleMenuNavigate(url)} isDarkMode={isDarkMode} />
                        ))}
                    </nav>
                </div>

                {/* Centered Logo */}
                {!isBouncing && (
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-full py-0.5 cursor-pointer z-[10003]" onClick={startBouncing} title="Click for a surprise...">
                        <span className={`absolute right-full top-1/2 -translate-y-1/2 mr-3 font-bold font-sans ${isDarkMode ? 'text-white' : 'text-black'} flex items-center gap-1 whitespace-nowrap`}>
                            Click me!
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-pulse">
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                                <polyline points="12 5 19 12 12 19"></polyline>
                            </svg>
                        </span>
                        <img src={gustavoLogo.src} alt="Gustavo Uessler" className="h-full w-auto object-cover" />
                    </div>
                )}
                <div className="flex items-center gap-4 relative">
                    {/* Active Windows Toggle */}
                    <button
                        ref={activeWindowsButtonRef}
                        onClick={() => setShowWindowList(!showWindowList)}
                        className={`active-windows-toggle group relative flex items-center justify-center transition-all ${isDarkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-200/50'} ${showWindowList ? (isDarkMode ? 'bg-gray-700' : 'bg-gray-200') : ''} rounded-md p-1.5`}
                        title="Active Windows"
                    >
                        <div className="relative w-6 h-6 flex items-center justify-center">
                            {/* Box/Window Icon */}
                            <div className={`absolute inset-0 border-2 rounded ${isDarkMode ? 'border-gray-400' : 'border-gray-600'}`}></div>
                            {/* Title Bar Line */}
                            <div className={`absolute top-[6px] left-0 right-0 h-[2px] ${isDarkMode ? 'bg-gray-400' : 'bg-gray-600'}`}></div>
                            {/* Count in Center (below title bar) */}
                            <span className={`relative top-[2px] text-[11px] font-bold font-sans ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                {wins.length}
                            </span>
                        </div>
                    </button>

                    {/* User Profile Button */}
                    <button
                        onClick={() => setShowUserMenu(!showUserMenu)}
                        className="relative"
                    >
                        <img
                            src={userImage.src}
                            alt="User Profile"
                            className="h-8 w-8 rounded-full border-2 border-gray-300 hover:border-gray-400 transition-colors object-cover"
                        />
                    </button>

                    {/* User Dropdown Menu */}
                    {showUserMenu && (
                        <>
                            <div
                                className="fixed inset-0 z-40"
                                onClick={() => setShowUserMenu(false)}
                            />
                            <div className={`absolute right-0 top-full mt-2 w-64 rounded-lg shadow-xl border z-50 overflow-hidden ${isDarkMode ? 'bg-[#2d2d2d] border-gray-700' : 'bg-white border-gray-200'}`}>
                                <div className={`p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                                    <p className={`font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>Welcome, &lt;userName&gt;!</p>
                                    <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                        Logged in since {formatLoginTime()} ago
                                    </p>
                                </div>
                                <div className="p-2">
                                    <button
                                        onClick={() => setIsDarkMode(!isDarkMode)}
                                        className={`w-full px-4 py-2 text-left text-sm rounded transition-colors flex items-center justify-between ${isDarkMode ? 'text-gray-200 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}
                                    >
                                        <span>{isDarkMode ? 'Dark Mode' : 'Light Mode'}</span>
                                        <span>
                                            {isDarkMode ? (
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-purple-400">
                                                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                                                </svg>
                                            ) : (
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-amber-500">
                                                    <circle cx="12" cy="12" r="5" />
                                                    <line x1="12" y1="1" x2="12" y2="3" />
                                                    <line x1="12" y1="21" x2="12" y2="23" />
                                                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                                                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                                                    <line x1="1" y1="12" x2="3" y2="12" />
                                                    <line x1="21" y1="12" x2="23" y2="12" />
                                                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                                                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                                                </svg>
                                            )}
                                        </span>
                                    </button>
                                    <button
                                        onClick={() => {
                                            setShowUserMenu(false);
                                            setShowLogoutDialog(true);
                                        }}
                                        className={`w-full px-4 py-2 text-left text-sm rounded transition-colors ${isDarkMode ? 'text-red-400 hover:bg-red-900/20' : 'text-red-600 hover:bg-red-50'}`}
                                    >
                                        Logout
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </header>

            {/* 2. Main Workspace */}
            <div className={`flex flex-1 overflow-hidden relative bg-[url('https://www.transparenttextures.com/patterns/graphy.png')] ${isDarkMode ? 'bg-gray-900/50' : 'bg-gray-50/50'}`} style={{ backgroundRepeat: 'round' }}>

                {/* Background branding/illustration placeholder - Fixed position */}
                <div className={`absolute inset-0 flex flex-col pointer-events-none z-0 overflow-hidden leading-none select-none`}>
                    <style dangerouslySetInnerHTML={{
                        __html: `
                        @keyframes gradient-flow {
                            0% { background-position: 0% 50%; }
                            50% { background-position: 100% 50%; }
                            100% { background-position: 0% 50%; }
                        }
                        @keyframes marquee {
                            from { transform: translateX(0); }
                            to { transform: translateX(-50%); }
                        }
                        @keyframes marquee-vertical {
                            from { transform: translateY(0); }
                            to { transform: translateY(-50%); }
                        }
                        .animate-marquee {
                            animation: marquee 60s linear infinite;
                        }
                        .animate-marquee-reverse {
                            animation: marquee 60s linear infinite reverse;
                        }
                        .animate-marquee-vertical {
                            animation: marquee-vertical 40s linear infinite;
                        }
                        .gradient-text {
                            background: linear-gradient(
                                90deg,
                                ${isDarkMode ? '#000000' : '#f0f0f0'} 0%,
                                ${isDarkMode ? '#050505' : '#d0d0d0'} 15%,
                                ${isDarkMode ? '#0f0f0f' : '#b0b0b0'} 30%,
                                ${isDarkMode ? '#8a8a8a' : '#909090'} 45%,
                                ${isDarkMode ? '#ffffff' : '#808080'} 50%,
                                ${isDarkMode ? '#8a8a8a' : '#909090'} 55%,
                                ${isDarkMode ? '#0f0f0f' : '#b0b0b0'} 70%,
                                ${isDarkMode ? '#050505' : '#d0d0d0'} 85%,
                                ${isDarkMode ? '#000000' : '#f0f0f0'} 100%
                            );
                            background-size: 200% 100%;
                            -webkit-background-clip: text;
                            background-clip: text;
                            -webkit-text-fill-color: transparent;
                            animation: gradient-flow 8s ease infinite;
                        }
                    `}} />

                    {/* Rolling Continuum Rows - Vertical & Horizontal */}
                    <div className="animate-marquee-vertical flex flex-col shrink-0">
                        {[0, 1].map((copyIndex) => (
                            <div key={copyIndex} className="flex flex-col gap-4 pb-4">
                                {[
                                    "UESSLER GUSTAVO FERMINO UESSLER GUSTAVO FERMINO UESSLER GUSTAVO FERMINO UESSLER GUSTAVO FERMINO",
                                    "FERMINO UESSLER GUSTAVO FERMINO UESSLER GUSTAVO FERMINO UESSLER GUSTAVO FERMINO UESSLER GUSTAVO",
                                    "GUSTAVO FERMINO UESSLER GUSTAVO FERMINO UESSLER GUSTAVO FERMINO UESSLER GUSTAVO FERMINO UESSLER",
                                    "UESSLER GUSTAVO FERMINO UESSLER GUSTAVO FERMINO UESSLER GUSTAVO FERMINO UESSLER GUSTAVO FERMINO",
                                    "FERMINO UESSLER GUSTAVO FERMINO UESSLER GUSTAVO FERMINO UESSLER GUSTAVO FERMINO UESSLER GUSTAVO",
                                    "UESSLER GUSTAVO FERMINO UESSLER GUSTAVO FERMINO UESSLER GUSTAVO FERMINO UESSLER GUSTAVO FERMINO",
                                    "FERMINO UESSLER GUSTAVO FERMINO UESSLER GUSTAVO FERMINO UESSLER GUSTAVO FERMINO UESSLER GUSTAVO",
                                    "GUSTAVO FERMINO UESSLER GUSTAVO FERMINO UESSLER GUSTAVO FERMINO UESSLER GUSTAVO FERMINO UESSLER",
                                    "UESSLER GUSTAVO FERMINO UESSLER GUSTAVO FERMINO UESSLER GUSTAVO FERMINO UESSLER GUSTAVO FERMINO",
                                    "FERMINO UESSLER GUSTAVO FERMINO UESSLER GUSTAVO FERMINO UESSLER GUSTAVO FERMINO UESSLER GUSTAVO",
                                    "UESSLER GUSTAVO FERMINO UESSLER GUSTAVO FERMINO UESSLER GUSTAVO FERMINO UESSLER GUSTAVO FERMINO",
                                    "FERMINO UESSLER GUSTAVO FERMINO UESSLER GUSTAVO FERMINO UESSLER GUSTAVO FERMINO UESSLER GUSTAVO",
                                    "GUSTAVO FERMINO UESSLER GUSTAVO FERMINO UESSLER GUSTAVO FERMINO UESSLER GUSTAVO FERMINO UESSLER",
                                    "UESSLER GUSTAVO FERMINO UESSLER GUSTAVO FERMINO UESSLER GUSTAVO FERMINO UESSLER GUSTAVO FERMINO",
                                    "FERMINO UESSLER GUSTAVO FERMINO UESSLER GUSTAVO FERMINO UESSLER GUSTAVO FERMINO UESSLER GUSTAVO",
                                    "UESSLER GUSTAVO FERMINO UESSLER GUSTAVO FERMINO UESSLER GUSTAVO FERMINO UESSLER GUSTAVO FERMINO",
                                    "FERMINO UESSLER GUSTAVO FERMINO UESSLER GUSTAVO FERMINO UESSLER GUSTAVO FERMINO UESSLER GUSTAVO",
                                    "GUSTAVO FERMINO UESSLER GUSTAVO FERMINO UESSLER GUSTAVO FERMINO UESSLER GUSTAVO FERMINO UESSLER",
                                    "UESSLER GUSTAVO FERMINO UESSLER GUSTAVO FERMINO UESSLER GUSTAVO FERMINO UESSLER GUSTAVO FERMINO",
                                    "FERMINO UESSLER GUSTAVO FERMINO UESSLER GUSTAVO FERMINO UESSLER GUSTAVO FERMINO UESSLER GUSTAVO"
                                ].map((text, i) => (
                                    <div key={i} className={`flex whitespace-nowrap ${i % 2 === 0 ? 'animate-marquee' : 'animate-marquee-reverse'}`} style={{ animationDuration: `${25 + i * 2}s` }}>
                                        <h1 className="gradient-text text-[13vh] font-black tracking-tighter mix-blend-multiply opacity-30 px-4">
                                            {text}
                                        </h1>
                                        <h1 className="gradient-text text-[13vh] font-black tracking-tighter mix-blend-multiply opacity-30 px-4">
                                            {text}
                                        </h1>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                    {/* <h1 className="gradient-text text-[13vh] font-black tracking-tighter mix-blend-multiply whitespace-nowrap opacity-30" style={{ animationDelay: '6s' }}>GUSTAVO FERMINO UESSLER </h1> */}
                </div>

                {/* Left Sidebar - Transparent */}
                <aside className="flex w-24 flex-col items-center gap-7 py-6 z-40 relative">
                    {leftApps.map(app => (
                        <button key={app} onClick={(e) => openApp(app, undefined, e.currentTarget.getBoundingClientRect())} className="group flex flex-col items-center gap-1 w-full">
                            <div className="filter transition-transform duration-200">
                                {APP_META[app].icon}
                            </div>
                            <span className={`rounded px-2 py-0.5 text-[11px] font-medium transition-colors group-hover:shadow-sm ${isDarkMode ? 'text-gray-300 group-hover:bg-gray-700 group-hover:text-gray-100' : 'text-gray-700 group-hover:bg-[#f3f0e8] group-hover:text-gray-900'}`}>
                                {APP_META[app].title}
                            </span>
                        </button>
                    ))}
                </aside>

                {/* Center: Desktop Surface (Windows Layer) */}
                {/* Center: Desktop Surface (Windows Layer) */}
                {/* Center: Desktop Surface (Windows Layer) */}
                <main ref={mainRef} className="relative flex-1 pointer-events-none">
                    <div className="absolute inset-0 pointer-events-auto">
                        {wins.map((win) => (
                            <Window
                                key={win.id}
                                win={win}
                                onFocus={() => focus(win.id)}
                                onClose={() => close(win.id)}
                                onMinimize={() => minimize(win.id)}
                                onMaximize={() => toggleMaximize(win.id)}
                                onMove={(dx, dy) => move(win.id, dx, dy)}
                                onResize={(dw, dh, direction) => resize(win.id, dw, dh, direction)}
                                getMinimizedTarget={() => activeWindowsButtonRef.current?.getBoundingClientRect()}
                                isDarkMode={isDarkMode}
                            />
                        ))}
                    </div>

                </main>

                {/* Right Sidebar - Transparent */}
                <aside className="flex w-24 flex-col items-center gap-7 py-6 z-40 relative">
                    {rightApps.map(app => (
                        <button
                            key={app}
                            onClick={(e) => openApp(app, undefined, e.currentTarget.getBoundingClientRect())}
                            className="group flex flex-col items-center gap-1 w-full"
                        >
                            <div className="filter transition-transform duration-200">
                                {APP_META[app].icon}
                            </div>
                            <span className={`rounded px-2 py-0.5 text-[11px] font-medium transition-colors group-hover:shadow-sm ${isDarkMode ? 'text-gray-300 group-hover:bg-gray-700 group-hover:text-gray-100' : 'text-gray-700 group-hover:bg-[#f3f0e8] group-hover:text-gray-900'}`}>
                                {APP_META[app].title}
                            </span>
                        </button>
                    ))}
                </aside>

                {/* Active Windows Panel - Slide in Animation - Moved to root level for correct Z-index */}
                <div className={`active-windows-panel absolute top-4 right-4 bottom-4 z-[10000] pointer-events-auto transition-all duration-300 ease-in-out ${showWindowList ? 'translate-x-0 visible' : 'translate-x-[120%] invisible'}`}>
                    <ActiveWindowsList
                        wins={wins}
                        onFocus={(id) => { focus(id); setShowWindowList(false); }}
                        onClose={close}
                        onCloseAll={() => setWins([])}
                        isDarkMode={isDarkMode}
                    />
                </div>

            </div>

            {/* Logout Confirmation Dialog */}
            {showLogoutDialog && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[10001]">
                    <div className={`rounded-lg shadow-2xl p-6 max-w-md w-full mx-4 ${isDarkMode ? 'bg-[#2d2d2d]' : 'bg-white'}`}>
                        <h2 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>Confirm Logout</h2>
                        <p className={`mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Are you sure you want to log out?</p>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setShowLogoutDialog(false)}
                                className={`px-4 py-2 rounded transition-colors ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}`}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    setShowLogoutDialog(false);
                                    setIsLoggedOut(true);
                                }}
                                className={`px-4 py-2 rounded transition-colors ${isDarkMode ? 'bg-red-700 hover:bg-red-600' : 'bg-red-600 hover:bg-red-700'} text-white`}
                            >
                                Yes, Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Bouncing DVD Logo Effect */}
            {isBouncing && (
                <img
                    ref={bounceElRef}
                    src={gustavoLogo.src}
                    alt="Bouncing Logo"
                    className="fixed h-14 w-auto z-[10005] cursor-pointer select-none left-0 top-0 will-change-transform shadow-2xl rounded-lg"
                    onClick={stopBouncing}
                />
            )}
        </div>
    );
}
