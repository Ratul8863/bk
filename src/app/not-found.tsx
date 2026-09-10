import Link from 'next/link';
import { PublicShell } from '@/components/layout/PublicShell';
import { Container } from '@/components/ui/Container';
import { EditorialHeading } from '@/components/ui/EditorialHeading';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <PublicShell>
      <div className="flex min-h-[70vh] items-center border-b border-border bg-paper pt-28 pb-20">
        <Container>
          <p className="font-sans text-sm font-semibold uppercase tracking-[0.18em] text-accent">
            404
          </p>
          <EditorialHeading as="h1" size="xl" className="mt-4 max-w-3xl">
            This page is not in the archive.
          </EditorialHeading>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">
            The address may be mistyped, or the content may not have been
            published on the new BKSR site.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Button href="/" variant="primary">
              Return home
            </Button>
            <Button href="/search" variant="secondary">
              Search the site
            </Button>
            <Link
              href="/contact"
              className="inline-flex items-center px-2 text-sm font-semibold text-accent hover:text-ink"
            >
              Contact BKSR
            </Link>
          </div>
        </Container>
      </div>
    </PublicShell>
  );
}
