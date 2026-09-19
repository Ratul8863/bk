'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useEffect, useId, useRef, useState, type MouseEvent } from 'react';
import { useLenis } from 'lenis/react';
import { ArrowUpRight, ChevronDown, Menu, Search, X } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { SearchOverlay } from '@/components/search/SearchOverlay';
import { HeaderAuthLinks } from '@/components/auth/HeaderAuthLinks';
import type { NavigationItem } from '@/types/content';
import { cn } from '@/lib/utils';

type SiteHeaderProps = {
  organizationName: string;
  navigation: NavigationItem[];
};

const MENU_OPEN_DELAY_MS = 120;
const MENU_CLOSE_DELAY_MS = 200;

function focusMenuItem(container: HTMLElement | null, index: number) {
  if (!container) return;
  const items = container.querySelectorAll<HTMLElement>('[role="menuitem"]');
  if (!items.length) return;
  const next = (index + items.length) % items.length;
  items[next]?.focus();
}

function hubOverviewLabel(label: string): string {
  const labels: Record<string, string> = {
    About: 'Overview',
    People: 'All People',
    Research: 'All Research',
    Publications: 'All Publications',
    Activities: 'All Activities',
    'News and Events': 'Overview',
  };
  return labels[label] ?? `All ${label}`;
}

export function SiteHeader({
  organizationName,
  navigation,
}: SiteHeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const triggerRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const openTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const menuIds = useId();
  const pathname = usePathname();
  const router = useRouter();
  const lenis = useLenis();

  const clearMenuTimers = useCallback(() => {
    if (openTimerRef.current) {
      clearTimeout(openTimerRef.current);
      openTimerRef.current = null;
    }
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const scheduleMenuOpen = useCallback(
    (id: string) => {
      clearMenuTimers();
      openTimerRef.current = setTimeout(() => {
        setOpenMenu(id);
        openTimerRef.current = null;
      }, MENU_OPEN_DELAY_MS);
    },
    [clearMenuTimers],
  );

  const scheduleMenuClose = useCallback(() => {
    clearMenuTimers();
    closeTimerRef.current = setTimeout(() => {
      setOpenMenu(null);
      closeTimerRef.current = null;
    }, MENU_CLOSE_DELAY_MS);
  }, [clearMenuTimers]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpenMenu(null);
    setMobileOpen(false);
    setMobileExpanded(null);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [mobileOpen]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        if (openMenu) {
          const trigger = triggerRefs.current[openMenu];
          setOpenMenu(null);
          trigger?.focus();
          return;
        }
        setMobileOpen(false);
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [openMenu]);

  useEffect(() => {
    function onPointerDown(event: globalThis.MouseEvent) {
      if (!navRef.current?.contains(event.target as Node)) {
        clearMenuTimers();
        setOpenMenu(null);
      }
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [clearMenuTimers]);

  useEffect(() => () => clearMenuTimers(), [clearMenuTimers]);

  const closeMobile = useCallback(() => {
    setMobileOpen(false);
    setMobileExpanded(null);
  }, []);

  const goHome = useCallback(
    (event: MouseEvent<HTMLAnchorElement>) => {
      closeMobile();
      clearMenuTimers();
      setOpenMenu(null);

      // Already on home — Link is a no-op; scroll back to the hero.
      if (pathname === '/') {
        event.preventDefault();
        if (lenis) {
          lenis.scrollTo(0, { force: true });
        } else {
          window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
        }
        return;
      }

      // Force client navigation so the brand mark always returns home.
      event.preventDefault();
      router.push('/');
    },
    [clearMenuTimers, closeMobile, lenis, pathname, router],
  );

  const openDropdown = useCallback(
    (id: string) => {
      setOpenMenu(id);
      window.requestAnimationFrame(() => {
        const panel = document.getElementById(`${menuIds}-${id}`);
        focusMenuItem(panel, 0);
      });
    },
    [menuIds],
  );

  const primaryNav = navigation.filter((item) => item.label !== 'Contact');
  // Transparent white-label chrome only over the homepage dark photo hero.
  // Everywhere else (and after scroll) use solid glass + ink labels so the
  // universal header never looks "empty" on paper/white mastheads.
  const onHero = !scrolled && !mobileOpen && pathname === '/';
  const compact = !onHero;

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-50">
        <Container className="pointer-events-auto max-w-[1520px] pt-3 sm:pt-4">
          <div
            className={cn(
              'grid grid-cols-[auto_1fr_auto] items-center gap-2 rounded-[1.25rem] border px-2.5 py-2 sm:gap-3 sm:px-3 sm:py-2.5',
              'transition-[background-color,box-shadow,border-color,backdrop-filter,color] duration-500 ease-out',
              compact
                ? 'border-white/50 bg-white/70 text-ink shadow-[0_12px_40px_rgba(13,39,69,0.12)] backdrop-blur-2xl backdrop-saturate-150 supports-[backdrop-filter]:bg-white/55'
                : 'border-white/25 bg-white/15 text-white shadow-[0_8px_32px_rgba(13,39,69,0.18)] backdrop-blur-xl backdrop-saturate-150 supports-[backdrop-filter]:bg-white/[0.08]',
            )}
          >
            {/* Full lockup on every breakpoint — mark + “BK School of Research”.
                Plain <img> keeps the PNG crisp; light over dark hero, colour on glass. */}
            <Link
              href="/"
              className="relative z-20 inline-flex min-w-0 shrink cursor-pointer items-center px-0.5 sm:px-1"
              onClick={goHome}
              aria-label={organizationName}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={
                  onHero
                    ? '/brand/bksr-logo-light.png'
                    : '/brand/bksr-logo.png'
                }
                alt=""
                width={800}
                height={256}
                decoding="async"
                fetchPriority="high"
                className="pointer-events-none h-8 w-auto max-w-[min(54vw,12.75rem)] object-contain object-left sm:h-9 sm:max-w-[14.5rem] md:h-10 md:max-w-[16rem] lg:h-11 lg:max-w-[17.5rem]"
                draggable={false}
              />
            </Link>

            <nav
              ref={navRef}
              className="hidden min-w-0 items-center justify-center gap-0.5 min-[1400px]:flex"
              aria-label="Primary"
            >
              {primaryNav.map((item) => {
                const hasChildren = Boolean(item.children?.length);
                const isOpen = openMenu === item.id;
                const panelId = `${menuIds}-${item.id}`;
                const itemClass = cn(
                  'group relative inline-flex items-center gap-1 rounded-full px-3 py-2',
                  'font-instrument text-[0.9375rem] font-medium leading-none whitespace-nowrap',
                  'transition-colors duration-200',
                  onHero
                    ? isOpen
                      ? 'bg-white/20 text-white'
                      : 'text-white/90 hover:bg-white/15 hover:text-white'
                    : isOpen
                      ? 'bg-[#0d2745]/8 text-accent'
                      : 'text-ink/90 hover:bg-black/[0.04] hover:text-accent',
                );

                if (!hasChildren) {
                  return (
                    <Link key={item.id} href={item.href} className={itemClass}>
                      {item.label}
                      <span
                        className="absolute inset-x-3 -bottom-0.5 h-0.5 origin-left scale-x-0 rounded-full bg-[var(--bksr-red)] transition-transform duration-300 group-hover:scale-x-100"
                        aria-hidden
                      />
                    </Link>
                  );
                }

                const menuLinks = [
                  {
                    id: `${item.id}-hub`,
                    href: item.href,
                    label: hubOverviewLabel(item.label),
                    description: undefined as string | undefined,
                  },
                  ...(item.children ?? []),
                ];

                return (
                  <div
                    key={item.id}
                    className="relative shrink-0"
                    onMouseEnter={() => scheduleMenuOpen(item.id)}
                    onMouseLeave={scheduleMenuClose}
                  >
                    <Link
                      href={item.href}
                      ref={(node) => {
                        triggerRefs.current[item.id] = node;
                      }}
                      className={itemClass}
                      aria-expanded={isOpen}
                      aria-haspopup="menu"
                      aria-controls={panelId}
                      onFocus={() => {
                        clearMenuTimers();
                        setOpenMenu(item.id);
                      }}
                      onBlur={(event) => {
                        const related = event.relatedTarget as Node | null;
                        const panel = document.getElementById(panelId);
                        if (panel?.contains(related)) return;
                        clearMenuTimers();
                        setOpenMenu(null);
                      }}
                      onKeyDown={(event) => {
                        if (event.key === 'ArrowDown') {
                          event.preventDefault();
                          openDropdown(item.id);
                        }
                        if (event.key === 'ArrowUp') {
                          event.preventDefault();
                          setOpenMenu(item.id);
                          window.requestAnimationFrame(() => {
                            const panel = document.getElementById(panelId);
                            const items =
                              panel?.querySelectorAll<HTMLElement>(
                                '[role="menuitem"]',
                              );
                            if (items?.length) {
                              focusMenuItem(panel ?? null, items.length - 1);
                            }
                          });
                        }
                      }}
                    >
                      {item.label}
                      <ChevronDown
                        className={cn(
                          'size-3.5 shrink-0 opacity-70 transition-transform duration-200',
                          isOpen && 'rotate-180 opacity-100',
                        )}
                        strokeWidth={2}
                        aria-hidden
                      />
                      <span
                        className={cn(
                          'absolute inset-x-3 -bottom-0.5 h-0.5 origin-left rounded-full bg-[var(--bksr-red)] transition-transform duration-300',
                          isOpen
                            ? 'scale-x-100'
                            : 'scale-x-0 group-hover:scale-x-100',
                        )}
                        aria-hidden
                      />
                    </Link>

                    {/* pt-3 bridges the hover gap between trigger and panel */}
                    <div
                      className={cn(
                        'absolute left-1/2 top-full z-50 w-[min(17.5rem,calc(100vw-2rem))] -translate-x-1/2 pt-3',
                        !isOpen && 'pointer-events-none',
                      )}
                      onMouseEnter={() => {
                        clearMenuTimers();
                        setOpenMenu(item.id);
                      }}
                    >
                      <div
                        id={panelId}
                        role="menu"
                        aria-hidden={!isOpen}
                        inert={!isOpen ? true : undefined}
                        className={cn(
                          'origin-top rounded-[1.35rem] border border-white/15 bg-[#0b233f] p-2 text-paper',
                          'shadow-[0_28px_64px_rgba(8,24,44,0.5)] backdrop-blur-2xl backdrop-saturate-150',
                          'supports-backdrop-filter:bg-[#0b233f]/88',
                          'transition-[opacity,transform,visibility] duration-200 ease-out will-change-transform',
                          isOpen
                            ? 'visible translate-y-0 opacity-100'
                            : 'invisible -translate-y-1.5 opacity-0',
                        )}
                        onKeyDown={(event) => {
                          const panel = event.currentTarget;
                          const items = panel.querySelectorAll<HTMLElement>(
                            '[role="menuitem"]',
                          );
                          const currentIndex = Array.from(items).indexOf(
                            document.activeElement as HTMLElement,
                          );

                          if (event.key === 'ArrowDown') {
                            event.preventDefault();
                            focusMenuItem(panel, currentIndex + 1);
                          } else if (event.key === 'ArrowUp') {
                            event.preventDefault();
                            focusMenuItem(
                              panel,
                              currentIndex <= 0
                                ? items.length - 1
                                : currentIndex - 1,
                            );
                          } else if (event.key === 'Home') {
                            event.preventDefault();
                            focusMenuItem(panel, 0);
                          } else if (event.key === 'End') {
                            event.preventDefault();
                            focusMenuItem(panel, items.length - 1);
                          } else if (event.key === 'Escape') {
                            event.preventDefault();
                            setOpenMenu(null);
                            triggerRefs.current[item.id]?.focus();
                          } else if (event.key === 'Tab') {
                            setOpenMenu(null);
                          }
                        }}
                      >
                        <div
                          className="pointer-events-none absolute inset-x-4 top-0 h-px bg-linear-to-r from-transparent via-white/35 to-transparent"
                          aria-hidden
                        />
                        <ul className="relative flex flex-col gap-0.5">
                          {menuLinks.map((child, index) => (
                            <li key={child.id}>
                              <Link
                                href={child.href}
                                role="menuitem"
                                tabIndex={isOpen ? 0 : -1}
                                className={cn(
                                  'group/item relative flex items-center justify-between gap-3 overflow-hidden',
                                  'rounded-2xl px-3.5 py-2.5 outline-none',
                                  'transition-[background-color,color,padding] duration-200',
                                  'hover:bg-white/8 focus-visible:bg-white/8',
                                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--bksr-red)/50 focus-visible:ring-offset-0',
                                  index === 0 &&
                                    'mb-0.5 border-b border-white/10 pb-3',
                                )}
                                onClick={() => {
                                  clearMenuTimers();
                                  setOpenMenu(null);
                                }}
                              >
                                <span
                                  className="absolute inset-y-2 left-0 w-[2.5px] origin-center scale-y-0 rounded-full bg-(--bksr-red) transition-transform duration-200 group-hover/item:scale-y-100 group-focus-visible/item:scale-y-100"
                                  aria-hidden
                                />
                                <span className="min-w-0">
                                  <span className="block font-instrument text-[0.9375rem] font-medium leading-snug text-white/92 transition-colors group-hover/item:text-white">
                                    {child.label}
                                  </span>
                                  {child.description ? (
                                    <span className="mt-0.5 block text-[0.6875rem] leading-snug text-white/45">
                                      {child.description}
                                    </span>
                                  ) : null}
                                </span>
                                <ArrowUpRight
                                  className="size-3.5 shrink-0 text-white/0 transition-[color,transform,opacity] duration-200 group-hover/item:translate-x-0.5 group-hover/item:-translate-y-0.5 group-hover/item:text-white/55 group-focus-visible/item:text-white/55"
                                  strokeWidth={2}
                                  aria-hidden
                                />
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                );
              })}
            </nav>

            <div className="hidden items-center justify-self-end gap-2 min-[1400px]:flex">
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className={cn(
                  'inline-flex size-10 items-center justify-center rounded-full transition-colors',
                  onHero
                    ? 'text-white hover:bg-white/15'
                    : 'text-ink hover:bg-black/4',
                )}
                aria-label="Open search"
              >
                <Search className="size-5" strokeWidth={1.75} aria-hidden />
              </button>

              <HeaderAuthLinks onHero={onHero} variant="icon" />

              <Link
                href="/contact"
                className={cn(
                  'inline-flex h-10 items-center rounded-full px-4 font-instrument text-sm font-medium transition-[transform,background-color,color] duration-200 hover:scale-[1.03]',
                  onHero
                    ? 'bg-white text-[#0b233f] shadow-[0_4px_14px_rgba(0,0,0,0.18)] hover:bg-paper'
                    : 'bg-[#0b233f] text-white shadow-[0_4px_14px_rgba(11,35,63,0.28)] hover:bg-ink',
                )}
              >
                Contact
              </Link>
            </div>

            <div className="col-start-3 flex items-center justify-self-end gap-0.5 sm:gap-1.5 min-[1400px]:hidden">
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className={cn(
                  'inline-flex size-9 items-center justify-center rounded-full transition-colors sm:size-10',
                  onHero
                    ? 'text-white hover:bg-white/15'
                    : 'text-ink hover:bg-black/4',
                )}
                aria-label="Open search"
              >
                <Search className="size-[1.125rem] sm:size-5" strokeWidth={1.75} aria-hidden />
              </button>

              <HeaderAuthLinks onHero={onHero} variant="icon" />

              <button
                type="button"
                className={cn(
                  'inline-flex size-9 items-center justify-center rounded-full transition-transform hover:scale-[1.03] sm:size-10',
                  onHero
                    ? 'bg-white text-[#0b233f]'
                    : 'bg-[#0b233f] text-white',
                )}
                aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={mobileOpen}
                onClick={() => setMobileOpen((open) => !open)}
              >
                {mobileOpen ? (
                  <X className="size-[1.125rem] sm:size-5" aria-hidden />
                ) : (
                  <Menu className="size-[1.125rem] sm:size-5" aria-hidden />
                )}
              </button>
            </div>
          </div>
        </Container>
      </header>

      <div
        className={cn(
          'fixed inset-0 z-40 bg-[#f8f7f3]/95 pt-[5.25rem] backdrop-blur-xl transition-transform duration-300 min-[1400px]:hidden sm:pt-[5.75rem]',
          mobileOpen
            ? 'translate-x-0'
            : 'pointer-events-none translate-x-full',
        )}
        aria-hidden={!mobileOpen}
        inert={!mobileOpen ? true : undefined}
      >
        <Container
          data-lenis-prevent
          className="flex h-[calc(100%-5.25rem)] flex-col overflow-y-auto pb-10 pt-2 sm:h-[calc(100%-5.75rem)]"
        >
          <nav aria-label="Mobile" className="flex flex-col gap-1">
            {primaryNav.map((item) => {
              const hasChildren = Boolean(item.children?.length);
              const expanded = mobileExpanded === item.id;

              if (!hasChildren) {
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    className="border-b border-border/70 py-4 font-instrument text-2xl font-medium text-ink"
                    onClick={closeMobile}
                  >
                    {item.label}
                  </Link>
                );
              }

              const mobileLinks = [
                {
                  id: `${item.id}-hub`,
                  href: item.href,
                  label: hubOverviewLabel(item.label),
                },
                ...(item.children ?? []),
              ];

              return (
                <div key={item.id} className="border-b border-border/70">
                  <div className="flex items-stretch">
                    <Link
                      href={item.href}
                      className="flex flex-1 items-center py-4 font-instrument text-2xl font-medium text-ink"
                      onClick={closeMobile}
                    >
                      {item.label}
                    </Link>
                    <button
                      type="button"
                      className="inline-flex shrink-0 items-center justify-center px-3 text-muted"
                      aria-expanded={expanded}
                      aria-label={`Show ${item.label} sections`}
                      onClick={() =>
                        setMobileExpanded((current) =>
                          current === item.id ? null : item.id,
                        )
                      }
                    >
                      <ChevronDown
                        className={cn(
                          'size-5 transition-transform',
                          expanded && 'rotate-180',
                        )}
                        aria-hidden
                      />
                    </button>
                  </div>
                  {expanded ? (
                    <ul className="space-y-1 pb-4">
                      {mobileLinks.map((child, index) => (
                        <li key={child.id}>
                          <Link
                            href={child.href}
                            className={cn(
                              'block py-2 pl-1 font-instrument text-base text-muted transition-colors hover:text-accent',
                              index === 0 && 'font-medium text-ink/80',
                            )}
                            onClick={closeMobile}
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              );
            })}
          </nav>

          <div className="mt-auto flex flex-col gap-3 pt-10">
            <Link
              href="/contact"
              className="inline-flex h-12 w-full items-center justify-center rounded-full bg-[#0b233f] font-instrument text-base font-medium text-white hover:bg-ink"
              onClick={closeMobile}
            >
              Contact
            </Link>
            <HeaderAuthLinks
              variant="mobile"
              className="pt-2"
              onNavigate={closeMobile}
            />
          </div>
        </Container>
      </div>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
