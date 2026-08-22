'use client'

import * as Icons from 'lucide-react'
import { useEffect, useState } from 'react'
import { useDashboardContext } from '@/components/dashboard/dashboard-context'
import { Pagination } from '@/components/ui/pagination'
import { type ShelterEvent } from '@/lib/dashboard-defaults'

const categories = ['Adopción', 'Recaudación', 'Voluntariado', 'Vacunación', 'Educativo'] as const
const statuses = ['Programado', 'En preparación', 'En curso', 'Finalizado', 'Cancelado'] as const
const inputClass = 'rounded-xl border border-foreground/15 bg-background px-3.5 py-2.5 text-sm font-normal outline-none focus:border-primary'
type EventFormState = Omit<ShelterEvent, 'id'>

export function DashboardEventsTab() {
  const [page, setPage] = useState(1)
  const {
    activeTab,
    events,
    newEvent,
    setNewEvent,
    handleCreateEvent,
    handleUpdateEventStatus,
    handleDeleteEvent,
  } = useDashboardContext()

  useEffect(() => {
    setPage(1)
  }, [events.length])

  if (activeTab !== 'events') return null

  const update = (changes: Partial<EventFormState>) => setNewEvent({ ...newEvent, ...changes })

  return (
    <section className="space-y-6">
      <form onSubmit={handleCreateEvent} className="rounded-3xl border border-foreground/10 bg-card p-6 shadow-sm sm:p-8">
        <div className="mb-6 flex items-center gap-3 border-b border-foreground/10 pb-4">
          <span className="grid size-10 place-items-center rounded-2xl bg-sky-500/10 text-sky-600">
            <Icons.CalendarDays className="size-5" />
          </span>
          <div>
            <h2 className="font-bold">Registrar evento</h2>
            <p className="text-xs text-muted-foreground">Organiza jornadas, campañas y actividades del refugio.</p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Título *" value={newEvent.title} onChange={(value) => update({ title: value })} placeholder="Jornada de adopción" required />
          <label className="grid gap-2 text-xs font-semibold uppercase tracking-wider">
            Categoría
            <select value={newEvent.category} onChange={(event) => update({ category: event.target.value as EventFormState['category'] })} className={inputClass}>
              {categories.map((category) => <option key={category}>{category}</option>)}
            </select>
          </label>
          <label className="grid gap-2 text-xs font-semibold uppercase tracking-wider">
            Estado
            <select value={newEvent.status} onChange={(event) => update({ status: event.target.value as EventFormState['status'] })} className={inputClass}>
              {statuses.map((status) => <option key={status}>{status}</option>)}
            </select>
          </label>
          <Field label="Fecha *" value={newEvent.eventDate} onChange={(value) => update({ eventDate: value })} type="date" required />
          <Field label="Hora" value={newEvent.eventTime} onChange={(value) => update({ eventTime: value })} type="time" />
          <Field label="Lugar *" value={newEvent.location} onChange={(value) => update({ location: value })} placeholder="Parque, albergue o sede" required />
          <Field label="Meta de asistentes" value={String(newEvent.attendeesTarget)} onChange={(value) => update({ attendeesTarget: Number.parseInt(value, 10) || 0 })} type="number" />
          <Field label="Responsable" value={newEvent.contactName} onChange={(value) => update({ contactName: value })} placeholder="Nombre del contacto" />
          <Field label="Teléfono" value={newEvent.contactPhone} onChange={(value) => update({ contactPhone: value })} placeholder="555 000 0000" />
          <Field label="Liga de registro" value={newEvent.registrationLink} onChange={(value) => update({ registrationLink: value })} placeholder="https://..." />
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <TextArea label="Descripción" value={newEvent.description} onChange={(value) => update({ description: value })} placeholder="Objetivo y dinámica del evento" />
          <TextArea label="Notas internas" value={newEvent.notes} onChange={(value) => update({ notes: value })} placeholder="Permisos, materiales, pendientes" />
        </div>

        <div className="mt-5 flex justify-end">
          <button type="submit" className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">
            <Icons.Plus className="size-4" /> Guardar evento
          </button>
        </div>
      </form>

      <div className="grid gap-5 lg:grid-cols-2">
        {events.slice((page - 1) * 6, page * 6).map((event: ShelterEvent) => (
          <article key={event.id} className="rounded-3xl border border-foreground/10 bg-card p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-bold">{event.title}</h3>
                  <span className="rounded-full bg-sky-500/10 px-2.5 py-1 text-[11px] font-semibold text-sky-700">
                    {event.category}
                  </span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{event.location}</p>
              </div>
              <button onClick={() => handleDeleteEvent(event.id, event.title)} className="rounded-lg p-2 text-rose-600 hover:bg-rose-50" title="Eliminar">
                <Icons.Trash2 className="size-4" />
              </button>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl bg-secondary/60 p-3 text-xs">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Fecha y hora</span>
                <span className="mt-1 block font-semibold">{event.eventDate}{event.eventTime ? ` · ${event.eventTime}` : ''}</span>
              </div>
              <div className="rounded-xl bg-secondary/60 p-3 text-xs">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Meta de asistentes</span>
                <span className="mt-1 block font-semibold">{event.attendeesTarget || 0}</span>
              </div>
            </div>

            <div className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
              <p><span className="font-semibold text-foreground">Responsable:</span> {event.contactName || 'Sin asignar'} · {event.contactPhone || 'Sin teléfono'}</p>
              <p><span className="font-semibold text-foreground">Descripción:</span> {event.description || 'Sin descripción'}</p>
              <p><span className="font-semibold text-foreground">Notas:</span> {event.notes || 'Sin notas'}</p>
              {event.registrationLink && (
                <a href={event.registrationLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-primary hover:underline">
                  <Icons.Link2 className="size-4" /> Ver liga
                </a>
              )}
            </div>

            <div className="mt-5 flex items-center justify-between gap-3 border-t border-foreground/10 pt-4">
              <select value={event.status} onChange={(e) => handleUpdateEventStatus(event.id, e.target.value as ShelterEvent['status'])} className="rounded-lg border border-foreground/15 bg-background px-3 py-1.5 text-xs font-medium outline-none">
                {statuses.map((status) => <option key={status}>{status}</option>)}
              </select>
              <span className="text-[11px] text-muted-foreground">ID: {event.id}</span>
            </div>
          </article>
        ))}

        {!events.length && (
          <div className="rounded-3xl border border-dashed border-foreground/15 p-10 text-center text-sm text-muted-foreground lg:col-span-2">
            Todavía no hay eventos registrados.
          </div>
        )}
      </div>
      <Pagination page={page} totalItems={events.length} pageSize={6} onPageChange={setPage} />
    </section>
  )
}

function Field({ label, value, onChange, placeholder, type = 'text', required = false }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string; type?: string; required?: boolean }) {
  return <label className="grid gap-2 text-xs font-semibold uppercase tracking-wider">{label}<input required={required} type={type} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className={inputClass} /></label>
}

function TextArea({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (value: string) => void; placeholder: string }) {
  return <label className="grid gap-2 text-xs font-semibold uppercase tracking-wider">{label}<textarea rows={3} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className={inputClass + ' resize-none'} /></label>
}
