'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { ChevronDown, Menu, Search, X } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { SearchOverlay } from '@/components/search/SearchOverlay';
import type { NavigationItem } from '@/types/content';
import { cn } from '@/lib/utils';

type SiteHeaderProps = {
  organizationName: string;
  navigation: NavigationItem[];
};

function focusMenuItem(container: HTMLElement | null, index: number) {
  if (!container) return;
  const items = container.querySelectorAll<HTMLElement>('[role="menuitem"]');
  if (!items.length) return;
  const next = (index + items.length) % items.length;
  items[next]?.focus();
}

const navChrome =
  'rounded-[14px] bg-[#e5ebf3] transition-colors hover:bg-[#dce5f0]';
/** Figma row height: 16 + 24 + 16 (+2px item inset) ≈ 58px */
const controlH = 'h-[3.625rem]';
const ctaBase = cn(
  'inline-flex items-center justify-center rounded-[14px] border border-transparent px-4',
  'font-instrument text-base font-normal leading-6 transition-colors',
  controlH,
);

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
  const triggerRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const menuIds = useId();
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
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
    function onPointerDown(event: MouseEvent) {
      if (!navRef.current?.contains(event.target as Node)) {
        setOpenMenu(null);
      }
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, []);

  const closeMobile = useCallback(() => {
    setMobileOpen(false);
    setMobileExpanded(null);
  }, []);

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

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 border-b border-border/80 bg-white transition-shadow duration-300',
          scrolled || mobileOpen
            ? 'shadow-[0_1px_0_rgba(16,32,42,0.04)]'
            : 'shadow-none',
        )}
      >
        {/*
          max-w 1520 + 3-col grid: nav stays majhkhane; side columns are equal
          so logo/CTAs never collide with the pill.
        */}
        <Container className="grid h-[4.75rem] max-w-[1520px] grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-x-2 sm:h-[5.75rem] sm:grid-cols-[1fr_auto_1fr] sm:gap-x-4">
          <Link
            href="/"
            className="inline-flex h-11 w-[8.75rem] max-w-full shrink-0 items-center justify-self-start sm:h-[3.625rem] sm:w-[11.25rem]"
            onClick={closeMobile}
            aria-label={organizationName}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/bksr-logo.png"
              alt=""
              width={180}
              height={58}
              className="h-full w-full object-contain object-left"
            />
          </Link>

          <nav
            ref={navRef}
            className={cn(
              'hidden items-center gap-3.5 px-3.5 py-4 min-[1400px]:flex',
              navChrome,
              'hover:bg-[#e5ebf3]',
            )}
            aria-label="Primary"
          >
            {primaryNav.map((item) => {
              const hasChildren = Boolean(item.children?.length);
              const isOpen = openMenu === item.id;
              const panelId = `${menuIds}-${item.id}`;
              const itemClass = cn(
                'inline-flex items-center gap-2 pb-0.5 font-instrument text-base font-medium leading-6 whitespace-nowrap transition-colors',
                isOpen
                  ? 'text-accent shadow-[inset_0_-2px_0_0_var(--bksr-red)]'
                  : 'text-ink hover:text-accent',
              );

              if (!hasChildren) {
                return (
                  <Link key={item.id} href={item.href} className={itemClass}>
                    {item.label}
                  </Link>
                );
              }

              return (
                <div key={item.id} className="relative shrink-0">
                  <button
                    type="button"
                    ref={(node) => {
                      triggerRefs.current[item.id] = node;
                    }}
                    className={itemClass}
                    aria-expanded={isOpen}
                    aria-haspopup="menu"
                    aria-controls={panelId}
                    onClick={() =>
                      setOpenMenu((current) =>
                        current === item.id ? null : item.id,
                      )
                    }
                    onKeyDown={(event) => {
                      if (
                        event.key === 'ArrowDown' ||
                        event.key === 'Enter' ||
                        event.key === ' '
                      ) {
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
                        'size-5 shrink-0 text-ink transition-transform duration-200',
                        isOpen && 'rotate-180',
                      )}
                      strokeWidth={1.75}
                      aria-hidden
                    />
                  </button>

                  <div
                    id={panelId}
                    role="menu"
                    hidden={!isOpen}
                    className={cn(
                      'absolute left-0 top-full z-50 mt-3 min-w-[18rem] rounded-[14px] border border-border bg-white p-2 shadow-[0_16px_40px_rgba(16,32,42,0.08)]',
                      !isOpen && 'pointer-events-none',
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
                    {item.children?.map((child) => (
                      <Link
                        key={child.id}
                        href={child.href}
                        role="menuitem"
                        tabIndex={isOpen ? 0 : -1}
                        className="block rounded-[10px] px-3 py-2.5 transition-colors hover:bg-[#e5ebf3] focus:bg-[#e5ebf3]"
                        onClick={() => setOpenMenu(null)}
                      >
                        <span className="block font-instrument text-sm font-medium text-ink">
                          {child.label}
                        </span>
                        {child.description ? (
                          <span className="mt-0.5 block text-xs leading-snug text-muted">
                            {child.description}
                          </span>
                        ) : null}
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </nav>

          <div className="hidden shrink-0 items-center justify-self-end gap-4 min-[1400px]:flex">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className={cn(
                'inline-flex aspect-square items-center justify-center p-4 text-ink',
                controlH,
                navChrome,
              )}
              aria-label="Open search"
            >
              <Search className="size-6" strokeWidth={1.75} aria-hidden />
            </button>

            <Link
              href="/research"
              className={cn(ctaBase, 'bg-[#0b233f] text-white hover:bg-ink')}
            >
              Explore Research
            </Link>
            <Link
              href="/contact"
              className={cn(
                ctaBase,
                'border-[#0b233f] bg-white text-[#0b233f] hover:bg-[#0b233f] hover:text-white',
              )}
            >
              Contact
            </Link>
          </div>

          <div className="col-start-3 flex items-center justify-self-end gap-2 sm:gap-3 min-[1400px]:hidden">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className={cn(
                'inline-flex size-11 items-center justify-center text-ink sm:size-12',
                navChrome,
              )}
              aria-label="Open search"
            >
              <Search className="size-5" strokeWidth={1.75} aria-hidden />
            </button>

            <button
              type="button"
              className={cn(
                'inline-flex size-11 items-center justify-center text-ink sm:size-12',
                navChrome,
              )}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((open) => !open)}
            >
              {mobileOpen ? (
                <X className="size-5" aria-hidden />
              ) : (
                <Menu className="size-5" aria-hidden />
              )}
            </button>
          </div>
        </Container>
      </header>

      <div
        className={cn(
          'fixed inset-0 z-40 bg-white pt-[4.75rem] transition-transform duration-300 min-[1400px]:hidden sm:pt-[5.75rem]',
          mobileOpen ? 'translate-x-0' : 'translate-x-full',
        )}
        aria-hidden={!mobileOpen}
      >
        <Container
          data-lenis-prevent
          className="flex h-[calc(100%-4.75rem)] flex-col overflow-y-auto pb-10 pt-4 sm:h-[calc(100%-5.75rem)]"
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
                    className="border-b border-border py-4 font-instrument text-2xl font-medium text-ink"
                    onClick={closeMobile}
                  >
                    {item.label}
                  </Link>
                );
              }

              return (
                <div key={item.id} className="border-b border-border">
                  <button
                    type="button"
                    className="flex w-full items-center justify-between py-4 font-instrument text-2xl font-medium text-ink"
                    aria-expanded={expanded}
                    onClick={() =>
                      setMobileExpanded((current) =>
                        current === item.id ? null : item.id,
                      )
                    }
                  >
                    {item.label}
                    <ChevronDown
                      className={cn(
                        'size-5 text-muted transition-transform',
                        expanded && 'rotate-180',
                      )}
                      aria-hidden
                    />
                  </button>
                  {expanded ? (
                    <ul className="space-y-1 pb-4">
                      {item.children?.map((child) => (
                        <li key={child.id}>
                          <Link
                            href={child.href}
                            className="block py-2 pl-1 font-instrument text-base text-muted transition-colors hover:text-accent"
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
              href="/research"
              className={cn(
                ctaBase,
                'w-full bg-[#0b233f] text-white hover:bg-ink',
              )}
              onClick={closeMobile}
            >
              Explore Research
            </Link>
            <Link
              href="/contact"
              className={cn(
                ctaBase,
                'w-full border-[#0b233f] bg-white text-[#0b233f] hover:bg-[#0b233f] hover:text-white',
              )}
              onClick={closeMobile}
            >
              Contact
            </Link>
          </div>
        </Container>
      </div>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
