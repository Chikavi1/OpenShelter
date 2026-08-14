import { NextRequest, NextResponse } from 'next/server'

const SESSION_COOKIE = 'huellas_admin_session'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/dashboard')) {
    const hasSession = request.cookies.get(SESSION_COOKIE)?.value === 'active'
    if (!hasSession && pathname !== '/dashboard/login') {
      const loginUrl = new URL('/dashboard/login', request.url)
      return NextResponse.redirect(loginUrl)
    }
    if (hasSession && pathname === '/dashboard/login') {
      const dashboardUrl = new URL('/dashboard', request.url)
      return NextResponse.redirect(dashboardUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*'],
}
