const inr = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });
export const formatINR = (amount: number) => inr.format(amount);
export const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");
