'use client'

import type { ReactElement, SVGProps } from 'react'

interface PublicFooterProps {
  appName: string
  socialLinks: {
    instagram: string
    facebook: string
    website: string
  }
}

export function PublicFooter({ appName, socialLinks }: PublicFooterProps) {
  const socials = [
    socialLinks.instagram ? { href: socialLinks.instagram, label: 'Instagram', icon: InstagramIcon } : null,
    socialLinks.facebook ? { href: socialLinks.facebook, label: 'Facebook', icon: FacebookIcon } : null,
  ].filter(Boolean) as Array<{ href: string; label: string; icon: (props: SVGProps<SVGSVGElement>) => ReactElement }>

  return (
    <footer className="border-t border-foreground/10 py-10 text-sm text-muted-foreground">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-semibold text-foreground">{appName.toLowerCase()}.</p>
        <p>Hecho con amor para quienes no tienen voz.</p>
        <div className="flex items-center gap-4">
          {socials.map(({ href, label, icon: Icon }) => (
            <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label} className="grid size-9 place-items-center rounded-full border border-foreground/10 bg-background transition hover:scale-105 hover:shadow-sm">
              <Icon className="size-4" />
            </a>
          ))}
          <a href="/contacto" className="hover:text-foreground">Contacto</a>
          <a href="/privacidad" className="hover:text-foreground">Privacidad</a>
          <a href="/terminos" className="hover:text-foreground">Términos</a>
        </div>
      </div>
    </footer>
  )
}

function FacebookIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <circle cx="12" cy="12" r="11" fill="#1877F2" />
      <path fill="#FFFFFF" d="M13.5 9H16V6h-2.5C11.57 6 10 7.57 10 9.5V12H8v3h2v7h3v-7h2.5l.5-3H13v-2.1c0-.61.4-.9.95-.9Z" />
    </svg>
  )
}

function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <defs>
        <linearGradient id="instagram-gradient" x1="4" y1="20" x2="20" y2="4" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#F58529" />
          <stop offset="35%" stopColor="#DD2A7B" />
          <stop offset="70%" stopColor="#8134AF" />
          <stop offset="100%" stopColor="#515BD4" />
        </linearGradient>
      </defs>
      <rect x="3" y="3" width="18" height="18" rx="5" fill="url(#instagram-gradient)" />
      <rect x="6" y="6" width="12" height="12" rx="4" fill="none" stroke="white" strokeWidth="1.7" />
      <circle cx="12" cy="12" r="3.4" fill="none" stroke="white" strokeWidth="1.7" />
      <circle cx="16.5" cy="7.5" r="1.1" fill="white" />
    </svg>
  )
}
