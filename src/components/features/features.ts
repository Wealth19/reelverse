const features: Array<{
  title: string;
  description: string;
  icon: "film" | "tv" | "sparkles" | "smartphone";
}> = [
  {
    title: "Timed rentals",
    description:
      "Borrow a title for 1, 3, or 7 days. Playback stops when the clock runs out.",
    icon: "film",
  },
  {
    title: "Buy forever",
    description:
      "Purchase once from your wallet and keep the movie in your library.",
    icon: "tv",
  },
  {
    title: "Customer wallet",
    description:
      "Fund your balance, then rent or buy without leaving the app.",
    icon: "sparkles",
  },
  {
    title: "Author studio",
    description:
      "Creators upload movies with rental and purchase prices in minutes.",
    icon: "smartphone",
  },
];

export default features;
