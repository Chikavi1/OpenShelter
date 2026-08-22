'use client'

import * as Icons from 'lucide-react'
import { useDashboardContext } from '@/components/dashboard/dashboard-context'
import { PhoneInput } from '@/components/forms/phone-input'

export function DashboardFosterModal() {
  const { showAddFosterModal, newFoster, setNewFoster, settings, handleCreateFoster, handleCloseFosterModal } = useDashboardContext()

  return (<>
  {/* MODAL: REGISTRAR CASA PUENTE CON INPUTS DINÁMICOS */}
  {showAddFosterModal && (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-card border border-foreground/10 rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-foreground/10 pb-3">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <Icons.Home className="size-5 text-primary" /> Registrar Nueva Casa Puente
          </h3>
          <button onClick={handleCloseFosterModal} className="text-muted-foreground hover:text-foreground">
            <Icons.X className="size-5" />
          </button>
        </div>

        <form onSubmit={handleCreateFoster} className="space-y-4 text-xs">
          <label className="grid gap-1 font-semibold uppercase tracking-wider">
            Nombre de la Persona / Familia *
            <input
              required
              type="text"
              placeholder="Ej. Dra. Andrea Salgado"
              value={newFoster.name}
              onChange={(e) => setNewFoster({ ...newFoster, name: e.target.value })}
              className="rounded-xl border border-foreground/15 bg-background px-3.5 py-2 text-sm font-normal outline-none"
            />
          </label>

          <div className="grid gap-3 sm:grid-cols-2">
            <PhoneInput
              label="Teléfono / WhatsApp *"
              name="phone"
              placeholder="55 0000 0000"
              required
              value={newFoster.phone}
              onChange={(phone) => setNewFoster({ ...newFoster, phone })}
            />

            <label className="grid gap-1 font-semibold uppercase tracking-wider">
              Correo Electrónico (email) *
              <input
                required
                type="email"
                placeholder="correo@ejemplo.com"
                value={newFoster.email}
                onChange={(e) => setNewFoster({ ...newFoster, email: e.target.value })}
                className="rounded-xl border border-foreground/15 bg-background px-3.5 py-2 text-sm font-normal outline-none"
              />
            </label>
          </div>

          {/* RENDER DYNAMIC CUSTOM FIELDS FOR FOSTER */}
              {settings.fosterFormFields.map((field: any) => (
            <div key={field.id} className="grid gap-1 font-semibold uppercase tracking-wider">
              <span>{field.label} {field.required && '*'}</span>

              {field.type === 'boolean' ? (
                <div className="flex items-center gap-4 py-1">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-normal">
                    <input
                      type="radio"
                      name={field.id}
                      checked={newFoster.customResponses[field.id] === true}
                      onChange={() => setNewFoster({
                        ...newFoster,
                        customResponses: { ...newFoster.customResponses, [field.id]: true }
                      })}
                      className="text-primary"
                    />
                    Sí
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-normal">
                    <input
                      type="radio"
                      name={field.id}
                      checked={newFoster.customResponses[field.id] === false}
                      onChange={() => setNewFoster({
                        ...newFoster,
                        customResponses: { ...newFoster.customResponses, [field.id]: false }
                      })}
                      className="text-primary"
                    />
                    No
                  </label>
                </div>
              ) : field.type === 'select' ? (
                <select
                  required={field.required}
                  value={String(newFoster.customResponses[field.id] || '')}
                  onChange={(e) => setNewFoster({
                    ...newFoster,
                    customResponses: { ...newFoster.customResponses, [field.id]: e.target.value }
                  })}
                  className="rounded-xl border border-foreground/15 bg-background px-3 py-2 text-sm font-normal outline-none"
                >
                  <option value="">Selecciona una opción...</option>
                      {field.options?.map((opt: any, i: number) => (
                    <option key={i} value={opt}>{opt}</option>
                  ))}
                </select>
              ) : field.type === 'textarea' ? (
                <textarea
                  required={field.required}
                  rows={2}
                  placeholder={field.placeholder}
                  value={String(newFoster.customResponses[field.id] || '')}
                  onChange={(e) => setNewFoster({
                    ...newFoster,
                    customResponses: { ...newFoster.customResponses, [field.id]: e.target.value }
                  })}
                  className="rounded-xl border border-foreground/15 bg-background p-3 text-sm font-normal outline-none resize-none"
                />
              ) : (
                <input
                  required={field.required}
                  type={field.type}
                  placeholder={field.placeholder}
                  value={String(newFoster.customResponses[field.id] || '')}
                  onChange={(e) => setNewFoster({
                    ...newFoster,
                    customResponses: { ...newFoster.customResponses, [field.id]: e.target.value }
                  })}
                  className="rounded-xl border border-foreground/15 bg-background px-3.5 py-2 text-sm font-normal outline-none"
                />
              )}
            </div>
          ))}

          <div className="pt-3 flex justify-end gap-2 border-t border-foreground/10">
            <button
              type="button"
              onClick={handleCloseFosterModal}
              className="px-4 py-2 rounded-xl border border-foreground/15 text-muted-foreground hover:bg-secondary font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-primary text-primary-foreground font-semibold"
            >
              Guardar Casa Puente
            </button>
          </div>
        </form>
      </div>
    </div>
  )}
  </>)
}
