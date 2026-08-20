export type DashboardPetStatus = 'Disponible' | 'En Proceso' | 'Adoptado'
export type AdoptionApplicationStatus = 'Pendiente' | 'En revisión' | 'Aprobada' | 'Rechazada'
export type FosterHomeStatus = 'Activa' | 'En pausa' | 'Disponible'
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

export interface ShelterSettings {
  name: string
  tagline: string
  description: string
  phone: string
  email: string
  address: string
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
}

export interface DashboardState {
  pets: DashboardPet[]
  applications: AdoptionApplication[]
  fosterHomes: FosterHome[]
  thanksList: SponsorThank[]
  settings: ShelterSettings
}

export const DEFAULT_DASHBOARD_STATE: DashboardState = {
  pets: [],
  applications: [],
  fosterHomes: [],
  thanksList: [],
  settings: {
    name: '',
    tagline: '',
    description: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    country: '',
    zipCode: '',
    primaryColor: '',
    accentColor: '',
    palette: {
      primary: '#163b2d',
      secondary: '#e8e1d5',
      background: '#f5f1e9',
      cta: '#c5e86c',
      text: '#24352d',
      surface: '#fcfaf6',
    },
    logoUrl: '',
    heroBannerUrl: '',
    adoptionContractTerms: '',
    shelterRules: '',
    visitingHours: '',
    supportTitle: '',
    supportDescription: '',
    transferBankName: '',
    transferClabe: '',
    transferOwner: '',
    transferReference: '',
    paypalUrl: '',
    supportNotes: '',
    adoptionFormFields: [],
    fosterFormFields: [],
    fosterRequirements: '',
    socialLinks: {
      instagram: '',
      facebook: '',
      website: '',
    },
  },
}
