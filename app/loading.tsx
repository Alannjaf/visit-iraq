export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
      <div className="text-center">
        <div className="inline-block w-16 h-16 border-4 border-[var(--primary)] border-t-[var(--secondary)] rounded-full animate-spin mb-4"></div>
        <p className="text-[var(--foreground-muted)] font-medium">Loading...</p>
      </div>
    </div>
  );
}

