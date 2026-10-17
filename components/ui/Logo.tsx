import Image from "next/image";
import { brand } from "@/lib/content";

/**
 * The official logo, never redrawn. Its file carries its own navy ground, so it
 * always sits on the matching `navy` surface; a few pixels of edge feather hide
 * the slight variation in that ground.
 */
export function Logo({ width, className = "", priority = false }: { width: number; className?: string; priority?: boolean }) {
  const height = Math.round((width * brand.logo.height) / brand.logo.width);
  return (
    <Image
      src={brand.logo.src}
      alt={brand.fullName}
      width={width}
      height={height}
      priority={priority}
      unoptimized
      className={`block h-auto select-none [mask-composite:intersect] [mask-image:linear-gradient(90deg,transparent,#000_4%,#000_96%,transparent),linear-gradient(180deg,transparent,#000_4%,#000_96%,transparent)] ${className}`}
      style={{ width, maxWidth: "100%" }}
    />
  );
}
