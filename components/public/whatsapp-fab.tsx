'use client'

import { FaWhatsapp } from 'react-icons/fa6'
import { usePublicSite } from '@/lib/use-public-site'

function normalizePhone(phone: string) {
  return phone.replace(/[^\d]/g, '')
}

export function WhatsAppFab() {
  const site = usePublicSite()
  const rawPhone = site.settings.phone || ''
  const digits = normalizePhone(rawPhone)
  if (!digits) return null

  const message = encodeURIComponent(`Hola ${site.settings.name || 'equipo'}! Me gustaría saber más sobre adopciones.`)
  const href = `https://wa.me/${digits}?text=${message}`

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label="Contactar por WhatsApp"
      className="fixed bottom-5 right-5 z-50 grid size-14 place-items-center rounded-full bg-[#25D366] text-white shadow-[0_8px_24px_rgba(0,0,0,0.2)] ring-1 ring-black/5 transition hover:scale-105 hover:bg-[#20bd5a] active:scale-95 sm:bottom-6 sm:right-6 sm:size-14"
    >
      <FaWhatsapp className="size-7" />
    </a>
   )
}
