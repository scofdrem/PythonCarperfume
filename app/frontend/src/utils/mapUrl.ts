/**
 * Build an OpenStreetMap embed URL from an address string.
 * Falls back to a default URL if the address is empty.
 */
export function buildMapUrl(address: string): string {
  if (!address || !address.trim()) {
    return "";
  }
  const encoded = encodeURIComponent(address.trim());
  // OpenStreetMap search-based embed
  return `https://www.openstreetmap.org/export/embed.html?bbox=auto&layer=mapnik&marker=auto&q=${encoded}`;
}