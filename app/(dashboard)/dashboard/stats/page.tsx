"use client";

import { useEffect, useState } from "react";
import { ProtectedPage } from "@/components/ProtectedPage";
import { Bot, CalendarClock, User } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

export default function StatsPage() {
  const [stats, setStats] = useState<any>(null);
  const [seconds, setSeconds] = useState(15);
  const [pulse, setPulse] = useState(false);

  async function load() {
    setPulse(true); // включаем волну

    try {
      const res = await fetch("/api/stats");
      const data = await res.json();
      setStats(data);
    } catch (e) {}

    setSeconds(15);

    // выключаем анимацию через 700мс
    setTimeout(() => setPulse(false), 700);
  }

  useEffect(() => {
    load();

    const dataInterval = setInterval(load, 15000);

    const countdownInterval = setInterval(() => {
      setSeconds((prev) => (prev <= 1 ? 15 : prev - 1));
    }, 1000);

    return () => {
      clearInterval(dataInterval);
      clearInterval(countdownInterval);
    };
  }, []);

  if (!stats)
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <Spinner className="h-6 w-6" />
      </div>
    );

  return (
    <ProtectedPage allowedRoles={["admin", "editor", "viewer"]}>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        {/* Заголовок + индикатор */}

        <h1 className="text-2xl font-semibold">Статистика</h1>

        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold">Сьгодні</h2>
          <div className="relative w-4 h-4">
            {pulse && (
              <span className="absolute -inset-1 rounded-full bg-red-500 animate-ping opacity-75" />
            )}

            <span className="absolute inset-0 rounded-full bg-red-600" />
          </div>
          <p className="text-sm opacity-70">{seconds} сек</p>
        </div>
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2 bg-muted/50 rounded-xl p-4">
              <CalendarClock />
              <p className="text-2xl font-bold">{stats.today.requests}</p>
            </div>

            <div className="flex items-center gap-2 bg-muted/50 rounded-xl p-4">
              <User />
              <p className="text-2xl font-bold">{stats.today.uniqueUsers}</p>
            </div>

            <div className="flex items-center gap-2 bg-muted/50 rounded-xl p-4">
              <Bot />
              <p className="text-2xl font-bold">{stats.today.bots}</p>
            </div>
          </div>
        )}
      </div>
    </ProtectedPage>
  );
}
