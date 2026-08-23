'use client'

import { Check, PawPrint, Trash2 } from 'lucide-react'

export interface PetFormValue {
  name: string
  species: 'Perro' | 'Gato' | 'Otro'
  breed: string
  age: string
  gender: 'Macho' | 'Hembra'
  size: 'Pequeño' | 'Mediano' | 'Grande'
  location: string
  image: string
  images: string[]
  story: string
  healthInput: string
  personalityInput: string
}

interface PetFormProps {
  value: PetFormValue
  editingName?: string
  success: boolean
  onChange: (value: PetFormValue) => void
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
  onCancel: () => void
  onUploadImages: (files: FileList | null) => void
}

const inputClass = 'rounded-xl border border-foreground/15 bg-background px-4 py-2.5 text-sm font-normal outline-none focus:border-foreground'

export function PetForm({ value, editingName, success, onChange, onSubmit, onCancel, onUploadImages }: PetFormProps) {
  if (success) {
    return <div className="space-y-4 rounded-2xl border border-foreground/10 bg-card p-8 text-center shadow-sm">
      <div className="mx-auto grid size-16 place-items-center rounded-full bg-emerald-500 text-white"><Check className="size-8" /></div>
      <h2 className="text-2xl font-bold">{editingName ? '¡Perfil actualizado con éxito!' : '¡Mascota registrada exitosamente!'}</h2>
      <p className="mx-auto max-w-md text-sm text-muted-foreground">Los cambios han sido guardados en el catálogo y están visibles para los adoptantes.</p>
    </div>
  }

  const update = (changes: Partial<PetFormValue>) => onChange({ ...value, ...changes })
  return <form onSubmit={onSubmit} className="space-y-6 rounded-2xl border border-foreground/10 bg-card p-6 shadow-xs sm:p-8">
    <div className="flex items-center justify-between border-b border-foreground/10 pb-3">
      <h2 className="flex items-center gap-2 text-lg font-bold"><PawPrint className="size-5 text-primary" />{editingName ? 'Editar Ficha: ' + editingName : 'Datos del Rescatado'}</h2>
      {editingName && <button type="button" onClick={onCancel} className="text-xs font-semibold text-muted-foreground hover:text-foreground">Cancelar Edición</button>}
    </div>
    <div className="grid gap-5 sm:grid-cols-2">
      <Field label="Nombre de la Mascota *" value={value.name} required onChange={(name) => update({ name })} placeholder="Ej. Toby, Canela..." />
      <SelectField label="Especie *" value={value.species} onChange={(species) => update({ species: species as PetFormValue['species'] })} options={['Perro', 'Gato', 'Otro']} />
    </div>
    <div className="grid gap-5 sm:grid-cols-3">
      <Field label="Raza / Mezcla" value={value.breed} onChange={(breed) => update({ breed })} placeholder="Ej. Mestizo, Criollo" />
      <Field label="Edad estimada" value={value.age} onChange={(age) => update({ age })} placeholder="Ej. 1 año, 6 meses" />
      <SelectField label="Género" value={value.gender} onChange={(gender) => update({ gender: gender as PetFormValue['gender'] })} options={['Macho', 'Hembra']} />
    </div>
    <div className="grid gap-5 sm:grid-cols-2">
      <SelectField label="Tamaño" value={value.size} onChange={(size) => update({ size: size as PetFormValue['size'] })} options={['Pequeño', 'Mediano', 'Grande']} />
      <Field label="Ubicación / Refugio" value={value.location} onChange={(location) => update({ location })} placeholder="Ej. CDMX Refugio Central" />
    </div>
    <label className="grid gap-2 text-xs font-semibold uppercase tracking-wider">Fotografías de la mascota
      <input type="file" accept="image/png,image/jpeg,image/webp" multiple onChange={(event) => onUploadImages(event.target.files)} className={inputClass + ' file:mr-3 file:rounded-lg file:border-0 file:bg-secondary file:px-3 file:py-1.5 file:text-xs file:font-semibold'} />
      <span className="normal-case tracking-normal text-muted-foreground">Puedes seleccionar varias. La primera será la imagen principal.</span>
      {value.images.length > 0 && <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{value.images.map((image, index) => <div key={`${image}-${index}`} className="group relative overflow-hidden rounded-xl"><img src={image} alt={`Foto ${index + 1} de la mascota`} className="aspect-square w-full object-cover" /><button type="button" onClick={() => { const images = value.images.filter((_, imageIndex) => imageIndex !== index); update({ images, image: value.image === image ? images[0] || '' : value.image }) }} className="absolute right-2 top-2 grid size-8 place-items-center rounded-full bg-rose-600 text-white opacity-100 shadow-sm transition hover:bg-rose-700 sm:opacity-0 sm:group-hover:opacity-100" title="Eliminar foto"><Trash2 className="size-3.5" /></button></div>)}</div>}
    </label>
    <div className="grid gap-5 sm:grid-cols-2">
      <Field label="Salud (separado por comas)" value={value.healthInput} onChange={(healthInput) => update({ healthInput })} placeholder="Vacunas al día, Esterilizado" />
      <Field label="Personalidad (separado por comas)" value={value.personalityInput} onChange={(personalityInput) => update({ personalityInput })} placeholder="Cariñoso, Juguetón, Noble" />
    </div>
    <label className="grid gap-2 text-xs font-semibold uppercase tracking-wider">Historia / Descripción
      <textarea rows={4} value={value.story} onChange={(event) => update({ story: event.target.value })} placeholder="Escribe detalles del rescate y temperamento..." className={inputClass + ' resize-none'} />
    </label>
    <div className="flex justify-end border-t border-foreground/10 pt-4"><button type="submit" className="rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground">Guardar Mascota</button></div>
  </form>
}

function SelectField({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return <label className="grid gap-2 text-xs font-semibold uppercase tracking-wider">{label}<select value={value} onChange={(event) => onChange(event.target.value)} className={inputClass}>{options.map((option) => <option key={option}>{option}</option>)}</select></label>
}

function Field({ label, value, onChange, placeholder, required = false }: { label: string; value: string; onChange: (value: string) => void; placeholder: string; required?: boolean }) {
  return <label className="grid gap-2 text-xs font-semibold uppercase tracking-wider">{label}<input required={required} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className={inputClass} /></label>
}
