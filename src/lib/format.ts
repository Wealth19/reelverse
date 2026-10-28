export function formatMoney(value: number | string | null | undefined) {
  const amount = Number(value || 0);

  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function roleLabel(role?: string | null) {
  if (role === "admin") return "Admin";
  if (role === "producer") return "Author";
  if (role === "customer") return "Customer";
  return role || "Guest";
}

export function posterPalette(seed: string | number) {
  const palettes = [
    ["#1b1420", "#d4a24c"],
    ["#201510", "#d4a24c"],
    ["#111827", "#d4a24c"],
    ["#1a1030", "#d4a24c"],
    ["#0f172a", "#d4a24c"],
    ["#14221c", "#d4a24c"],
  ];

  const text = String(seed);
  const hash = [...text].reduce((sum, char) => sum + char.charCodeAt(0), 0);

  return palettes[hash % palettes.length];
}
