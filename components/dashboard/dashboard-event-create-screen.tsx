'use client'

import * as Icons from 'lucide-react'
import { useDashboardContext } from '@/components/dashboard/dashboard-context'
import { type ShelterEvent } from '@/lib/dashboard-defaults'
import { EventLocationPicker } from '@/components/dashboard/event-location-picker'

const categories = ['Adopción', 'Recaudación', 'Voluntariado', 'Vacunación', 'Educativo'] as const
const statuses = ['Programado', 'En preparación', 'En curso', 'Finalizado', 'Cancelado'] as const
const inputClass = 'rounded-2xl border border-foreground/15 bg-background px-4 py-3 text-sm font-normal outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10'
type EventFormState = Omit<ShelterEvent, 'id'>

export function DashboardEventCreateScreen() {
  const { activeTab, newEvent, setNewEvent, handleCreateEvent, setActiveTab, editingEvent, uploadingEventImage, handleEventImageUpload, settings } = useDashboardContext()
  if (activeTab !== 'register-event') return null

  const update = (changes: Partial<EventFormState>) => setNewEvent({ ...newEvent, ...changes })

  return (
    <section className="mx-auto w-full max-w-5xl">
      <button type="button" onClick={() => setActiveTab('events')} className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground">
        <Icons.ArrowLeft className="size-4" /> Volver a eventos
      </button>
      <form onSubmit={handleCreateEvent} className="overflow-hidden rounded-[2rem] border border-foreground/10 bg-card shadow-sm">
        <div className="border-b border-foreground/10 bg-secondary/40 px-6 py-7 sm:px-10">
          <div className="flex items-start gap-4">
            <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary"><Icons.CalendarPlus className="size-6" /></span>
            <div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Agenda del refugio</p><h2 className="mt-2 text-3xl font-semibold tracking-tight">Crear nuevo evento</h2><p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">Completa la información para publicar una jornada, campaña o actividad.</p></div>
          </div>
        </div>
        <div className="space-y-8 px-6 py-8 sm:px-10">
          <div><SectionTitle>Información principal</SectionTitle><div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3"><Field label="Título *" value={newEvent.title} onChange={(value) => update({ title: value })} placeholder="Jornada de adopción" required /><Select label="Categoría" value={newEvent.category} options={categories} onChange={(value) => update({ category: value as EventFormState['category'] })} /><Select label="Estado" value={newEvent.status} options={statuses} onChange={(value) => update({ status: value as EventFormState['status'] })} /></div><div className="mt-5 grid gap-5 md:grid-cols-2"><div className="grid gap-3"><p className="text-xs font-semibold uppercase tracking-wider">Imagen del evento</p>{newEvent.image && <img src={newEvent.image} alt="Vista previa del evento" className="h-36 w-full rounded-2xl object-cover" />}<label className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-dashed border-foreground/20 bg-background px-4 py-4 text-sm font-medium transition hover:border-primary hover:bg-secondary"><Icons.Upload className="size-4" /> {uploadingEventImage ? 'Subiendo imagen…' : 'Subir imagen'}<input type="file" accept="image/*" className="sr-only" disabled={uploadingEventImage} onChange={(event) => { void handleEventImageUpload(event.target.files?.[0]); event.currentTarget.value = '' }} /></label></div></div></div>
          <div><SectionTitle>Fecha y ubicación</SectionTitle><div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3"><Field label="Fecha *" value={newEvent.eventDate} onChange={(value) => update({ eventDate: value })} type="date" required /><Field label="Hora" value={newEvent.eventTime} onChange={(value) => update({ eventTime: value })} type="time" /><Field label="Dirección *" value={newEvent.location} onChange={(value) => update({ location: value })} placeholder="Calle, número, colonia y ciudad" required /></div><div className="mt-5"><EventLocationPicker latitude={newEvent.latitude} longitude={newEvent.longitude} logoUrl={settings?.logoUrl} onChange={(location) => update({ latitude: location.latitude, longitude: location.longitude })} /></div></div>
          <div><SectionTitle>Contacto y registro</SectionTitle><div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3"><Field label="Meta de asistentes" value={String(newEvent.attendeesTarget)} onChange={(value) => update({ attendeesTarget: Number.parseInt(value, 10) || 0 })} type="number" /><Field label="Responsable (interno)" value={newEvent.contactName} onChange={(value) => update({ contactName: value })} placeholder="Nombre del contacto" /><Field label="Teléfono (interno)" value={newEvent.contactPhone} onChange={(value) => update({ contactPhone: value })} placeholder="555 000 0000" /><Field label="Liga de registro" value={newEvent.registrationLink} onChange={(value) => update({ registrationLink: value })} placeholder="https://..." /><Field label="Texto del botón CTA" value={newEvent.ctaLabel} onChange={(value) => update({ ctaLabel: value })} placeholder="Registrarme, Asistiré, Confirmar..." /></div></div>
          <div><SectionTitle>Detalles</SectionTitle><div className="grid gap-5 md:grid-cols-2"><TextArea label="Descripción pública" value={newEvent.description} onChange={(value) => update({ description: value })} placeholder="Objetivo y dinámica del evento" /><TextArea label="Notas internas" value={newEvent.notes} onChange={(value) => update({ notes: value })} placeholder="Permisos, materiales, pendientes" /></div></div>
        </div>
        <div className="flex flex-col-reverse gap-3 border-t border-foreground/10 bg-secondary/20 px-6 py-5 sm:flex-row sm:justify-end sm:px-10"><button type="button" onClick={() => setActiveTab('events')} className="rounded-full border border-foreground/15 px-5 py-3 text-sm font-medium transition hover:bg-background">Cancelar</button><button type="submit" className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90"><Icons.Check className="size-4" /> {editingEvent ? 'Guardar cambios' : 'Crear evento'}</button></div>
      </form>
    </section>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">{children}</h3>
}

function Field({ label, value, onChange, placeholder, type = 'text', required = false }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string; type?: string; required?: boolean }) {
  return (
    <label className="grid gap-2 text-xs font-semibold uppercase tracking-wider">
      {label}
      <input required={required} type={type} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className={inputClass} />
    </label>
  )
}

function Select({ label, value, options, onChange }: { label: string; value: string; options: readonly string[]; onChange: (value: string) => void }) {
  return (
    <label className="grid gap-2 text-xs font-semibold uppercase tracking-wider">
      {label}
      <select value={value} onChange={(event) => onChange(event.target.value)} className={inputClass}>
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    </label>
  )
}

function TextArea({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (value: string) => void; placeholder: string }) {
  return (
    <label className="grid gap-2 text-xs font-semibold uppercase tracking-wider">
      {label}
      <textarea rows={4} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className={`${inputClass} resize-none`} />
    </label>
  )
}
