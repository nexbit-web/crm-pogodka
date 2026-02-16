import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { fingerprint as generateFingerprint } from "@/lib/fingerprint";

export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    const path = url.searchParams.get("p") || "unknown";

    // Получаем IP пользователя
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0] ||
      req.headers.get("x-real-ip") ||
      "unknown";

    // User-Agent
    const ua = req.headers.get("user-agent") || "unknown";

    // Метод запроса
    const method = req.method;

    // Генерация безопасного fingerprint
    const fp = generateFingerprint(ip, ua);

    // Определяем бота по User-Agent
    const isBot = /bot|crawl|spider|google|bing/i.test(ua);

    // Сегодняшняя дата (для подсчёта статистики)
    const now = new Date();

    const today = new Date(
      Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate(),
        0,
        0,
        0,
        0,
      ),
    );

    // Фоновая обработка, чтобы не задерживать ответ клиенту
    queueMicrotask(async () => {
      // 1️⃣ Проверяем уникальность по fingerprint за сегодня
      const alreadyVisitedToday = await prisma.securityRequestLog.findFirst({
        where: {
          fingerprint: fp,
          createdAt: { gte: today },
        },
      });

      const isUniqueToday = !alreadyVisitedToday;

      // 2️⃣ Сохраняем текущий запрос в SecurityRequestLog
      await prisma.securityRequestLog.create({
        data: {
          ip,
          fingerprint: fp,
          path,
          method,
          userAgent: ua,
          isBot,
        },
      });

      // 3️⃣ Обновляем дневную статистику (одна запись на день)
      await prisma.securityDailyStats.upsert({
        where: { date: today },
        update: {
          requests: { increment: 1 },
          uniqueUsers: { increment: isUniqueToday ? 1 : 0 },
          bots: { increment: isBot ? 1 : 0 },
        },
        create: {
          date: today,
          requests: 1,
          uniqueUsers: isUniqueToday ? 1 : 0,
          bots: isBot ? 1 : 0,
        },
      });
    });

    // 204 No Content — клиенту не нужно ждать
    return new NextResponse(null, { status: 204 });
  } catch (err) {
    console.error("Error track API:", err);
    return new NextResponse(null, { status: 500 });
  }
}
