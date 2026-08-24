export type DashboardPetStatus = 'Disponible' | 'En Proceso' | 'Adoptado'
export type AdoptionApplicationStatus = 'Pendiente' | 'En revisión' | 'Aprobada' | 'Rechazada'
export type AdoptionDocumentType = 'Identificación oficial' | 'Comprobante de domicilio'
export type FosterHomeStatus = 'Activa' | 'En pausa' | 'Disponible'
export type AdoptionFollowUpStage = 'Pendiente' | 'Contrato firmado' | 'Entregado' | 'Seguimiento 1' | 'Seguimiento 2' | 'Cerrado'
export type ShelterEventStatus = 'Programado' | 'En preparación' | 'En curso' | 'Finalizado' | 'Cancelado'
export type ShelterEventCategory = 'Adopción' | 'Recaudación' | 'Voluntariado' | 'Vacunación' | 'Educativo'
export type CustomFieldType = 'text' | 'email' | 'tel' | 'date' | 'number' | 'select' | 'boolean' | 'textarea'

export interface CustomFormField {
  id: string
  label: string
  type: CustomFieldType
  placeholder?: string
  required: boolean
  options?: string[]
}

export interface DashboardPet {
  id: string
  name: string
  species: 'Perro' | 'Gato' | 'Otro'
  breed: string
  age: string
  gender: 'Macho' | 'Hembra'
  size: 'Pequeño' | 'Mediano' | 'Grande'
  status: DashboardPetStatus
  location: string
  image: string
  images: string[]
  featured: boolean
  health: string[]
  personality: string[]
  story: string
  views: number
  applicationsCount: number
}

export interface AdoptionApplication {
  id: string
  applicantName: string
  applicantEmail: string
  applicantPhone: string
  applicantAddress: string
  applicantCity: string
  petName: string
  petId: string
  petImage: string
  homeType: 'Casa' | 'Departamento' | 'Otro'
  hasOtherPets: boolean
  yard: boolean
  status: AdoptionApplicationStatus
  dateSubmitted: string
  experience: string
  customResponses?: Record<string, string | boolean>
  documents: AdoptionApplicationDocument[]
  verification: AdoptionApplicationVerification
  reviewNotes: string
  reviewedAt?: string
}

export interface AdoptionApplicationDocument {
  type: AdoptionDocumentType
  key?: string
  name: string
  url: string
  uploadedAt: string
}

export interface AdoptionApplicationVerification {
  identity: boolean
  address: boolean
  homeConditions: boolean
  interview: boolean
  references: boolean
  eligibility: boolean
}

export interface FosterHome {
  id: string
  name: string
  email: string
  phone: string
  address: string
  city: string
  homeType: 'Casa' | 'Departamento' | 'Finca'
  yard: boolean
  preferredSpecies: 'Perros' | 'Gatos' | 'Cualquiera'
  maxCapacity: number
  currentPetsCount: number
  status: FosterHomeStatus
  notes: string
  registeredDate: string
  currentFosteredPet?: string
  customResponses?: Record<string, string | boolean>
}

export interface SponsorThank {
  id: string
  name: string
  role: 'Donante' | 'Voluntario' | 'Empresa Aliada' | 'Padrino'
  amountOrContribution: string
  message: string
  avatarUrl: string
  date: string
  isPublic: boolean
}

export interface AdoptionFollowUp {
  id: string
  petId?: string
  petName: string
  adopterName: string
  adopterEmail: string
  adopterPhone: string
  adopterAddress: string
  adopterCity: string
  adoptionDate: string
  nextFollowUpDate: string
  processStage: AdoptionFollowUpStage
  notes: string
  carePlan: string
  applicationId?: string
  lastContactDate?: string
  verificationStatus: 'Pendiente' | 'En cumplimiento' | 'Requiere atención' | 'Incumplimiento'
  followUpChecks: {
    contacted: boolean
    petSafe: boolean
    healthUpToDate: boolean
    conditionsMet: boolean
  }
  documents: Array<{ type: AdoptionDocumentType; name: string; url: string; key?: string; uploadedAt: string }>
  incidents: string
}

export interface ShelterEvent {
  id: string
  title: string
  image: string
  category: ShelterEventCategory
  status: ShelterEventStatus
  eventDate: string
  eventTime: string
  location: string
  latitude: number
  longitude: number
  attendeesTarget: number
  contactName: string
  contactPhone: string
  registrationLink: string
  ctaLabel: string
  description: string
  notes: string
}

export interface ShelterSettings {
  name: string
  tagline: string
  description: string
  phone: string
  email: string
  address: string
  latitude: number
  longitude: number
  city: string
  state: string
  country: string
  zipCode: string
  primaryColor: string
  accentColor: string
  palette: {
    primary: string
    secondary: string
    background: string
    cta: string
    text: string
    surface: string
  }
  logoUrl: string
  heroBannerUrl: string
  adoptionContractTerms: string
  shelterRules: string
  visitingHours: string
  supportTitle: string
  supportDescription: string
  transferBankName: string
  transferClabe: string
  transferOwner: string
  transferReference: string
  paypalUrl: string
  supportNotes: string
  adoptionFormFields: CustomFormField[]
  fosterFormFields: CustomFormField[]
  fosterRequirements: string
  socialLinks: {
    instagram: string
    facebook: string
    website: string
  }
  aboutContent: {
    heroKicker: string; heroTitle: string; heroHighlight: string; heroDescription: string
    storyImageUrl: string; storyKicker: string; storyTitle: string; storyParagraphs: string[]
    valuesKicker: string; valuesTitle: string; valuesDesc: string; values: Array<{ title: string; desc: string }>
    stepsKicker: string; stepsTitle: string; stepsDesc: string; steps: Array<{ n: string; title: string; desc: string }>
    ctaKicker: string; ctaTitle: string; ctaDesc: string
  }
}

export interface DashboardState {
  pets: DashboardPet[]
  applications: AdoptionApplication[]
  fosterHomes: FosterHome[]
  thanksList: SponsorThank[]
  followUps: AdoptionFollowUp[]
  events: ShelterEvent[]
  settings: ShelterSettings
}

export const DEFAULT_DASHBOARD_STATE: DashboardState = {
  pets: [
      {
      id: 'pet-1',
      name: 'Milo',
      species: 'Perro',
      breed: 'Mestizo',
      age: '2 años',
      gender: 'Macho',
      size: 'Mediano',
      status: 'Disponible',
      location: 'Refugio Central',
      image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=900&q=85',
      images: ['https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=900&q=85'],
      featured: true,
      health: ['Vacunas al día', 'Esterilizado', 'Desparasitado'],
      personality: ['Juguetón', 'Sociable', 'Cariñoso'],
      story: 'Milo fue rescatado de la calle en muy malas condiciones, pero hoy recuperó toda su energía y está buscando una familia amorosa.',
      views: 120,
      applicationsCount: 2,
    },
    {
      id: 'pet-2',
      name: 'Luna',
      species: 'Gato',
      breed: 'Mestizo',
      age: '1 año',
      gender: 'Hembra',
      size: 'Pequeño',
      status: 'Disponible',
      location: 'Refugio Central',
      image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=900&q=85',
      images: ['https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=900&q=85'],
      featured: false,
      health: ['Vacunas al día', 'Esterilizada'],
      personality: ['Tranquila', 'Cariñosa', 'Hogareña'],
      story: 'Luna es una gatita muy dulce que adora acurrucarse en lugares calientitos.',
      views: 85,
      applicationsCount: 1,
    },
    {
      id: 'pet-3',
      name: 'Bruno',
      species: 'Perro',
      breed: 'Labrador Mestizo',
      age: '3 años',
      gender: 'Macho',
      size: 'Grande',
      status: 'En Proceso',
      location: 'Refugio Central',
      image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=900&q=85',
      images: ['https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=900&q=85'],
      featured: false,
      health: ['Vacunas al día', 'Esterilizado'],
      personality: ['Protector', 'Leal', 'Inteligente'],
      story: 'Bruno es un gran compañero de paseos, excelente para familias activas.',
      views: 94,
      applicationsCount: 3,
    },
    {
      id: 'pet-4',
      name: 'Nube',
      species: 'Gato',
      breed: 'Persa Mestizo',
      age: '6 meses',
      gender: 'Hembra',
      size: 'Pequeño',
      status: 'Disponible',
      location: 'Refugio Central',
      image: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=900&q=85',
      images: ['https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=900&q=85'],
      featured: false,
      health: ['Desparasitada'],
      personality: ['Curiosa', 'Juguetona'],
      story: 'Nube es una cachorrita llena de vida y curiosidad por el mundo.',
      views: 150,
      applicationsCount: 4,
    },
  ],
  applications: [
    {
      id: 'sol-1',
      applicantName: 'Carlos Gómez',
      applicantEmail: 'carlos@gmail.com',
        applicantPhone: '5551234567',
        applicantAddress: '',
        applicantCity: '',
      petName: 'Milo',
      petId: 'pet-1',
      petImage: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=900&q=85',
      homeType: 'Casa',
      hasOtherPets: true,
      yard: true,
      status: 'En revisión',
      dateSubmitted: 'Ayer',
        experience: 'He tenido perros durante más de 5 años.',
        documents: [],
        verification: { identity: false, address: false, homeConditions: false, interview: false, references: false, eligibility: false },
        reviewNotes: '',
    },
  ],
  fosterHomes: [
    {
      id: 'fh-1',
      name: 'Familia Rodríguez',
      email: 'contacto@rodriguez.org',
      phone: '5559876543',
      address: '',
      city: '',
      homeType: 'Casa',
      yard: true,
      preferredSpecies: 'Cualquiera',
      maxCapacity: 2,
      currentPetsCount: 1,
      status: 'Activa',
      notes: 'Disponibles para recibir perritos o gatitos recuperándose.',
      registeredDate: 'Hace 1 mes',
    },
  ],
  thanksList: [
    {
      id: 'th-1',
      name: 'Empresa Canina S.A.',
      role: 'Empresa Aliada',
      amountOrContribution: 'Donación de 200kg de alimento',
      message: 'Felices de apoyar la causa de dar un hogar digno a los animales.',
      avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80',
      date: 'Hace 2 semanas',
      isPublic: true,
    },
  ],
  followUps: [
    {
      id: 'fu-1',
      petId: 'pet-1',
      petName: 'Milo',
      adopterName: 'Carlos Gómez',
      adopterEmail: 'carlos@gmail.com',
      adopterPhone: '5551234567',
      adopterAddress: 'Av. Siempre Viva 742',
      adopterCity: '',
      adoptionDate: '12/08/2026',
      nextFollowUpDate: '26/08/2026',
      processStage: 'Seguimiento 1',
      notes: 'Familia nueva muy comprometida. Se recomienda verificar adaptación en casa y rutina de paseos.',
      carePlan: 'Revisar alimentación, sueño, paseos y contacto con veterinario en la siguiente visita.',
      applicationId: 'sol-1',
      lastContactDate: '12/08/2026',
      verificationStatus: 'En cumplimiento',
      followUpChecks: { contacted: true, petSafe: true, healthUpToDate: true, conditionsMet: true },
      incidents: '',
    },
  ],
  events: [
    {
      id: 'evt-1',
      title: 'Jornada de adopción y bazar solidario',
      image: '/events.png',
      category: 'Adopción',
      status: 'Programado',
      eventDate: '30/08/2026',
      eventTime: '10:00',
      location: 'Parque Central',
      latitude: 19.4326,
      longitude: -99.1332,
      attendeesTarget: 80,
      contactName: 'Laura Pérez',
      contactPhone: '5554443322',
      registrationLink: 'https://example.com/eventos/adopcion',
      ctaLabel: 'Registrarme',
      description: 'Evento para presentar mascotas en adopción, recibir donaciones y sumar voluntarios al refugio.',
      notes: 'Confirmar carpa, mesas y permisos con administración del parque.',
    },
  ],
  settings: {
    name: 'Refugio Huellas',
    tagline: 'Rescate y adopción responsable',
    description: 'Rescatamos, rehabilitamos y conectamos mascotas increíbles con familias amorosas.',
    phone: '+52 55 1234 5678',
    email: 'contacto@refugiohuellas.org',
    address: '',
    latitude: 19.4326,
    longitude: -99.1332,
    city: '',
    state: '',
    country: 'México',
    zipCode: '01000',
    primaryColor: '#163b2d',
    accentColor: '#c5e86c',
    palette: {
      primary: '#163b2d',
      secondary: '#e8e1d5',
      background: '#f5f1e9',
      cta: '#c5e86c',
      text: '#24352d',
      surface: '#fcfaf6',
    },
    logoUrl: 'https://i.ibb.co/tFjxBQK/default-image-icon-4595376-512.png',
    heroBannerUrl: 'https://images.unsplash.com/photo-1660535254205-b9f03a7b84dc?q=80&w=857&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    adoptionContractTerms: 'El adoptante se compromete a brindar alimento, atención médica y un trato digno.',
    shelterRules: 'Respetar los horarios de visita y agendar cita previa.',
    visitingHours: 'Lunes a Sábado de 10:00 AM a 5:00 PM',
    supportTitle: 'Apoya nuestro refugio',
    supportDescription: 'Tu donación nos ayuda a seguir rescatando vidas.',
    transferBankName: 'BBVA',
    transferClabe: '012180000000000000',
    transferOwner: 'Refugio Huellas A.C.',
    transferReference: 'DONACION',
    paypalUrl: 'https://paypal.me/refugiohuellas',
    supportNotes: 'Las donaciones son deducibles de impuestos.',
    adoptionFormFields: [],
    fosterFormFields: [],
    fosterRequirements: 'Contar con un espacio seguro y tiempo para cuidar temporalmente a un rescatado.',
    socialLinks: {
      instagram: 'https://instagram.com/refugiohuellas',
      facebook: 'https://facebook.com/refugiohuellas',
      website: 'https://refugiohuellas.org',
    },
    aboutContent: {
      heroKicker: 'Quiénes somos',
      heroTitle: 'No salvamos mascotas.',
      heroHighlight: 'Salvamos futuros.',
      heroDescription: 'Rescatamos, rehabilitamos y conectamos mascotas increíbles con familias amorosas. Nacimos de un grupo de vecinos que decidió no mirar hacia otro lado.',
      storyImageUrl: 'https://images.unsplash.com/photo-1636604244109-7b26dd38dd91?q=80&w=880&auto=format&fit=crop',
      storyKicker: 'Nuestra historia',
      storyTitle: 'De un rescate a una red de apoyo',
      storyParagraphs: [
        'Empezamos rescatando a uno. Hoy somos una comunidad de voluntarios, veterinarios, hogares temporales y familias que han decidido que ningún animal se quede atrás. Cada caso nos enseña que con cuidado, paciencia y compromiso, una vida puede cambiar por completo.',
        'Colaboramos con hogares temporales y aliados. Todo lo que hacemos se sostiene con donativos y trabajo voluntario.',
      ],
      valuesKicker: 'Lo que nos mueve',
      valuesTitle: 'Nuestros valores',
      valuesDesc: 'No somos un albergue masivo. Somos una red pequeña que hace las cosas con cuidado, para que cada adopción dure para siempre.',
      values: [
        { title: 'Rescate con respeto', desc: 'Cada intervención prioriza el bienestar del animal, sin violencia y con acompañamiento veterinario.' },
        { title: 'Adopción responsable', desc: 'Evaluamos compatibilidad, damos seguimiento y acompañamos a la familia después de la entrega.' },
        { title: 'Transparencia total', desc: 'Cada donativo se reporta y cada historia se comparte. Nada se esconde.' },
        { title: 'Comunidad que acompaña', desc: 'Voluntarios, hogares temporales y padrinos hacen posible lo que solos no podríamos.' },
      ],
      stepsKicker: 'Cómo trabajamos',
      stepsTitle: 'Del rescate al hogar',
      stepsDesc: 'Un proceso claro, humano y con seguimiento. No entregamos mascotas a la ligera.',
      steps: [
        { n: '01', title: 'Rescate', desc: 'Rescatamos reportes de abandono, maltrato o extravío y damos atención inmediata.' },
        { n: '02', title: 'Rehabilitación', desc: 'Atención veterinaria, esterilización, vacunas, desparasitación y terapia conductual si hace falta.' },
        { n: '03', title: 'Hogar temporal', desc: 'Los rescatados conviven en hogares temporales donde recuperan confianza y rutina.' },
        { n: '04', title: 'Adopción y seguimiento', desc: 'Conectamos con la familia ideal y damos seguimiento post-adopción con visitas y apoyo.' },
      ],
      ctaKicker: 'Súmate',
      ctaTitle: 'Hay muchas formas de ayudar, incluso si no puedes adoptar ahora.',
      ctaDesc: 'Dona, ofrece hogar temporal, comparte un perfil o visítanos. Cada gesto cuenta y lo agradecemos de corazón.',
    },
  },
}
