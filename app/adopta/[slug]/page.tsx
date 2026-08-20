'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { ArrowLeft, ArrowRight, Check, Heart, PawPrint, ShieldCheck } from 'lucide-react'
import { VaccinationHistory } from '@/components/vaccination-history'
import { usePublicSite } from '@/lib/use-public-site'
import { slugify } from '@/lib/slug'

export default function AdoptionProfilePage() {
  const params = useParams<{ slug?: string }>()
  const site = usePublicSite()
  const [activePhoto, setActivePhoto] = useState(0)
  const [sent, setSent] = useState(false)

  const slug = slugify(params.slug ?? '')
  const pet = site.pets.find((item) => slugify(item.name) === slug)
  const appName = site.settings.name || process.env.NEXT_PUBLIC_APP_NAME || ''
  const logoUrl = site.settings.logoUrl || process.env.NEXT_PUBLIC_LOGO_URL
  const photos = pet ? [pet.image, site.settings.heroBannerUrl || pet.image, pet.image] : []

  if (!pet) {
    return (
      <main className="min-h-screen bg-background text-foreground">
        <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 lg:px-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Mascota no disponible</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] sm:text-6xl">No hay datos cargados todavía</h1>
          <p className="mt-5 text-lg leading-8 text-muted-foreground">Cuando se agregue una mascota en el panel, esta ficha se llenará automáticamente.</p>
          <a href="/catalogo" className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground">Ver catálogo</a>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <header className="flex items-center justify-between border-b border-foreground/10 py-5">
          <a href="/" className="flex items-center gap-2 font-semibold tracking-tight">{logoUrl ? <img src={logoUrl} alt={appName} className="size-8 rounded-full object-cover" /> : <span className="grid size-8 place-items-center rounded-full bg-primary text-primary-foreground"><PawPrint className="size-4" /></span>} {appName.toLowerCase()}</a>
          <a href="/catalogo" className="flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"><ArrowLeft className="size-4" /> Volver al catálogo</a>
        </header>

        <section className="grid gap-8 py-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start lg:gap-16 lg:py-16">
          <div>
            <div className="relative overflow-hidden rounded-[2rem] bg-secondary">
              <img src={photos[activePhoto] || pet.image} alt={`${pet.name} en adopción`} className="aspect-[1.05] w-full object-cover sm:aspect-[1.15]" />
              <button aria-label={`Guardar a ${pet.name}`} className="absolute right-5 top-5 grid size-12 place-items-center rounded-full bg-background/90 backdrop-blur transition hover:scale-105"><Heart className="size-5" /></button>
              <span className="absolute bottom-5 left-5 rounded-full bg-accent px-4 py-2 text-xs font-semibold uppercase tracking-wider text-accent-foreground">Disponible para adopción</span>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3">{photos.map((photo, index) => <button key={photo} onClick={() => setActivePhoto(index)} className={`overflow-hidden rounded-2xl transition ${activePhoto === index ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : 'opacity-65 hover:opacity-100'}`}><img src={photo} alt={`Foto ${index + 1} de ${pet.name}`} className="aspect-square w-full object-cover" /></button>)}</div>
          </div>
          <div className="lg:pt-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Conoce a tu nuevo mejor amigo</p>
            <h1 className="mt-4 text-6xl font-semibold tracking-[-0.07em] sm:text-8xl">{pet.name}</h1>
            <p className="mt-5 max-w-lg text-lg leading-8 text-muted-foreground">{pet.breed} listo para encontrar un hogar que lo quiera para siempre.</p>
            <div className="mt-9 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-foreground/10 bg-foreground/10 sm:grid-cols-4"><Stat label="Edad" value={pet.age} /><Stat label="Tamaño" value={pet.size} /><Stat label="Sexo" value={pet.gender} /><Stat label="Ubicación" value={pet.location} /></div>
            <div className="mt-9 flex flex-wrap gap-2">{pet.personality.slice(0, 4).map((tag) => <span key={tag} className="rounded-full border border-foreground/15 px-4 py-2 text-sm">{tag}</span>)}</div>
            <div className="mt-10 border-t border-foreground/10 pt-8"><h2 className="text-2xl font-semibold">Su historia</h2><p className="mt-3 leading-7 text-muted-foreground">{pet.story}</p></div>
            <div className="mt-8 flex items-center gap-3 text-sm text-muted-foreground"><ShieldCheck className="size-5 text-accent-foreground" /> {pet.health.join(' · ')}</div>
          </div>
        </section>

        <VaccinationHistory petName={pet.name} species={pet.species === 'Gato' ? 'Gato' : 'Perro'} highlights={pet.health.slice(0, 3)} nextAppointment={undefined} records={[]} />

        <section className="rounded-[2rem] border border-foreground/10 bg-card p-6 sm:p-10">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Requisitos de adopción</p>
          <h2 className="text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">Antes de adoptar a {pet.name}</h2>
          <ul className="mt-8 grid gap-5 lg:grid-cols-2 lg:gap-6">{['Ser mayor de 18 años y presentar una identificación oficial vigente', 'Contar con un espacio seguro, amplio y adecuado para la mascota', 'Disponer de tiempo, recursos económicos y compromiso para su cuidado', 'Aceptar el compromiso de esterilización y el seguimiento veterinario', 'Firmar el contrato de adopción y comprometerse a no abandonarlo', 'Permitir una visita de seguimiento durante los primeros meses'].map((requirement, index) => <li key={requirement} className="flex h-full items-start gap-4 rounded-2xl border border-foreground/10 bg-background/70 p-4 text-sm leading-6 shadow-sm sm:p-5"><span className="grid size-8 shrink-0 place-items-center rounded-full bg-accent text-accent-foreground">{index + 1}</span><span className="pt-1">{requirement}</span></li>)}</ul>
        </section>

        <section id="formulario" className="scroll-mt-8 grid gap-10 rounded-[2rem] bg-primary p-6 text-primary-foreground sm:p-10 lg:grid-cols-[0.72fr_1.28fr] lg:p-14">
          <div><p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground/60">Formulario de adopción</p><h2 className="max-w-md text-4xl font-semibold tracking-[-0.05em] sm:text-6xl">¿{pet.name} es tu match?</h2><p className="mt-6 max-w-sm leading-7 text-primary-foreground/70">Cuéntanos sobre ti y tu hogar. El proceso es sencillo, humano y pensado para cuidar a ambas partes.</p><div className="mt-10 flex items-center gap-3 text-sm text-primary-foreground/65"><span className="grid size-8 place-items-center rounded-full bg-accent text-accent-foreground">1</span> Envíanos tu información</div><div className="mt-3 flex items-center gap-3 text-sm text-primary-foreground/65"><span className="grid size-8 place-items-center rounded-full bg-primary-foreground/15">2</span> Conoce a {pet.name}</div></div>
          {sent ? <div className="flex min-h-96 flex-col justify-center rounded-3xl bg-accent p-8 text-accent-foreground"><span className="grid size-12 place-items-center rounded-full bg-primary text-primary-foreground"><Check /></span><h3 className="mt-5 text-3xl font-semibold">Solicitud recibida.</h3><p className="mt-3 max-w-sm leading-7">Gracias por abrirle la puerta a una nueva historia. Nuestro equipo se pondrá en contacto contigo muy pronto.</p><a href="/" className="mt-7 flex w-fit items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground">Ver más rescatados <ArrowRight className="size-4" /></a></div> : <form className="grid gap-5 rounded-3xl bg-primary-foreground p-6 text-foreground sm:p-8" onSubmit={async (event) => { event.preventDefault(); const formData = new FormData(event.currentTarget); const response = await fetch('/api/public/adoption', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ applicantName: String(formData.get('name') ?? '').trim(), applicantEmail: String(formData.get('email') ?? '').trim(), applicantPhone: String(formData.get('phone') ?? '').trim(), petName: pet.name, petId: pet.id, petImage: pet.image, homeType: 'Casa', hasOtherPets: false, yard: false, experience: String(formData.get('why') ?? '').trim(), customResponses: { city: String(formData.get('city') ?? '').trim(), job: String(formData.get('job') ?? '').trim(), home: String(formData.get('home') ?? '').trim(), why: String(formData.get('why') ?? '').trim() } }) }); if (response.ok) { setSent(true) } else { console.error('No se pudo enviar la solicitud de adopción') } }}><div className="grid gap-5 sm:grid-cols-2"><Field label="Nombre completo" name="name" placeholder="Tu nombre" required /><Field label="Correo electrónico" name="email" placeholder="tu@correo.com" type="email" required /></div><Field label="Teléfono" name="phone" placeholder="WhatsApp o teléfono" type="tel" required /><div className="grid gap-5 sm:grid-cols-2"><Field label="Ciudad" name="city" placeholder="Tu ciudad" required /><Field label="Ocupación" name="job" placeholder="A qué te dedicas" /></div><Field label="Cuéntanos sobre tu hogar" name="home" placeholder="Espacio, rutina, si vives con más personas o animales" type="text" required /><label className="grid gap-2 text-sm font-medium">¿Por qué quieres adoptar a {pet.name}?<textarea required name="why" rows={4} placeholder="Comparte tu motivación" className="rounded-xl border border-foreground/15 bg-background px-4 py-3 font-normal outline-none focus:border-foreground" /></label><button className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition hover:scale-[1.01]">Enviar solicitud <ArrowRight className="size-4" /></button></form>}
        </section>

        <footer className="flex flex-col justify-between gap-5 border-t border-foreground/10 py-10 text-sm text-muted-foreground sm:flex-row sm:items-center"><p className="font-semibold text-foreground">{appName.toLowerCase()}.</p><p>Hecho con amor para quienes no tienen voz.</p><a href="/" className="hover:text-foreground">Volver a inicio</a></footer>
      </div>
    </main>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return <div className="bg-card p-4"><p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p><p className="mt-2 font-medium">{value}</p></div>
}

function Field({ label, name, placeholder, type = 'text', required = false }: { label: string; name: string; placeholder: string; type?: string; required?: boolean }) {
  return <label className="grid gap-2 text-sm font-medium">{label}<input required={required} type={type} name={name} placeholder={placeholder} className="rounded-xl border border-foreground/15 bg-background px-4 py-3 font-normal outline-none focus:border-foreground" /></label>
}
