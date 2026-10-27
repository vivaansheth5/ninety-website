import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-x flex min-h-[60vh] flex-col items-start justify-center py-20">
      <p className="eyebrow text-volt">404</p>
      <h1 className="display mt-3 text-[clamp(3rem,12vw,8rem)] uppercase">Lost the plot.</h1>
      <p className="mt-4 max-w-md text-mist">This page doesn&apos;t exist — but plenty of things you didn&apos;t know you needed do.</p>
      <Link href="/products" className="btn-volt mt-8">Explore all products</Link>
    </div>
  );
}
