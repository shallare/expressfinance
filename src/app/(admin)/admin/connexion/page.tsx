import { AlertCircle } from 'lucide-react';
import { Logo } from '@/components/brand/logo';
import { Button } from '@/components/ui/button';
import { signInAction } from '@/app/(admin)/admin/actions';

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

const messages: Record<string, string> = {
  invalid: 'Identifiants incorrects.',
  unauthorized: 'Ce compte n’a pas accès à l’espace d’administration.',
  rate_limited: 'Trop de tentatives. Réessayez dans quelques minutes.',
};

export default async function AdminLoginPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const error = typeof params.error === 'string' ? messages[params.error] : undefined;
  const next = typeof params.next === 'string' && params.next.startsWith('/admin') ? params.next : '/admin';

  return (
    <div className="flex flex-1 items-center justify-center p-6">
      <div className="card-surface w-full max-w-md p-8">
        <Logo className="justify-center" />
        <h1 className="mt-6 text-center text-2xl font-bold text-navy-900">Espace d’administration</h1>
        <p className="mt-1 text-center text-sm text-ink-muted">Accès réservé au personnel habilité.</p>

        {error && (
          <p role="alert" className="mt-5 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            {error}
          </p>
        )}

        <form action={signInAction} className="mt-6 grid gap-4">
          <input type="hidden" name="next" value={next} />
          <div>
            <label htmlFor="email" className="ef-label">Adresse e-mail</label>
            <input id="email" name="email" type="email" autoComplete="email" required className="ef-input" />
          </div>
          <div>
            <label htmlFor="password" className="ef-label">Mot de passe</label>
            <input id="password" name="password" type="password" autoComplete="current-password" required minLength={8} className="ef-input" />
          </div>
          <Button type="submit" size="lg" className="mt-2">
            Se connecter
          </Button>
        </form>
      </div>
    </div>
  );
}
