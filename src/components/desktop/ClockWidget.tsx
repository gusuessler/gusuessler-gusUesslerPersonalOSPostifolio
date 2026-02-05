import React, { useState, useEffect } from "react";

export default function ClockWidget() {
    const [time, setTime] = useState<Date | null>(null);

    useEffect(() => {
        setTime(new Date());
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Prevent hydration mismatch by initially rendering nothing or a placeholder
    if (!time) return <div className="w-20" />;

    const timeZone = "America/Sao_Paulo";

    // Time: HH:MM
    // Using simple string manipulation or Intl to ensure Brazil time
    const timeStr = new Intl.DateTimeFormat("pt-BR", {
        timeZone,
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    }).format(time);

    // Date: DD MMM YYYY
    const dateStr = new Intl.DateTimeFormat("pt-BR", {
        timeZone,
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(time).toUpperCase().replace('.', '');

    // Day: SEG, TER...
    const weekDay = new Intl.DateTimeFormat("pt-BR", {
        timeZone,
        weekday: "short",
    }).format(time).toUpperCase().replace('.', '');

    // Blinking colon effect for seconds tick simulation
    const showColon = time.getSeconds() % 2 === 0;

    return (
        <div className="flex flex-row items-center justify-center gap-4 px-4 h-full bg-black border-r border-gray-800 select-none cursor-default text-red-500">
            {/* Time Display */}
            <div className="text-2xl font-bold leading-none tracking-widest" style={{ fontFamily: "'DS-Digital', monospace" }}>
                {timeStr.replace(':', showColon ? ':' : ' ')}
            </div>

            {/* Date Display */}
            <div className="flex gap-2 text-sm leading-none font-medium text-red-500/80" style={{ fontFamily: "'DS-Digital', monospace" }}>
                <span>{weekDay}</span>
                <span>{dateStr}</span>
            </div>
        </div>
    );
}
