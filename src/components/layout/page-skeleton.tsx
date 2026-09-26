import { cn } from '@/lib/utils';

function Bar({ className }: { className?: string }) {
  return <div className={cn('animate-pulse rounded-lg bg-navy-100/80', className)} aria-hidden="true" />;
}

/** Squelette générique affiché pendant le rendu serveur d'une page du site. */
export function PageSkeleton({ hero = true }: { hero?: boolean }) {
  return (
    <div role="status" aria-live="polite" aria-busy="true" className="min-h-[70vh]">
      <span className="sr-only">Chargement…</span>
      {hero && (
        <div className="bg-navy-950 py-16 sm:py-20">
          <div className="container-page space-y-4">
            <Bar className="h-3 w-40 bg-white/10" />
            <Bar className="h-10 w-3/4 max-w-2xl bg-white/15" />
            <Bar className="h-5 w-2/3 max-w-xl bg-white/10" />
          </div>
        </div>
      )}
      <div className="container-page py-12">
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="space-y-4 lg:col-span-7">
            <Bar className="h-7 w-1/2" />
            <Bar className="h-4 w-full" />
            <Bar className="h-4 w-11/12" />
            <Bar className="h-4 w-4/5" />
            <div className="grid gap-4 pt-4 sm:grid-cols-2">
              <Bar className="h-28" />
              <Bar className="h-28" />
              <Bar className="h-28" />
              <Bar className="h-28" />
            </div>
          </div>
          <div className="lg:col-span-5">
            <Bar className="h-80" />
          </div>
        </div>
      </div>
    </div>
  );
}
