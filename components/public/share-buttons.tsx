'use client'

import { useEffect, useState } from 'react'
import { Check, Link2, Share2 } from 'lucide-react'
import { FaFacebookF, FaWhatsapp, FaXTwitter } from 'react-icons/fa6'

interface ShareButtonsProps {
  url?: string
  title: string
  text?: string
}

export function ShareButtons({ url, title, text }: ShareButtonsProps) {
  const [href, setHref] = useState(url ?? '')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!url) setHref(window.location.href)
  }, [url])

  const shareText = text ?? title
  const encodedUrl = encodeURIComponent(href)
  const encodedText = encodeURIComponent(shareText)

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${shareText} ${href}`)}`
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`
  const xUrl = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback
      const el = document.createElement('textarea')
      el.value = href
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, text: shareText, url: href })
      } catch {}
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        <Share2 className="size-3.5" /> Compartir
      </span>
      <div className="flex items-center gap-1.5">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          aria-label="Compartir por WhatsApp"
          className="grid size-8 place-items-center rounded-full bg-[#25D366] text-white transition hover:opacity-90"
        >
          <FaWhatsapp className="size-4" />
        </a>
        <a
          href={facebookUrl}
          target="_blank"
          rel="noreferrer"
          aria-label="Compartir en Facebook"
          className="grid size-8 place-items-center rounded-full bg-[#1877F2] text-white transition hover:opacity-90"
        >
          <FaFacebookF className="size-3.5" />
        </a>
        <a
          href={xUrl}
          target="_blank"
          rel="noreferrer"
          aria-label="Compartir en X"
          className="grid size-8 place-items-center rounded-full bg-black text-white transition hover:opacity-90"
        >
          <FaXTwitter className="size-3.5" />
        </a>
        <button
          type="button"
          onClick={handleCopy}
          aria-label="Copiar enlace"
          className="grid size-8 place-items-center rounded-full border border-foreground/10 bg-card text-foreground transition hover:bg-secondary"
        >
          {copied ? <Check className="size-3.5 text-green-600" /> : <Link2 className="size-3.5" />}
        </button>
        {typeof navigator !== 'undefined' && 'share' in navigator && (
          <button
            type="button"
            onClick={handleNativeShare}
            className="hidden rounded-full border border-foreground/10 bg-card px-3 py-1.5 text-xs font-medium hover:bg-secondary sm:inline-flex"
          >
            Más opciones
          </button>
        )}
      </div>
      {copied && <span className="text-xs text-green-600">¡Enlace copiado!</span>}
    </div>
  )
}
