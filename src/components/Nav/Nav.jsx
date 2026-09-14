import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../context/CartContext.jsx';
import { PitchIcon, JerseyIcon, TimelineIcon, BallIcon, MenuIcon, CloseIcon } from './Icons.jsx';

const LINKS = [
  { to: '/', label: 'Home', icon: PitchIcon },
  { to: '/collections', label: 'Collections', icon: JerseyIcon },
  { to: '/history', label: 'History', icon: TimelineIcon },
  { to: '/cart', label: 'Cart', icon: BallIcon },
];

export default function Nav() {
  const { count } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-40 transition-colors duration-500 ${
        scrolled ? 'bg-ink/90 backdrop-blur border-b border-cream/10' : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="container-px flex items-center justify-between h-16 md:h-20">
        <NavLink to="/" className="font-display font-extrabold text-lg md:text-xl tracking-widest2 shrink-0">
          NINETY<span className="text-brand-live">+</span>
        </NavLink>

        <nav className="hidden md:flex items-center gap-8">
          {LINKS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `group relative flex items-center gap-2 text-sm tracking-widest2 uppercase transition-colors duration-300 ${
                  isActive ? 'text-cream' : 'text-cream/55 hover:text-cream'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                  {label === 'Cart' && count > 0 && (
                    <span className="absolute -top-2 -right-3.5 min-w-[16px] h-4 px-1 rounded-full bg-brand-live text-ink text-[10px] font-bold flex items-center justify-center">
                      {count}
                    </span>
                  )}
                  <motion.span
                    className="absolute -bottom-1.5 left-0 h-px bg-brand-live"
                    initial={false}
                    animate={{ width: isActive ? '100%' : '0%' }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                  />
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <button
          className="md:hidden p-2 -mr-2 text-cream"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <CloseIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="md:hidden overflow-hidden bg-ink border-b border-cream/10"
          >
            <div className="container-px py-4 flex flex-col gap-1">
              {LINKS.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 py-3 text-sm tracking-widest2 uppercase border-b border-cream/5 ${
                      isActive ? 'text-cream' : 'text-cream/55'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                  {label === 'Cart' && count > 0 && (
                    <span className="ml-auto min-w-[18px] h-[18px] px-1 rounded-full bg-brand-live text-ink text-[10px] font-bold flex items-center justify-center">
                      {count}
                    </span>
                  )}
                </NavLink>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
