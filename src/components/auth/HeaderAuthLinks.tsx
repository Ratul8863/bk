'use client';

import Link from 'next/link';
import { useEffect, useId, useRef, useState } from 'react';
import { ArrowUpRight, UserRound } from 'lucide-react';
import { useAuthOptional } from '@/components/auth/AuthProvider';
import { cn } from '@/lib/utils';

type HeaderAuthLinksProps = {
  className?: string;
  onHero?: boolean;
  /** Compact icon control for the desktop island; mobile uses stacked links. */
  variant?: 'icon' | 'mobile';
  onNavigate?: () => void;
};

export function HeaderAuthLinks({
  className,
  onHero = false,
  variant = 'icon',
  onNavigate,
}: HeaderAuthLinksProps) {
  const auth = useAuthOptional();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  if (variant === 'mobile') {
    return (
      <MobileAuthLinks
        className={className}
        auth={auth}
        onNavigate={onNavigate}
      />
    );
  }

  const iconClass = cn(
    'inline-flex size-9 items-center justify-center rounded-full transition-colors sm:size-10',
    onHero
      ? 'text-white hover:bg-white/15'
      : 'text-ink hover:bg-black/4',
    open && (onHero ? 'bg-white/20' : 'bg-[#0d2745]/8 text-accent'),
  );

  if (!auth?.ready) {
    return (
      <div className={cn('relative', className)}>
        <span className={iconClass} aria-hidden>
          <UserRound className="size-5 opacity-40" strokeWidth={1.75} />
        </span>
      </div>
    );
  }

  const session = auth.session;
  const accountHref = session
    ? session.role === 'admin'
      ? '/admin'
      : '/account'
    : '/login';
  const triggerLabel = session
    ? session.role === 'admin'
      ? 'Admin menu'
      : 'Account menu'
    : 'Member access';

  return (
    <div ref={rootRef} className={cn('relative', className)}>
      <button
        type="button"
        className={iconClass}
        aria-label={triggerLabel}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls={menuId}
        onClick={() => setOpen((value) => !value)}
      >
        {session ? (
          <span className="font-instrument text-[0.6875rem] font-semibold uppercase tracking-[0.08em]">
            {session.role === 'admin'
              ? 'Ad'
              : session.email.slice(0, 2).toUpperCase()}
          </span>
        ) : (
          <UserRound className="size-5" strokeWidth={1.75} aria-hidden />
        )}
      </button>

      <div
        id={menuId}
        role="menu"
        aria-hidden={!open}
        inert={!open ? true : undefined}
        className={cn(
          'absolute right-0 top-full z-50 w-[15.5rem] pt-3',
          !open && 'pointer-events-none',
        )}
      >
        <div
          className={cn(
            'origin-top-right rounded-[1.35rem] border border-white/15 bg-[#0b233f] p-2 text-paper',
            'shadow-[0_28px_64px_rgba(8,24,44,0.5)] backdrop-blur-2xl backdrop-saturate-150',
            'supports-backdrop-filter:bg-[#0b233f]/88',
            'transition-[opacity,transform,visibility] duration-200 ease-out',
            open
              ? 'visible translate-y-0 opacity-100'
              : 'invisible -translate-y-1.5 opacity-0',
          )}
        >
          <div
            className="pointer-events-none absolute inset-x-4 top-0 h-px bg-linear-to-r from-transparent via-white/35 to-transparent"
            aria-hidden
          />

          {session ? (
            <ul className="relative flex flex-col gap-0.5">
              <li className="mb-0.5 border-b border-white/10 px-3.5 pb-3 pt-1.5">
                <p className="font-instrument text-[0.6875rem] uppercase tracking-[0.14em] text-white/45">
                  Signed in
                </p>
                <p className="mt-1 truncate font-instrument text-sm font-medium text-white/90">
                  {session.role === 'admin' ? 'Administrator' : session.email}
                </p>
              </li>
              <li>
                <MenuItem
                  href={accountHref}
                  label={session.role === 'admin' ? 'Open admin' : 'Your profile'}
                  onClick={() => {
                    setOpen(false);
                    onNavigate?.();
                  }}
                />
              </li>
              <li>
                <button
                  type="button"
                  role="menuitem"
                  className={menuItemClass}
                  onClick={() => {
                    void auth.logout();
                    setOpen(false);
                    onNavigate?.();
                  }}
                >
                  <span>Sign out</span>
                </button>
              </li>
            </ul>
          ) : (
            <ul className="relative flex flex-col gap-0.5">
              <li className="mb-0.5 border-b border-white/10 px-3.5 pb-3 pt-1.5">
                <p className="font-instrument text-[0.6875rem] uppercase tracking-[0.14em] text-white/45">
                  Members
                </p>
                <p className="mt-1 font-instrument text-sm leading-snug text-white/70">
                  Claimed profiles only — admin must add your email first.
                </p>
              </li>
              <li>
                <MenuItem
                  href="/login"
                  label="Sign in"
                  onClick={() => {
                    setOpen(false);
                    onNavigate?.();
                  }}
                />
              </li>
              <li>
                <MenuItem
                  href="/register"
                  label="Claim your profile"
                  onClick={() => {
                    setOpen(false);
                    onNavigate?.();
                  }}
                />
              </li>
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

const menuItemClass = cn(
  'group/item relative flex w-full items-center justify-between gap-3 overflow-hidden',
  'rounded-2xl px-3.5 py-2.5 text-left outline-none',
  'font-instrument text-[0.9375rem] font-medium text-white/92',
  'transition-colors duration-200 hover:bg-white/8 focus-visible:bg-white/8',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--bksr-red)/50',
);

function MenuItem({
  href,
  label,
  onClick,
}: {
  href: string;
  label: string;
  onClick?: () => void;
}) {
  return (
    <Link href={href} role="menuitem" className={menuItemClass} onClick={onClick}>
      <span
        className="absolute inset-y-2 left-0 w-[2.5px] origin-center scale-y-0 rounded-full bg-(--bksr-red) transition-transform duration-200 group-hover/item:scale-y-100 group-focus-visible/item:scale-y-100"
        aria-hidden
      />
      <span>{label}</span>
      <ArrowUpRight
        className="size-3.5 shrink-0 text-white/0 transition-[color,transform] duration-200 group-hover/item:translate-x-0.5 group-hover/item:-translate-y-0.5 group-hover/item:text-white/55"
        strokeWidth={2}
        aria-hidden
      />
    </Link>
  );
}

function MobileAuthLinks({
  className,
  auth,
  onNavigate,
}: {
  className?: string;
  auth: ReturnType<typeof useAuthOptional>;
  onNavigate?: () => void;
}) {
  if (!auth?.ready) return null;

  if (auth.session) {
    const href =
      auth.session.role === 'admin' ? '/admin' : '/account';
    return (
      <div className={cn('flex flex-col gap-2', className)}>
        <Link
          href={href}
          onClick={onNavigate}
          className="inline-flex h-12 w-full items-center justify-center rounded-full border border-[#0b233f] bg-white font-instrument text-base font-medium text-[#0b233f] hover:bg-[#0b233f] hover:text-white"
        >
          {auth.session.role === 'admin' ? 'Open admin' : 'Your profile'}
        </Link>
        <button
          type="button"
          onClick={() => {
            void auth.logout();
            onNavigate?.();
          }}
          className="py-2 font-instrument text-sm text-muted hover:text-ink"
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <Link
        href="/login"
        onClick={onNavigate}
        className="inline-flex h-12 w-full items-center justify-center rounded-full border border-[#0b233f] bg-white font-instrument text-base font-medium text-[#0b233f] hover:bg-[#0b233f] hover:text-white"
      >
        Sign in
      </Link>
      <Link
        href="/register"
        onClick={onNavigate}
        className="py-2 text-center font-instrument text-sm text-muted hover:text-ink"
      >
        Claim your profile
      </Link>
    </div>
  );
}
