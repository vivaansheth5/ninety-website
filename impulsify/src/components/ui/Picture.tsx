import { cx } from "@/lib/format";
import { isOptimized, srcSetFor } from "@/lib/images";

export interface PictureProps {
  src: string;
  alt: string;
  sizes?: string;
  priority?: boolean;
  blur?: string;
  className?: string;
  style?: React.CSSProperties;
  draggable?: boolean;
  width?: number;
  height?: number;
}

/**
 * <picture> with AVIF → WebP fallback and a responsive srcset. Client- and server-safe.
 * Lazy by default; `priority` = eager + high fetch priority (use for the LCP image only).
 */
export function Picture({ src, alt, sizes = "(min-width: 1024px) 33vw, 50vw", priority, blur, className, style, draggable, width = 1200, height = 1200 }: PictureProps) {
  const img = (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      sizes={isOptimized(src) ? sizes : undefined}
      srcSet={isOptimized(src) ? srcSetFor(src, "webp") : undefined}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      fetchPriority={priority ? "high" : undefined}
      draggable={draggable}
      className={cx("h-full w-full object-cover", className)}
      style={blur ? { backgroundImage: `url(${blur})`, backgroundSize: "cover", ...style } : style}
    />
  );
  if (!isOptimized(src)) return img;
  return (
    <picture className="contents">
      <source type="image/avif" srcSet={srcSetFor(src, "avif")} sizes={sizes} />
      {img}
    </picture>
  );
}
