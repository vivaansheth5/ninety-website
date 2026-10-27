import type { Category } from "@/lib/commerce/types";

export const categories: Category[] = [
  { id: "tech-gadgets", handle: "tech-gadgets", title: "Tech & Gadgets", blurb: "Clever electronics that make people ask how.", coverProduct: "interactive-digital-cube" },
  { id: "charging-power", handle: "charging-power", title: "Charging & Power", blurb: "Smarter ways to keep everything alive.", coverProduct: "cute-character-charger" },
  { id: "desk-setup", handle: "desk-setup", title: "Desk Setup", blurb: "Upgrades for the place you spend all day.", coverProduct: "levitating-racing-display" },
  { id: "audio-speakers", handle: "audio-speakers", title: "Audio & Speakers", blurb: "Sound in shapes you didn't expect.", coverProduct: "frog-bluetooth-speaker" },
  { id: "lifestyle-essentials", handle: "lifestyle-essentials", title: "Lifestyle Essentials", blurb: "Small fixes for everyday annoyances.", coverProduct: "electric-fabric-shaver" },
  { id: "travel-edc", handle: "travel-edc", title: "Travel & Everyday Carry", blurb: "Pocketable, packable, always useful.", coverProduct: "trackable-tripod-wallet" },
  { id: "grooming-care", handle: "grooming-care", title: "Grooming & Personal Care", blurb: "Look sharp with less effort.", coverProduct: "steam-straightening-brush" },
  { id: "lights-decor", handle: "lights-decor", title: "Lights & Room Decor", blurb: "Turn your room into a mood.", coverProduct: "rgb-cloud-lamp" },
  { id: "gifts-unusual", handle: "gifts-unusual", title: "Gifts & Unusual Finds", blurb: "For people who already have everything.", coverProduct: "smartphone-controlled-airplane" },
];

export const getCategory = (handle: string) => categories.find((c) => c.handle === handle) ?? null;
