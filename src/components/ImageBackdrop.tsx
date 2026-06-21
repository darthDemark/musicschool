import clsx from "clsx";
import type { ReactNode } from "react";

interface ImageBackdropProps {
  /** Path under /public, e.g. /images/hitcamp/production.png */
  src?: string | null;
  className?: string;
  /** Tailwind classes for the gradient overlay (defaults to a strong bottom fade). */
  overlayClassName?: string;
  /** Enable the subtle hover zoom (requires the element to be the hover group). */
  zoom?: boolean;
  children?: ReactNode;
}

/**
 * Renders an image as a background only (text stays live HTML on top), with a
 * dark gradient overlay, subtle hover zoom, and responsive cropping (bg-cover).
 * Missing images degrade gracefully to the dark studio background — no crash.
 */
export function ImageBackdrop({
  src,
  className,
  overlayClassName,
  zoom = true,
  children,
}: ImageBackdropProps) {
  return (
    <div className={clsx("group relative overflow-hidden bg-studio2", className)}>
      {src && (
        <div
          aria-hidden
          className={clsx(
            "absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-out",
            zoom && "group-hover:scale-[1.04]"
          )}
          style={{ backgroundImage: `url('${src}')` }}
        />
      )}
      <div
        aria-hidden
        className={clsx(
          "absolute inset-0",
          overlayClassName ??
            "bg-gradient-to-t from-studio via-studio/75 to-studio/25"
        )}
      />
      <div className="relative h-full">{children}</div>
    </div>
  );
}
