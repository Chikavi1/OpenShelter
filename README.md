# Key Rescata

Sitio web de código abierto para organizaciones de rescate animal y adopción de mascotas. Construido con **Next.js 16**, **Tailwind CSS v4** y **shadcn/ui**.

## Licencia y uso

Este proyecto es **código abierto** y de **uso libre para organizaciones** (refugios, albergues, asociaciones y grupos de rescate animal).

- ✅ Puedes descargarlo, usarlo, modificarlo y desplegarlo libremente.
- ❌ **Está prohibida su venta**, ya sea del proyecto tal cual o con modificaciones.
- ❌ **No está permitido su uso con fines comerciales o de lucro** por particulares.
- 📌 El uso está orientado a **organizaciones sin fines de lucro** dedicadas al bienestar animal.

Cualquier redistribución debe conservar el aviso de licencia original.

## Características

- 🐾 **Catálogo de mascotas**: tarjetas en la portada enlazadas a perfiles individuales.
- 📋 **Perfiles de adopción**: galería de fotos, datos (edad, tamaño, sexo, ubicación), historia, requisitos de adopción y formulario de solicitud.
- 💚 **Donaciones**: donación única por tarjeta, transferencia (SPEI) o PayPal.
- ✉️ **Contacto**: datos de la organización y formulario de mensaje.
- 📄 Páginas legales: **Aviso de privacidad** y **Términos y condiciones**.

## Tecnologías

- [Next.js](https://nextjs.org) 16 (App Router)
- [React](https://react.dev) 19
- [Tailwind CSS](https://tailwindcss.com) v4
- [shadcn/ui](https://ui.shadcn.com)
- [lucide-react](https://lucide.dev) (iconos)

## Requisitos

- Node.js 20 o superior
- npm o pnpm

## Instalación

```bash
# Clonar el repositorio
git clone <url-del-repositorio>
cd adopt-me

# Instalar dependencias (con pnpm)
pnpm install
# o con npm
npm install
```

## Configuración

Copia `.env.example` a `.env` y ajusta los valores:

```bash
cp .env.example .env
```

| Variable | Descripción |
| --- | --- |
| `NEXT_PUBLIC_APP_NAME` | Nombre de la organización |
| `NEXT_PUBLIC_LOGO_URL` | URL del logo |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Correo de contacto |
| `NEXT_PUBLIC_CONTACT_PHONE` | Teléfono de contacto |
| `NEXT_PUBLIC_CONTACT_ADDRESS` | Dirección |
| `NEXT_PUBLIC_CONTACT_HOURS` | Horario de atención |

> El archivo `.env` no debe subirse al repositorio (está en `.gitignore`). Solo `.env.example` se versiona.

## Poner en marcha

```bash
# Entorno de desarrollo
pnpm dev
# o
npm run dev

# Build de producción
pnpm build
npm run build

# Servir el build de producción
pnpm start
npm run start

# Lint
pnpm lint
npm run lint
```

Abre [http://localhost:3000](http://localhost:3000) para ver el sitio.

## Estructura del proyecto

```
app/
├── page.tsx                 # Portada: hero, catálogo de mascotas, donativos, contacto
├── layout.tsx               # Layout raíz con tema y fuentes
├── globals.css              # Estilos globales y tema (Tailwind v4)
├── adopta/
│   ├── milo/page.tsx        # Perfil de Milo
│   ├── luna/page.tsx        # Perfil de Luna
│   ├── bruno/page.tsx       # Perfil de Bruno
│   └── nube/page.tsx        # Perfil de Nube
├── donar/page.tsx           # Página de donaciones
├── contacto/page.tsx        # Página de contacto
├── privacidad/page.tsx      # Aviso de privacidad
└── terminos/page.tsx        # Términos y condiciones
```

## Cómo agregar una mascota

1. Crea un perfil en `app/adopta/<slug>/page.tsx` siguiendo la estructura de un perfil existente (p. ej. `milo`).
2. Agrega la mascota al array `pets` en `app/page.tsx` con su `slug` para que aparezca en el catálogo.
3. Coloca las fotos en `public/` y refiérelas desde la galería del perfil.

## Despliegue

El sitio es estático y funciona sin servidor. Puedes desplegarlo en [Vercel](https://vercel.com), Netlify, Cloudflare Pages o cualquier host que soporte Next.js.

## Contribuciones

¿Eres una organización de rescate? Las contribuciones, correcciones de bugs y mejoras de accesibilidad son bienvenidas. Abre un *issue* o envía un *pull request*.

## Contacto del proyecto

Para dudas sobre el uso de este proyecto, abre un *issue* en el repositorio.
