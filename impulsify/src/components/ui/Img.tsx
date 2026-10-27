import Image from "next/image";
import { preload } from "react-dom";
import { cx } from "@/lib/format";
import { isOptimized, srcSetFor } from "@/lib/images";
import { Picture, type PictureProps } from "./Picture";

/**
 * Server-side image primitive.
 * - Local product images → pre-optimised AVIF/WebP <picture> (no runtime image server needed).
 *   `priority` also emits a <link rel="preload"> so the LCP image starts downloading immediately.
 * - Remote images (e.g. Shopify CDN) → next/image.
 */
export function Img(props: PictureProps) {
  const { src, alt, sizes = "(min-width: 1024px) 33vw, 50vw", priority, className, style } = props;
  if (isOptimized(src)) {
    if (priority) preload(src, { as: "image", imageSrcSet: srcSetFor(src, "avif"), imageSizes: sizes, fetchPriority: "high", type: "image/avif" } as Parameters<typeof preload>[1]);
    return <Picture {...props} />;
  }
  return <Image src={src} alt={alt} width={1200} height={1200} sizes={sizes} priority={priority} className={cx("h-full w-full object-cover", className)} style={style} />;
}
