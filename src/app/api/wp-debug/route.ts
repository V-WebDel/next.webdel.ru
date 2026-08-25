import { NextResponse } from "next/server";

import { WP_BASE_URL, WP_BASE_URL_SOURCE } from "@/lib/wp/config";
import { getErrorDetails } from "@/lib/wp/errors";

export const dynamic = "force-dynamic";

async function testWpEndpoint(path: string) {
  const url = `${WP_BASE_URL}${path}`;
  const startedAt = Date.now();

  try {
    const response = await fetch(url, {
      cache: "no-store",
      headers: {
        Accept: "application/json",
        "User-Agent": "WebDel Next.js WordPress debug",
      },
    });
    const text = await response.text();
    const preview = text.replace(/\s+/g, " ").trim().slice(0, 180);

    return {
      ok: response.ok,
      status: response.status,
      contentType: response.headers.get("content-type"),
      durationMs: Date.now() - startedAt,
      preview,
      url,
    };
  } catch (error) {
    return {
      ok: false,
      durationMs: Date.now() - startedAt,
      error: getErrorDetails(error),
      url,
    };
  }
}

export async function GET() {
  const [home, portfolio] = await Promise.all([
    testWpEndpoint("/wp-json/wp/v2/pages?slug=home"),
    testWpEndpoint("/wp-json/wp/v2/portfolio?per_page=5"),
  ]);

  return NextResponse.json(
    {
      wpBaseUrl: WP_BASE_URL,
      wpBaseUrlSource: WP_BASE_URL_SOURCE,
      home,
      portfolio,
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    }
  );
}
