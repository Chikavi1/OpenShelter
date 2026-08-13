'use client'

import { ArrowLeft, PawPrint } from 'lucide-react'

const sections = [
  {
    title: 'Proceso de adopción',
    body: 'La adopción es un compromiso de por vida. Solicitamos información verídica sobre tu hogar y estilo de vida para asegurar un match adecuado. Nuestro equipo se reserva el derecho de aprobar o rechazar una solicitud en beneficio del bienestar del animal.',
  },
  {
    title: 'Responsabilidades del adoptante',
    body: 'Al adoptar te comprometes a brindar alimento, atención veterinaria, espacio y cariño al animal. Deberás notificarnos cualquier cambio importante en tu situación que pueda afectar su bienestar y permitir visitas de seguimiento.',
  },
  {
    title: 'Donativos',
    body: 'Los donativos son aportaciones voluntarias sin fines de lucro que se destinan al rescate y manutención de los animales. No son reembolsables, salvo errores de cargo debidamente comprobados.',
  },
  {
    title: 'Uso del sitio',
    body: 'El contenido de este sitio es informativo. Queda prohibido el uso de imágenes, textos o datos para fines comerciales sin autorización escrita de nuestra organización.',
  },
  {
    title: 'Límites de responsabilidad',
    body: 'Publicamos la información de las mascotas de buena fe. No garantizamos que cada animal esté disponible al momento de tu consulta y nos reservamos el derecho de modificar el catálogo sin previo aviso.',
  },
  {
    title: 'Modificaciones',
    body: 'Podemos actualizar estos términos en cualquier momento. Los cambios serán publicados en esta página y entrarán en vigor al momento de su publicación. El uso continuado del sitio implica su aceptación.',
  },
]

export default function TerminosPage() {
  const appName = process.env.NEXT_PUBLIC_APP_NAME || 'Huellas'
  const capitalizedAppName = appName.charAt(0).toUpperCase() + appName.slice(1)
  const logoUrl = process.env.NEXT_PUBLIC_LOGO_URL

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <header className="flex items-center justify-between border-b border-foreground/10 py-5">
          <a href="/" className="flex items-center gap-2 font-semibold tracking-tight">{logoUrl ? <img src={logoUrl} alt={appName} className="size-8 rounded-full object-cover" /> : <span className="grid size-8 place-items-center rounded-full bg-primary text-primary-foreground"><PawPrint className="size-4" /></span>} {appName.toLowerCase()}</a>
          <a href="/" className="flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"><ArrowLeft className="size-4" /> Volver al inicio</a>
        </header>

        <section className="mx-auto max-w-3xl py-14 lg:py-20">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Términos</p>
          <h1 className="text-4xl font-semibold tracking-[-0.05em] sm:text-6xl">Términos y condiciones</h1>
          <p className="mt-4 text-sm text-muted-foreground">Última actualización: {new Date().toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          <p className="mt-8 max-w-2xl leading-8 text-muted-foreground">Estos términos regulan el uso del sitio de {capitalizedAppName} y los servicios de adopción y donación. Al navegar o participar, aceptas las condiciones descritas a continuación.</p>
          <div className="mt-12 grid gap-8">{sections.map((section, index) => <section key={section.title}><h2 className="flex items-center gap-3 text-xl font-semibold"><span className="grid size-8 place-items-center rounded-full bg-accent text-sm text-accent-foreground">{index + 1}</span>{section.title}</h2><p className="mt-4 leading-7 text-muted-foreground">{section.body}</p></section>)}</div>
          <div className="mt-14 rounded-3xl border border-foreground/10 bg-card p-6"><p className="text-sm font-medium">Dudas sobre estos términos</p><p className="mt-1 text-sm text-muted-foreground">Contáctanos en <a href="mailto:contacto@huellas.org" className="text-foreground underline decoration-accent decoration-2 underline-offset-2">contacto@huellas.org</a>.</p></div>
        </section>

        <footer className="flex flex-col justify-between gap-5 border-t border-foreground/10 py-10 text-sm text-muted-foreground sm:flex-row sm:items-center"><p className="font-semibold text-foreground">{appName.toLowerCase()}.</p><p>Hecho con amor para quienes no tienen voz.</p><a href="/" className="hover:text-foreground">Volver al inicio</a></footer>
      </div>
    </main>
  )
}
