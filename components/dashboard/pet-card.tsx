'use client'

import Link from 'next/link'
import { Edit, ExternalLink, Star, Trash2 } from 'lucide-react'
import { slugify } from '@/lib/slug'
import type { DashboardPet } from '@/lib/dashboard-defaults'

interface PetCardProps {
  pet: DashboardPet
  onEdit: (pet: DashboardPet) => void
  onDelete: (id: string, name: string) => void
  onStatusChange: (id: string, status: DashboardPet['status']) => void
  onSetFeatured: (id: string) => void
}

export function PetCard({ pet, onEdit, onDelete, onStatusChange, onSetFeatured }: PetCardProps) {
  const statusClass = pet.status === 'Disponible'
    ? 'bg-emerald-500 text-white'
    : pet.status === 'En Proceso'
      ? 'bg-amber-500 text-white'
      : 'bg-blue-600 text-white'

  return (
    <article className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-foreground/10 bg-card shadow-xs transition-all hover:shadow-md">
      <div>
        <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
          <img src={pet.image} alt={pet.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
          <span className={"absolute left-3 top-3 rounded-full px-3 py-1 text-[11px] font-semibold " + statusClass}>{pet.status}</span>
          <div className="absolute right-3 top-3 flex items-center gap-1.5 rounded-xl bg-black/40 p-1 backdrop-blur-md">
            <Link href={'/adopta/' + slugify(pet.name)} title="Ver en web pública" target="_blank" className="rounded-lg bg-white/20 p-1.5 text-white transition hover:bg-white/40">
              <ExternalLink className="size-3.5" />
            </Link>
            <button onClick={() => onEdit(pet)} title="Editar perfil" className="rounded-lg bg-white/20 p-1.5 text-white transition hover:bg-white/40">
              <Edit className="size-3.5" />
            </button>
            <button onClick={() => onDelete(pet.id, pet.name)} title="Eliminar perfil" className="rounded-lg bg-rose-500/80 p-1.5 text-white transition hover:bg-rose-600">
              <Trash2 className="size-3.5" />
            </button>
          </div>
          {pet.featured && <span className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full bg-accent px-3 py-1 text-[11px] font-semibold text-accent-foreground"><Star className="size-3 fill-current" /> Destacada</span>}
        </div>

        <div className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-xl font-bold">{pet.name}</h3>
              <p className="mt-0.5 text-xs font-medium text-muted-foreground">{pet.species} · {pet.breed} · {pet.age}</p>
            </div>
            <span className="rounded-lg bg-secondary px-2.5 py-1 text-xs font-semibold">{pet.gender}</span>
          </div>
          <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-muted-foreground">{pet.story}</p>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {pet.health.slice(0, 2).map((health) => <span key={health} className="rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">✓ {health}</span>)}
            {pet.personality.slice(0, 2).map((trait) => <span key={trait} className="rounded-md bg-secondary px-2 py-0.5 text-[10px] font-medium text-muted-foreground">• {trait}</span>)}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-foreground/10 bg-background/50 p-4">
        <label className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          Estado:
          <select value={pet.status} onChange={(event) => onStatusChange(pet.id, event.target.value as DashboardPet['status'])} className="cursor-pointer rounded-lg border border-foreground/15 bg-background px-2.5 py-1.5 text-xs font-medium outline-none">
            <option value="Disponible">Disponible</option>
            <option value="En Proceso">En Proceso</option>
            <option value="Adoptado">Adoptado</option>
          </select>
        </label>
        <button onClick={() => onSetFeatured(pet.id)} className={pet.featured ? "flex items-center gap-1 rounded-lg bg-accent px-2.5 py-1.5 text-[11px] font-semibold text-accent-foreground" : "flex items-center gap-1 rounded-lg border border-foreground/15 px-2.5 py-1.5 text-[11px] font-semibold text-muted-foreground transition hover:bg-secondary"} title={pet.featured ? "Mascota destacada" : "Marcar como destacada"}>
          <Star className="size-3" /> {pet.featured ? 'Destacada' : 'Destacar'}
        </button>
      </div>
    </article>
  )
}
