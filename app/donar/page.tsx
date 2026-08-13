'use client'

import { useState } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Copy,
  CreditCard,
  HandCoins,
  Heart,
  Landmark,
  PawPrint,
  QrCode,
  ShieldCheck,
  Wallet,
} from 'lucide-react'

const amounts = [100, 250, 500, 1000]

const bankAccounts = [
  { bank: 'BBVA', clabe: '012 180 015 012 345 678', owner: 'Huellas A.C.', reference: 'Donativo Huellas' },
  { bank: 'Banco Azteca', clabe: '127 180 015 012 345 678', owner: 'Huellas A.C.', reference: 'Donativo Huellas' },
]

export default function DonarPage() {
  const [amount, setAmount] = useState(250)
  const [method, setMethod] = useState<'card' | 'transfer' | 'paypal'>('card')
  const [copied, setCopied] = useState<number | null>(null)
  const [sent, setSent] = useState(false)

  const appName = process.env.NEXT_PUBLIC_APP_NAME || 'Huellas'
  const capitalizedAppName = appName.charAt(0).toUpperCase() + appName.slice(1)
  const logoUrl = process.env.NEXT_PUBLIC_LOGO_URL

  function copyClabe(index: number, clabe: string) {
    navigator.clipboard?.writeText(clabe.replace(/\s/g, ''))
    setCopied(index)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <header className="flex items-center justify-between border-b border-foreground/10 py-5">
          <a href="/" className="flex items-center gap-2 font-semibold tracking-tight">{logoUrl ? <img src={logoUrl} alt={appName} className="size-8 rounded-full object-cover" /> : <span className="grid size-8 place-items-center rounded-full bg-primary text-primary-foreground"><PawPrint className="size-4" /></span>} {appName.toLowerCase()}</a>
          <a href="/" className="flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"><ArrowLeft className="size-4" /> Volver al inicio</a>
        </header>

        <section className="grid gap-10 py-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-20 lg:py-20">
          <div>
            <p className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground"><span className="size-2 rounded-full bg-accent" /> Donativos</p>
            <h1 className="text-balance text-5xl font-semibold leading-[0.95] tracking-[-0.065em] sm:text-7xl">Tu ayuda <span className="text-muted-foreground">se convierte en patitas.</span></h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-muted-foreground">Cada peso se destina directo al rescate: alimento, vacunas, cirugías y la manutención de quienes esperan su hogar para siempre.</p>
            <div className="mt-8 flex flex-wrap gap-3">{['100% al rescate', 'Recibo deducible', 'Transparencia total'].map((item) => <span key={item} className="flex items-center gap-2 rounded-full border border-foreground/15 px-4 py-2 text-sm"><ShieldCheck className="size-4 text-accent-foreground" /> {item}</span>)}</div>
          </div>
          <div className="overflow-hidden rounded-[2rem] bg-secondary"><img src="https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=1000&q=85" alt="Perro y gato rescatados en adopción" className="h-[380px] w-full object-cover mix-blend-multiply sm:h-[480px]" /></div>
        </section>

        <section id="formulario" className="scroll-mt-8 grid gap-10 rounded-[2rem] border border-foreground/10 bg-card p-6 sm:p-10 lg:grid-cols-[0.72fr_1.28fr] lg:p-14">
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Haz tu donativo</p>
            <h2 className="text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">Elige cómo quieres ayudar.</h2>
            <p className="mt-5 max-w-sm leading-7 text-muted-foreground">Puedes aportar una vez o acompañarnos cada mes con una aportación recurrente.</p>
            <div className="mt-10 flex items-center gap-3 text-sm text-muted-foreground"><span className="grid size-8 place-items-center rounded-full bg-accent text-accent-foreground">1</span> Define tu aportación</div>
            <div className="mt-3 flex items-center gap-3 text-sm text-muted-foreground"><span className="grid size-8 place-items-center rounded-full bg-accent text-accent-foreground">2</span> Elige el método de pago</div>
            <div className="mt-3 flex items-center gap-3 text-sm text-muted-foreground"><span className="grid size-8 place-items-center rounded-full bg-foreground/10">3</span> Confirma y listo</div>
          </div>

          {sent ? <div className="flex min-h-96 flex-col justify-center rounded-3xl bg-accent p-8 text-accent-foreground"><span className="grid size-12 place-items-center rounded-full bg-primary text-primary-foreground"><Check /></span><h3 className="mt-5 text-3xl font-semibold">¡Gracias por tu donativo!</h3><p className="mt-3 max-w-sm leading-7">Tu aportación de <strong>${amount} MXN</strong> ya está en camino. Enviamos un comprobante a tu correo.</p><a href="/" className="mt-7 flex w-fit items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground">Volver al inicio <ArrowRight className="size-4" /></a></div> : (
            <form className="grid gap-6 rounded-3xl border border-foreground/10 bg-background p-6 sm:p-8" onSubmit={(event) => { event.preventDefault(); setSent(true) }}>
              <div>
                <label className="mb-2 block text-sm font-medium">Monto (MXN)</label>
                <div className="grid grid-cols-4 gap-2">{amounts.map((value) => <button key={value} type="button" onClick={() => setAmount(value)} className={`rounded-xl border px-3 py-3 text-sm font-medium transition ${amount === value ? 'border-primary bg-primary text-primary-foreground' : 'border-foreground/15 hover:border-foreground/30'}`}>${value}</button>)}</div>
                <label className="mt-2 grid gap-2 text-sm font-medium">Monto personalizado<input min={1} inputMode="numeric" name="custom-amount" placeholder="Otro monto" value={amount} onChange={(event) => setAmount(Number(event.target.value) || 0)} className="rounded-xl border border-foreground/15 bg-card px-4 py-3 font-normal outline-none transition focus:border-foreground" /></label>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">Método de pago</label>
                <div className="grid gap-2">{[
                  { id: 'card', label: 'Tarjeta de crédito o débito', desc: 'Pago seguro en línea', icon: <CreditCard className="size-5" /> },
                  { id: 'transfer', label: 'Transferencia bancaria', desc: 'Datos de la cuenta', icon: <Landmark className="size-5" /> },
                  { id: 'paypal', label: 'PayPal', desc: 'Usa tu cuenta de PayPal', icon: <Wallet className="size-5" /> },
                ].map((option) => <button key={option.id} type="button" onClick={() => setMethod(option.id as 'card' | 'transfer' | 'paypal')} className={`flex items-center gap-4 rounded-2xl border p-4 text-left transition ${method === option.id ? 'border-primary bg-accent/40' : 'border-foreground/15 hover:border-foreground/30'}`}><span className={`grid size-11 shrink-0 place-items-center rounded-full ${method === option.id ? 'bg-primary text-primary-foreground' : 'bg-card'}`}>{option.icon}</span><span className="flex-1"><span className="block text-sm font-medium">{option.label}</span><span className="block text-xs text-muted-foreground">{option.desc}</span></span>{method === option.id && <Check className="size-5 text-primary" />}</button>)}</div>
              </div>

              {method === 'card' && <div className="grid gap-5 rounded-2xl border border-foreground/10 bg-card p-5 sm:grid-cols-2"><label className="grid gap-2 text-sm font-medium sm:col-span-2">Número de tarjeta<input name="card" inputMode="numeric" placeholder="0000 0000 0000 0000" className="rounded-xl border border-foreground/15 bg-background px-4 py-3 font-normal outline-none focus:border-foreground" /></label><label className="grid gap-2 text-sm font-medium">Vencimiento<input name="expiry" placeholder="MM/AA" className="rounded-xl border border-foreground/15 bg-background px-4 py-3 font-normal outline-none focus:border-foreground" /></label><label className="grid gap-2 text-sm font-medium">CVV<input name="cvv" inputMode="numeric" placeholder="123" className="rounded-xl border border-foreground/15 bg-background px-4 py-3 font-normal outline-none focus:border-foreground" /></label></div>}

              {method === 'transfer' && <div className="grid gap-4">
                <p className="flex items-center gap-2 text-sm text-muted-foreground"><QrCode className="size-5 text-accent-foreground" /> También puedes escanear el código QR con tu app bancaria.</p>
                {bankAccounts.map((account, index) => <div key={account.bank} className="rounded-2xl border border-foreground/10 bg-card p-5"><div className="flex items-center justify-between gap-3"><p className="text-sm font-semibold">Transferencia a {account.bank}</p><span className="rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">Datos verificados</span></div><dl className="mt-4 grid gap-3 text-sm">{[
                  { label: 'CLABE', value: account.clabe },
                  { label: 'Beneficiario', value: account.owner },
                  { label: 'Concepto', value: account.reference },
                ].map((row) => <div key={row.label} className="flex flex-wrap items-center justify-between gap-2"><dt className="text-muted-foreground">{row.label}</dt><dd className="flex items-center gap-2 font-medium"><span>{row.value}</span><button type="button" aria-label={`Copiar ${row.label}`} onClick={() => copyClabe(index, row.value)} className="grid size-8 place-items-center rounded-full border border-foreground/15 transition hover:bg-muted">{copied === index ? <Check className="size-4 text-primary" /> : <Copy className="size-4" />}</button></dd></div>)}</dl></div>)}
                <label className="grid gap-2 text-sm font-medium">Correo para tu recibo<input type="email" name="receipt" placeholder="tu@correo.com" className="rounded-xl border border-foreground/15 bg-card px-4 py-3 font-normal outline-none transition focus:border-foreground" /></label>
              </div>}

              {method === 'paypal' && <div className="rounded-2xl border border-foreground/10 bg-card p-6 text-sm text-muted-foreground"><p className="flex items-center gap-3"><Wallet className="size-5 text-accent-foreground" /> Serás redirigido a PayPal para completar tu donativo de <strong className="text-foreground">${amount} MXN</strong> de forma segura.</p></div>}

              <button className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-4 text-sm font-medium text-primary-foreground transition hover:scale-[1.01]"><HandCoins className="size-4" /> Donar ${amount} MXN <ArrowRight className="size-4" /></button>
              <p className="flex items-center justify-center gap-2 text-xs text-muted-foreground"><ShieldCheck className="size-4" /> Pago protegido. No guardamos tus datos bancarios.</p>
            </form>
          )}
        </section>

        <section className="rounded-[2rem] bg-accent p-7 sm:p-12"><div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-center"><div><p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-accent-foreground/60">Otras formas de ayudar</p><h2 className="max-w-xl text-3xl font-semibold tracking-[-0.05em] sm:text-5xl">¿No puedes donar? También cuentas.</h2></div><div className="grid max-w-xl gap-4 sm:grid-cols-2">{['Voluntariado', 'Hogar temporal', 'Donar alimento', 'Padrino de adopción'].map((item) => <p key={item} className="flex items-center gap-3 rounded-2xl bg-accent-foreground/5 p-4 text-sm font-medium"><span className="grid size-8 place-items-center rounded-full bg-accent-foreground/15"><Heart className="size-4" /></span>{item}</p>)}</div></div></section>

        <footer className="flex flex-col justify-between gap-5 border-t border-foreground/10 py-10 text-sm text-muted-foreground sm:flex-row sm:items-center"><p className="font-semibold text-foreground">{appName.toLowerCase()}.</p><p>Hecho con amor para quienes no tienen voz.</p><a href="/" className="hover:text-foreground">Volver al inicio</a></footer>
      </div>
    </main>
  )
}
