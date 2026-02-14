// route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    const path = url.searchParams.get("p") || "unknown";

    // IP пользователя
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0] ||
      req.headers.get("x-real-ip") ||
      "unknown";

    // User-Agent и Referer
    const ua = req.headers.get("user-agent") || "unknown";
    const ref = req.headers.get("referer") || "direct";

    // Фоновая обработка (антибот, запись в БД и т.д.)
    queueMicrotask(async () => {
      console.log({ path, ip, ua, ref, time: Date.now() });
      // TODO: запись в БД
      // await prisma.visit.create({ data: { path, ip, ua, ref, createdAt: new Date() } });
    });

    // Мгновенный ответ клиенту
    return new NextResponse(null, { status: 204 });
  } catch {
    return new NextResponse(null, { status: 500 });
  }
}
