'use client'

import { useState } from 'react'
import { ArrowLeft, Check, Clock, Mail, MapPin, PawPrint, Phone, Send } from 'lucide-react'
import { usePublicSite } from '@/lib/use-public-site'
import { PublicPageShell } from '@/components/public/public-page-shell'

export default function ContactoPage() {
  const site = usePublicSite()
  const [sent, setSent] = useState(false)

  const appName = site.settings.name || process.env.NEXT_PUBLIC_APP_NAME || ''
  const logoUrl = site.settings.logoUrl || process.env.NEXT_PUBLIC_LOGO_URL
  const email = site.settings.email || process.env.NEXT_PUBLIC_CONTACT_EMAIL || ''
  const phone = site.settings.phone || process.env.NEXT_PUBLIC_CONTACT_PHONE || ''
  const address = site.settings.address || process.env.NEXT_PUBLIC_CONTACT_ADDRESS || ''
  const hours = site.settings.visitingHours || process.env.NEXT_PUBLIC_CONTACT_HOURS || ''

  const channels = [
    { label: 'Correo', value: email, href: `mailto:${email}`, icon: <Mail className="size-5" /> },
    { label: 'Teléfono', value: phone, href: `tel:${phone.replace(/\s/g, '')}`, icon: <Phone className="size-5" /> },
    { label: 'Dirección', value: address, icon: <MapPin className="size-5" /> },
    { label: 'Horario', value: hours, icon: <Clock className="size-5" /> },
  ]

  return (
    <PublicPageShell appName={appName} logoUrl={logoUrl} contentClassName="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">

        <section className="grid gap-10 py-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20 lg:py-20">
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Contacto</p>
            <h1 className="text-balance text-5xl font-semibold leading-[0.95] tracking-[-0.065em] sm:text-7xl">Estamos aquí <span className="text-muted-foreground">para ti.</span></h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-muted-foreground">¿Tienes dudas sobre una adopción, un donativo o quieres sumarte como voluntario? Escríbenos y te responderemos lo antes posible.</p>
            <div className="mt-9 grid gap-4 sm:grid-cols-2">{channels.map((channel) => <a key={channel.label} href={channel.href} className="flex items-start gap-4 rounded-2xl border border-foreground/10 bg-card p-5 transition hover:border-foreground/25"><span className="grid size-11 shrink-0 place-items-center rounded-full bg-accent text-accent-foreground">{channel.icon}</span><span><span className="block text-xs uppercase tracking-wider text-muted-foreground">{channel.label}</span><span className="mt-1 block text-sm font-medium leading-5">{channel.value}</span></span></a>)}</div>
          </div>
          {sent ? <div className="flex min-h-96 flex-col justify-center rounded-[2rem] bg-accent p-8 text-accent-foreground"><span className="grid size-12 place-items-center rounded-full bg-primary text-primary-foreground"><Check /></span><h2 className="mt-5 text-3xl font-semibold">¡Mensaje enviado!</h2><p className="mt-3 max-w-sm leading-7">Gracias por escribirnos. Nuestro equipo te responderá muy pronto a tu correo.</p><a href="/" className="mt-7 flex w-fit items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground">Volver al inicio</a></div> : <form className="grid gap-5 rounded-[2rem] border border-foreground/10 bg-card p-6 sm:p-10" onSubmit={(event) => { event.preventDefault(); setSent(true) }}><div className="grid gap-5 sm:grid-cols-2"><label className="grid gap-2 text-sm font-medium">Nombre completo<input required name="name" placeholder="Tu nombre" className="rounded-xl border border-foreground/15 bg-background px-4 py-3 font-normal outline-none transition focus:border-foreground" /></label><label className="grid gap-2 text-sm font-medium">Correo electrónico<input required type="email" name="email" placeholder="tu@correo.com" className="rounded-xl border border-foreground/15 bg-background px-4 py-3 font-normal outline-none transition focus:border-foreground" /></label></div><label className="grid gap-2 text-sm font-medium">Asunto<select name="subject" className="rounded-xl border border-foreground/15 bg-background px-4 py-3 font-normal outline-none"><option>Adopción</option><option>Donativos</option><option>Voluntariado</option><option>Otro</option></select></label><label className="grid gap-2 text-sm font-medium">Mensaje<textarea required name="message" rows={5} placeholder="Cuéntanos en qué podemos ayudarte" className="resize-none rounded-xl border border-foreground/15 bg-background px-4 py-3 font-normal outline-none transition focus:border-foreground" /></label><button className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-4 text-sm font-medium text-primary-foreground transition hover:scale-[1.01]">Enviar mensaje <Send className="size-4" /></button></form>}
        </section>

    </PublicPageShell>
  )
}
