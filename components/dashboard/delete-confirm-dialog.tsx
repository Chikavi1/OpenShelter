'use client'

import { AlertTriangle, Trash2, X, Check, Eye } from 'lucide-react'

type Variant = 'danger' | 'info' | 'success'

const variantStyles: Record<Variant, { iconBg: string; iconColor: string; button: string }> = {
  danger: { iconBg: 'bg-rose-100', iconColor: 'text-rose-600', button: 'bg-rose-600 hover:bg-rose-700' },
  info: { iconBg: 'bg-blue-100', iconColor: 'text-blue-600', button: 'bg-blue-600 hover:bg-blue-700' },
  success: { iconBg: 'bg-emerald-100', iconColor: 'text-emerald-600', button: 'bg-emerald-600 hover:bg-emerald-700' },
}

const variantIcon: Record<Variant, typeof AlertTriangle> = {
  danger: AlertTriangle,
  info: Eye,
  success: Check,
}

export function DeleteConfirmDialog({
  petName,
  title,
  description,
  cancelLabel = 'Cancelar',
  confirmLabel = 'Eliminar definitivamente',
  variant = 'danger',
  onCancel,
  onConfirm,
}: {
  petName?: string
  title?: string
  description?: string
  cancelLabel?: string
  confirmLabel?: string
  variant?: Variant
  onCancel: () => void
  onConfirm: () => void
}) {
  const resolvedTitle = title ?? (petName ? `¿Eliminar a ${petName}?` : '¿Eliminar?')
  const resolvedDescription = description ?? (petName ? 'Se eliminará su perfil, fotos y datos del catálogo. Esta acción no se puede deshacer.' : 'Esta acción no se puede deshacer.')
  const resolvedCancel = petName && !title ? 'Conservar perfil' : cancelLabel
  const styles = variantStyles[variant]
  const Icon = variantIcon[variant]
  const ConfirmIcon = variant === 'danger' ? Trash2 : variant === 'info' ? Eye : Check
  return <div className="fixed inset-0 z-[70] grid place-items-center bg-foreground/30 p-4 backdrop-blur-sm"><div role="dialog" aria-modal="true" aria-labelledby="delete-dialog-title" className="w-full max-w-md rounded-3xl border border-foreground/10 bg-card p-6 shadow-2xl sm:p-7"><div className="flex items-start justify-between gap-4"><span className={`grid size-12 place-items-center rounded-2xl ${styles.iconBg} ${styles.iconColor}`}><Icon className="size-6" /></span><button type="button" onClick={onCancel} aria-label="Cerrar" className="rounded-xl p-2 text-muted-foreground transition hover:bg-secondary hover:text-foreground"><X className="size-5" /></button></div><h2 id="delete-dialog-title" className="mt-5 text-xl font-semibold">{resolvedTitle}</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">{resolvedDescription}</p><div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end"><button type="button" onClick={onCancel} className="rounded-full border border-foreground/15 px-5 py-2.5 text-sm font-medium transition hover:bg-secondary">{resolvedCancel}</button><button type="button" onClick={onConfirm} className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white transition ${styles.button}`}><ConfirmIcon className="size-4" /> {confirmLabel}</button></div></div></div>
}
