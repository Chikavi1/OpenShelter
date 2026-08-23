'use client'

import * as Icons from 'lucide-react'
import { useDashboardContext } from '@/components/dashboard/dashboard-context'
import { Pagination } from '@/components/ui/pagination'
import { useState } from 'react'
import type { AdoptionApplication } from '@/lib/dashboard-defaults'

export function DashboardApplicationsTab() {
  const [page, setPage] = useState(1)
  const { activeTab, appSearchTerm, setAppSearchTerm, appFilterStatus, setAppFilterStatus, filteredAppsList, handleRequestAppStatusChange, handleRequestApproveApplication, handleUpdateAppVerification, handleStartFollowUpFromApplication, applicationActionError, settings } = useDashboardContext()

  return (<>
  {/* APPLICATIONS TAB */}
  {activeTab === 'applications' && (
    <div className="space-y-6">
      {applicationActionError && <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">{applicationActionError}</div>}
      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-card border border-foreground/10 p-4 rounded-2xl">
        <div className="relative flex-1">
          <Icons.Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar por solicitante o mascota..."
            value={appSearchTerm}
            onChange={(e) => setAppSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-foreground/15 bg-background outline-none focus:border-foreground"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground font-medium">Estado de Solicitud:</span>
          <select
            value={appFilterStatus}
            onChange={(e) => setAppFilterStatus(e.target.value)}
            className="text-xs py-2 px-3 rounded-xl border border-foreground/15 bg-background outline-none font-medium"
          >
            <option value="Todos">Todas</option>
            <option value="Pendiente">Pendiente</option>
            <option value="En revisión">En revisión</option>
            <option value="Aprobada">Aprobada</option>
            <option value="Rechazada">Rechazada</option>
          </select>
        </div>
      </div>

      {/* Applications List */}
      <div className="space-y-4">
               {filteredAppsList.slice((page - 1) * 6, page * 6).map((app: AdoptionApplication) => (
          <div
            key={app.id}
            className="rounded-2xl border border-foreground/10 bg-card p-5 sm:p-6 shadow-xs space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-foreground/10 pb-4">
              <div className="flex items-center gap-4">
                <img
                  src={app.petImage}
                  alt={app.petName}
                  className="size-14 rounded-2xl object-cover border border-foreground/10"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold">{app.applicantName}</h3>
                    <span className="text-xs text-muted-foreground">interesado en <strong className="text-foreground">{app.petName}</strong></span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Enviado el {app.dateSubmitted} · ID: {app.id}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground font-medium">Estado actual:</span>
                <span
                  className={`text-xs px-3 py-1 rounded-full font-semibold ${
                    app.status === 'Pendiente'
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
                      : app.status === 'En revisión'
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300'
                      : app.status === 'Aprobada'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
                      : 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300'
                  }`}
                >
                  {app.status}
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-foreground/10 bg-secondary/30 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div><p className="text-xs font-bold uppercase tracking-wider">Expediente de adopción</p><p className="mt-1 text-xs text-muted-foreground">Todos los puntos deben estar verificados antes de aprobar.</p></div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${Object.values(app.verification).every(Boolean) && app.documents.length >= 2 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                  {Object.values(app.verification).filter(Boolean).length}/6 verificaciones · {app.documents.length}/2 documentos
                </span>
              </div>
              <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {([
                  ['identity', 'Identidad validada'], ['address', 'Domicilio validado'], ['homeConditions', 'Condiciones del hogar'],
                  ['interview', 'Entrevista realizada'], ['references', 'Referencias verificadas'], ['eligibility', 'Cumple requisitos'],
                ] as const).map(([key, label]) => (
                  <label key={key} className="flex items-center gap-2 rounded-xl border border-foreground/10 bg-background px-3 py-2 text-xs font-medium">
                    <input type="checkbox" checked={app.verification[key]} onChange={(event) => handleUpdateAppVerification(app.id, key, event.target.checked)} className="size-4 accent-primary" />
                    {label}
                  </label>
                ))}
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {app.documents.map((document) => <a key={`${app.id}-${document.type}`} href={document.url} target="_blank" rel="noreferrer" className="rounded-xl border border-foreground/10 bg-background px-3 py-2 text-xs font-medium hover:border-primary">{document.type}: {document.name}</a>)}
                {!app.documents.length && <span className="text-xs text-muted-foreground">La persona aún no ha enviado documentos.</span>}
              </div>
            </div>

            {/* Applicant Details */}
            <div className="grid gap-4 sm:grid-cols-3 text-xs">
              <div className="bg-background p-3.5 rounded-xl border border-foreground/10">
                <span className="text-muted-foreground font-semibold uppercase tracking-wider block mb-1">Contacto</span>
                <p className="font-medium text-sm">{app.applicantEmail}</p>
                <p className="text-muted-foreground">{app.applicantPhone}</p>
              </div>

              <div className="bg-background p-3.5 rounded-xl border border-foreground/10">
                <span className="text-muted-foreground font-semibold uppercase tracking-wider block mb-1">Vivienda & Entorno</span>
                <p className="font-medium">{app.homeType} {app.yard ? 'con jardín' : 'sin jardín'}</p>
                <p className="text-muted-foreground">{app.hasOtherPets ? 'Tiene otras mascotas actualmente' : 'No tiene mascotas'}</p>
              </div>

              <div className="bg-background p-3.5 rounded-xl border border-foreground/10">
                <span className="text-muted-foreground font-semibold uppercase tracking-wider block mb-1">Experiencia / Motivo</span>
                <p className="font-medium line-clamp-2">{app.experience}</p>
              </div>
            </div>

            {/* Render Custom Dynamic Field Responses */}
            {settings.adoptionFormFields.length > 0 && (
              <div className="p-3.5 rounded-xl bg-secondary/50 border border-foreground/10 text-xs space-y-2">
                <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block">
                  Respuestas a Campos Web Personalizados
                </span>
                <div className="grid gap-3 sm:grid-cols-2">
                        {settings.adoptionFormFields.map((field: any) => {
                    const val = app.customResponses?.[field.id] ?? (field.type === 'boolean' ? 'Sí' : 'No especificado')
  return (
                      <div key={field.id} className="flex flex-col">
                        <span className="text-muted-foreground font-medium">{field.label}:</span>
                        <span className="font-semibold text-foreground">
                          {typeof val === 'boolean' ? (val ? 'Sí' : 'No') : String(val)}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Quick Action Buttons for Shelter Manager */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2">
                <a
                  href={`mailto:${app.applicantEmail}?subject=Solicitud de adopción para ${app.petName}`}
                  className="text-xs px-3.5 py-2 rounded-xl bg-secondary hover:bg-secondary/80 font-medium transition"
                >
                  Enviar Correo
                </a>
                <a
                  href={`tel:${app.applicantPhone}`}
                  className="text-xs px-3.5 py-2 rounded-xl bg-secondary hover:bg-secondary/80 font-medium transition"
                >
                  Llamar
                </a>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleRequestAppStatusChange(app.id, 'En revisión', app.applicantName, app.petName)}
                  className={`text-xs px-3 py-1.5 rounded-xl border border-foreground/15 font-medium hover:bg-secondary transition ${app.status === 'En revisión' ? 'bg-blue-50 text-blue-700 border-blue-300' : ''}`}
                >
                  Marcar En Revisión
                </button>

                <button
                   onClick={() => handleRequestApproveApplication(app)}
                  className="text-xs px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition flex items-center gap-1"
                >
                  <Icons.Check className="size-3.5" /> Aprobar
                </button>

                {app.status === 'Aprobada' && (
                  <button
                    onClick={() => handleStartFollowUpFromApplication()}
                    className="text-xs px-3.5 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-medium transition flex items-center gap-1"
                  >
                    <Icons.HeartHandshake className="size-3.5" /> Seguimiento
                  </button>
                )}

                <button
                  onClick={() => handleRequestAppStatusChange(app.id, 'Rechazada', app.applicantName, app.petName)}
                  className="text-xs px-3 py-1.5 rounded-xl bg-rose-100 text-rose-700 hover:bg-rose-200 font-medium transition flex items-center gap-1"
                >
                  <Icons.XCircle className="size-3.5" /> Rechazar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Pagination page={page} totalItems={filteredAppsList.length} pageSize={6} onPageChange={setPage} />
    </div>
  )}
  </>)
}
