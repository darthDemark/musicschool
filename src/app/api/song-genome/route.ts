import { NextResponse } from "next/server";
import { extractYouTubeId, generateMockReport } from "@/lib/youtube";

// ---------------------------------------------------------------------------
// Song Genome API (server-side). Returns the eight-dimension genome and an
// overall score for a given video. The Song Genome page primarily reads the
// user's stored Hit Lab analyses (localStorage), but this route lets the
// genome be (re)computed server-side and is ready for a real analysis service.
// ---------------------------------------------------------------------------

export async function POST(request: Request) {
  let url = "";
  try {
    const body = await request.json();
    url = typeof body?.url === "string" ? body.url : "";
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const videoId = extractYouTubeId(url);
  if (!videoId) {
    return NextResponse.json({ error: "Please provide a valid YouTube link." }, { status: 400 });
  }

  const report = generateMockReport(`https://www.youtube.com/watch?v=${videoId}`, videoId);
  const overall =
    report.genome.reduce((a, g) => a + g.value, 0) / (report.genome.length || 1);

  return NextResponse.json({
    videoId,
    genre: report.genre,
    genome: report.genome,
    overall: +overall.toFixed(1),
  });
}
