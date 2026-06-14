import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from '../../hooks/useTranslation';
import { useTeams } from '../../hooks/useTeams';
import LdreasLogo from '../ui/LdreasLogo';
import { Button } from '../ui/Button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../ui/Sheet';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '../ui/NavigationMenu';
import { Menu } from 'lucide-react';

export default function NavBar() {
  const { t, lang } = useTranslation();
  const location = useLocation();
  const { teams } = useTeams();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  const navItems = [
    { key: 'home', label: t('navHome'), path: '/' },
    { key: 'about', label: t('navAbout'), path: '/about' },
    { key: 'news', label: t('navNews'), path: '/news' },
    { key: 'publications', label: t('navPublications'), path: '/articles' },
  ];

  function isNavActive(path) {
    if (path === '/') return location.pathname === '/';
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  }

  const isRtl = lang === 'ar';

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur py-3" role="navigation" aria-label="Main navigation">
      <div className="container-custom flex items-center justify-between flex-row-reverse-rtl">
        {/* Brand/Logo */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center gap-2" aria-label="LDREAS Home">
            <LdreasLogo variant="dark" className="h-9 w-auto text-foreground" />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center">
          <NavigationMenu dir={isRtl ? "rtl" : "ltr"}>
            <NavigationMenuList className="flex items-center gap-1">
              {navItems.map((item) => (
                <NavigationMenuItem key={item.key}>
                  <Link to={item.path} className={`${navigationMenuTriggerStyle()} ${isNavActive(item.path) ? 'text-primary font-semibold' : 'text-muted-foreground'}`}>
                    {item.label}
                  </Link>
                </NavigationMenuItem>
              ))}

              {/* Research Teams Dropdown */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className={`${isNavActive('/teams') ? 'text-primary font-semibold' : 'text-muted-foreground'}`}>
                  {t('navTeam') || 'Teams'}
                </NavigationMenuTrigger>
                <NavigationMenuContent className="min-w-[320px] md:min-w-[400px]">
                  <div className="p-4 grid gap-3">
                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b border-border pb-1.5 mb-1">
                      {lang === 'ar' ? 'الفرق البحثية المعتمدة' : (lang === 'fr' ? 'Équipes de Recherche' : 'Research Teams')}
                    </div>
                    <ul className="grid gap-2">
                      {teams.map((team) => (
                        <li key={team.id}>
                          <Link
                            to={`/teams/${team.id}`}
                            className="block select-none space-y-1 p-2 leading-none no-underline outline-none transition-colors hover:bg-secondary hover:text-accent-foreground"
                          >
                            <div className="text-sm font-semibold text-primary">{team.acronym}</div>
                            <p className="line-clamp-2 text-xs leading-normal text-muted-foreground">
                              {team.name}
                            </p>
                          </Link>
                        </li>
                      ))}
                      <li className="border-t border-border pt-2 mt-1">
                        <Link
                          to="/teams"
                          className="block text-center text-xs font-semibold text-primary hover:underline"
                        >
                          {lang === 'ar' ? 'عرض جميع الفرق ←' : (lang === 'fr' ? 'Voir toutes les équipes →' : 'View all teams →')}
                        </Link>
                      </li>
                    </ul>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Mobile Navigation (Sheet) */}
        <div className="md:hidden">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open Menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side={isRtl ? "left" : "right"} className="w-[300px] sm:w-[350px]">
              <SheetHeader className="text-start">
                <SheetTitle className="font-bold text-primary">LDREAS</SheetTitle>
              </SheetHeader>
              <div className="mt-8 flex flex-col gap-4">
                {navItems.map((item) => (
                  <Link
                    key={item.key}
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className={`text-base font-semibold py-2 border-b border-border/40 ${isNavActive(item.path) ? 'text-primary' : 'text-muted-foreground'}`}
                  >
                    {item.label}
                  </Link>
                ))}
                
                <div className="pt-4">
                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    {t('navTeam') || 'Teams'}
                  </div>
                  <div className="flex flex-col gap-2 pl-2 border-l border-border/60">
                    {teams.map((team) => (
                      <Link
                        key={team.id}
                        to={`/teams/${team.id}`}
                        onClick={() => setMobileOpen(false)}
                        className="text-sm py-1.5 hover:text-primary transition-colors text-muted-foreground font-medium"
                      >
                        <strong className="text-foreground">{team.acronym}</strong> - {team.name}
                      </Link>
                    ))}
                    <Link
                      to="/teams"
                      onClick={() => setMobileOpen(false)}
                      className="text-xs font-semibold text-primary hover:underline pt-2"
                    >
                      {lang === 'ar' ? 'جميع الفرق ←' : (lang === 'fr' ? 'Toutes les équipes →' : 'All teams →')}
                    </Link>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
