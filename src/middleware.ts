import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { defaultLocale, isLocale, locales } from '@/i18n/config';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';
const LOGIN_PATH = '/admin/connexion';

/* -------------------------------------------------------------------------- */
/*  Administration                                                            */
/* -------------------------------------------------------------------------- */

async function handleAdmin(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    // Authentification non configurée : seule la page de connexion est servie.
    if (pathname !== LOGIN_PATH) return NextResponse.redirect(new URL(LOGIN_PATH, request.url));
    return NextResponse.next();
  }

  let response = NextResponse.next({ request });
  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (cookiesToSet) => {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isLogin = pathname === LOGIN_PATH;

  if (!user && !isLogin) {
    const url = new URL(LOGIN_PATH, request.url);
    url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }
  if (user && isLogin) return NextResponse.redirect(new URL('/admin', request.url));
  return response;
}

/* -------------------------------------------------------------------------- */
/*  Langues : `/` = français (sans préfixe), `/it/...`, `/es/...`             */
/* -------------------------------------------------------------------------- */

function handleLocale(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const first = pathname.split('/')[1];

  // `/fr/...` → redirection vers la version sans préfixe (URL canonique).
  if (first === defaultLocale) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.replace(/^\/fr(?=\/|$)/, '') || '/';
    return NextResponse.redirect(url, 308);
  }

  if (isLocale(first)) return NextResponse.next();

  // Chemin sans préfixe : réécriture interne vers la locale par défaut.
  const url = request.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname === '/' ? '' : pathname}`;
  return NextResponse.rewrite(url);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname.startsWith('/admin')) return handleAdmin(request);
  return handleLocale(request);
}

export const config = {
  matcher: [
    // Tout sauf : API, fichiers statiques Next, fichiers avec extension, métadonnées.
    '/((?!api|_next|images|brand|.*\\..*|sitemap\\.xml|robots\\.txt|opengraph-image).*)',
  ],
};

export { locales };
