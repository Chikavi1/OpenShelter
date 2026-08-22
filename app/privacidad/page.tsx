'use client'

import { ArrowLeft, PawPrint } from 'lucide-react'

const sections = [
  {
    title: 'Información que recopilamos',
    body: 'Recopilamos únicamente la información necesaria para el proceso de adopción y donación: nombre, correo electrónico, tipo de vivienda y datos de contacto. Cuando realizas un donativo, el pago se procesa a través de proveedores seguros y no almacenamos datos bancarios.',
  },
  {
    title: 'Uso de la información',
    body: 'Usamos tu información para contactarte sobre el proceso de adopción, enviarte tu comprobante de donativo y, si lo autorizas, compartir historias de impacto. Nunca vendemos ni alquilamos tus datos a terceros.',
  },
  {
    title: 'Compartición de datos',
    body: 'Solo compartimos tu información con proveedores de pago y servicios de correo estrictamente necesarios para brindarte el servicio. Toda transferencia se realiza con los más altos estándares de seguridad.',
  },
  {
    title: 'Seguridad',
    body: 'Protegemos tu información con medidas técnicas y organizativas adecuadas. Los pagos se procesan en entornos cifrados (SSL/TLS) y nuestra plataforma es auditada de forma periódica.',
  },
  {
    title: 'Tus derechos',
    body: 'Puedes solicitar el acceso, corrección o eliminación de tus datos personales en cualquier momento a través de la sección de contacto. También puedes revocar tu consentimiento para el envío de comunicaciones.',
  },
  {
    title: 'Cookies',
    body: 'Utilizamos cookies esenciales para el funcionamiento del sitio y, con tu consentimiento, herramientas de analítica que nos ayudan a mejorar la experiencia sin identificar personalmente a los usuarios.',
  },
]

export default function PrivacidadPage() {
  const appName = process.env.NEXT_PUBLIC_APP_NAME || ''
  const logoUrl = process.env.NEXT_PUBLIC_LOGO_URL

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <header className="flex items-center justify-between border-b border-foreground/10 py-5">
          <a href="/" className="flex items-center gap-2 font-semibold tracking-tight">{logoUrl ? <img src={logoUrl} alt={appName} className="size-8 rounded-full object-cover" /> : <span className="grid size-8 place-items-center rounded-full bg-primary text-primary-foreground"><PawPrint className="size-4" /></span>} {appName.toLowerCase()}</a>
          <a href="/" className="flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"><ArrowLeft className="size-4" /> Volver al inicio</a>
        </header>

        <section className="mx-auto max-w-3xl py-14 lg:py-20">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Privacidad</p>
          <h1 className="text-4xl font-semibold tracking-[-0.05em] sm:text-6xl">Política de privacidad</h1>
          <p className="mt-4 text-sm text-muted-foreground">Última actualización: {new Date().toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          <p className="mt-8 max-w-2xl leading-8 text-muted-foreground">Nos tomamos la privacidad tan en serio como el bienestar de cada mascota. Esta política explica qué información recopilamos, cómo la usamos y los derechos que tienes sobre ella.</p>
          <div className="mt-12 grid gap-8">{sections.map((section, index) => <section key={section.title}><h2 className="flex items-center gap-3 text-xl font-semibold"><span className="grid size-8 place-items-center rounded-full bg-accent text-sm text-accent-foreground">{index + 1}</span>{section.title}</h2><p className="mt-4 leading-7 text-muted-foreground">{section.body}</p></section>)}</div>
          <div className="mt-14 rounded-3xl border border-foreground/10 bg-card p-6"><p className="text-sm font-medium">¿Tienes preguntas sobre tu privacidad?</p><p className="mt-1 text-sm text-muted-foreground">Usa la sección de contacto del sitio y con gusto te ayudamos.</p></div>
        </section>

        <footer className="flex flex-col justify-between gap-5 border-t border-foreground/10 py-10 text-sm text-muted-foreground sm:flex-row sm:items-center"><p className="font-semibold text-foreground">{appName.toLowerCase()}.</p><p>Hecho con amor para quienes no tienen voz.</p><a href="/" className="hover:text-foreground">Volver al inicio</a></footer>
      </div>
    </main>
  )
}
