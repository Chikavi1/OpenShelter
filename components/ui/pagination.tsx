'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
  page: number
  totalItems: number
  pageSize: number
  onPageChange: (page: number) => void
}

export function Pagination({ page, totalItems, pageSize, onPageChange }: PaginationProps) {
  const totalPages = Math.ceil(totalItems / pageSize)
  if (totalPages <= 1) return null

  return (
    <nav aria-label="Paginación" className="flex items-center justify-between gap-4 border-t border-foreground/10 pt-4">
      <span className="text-xs text-muted-foreground">
        Página {page} de {totalPages} · {totalItems} registros
      </span>
      <div className="flex items-center gap-2">
        <button type="button" onClick={() => onPageChange(page - 1)} disabled={page === 1} className="grid size-9 place-items-center rounded-xl border border-foreground/15 bg-card transition hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-40" aria-label="Página anterior">
          <ChevronLeft className="size-4" />
        </button>
        <button type="button" onClick={() => onPageChange(page + 1)} disabled={page === totalPages} className="grid size-9 place-items-center rounded-xl border border-foreground/15 bg-card transition hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-40" aria-label="Página siguiente">
          <ChevronRight className="size-4" />
        </button>
      </div>
    </nav>
  )
}
