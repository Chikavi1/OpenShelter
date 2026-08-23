'use client'

import type { ReactNode } from 'react'
import { usePublicSite } from '@/lib/use-public-site'
import { PublicFooter } from '@/components/public/public-footer'
import { PublicHeader } from '@/components/public/public-header'

interface PublicPageShellProps {
  appName: string
  logoUrl?: string
  children: ReactNode
  contentClassName?: string
}

export function PublicPageShell({ appName, logoUrl, children, contentClassName = 'mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-10' }: PublicPageShellProps) {
  const site = usePublicSite()
  const resolvedAppName = site.loading ? '' : site.settings.name || appName
  const resolvedLogoUrl = site.loading ? undefined : site.settings.logoUrl || logoUrl

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-foreground/10">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-10">
          <PublicHeader appName={resolvedAppName} logoUrl={resolvedLogoUrl} loading={site.loading} />
        </div>
      </header>
      <div className={contentClassName}>{children}</div>
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-10">
        <PublicFooter appName={resolvedAppName} socialLinks={site.settings.socialLinks} />
      </div>
    </main>
  )
}
