import { useEffect, useRef, useState } from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import ethiopia from "@/assets/coffee-ethiopia.jpg";
import kenya from "@/assets/coffee-kenya.jpg";
import blend from "@/assets/coffee-blend.jpg";
import colombia from "@/assets/coffee-colombia.jpg";

const TABS = ["Fan Favorites", "Single Origin", "Blends", "Subscriptions"] as const;

type Product = {
  origin: string;
  name: string;
  note: string;
  price: string;
  image: string;
};

const PRODUCTS_BY_TAB: Record<(typeof TABS)[number], Product[]> = {
  "Fan Favorites": [
    { origin: "House Blend", name: "Cadence Blend", note: "Dark chocolate, almond, brown sugar", price: "$18", image: blend },
    { origin: "Kenya", name: "Kabuku AA", note: "Blackcurrant, brown sugar, ripe plum", price: "$22", image: kenya },
    { origin: "Ethiopia", name: "Yaye Heirloom Honey", note: "Jasmine, stone fruit, honey", price: "$20", image: ethiopia },
    { origin: "Colombia", name: "Andres Martinez Gesha", note: "Brown sugar, apricot, jasmine", price: "$26", image: colombia },
  ],
  "Single Origin": [
    { origin: "Kenya", name: "Kabuku AA", note: "Blackcurrant, brown sugar, ripe plum", price: "$22", image: kenya },
    { origin: "Ethiopia", name: "Yaye Heirloom Honey", note: "Jasmine, stone fruit, honey", price: "$20", image: ethiopia },
    { origin: "Colombia", name: "Pink Bourbon Washed", note: "Red apple, caramel, floral", price: "$24", image: ethiopia },
  ],
  Blends: [
    { origin: "House Blend", name: "Cadence Blend", note: "Dark chocolate, almond, brown sugar", price: "$18", image: blend },
    { origin: "House Blend", name: "Neighborhood Roast", note: "Milk chocolate, almond, gentle spice", price: "$18", image: blend },
    { origin: "Decaf Blend", name: "Interlude Decaf", note: "Brown sugar, dried fruit, smooth finish", price: "$16", image: blend },
  ],
  Subscriptions: [
    { origin: "We choose, you enjoy", name: "Monthly Roaster's Pick", note: "Fresh single origin every month", price: "$22/mo", image: kenya },
    { origin: "Always stocked", name: "Espresso Subscription", note: "Cadence Blend shipped every 2 weeks", price: "$18/mo", image: blend },
    { origin: "Two bags monthly", name: "Explorer Bundle", note: "One blend, one single origin", price: "$38/mo", image: ethiopia },
  ],
};

export function ShopCoffee() {
  const [active, setActive] = useState<(typeof TABS)[number]>("Fan Favorites");
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const products = PRODUCTS_BY_TAB[active];

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollTo({ left: 0 });
    setActiveIndex(0);
    const onScroll = () => {
      const cardWidth = el.clientWidth * 0.8;
      const idx = Math.round(el.scrollLeft / cardWidth);
      setActiveIndex(Math.max(0, Math.min(products.length - 1, idx)));
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [active, products.length]);

  return (
    <section
      id="coffee"
      className="bg-[var(--cream)] py-20 text-[var(--espresso)] lg:py-24"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="text-center">
          <h2 className="font-serif text-5xl leading-tight md:text-6xl">
            Take Jubala <span className="italic font-normal">Home.</span>
          </h2>
        </div>

        {/* Tabs */}
        <div className="mt-8 -mx-6 overflow-x-auto px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div role="tablist" className="mx-auto flex w-max items-center justify-center gap-3">
            {TABS.map((tab) => {
              const isActive = tab === active;
              return (
                <button
                  key={tab}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActive(tab)}
                  className={cn(
                    "h-11 whitespace-nowrap rounded-[5px] px-5 text-sm font-medium tracking-[0.06em] transition-colors",
                    isActive
                      ? "bg-[var(--espresso)] text-[var(--yellow)]"
                      : "border border-[var(--espresso)] text-[var(--espresso)] hover:bg-[color-mix(in_oklab,var(--espresso)_6%,transparent)]",
                  )}
                >
                  {tab}
                </button>
              );
            })}
          </div>
        </div>

        {/* Products: horizontal snap carousel on all screen sizes */}
        <div
          ref={scrollerRef}
          className="mt-8 -mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-6 [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:gap-6"
        >
          {products.map((p) => (
            <article
              key={p.name}
              className="group flex w-[80%] shrink-0 snap-start flex-col rounded-[6px] border border-[var(--border)] bg-[color-mix(in_oklab,var(--cream)_55%,white)] p-4 transition-colors hover:border-[var(--warm-brown)] md:w-[340px]"
            >
                <div className="aspect-square overflow-hidden rounded-[6px] bg-[var(--cream-deep)]">
                  <img
                    src={p.image}
                    alt={p.name}
                    width={800}
                    height={800}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="mt-5 flex flex-1 flex-col">
                  <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-[var(--amber)]">
                    {p.origin}
                  </span>
                  <h3 className="mt-1.5 text-2xl leading-tight">{p.name}</h3>
                  <p className="mt-1.5 text-sm font-normal text-[color-mix(in_oklab,var(--espresso)_70%,transparent)]">
                    {p.note}
                  </p>
                  <div className="mt-5 flex items-center justify-between">
                    <span className="text-xl font-bold">{p.price}</span>
                    <button
                      type="button"
                      className="inline-flex h-10 items-center gap-2 rounded-[5px] bg-[var(--espresso)] px-4 text-sm font-medium tracking-[0.06em] text-[var(--cream)] transition-colors hover:bg-[var(--espresso-soft)]"
                    >
                      <Plus className="h-4 w-4" />
                      Add to Cart
                    </button>
                  </div>
                </div>
              </article>
            ))}
        </div>

        {/* Dot indicators (mobile only) */}
        <div className="mt-6 flex items-center justify-center gap-2 md:hidden">
          {products.map((p, i) => (
            <span
              key={p.name}
              aria-hidden
              className={cn(
                "h-2 rounded-full transition-all",
                i === activeIndex
                  ? "w-6 bg-[var(--amber)]"
                  : "w-2 bg-[color-mix(in_oklab,var(--amber)_30%,transparent)]",
              )}
            />
          ))}
        </div>

        <div className="mt-12 text-center">
          <a
            href="#all-coffees"
            className="inline-flex items-center gap-2 text-sm font-medium text-[var(--amber)] underline-offset-[6px] transition-colors hover:text-[var(--warm-brown)] hover:underline"
          >
            View all coffees <span aria-hidden>→</span>
          </a>
        </div>
      </div>
    </section>
  );
}