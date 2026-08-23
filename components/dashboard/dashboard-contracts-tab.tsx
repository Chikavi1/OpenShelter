'use client'

import * as Icons from 'lucide-react'
import Link from 'next/link'
import { useDashboardContext } from '@/components/dashboard/dashboard-context'
import type { AdoptionFollowUp } from '@/lib/dashboard-defaults'

export function DashboardContractsTab() {
  const { activeTab, followUps } = useDashboardContext()

  if (activeTab !== 'contracts') return null

  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-foreground/10 bg-card p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Contratos</p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight">Acceso directo a contratos de adopción</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              Aquí tienes todos los contratos vinculados a seguimientos de adopción. Abre cualquiera para imprimir, descargar PDF o revisar el documento completo.
            </p>
          </div>
          <div className="rounded-2xl border border-foreground/10 bg-secondary/50 px-4 py-3 text-right">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Total</p>
            <p className="mt-1 text-2xl font-bold">{followUps.length}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {followUps.map((followUp: AdoptionFollowUp) => (
          <article key={followUp.id} className="rounded-3xl border border-foreground/10 bg-card p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Contrato</p>
                <h3 className="mt-2 text-xl font-semibold">{followUp.petName}</h3>
                <p className="mt-1 text-sm text-muted-foreground">Adoptante: {followUp.adopterName}</p>
              </div>
              <span className="rounded-full border border-foreground/10 px-3 py-1 text-xs font-medium text-muted-foreground">{followUp.processStage}</span>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <Info label="Fecha de adopción" value={followUp.adoptionDate || 'Sin fecha'} />
              <Info label="Siguiente revisión" value={followUp.nextFollowUpDate || 'Sin fecha'} />
            </div>

            <div className="mt-5 flex items-center justify-between gap-4 border-t border-foreground/10 pt-4">
              <Link href={`/contrato/${followUp.id}`} className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90">
                Ver contrato
                <Icons.ArrowRight className="size-4" />
              </Link>
              <span className="text-[11px] text-muted-foreground">ID: {followUp.id}</span>
            </div>
          </article>
        ))}

        {!followUps.length && (
          <div className="rounded-3xl border border-dashed border-foreground/15 p-10 text-center text-sm text-muted-foreground lg:col-span-2">
            No hay contratos todavía. Crea un seguimiento de adopción para generar el acceso.
          </div>
        )}
      </div>
    </section>
  )
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-foreground/10 bg-secondary/30 p-4">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-2 text-sm font-medium text-foreground">{value}</p>
    </div>
  )
}
