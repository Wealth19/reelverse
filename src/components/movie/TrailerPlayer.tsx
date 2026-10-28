interface TrailerPlayerProps {
  title: string;
  trailerUrl?: string | null;
}

const getYouTubeVideoId = (trailerUrl: string) => {
  try {
    const url = new URL(trailerUrl);
    const hostname = url.hostname.replace(/^www\./, "");
    let videoId: string | null = null;

    if (hostname === "youtu.be") {
      videoId = url.pathname.slice(1).split("/")[0];
    } else if (
      hostname === "youtube.com" ||
      hostname === "m.youtube.com" ||
      hostname === "youtube-nocookie.com"
    ) {
      videoId =
        url.searchParams.get("v") ||
        url.pathname.match(/^\/(?:embed|shorts)\/([^/]+)/)?.[1] ||
        null;
    }

    return videoId && /^[\w-]{11}$/.test(videoId) ? videoId : null;
  } catch {
    return null;
  }
};

export default function TrailerPlayer({
  title,
  trailerUrl,
}: TrailerPlayerProps) {
  const videoId = trailerUrl ? getYouTubeVideoId(trailerUrl) : null;

  if (!videoId) {
    return (
      <p className="mt-3 text-sm text-[#b8ab98]">
        No trailer is available for this title yet.
      </p>
    );
  }

  return (
    <div className="mt-4 aspect-video overflow-hidden rounded-xl border border-[#2a241c] bg-black">
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${videoId}`}
        title={`${title} official trailer`}
        className="h-full w-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    </div>
  );
}
