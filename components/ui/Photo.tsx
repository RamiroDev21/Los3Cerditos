import Image from "next/image";
import { isReferencePhoto } from "@/lib/menu";

/**
 * Food photo with an honest tag while it is a stock stand-in. Swap the src for
 * the restaurant's own photo (in /public) and the tag disappears by itself.
 */
export function Photo({
  src,
  alt,
  sizes,
  className = "",
  imgClassName = "",
  priority = false,
}: {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
}) {
  return (
    <div className={`relative overflow-hidden bg-navy-deep ${className}`}>
      <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className={`object-cover ${imgClassName}`} />
      {isReferencePhoto(src) && (
        <span className="absolute right-2.5 bottom-2.5 rounded-full bg-navy-deep/75 px-2.5 py-1 text-[0.6875rem] font-semibold text-lilac backdrop-blur-sm">
          Foto de referencia
        </span>
      )}
    </div>
  );
}
