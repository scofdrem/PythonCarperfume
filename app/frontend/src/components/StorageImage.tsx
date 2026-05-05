import { useState, useEffect } from "react";
import { resolveImageUrl } from "@/utils/storage";

/**
 * Image component that resolves storage:// URLs to displayable HTTP URLs.
 * Falls back gracefully while loading or on error.
 */
export function StorageImage({
  src,
  alt,
  className,
  fallbackSrc,
  ...props
}: React.ImgHTMLAttributes<HTMLImageElement> & {
  src: string;
  alt: string;
  fallbackSrc?: string;
}) {
  const [resolvedSrc, setResolvedSrc] = useState<string>("");
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setError(false);

    if (!src) {
      setResolvedSrc(fallbackSrc || "");
      return;
    }

    // If it's already a regular URL or data URI, use directly
    if (
      src.startsWith("http://") ||
      src.startsWith("https://") ||
      src.startsWith("data:")
    ) {
      setResolvedSrc(src);
      return;
    }

    // Resolve storage reference asynchronously
    resolveImageUrl(src).then((url) => {
      if (!cancelled) {
        setResolvedSrc(url || fallbackSrc || "");
      }
    });

    return () => {
      cancelled = true;
    };
  }, [src, fallbackSrc]);

  if (error && fallbackSrc) {
    return <img src={fallbackSrc} alt={alt} className={className} {...props} />;
  }

  if (!resolvedSrc) {
    return (
      <div className={`${className} bg-white/5 animate-pulse`} {...props} />
    );
  }

  return (
    <img
      src={resolvedSrc}
      alt={alt}
      className={className}
      onError={() => setError(true)}
      {...props}
    />
  );
}