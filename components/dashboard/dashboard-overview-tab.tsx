'use client'

import React, { useState } from 'react'
import * as Icons from 'lucide-react'
import { PetCard } from '@/components/dashboard/pet-card'
import { PetForm } from '@/components/dashboard/pet-form'
import { Pagination } from '@/components/ui/pagination'
import { useDashboardContext } from '@/components/dashboard/dashboard-context'

export function DashboardOverviewTab() {
  const [petsPage, setPetsPage] = useState(1)
  const {
    activeTab, setActiveTab, applications, totalPets, activeFosters, pendingApps,
    adoptedPets, availablePets, inProcessPets, settings, petSearchTerm, setPetSearchTerm,
    filterSpecies, setFilterSpecies, filterStatus, setFilterStatus, handleStartCreatePet,
    filteredPetsList = [], handleStartEditPet, handleDeletePet, handleUpdatePetStatus,
    handleSetFeaturedPet, newPet, editingPet, registerSuccess, setNewPet,
    handleCreateOrUpdatePet, handleCancelEdit, handlePetImagesUpload, followUps, events,
  } = useDashboardContext()

  return (<React.Fragment>
  {activeTab === 'overview' && (
    <div className="space-y-8">
      {/* Quick Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <div className="rounded-2xl border border-foreground/10 bg-card p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total Rescatados</span>
            <div className="grid size-9 place-items-center rounded-xl bg-primary/10 text-primary">
              <Icons.PawPrint className="size-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold tracking-tight">{totalPets}</span>
            <p className="text-xs text-muted-foreground mt-1">En el catálogo activo</p>
          </div>
        </div>

        <div className="rounded-2xl border border-foreground/10 bg-card p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Casas Puente</span>
            <div className="grid size-9 place-items-center rounded-xl bg-primary/10 text-primary">
              <Icons.Home className="size-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold tracking-tight">{activeFosters}</span>
            <p className="text-xs text-muted-foreground mt-1">Hogares temporales listos</p>
          </div>
        </div>

        <div className="rounded-2xl border border-foreground/10 bg-card p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Solicitudes Pendientes</span>
            <div className="grid size-9 place-items-center rounded-xl bg-amber-500/10 text-amber-600">
              <Icons.Clock className="size-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold tracking-tight">{pendingApps}</span>
            <p className="text-xs text-muted-foreground mt-1">Requieren atención o entrevista</p>
          </div>
        </div>

        <div className="rounded-2xl border border-foreground/10 bg-card p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Adopciones Exitosas</span>
            <div className="grid size-9 place-items-center rounded-xl bg-emerald-500/10 text-emerald-600">
              <Icons.CheckCircle2 className="size-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold tracking-tight">{adoptedPets}</span>
            <p className="text-xs text-muted-foreground mt-1">Hogares encontrados</p>
            </div>
          </div>

        <div className="rounded-2xl border border-foreground/10 bg-card p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Seguimientos</span>
            <div className="grid size-9 place-items-center rounded-xl bg-violet-500/10 text-violet-600">
              <Icons.HeartHandshake className="size-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold tracking-tight">{followUps?.length ?? 0}</span>
            <p className="text-xs text-muted-foreground mt-1">Adopciones en seguimiento</p>
          </div>
        </div>

        <div className="rounded-2xl border border-foreground/10 bg-card p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Eventos</span>
            <div className="grid size-9 place-items-center rounded-xl bg-sky-500/10 text-sky-600">
              <Icons.CalendarDays className="size-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold tracking-tight">{events?.length ?? 0}</span>
            <p className="text-xs text-muted-foreground mt-1">Campañas y jornadas activas</p>
          </div>
        </div>
      </div>

      {/* Quick Action & Recent Solicitudes preview grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Applications Section */}
        <div className="lg:col-span-2 rounded-2xl border border-foreground/10 bg-card p-6 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold tracking-tight">Últimas Solicitudes de Adopción</h2>
              <p className="text-xs text-muted-foreground">Personas interesadas en adoptar a un integrante del refugio</p>
            </div>
            <button
              onClick={() => setActiveTab('applications')}
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
            >
              Ver todas <Icons.ChevronRight className="size-3.5" />
            </button>
          </div>

          <div className="space-y-4">
            {applications.slice(0, 3).map((app: any) => (
              <div
                key={app.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-foreground/10 bg-background hover:border-foreground/20 transition-all"
              >
                <div className="flex items-center gap-3.5">
                  <img
                    src={app.petImage}
                    alt={app.petName}
                    className="size-12 rounded-xl object-cover"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-sm">{app.applicantName}</h3>
                      <span className="text-xs text-muted-foreground">para <strong className="text-foreground">{app.petName}</strong></span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {app.homeType} · {app.hasOtherPets ? 'Tiene otras mascotas' : 'Sin otras mascotas'} · {app.dateSubmitted}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-foreground/10">
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-medium ${
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
                  <button
                    onClick={() => setActiveTab('applications')}
                    className="text-xs font-medium px-3 py-1.5 rounded-lg border border-foreground/15 hover:bg-secondary transition"
                  >
                    Revisar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Status Breakdown & Quick Links */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-foreground/10 bg-card p-6 shadow-xs">
            <h2 className="text-lg font-semibold tracking-tight mb-4">Estado del Catálogo</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <span className="size-2.5 rounded-full bg-emerald-500" /> Disponibles
                </span>
                <span className="font-semibold">{availablePets}</span>
              </div>
              <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all"
                  style={{ width: `${(availablePets / (totalPets || 1)) * 100}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-sm pt-2">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <span className="size-2.5 rounded-full bg-amber-500" /> En Proceso
                </span>
                <span className="font-semibold">{inProcessPets}</span>
              </div>
              <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                <div
                  className="bg-amber-500 h-full rounded-full transition-all"
                  style={{ width: `${(inProcessPets / (totalPets || 1)) * 100}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-sm pt-2">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <span className="size-2.5 rounded-full bg-blue-500" /> Adoptados
                </span>
                <span className="font-semibold">{adoptedPets}</span>
              </div>
              <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                <div
                  className="bg-blue-500 h-full rounded-full transition-all"
                  style={{ width: `${(adoptedPets / (totalPets || 1)) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Refugio Card Summary */}
          <div className="rounded-2xl bg-card border border-foreground/10 p-6 shadow-xs">
            <div className="flex items-center gap-3 mb-3">
              <Icons.Building2 className="size-5 text-primary" />
              <h3 className="font-bold text-base">{settings.name}</h3>
            </div>
            <p className="text-xs text-muted-foreground line-clamp-2 mb-4">{settings.description}</p>
            <button
              onClick={() => setActiveTab('settings')}
              className="w-full text-center text-xs font-semibold py-2.5 px-4 rounded-xl border border-foreground/15 hover:bg-secondary transition"
            >
              Editar Inputs Web & Formularios
            </button>
          </div>
        </div>
      </div>
    </div>
  )}

  {/* PETS LIST TAB */}
  {activeTab === 'pets' && (
    <div className="space-y-6">
      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-card border border-foreground/10 p-4 rounded-2xl">
        {/* Search */}
        <div className="relative flex-1">
          <Icons.Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar por nombre o raza..."
            value={petSearchTerm}
            onChange={(e) => setPetSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-foreground/15 bg-background outline-none focus:border-foreground"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground font-medium">Especie:</span>
            <select
              value={filterSpecies}
              onChange={(e) => setFilterSpecies(e.target.value)}
              className="text-xs py-2 px-3 rounded-xl border border-foreground/15 bg-background outline-none font-medium"
            >
              <option value="Todos">Todas</option>
              <option value="Perro">Perros</option>
              <option value="Gato">Gatos</option>
              <option value="Otro">Otros</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground font-medium">Estado:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="text-xs py-2 px-3 rounded-xl border border-foreground/15 bg-background outline-none font-medium"
            >
              <option value="Todos">Todos</option>
              <option value="Disponible">Disponible</option>
              <option value="En Proceso">En Proceso</option>
              <option value="Adoptado">Adoptado</option>
            </select>
          </div>

          <button
            type="button"
            onClick={handleStartCreatePet}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-medium text-primary-foreground transition hover:scale-[1.01]"
          >
            <Icons.Plus className="size-4" />
            Crear mascota
          </button>
        </div>
      </div>

      {/* Pets Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredPetsList.slice((petsPage - 1) * 6, petsPage * 6).map((pet: any) => (
                <PetCard
            key={pet.id}
            pet={pet}
            onEdit={handleStartEditPet}
            onDelete={handleDeletePet}
            onStatusChange={handleUpdatePetStatus}
            onSetFeatured={handleSetFeaturedPet}
          />
        ))}
      </div>
      <Pagination page={petsPage} totalItems={filteredPetsList.length} pageSize={6} onPageChange={setPetsPage} />
    </div>
  )}

  {activeTab === 'register-pet' && (
          <PetForm
      value={newPet}
      editingName={editingPet?.name}
      success={registerSuccess}
      onChange={setNewPet}
      onSubmit={handleCreateOrUpdatePet}
      onCancel={handleCancelEdit}
      onUploadImages={handlePetImagesUpload}
    />
  )}

  </React.Fragment>)
}
