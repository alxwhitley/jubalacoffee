import { useEffect, useRef, useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { OrderOnlineButton } from "./OrderOnlineButton";
import { LocationsMegaMenu, LocationsMobileOverlay } from "./LocationsMenu";

const LINKS = [
  { label: "Menu", href: "#menu" },
  { label: "Our Coffee", href: "#coffee" },
  { label: "Catering", href: "#catering" },
];

export function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [locOpen, setLocOpen] = useState(false);
  const [mobileLocOpen, setMobileLocOpen] = useState(false);
  const locTriggerRef = useRef<HTMLLIElement>(null);
  const hoverTimer = useRef<number | null>(null);

  function openLoc() {
    if (hoverTimer.current) {
      window.clearTimeout(hoverTimer.current);
      hoverTimer.current = null;
    }
    setLocOpen(true);
  }
  function scheduleCloseLoc() {
    if (hoverTimer.current) window.clearTimeout(hoverTimer.current);
    hoverTimer.current = window.setTimeout(() => setLocOpen(false), 150);
  }

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <header className="absolute inset-x-0 top-0 z-40">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-10 lg:py-7">
        <a
          href="/"
          className="font-serif text-2xl font-semibold tracking-[-0.02em] text-[var(--cream)] lg:text-[1.6rem]"
        >
          Jubala <span className="italic font-normal">Coffee</span>
        </a>

        <div className="hidden items-center gap-9 md:flex">
          <ul className="flex items-center gap-8">
            {LINKS.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  className="text-sm font-medium tracking-[-0.005em] text-[var(--cream)]/90 underline-offset-[6px] decoration-[var(--amber)] decoration-2 transition-colors hover:underline"
                >
                  {l.label}
                </a>
              </li>
            ))}
            <li
              ref={locTriggerRef}
              className="relative"
              onMouseEnter={openLoc}
              onMouseLeave={scheduleCloseLoc}
            >
              <button
                type="button"
                onClick={() => setLocOpen((v) => !v)}
                aria-expanded={locOpen}
                aria-haspopup="true"
                className="inline-flex items-center gap-1 text-sm font-medium tracking-[-0.005em] text-[var(--cream)]/90 underline-offset-[6px] decoration-[var(--amber)] decoration-2 transition-colors hover:underline"
              >
                Locations
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform ${locOpen ? "rotate-180" : ""}`}
                />
              </button>
              <LocationsMegaMenu
                open={locOpen}
                onClose={() => setLocOpen(false)}
                triggerRef={locTriggerRef}
              />
            </li>
          </ul>
          <OrderOnlineButton />
        </div>

        <button
          type="button"
          aria-label="Open menu"
          onClick={() => setMobileOpen(true)}
          className="rounded-md p-2 text-[var(--cream)] md:hidden"
        >
          <Menu className="h-7 w-7" />
        </button>
      </nav>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-[var(--espresso)] text-[var(--cream)] md:hidden">
          <div className="flex items-center justify-between px-6 py-6">
            <span className="font-serif text-2xl">
              Jubala <span className="italic font-normal">Coffee</span>
            </span>
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setMobileOpen(false)}
              className="rounded-md p-2"
            >
              <X className="h-7 w-7" />
            </button>
          </div>

          <ul className="flex flex-1 flex-col items-start gap-2 px-6 pt-8">
            {LINKS.map((l) => (
              <li key={l.label} className="w-full">
                <a
                  href={l.href}
                  onClick={() => setMobileOpen(false)}
                  className="block border-b border-[color-mix(in_oklab,var(--cream)_15%,transparent)] py-5 font-serif text-3xl"
                >
                  {l.label}
                </a>
              </li>
            ))}
            <li className="w-full">
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  setMobileLocOpen(true);
                }}
                className="block w-full border-b border-[color-mix(in_oklab,var(--cream)_15%,transparent)] py-5 text-left font-serif text-3xl"
              >
                Locations
              </button>
            </li>
          </ul>

          <div className="px-6 pb-10 pt-6">
            <OrderOnlineButton variant="block" />
          </div>
        </div>
      )}
      <LocationsMobileOverlay
        open={mobileLocOpen}
        onClose={() => setMobileLocOpen(false)}
      />
    </header>
  );
}