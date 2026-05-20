import { useEffect, useRef, useState } from "react";
import { Clipboard, Check, MapPin, X } from "lucide-react";
import { cn } from "@/lib/utils";
import mapLafayette from "@/assets/map-lafayette.jpg";
import mapHillsborough from "@/assets/map-hillsborough.jpg";
import mapNorthHills from "@/assets/map-northhills.jpg";
import mapDowntown from "@/assets/map-downtown.jpg";

export type Location = {
  id: string;
  name: string;
  neighborhood: string;
  address: string;
  orderUrl: string;
  map: string;
  badge?: string;
};

export const LOCATIONS: Location[] = [
  {
    id: "lafayette",
    name: "Lafayette Village",
    neighborhood: "North Raleigh",
    address: "8450 Honeycutt Rd, Raleigh, NC 27615",
    orderUrl:
      "https://order.toasttab.com/online/jubala-coffee-lafayette-village-8450-honeycutt-rd",
    map: mapLafayette,
  },
  {
    id: "hillsborough",
    name: "Hillsborough St",
    neighborhood: "NC State",
    address: "2100 Hillsborough St, Raleigh, NC 27607",
    orderUrl:
      "https://order.toasttab.com/online/jubala-hillsborough-2100-hillsborough-street",
    map: mapHillsborough,
  },
  {
    id: "northhills",
    name: "North Hills",
    neighborhood: "Midtown",
    address: "200 Park at N Hills St, Raleigh, NC 27609",
    orderUrl:
      "https://order.toasttab.com/online/jubala-coffee-north-hills-200-park-at-n-hills-st",
    map: mapNorthHills,
  },
  {
    id: "downtown",
    name: "Downtown",
    neighborhood: "Marigold",
    address: "301 Hillsborough St, Raleigh, NC 27603",
    orderUrl:
      "https://order.toasttab.com/online/jubala-coffee-marigold-301-hillsborough-street",
    map: mapDowntown,
    badge: "NEW",
  },
];

function MapPanel({ location }: { location: Location }) {
  return (
    <div className="flex h-full flex-col">
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[6px] bg-[var(--cream-deep)]">
        <img
          src={location.map}
          alt={`Map of ${location.name}`}
          width={1024}
          height={768}
          loading="lazy"
          className="h-full w-full object-cover"
        />
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="relative">
            <span className="absolute -inset-3 animate-ping rounded-full bg-[var(--amber)]/40" />
            <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-full bg-[var(--espresso)] text-[var(--amber)] shadow-lg">
              <MapPin className="h-5 w-5" />
            </span>
          </div>
        </div>
      </div>
      <a
        href={location.orderUrl}
        target="_blank"
        rel="noreferrer noopener"
        className="mt-4 inline-flex h-11 items-center justify-center rounded-[5px] bg-[var(--amber)] px-5 text-sm font-semibold text-[var(--espresso)] transition-colors hover:bg-[var(--warm-brown)]"
      >
        Order Online at {location.name}
      </a>
    </div>
  );
}

function LocationRow({
  loc,
  active,
  onSelect,
  onCopy,
  copied,
}: {
  loc: Location;
  active: boolean;
  onSelect: () => void;
  onCopy: (e: React.MouseEvent) => void;
  copied: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "group flex w-full items-start gap-3 border-l-2 px-4 py-4 text-left transition-colors",
        active
          ? "border-[var(--amber)] bg-[color-mix(in_oklab,var(--espresso)_4%,transparent)]"
          : "border-transparent hover:bg-[color-mix(in_oklab,var(--espresso)_2%,transparent)]",
      )}
    >
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h4 className="font-serif text-lg text-[var(--espresso)]">{loc.name}</h4>
          {loc.badge && (
            <span className="rounded-sm bg-[var(--amber)] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.15em] text-[var(--espresso)]">
              {loc.badge}
            </span>
          )}
        </div>
        <p className="mt-0.5 text-xs font-medium uppercase tracking-[0.15em] text-[color-mix(in_oklab,var(--espresso)_60%,transparent)]">
          {loc.neighborhood}
        </p>
        <p className="mt-1.5 text-xs font-light text-[color-mix(in_oklab,var(--espresso)_70%,transparent)]">
          {loc.address}
        </p>
      </div>
      <span
        role="button"
        tabIndex={0}
        onClick={onCopy}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onCopy(e as unknown as React.MouseEvent);
          }
        }}
        aria-label={copied ? "Address copied" : "Copy address"}
        className="relative mt-1 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-[5px] text-[var(--espresso)]/60 transition-colors hover:bg-[color-mix(in_oklab,var(--espresso)_8%,transparent)] hover:text-[var(--espresso)]"
      >
        {copied ? <Check className="h-4 w-4 text-[var(--amber)]" /> : <Clipboard className="h-3.5 w-3.5" />}
        {copied && (
          <span className="pointer-events-none absolute -top-7 right-0 rounded-sm bg-[var(--espresso)] px-2 py-0.5 text-[10px] font-medium text-[var(--cream)]">
            Copied!
          </span>
        )}
      </span>
    </button>
  );
}

export function LocationsMegaMenu({
  open,
  onClose,
  triggerRef,
  onMouseEnter,
  onMouseLeave,
}: {
  open: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLElement | null>;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}) {
  const [selected, setSelected] = useState<string>(LOCATIONS[0].id);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onDocClick(e: MouseEvent) {
      const t = e.target as Node;
      if (
        panelRef.current &&
        !panelRef.current.contains(t) &&
        triggerRef.current &&
        !triggerRef.current.contains(t)
      ) {
        onClose();
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose, triggerRef]);

  const active = LOCATIONS.find((l) => l.id === selected) ?? LOCATIONS[0];

  function copyAddress(loc: Location) {
    void navigator.clipboard?.writeText(loc.address).catch(() => {});
    setCopiedId(loc.id);
    window.setTimeout(() => {
      setCopiedId((c) => (c === loc.id ? null : c));
    }, 1600);
  }

  if (!open) return null;

  return (
    <div
      ref={panelRef}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="absolute inset-x-0 top-full z-50 mx-auto hidden w-full overflow-hidden rounded-b-[8px] border-x border-b border-[var(--border)] bg-[var(--cream)] text-[var(--espresso)] shadow-[0_20px_40px_-12px_rgba(26,18,8,0.25),-16px_0_30px_-20px_rgba(26,18,8,0.18),16px_0_30px_-20px_rgba(26,18,8,0.18)] md:block"
    >
      <div className="grid grid-cols-1 md:grid-cols-[1fr_1.1fr]">
        <div className="border-r border-[var(--border)] py-3">
          <p className="px-4 pb-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--amber)]">
            Four Raleigh shops
          </p>
          {LOCATIONS.map((loc) => (
            <LocationRow
              key={loc.id}
              loc={loc}
              active={loc.id === selected}
              onSelect={() => setSelected(loc.id)}
              onCopy={(e) => {
                e.stopPropagation();
                copyAddress(loc);
              }}
              copied={copiedId === loc.id}
            />
          ))}
        </div>
        <div className="p-5">
          <MapPanel location={active} />
        </div>
      </div>
    </div>
  );
}

export function LocationsMobileOverlay({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [expandedId, setExpandedId] = useState<string>(LOCATIONS[0].id);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  function copyAddress(loc: Location) {
    void navigator.clipboard?.writeText(loc.address).catch(() => {});
    setCopiedId(loc.id);
    window.setTimeout(() => {
      setCopiedId((c) => (c === loc.id ? null : c));
    }, 1600);
  }

  const active = LOCATIONS.find((l) => l.id === expandedId) ?? LOCATIONS[0];

  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-[var(--cream)] text-[var(--espresso)] md:hidden">
      <div className="flex items-center justify-between border-b border-[var(--border)] px-6 py-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--amber)]">
            Visit
          </p>
          <h3 className="font-serif text-2xl">Our Locations</h3>
        </div>
        <button
          type="button"
          aria-label="Close locations"
          onClick={onClose}
          className="rounded-md p-2 text-[var(--espresso)]"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      {/* Fixed map */}
      <div className="relative h-[220px] w-full shrink-0 overflow-hidden bg-[var(--cream-deep)]">
        <img
          src={active.map}
          alt={`Map of ${active.name}`}
          width={1024}
          height={768}
          className="h-full w-full object-cover"
        />
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="relative">
            <span className="absolute -inset-3 animate-ping rounded-full bg-[var(--amber)]/40" />
            <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-full bg-[var(--espresso)] text-[var(--amber)] shadow-lg">
              <MapPin className="h-5 w-5" />
            </span>
          </div>
        </div>
      </div>

      {/* Scrollable list */}
      <div className="flex-1 overflow-y-auto">
        {LOCATIONS.map((loc) => (
          <div
            key={loc.id}
            className="border-b border-[color-mix(in_oklab,var(--espresso)_12%,transparent)]"
          >
            <button
              type="button"
              onClick={() => setExpandedId(loc.id)}
              className={cn(
                "flex w-full items-start gap-3 border-l-2 px-5 py-4 text-left transition-colors",
                loc.id === expandedId
                  ? "border-[var(--amber)] bg-[#e8ddc8]"
                  : "border-transparent",
              )}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-serif text-lg text-[var(--espresso)]">{loc.name}</h4>
                  {loc.badge && (
                    <span className="rounded-sm bg-[var(--amber)] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.15em] text-[var(--espresso)]">
                      {loc.badge}
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-xs font-medium uppercase tracking-[0.15em] text-[color-mix(in_oklab,var(--espresso)_60%,transparent)]">
                  {loc.neighborhood}
                </p>
                <p className="mt-1.5 text-xs font-light text-[color-mix(in_oklab,var(--espresso)_70%,transparent)]">
                  {loc.address}
                </p>
              </div>
              <span
                role="button"
                tabIndex={0}
                onClick={(e) => {
                  e.stopPropagation();
                  copyAddress(loc);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    e.stopPropagation();
                    copyAddress(loc);
                  }
                }}
                aria-label={copiedId === loc.id ? "Address copied" : "Copy address"}
                className="relative mt-1 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-[5px] text-[var(--espresso)]/60"
              >
                {copiedId === loc.id ? (
                  <Check className="h-4 w-4 text-[var(--amber)]" />
                ) : (
                  <Clipboard className="h-4 w-4" />
                )}
                {copiedId === loc.id && (
                  <span className="pointer-events-none absolute -top-7 right-0 rounded-sm bg-[var(--espresso)] px-2 py-0.5 text-[10px] font-medium text-[var(--cream)]">
                    Copied!
                  </span>
                )}
              </span>
            </button>
          </div>
        ))}
      </div>

      {/* Sticky CTA */}
      <div className="border-t border-[var(--border)] bg-[var(--cream)] p-4">
        <a
          href={active.orderUrl}
          target="_blank"
          rel="noreferrer noopener"
          className="flex h-12 w-full items-center justify-center rounded-[5px] bg-[var(--amber)] px-5 text-sm font-semibold text-[var(--espresso)] transition-colors hover:bg-[var(--warm-brown)]"
        >
          Order Online at {active.name}
        </a>
      </div>
    </div>
  );
}