'use client'

import * as Icons from 'lucide-react'
import { useState } from 'react'
import { useDashboardContext } from '@/components/dashboard/dashboard-context'
import { Pagination } from '@/components/ui/pagination'
import { type ShelterEvent } from '@/lib/dashboard-defaults'

const statuses = ['Programado', 'En preparación', 'En curso', 'Finalizado', 'Cancelado'] as const

function formatEventDate(value: string) {
  if (!value) return 'Por confirmar'
  if (value.includes('/')) return value

  const parts = value.split('-')
  if (parts.length === 3) {
    const [year, month, day] = parts
    return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`
  }

  return value
}

export function DashboardEventsTab() {
  const [page, setPage] = useState(1)
  const {
    activeTab,
    events,
    handleUpdateEventStatus,
    handleDeleteEvent,
    handleStartEditEvent,
  } = useDashboardContext()

  if (activeTab !== 'events') return null

  return (
    <section className="space-y-6">
      <div className="grid gap-5 lg:grid-cols-2">
        {events.slice((page - 1) * 6, page * 6).map((event: ShelterEvent) => (
          <article key={event.id} className="group overflow-hidden rounded-[28px] border border-foreground/10 bg-card shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-lg">
            <div className="relative h-44 overflow-hidden bg-secondary sm:h-52">
              {event.image ? (
                <img src={event.image} alt={event.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]" />
              ) : (
                <div className="flex h-full items-end bg-gradient-to-br from-primary/15 via-secondary to-background p-5">
                  <div className="max-w-[70%]">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Evento del refugio</p>
                    <h3 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">{event.title}</h3>
                  </div>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/5 to-transparent" />
              <div className="absolute left-4 top-4 flex items-center gap-2">
                <span className="rounded-full border border-white/20 bg-black/35 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
                  {event.category}
                </span>
                <span className="rounded-full border border-white/20 bg-black/35 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
                  {event.status}
                </span>
              </div>
            </div>

            <div className="p-5 sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="truncate text-xl font-semibold tracking-tight text-foreground">{event.title}</h3>
                    <span className="rounded-full border border-foreground/10 bg-secondary px-2.5 py-1 text-[11px] font-semibold text-muted-foreground">
                      {event.category}
                    </span>
                  </div>
                  <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                    <Icons.MapPin className="size-4 shrink-0" />
                    <span className="truncate">{event.location || 'Ubicación por confirmar'}</span>
                  </p>
                </div>

                <div className="flex items-center gap-1 opacity-80 transition group-hover:opacity-100">
                  <button type="button" onClick={() => handleStartEditEvent(event)} className="grid size-9 place-items-center rounded-full border border-foreground/10 text-muted-foreground transition hover:bg-secondary hover:text-foreground" title="Editar">
                    <Icons.Pencil className="size-4" />
                  </button>
                  <button type="button" onClick={() => handleDeleteEvent(event.id, event.title)} className="grid size-9 place-items-center rounded-full border border-foreground/10 text-rose-600 transition hover:bg-rose-50" title="Eliminar">
                    <Icons.Trash2 className="size-4" />
                  </button>
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-foreground/10 bg-background px-4 py-3.5">
                  <span className="block text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">Fecha y hora</span>
                  <span className="mt-1 block text-sm font-semibold text-foreground">
                    {formatEventDate(event.eventDate)}{event.eventTime ? ` · ${event.eventTime}` : ''}
                  </span>
                </div>
                <div className="rounded-2xl border border-foreground/10 bg-background px-4 py-3.5">
                  <span className="block text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">Meta de asistentes</span>
                  <span className="mt-1 block text-sm font-semibold text-foreground">
                    {event.attendeesTarget ? `${event.attendeesTarget} personas` : 'Cupo abierto'}
                  </span>
                </div>
              </div>

              <div className="mt-5 grid gap-3 rounded-2xl border border-foreground/10 bg-secondary/30 p-4 sm:grid-cols-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">Responsable</p>
                  <p className="mt-1 text-sm font-medium text-foreground">{event.contactName || 'Sin asignar'}</p>
                  <p className="text-xs text-muted-foreground">{event.contactPhone || 'Sin teléfono'}</p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">Descripción</p>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">{event.description || 'Sin descripción'}</p>
                </div>
              </div>

              {event.notes && (
                <div className="mt-4 rounded-2xl border border-dashed border-foreground/10 bg-card px-4 py-3">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">Notas internas</p>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">{event.notes}</p>
                </div>
              )}

              <div className="mt-5 flex flex-col gap-3 border-t border-foreground/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
                <select value={event.status} onChange={(e) => handleUpdateEventStatus(event.id, e.target.value as ShelterEvent['status'])} className="w-full rounded-full border border-foreground/15 bg-background px-4 py-2 text-sm font-medium outline-none sm:w-auto">
                  {statuses.map((status) => <option key={status}>{status}</option>)}
                </select>

                <div className="flex items-center justify-between gap-3 sm:justify-end">
                  {event.registrationLink ? (
                    <a href={event.registrationLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-medium text-primary transition hover:underline">
                      Ver liga
                      <Icons.Link2 className="size-4" />
                    </a>
                  ) : (
                    <span className="text-sm text-muted-foreground">Sin liga de registro</span>
                  )}
                  <span className="rounded-full border border-foreground/10 px-3 py-1 text-[11px] font-medium text-muted-foreground">ID: {event.id}</span>
                </div>
              </div>
            </div>
          </article>
        ))}

        {!events.length && (
          <div
            className="rounded-3xl border border-dashed border-foreground/15 p-10 text-center text-sm text-muted-foreground lg:col-span-2"
          >
            Todavía no hay eventos registrados.
          </div>
        )}
      </div>
      <Pagination page={page} totalItems={events.length} pageSize={6} onPageChange={setPage} />
    </section>
  )
}
