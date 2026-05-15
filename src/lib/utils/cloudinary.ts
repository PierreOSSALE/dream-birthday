export type CloudinaryOptions = {
  width?: number;
  height?: number;
  quality?: number | "auto";
  fit?: "limit" | "crop" | "fill" | "scale" | string;
};

export function optimizeCloudinaryUrl(src: string, options: CloudinaryOptions = {}): string {
  if (!src) return src;

  const { width, height, quality = "auto", fit } = options;

  // Basic Cloudinary URL transform: insert transformation after `/upload/`
  try {
    const url = new URL(src, "http://example.com");
    const isCloudinary = url.hostname.includes("cloudinary.com");

    if (isCloudinary) {
      const parts = url.pathname.split("/upload/");
      if (parts.length === 2) {
        const transformations: string[] = [];
        if (width) transformations.push(`w_${width}`);
        if (height) transformations.push(`h_${height}`);
        if (fit) transformations.push(`c_${fit}`);
        if (quality) transformations.push(`q_${quality}`);
        const tx = transformations.length ? transformations.join(",") + "/" : "";
        return src.replace("/upload/", `/upload/${tx}`);
      }
    }

    // For non-cloudinary hosts, try adding simple query params used by many CDNs
    const params = url.searchParams;
    if (width) params.set("w", String(width));
    if (height) params.set("h", String(height));
    if (quality && quality !== "auto") params.set("q", String(quality));
    url.search = params.toString();
    // If we used a base for URL parsing, ensure we return original-origin style
    if (src.startsWith("http") || src.startsWith("//")) return url.toString();
    return url.pathname + (url.search ? `?${url.search}` : "");
  } catch (e) {
    // Fallback: return the original src if URL parsing fails.
    return src;
  }
}
