'use client'

import { Gift, X } from 'lucide-react'

export type ThankFormState = {
  name: string
  role: 'Donante' | 'Voluntario' | 'Empresa Aliada' | 'Padrino'
  amountOrContribution: string
  message: string
  avatarUrl: string
  isPublic: boolean
}

interface ThankModalProps {
  value: ThankFormState
  open: boolean
  uploadingImage: boolean
  onChange: (value: ThankFormState) => void
  onUploadImage: (file?: File) => void
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
  onClose: () => void
}

export function ThankModal({
  value,
  open,
  uploadingImage,
  onChange,
  onUploadImage,
  onSubmit,
  onClose,
}: ThankModalProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
      <div className="max-h-[90vh] w-full max-w-lg space-y-4 overflow-y-auto rounded-2xl border border-foreground/10 bg-card p-6 shadow-xl">
        <div className="flex items-center justify-between border-b border-foreground/10 pb-3">
          <h3 className="flex items-center gap-2 text-lg font-bold">
            <Gift className="size-5 text-primary" /> Registrar Agradecimiento
          </h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground" aria-label="Cerrar">
            <X className="size-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4 text-xs">
          <label className="grid gap-1 font-semibold uppercase tracking-wider">
            Nombre del Donante / Aliado *
            <input
              required
              type="text"
              placeholder="Ej. Veterinaria San Antonio, Juan Pérez..."
              value={value.name}
              onChange={(event) => onChange({ ...value, name: event.target.value })}
              className="rounded-xl border border-foreground/15 bg-background px-3.5 py-2 text-sm font-normal outline-none"
            />
          </label>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="grid gap-1 font-semibold uppercase tracking-wider">
              Rol / Categoría
              <select
                value={value.role}
                onChange={(event) => onChange({ ...value, role: event.target.value as ThankFormState['role'] })}
                className="rounded-xl border border-foreground/15 bg-background px-3 py-2 text-sm font-normal outline-none"
              >
                <option value="Donante">Donante</option>
                <option value="Voluntario">Voluntario</option>
                <option value="Empresa Aliada">Empresa Aliada</option>
                <option value="Padrino">Padrino</option>
              </select>
            </label>

            <label className="grid gap-1 font-semibold uppercase tracking-wider">
              Aportación / Donativo (opcional)
              <input
                type="text"
                placeholder="Ej. $2,000 MXN / 50kg Alimento"
                value={value.amountOrContribution}
                onChange={(event) => onChange({ ...value, amountOrContribution: event.target.value })}
                className="rounded-xl border border-foreground/15 bg-background px-3.5 py-2 text-sm font-normal outline-none"
              />
            </label>
          </div>

          <label className="grid gap-1 font-semibold uppercase tracking-wider">
            Mensaje de Reconocimiento
            <textarea
              required
              rows={3}
              placeholder="Escribe unas palabras de agradecimiento..."
              value={value.message}
              onChange={(event) => onChange({ ...value, message: event.target.value })}
              className="resize-none rounded-xl border border-foreground/15 bg-background p-3 text-sm font-normal outline-none"
            />
          </label>

          <label className="grid gap-1 font-semibold uppercase tracking-wider">
            Foto del donante o aliado (opcional)
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={(event) => onUploadImage(event.target.files?.[0])}
              className="rounded-xl border border-foreground/15 bg-background px-3.5 py-2 text-sm font-normal file:mr-3 file:rounded-lg file:border-0 file:bg-secondary file:px-3 file:py-1.5 file:text-xs file:font-semibold"
            />
            {uploadingImage && <span className="normal-case tracking-normal text-muted-foreground">Subiendo foto...</span>}
            {value.avatarUrl && (
              <img src={value.avatarUrl} alt="Vista previa" className="mt-2 size-16 rounded-full border border-foreground/15 object-cover" />
            )}
          </label>

          <div className="flex justify-end gap-2 border-t border-foreground/10 pt-3">
            <button type="button" onClick={onClose} className="rounded-xl border border-foreground/15 px-4 py-2 font-medium text-muted-foreground hover:bg-secondary">
              Cancelar
            </button>
            <button type="submit" className="rounded-xl bg-primary px-5 py-2 font-semibold text-primary-foreground">
              Publicar Agradecimiento
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
