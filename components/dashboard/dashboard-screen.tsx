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
import { type AdoptionFollowUp, type ShelterEvent } from '@/lib/dashboard-defaults'
import { DashboardOverviewTab } from '@/components/dashboard/dashboard-overview-tab'
import { DashboardApplicationsTab } from '@/components/dashboard/dashboard-applications-tab'
import { DashboardFosterHomesTab } from '@/components/dashboard/dashboard-foster-homes-tab'
import { DashboardThanksTab } from '@/components/dashboard/dashboard-thanks-tab'
import { DashboardAdoptionFollowUpsTab } from '@/components/dashboard/dashboard-adoption-followups-tab'
import { DashboardEventsTab } from '@/components/dashboard/dashboard-events-tab'
import { DashboardSettingsTab } from '@/components/dashboard/dashboard-settings-tab'
import { DashboardFosterModal } from '@/components/dashboard/dashboard-foster-modal'
import { DashboardSidebar } from '@/components/dashboard/dashboard-sidebar'
import { DashboardProvider } from '@/components/dashboard/dashboard-context'

// Types
type TabType = 'overview' | 'pets' | 'register-pet' | 'applications' | 'foster-homes' | 'thanks' | 'adoption-followups' | 'events' | 'settings'

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

interface AdoptionApplication {
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
  status: 'Pendiente' | 'En revisión' | 'Aprobada' | 'Rechazada'
  dateSubmitted: string
  experience: string
  customResponses?: Record<string, string | boolean>
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

const createEmptyPetForm = () => ({
  name: '',
  species: 'Perro' as 'Perro' | 'Gato' | 'Otro',
  breed: '',
  age: '',
  gender: 'Macho' as 'Macho' | 'Hembra',
  size: 'Mediano' as 'Pequeño' | 'Mediano' | 'Grande',
  location: 'CDMX (Refugio Central)',
  image: '',
  images: [] as string[],
  story: '',
  healthInput: 'Vacunas al día, Esterilizado',
  personalityInput: 'Amigable, Cariñoso',
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
})

const createEmptyEventForm = (): Omit<ShelterEvent, 'id'> => ({
  title: '',
  category: 'Adopción' as ShelterEvent['category'],
  status: 'Programado' as ShelterEvent['status'],
  eventDate: '',
  eventTime: '',
  location: '',
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
  const [searchTerm, setSearchTerm] = useState('')
  const [filterSpecies, setFilterSpecies] = useState<string>('Todos')
  const [filterStatus, setFilterStatus] = useState<string>('Todos')
  const [appFilterStatus, setAppFilterStatus] = useState<string>('Todos')
  const [fosterFilterStatus, setFosterFilterStatus] = useState<string>('Todos')

  // Registration & Editing state for Pet
  const [editingPet, setEditingPet] = useState<Pet | null>(null)
  const [petFormActionSuccess, setPetFormActionSuccess] = useState<string | null>(null)
  const [newPet, setNewPet] = useState(createEmptyPetForm())
  const [registerSuccess, setRegisterSuccess] = useState(false)
  const [settingsSuccess, setSettingsSuccess] = useState(false)

  // New Foster Home Modal State
  const [showAddFosterModal, setShowAddFosterModal] = useState(false)
  const [newFoster, setNewFoster] = useState(createEmptyFosterForm())

  // New Thank Modal State
  const [showAddThankModal, setShowAddThankModal] = useState(false)
  const [newThank, setNewThank] = useState(createEmptyThankForm())
  const [uploadingThankImage, setUploadingThankImage] = useState(false)

  // Adoption Follow-up State
  const [newFollowUp, setNewFollowUp] = useState(createEmptyFollowUpForm())

  // Events State
  const [newEvent, setNewEvent] = useState(createEmptyEventForm())

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

  // Handlers for Pet Status changes
  const handleUpdatePetStatus = (petId: string, newStatus: Pet['status']) => {
    setPets(prev => prev.map(pet => pet.id === petId ? { ...pet, status: newStatus } : pet))
  }

  const handleSetFeaturedPet = (petId: string) => {
    setPets(prev => prev.map(pet => ({ ...pet, featured: pet.id === petId })))
  }

  // Delete Pet Handler
  const handleDeletePet = (petId: string, petName: string) => {
    if (confirm(`¿Estás seguro de que deseas eliminar el perfil de ${petName}? Esta acción no se puede deshacer.`)) {
      setPets(prev => prev.filter(p => p.id !== petId))
      setPetFormActionSuccess(`El perfil de ${petName} ha sido eliminado.`)
      setTimeout(() => setPetFormActionSuccess(null), 3000)
    }
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
    setNewPet(createEmptyPetForm())
    setActiveTab('pets')
  }

  const handleStartCreatePet = () => {
    setEditingPet(null)
    setRegisterSuccess(false)
    setNewPet(createEmptyPetForm())
    setActiveTab('register-pet')
  }

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
    if (confirm(`¿Eliminar la casa puente de "${name}"?`)) {
      setFosterHomes(prev => prev.filter(f => f.id !== id))
    }
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

  const handleDeleteThank = (id: string) => {
    if (confirm('¿Eliminar esta nota de agradecimiento?')) {
      setThanksList(prev => prev.filter(t => t.id !== id))
    }
  }

  // Follow-up / Adoption tracking handlers
  const handleCreateFollowUp = (e: React.FormEvent) => {
    e.preventDefault()

    if (!newFollowUp.petName.trim() || !newFollowUp.adopterName.trim()) return

    const followUpToAdd: AdoptionFollowUp = {
      id: `fu-${Date.now()}`,
      petId: newFollowUp.petId?.trim() || undefined,
      petName: newFollowUp.petName.trim(),
      adopterName: newFollowUp.adopterName.trim(),
      adopterEmail: newFollowUp.adopterEmail.trim(),
      adopterPhone: newFollowUp.adopterPhone.trim(),
      adopterAddress: newFollowUp.adopterAddress.trim(),
      adopterCity: newFollowUp.adopterCity.trim(),
      adoptionDate: newFollowUp.adoptionDate.trim(),
      nextFollowUpDate: newFollowUp.nextFollowUpDate.trim(),
      processStage: newFollowUp.processStage,
      notes: newFollowUp.notes.trim(),
      carePlan: newFollowUp.carePlan.trim(),
    }

    setFollowUps(prev => [followUpToAdd, ...prev])
    setNewFollowUp(createEmptyFollowUpForm())
  }

  const handleUpdateFollowUpStage = (followUpId: string, processStage: AdoptionFollowUp['processStage']) => {
    setFollowUps(prev => prev.map(followUp => followUp.id === followUpId ? { ...followUp, processStage } : followUp))
  }

  const handleDeleteFollowUp = (followUpId: string, petName: string, adopterName: string) => {
    if (confirm(`¿Eliminar el seguimiento de ${petName} asociado a ${adopterName}?`)) {
      setFollowUps(prev => prev.filter(followUp => followUp.id !== followUpId))
    }
  }

  const handleStartFollowUpFromApplication = (app: AdoptionApplication) => {
    setActiveTab('adoption-followups')
    setNewFollowUp({
      ...createEmptyFollowUpForm(),
      petId: app.petId || '',
      petName: app.petName,
      adopterName: app.applicantName,
      adopterEmail: app.applicantEmail,
      adopterPhone: app.applicantPhone,
      processStage: 'Pendiente',
    })
  }

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault()

    if (!newEvent.title.trim() || !newEvent.eventDate.trim() || !newEvent.location.trim()) return

    const eventToAdd: ShelterEvent = {
      id: `evt-${Date.now()}`,
      title: newEvent.title.trim(),
      category: newEvent.category,
      status: newEvent.status,
      eventDate: newEvent.eventDate.trim(),
      eventTime: newEvent.eventTime.trim(),
      location: newEvent.location.trim(),
      attendeesTarget: Number.isFinite(newEvent.attendeesTarget) ? newEvent.attendeesTarget : 0,
      contactName: newEvent.contactName.trim(),
      contactPhone: newEvent.contactPhone.trim(),
      registrationLink: newEvent.registrationLink.trim(),
      description: newEvent.description.trim(),
      notes: newEvent.notes.trim(),
    }

    setEvents(prev => [eventToAdd, ...prev])
    setNewEvent(createEmptyEventForm())
  }

  const handleUpdateEventStatus = (eventId: string, status: ShelterEvent['status']) => {
    setEvents(prev => prev.map(event => event.id === eventId ? { ...event, status } : event))
  }

  const handleDeleteEvent = (eventId: string, title: string) => {
    if (confirm(`¿Eliminar el evento "${title}"?`)) {
      setEvents(prev => prev.filter(event => event.id !== eventId))
    }
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
        setNewPet(createEmptyPetForm())
        setActiveTab('pets')
      }, 1500)
    }
  }

  // Filtered lists
  const filteredPetsList = pets.filter(pet => {
    const matchesSearch = pet.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          pet.breed.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSpecies = filterSpecies === 'Todos' || pet.species === filterSpecies
    const matchesStatus = filterStatus === 'Todos' || pet.status === filterStatus
    return matchesSearch && matchesSpecies && matchesStatus
  })

  const filteredAppsList = applications.filter(app => {
    const matchesSearch = app.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          app.petName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = appFilterStatus === 'Todos' || app.status === appFilterStatus
    return matchesSearch && matchesStatus
  })

  const filteredFosterList = fosterHomes.filter(foster => {
    const matchesSearch = foster.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          foster.city.toLowerCase().includes(searchTerm.toLowerCase())
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
    searchTerm,
    setSearchTerm,
    appFilterStatus,
    setAppFilterStatus,
    filteredAppsList,
    handleUpdateAppStatus,
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
    newFollowUp,
    setNewFollowUp,
    handleCreateFollowUp,
    handleUpdateFollowUpStage,
    handleDeleteFollowUp,
    handleStartFollowUpFromApplication,
    events,
    newEvent,
    setNewEvent,
    handleCreateEvent,
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
              {activeTab === 'events' && 'Eventos del Refugio'}
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
              {activeTab === 'events' && 'Administra jornadas, campañas y actividades del refugio con fechas, cupos y responsables.'}
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
            <button
              onClick={() => setNewFollowUp(createEmptyFollowUpForm())}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:scale-[1.02]"
            >
              <Plus className="size-4" />
              Nuevo Seguimiento
            </button>
          )}

          {activeTab === 'events' && (
            <button
              onClick={() => setNewEvent(createEmptyEventForm())}
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

        {/* OVERVIEW TAB */}
        <DashboardOverviewTab />
        <DashboardApplicationsTab />

        <DashboardFosterHomesTab />

        <DashboardThanksTab />

        <DashboardAdoptionFollowUpsTab />

        <DashboardEventsTab />

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
      </div>
    </DashboardProvider>
  )
}
