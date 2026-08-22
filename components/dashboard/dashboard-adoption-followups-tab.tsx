'use client'

import * as Icons from 'lucide-react'
import { useEffect, useState } from 'react'
import { useDashboardContext } from '@/components/dashboard/dashboard-context'
import { Pagination } from '@/components/ui/pagination'
import { type AdoptionFollowUp } from '@/lib/dashboard-defaults'

const stages = ['Pendiente', 'Contrato firmado', 'Entregado', 'Seguimiento 1', 'Seguimiento 2', 'Cerrado'] as const
const inputClass = 'rounded-xl border border-foreground/15 bg-background px-3.5 py-2.5 text-sm font-normal outline-none focus:border-primary'
type FollowUpFormState = Omit<AdoptionFollowUp, 'id'>

export function DashboardAdoptionFollowUpsTab() {
  const [page, setPage] = useState(1)
  const {
    activeTab, followUps, newFollowUp, setNewFollowUp, handleCreateFollowUp,
    handleUpdateFollowUpStage, handleDeleteFollowUp,
  } = useDashboardContext()

  useEffect(() => {
    setPage(1)
  }, [followUps.length])

  if (activeTab !== 'adoption-followups') return null

  const update = (changes: Partial<FollowUpFormState>) => setNewFollowUp({ ...newFollowUp, ...changes })

  return (
    <section className="space-y-6">
      <form onSubmit={handleCreateFollowUp} className="rounded-3xl border border-foreground/10 bg-card p-6 shadow-sm sm:p-8">
        <div className="mb-6 flex items-center gap-3 border-b border-foreground/10 pb-4">
          <span className="grid size-10 place-items-center rounded-2xl bg-primary/10 text-primary"><Icons.HeartHandshake className="size-5" /></span>
          <div><h2 className="font-bold">Registrar seguimiento</h2><p className="text-xs text-muted-foreground">Registra el avance y las próximas revisiones de una adopción.</p></div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Mascota *" value={newFollowUp.petName} onChange={(value) => update({ petName: value })} placeholder="Nombre de la mascota" required />
          <Field label="Adoptante *" value={newFollowUp.adopterName} onChange={(value) => update({ adopterName: value })} placeholder="Nombre completo" required />
          <Field label="Correo" value={newFollowUp.adopterEmail} onChange={(value) => update({ adopterEmail: value })} placeholder="correo@ejemplo.com" type="email" />
          <Field label="Teléfono / WhatsApp" value={newFollowUp.adopterPhone} onChange={(value) => update({ adopterPhone: value })} placeholder="+52 55 0000 0000" />
          <Field label="Ciudad" value={newFollowUp.adopterCity} onChange={(value) => update({ adopterCity: value })} placeholder="Ciudad" />
          <Field label="Próximo seguimiento" value={newFollowUp.nextFollowUpDate} onChange={(value) => update({ nextFollowUpDate: value })} type="date" />
          <label className="grid gap-2 text-xs font-semibold uppercase tracking-wider">Etapa<select value={newFollowUp.processStage} onChange={(event) => update({ processStage: event.target.value as FollowUpFormState['processStage'] })} className={inputClass}>{stages.map((stage) => <option key={stage}>{stage}</option>)}</select></label>
          <Field label="Fecha de adopción" value={newFollowUp.adoptionDate} onChange={(value) => update({ adoptionDate: value })} type="date" />
          <Field label="Dirección" value={newFollowUp.adopterAddress} onChange={(value) => update({ adopterAddress: value })} placeholder="Domicilio" />
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2"><TextArea label="Notas" value={newFollowUp.notes} onChange={(value) => update({ notes: value })} placeholder="Notas de la visita o llamada" /><TextArea label="Plan de cuidados" value={newFollowUp.carePlan} onChange={(value) => update({ carePlan: value })} placeholder="Acuerdos y cuidados" /></div>
        <div className="mt-5 flex justify-end"><button type="submit" className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"><Icons.Plus className="size-4" /> Guardar seguimiento</button></div>
      </form>

      <div className="grid gap-5 lg:grid-cols-2">
        {followUps.map((followUp: AdoptionFollowUp) => <article key={followUp.id} className="rounded-3xl border border-foreground/10 bg-card p-5 shadow-sm"><div className="flex items-start justify-between gap-4"><div><h3 className="font-bold">{followUp.petName}</h3><p className="mt-1 text-sm text-muted-foreground">Adoptante: {followUp.adopterName}</p></div><button onClick={() => handleDeleteFollowUp(followUp.id, followUp.petName, followUp.adopterName)} className="rounded-lg p-2 text-rose-600 hover:bg-rose-50" title="Eliminar"><Icons.Trash2 className="size-4" /></button></div><div className="mt-5 grid gap-3 sm:grid-cols-2"><label className="grid gap-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Etapa<select value={followUp.processStage} onChange={(event) => handleUpdateFollowUpStage(followUp.id, event.target.value as FollowUpFormState['processStage'])} className={inputClass}>{stages.map((stage) => <option key={stage}>{stage}</option>)}</select></label><div className="rounded-xl bg-secondary/60 p-3 text-xs"><span className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Próxima revisión</span><span className="mt-1 block font-semibold">{followUp.nextFollowUpDate || 'Sin fecha'}</span></div></div><p className="mt-4 text-sm leading-6 text-muted-foreground">{followUp.notes || 'Sin notas registradas.'}</p></article>)}
        {!followUps.length && <div className="rounded-3xl border border-dashed border-foreground/15 p-10 text-center text-sm text-muted-foreground lg:col-span-2">Todavía no hay seguimientos registrados.</div>}
      </div>
      <Pagination page={page} totalItems={followUps.length} pageSize={6} onPageChange={setPage} />
    </section>
  )
}

function Field({ label, value, onChange, placeholder, type = 'text', required = false }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string; type?: string; required?: boolean }) {
  return <label className="grid gap-2 text-xs font-semibold uppercase tracking-wider">{label}<input required={required} type={type} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className={inputClass} /></label>
}

function TextArea({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (value: string) => void; placeholder: string }) {
  return <label className="grid gap-2 text-xs font-semibold uppercase tracking-wider">{label}<textarea rows={3} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className={inputClass + ' resize-none'} /></label>
}
