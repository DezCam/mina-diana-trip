import { ArrowUp } from "lucide-react";

export function BackToTop() {
  return (
    <a
      href="#top"
      className="fixed bottom-4 right-4 z-40 inline-flex h-11 w-11 items-center justify-center rounded-full bg-highland text-cream shadow-soft transition hover:bg-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tulip print:hidden"
      aria-label="Back to top"
    >
      <ArrowUp aria-hidden="true" size={20} />
    </a>
  );
}
