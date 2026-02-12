"use client";

import React, { useState, useEffect } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, isToday, startOfWeek, endOfWeek } from "date-fns";

interface CalendarWidgetProps {
    isOpen: boolean;
    onClose: () => void;
    position?: { top: number; left: number };
}

export default function CalendarWidget({ isOpen, onClose, position }: CalendarWidgetProps) {
    const [currentMonth, setCurrentMonth] = useState(new Date());

    // Reset to current month when opened
    useEffect(() => {
        if (isOpen) {
            setCurrentMonth(new Date());
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);

    // Get the start of the week for the first day of the month
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 }); // 0 = Sunday

    // Always show exactly 6 rows (42 days)
    const calendarEnd = new Date(calendarStart);
    calendarEnd.setDate(calendarStart.getDate() + 41); // 42 days total (6 rows × 7 days)

    const days = eachDayOfInterval({
        start: calendarStart,
        end: calendarEnd,
    });

    const previousMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

    return (
        <>
            {/* Backdrop to close when clicking outside */}
            <div className="fixed inset-0 z-40 bg-transparent" onClick={onClose} />

            <div
                className="absolute z-50 w-80 bg-[#1e1e1e]/90 backdrop-blur-md border border-gray-700 rounded-lg shadow-2xl p-4 text-gray-200 animate-in fade-in slide-in-from-top-2 duration-200"
                style={{
                    top: position?.top || 48,
                    left: position?.left || 16
                }}
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <button
                        onClick={previousMonth}
                        className="p-1 hover:bg-white/10 rounded transition-colors w-8 h-8 flex items-center justify-center text-xl"
                        aria-label="Previous month"
                    >
                        ←
                    </button>
                    <h3 className="font-bold text-lg capitalize min-w-[160px] text-center">
                        {format(currentMonth, "MMMM yyyy")}
                    </h3>
                    <button
                        onClick={nextMonth}
                        className="p-1 hover:bg-white/10 rounded transition-colors w-8 h-8 flex items-center justify-center text-xl"
                        aria-label="Next month"
                    >
                        →
                    </button>
                </div>

                {/* Weekdays */}
                <div className="grid grid-cols-7 mb-2 text-center text-xs text-gray-400 font-medium">
                    {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day, i) => (
                        <div key={i} className="w-10 h-6 flex items-center justify-center">{day}</div>
                    ))}
                </div>

                {/* Days Grid - Always 6 rows */}
                <div className="grid grid-cols-7 gap-1 text-sm">
                    {days.map((day) => {
                        const isCurrent = isToday(day);
                        const isCurrentMonth = isSameMonth(day, currentMonth);

                        return (
                            <div
                                key={day.toISOString()}
                                className={`
                                    h-10 w-10 flex items-center justify-center rounded-full text-sm cursor-default transition-all
                                    ${isCurrent
                                        ? "bg-red-600 text-white font-bold shadow-md scale-110"
                                        : isCurrentMonth
                                            ? "hover:bg-white/10 text-gray-300"
                                            : "text-gray-600 opacity-40"
                                    }
                                `}
                            >
                                {format(day, "d")}
                            </div>
                        );
                    })}
                </div>

                {/* Current Time Display Footer */}
                <div className="mt-4 pt-3 border-t border-gray-700 text-center text-xs text-gray-400">
                    {format(new Date(), "EEEE, MMMM d, yyyy")}
                </div>
            </div>
        </>
    );
}
