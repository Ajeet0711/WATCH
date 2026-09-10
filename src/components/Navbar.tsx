import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Home, Sparkles, BarChart3, Settings } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import { getAppState } from '../utils/localStorage.ts';

interface NavItem {
  path: string;
  icon: LucideIcon;
  label: string;
}

export default function Navbar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(() => window.scrollY > 8);
  const state = getAppState();
  const hasCompleted = state.user.hasCompletedOnboarding;

  // Deepen the nav's shadow once the page moves, so it lifts off the content.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close the mobile drawer on Escape.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setIsOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen]);

  const isActive = (path: string) => location.pathname === path;

  const links: NavItem[] = [
    ...(hasCompleted
      ? [
          { path: '/dashboard', icon: Home, label: 'Home' },
          { path: '/companion', icon: Sparkles, label: 'Companion' },
        ]
      : []),
    { path: '/caregiver', icon: BarChart3, label: 'Dashboard' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  const NavPill = ({ item, mobile = false }: { item: NavItem; mobile?: boolean }) => {
    const active = isActive(item.path);
    return (
      <Link
        to={item.path}
        onClick={() => setIsOpen(false)}
        aria-current={active ? 'page' : undefined}
        className={`group flex items-center gap-2.5 rounded-full font-semibold transition-all duration-200 ${
          mobile ? 'px-5 py-4 text-lg' : 'px-4 py-2.5 text-base'
        } ${
          active
            ? 'bg-white text-wellness-700 shadow-md shadow-black/10'
            : 'text-white/95 hover:bg-white/20 hover:text-white active:scale-95'
        }`}
      >
        <item.icon
          size={mobile ? 24 : 20}
          className={`transition-transform duration-200 ${active ? '' : 'group-hover:scale-110'}`}
        />
        {item.label}
      </Link>
    );
  };

  return (
    <nav
      className={`fixed top-0 w-full z-40 text-white transition-shadow duration-300 bg-gradient-to-r from-wellness-600 via-wellness-500 to-wellness-600 ${
        scrolled ? 'shadow-xl shadow-wellness-900/20' : 'shadow-md shadow-wellness-900/10'
      }`}
    >
      {/* Soft highlight along the top edge for a little depth */}
      <div className="absolute inset-x-0 top-0 h-px bg-white/25" aria-hidden="true" />

      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 font-bold text-xl md:text-2xl tracking-tight"
          >
            <span className="text-3xl md:text-4xl animate-float drop-shadow-sm">🦋</span>
            <span className="hidden sm:flex flex-col leading-none">
              <span className="tracking-[0.12em]">WATCH</span>
              <span className="text-[0.6rem] md:text-xs font-medium tracking-[0.14em] uppercase text-white/70 mt-1">
                Wellness Anomaly Tracking
              </span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1.5">
            {links.map((link) => (
              <NavPill key={link.path} item={link} />
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
            className="md:hidden p-2.5 rounded-xl text-white hover:bg-white/20 active:scale-95 transition-all"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`md:hidden grid transition-all duration-300 ease-out ${
            isOpen ? 'grid-rows-[1fr] opacity-100 pb-4' : 'grid-rows-[0fr] opacity-0'
          }`}
        >
          <div className="overflow-hidden">
            <div className="space-y-1.5 border-t border-white/20 pt-3">
              {links.map((link) => (
                <NavPill key={link.path} item={link} mobile />
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
