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

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {thanksList.slice((page - 1) * 6, page * 6).map((thank: any) => (
          <div
            key={thank.id}
            className="group flex min-h-[286px] flex-col justify-between overflow-hidden rounded-3xl border border-foreground/10 bg-card shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="size-12 shrink-0 overflow-hidden rounded-2xl bg-secondary ring-4 ring-secondary/50">
                    <img src={thank.avatarUrl} alt={thank.name} className="size-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-bold text-foreground">{thank.name}</h3>
                    <span className="mt-1 block text-[11px] font-semibold text-primary">{thank.role}</span>
                  </div>
                </div>
                <span className="shrink-0 text-[10px] text-muted-foreground">{thank.date}</span>
              </div>

              <div className="mt-5 rounded-2xl bg-secondary/60 p-3.5">
                <span className="block text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">Aportación</span>
                <p className="mt-1 text-xs font-semibold text-foreground">{thank.amountOrContribution || 'Sin donativo especificado'}</p>
              </div>

              <p className="mt-5 line-clamp-3 text-sm leading-6 text-muted-foreground">
                “{thank.message}”
              </p>
            </div>

            <div className="flex items-center justify-between border-t border-foreground/10 bg-background/40 px-5 py-3.5">
              <label className="flex cursor-pointer items-center gap-2 text-xs font-medium">
                <input
                  type="checkbox"
                  checked={thank.isPublic}
                  onChange={() => handleToggleThankPublic(thank.id)}
                  className="rounded border-foreground/20 text-primary focus:ring-primary size-3.5"
                />
                {thank.isPublic ? (
                  <span className="text-emerald-600 font-semibold">Público en Web</span>
                ) : (
                  <span className="text-muted-foreground">Privado</span>
                )}
              </label>

              <button
                onClick={() => handleDeleteThank(thank.id)}
                className="rounded-lg p-2 text-rose-600 opacity-70 transition hover:bg-rose-50 hover:opacity-100"
                title="Eliminar"
              >
                <Icons.Trash2 className="size-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
      <Pagination page={page} totalItems={thanksList.length} pageSize={6} onPageChange={setPage} />
    </div>
  )}
  </>)
}
