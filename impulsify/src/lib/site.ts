export const site = {
  name: "IMPULSIFY",
  tagline: "Things You Didn't Know You Needed.",
  supporting: "Unexpected Finds. Instant Obsession.",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, ""),
  description:
    "Impulsify is an Indian online store for unusual, clever and beautifully designed gadgets — levitating displays, glow-in-the-dark accessories, app-controlled planes and more.",
  /** Contact details are placeholders until the owner provides real ones. */
  contact: { email: "hello@impulsify.example", hours: "Mon–Sat, 10am–7pm IST", placeholder: true },
  /** Shipping & returns are policy TEMPLATES — owner must confirm before launch. */
  shipping: { summary: "Shipping across India. Rates and timelines are confirmed at checkout.", confirmed: false },
  returns: { summary: "Return window and conditions will be confirmed before launch.", confirmed: false },
  /** Under-₹999 section only renders once real prices are confirmed. */
  pricesConfirmed: false,
};

export const absoluteUrl = (path = "/") => `${site.url}${path.startsWith("/") ? path : `/${path}`}`;
