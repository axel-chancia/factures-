import { NextRequest, NextResponse } from 'next/server';

// Liste des routes protégées (admin)
const protectedRoutes = [
  '/admin/', // pour la racin
];

// Fonction utilitaire pour vérifier si la route est protégée
function isProtectedRoute(pathname: string) {
  return protectedRoutes.some(route => pathname.startsWith(route));
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Vérifie si la route est protégée
  if (isProtectedRoute(pathname)) {
    // Exemple : on vérifie la présence d'un cookie "admin-auth"
    const isAuthenticated = request.cookies.get('admin-auth')?.value === 'true';

    if (!isAuthenticated) {
      // Redirige vers la page de connexion admin
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Sinon, laisse passer la requête
  return NextResponse.next();
}

// Optionnel : matcher uniquement les routes commençant par /admin
export const config = {
  matcher: ['/admin/:path*'],
};