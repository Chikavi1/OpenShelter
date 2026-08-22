'use client'

import * as Icons from 'lucide-react'
import { useDashboardContext } from '@/components/dashboard/dashboard-context'
import { Pagination } from '@/components/ui/pagination'
import { useState } from 'react'

export function DashboardFosterHomesTab() {
  const [page, setPage] = useState(1)
  const { activeTab, searchTerm, setSearchTerm, fosterFilterStatus, setFosterFilterStatus, filteredFosterList, handleUpdateFosterStatus, handleDeleteFoster, setShowAddFosterModal } = useDashboardContext()

  return (<>
  {/* FOSTER HOMES TAB */}
  {activeTab === 'foster-homes' && (
    <div className="space-y-6">
      {/* Filter & Actions Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-card border border-foreground/10 p-4 rounded-2xl">
        <div className="relative flex-1">
          <Icons.Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar casa puente por nombre o ciudad..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-foreground/15 bg-background outline-none focus:border-foreground"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground font-medium">Estado del Hogar:</span>
          <select
            value={fosterFilterStatus}
            onChange={(e) => setFosterFilterStatus(e.target.value)}
            className="text-xs py-2 px-3 rounded-xl border border-foreground/15 bg-background outline-none font-medium"
          >
            <option value="Todos">Todos</option>
            <option value="Disponible">Disponible</option>
            <option value="Activa">Activa (Con Mascota)</option>
            <option value="En pausa">En pausa</option>
          </select>
        </div>
      </div>

      {/* Foster Homes Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredFosterList.slice((page - 1) * 6, page * 6).map((foster: any) => (
          <div
            key={foster.id}
            className="rounded-2xl border border-foreground/10 bg-card p-5 shadow-xs flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary font-bold">
                    <Icons.Home className="size-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base">{foster.name}</h3>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Icons.MapPin className="size-3" /> {foster.city} · {foster.homeType}
                    </p>
                  </div>
                </div>
                <span
                  className={`text-[11px] px-2.5 py-0.5 rounded-full font-semibold ${
                    foster.status === 'Disponible'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : foster.status === 'Activa'
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                  }`}
                >
                  {foster.status}
                </span>
              </div>

              <div className="mt-4 space-y-2 text-xs">
                <div className="flex items-center justify-between p-2 rounded-lg bg-background">
                  <span className="text-muted-foreground font-medium">Especie preferida:</span>
                  <span className="font-semibold">{foster.preferredSpecies}</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-background">
                  <span className="text-muted-foreground font-medium">Capacidad máxima:</span>
                  <span className="font-semibold">{foster.maxCapacity} animal(es)</span>
                </div>

                {foster.currentFosteredPet && (
                  <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-medium">
                    <span>Mascota actual:</span>
                    <strong>{foster.currentFosteredPet}</strong>
                  </div>
                )}

                <p className="text-muted-foreground pt-1 line-clamp-2 leading-relaxed">
                  {foster.notes}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-foreground/10 flex items-center justify-between gap-2">
              <div className="flex items-center gap-1">
                <a
                  href={`tel:${foster.phone}`}
                  className="text-xs p-2 rounded-lg bg-secondary hover:bg-secondary/80 text-foreground"
                  title="Llamar"
                >
                  <Icons.Phone className="size-3.5" />
                </a>
                <a
                  href={`mailto:${foster.email}`}
                  className="text-xs p-2 rounded-lg bg-secondary hover:bg-secondary/80 text-foreground"
                  title="Enviar Correo"
                >
                  <Icons.Mail className="size-3.5" />
                </a>
                <button
                  onClick={() => handleDeleteFoster(foster.id, foster.name)}
                  className="text-xs p-2 rounded-lg hover:bg-rose-50 text-rose-600 transition"
                  title="Eliminar registro"
                >
                  <Icons.Trash2 className="size-3.5" />
                </button>
              </div>

              <select
                value={foster.status}
                          onChange={(e) => handleUpdateFosterStatus(foster.id, e.target.value)}
                className="text-xs font-medium py-1 px-2.5 rounded-lg border border-foreground/15 bg-background outline-none"
              >
                <option value="Disponible">Disponible</option>
                <option value="Activa">Activa</option>
                <option value="En pausa">En pausa</option>
              </select>
            </div>
          </div>
        ))}
      </div>
      <Pagination page={page} totalItems={filteredFosterList.length} pageSize={6} onPageChange={setPage} />
    </div>
  )}
  </>)
}
