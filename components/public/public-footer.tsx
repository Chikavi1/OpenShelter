'use client'

import type { ReactElement } from 'react'
import { Heart, Mail, MapPin, PawPrint, Phone } from 'lucide-react'
import { FaFacebookF, FaInstagram } from 'react-icons/fa6'
import { usePublicSite } from '@/lib/use-public-site'

interface PublicFooterProps {
  appName: string
  socialLinks: {
    instagram: string
    facebook: string
    website: string
  }
}

export function PublicFooter({ appName, socialLinks }: PublicFooterProps) {
  const site = usePublicSite()
  const year = new Date().getFullYear()
  const resolvedName = site.settings.name || appName || 'key rescata'
  const description = site.settings.description || 'Rescatamos, rehabilitamos y conectamos mascotas increíbles con hogares para siempre.'
  const address = site.settings.address?.trim() || ''
  const city = site.settings.city ? `${site.settings.city}${site.settings.state ? ', ' + site.settings.state : ''}` : ''
  const phone = site.settings.phone
  const email = site.settings.email
  const logoUrl = site.settings.logoUrl

  const socials = [
    socialLinks.instagram || site.settings.socialLinks.instagram ? { href: socialLinks.instagram || site.settings.socialLinks.instagram, label: 'Instagram', icon: FaInstagram } : null,
    socialLinks.facebook || site.settings.socialLinks.facebook ? { href: socialLinks.facebook || site.settings.socialLinks.facebook, label: 'Facebook', icon: FaFacebookF } : null,
  ].filter(Boolean) as Array<{ href: string; label: string; icon: (props: { className?: string }) => ReactElement }>

  return (
    <footer className="mt-10">
      <div className="rounded-t-[2rem] bg-primary text-primary-foreground sm:rounded-t-[2.5rem]">
        <div className="mx-auto max-w-6xl px-5 py-10 sm:px-6 lg:px-10 lg:py-14">
          <div className="grid gap-10 lg:grid-cols-[1.5fr_0.9fr_0.9fr_1.2fr]">
            <div>
              <a href="/" className="flex items-center gap-3">
                {logoUrl ? <img src={logoUrl} alt={resolvedName} className="size-10 rounded-full object-cover ring-1 ring-white/15" /> : <span className="grid size-10 place-items-center rounded-full bg-white/10 ring-1 ring-white/10"><PawPrint className="size-5" /></span>}
                <span className="text-lg font-semibold tracking-tight">{resolvedName.toLowerCase()}.</span>
              </a>
              <p className="mt-4 max-w-sm text-sm leading-6 text-primary-foreground/70">{description}</p>
              <div className="mt-6 flex items-center gap-2.5">
                {socials.length > 0 ? socials.map(({ href, label, icon: Icon }) => (
                  <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label} className="grid size-9 place-items-center rounded-full bg-white/10 ring-1 ring-white/10 transition hover:bg-white hover:text-primary">
                    <Icon className="size-4" />
                  </a>
                )) : <span className="text-xs text-primary-foreground/50">Síguenos</span>}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground/60">Navegación</p>
              <ul className="mt-4 grid gap-2.5 text-sm text-primary-foreground/80">
                <li><a href="/nosotros" className="hover:text-white">Nosotros</a></li>
                <li><a href="/catalogo" className="hover:text-white">Catálogo</a></li>
                <li><a href="/reconocimiento" className="hover:text-white">Agradecimientos</a></li>
                <li><a href="/eventos" className="hover:text-white">Eventos</a></li>
              </ul>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground/60">Ayuda</p>
              <ul className="mt-4 grid gap-2.5 text-sm text-primary-foreground/80">
                <li><a href="/donar" className="hover:text-white">Donativos</a></li>
                <li><a href="/contacto" className="hover:text-white">Contacto</a></li>
                <li><a href="/privacidad" className="hover:text-white">Privacidad</a></li>
                <li><a href="/terminos" className="hover:text-white">Términos</a></li>
              </ul>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground/60">Contacto</p>
              <ul className="mt-4 grid gap-3 text-sm text-primary-foreground/80">
                {(address || city) && <li className="flex items-start gap-2.5"><MapPin className="mt-0.5 size-4 shrink-0 text-accent" /><span>{[address, city].filter(Boolean).join(' — ')}</span></li>}
                {phone && <li className="flex items-center gap-2.5"><Phone className="size-4 shrink-0 text-accent" /><a href={`tel:${phone}`} className="hover:text-white">{phone}</a></li>}
                {email && <li className="flex items-center gap-2.5"><Mail className="size-4 shrink-0 text-accent" /><a href={`mailto:${email}`} className="hover:text-white">{email}</a></li>}
              </ul>
              <a href="/#formulario" className="mt-6 inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground transition hover:opacity-90">
                Quiero adoptar <Heart className="size-4" />
              </a>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-primary-foreground/60 sm:flex-row sm:items-center sm:justify-between">
            <p>© {year} {resolvedName}. Hecho con amor para quienes no tienen voz.</p>
            <p className="flex items-center gap-1.5"><span className="size-1.5 rounded-full bg-accent" /> Rescate y adopción responsable</p>
          </div>
        </div>
      </div>
    </footer>
  )
}


