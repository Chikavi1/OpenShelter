'use client'

import * as Icons from 'lucide-react'
import { useDashboardContext } from '@/components/dashboard/dashboard-context'
import { Pagination } from '@/components/ui/pagination'
import { useState } from 'react'

export function DashboardThanksTab() {
  const [page, setPage] = useState(1)
  const { activeTab, thanksList, handleToggleThankPublic, handleDeleteThank } = useDashboardContext()

  return (<>
  {/* THANKS TAB */}
  {activeTab === 'thanks' && (
    <div className="space-y-6">
      <div className="bg-card border border-foreground/10 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Icons.Gift className="size-5 text-primary" /> Muro Público de Reconocimiento
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Los agradecimientos marcados como "Públicos" aparecerán automáticamente en la página web pública.
          </p>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {thanksList.slice((page - 1) * 6, page * 6).map((thank: any) => (
          <article
            key={thank.id}
            className="group relative flex min-h-[260px] flex-col overflow-hidden rounded-[28px] border border-foreground/12 bg-card shadow-[0_1px_0_rgba(0,0,0,0.02)] transition duration-300 hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="relative p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="grid size-14 shrink-0 overflow-hidden rounded-2xl border border-foreground/10 bg-background">
                    <img src={thank.avatarUrl} alt={thank.name} className="size-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="truncate text-base font-semibold tracking-tight text-foreground">{thank.name}</h3>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span className="rounded-full border border-foreground/10 px-2.5 py-1 text-[11px] font-medium text-muted-foreground">{thank.role}</span>
                      <span className="rounded-full border border-foreground/10 px-2.5 py-1 text-[11px] font-medium text-muted-foreground">{thank.date}</span>
                    </div>
                  </div>
                </div>

                <span
                  className="shrink-0 rounded-full border border-foreground/10 px-2.5 py-1 text-[11px] font-medium text-muted-foreground"
                >
                  {thank.isPublic ? 'Público' : 'Privado'}
                </span>
              </div>

              <div className="mt-5 border-t border-foreground/10 pt-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Aportación</p>
                <p className="mt-2 text-sm leading-6 text-foreground">
                  {thank.amountOrContribution || 'Sin donativo especificado'}
                </p>
              </div>

              <blockquote className="mt-5 border-l-2 border-foreground/15 pl-4 text-sm italic leading-7 text-muted-foreground">
                {thank.message || 'Sin mensaje registrado.'}
              </blockquote>
            </div>

            <div className="mt-auto flex items-center justify-between border-t border-foreground/10 px-5 py-3.5">
              <label className="flex cursor-pointer items-center gap-2 text-xs font-medium text-muted-foreground">
                <input
                  type="checkbox"
                  checked={thank.isPublic}
                  onChange={() => handleToggleThankPublic(thank.id)}
                  className="size-4 rounded border-foreground/20 text-primary focus:ring-primary"
                />
                Mostrar en web pública
              </label>

              <button
                onClick={() => handleDeleteThank(thank.id, thank.name)}
                className="grid size-9 place-items-center rounded-full text-muted-foreground transition hover:bg-secondary hover:text-foreground"
                title="Eliminar"
              >
                <Icons.Trash2 className="size-4" />
              </button>
            </div>
          </article>
        ))}
      </div>
      <Pagination page={page} totalItems={thanksList.length} pageSize={6} onPageChange={setPage} />
    </div>
  )}
  </>)
}
