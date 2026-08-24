'use client'

import { useState } from 'react'
import { ArrowRight, Check, ChevronLeft, ChevronRight, ShieldCheck } from 'lucide-react'
import type { DashboardPet } from '@/lib/dashboard-defaults'
import { VaccinationHistory } from '@/components/vaccination-history'
import { PhoneInput } from '@/components/forms/phone-input'
import { ShareButtons } from '@/components/public/share-buttons'

interface PetProfileSectionsProps {
  pet: DashboardPet
  appName: string
}

export function PetProfileSections({ pet, appName }: PetProfileSectionsProps) {
  const photos = Array.from(new Set((pet.images?.length ? pet.images : [pet.image]).filter(Boolean)))
  const petName = capitalizeName(pet.name)
  const companionWord = pet.gender === 'Hembra' ? 'amiga' : 'amigo'
  const [activePhoto, setActivePhoto] = useState(0)
  const [sent, setSent] = useState(false)

  const submitApplication = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const response = await fetch('/api/public/adoption', {
      method: 'POST',
      body: (() => {
        form.append('applicantName', String(form.get('name') ?? '').trim())
        form.append('applicantEmail', String(form.get('email') ?? '').trim())
        form.append('applicantPhone', String(form.get('phone') ?? '').trim())
        form.append('applicantAddress', String(form.get('address') ?? '').trim())
        form.append('applicantCity', String(form.get('city') ?? '').trim())
        form.append('petName', petName)
        form.append('petId', pet.id)
        form.append('petImage', pet.image)
        form.append('homeType', 'Casa')
        form.append('hasOtherPets', 'false')
        form.append('yard', 'false')
        form.append('experience', String(form.get('why') ?? '').trim())
        form.append('customResponses', JSON.stringify({ city: form.get('city'), job: form.get('job'), home: form.get('home'), why: form.get('why') }))
        return form
      })(),
    })
    if (response.ok) setSent(true)
  }

  const isAdopted = pet.status === 'Adoptado'

  return (
    <>
      {isAdopted && (
        <div className="mt-6 rounded-2xl bg-green-800 px-4 py-4 text-center text-sm font-semibold text-white shadow-sm sm:mt-8 sm:px-6">
          🎉 ¡Esta mascota ya fue adoptada! Gracias por ayudar a cambiar su vida. Conoce a otros rescatados que aún buscan hogar.
        </div>
      )}
      <section className="grid gap-8 py-10 lg:grid-cols-[1.4fr_0.85fr] lg:items-start lg:gap-10 lg:py-16">
        <div className="lg:sticky lg:top-6">
          <div className="relative overflow-hidden rounded-[2rem] bg-zinc-900">
            <img src={photos[activePhoto] || pet.image} alt={petName + (isAdopted ? ' - ya adoptado' : ' en adopción')} className={`h-auto max-h-[78vh] min-h-[460px] w-full object-contain object-center lg:min-h-[620px] ${isAdopted ? 'opacity-90' : ''}`} />
            {photos.length > 1 && (
              <>
                <button
                  type="button"
                  aria-label="Imagen anterior"
                  onClick={() => setActivePhoto((current) => (current - 1 + photos.length) % photos.length)}
                  className="absolute left-4 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-background/90 shadow-sm backdrop-blur transition hover:scale-105"
                >
                  <ChevronLeft className="size-5" />
                </button>
                <button
                  type="button"
                  aria-label="Siguiente imagen"
                  onClick={() => setActivePhoto((current) => (current + 1) % photos.length)}
                  className="absolute right-4 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-background/90 shadow-sm backdrop-blur transition hover:scale-105"
                >
                  <ChevronRight className="size-5" />
                </button>
              </>
            )}
            <span className={`absolute bottom-5 left-5 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wider ${isAdopted ? 'bg-zinc-900 text-white' : 'bg-accent text-accent-foreground'}`}>{isAdopted ? 'Adoptado · no disponible' : 'Disponible para adopción'}</span>
          </div>
        </div>

        <div className="lg:pt-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Conoce a tu nueva mejor {companionWord}</p>
           <h1 className="mt-4 text-6xl font-semibold tracking-[-0.07em] sm:text-8xl">{petName}</h1>
           <div className="mt-9 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-foreground/10 bg-foreground/10 sm:grid-cols-4">
            <Stat label="Edad" value={pet.age} /><Stat label="Tamaño" value={pet.size} /><Stat label="Sexo" value={pet.gender} /><Stat label="Ubicación" value={pet.location} />
          </div>
          <div className="mt-9 flex flex-wrap gap-2">{pet.personality.slice(0, 4).map((tag) => <span key={tag} className="rounded-full border border-foreground/15 px-4 py-2 text-sm">{tag}</span>)}</div>
          <div className="mt-10 border-t border-foreground/10 pt-8"><h2 className="text-2xl font-semibold">Su historia</h2><p className="mt-3 leading-7 text-muted-foreground">{pet.story}</p></div>
          <div className="mt-8 flex items-center gap-3 text-sm text-muted-foreground"><ShieldCheck className="size-5 text-accent-foreground" /> {pet.health.join(' · ')}</div>
          <div className="mt-6 rounded-2xl border border-foreground/10 bg-card p-4">
            <ShareButtons title={`${petName} | ${appName}`} text={`¡Conoce a ${petName}! En adopción en ${appName}.`} />
          </div>
        </div>
      </section>

      <VaccinationHistory petName={petName} species={pet.species} highlights={pet.health.slice(0, 2)} nextAppointment={undefined} records={[]} />

      <section className="rounded-[2rem] border border-foreground/10 bg-card p-6 sm:p-10">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Requisitos de adopción</p>
        <h2 className="text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">Antes de adoptar a {petName}</h2>
        <ul className="mt-10 grid gap-x-12 gap-y-6 lg:grid-cols-2 lg:gap-x-16">
          {['Ser mayor de 18 años y presentar una identificación oficial vigente', 'Contar con un espacio seguro y adecuado para la mascota', 'Disponer de tiempo, recursos económicos y compromiso', 'Aceptar el seguimiento veterinario', 'Firmar el contrato de adopción', 'Comprometerse a no abandonarla'].map((requirement, index) => (
            <li key={requirement} className="flex items-start gap-4 text-sm leading-6"><span className="grid size-8 shrink-0 place-items-center rounded-full bg-accent text-accent-foreground">{index + 1}</span><span className="pt-0.5">{requirement}</span></li>
          ))}
        </ul>
      </section>

      {isAdopted ? (
        <section className="grid gap-6 rounded-[2rem] bg-primary p-6 text-primary-foreground sm:gap-10 sm:p-10 lg:grid-cols-[0.72fr_1.28fr] lg:p-14">
          <div><p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground/60 sm:mb-4">Final feliz</p><h2 className="max-w-md text-3xl font-semibold tracking-[-0.05em] sm:text-5xl">{petName} ya fue adoptado</h2><p className="mt-4 max-w-sm text-sm leading-6 text-primary-foreground/70 sm:mt-6 sm:text-base sm:leading-7">Esta historia tuvo un final feliz. {petName} ya encontró a su familia para siempre, pero hay muchos rescatados esperando una oportunidad como la suya.</p></div>
          <div className="flex min-h-64 flex-col justify-center rounded-3xl bg-white p-6 text-black shadow-sm sm:min-h-72 sm:p-8">
            <span className="grid size-12 place-items-center rounded-full bg-amber-400 text-black">✓</span>
            <h3 className="mt-5 text-2xl font-semibold text-black sm:text-3xl">¡Adoptado!</h3>
            <p className="mt-3 max-w-sm text-sm leading-7 text-black/70 sm:text-base">No disponible para adopción. Te invitamos a conocer a otros amigos que aún buscan hogar.</p>
            <a href="/catalogo" className="mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90">Ver catálogo <ArrowRight className="size-4" /></a>
          </div>
        </section>
      ) : (
        <section id="formulario" className="grid gap-6 rounded-[2rem] bg-primary p-4 text-primary-foreground sm:gap-10 sm:p-10 lg:grid-cols-[0.72fr_1.28fr] lg:p-14">
          <div><p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground/60 sm:mb-4">Formulario de adopción</p><h2 className="max-w-md text-3xl font-semibold tracking-[-0.05em] sm:text-6xl">¿{petName} es tu match?</h2><p className="mt-4 max-w-sm text-sm leading-6 text-primary-foreground/70 sm:mt-6 sm:text-base sm:leading-7">Cuéntanos sobre ti y tu hogar. El proceso es sencillo, humano y pensado para cuidar a ambas partes.</p></div>
          {sent ? <div className="flex min-h-64 flex-col justify-center rounded-3xl bg-white p-6 text-black shadow-sm sm:min-h-96 sm:p-8"><span className="grid size-12 place-items-center rounded-full bg-primary text-primary-foreground"><Check /></span><h3 className="mt-5 text-2xl font-semibold text-black sm:text-3xl">Solicitud recibida.</h3><p className="mt-3 max-w-sm text-sm leading-7 text-black/70 sm:text-base">Gracias por abrirle la puerta a una nueva historia. Nuestro equipo se pondrá en contacto contigo muy pronto.</p></div> : <AdoptionForm appName={appName} onSubmit={submitApplication} />}
        </section>
      )}
    </>
  )
}

function AdoptionForm({ appName, onSubmit }: { appName: string; onSubmit: (event: React.FormEvent<HTMLFormElement>) => void }) {
  return <form className="grid gap-4 rounded-3xl bg-white p-4 text-black shadow-sm sm:gap-5 sm:p-8" onSubmit={onSubmit}>
    <div className="grid gap-4 sm:grid-cols-2 sm:gap-5"><Field label="Nombre completo" name="name" placeholder="Tu nombre" required /><Field label="Correo electrónico" name="email" placeholder="tu@correo.com" type="email" required /></div>
    <div className="grid gap-4 sm:grid-cols-2 sm:gap-5"><PhoneInput label="Teléfono / WhatsApp" name="phone" placeholder="Número de teléfono" required /><Field label="Ciudad" name="city" placeholder="Tu ciudad" required /></div>
    <Field label="Domicilio completo" name="address" placeholder="Calle, número, colonia" required />
    <Field label="Ocupación" name="job" placeholder="A qué te dedicas" />
    <Field label="Tipo de vivienda y tu hogar" name="home" placeholder="Cuéntanos sobre tu espacio y rutina" required />
    <label className="grid gap-2 text-sm font-medium text-black">¿Por qué quieres adoptar?<textarea required name="why" rows={4} placeholder="Comparte tu motivación" className="min-h-28 rounded-xl border border-black/15 bg-white px-4 py-3 font-normal text-black outline-none placeholder:text-black/40 focus:border-black" /></label>
    <label className="flex items-start gap-3 text-sm leading-5 text-black/70"><input required type="checkbox" className="mt-0.5 size-4 shrink-0 accent-primary" /> <span>Acepto que {appName} me contacte.</span></label>
    <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3.5 text-sm font-medium text-primary-foreground transition hover:opacity-90 sm:py-3">Enviar solicitud <ArrowRight className="size-4" /></button>
  </form>
}

function Stat({ label, value }: { label: string; value: string }) {
  return <div className="bg-card p-4"><p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p><p className="mt-2 font-medium">{value}</p></div>
}

function Field({ label, name, placeholder, type = 'text', required = false }: { label: string; name: string; placeholder: string; type?: string; required?: boolean }) {
  return (
    <label className="grid min-w-0 gap-2 text-sm font-medium text-black">
      {label}
      <input
        required={required}
        type={type}
        name={name}
        placeholder={placeholder}
        className="w-full min-w-0 rounded-xl border border-black/15 bg-white px-4 py-3 font-normal text-black placeholder:text-black/40 outline-none focus:border-black"
      />
    </label>
  )
}

function capitalizeName(name: string) {
  return name.trim().replace(/\S+/g, (word) => word.charAt(0).toLocaleUpperCase('es-MX') + word.slice(1).toLocaleLowerCase('es-MX'))
}
