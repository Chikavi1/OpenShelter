'use client'

import { ArrowRight, CalendarDays, MapPin, PawPrint, Sparkles } from 'lucide-react'
import { usePublicSite } from '@/lib/use-public-site'
import { PublicPageShell } from '@/components/public/public-page-shell'

export default function EventsPage() {
  const site = usePublicSite()
  const appName = site.settings.name || process.env.NEXT_PUBLIC_APP_NAME || ''
  const events = site.events.filter((event) => event.status !== 'Cancelado' && event.status !== 'Finalizado')

  return (
    <PublicPageShell appName={appName} contentClassName="mx-auto max-w-6xl px-4 sm:px-6 lg:px-10">
        <section className="py-16 sm:py-24">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Agenda del refugio</p>
          <h1 className="text-5xl font-semibold tracking-[-0.06em] sm:text-7xl">Eventos y actividades</h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-muted-foreground">Acompáñanos en jornadas de adopción, campañas y actividades para seguir transformando vidas.</p>
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {events.map((event) => {
              const cover = event.image || '/events.png'

              return (
                <article key={event.id} className="overflow-hidden rounded-[28px] border border-foreground/10 bg-card shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                  <div className="relative h-56 overflow-hidden">
                    <img src={cover} alt={event.title} className="h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                    <a
                      href={`/eventos/${event.id}`}
                      target="_blank"
                      rel="noreferrer"
                      className="absolute right-4 top-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-foreground shadow-sm transition hover:-translate-y-0.5"
                    >
                      Ver evento
                      <ArrowRight className="size-4" />
                    </a>

                    <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-4 text-white">
                      <div className="max-w-[70%]">
                        <p className="flex items-center gap-2 text-xs font-medium text-white/80">
                          <CalendarDays className="size-4" />
                          {event.eventDate}{event.eventTime ? ` · ${event.eventTime}` : ''}
                        </p>
                        <p className="mt-1 flex items-center gap-2 text-xs text-white/80">
                          <MapPin className="size-4" />
                          {event.location}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h2 className="text-2xl font-semibold tracking-[-0.04em]"><a href={`/eventos/${event.id}`} target="_blank" rel="noreferrer" className="transition hover:text-primary">{event.title}</a></h2>
                        <p className="mt-3 max-w-xl leading-7 text-muted-foreground">
                          {event.description || 'Pronto compartiremos más detalles.'}
                        </p>
                      </div>
                      <div className="hidden rounded-full border border-foreground/10 p-3 text-muted-foreground md:grid place-items-center">
                        <Sparkles className="size-4" />
                      </div>
                    </div>

                    <div className="mt-6 flex flex-col gap-4 rounded-2xl bg-background/70 p-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-3">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded-full border border-foreground/10 bg-card px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-foreground">{event.category}</span>
                            <span className="rounded-full border border-foreground/10 bg-card px-3 py-1.5 text-[11px] font-medium text-muted-foreground">{event.status}</span>
                          </div>
                          <p className="mt-2 text-xs text-muted-foreground">Acompáñanos y confirma tu asistencia.</p>
                        </div>
                      </div>

                      <a
                        href={`/eventos/${event.id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-medium text-foreground transition hover:opacity-70"
                      >
                        Ver detalles
                        <ArrowRight className="size-4" />
                      </a>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
          {!events.length && <div className="mt-12 rounded-3xl border border-dashed border-foreground/15 p-12 text-center text-muted-foreground">Pronto publicaremos nuevos eventos.</div>}
        </section>
    </PublicPageShell>
  )
}
