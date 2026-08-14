'use client'

import { useState } from 'react'
import { ArrowLeft, ArrowRight, Check, Heart, PawPrint, ShieldCheck } from 'lucide-react'
import { VaccinationHistory } from '@/components/vaccination-history'

const photos = [
  'https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&w=1200&q=90',
  'https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=700&q=85',
  'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=700&q=85',
]

export default function LunaProfilePage() {
  const [activePhoto, setActivePhoto] = useState(0)
  const [sent, setSent] = useState(false)

  const appName = process.env.NEXT_PUBLIC_APP_NAME || 'Open Shelter'
  const capitalizedAppName = appName.charAt(0).toUpperCase() + appName.slice(1)
  const logoUrl = process.env.NEXT_PUBLIC_LOGO_URL

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <header className="flex items-center justify-between border-b border-foreground/10 py-5">
          <a href="/" className="flex items-center gap-2 font-semibold tracking-tight">{logoUrl ? <img src={logoUrl} alt={appName} className="size-8 rounded-full object-cover" /> : <span className="grid size-8 place-items-center rounded-full bg-primary text-primary-foreground"><PawPrint className="size-4" /></span>} {appName.toLowerCase()}</a>
          <a href="/" className="flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"><ArrowLeft className="size-4" /> Volver al catálogo</a>
        </header>

        <section className="grid gap-8 py-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start lg:gap-16 lg:py-16">
          <div>
            <div className="relative overflow-hidden rounded-[2rem] bg-secondary"><img src={photos[activePhoto]} alt="Luna, gata carey en adopción" className="aspect-[1.05] w-full object-cover sm:aspect-[1.15]" /><button aria-label="Guardar a Luna" className="absolute right-5 top-5 grid size-12 place-items-center rounded-full bg-background/90 backdrop-blur transition hover:scale-105"><Heart className="size-5" /></button><span className="absolute bottom-5 left-5 rounded-full bg-accent px-4 py-2 text-xs font-semibold uppercase tracking-wider text-accent-foreground">Disponible para adopción</span></div>
            <div className="mt-4 grid grid-cols-3 gap-3">{photos.map((photo, index) => <button key={photo} onClick={() => setActivePhoto(index)} className={`overflow-hidden rounded-2xl transition ${activePhoto === index ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : 'opacity-65 hover:opacity-100'}`}><img src={photo} alt={`Foto ${index + 1} de Luna`} className="aspect-square w-full object-cover" /></button>)}</div>
          </div>
          <div className="lg:pt-3"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Conoce a tu nuevo mejor amigo</p><h1 className="mt-4 text-6xl font-semibold tracking-[-0.07em] sm:text-8xl">Luna<span className="text-muted-foreground"></span></h1><p className="mt-5 max-w-lg text-lg leading-8 text-muted-foreground">Una gata carey dulce y tranquila que elige a su persona para ronronear y dormir la siesta.</p><div className="mt-9 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-foreground/10 bg-foreground/10 sm:grid-cols-4"><Stat label="Edad" value="1 año" /><Stat label="Tamaño" value="Pequeño" /><Stat label="Sexo" value="Hembra" /><Stat label="Ubicación" value="CDMX" /></div><div className="mt-9 flex flex-wrap gap-2">{['Mimosota', 'Curiosa', 'Tranquila', 'Convive con gatos'].map((tag) => <span key={tag} className="rounded-full border border-foreground/15 px-4 py-2 text-sm">{tag}</span>)}</div><div className="mt-10 border-t border-foreground/10 pt-8"><h2 className="text-2xl font-semibold">Su historia</h2><p className="mt-3 leading-7 text-muted-foreground">Luna fue rescatada de una colonia en situación vulnerable. Hoy está sana, esterilizada y descubrió que dormir en un sillón calientito es lo mejor que le ha pasado. Es calladita, pero su ronroneo lo dice todo.</p></div><div className="mt-8 flex items-center gap-3 text-sm text-muted-foreground"><ShieldCheck className="size-5 text-accent-foreground" /> Esterilizada, vacunada y con seguimiento veterinario</div></div>
        </section>

        <VaccinationHistory
          petName="Luna"
          species="Gato"
          highlights={['Esterilizada', 'Desparasitada', 'Prueba de Leucemia Felina (FeLV) negativa']}
          nextAppointment="10 de septiembre, 2026"
          records={[
            { vaccine: 'Trivalente Felina (Herpesvirus, Calicivirus, Panleucopenia)', date: 'Enero 2025', clinic: 'Clínica Felina El Ronroneo' },
            { vaccine: 'Rabia', date: 'Febrero 2025', clinic: 'Clínica Felina El Ronroneo' },
            { vaccine: 'Refuerzo Trivalente Felina', date: 'Enero 2026', clinic: 'Clínica Felina El Ronroneo' },
            { vaccine: 'Refuerzo de Rabia', date: 'Febrero 2026', clinic: 'Clínica Felina El Ronroneo' },
          ]}
        />

        <section className="rounded-[2rem] border border-foreground/10 bg-card p-6 sm:p-10">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Requisitos de adopción</p>
          <h2 className="text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">Antes de adoptar a Luna</h2>
          <ul className="mt-8 grid gap-4 lg:grid-cols-2">
            {['Ser mayor de 18 años y presentar una identificación oficial vigente', 'Contar con un espacio seguro y adecuado para una gata pequeña', 'Disponer de tiempo, recursos económicos y compromiso para su cuidado', 'Aceptar el compromiso de esterilización y el seguimiento veterinario', 'Firmar el contrato de adopción y comprometerse a no abandonarla', 'Permitir una visita de seguimiento durante los primeros meses'].map((requirement, index) => <li key={requirement} className="flex items-center gap-3 text-sm"><span className="grid size-8 shrink-0 place-items-center rounded-full bg-accent text-accent-foreground">{index + 1}</span> {requirement}</li>)}
          </ul>
        </section>

        <section id="formulario" className="scroll-mt-8 grid gap-10 rounded-[2rem] bg-primary p-6 text-primary-foreground sm:p-10 lg:grid-cols-[0.72fr_1.28fr] lg:p-14"><div><p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground/60">Formulario de adopción</p><h2 className="max-w-md text-4xl font-semibold tracking-[-0.05em] sm:text-6xl">¿Luna es tu match?</h2><p className="mt-6 max-w-sm leading-7 text-primary-foreground/70">Cuéntanos sobre ti y tu hogar. El proceso es sencillo, humano y pensado para cuidar a ambas partes.</p><div className="mt-10 flex items-center gap-3 text-sm text-primary-foreground/65"><span className="grid size-8 place-items-center rounded-full bg-accent text-accent-foreground">1</span> Envíanos tu información</div><div className="mt-3 flex items-center gap-3 text-sm text-primary-foreground/65"><span className="grid size-8 place-items-center rounded-full bg-primary-foreground/15">2</span> Conoce a Luna</div></div>{sent ? <div className="flex min-h-96 flex-col justify-center rounded-3xl bg-accent p-8 text-accent-foreground"><span className="grid size-12 place-items-center rounded-full bg-primary text-primary-foreground"><Check /></span><h3 className="mt-5 text-3xl font-semibold">Solicitud recibida.</h3><p className="mt-3 max-w-sm leading-7">Gracias por abrirle la puerta a una nueva historia. Nuestro equipo se pondrá en contacto contigo muy pronto.</p><a href="/" className="mt-7 flex w-fit items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground">Ver más rescatados <ArrowRight className="size-4" /></a></div> : <form className="grid gap-5 rounded-3xl bg-primary-foreground p-6 text-foreground sm:p-8" onSubmit={(event) => { event.preventDefault(); setSent(true) }}><div className="grid gap-5 sm:grid-cols-2"><Field label="Nombre completo" name="name" placeholder="Tu nombre" required /><Field label="Correo electrónico" name="email" placeholder="tu@correo.com" type="email" required /></div><div className="grid gap-5 sm:grid-cols-2"><Field label="Teléfono" name="phone" placeholder="55 0000 0000" required /><label className="grid gap-2 text-sm font-medium">Tipo de vivienda<select name="home" className="rounded-xl border border-foreground/15 bg-background px-4 py-3 font-normal outline-none focus:border-foreground"><option>Casa</option><option>Departamento</option><option>Otro</option></select></label></div><label className="grid gap-2 text-sm font-medium">Cuéntanos sobre tu hogar<textarea name="message" required placeholder="¿Con quién viviría Luna? ¿Tienes otras mascotas?" className="min-h-28 resize-y rounded-xl border border-foreground/15 bg-background px-4 py-3 font-normal outline-none focus:border-foreground" /></label><label className="flex items-start gap-3 text-sm text-muted-foreground"><input required type="checkbox" className="mt-1 size-4 accent-primary" /> Acepto que {capitalizedAppName} me contacte para continuar el proceso.</label><button type="submit" className="flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 font-medium text-primary-foreground transition hover:opacity-90">Enviar solicitud <ArrowRight className="size-4" /></button></form>}</section>

        <footer className="flex flex-col justify-between gap-5 border-t border-foreground/10 py-10 text-sm text-muted-foreground sm:flex-row sm:items-center"><p className="font-semibold text-foreground">{appName.toLowerCase()}.</p><p>Hecho con amor para quienes no tienen voz.</p><a href="/" className="hover:text-foreground">Volver a inicio</a></footer>
      </div>
    </main>
  )
}

function Stat({ label, value }: { label: string; value: string }) { return <div className="bg-card p-4"><p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p><p className="mt-2 font-medium">{value}</p></div> }
function Field({ label, name, placeholder, type = 'text', required = false }: { label: string; name: string; placeholder: string; type?: string; required?: boolean }) { return <label className="grid gap-2 text-sm font-medium">{label}<input required={required} type={type} name={name} placeholder={placeholder} className="rounded-xl border border-foreground/15 bg-background px-4 py-3 font-normal outline-none focus:border-foreground" /></label> }