import { Music2 } from "lucide-react";

interface YouTubeEmbedProps {
  videoId?: string | null;
  title?: string;
}

/**
 * Renders the standard YouTube IFrame embed. The media is served by YouTube —
 * this app never downloads, proxies, or stores the audio/video, only the ID.
 */
export function YouTubeEmbed({ videoId, title = "YouTube video" }: YouTubeEmbedProps) {
  if (!videoId) {
    return (
      <div className="flex aspect-video w-full flex-col items-center justify-center gap-3 rounded-xl2 border border-line bg-sand text-muted">
        <Music2 className="h-10 w-10 text-line" />
        <p className="text-sm">No video loaded yet</p>
      </div>
    );
  }

  return (
    <div className="aspect-video w-full overflow-hidden rounded-xl2 border border-line bg-black shadow-card">
      <iframe
        className="h-full w-full"
        src={`https://www.youtube.com/embed/${videoId}`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    </div>
  );
}
