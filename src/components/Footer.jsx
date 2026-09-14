export default function Footer() {
  return (
    <footer className="border-t border-cream/10 mt-24">
      <div className="container-px py-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="font-display font-extrabold text-lg tracking-widest2">
            NINETY<span className="text-brand-live">+</span>
          </div>
          <p className="text-cream/45 text-sm mt-2 max-w-sm">
            Football streetwear for people who watched it happen — Maradona to Messi, terrace to street.
          </p>
        </div>
        <div className="text-cream/40 text-xs tracking-widest2 uppercase">
          © {new Date().getFullYear()} Ninety+. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
