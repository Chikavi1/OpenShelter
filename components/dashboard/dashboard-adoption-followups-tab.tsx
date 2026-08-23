'use client'

import * as Icons from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { useDashboardContext } from '@/components/dashboard/dashboard-context'
import { Pagination } from '@/components/ui/pagination'
import { type AdoptionFollowUp } from '@/lib/dashboard-defaults'

const stages = ['Pendiente', 'Contrato firmado', 'Entregado', 'Seguimiento 1', 'Seguimiento 2', 'Cerrado'] as const
const inputClass = 'rounded-xl border border-foreground/15 bg-background px-3.5 py-2.5 text-sm font-normal outline-none focus:border-primary'
type FollowUpFormState = Omit<AdoptionFollowUp, 'id'>

export function DashboardAdoptionFollowUpsTab() {
  const [page, setPage] = useState(1)
  const {
    activeTab, followUps, handleUpdateFollowUpStage, handleUpdateFollowUpChecks, handleUpdateFollowUpDetails, handleDeleteFollowUp,
  } = useDashboardContext()

  if (activeTab !== 'adoption-followups') return null

  const pageSize = 8
  const visibleFollowUps = followUps.slice((page - 1) * pageSize, page * pageSize)

  return (
    <section className="space-y-6">
      <div className="flex items-start gap-3 rounded-3xl border border-primary/15 bg-primary/5 p-5 text-sm">
        <Icons.ShieldCheck className="mt-0.5 size-5 shrink-0 text-primary" />
        <div><p className="font-semibold">Seguimiento controlado</p><p className="mt-1 text-muted-foreground">Cada expediente aparece aquí automáticamente cuando una solicitud cumple los requisitos y es aprobada. No se crean adopciones por fuera del proceso.</p></div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-foreground/10 bg-card shadow-sm">
        <div className="border-b border-foreground/10 px-6 py-4">
          <h3 className="text-lg font-semibold tracking-tight">Mascotas adoptadas</h3>
          <p className="text-sm text-muted-foreground">Fecha, dirección y responsable de cada adopción cerrada.</p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-foreground/10">
            <thead className="bg-secondary/40">
              <tr className="text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                <th className="px-6 py-4">Mascota</th>
                <th className="px-6 py-4">Responsable</th>
                <th className="px-6 py-4">Fecha</th>
                <th className="px-6 py-4">Dirección</th>
                <th className="px-6 py-4">Ciudad</th>
                <th className="px-6 py-4">Próx. seguimiento</th>
                <th className="px-6 py-4">Etapa</th>
                <th className="px-6 py-4">Cumplimiento</th>
                <th className="px-6 py-4">Contrato</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-foreground/10 bg-background">
              {visibleFollowUps.map((followUp: AdoptionFollowUp) => (
                <tr key={followUp.id} className="align-top transition hover:bg-secondary/20">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-foreground">{followUp.petName}</div>
                    <div className="mt-1 text-xs text-muted-foreground">{followUp.adopterEmail || 'Sin correo'}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-foreground">{followUp.adopterName}</div>
                    <div className="mt-1 text-xs text-muted-foreground">{followUp.adopterPhone || 'Sin teléfono'}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground">{followUp.adoptionDate || 'Sin fecha'}</td>
                  <td className="px-6 py-4 text-sm text-foreground">{followUp.adopterAddress || 'No registrada'}</td>
                  <td className="px-6 py-4 text-sm text-foreground">{followUp.adopterCity || 'No registrada'}</td>
                  <td className="px-6 py-4 text-sm text-foreground">{followUp.nextFollowUpDate || 'Sin fecha'}</td>
                  <td className="px-6 py-4">
                    <select
                      value={followUp.processStage}
                      onChange={(event) => handleUpdateFollowUpStage(followUp.id, event.target.value as FollowUpFormState['processStage'])}
                      className={inputClass + ' min-w-40'}
                    >
                      {stages.map((stage) => <option key={stage}>{stage}</option>)}
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <div className="grid min-w-52 gap-2 text-xs">
                      {([
                        ['contacted', 'Contacto realizado'], ['petSafe', 'Mascota segura'], ['healthUpToDate', 'Salud al día'], ['conditionsMet', 'Condiciones cumplidas'],
                      ] as const).map(([key, label]) => <label key={key} className="flex items-center gap-2"><input type="checkbox" checked={followUp.followUpChecks[key]} onChange={(event) => handleUpdateFollowUpChecks(followUp.id, key, event.target.checked)} className="size-3.5 accent-primary" />{label}</label>)}
                    </div>
                    <span className={`mt-2 inline-flex rounded-full px-2 py-1 text-[10px] font-semibold ${followUp.verificationStatus === 'En cumplimiento' ? 'bg-emerald-100 text-emerald-800' : followUp.verificationStatus === 'Requiere atención' ? 'bg-amber-100 text-amber-800' : 'bg-secondary text-foreground'}`}>{followUp.verificationStatus}</span>
                    <input type="date" value={followUp.lastContactDate ?? ''} onChange={(event) => handleUpdateFollowUpDetails(followUp.id, { lastContactDate: event.target.value })} className={inputClass + ' mt-2 w-full text-xs'} aria-label="Último contacto" />
                    <input type="text" value={followUp.incidents} onChange={(event) => handleUpdateFollowUpDetails(followUp.id, { incidents: event.target.value })} placeholder="Incidencias o alertas" className={inputClass + ' mt-2 w-full text-xs'} />
                  </td>
                  <td className="px-6 py-4">
                    <Link href={`/contrato/${followUp.id}`} className="text-sm font-medium text-primary hover:underline">
                      Ver contrato
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDeleteFollowUp(followUp.id, followUp.petName, followUp.adopterName)}
                      className="rounded-lg p-2 text-rose-600 hover:bg-rose-50"
                      title="Eliminar"
                    >
                      <Icons.Trash2 className="size-4" />
                    </button>
                  </td>
                </tr>
              ))}

              {!followUps.length && (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center text-sm text-muted-foreground">
                    Todavía no hay adopciones registradas.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <Pagination page={page} totalItems={followUps.length} pageSize={pageSize} onPageChange={setPage} />
    </section>
  )
}
