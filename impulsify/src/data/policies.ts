/**
 * POLICY TEMPLATES. These are structured drafts for the store owner to complete
 * and have reviewed before launch. They intentionally contain no invented
 * timelines, fees, warranties or guarantees. Bracketed items must be filled in.
 */
export const policies: Record<string, { title: string; intro: string; sections: { h: string; body: string[] }[] }> = {
  shipping: {
    title: "Shipping Policy",
    intro: "How and when your Impulsify order reaches you.",
    sections: [
      { h: "Where we ship", body: ["We plan to ship across India. Serviceable pin codes: [to be confirmed by the store owner]."] },
      { h: "Dispatch time", body: ["Orders are dispatched within [X business days] of confirmation. [To be confirmed]."] },
      { h: "Delivery time and charges", body: ["Estimated delivery: [X–Y business days] depending on location. Shipping charges and any free-shipping threshold are shown at checkout. [To be confirmed]."] },
      { h: "Tracking", body: ["A tracking link will be emailed or messaged once your order ships."] },
      { h: "Cash on delivery", body: ["Availability of cash on delivery: [to be confirmed]."] },
    ],
  },
  returns: {
    title: "Return Policy",
    intro: "Our return and refund terms. To be finalised by the store owner before launch.",
    sections: [
      { h: "Return window", body: ["Returns accepted within [X days] of delivery for eligible items. [To be confirmed]."] },
      { h: "Eligibility", body: ["Items must be unused, in original packaging, with all accessories. Hygiene-sensitive items (for example grooming products) may not be returnable once opened. [To be confirmed]."] },
      { h: "Damaged or incorrect items", body: ["If your item arrives damaged or incorrect, contact us within [X days] with photos and your order number."] },
      { h: "Refunds", body: ["Approved refunds are issued to the original payment method within [X business days]. [To be confirmed]."] },
      { h: "Warranty", body: ["Manufacturer warranty terms, if any, will be listed on each product page once confirmed with suppliers. We do not advertise warranties we cannot verify."] },
    ],
  },
  privacy: {
    title: "Privacy Policy",
    intro: "How Impulsify handles your personal information. Template — have it reviewed for compliance with India's Digital Personal Data Protection Act, 2023 before launch.",
    sections: [
      { h: "What this website stores", body: ["This storefront stores your cart and wishlist in your browser's local storage on your device. It does not send them to an Impulsify server.", "The newsletter form in this preview does not store email addresses."] },
      { h: "Checkout data", body: ["When checkout is connected, orders are processed by Shopify. Payment details are entered on Shopify's hosted checkout and are handled by Shopify and its payment providers — not by this website."] },
      { h: "Analytics and cookies", body: ["[List analytics or marketing tools here once added, with consent options where required.]"] },
      { h: "Your rights and contact", body: ["To access, correct or delete your data, contact [privacy contact email]. Grievance officer: [name, contact]."] },
    ],
  },
  terms: {
    title: "Terms of Service",
    intro: "The terms that apply when you use the Impulsify store. Template — to be completed and legally reviewed before launch.",
    sections: [
      { h: "About us", body: ["Impulsify is operated by [legal business name], [registered address], [GSTIN]."] },
      { h: "Products and pricing", body: ["Prices are in Indian Rupees (INR). Product images may be illustrative. We make reasonable efforts to describe products accurately and mark unverified details as pending."] },
      { h: "Orders", body: ["An order is confirmed when you receive an order confirmation. We may cancel orders affected by pricing errors or stock issues, with a full refund."] },
      { h: "Governing law", body: ["These terms are governed by the laws of India. [Jurisdiction to be confirmed]."] },
    ],
  },
  payments: {
    title: "Payments",
    intro: "How payment works at Impulsify.",
    sections: [
      { h: "Secure hosted checkout", body: ["Payments are taken on Shopify's hosted checkout. This website never sees or stores your card, UPI or bank details."] },
      { h: "Accepted methods", body: ["Accepted payment methods (for example UPI, cards, net banking, wallets) depend on the payment provider the store owner enables in Shopify. [To be confirmed]."] },
      { h: "Preview mode", body: ["In this preview, checkout runs in demo mode: no order is placed and no payment is taken."] },
    ],
  },
};
