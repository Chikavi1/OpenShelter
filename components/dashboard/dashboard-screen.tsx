'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  PawPrint,
  Heart,
  FileText,
  Users,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronRight,
  Upload,
  Calendar,
  MapPin,
  Sparkles,
  ArrowUpRight,
  TrendingUp,
  SlidersHorizontal,
  Eye,
  Edit,
  Trash2,
  Check,
  Bell,
  UserCheck,
  LogOut,
  ChevronDown,
  Settings,
  Palette,
  Camera,
  BookOpen,
  Scale,
  Building2,
  Phone,
  Mail,
  Save,
  Globe,
  FileCheck,
  List,
  ExternalLink,
  Menu,
  X,
  Home,
  Award,
  Plus,
  MessageSquare,
  Gift,
  HelpCircle,
  FileQuestion,
  UserPlus,
  ToggleLeft,
  CalendarDays,
  Hash,
  ListFilter,
  HandCoins,
  Lock
} from 'lucide-react'
import { slugify } from '@/lib/slug'
import { applySitePalette } from '@/lib/theme'
import { ThankModal } from '@/components/dashboard/thank-modal'
import { PetCard } from '@/components/dashboard/pet-card'
import { PetForm } from '@/components/dashboard/pet-form'
import { type AdoptionApplication, type AdoptionFollowUp, type ShelterEvent } from '@/lib/dashboard-defaults'
import { DashboardOverviewTab } from '@/components/dashboard/dashboard-overview-tab'
import { DashboardApplicationsTab } from '@/components/dashboard/dashboard-applications-tab'
import { DashboardFosterHomesTab } from '@/components/dashboard/dashboard-foster-homes-tab'
import { DashboardThanksTab } from '@/components/dashboard/dashboard-thanks-tab'
import { DashboardAdoptionFollowUpsTab } from '@/components/dashboard/dashboard-adoption-followups-tab'
import { DashboardContractsTab } from '@/components/dashboard/dashboard-contracts-tab'
import { DashboardEventsTab } from '@/components/dashboard/dashboard-events-tab'
import { DashboardEventCreateScreen } from '@/components/dashboard/dashboard-event-create-screen'
import { DashboardSettingsTab } from '@/components/dashboard/dashboard-settings-tab'
import { DashboardFosterModal } from '@/components/dashboard/dashboard-foster-modal'
import { DashboardSidebar } from '@/components/dashboard/dashboard-sidebar'
import { DashboardProvider } from '@/components/dashboard/dashboard-context'
import { DeleteConfirmDialog } from '@/components/dashboard/delete-confirm-dialog'

// Types
type TabType = 'overview' | 'pets' | 'register-pet' | 'applications' | 'foster-homes' | 'thanks' | 'adoption-followups' | 'contracts' | 'events' | 'register-event' | 'settings'

const DEFAULT_IMAGE_URL = 'https://i.ibb.co/tFjxBQK/default-image-icon-4595376-512.png'

function BrandMark({ src, alt, className = '' }: { src: string; alt: string; className?: string }) {
  return (
    <span className={`grid overflow-hidden place-items-center rounded-2xl bg-primary text-primary-foreground shadow-sm ${className}`}>
      <img src={src || DEFAULT_IMAGE_URL} alt={alt} className="h-full w-full object-cover" />
    </span>
  )
}

export type CustomFieldType = 'text' | 'email' | 'tel' | 'date' | 'number' | 'select' | 'boolean' | 'textarea'

export interface CustomFormField {
  id: string
  label: string
  type: CustomFieldType
  placeholder?: string
  required: boolean
  options?: string[] // Para tipo 'select'
}

interface Pet {
  id: string
  name: string
  species: 'Perro' | 'Gato' | 'Otro'
  breed: string
  age: string
  gender: 'Macho' | 'Hembra'
  size: 'Pequeño' | 'Mediano' | 'Grande'
  status: 'Disponible' | 'En Proceso' | 'Adoptado'
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

interface FosterHome {
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
  status: 'Activa' | 'En pausa' | 'Disponible'
  notes: string
  registeredDate: string
  currentFosteredPet?: string
  customResponses?: Record<string, string | boolean>
}

interface SponsorThank {
  id: string
  name: string
  role: 'Donante' | 'Voluntario' | 'Empresa Aliada' | 'Padrino'
  amountOrContribution: string
  message: string
  avatarUrl: string
  date: string
  isPublic: boolean
}

interface ShelterSettings {
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
  // Form Configurations
  adoptionFormFields: CustomFormField[]
  fosterFormFields: CustomFormField[]
  fosterRequirements: string
  socialLinks: {
    instagram: string
    facebook: string
    website: string
  }
}

// Initial empty state
const INITIAL_PETS: Pet[] = []
const INITIAL_APPLICATIONS: AdoptionApplication[] = []
const INITIAL_FOSTER_HOMES: FosterHome[] = []
const INITIAL_THANKS: SponsorThank[] = []
const INITIAL_FOLLOW_UPS: AdoptionFollowUp[] = []
const INITIAL_EVENTS: ShelterEvent[] = []
const INITIAL_SETTINGS: ShelterSettings = {
  name: '',
  tagline: '',
  description: '',
  phone: '',
  email: '',
  address: '',
  latitude: 19.4326,
  longitude: -99.1332,
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
}

const getDefaultPetLocation = (s: ShelterSettings) => {
  // Prioridad: dirección completa del refugio. Si la dirección es solo ciudad/estado genérica, usa city+state
  const hasDetailedAddress = s.address && (s.address.includes(',') || /\d/.test(s.address) || s.address.length > 20)
  if (hasDetailedAddress) return s.address
  if (s.address) return s.address
  if (s.city && s.state && s.city !== s.state) return `${s.city}, ${s.state}`
  if (s.city) return s.city
  return s.name ? `${s.name}` : 'Ubicación del refugio'
}
const createEmptyPetForm = (settings?: ShelterSettings) => ({
  name: '',
  species: 'Perro' as 'Perro' | 'Gato' | 'Otro',
  breed: '',
  age: '',
  gender: 'Macho' as 'Macho' | 'Hembra',
  size: 'Mediano' as 'Pequeño' | 'Mediano' | 'Grande',
  location: settings ? getDefaultPetLocation(settings) : 'Ubicación del refugio',
  image: '',
  images: [] as string[],
  story: '',
  healthInput: '',
  personalityInput: '',
})

const createEmptyFosterForm = () => ({
  name: '',
  email: '',
  phone: '',
  address: '',
  city: 'CDMX',
  homeType: 'Casa' as 'Casa' | 'Departamento' | 'Finca',
  yard: true,
  preferredSpecies: 'Cualquiera' as 'Perros' | 'Gatos' | 'Cualquiera',
  maxCapacity: 1,
  notes: '',
  customResponses: {} as Record<string, string | boolean>,
})

const createEmptyThankForm = () => ({
  name: '',
  role: 'Donante' as 'Donante' | 'Voluntario' | 'Empresa Aliada' | 'Padrino',
  amountOrContribution: '',
  message: '',
  avatarUrl: '',
  isPublic: true,
})

const createEmptyFollowUpForm = (): Omit<AdoptionFollowUp, 'id'> => ({
  petId: '',
  petName: '',
  adopterName: '',
  adopterEmail: '',
  adopterPhone: '',
  adopterAddress: '',
  adopterCity: '',
  adoptionDate: '',
  nextFollowUpDate: '',
  processStage: 'Pendiente' as AdoptionFollowUp['processStage'],
  notes: '',
  carePlan: '',
  applicationId: undefined,
  lastContactDate: '',
  verificationStatus: 'Pendiente',
  followUpChecks: { contacted: false, petSafe: false, healthUpToDate: false, conditionsMet: false },
  incidents: '',
})

const createEmptyEventForm = (): Omit<ShelterEvent, 'id'> => ({
  title: '',
  image: '/events.png',
  category: 'Adopción' as ShelterEvent['category'],
  status: 'Programado' as ShelterEvent['status'],
  eventDate: '',
  eventTime: '',
  location: '',
  latitude: 19.4326,
  longitude: -99.1332,
  attendeesTarget: 0,
  contactName: '',
  contactPhone: '',
  registrationLink: '',
  description: '',
  notes: '',
})

export default function DashboardPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<TabType>('overview')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.replace('/dashboard/login')
    router.refresh()
  }

  // Main Data States
  const [pets, setPets] = useState<Pet[]>(INITIAL_PETS)
  const [applications, setApplications] = useState<AdoptionApplication[]>(INITIAL_APPLICATIONS)
  const [fosterHomes, setFosterHomes] = useState<FosterHome[]>(INITIAL_FOSTER_HOMES)
  const [thanksList, setThanksList] = useState<SponsorThank[]>(INITIAL_THANKS)
  const [followUps, setFollowUps] = useState<AdoptionFollowUp[]>(INITIAL_FOLLOW_UPS)
  const [events, setEvents] = useState<ShelterEvent[]>(INITIAL_EVENTS)
  const [settings, setSettings] = useState<ShelterSettings>(INITIAL_SETTINGS)
  const [hydrated, setHydrated] = useState(false)
  const saveTimer = useRef<number | null>(null)
  const [uploadingImage, setUploadingImage] = useState<'logo' | 'hero' | null>(null)
  const [imageUploadError, setImageUploadError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    const loadDashboardState = async () => {
      try {
        const response = await fetch('/api/admin/state', { cache: 'no-store' })

        if (response.status === 401) {
          router.replace('/dashboard/login')
          return
        }

        if (!response.ok) return

        const state = await response.json() as {
          pets?: Pet[]
          applications?: AdoptionApplication[]
          fosterHomes?: FosterHome[]
          thanksList?: SponsorThank[]
          followUps?: AdoptionFollowUp[]
          events?: ShelterEvent[]
          settings?: ShelterSettings
        }

        if (cancelled) return

        if (state.pets) setPets(state.pets)
        if (state.applications) setApplications(state.applications)
        if (state.fosterHomes) setFosterHomes(state.fosterHomes)
        if (state.thanksList) setThanksList(state.thanksList)
        if (state.followUps) setFollowUps(state.followUps)
        if (state.events) setEvents(state.events)
        if (state.settings) setSettings(state.settings)
        setHydrated(true)
      } catch {
        // Keep the seeded defaults if the API is unavailable.
      }
    }

    void loadDashboardState()

    return () => {
      cancelled = true
    }
  }, [router])

  useEffect(() => {
    applySitePalette(settings)
  }, [settings])

  const persistDashboardState = useCallback(async (state: { pets: Pet[]; applications: AdoptionApplication[]; fosterHomes: FosterHome[]; thanksList: SponsorThank[]; followUps: AdoptionFollowUp[]; events: ShelterEvent[]; settings: ShelterSettings }) => {
    const response = await fetch('/api/admin/state', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(state),
    })

    if (response.status === 401) {
      router.replace('/dashboard/login')
      return false
    }

    return response.ok
  }, [router])

  useEffect(() => {
    if (!hydrated) return

    if (saveTimer.current) {
      window.clearTimeout(saveTimer.current)
    }

    saveTimer.current = window.setTimeout(() => {
      void persistDashboardState({ pets, applications, fosterHomes, thanksList, followUps, events, settings })
    }, 350)

    return () => {
      if (saveTimer.current) {
        window.clearTimeout(saveTimer.current)
      }
    }
  }, [hydrated, pets, applications, fosterHomes, thanksList, followUps, events, settings, persistDashboardState])

  // Filters
  const [petSearchTerm, setPetSearchTerm] = useState('')
  const [appSearchTerm, setAppSearchTerm] = useState('')
  const [fosterSearchTerm, setFosterSearchTerm] = useState('')
  const [filterSpecies, setFilterSpecies] = useState<string>('Todos')
  const [filterStatus, setFilterStatus] = useState<string>('Todos')
  const [appFilterStatus, setAppFilterStatus] = useState<string>('Todos')
  const [fosterFilterStatus, setFosterFilterStatus] = useState<string>('Todos')

  // Registration & Editing state for Pet
  const [editingPet, setEditingPet] = useState<Pet | null>(null)
  const [deletePetTarget, setDeletePetTarget] = useState<{ id: string; name: string } | null>(null)
  const [deleteFosterTarget, setDeleteFosterTarget] = useState<{ id: string; name: string } | null>(null)
  const [deleteThankTarget, setDeleteThankTarget] = useState<{ id: string; name: string } | null>(null)
  const [deleteFollowUpTarget, setDeleteFollowUpTarget] = useState<{ id: string; petName: string; adopterName: string } | null>(null)
  const [deleteEventTarget, setDeleteEventTarget] = useState<{ id: string; title: string } | null>(null)
  const [pendingAppStatusTarget, setPendingAppStatusTarget] = useState<{ id: string; status: AdoptionApplication['status']; applicantName: string; petName: string } | null>(null)
  const [pendingApproveTarget, setPendingApproveTarget] = useState<AdoptionApplication | null>(null)
  const [petFormActionSuccess, setPetFormActionSuccess] = useState<string | null>(null)
  const [appStatusSuccess, setAppStatusSuccess] = useState<string | null>(null)
  const [newPet, setNewPet] = useState(createEmptyPetForm())
  const [registerSuccess, setRegisterSuccess] = useState(false)
  const [settingsSuccess, setSettingsSuccess] = useState(false)
  const [applicationActionError, setApplicationActionError] = useState<string | null>(null)

  // New Foster Home Modal State
  const [showAddFosterModal, setShowAddFosterModal] = useState(false)
  const [newFoster, setNewFoster] = useState(createEmptyFosterForm())

  // New Thank Modal State
  const [showAddThankModal, setShowAddThankModal] = useState(false)
  const [newThank, setNewThank] = useState(createEmptyThankForm())
  const [uploadingThankImage, setUploadingThankImage] = useState(false)

  // Adoption Follow-up State
  // Events State
  const [newEvent, setNewEvent] = useState(createEmptyEventForm())
  const [editingEvent, setEditingEvent] = useState<ShelterEvent | null>(null)
  const [uploadingEventImage, setUploadingEventImage] = useState(false)

  // Settings Sub-tab state
  const [settingsSection, setSettingsSection] = useState<'general' | 'forms' | 'appearance' | 'support' | 'location' | 'legal'>('general')

  // Form Field Builder States (Dynamic Web Inputs)
  const [newFieldTarget, setNewFieldTarget] = useState<'adoption' | 'foster'>('adoption')
  const [newFieldLabel, setNewFieldLabel] = useState('')
  const [newFieldType, setNewFieldType] = useState<CustomFieldType>('text')
  const [newFieldPlaceholder, setNewFieldPlaceholder] = useState('')
  const [newFieldRequired, setNewFieldRequired] = useState(true)
  const [newFieldOptionsRaw, setNewFieldOptionsRaw] = useState('') // Separadas por coma para 'select'

  // Handlers for App status changes
  const handleUpdateAppStatus = (appId: string, newStatus: AdoptionApplication['status']) => {
    setApplications(prev => prev.map(app => app.id === appId ? { ...app, status: newStatus } : app))
  }

  const handleRequestAppStatusChange = (appId: string, newStatus: AdoptionApplication['status'], applicantName: string, petName: string) => {
    setPendingAppStatusTarget({ id: appId, status: newStatus, applicantName, petName })
  }

  const handleConfirmAppStatusChange = () => {
    if (!pendingAppStatusTarget) return
    const { id, status, applicantName, petName } = pendingAppStatusTarget
    setApplications(prev => prev.map(app => app.id === id ? { ...app, status } : app))
    setPendingAppStatusTarget(null)
    const label = status === 'Rechazada' ? `Solicitud de ${applicantName} rechazada.` : status === 'En revisión' ? `Solicitud de ${applicantName} marcada en revisión.` : `Estado de ${applicantName} (${petName}) actualizado a ${status}.`
    setAppStatusSuccess(label)
    setTimeout(() => setAppStatusSuccess(null), 3000)
  }

  const handleRequestApproveApplication = (app: AdoptionApplication) => {
    setPendingApproveTarget(app)
  }

  const handleConfirmApproveApplication = () => {
    if (!pendingApproveTarget) return
    const app = pendingApproveTarget
    const checksComplete = Object.values(app.verification).every(Boolean)
    const requiredDocuments = ['Identificación oficial', 'Comprobante de domicilio']
    const documentsComplete = requiredDocuments.every((type) => app.documents.some((document) => document.type === type && document.url))
    if (!checksComplete || !documentsComplete) {
      setApplicationActionError(`No se puede aprobar ${app.applicantName}: completa todos los puntos de verificación y carga identificación y comprobante de domicilio.`)
      setPendingApproveTarget(null)
      return
    }
    setApplicationActionError(null)
    setApplications(prev => prev.map(current => current.id === app.id
      ? { ...current, status: 'Aprobada', reviewedAt: new Date().toISOString() }
      : current))
    setPets(prev => prev.map(pet => pet.id === app.petId ? { ...pet, status: 'En Proceso' } : pet))
    setFollowUps(prev => {
      if (prev.some(followUp => followUp.applicationId === app.id)) return prev
      return [{
        ...createEmptyFollowUpForm(),
        id: `fu-${Date.now()}`,
        applicationId: app.id,
        petId: app.petId || undefined,
        petName: app.petName,
        adopterName: app.applicantName,
        adopterEmail: app.applicantEmail,
        adopterPhone: app.applicantPhone,
        adopterAddress: app.applicantAddress,
        adopterCity: app.applicantCity,
        processStage: 'Pendiente',
        nextFollowUpDate: '',
      }, ...prev]
    })
    setPendingApproveTarget(null)
    setAppStatusSuccess(`Solicitud de ${app.applicantName} aprobada. Se creó el seguimiento para ${app.petName}.`)
    setTimeout(() => setAppStatusSuccess(null), 3000)
  }

  const handleUpdateAppVerification = (appId: string, key: keyof AdoptionApplication['verification'], value: boolean) => {
    setApplications(prev => prev.map(app => app.id === appId
      ? { ...app, verification: { ...app.verification, [key]: value } }
      : app))
  }

  const handleApproveApplication = (app: AdoptionApplication) => {
    const checksComplete = Object.values(app.verification).every(Boolean)
    const requiredDocuments = ['Identificación oficial', 'Comprobante de domicilio']
    const documentsComplete = requiredDocuments.every((type) => app.documents.some((document) => document.type === type && document.url))

    if (!checksComplete || !documentsComplete) {
      setApplicationActionError(`No se puede aprobar ${app.applicantName}: completa todos los puntos de verificación y carga identificación y comprobante de domicilio.`)
      return
    }

    setApplicationActionError(null)
    setApplications(prev => prev.map(current => current.id === app.id
      ? { ...current, status: 'Aprobada', reviewedAt: new Date().toISOString() }
      : current))
    setPets(prev => prev.map(pet => pet.id === app.petId ? { ...pet, status: 'En Proceso' } : pet))

    setFollowUps(prev => {
      if (prev.some(followUp => followUp.applicationId === app.id)) return prev
      return [{
        ...createEmptyFollowUpForm(),
        id: `fu-${Date.now()}`,
        applicationId: app.id,
        petId: app.petId || undefined,
        petName: app.petName,
        adopterName: app.applicantName,
        adopterEmail: app.applicantEmail,
        adopterPhone: app.applicantPhone,
        adopterAddress: app.applicantAddress,
        adopterCity: app.applicantCity,
        processStage: 'Pendiente',
        nextFollowUpDate: '',
      }, ...prev]
    })
  }

  // Handlers for Pet Status changes
  const handleUpdatePetStatus = (petId: string, newStatus: Pet['status']) => {
    setPets(prev => prev.map(pet => pet.id === petId ? { ...pet, status: newStatus } : pet))
  }

  const handleSetFeaturedPet = (petId: string) => {
    setPets(prev => prev.map(pet => ({ ...pet, featured: pet.id === petId })))
  }

  // Delete Pet Handler
  const handleDeletePet = (petId: string, petName: string) => {
    setDeletePetTarget({ id: petId, name: petName })
  }

  const handleConfirmDeletePet = () => {
    if (!deletePetTarget) return
    setPets(prev => prev.filter(p => p.id !== deletePetTarget.id))
    setPetFormActionSuccess(`El perfil de ${deletePetTarget.name} ha sido eliminado.`)
    setDeletePetTarget(null)
    setTimeout(() => setPetFormActionSuccess(null), 3000)
  }

  // Open Edit Form Handler
  const handleStartEditPet = (pet: Pet) => {
    setEditingPet(pet)
    setNewPet({
      name: pet.name,
      species: pet.species,
      breed: pet.breed,
      age: pet.age,
      gender: pet.gender,
      size: pet.size,
      location: pet.location,
      image: pet.image,
        images: pet.images?.length ? pet.images : [pet.image],
      story: pet.story,
      healthInput: pet.health.join(', '),
      personalityInput: pet.personality.join(', ')
    })
    setActiveTab('register-pet')
  }

  // Cancel Editing
  const handleCancelEdit = () => {
    setEditingPet(null)
    setNewPet(createEmptyPetForm(settings))
    setActiveTab('pets')
  }

  const handleStartCreatePet = () => {
    setEditingPet(null)
    setRegisterSuccess(false)
    setNewPet(createEmptyPetForm(settings))
    setActiveTab('register-pet')
  }

  // Sincroniza ubicación por defecto cuando se cargan los settings del refugio
  useEffect(() => {
    if (!hydrated || editingPet || activeTab !== 'register-pet') return
    const expected = getDefaultPetLocation(settings)
    if (newPet.location === 'Ubicación del refugio' || newPet.location === 'CDMX (Refugio Central)') {
      setNewPet((prev) => ({ ...prev, location: expected }))
    }
  }, [settings, hydrated, editingPet, activeTab, newPet.location])

  // Add Custom Web Input Field Handler
  const handleAddCustomField = (targetForm: 'adoption' | 'foster') => {
    if (!newFieldLabel.trim()) return

    const createdField: CustomFormField = {
      id: `field-${Date.now()}`,
      label: newFieldLabel.trim(),
      type: newFieldType,
      placeholder: newFieldPlaceholder.trim() || undefined,
      required: newFieldRequired,
      options: newFieldType === 'select' 
        ? newFieldOptionsRaw.split(',').map(o => o.trim()).filter(Boolean)
        : undefined
    }

    if (targetForm === 'adoption') {
      setSettings(prev => ({
        ...prev,
        adoptionFormFields: [...prev.adoptionFormFields, createdField]
      }))
    } else {
      setSettings(prev => ({
        ...prev,
        fosterFormFields: [...prev.fosterFormFields, createdField]
      }))
    }

    // Reset temporary states
    setNewFieldLabel('')
    setNewFieldType('text')
    setNewFieldPlaceholder('')
    setNewFieldRequired(true)
    setNewFieldOptionsRaw('')
  }

  // Remove Custom Field
  const handleRemoveCustomField = (targetForm: 'adoption' | 'foster', fieldId: string) => {
    if (targetForm === 'adoption') {
      setSettings(prev => ({
        ...prev,
        adoptionFormFields: prev.adoptionFormFields.filter(f => f.id !== fieldId)
      }))
    } else {
      setSettings(prev => ({
        ...prev,
        fosterFormFields: prev.fosterFormFields.filter(f => f.id !== fieldId)
      }))
    }
  }

  // Foster Home Handlers
  const handleCreateFoster = (e: React.FormEvent) => {
    e.preventDefault()
    const fosterToAdd: FosterHome = {
      id: `fh-${Date.now()}`,
      name: newFoster.name,
      email: newFoster.email,
      phone: newFoster.phone,
      address: newFoster.address,
      city: newFoster.city,
      homeType: newFoster.homeType,
      yard: newFoster.yard,
      preferredSpecies: newFoster.preferredSpecies,
      maxCapacity: Number(newFoster.maxCapacity) || 1,
      currentPetsCount: 0,
      status: 'Disponible',
      notes: newFoster.notes || 'Hogar temporal dispuesto a brindar refugio.',
      registeredDate: 'Hoy',
      customResponses: newFoster.customResponses
    }
    setFosterHomes(prev => [fosterToAdd, ...prev])
    setShowAddFosterModal(false)
    setNewFoster(createEmptyFosterForm())
  }

  const handleUpdateFosterStatus = (id: string, status: FosterHome['status']) => {
    setFosterHomes(prev => prev.map(f => f.id === id ? { ...f, status } : f))
  }

  const handleDeleteFoster = (id: string, name: string) => {
    setDeleteFosterTarget({ id, name })
  }
  const handleConfirmDeleteFoster = () => {
    if (!deleteFosterTarget) return
    setFosterHomes(prev => prev.filter(f => f.id !== deleteFosterTarget.id))
    setDeleteFosterTarget(null)
  }

  // Thanks Handlers
  const handleCreateThank = (e: React.FormEvent) => {
    e.preventDefault()
    const thankToAdd: SponsorThank = {
      id: `th-${Date.now()}`,
      name: newThank.name,
      role: newThank.role,
      amountOrContribution: newThank.amountOrContribution,
      message: newThank.message,
      avatarUrl: newThank.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
      date: 'Hoy',
      isPublic: newThank.isPublic
    }
    setThanksList(prev => [thankToAdd, ...prev])
    setShowAddThankModal(false)
    setNewThank(createEmptyThankForm())
  }

  const handleToggleThankPublic = (id: string) => {
    setThanksList(prev => prev.map(t => t.id === id ? { ...t, isPublic: !t.isPublic } : t))
  }

  const handleDeleteThank = (id: string, name?: string) => {
    const targetName = name ?? thanksList.find(t => t.id === id)?.name ?? 'esta nota'
    setDeleteThankTarget({ id, name: targetName })
  }
  const handleConfirmDeleteThank = () => {
    if (!deleteThankTarget) return
    setThanksList(prev => prev.filter(t => t.id !== deleteThankTarget.id))
    setDeleteThankTarget(null)
  }

  const handleUpdateFollowUpStage = (followUpId: string, processStage: AdoptionFollowUp['processStage']) => {
    setFollowUps(prev => prev.map(followUp => followUp.id === followUpId ? { ...followUp, processStage } : followUp))
    if (processStage === 'Entregado') {
      setPets(prev => prev.map(pet => {
        const followUp = followUps.find(item => item.id === followUpId)
        return followUp?.petId && pet.id === followUp.petId ? { ...pet, status: 'Adoptado' } : pet
      }))
    }
  }

  const handleUpdateFollowUpChecks = (followUpId: string, key: keyof AdoptionFollowUp['followUpChecks'], value: boolean) => {
    setFollowUps(prev => prev.map(followUp => {
      if (followUp.id !== followUpId) return followUp
      const followUpChecks = { ...followUp.followUpChecks, [key]: value }
      const verificationStatus = Object.values(followUpChecks).every(Boolean)
        ? 'En cumplimiento'
        : Object.values(followUpChecks).some(Boolean)
          ? 'Requiere atención'
          : 'Pendiente'
      return { ...followUp, followUpChecks, verificationStatus }
    }))
  }

  const handleUpdateFollowUpDetails = (followUpId: string, changes: Partial<Pick<AdoptionFollowUp, 'lastContactDate' | 'nextFollowUpDate' | 'incidents'>>) => {
    setFollowUps(prev => prev.map(followUp => followUp.id === followUpId ? { ...followUp, ...changes } : followUp))
  }

  const handleDeleteFollowUp = (followUpId: string, petName: string, adopterName: string) => {
    setDeleteFollowUpTarget({ id: followUpId, petName, adopterName })
  }
  const handleConfirmDeleteFollowUp = () => {
    if (!deleteFollowUpTarget) return
    setFollowUps(prev => prev.filter(followUp => followUp.id !== deleteFollowUpTarget.id))
    setDeleteFollowUpTarget(null)
  }

  const handleStartFollowUpFromApplication = () => setActiveTab('adoption-followups')

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault()

    if (!newEvent.title.trim() || !newEvent.eventDate.trim() || !newEvent.location.trim()) return

    const eventToSave: ShelterEvent = {
      id: editingEvent?.id || `evt-${Date.now()}`,
      title: newEvent.title.trim(),
      image: newEvent.image || '/events.png',
      category: newEvent.category,
      status: newEvent.status,
      eventDate: newEvent.eventDate.trim(),
      eventTime: newEvent.eventTime.trim(),
      location: newEvent.location.trim(),
      latitude: Number.isFinite(newEvent.latitude) ? newEvent.latitude : 19.4326,
      longitude: Number.isFinite(newEvent.longitude) ? newEvent.longitude : -99.1332,
      attendeesTarget: Number.isFinite(newEvent.attendeesTarget) ? newEvent.attendeesTarget : 0,
      contactName: newEvent.contactName.trim(),
      contactPhone: newEvent.contactPhone.trim(),
      registrationLink: newEvent.registrationLink.trim(),
      description: newEvent.description.trim(),
      notes: newEvent.notes.trim(),
    }

    setEvents(prev => editingEvent ? prev.map((event) => event.id === editingEvent.id ? eventToSave : event) : [eventToSave, ...prev])
    setNewEvent(createEmptyEventForm())
    setEditingEvent(null)
    setActiveTab('events')
  }

  const handleStartCreateEvent = () => {
    setEditingEvent(null)
    setNewEvent(createEmptyEventForm())
    setActiveTab('register-event')
  }

  const handleStartEditEvent = (event: ShelterEvent) => {
    setEditingEvent(event)
    setNewEvent({ ...event, latitude: event.latitude || 19.4326, longitude: event.longitude || -99.1332 })
    setActiveTab('register-event')
  }

  const handleEventImageUpload = async (file?: File) => {
    if (!file) return
    setUploadingEventImage(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const response = await fetch('/api/admin/uploads', { method: 'POST', body: formData })
      if (!response.ok) return
      const asset = await response.json() as { url?: string }
      if (asset.url) setNewEvent((current) => ({ ...current, image: asset.url || '/events.png' }))
    } finally {
      setUploadingEventImage(false)
    }
  }

  const handleUpdateEventStatus = (eventId: string, status: ShelterEvent['status']) => {
    setEvents(prev => prev.map(event => event.id === eventId ? { ...event, status } : event))
  }

  const handleDeleteEvent = (eventId: string, title: string) => {
    setDeleteEventTarget({ id: eventId, title })
  }
  const handleConfirmDeleteEvent = () => {
    if (!deleteEventTarget) return
    setEvents(prev => prev.filter(event => event.id !== deleteEventTarget.id))
    setDeleteEventTarget(null)
  }

  // Save Shelter Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault()

    const ok = await persistDashboardState({ pets, applications, fosterHomes, thanksList, followUps, events, settings })
    if (!ok) return

    setSettingsSuccess(true)
    setTimeout(() => {
      setSettingsSuccess(false)
    }, 2500)
  }

  const handleCloseFosterModal = () => {
    setShowAddFosterModal(false)
    setNewFoster(createEmptyFosterForm())
  }

  const handleCloseThankModal = () => {
    setShowAddThankModal(false)
    setNewThank(createEmptyThankForm())
  }

  const handleImageUpload = async (target: 'logo' | 'hero', file?: File) => {
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setImageUploadError('Selecciona un archivo de imagen válido.')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      setImageUploadError('La imagen no puede superar los 10 MB.')
      return
    }

    const formData = new FormData()
    formData.append('file', file)

    setImageUploadError(null)
    setUploadingImage(target)
    try {
      const response = await fetch('/api/admin/uploads', { method: 'POST', body: formData })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const asset = await response.json() as { url: string }

      setSettings(prev => target === 'logo'
        ? { ...prev, logoUrl: asset.url }
        : { ...prev, heroBannerUrl: asset.url })
    } catch (error) {
      console.error('Error al subir imagen:', error)
      setImageUploadError('No se pudo subir la imagen. Intenta nuevamente.')
    } finally {
      setUploadingImage(null)
    }
  }

  const handleThankImageUpload = async (file?: File) => {
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)
    setUploadingThankImage(true)

    try {
      const response = await fetch('/api/admin/uploads', { method: 'POST', body: formData })
      if (!response.ok) throw new Error('Upload failed')

      const asset = await response.json() as { url: string }
      setNewThank(prev => ({ ...prev, avatarUrl: asset.url }))
    } catch (error) {
      console.error('Error al subir la foto del agradecimiento:', error)
    } finally {
      setUploadingThankImage(false)
    }
  }

  const handlePetImagesUpload = async (files: FileList | null) => {
    if (!files?.length) return

    const uploadedImages = await Promise.all(Array.from(files).map(async (file) => {
      const formData = new FormData()
      formData.append('file', file)
      const response = await fetch('/api/admin/uploads', { method: 'POST', body: formData })
      if (!response.ok) throw new Error('Upload failed')
      const asset = await response.json() as { url: string }
      return asset.url
    }))

    setNewPet(prev => ({
      ...prev,
      images: [...prev.images, ...uploadedImages],
      image: prev.image || uploadedImages[0] || '',
    }))
  }

  // Add / Edit Pet submission
  const handleCreateOrUpdatePet = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingPet) {
      setPets(prev => prev.map(p => {
        if (p.id === editingPet.id) {
          return {
            ...p,
            name: newPet.name,
            species: newPet.species,
            breed: newPet.breed || 'Mestizo',
            age: newPet.age || 'Edad no especificada',
            gender: newPet.gender,
            size: newPet.size,
            location: newPet.location,
            image: newPet.image || p.image,
            images: newPet.images.length > 0 ? newPet.images : (p.images?.length ? p.images : [p.image]),
            featured: p.featured,
            health: newPet.healthInput.split(',').map(s => s.trim()).filter(Boolean),
            personality: newPet.personalityInput.split(',').map(s => s.trim()).filter(Boolean),
            story: newPet.story || p.story
          }
        }
        return p
      }))
      setRegisterSuccess(true)
      setTimeout(() => {
        setRegisterSuccess(false)
        handleCancelEdit()
      }, 1500)
    } else {
      const petToAdd: Pet = {
        id: `pet-${Date.now()}`,
        name: newPet.name,
        species: newPet.species,
        breed: newPet.breed || 'Mestizo',
        age: newPet.age || 'Edad no especificada',
        gender: newPet.gender,
        size: newPet.size,
        status: 'Disponible',
        location: newPet.location,
        image: newPet.image || DEFAULT_IMAGE_URL,
        images: newPet.images.length > 0 ? newPet.images : [newPet.image || DEFAULT_IMAGE_URL],
        featured: false,
        health: newPet.healthInput.split(',').map(s => s.trim()).filter(Boolean),
        personality: newPet.personalityInput.split(',').map(s => s.trim()).filter(Boolean),
        story: newPet.story || 'Mascota lista para encontrar una familia llena de amor.',
        views: 1,
        applicationsCount: 0
      }

      setPets(prev => [petToAdd, ...prev])
      setRegisterSuccess(true)
      setTimeout(() => {
        setRegisterSuccess(false)
        setNewPet(createEmptyPetForm(settings))
        setActiveTab('pets')
      }, 1500)
    }
  }

  // Filtered lists
  const filteredPetsList = pets.filter(pet => {
    const matchesSearch = pet.name.toLowerCase().includes(petSearchTerm.toLowerCase()) || 
                          pet.breed.toLowerCase().includes(petSearchTerm.toLowerCase())
    const matchesSpecies = filterSpecies === 'Todos' || pet.species === filterSpecies
    const matchesStatus = filterStatus === 'Todos' || pet.status === filterStatus
    return matchesSearch && matchesSpecies && matchesStatus
  })

  const filteredAppsList = applications.filter(app => {
    const matchesSearch = app.applicantName.toLowerCase().includes(appSearchTerm.toLowerCase()) ||
                          app.petName.toLowerCase().includes(appSearchTerm.toLowerCase())
    const matchesStatus = appFilterStatus === 'Todos' || app.status === appFilterStatus
    return matchesSearch && matchesStatus
  })

  const filteredFosterList = fosterHomes.filter(foster => {
    const matchesSearch = foster.name.toLowerCase().includes(fosterSearchTerm.toLowerCase()) ||
                          foster.city.toLowerCase().includes(fosterSearchTerm.toLowerCase())
    const matchesStatus = fosterFilterStatus === 'Todos' || foster.status === fosterFilterStatus
    return matchesSearch && matchesStatus
  })

  // Stats calculation
  const totalPets = pets.length
  const availablePets = pets.filter(p => p.status === 'Disponible').length
  const inProcessPets = pets.filter(p => p.status === 'En Proceso').length
  const adoptedPets = pets.filter(p => p.status === 'Adoptado').length
  const pendingApps = applications.filter(a => a.status === 'Pendiente' || a.status === 'En revisión').length
  const activeFosters = fosterHomes.filter(f => f.status === 'Activa' || f.status === 'Disponible').length

  // Helper icon for field type
  const getFieldTypeIcon = (type: CustomFieldType) => {
    switch (type) {
      case 'text': return <FileText className="size-3.5" />
      case 'email': return <Mail className="size-3.5" />
      case 'tel': return <Phone className="size-3.5" />
      case 'date': return <CalendarDays className="size-3.5" />
      case 'number': return <Hash className="size-3.5" />
      case 'select': return <ListFilter className="size-3.5" />
      case 'boolean': return <ToggleLeft className="size-3.5" />
      case 'textarea': return <MessageSquare className="size-3.5" />
      default: return <FileText className="size-3.5" />
    }
  }

  const dashboardView = {
    activeTab,
    setActiveTab,
    applications,
    totalPets,
    activeFosters,
    pendingApps,
    adoptedPets,
    availablePets,
    inProcessPets,
    settings,
    petSearchTerm,
    setPetSearchTerm,
    appSearchTerm,
    setAppSearchTerm,
    fosterSearchTerm,
    setFosterSearchTerm,
    appFilterStatus,
    setAppFilterStatus,
    filteredAppsList,
    handleUpdateAppStatus,
    handleApproveApplication,
    handleRequestAppStatusChange,
    handleRequestApproveApplication,
    handleUpdateAppVerification,
    applicationActionError,
    appStatusSuccess,
    fosterFilterStatus,
    setFosterFilterStatus,
    filteredFosterList,
    handleUpdateFosterStatus,
    handleDeleteFoster,
    setShowAddFosterModal,
    setShowAddThankModal,
    thanksList,
    handleToggleThankPublic,
    handleDeleteThank,
    followUps,
    handleUpdateFollowUpStage,
    handleUpdateFollowUpChecks,
    handleUpdateFollowUpDetails,
    handleDeleteFollowUp,
    handleStartFollowUpFromApplication,
    events,
    newEvent,
    setNewEvent,
    editingEvent,
    handleCreateEvent,
    handleStartCreateEvent,
    handleStartEditEvent,
    uploadingEventImage,
    handleEventImageUpload,
    handleUpdateEventStatus,
    handleDeleteEvent,
    settingsSection,
    setSettingsSection,
    setSettings,
    newFieldTarget,
    setNewFieldTarget,
    newFieldLabel,
    setNewFieldLabel,
    newFieldType,
    setNewFieldType,
    newFieldPlaceholder,
    setNewFieldPlaceholder,
    newFieldRequired,
    setNewFieldRequired,
    newFieldOptionsRaw,
    setNewFieldOptionsRaw,
    handleAddCustomField,
    handleRemoveCustomField,
    getFieldTypeIcon,
    uploadingImage,
    imageUploadError,
    handleImageUpload,
    handleSaveSettings,
    settingsSuccess,
    showAddFosterModal,
    newFoster,
    setNewFoster,
    handleCreateFoster,
    handleCloseFosterModal,
    showAddThankModal,
    newThank,
    uploadingThankImage,
    setNewThank,
    handleThankImageUpload,
    handleCreateThank,
    handleCloseThankModal,
    filteredPetsList,
    handleStartEditPet,
    handleDeletePet,
    handleUpdatePetStatus,
    handleSetFeaturedPet,
    newPet,
    editingPet,
    registerSuccess,
    setNewPet,
    handleCreateOrUpdatePet,
    handleCancelEdit,
    handlePetImagesUpload,
    mobileMenuOpen,
    setMobileMenuOpen,
    handleLogout,
    handleStartCreatePet,
  }

  return (
    <DashboardProvider value={dashboardView}>
      <div className="min-h-screen bg-background text-foreground flex flex-col md:h-screen md:flex-row md:overflow-hidden">
      <DashboardSidebar />

      {/* Main Content Area */}
      <main className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        {/* Header bar inside Dashboard */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              {activeTab === 'overview' && 'Panel de Control del Refugio'}
              {activeTab === 'pets' && 'Listado de Mascotas'}
              {activeTab === 'register-pet' && (editingPet ? `Editar Perfil: ${editingPet.name}` : 'Ficha de Mascota')}
              {activeTab === 'applications' && 'Solicitudes de Adopción'}
              {activeTab === 'foster-homes' && 'Red de Casas Puente (Hogares Temporales)'}
              {activeTab === 'thanks' && 'Módulo de Agradecimientos & Donantes'}
              {activeTab === 'adoption-followups' && 'Seguimiento de Adopciones'}
              {activeTab === 'contracts' && 'Contratos de Adopción'}
              {activeTab === 'events' && 'Eventos del Refugio'}
              {activeTab === 'register-event' && 'Crear Evento'}
              {activeTab === 'settings' && 'Configuración General del Refugio'}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {activeTab === 'overview' && 'Administra perfiles de rescatados, aprueba solicitudes y monitorea el estado del refugio.'}
              {activeTab === 'pets' && 'Listado completo de animales. Puedes editar perfiles, cambiar su estado o eliminarlos.'}
              {activeTab === 'register-pet' && (editingPet ? 'Actualiza los datos, fotos e historial médico del rescatado.' : 'Consulta y ajusta la información de la mascota.')}
              {activeTab === 'applications' && 'Revisa los expedientes completos y respuestas de los posibles adoptantes.'}
              {activeTab === 'foster-homes' && 'Directorio de voluntarios registrados para dar alojamiento temporal a rescatados.'}
              {activeTab === 'thanks' && 'Reconoce públicamente a donantes, empresas y voluntarios que sostienen al refugio.'}
              {activeTab === 'adoption-followups' && 'Registra quién adoptó, en qué etapa va el proceso y qué revisiones siguen para dar seguimiento.'}
              {activeTab === 'contracts' && 'Accede a cada contrato ya generado y abre su vista pública lista para imprimir o descargar.'}
              {activeTab === 'events' && 'Administra jornadas, campañas y actividades del refugio con fechas, cupos y responsables.'}
              {activeTab === 'register-event' && 'Crea una actividad con toda la información que verá tu comunidad.'}
              {activeTab === 'settings' && 'Crea inputs web dinámicos (Texto, Email, Fecha, Booleanos), reglas y personalización.'}
            </p>
          </div>

          {activeTab === 'foster-homes' && (
            <button
              onClick={() => setShowAddFosterModal(true)}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:scale-[1.02]"
            >
              <UserPlus className="size-4" />
              Registrar Casa Puente
            </button>
          )}

          {activeTab === 'thanks' && (
            <button
              onClick={() => setShowAddThankModal(true)}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:scale-[1.02]"
            >
              <Plus className="size-4" />
              Nuevo Agradecimiento
            </button>
          )}

          {activeTab === 'adoption-followups' && (
            <div className="rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-xs font-medium text-primary">Los seguimientos se crean al aprobar una solicitud</div>
          )}

          {activeTab === 'contracts' && (
            <button
              onClick={() => setActiveTab('adoption-followups')}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:scale-[1.02]"
            >
              <Plus className="size-4" />
              Ir a seguimientos
            </button>
          )}

          {activeTab === 'events' && (
            <button
              onClick={handleStartCreateEvent}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:scale-[1.02]"
            >
              <Plus className="size-4" />
              Nuevo Evento
            </button>
          )}

        </div>

        {/* Action alert / Notification */}
        {petFormActionSuccess && (
          <div className="mb-6 p-4 rounded-xl bg-amber-500 text-white flex items-center justify-between shadow-sm animate-in fade-in">
            <div className="flex items-center gap-2.5 text-sm font-medium">
              <CheckCircle2 className="size-5" />
              {petFormActionSuccess}
            </div>
          </div>
        )}
        {appStatusSuccess && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-600 text-white flex items-center justify-between shadow-sm animate-in fade-in">
            <div className="flex items-center gap-2.5 text-sm font-medium">
              <CheckCircle2 className="size-5" />
              {appStatusSuccess}
            </div>
          </div>
        )}

        {/* OVERVIEW TAB */}
        <DashboardOverviewTab />
        <DashboardApplicationsTab />

        <DashboardFosterHomesTab />

        <DashboardThanksTab />

        <DashboardAdoptionFollowUpsTab />

        <DashboardContractsTab />

        <DashboardEventsTab />
        <DashboardEventCreateScreen />

        <DashboardSettingsTab />

      </main>

      <DashboardFosterModal />

      <ThankModal
        open={showAddThankModal}
        value={newThank}
        uploadingImage={uploadingThankImage}
        onChange={setNewThank}
        onUploadImage={handleThankImageUpload}
        onSubmit={handleCreateThank}
        onClose={handleCloseThankModal}
      />
      {deletePetTarget && <DeleteConfirmDialog petName={deletePetTarget.name} onCancel={() => setDeletePetTarget(null)} onConfirm={handleConfirmDeletePet} />}
      {deleteFosterTarget && <DeleteConfirmDialog petName={deleteFosterTarget.name} title={`¿Eliminar casa puente ${deleteFosterTarget.name}?`} description={`Se eliminará el registro de ${deleteFosterTarget.name} de la red de casas puente.`} onCancel={() => setDeleteFosterTarget(null)} onConfirm={handleConfirmDeleteFoster} />}
      {deleteThankTarget && <DeleteConfirmDialog petName={deleteThankTarget.name} title={`¿Eliminar agradecimiento a ${deleteThankTarget.name}?`} description={`Se eliminará el agradecimiento a ${deleteThankTarget.name}.`} onCancel={() => setDeleteThankTarget(null)} onConfirm={handleConfirmDeleteThank} />}
      {deleteFollowUpTarget && <DeleteConfirmDialog petName={deleteFollowUpTarget.petName} title={`¿Eliminar seguimiento de ${deleteFollowUpTarget.petName}?`} description={`Se eliminará el seguimiento de ${deleteFollowUpTarget.petName} (adoptante: ${deleteFollowUpTarget.adopterName}).`} onCancel={() => setDeleteFollowUpTarget(null)} onConfirm={handleConfirmDeleteFollowUp} />}
      {deleteEventTarget && <DeleteConfirmDialog petName={deleteEventTarget.title} title={`¿Eliminar evento ${deleteEventTarget.title}?`} description={`Se eliminará el evento &quot;${deleteEventTarget.title}&quot;. Esta acción no se puede deshacer.`} onCancel={() => setDeleteEventTarget(null)} onConfirm={handleConfirmDeleteEvent} />}
      {pendingAppStatusTarget && (
        <DeleteConfirmDialog
          variant={pendingAppStatusTarget.status === 'Rechazada' ? 'danger' : 'info'}
          title={pendingAppStatusTarget.status === 'Rechazada' ? `¿Rechazar solicitud de ${pendingAppStatusTarget.applicantName}?` : `¿Marcar en revisión a ${pendingAppStatusTarget.applicantName}?`}
          description={pendingAppStatusTarget.status === 'Rechazada' ? `Se marcará como Rechazada la solicitud de ${pendingAppStatusTarget.applicantName} para ${pendingAppStatusTarget.petName}.` : `Se cambiará el estado de la solicitud de ${pendingAppStatusTarget.applicantName} para ${pendingAppStatusTarget.petName} a “En revisión”.`}
          cancelLabel="Cancelar"
          confirmLabel={pendingAppStatusTarget.status === 'Rechazada' ? 'Rechazar solicitud' : 'Marcar en revisión'}
          onCancel={() => setPendingAppStatusTarget(null)}
          onConfirm={handleConfirmAppStatusChange}
        />
      )}
      {pendingApproveTarget && (
        <DeleteConfirmDialog
          variant="success"
          title={`¿Aprobar solicitud de ${pendingApproveTarget.applicantName}?`}
          description={`Se aprobará la adopción de ${pendingApproveTarget.petName} para ${pendingApproveTarget.applicantName}. Se creará el seguimiento y la mascota pasará a “En Proceso”.`}
          cancelLabel="Cancelar"
          confirmLabel="Aprobar adopción"
          onCancel={() => setPendingApproveTarget(null)}
          onConfirm={handleConfirmApproveApplication}
        />
      )}
      </div>
    </DashboardProvider>
  )
}
