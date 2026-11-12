export function MorrowLogo({ className = 'w-10 h-10', alt = 'Morrow Mascot' }: { className?: string; alt?: string }) {
  return (
    <img
      src="/app-logo.svg"
      alt={alt}
      className={`object-contain select-none drop-shadow-sm ${className}`}
      loading="eager"
    />
  );
}

