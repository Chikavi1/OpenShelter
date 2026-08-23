'use client'

import { ArrowLeft, ArrowRight, CalendarDays, CheckCircle2, Clock3, Mail, MapPin, Phone, Users } from 'lucide-react'
import { use } from 'react'
import { EventMap } from '@/components/public/event-map'
import { PublicPageShell } from '@/components/public/public-page-shell'
import { usePublicSite } from '@/lib/use-public-site'
import { PublicPageLoader } from '@/components/public/public-page-loader'

function formatDate(value?: string) {
  if (!value) return 'Por confirmar'
  if (value.includes('/')) return value

  const parts = value.split('-')
  if (parts.length === 3) {
    const [year, month, day] = parts
    return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`
  }

  const parsed = new Date(value)
  if (!Number.isNaN(parsed.getTime())) {
    const day = String(parsed.getDate()).padStart(2, '0')
    const month = String(parsed.getMonth() + 1).padStart(2, '0')
    const year = parsed.getFullYear()
    return `${day}/${month}/${year}`
  }

  return value
}

export default function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const site = usePublicSite()
  const { id } = use(params)
  if (site.loading) return <PublicPageLoader label="Cargando evento" />
  const event = site.events.find((item) => item.id === id)
  const appName = site.settings.name || process.env.NEXT_PUBLIC_APP_NAME || ''

  if (!event) {
    return <main className="min-h-screen bg-background px-4 py-20 text-center text-foreground"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Evento no disponible</p><h1 className="mt-4 text-4xl font-semibold">No encontramos este evento</h1><a href="/eventos" className="mt-8 inline-flex rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground">Ver eventos</a></main>
  }

  const cover = event.image || '/events.png'
  const hasRegistration = Boolean(event.registrationLink)
  const googleMapsQuery = event.latitude && event.longitude ? `${event.latitude},${event.longitude}` : event.location
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(googleMapsQuery)}`
  const details = [
    { icon: CalendarDays, label: 'Fecha', value: formatDate(event.eventDate) },
    { icon: Clock3, label: 'Hora', value: event.eventTime || 'Por confirmar' },
    { icon: MapPin, label: 'Lugar', value: event.location || 'Por confirmar' },
    { icon: Users, label: 'Cupo', value: event.attendeesTarget ? `${event.attendeesTarget} personas` : 'Cupo abierto' },
  ]

  return (
    <PublicPageShell appName={appName} contentClassName="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="py-6 sm:py-10"><a href="/eventos" className="inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"><ArrowLeft className="size-4" /> Todos los eventos</a></div>

        <section className="relative overflow-hidden rounded-[2rem] bg-secondary shadow-sm sm:rounded-[2.5rem]">
          <img src={cover} alt={event.title} className="h-[320px] w-full object-cover sm:h-[460px]" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
          <div className="absolute inset-x-5 bottom-5 text-white sm:inset-x-10 sm:bottom-10"><div className="flex flex-wrap gap-2"><span className="rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider backdrop-blur">{event.category}</span><span className="rounded-full bg-accent px-3 py-1.5 text-xs font-semibold text-accent-foreground">{event.status}</span></div><h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-[-0.06em] sm:text-6xl">{event.title}</h1></div>
        </section>

        <div className="grid gap-10 py-10 lg:grid-cols-[1fr_360px] lg:gap-16 lg:py-16">
          <div className="space-y-10">
            <div className="grid gap-3 sm:grid-cols-2"><div className="rounded-2xl border border-foreground/10 bg-card p-5 sm:col-span-2"><p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Sobre este evento</p><p className="mt-3 max-w-3xl text-lg leading-8 text-muted-foreground">{event.description || 'Acompáñanos a construir una comunidad que transforma vidas.'}</p></div>{details.map(({ icon: Icon, label, value }) => <div key={label} className="rounded-2xl border border-foreground/10 bg-card p-5"><Icon className="size-5 text-primary" /><p className="mt-5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</p><p className="mt-1 font-medium">{value}</p></div>)}</div>
            <div><div className="mb-4 flex items-end justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Dónde será</p><h2 className="mt-2 text-3xl font-semibold tracking-tight">Encuentra el punto de encuentro</h2></div><a href={googleMapsUrl} target="_blank" rel="noreferrer" className="hidden text-sm font-medium text-primary hover:underline sm:block">Abrir mapa</a></div><EventMap location={event.location} latitude={event.latitude} longitude={event.longitude} /></div>
            {event.notes && <div className="rounded-2xl bg-secondary/60 p-6"><p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Información importante</p><p className="mt-3 leading-7 text-muted-foreground">{event.notes}</p></div>}
          </div>

          <aside className="lg:sticky lg:top-6 lg:self-start"><div className="rounded-3xl border border-foreground/10 bg-card p-6 shadow-sm"><p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Participa con {appName}</p><h2 className="mt-3 text-2xl font-semibold">Reserva tu lugar</h2><p className="mt-3 text-sm leading-6 text-muted-foreground">Confirma tu asistencia y recibe los detalles del evento directamente con el refugio.</p>{hasRegistration ? <a href={event.registrationLink} target="_blank" rel="noreferrer" className="mt-6 flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90">Registrarme <ArrowRight className="size-4" /></a> : <div className="mt-6 flex items-center gap-2 rounded-2xl bg-secondary p-3 text-xs text-muted-foreground"><CheckCircle2 className="size-4 text-primary" /> Registro presencial o por contacto</div>}<div className="mt-6 space-y-3 border-t border-foreground/10 pt-5">{event.contactName && <p className="flex items-center gap-3 text-sm text-muted-foreground"><Users className="size-4 text-primary" />{event.contactName}</p>}{event.contactPhone && <a href={`tel:${event.contactPhone}`} className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground"><Phone className="size-4 text-primary" />{event.contactPhone}</a>}{site.settings.email && <a href={`mailto:${site.settings.email}`} className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground"><Mail className="size-4 text-primary" />{site.settings.email}</a>}</div></div></aside>
        </div>
    </PublicPageShell>
  )
}
