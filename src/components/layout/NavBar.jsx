import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from '../../hooks/useTranslation';
import LdreasLogo from '../ui/LdreasLogo';
import { Button } from '../ui/Button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../ui/Sheet';
import { Menu } from 'lucide-react';

export default function NavBar() {
  const { t, lang } = useTranslation();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  const navItems = [
    { key: 'home', label: t('navHome'), path: '/' },
    { key: 'about', label: t('navAbout'), path: '/about' },
    { key: 'team', label: t('navTeam') || 'Team', path: '/team' },
    { key: 'publications', label: t('navPublications'), path: '/publications' },
    { key: 'news', label: t('navNews'), path: '/news' },
    { key: 'events', label: t('eventsTitle') || 'Events', path: '/events' },
    { key: 'contact', label: t('navContact') || 'Contact', path: '/contact' },
  ];

  function isNavActive(path) {
    if (path === '/') return location.pathname === '/';
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  }

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur py-2" role="navigation" aria-label="Main navigation">
      <div className="container-custom flex items-center justify-between flex-row-reverse-rtl">
        {/* Logo brand in NavBar */}
        <div className="flex items-center font-sans">
          <Link to="/" className="flex items-center gap-3" aria-label="LDERAS Home">
            <LdreasLogo variant="dark" className="h-12 w-auto" />
            <span className="font-extrabold text-base text-primary tracking-wider uppercase">
              LDERAS
            </span>
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.key}
              to={item.path}
              className={`px-3 py-2 text-xs font-bold uppercase tracking-wider transition-colors hover:text-primary ${
                isNavActive(item.path) ? 'text-primary font-extrabold border-b-2 border-primary' : 'text-muted-foreground'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Mobile Navigation (Sheet) */}
        <div className="md:hidden">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open Menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[350px]">
              <SheetHeader className="text-start">
                <SheetTitle className="font-bold text-primary">LDERAS</SheetTitle>
              </SheetHeader>
              <div className="mt-8 flex flex-col gap-4">
                {navItems.map((item) => (
                  <Link
                    key={item.key}
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className={`text-base font-semibold py-2 border-b border-border/40 ${
                      isNavActive(item.path) ? 'text-primary' : 'text-muted-foreground'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
