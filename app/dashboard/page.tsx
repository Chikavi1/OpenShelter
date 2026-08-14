'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  PawPrint,
  Heart,
  FileText,
  PlusCircle,
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
  Lock
} from 'lucide-react'

// Types
type TabType = 'overview' | 'pets' | 'register-pet' | 'applications' | 'foster-homes' | 'thanks' | 'settings'

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
  logoUrl: string
  heroBannerUrl: string
  adoptionContractTerms: string
  shelterRules: string
  visitingHours: string
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

// Initial Mock Data
const INITIAL_PETS: Pet[] = [
  {
    id: 'pet-1',
    name: 'Milo',
    species: 'Perro',
    breed: 'Mestizo',
    age: '2 años',
    gender: 'Macho',
    size: 'Mediano',
    status: 'Disponible',
    location: 'CDMX (Refugio Central)',
    image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=900&q=85',
    health: ['Vacunas al día', 'Esterilizado', 'Desparasitado'],
    personality: ['Juguetón', 'Cariñoso', 'Sociable'],
    story: 'Fue rescatado en una zona concurrida y ha demostrado ser un compañero leal y vital.',
    views: 342,
    applicationsCount: 4
  },
  {
    id: 'pet-2',
    name: 'Luna',
    species: 'Gato',
    breed: 'Carey',
    age: '1 año',
    gender: 'Hembra',
    size: 'Pequeño',
    status: 'En Proceso',
    location: 'CDMX (Hogar Temporal)',
    image: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&w=900&q=85',
    health: ['Vacunas al día', 'Esterilizada'],
    personality: ['Tranquila', 'Observadora', 'Mimada'],
    story: 'Encontrada cuando era muy pequeña. Le encanta dormir en sofás suaves.',
    views: 218,
    applicationsCount: 2
  },
  {
    id: 'pet-3',
    name: 'Bruno',
    species: 'Perro',
    breed: 'Labrador Mestizo',
    age: '4 años',
    gender: 'Macho',
    size: 'Grande',
    status: 'Disponible',
    location: 'Toluca',
    image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=900&q=85',
    health: ['Vacunas al día', 'Esterilizado', 'Microchip'],
    personality: ['Noble', 'Protector', 'Activo'],
    story: 'Le encanta correr al aire libre y jugar a atrapar la pelota.',
    views: 405,
    applicationsCount: 5
  },
  {
    id: 'pet-4',
    name: 'Nube',
    species: 'Gato',
    breed: 'Blanco',
    age: '8 meses',
    gender: 'Hembra',
    size: 'Pequeño',
    status: 'Adoptado',
    location: 'Puebla',
    image: 'https://images.unsplash.com/photo-1495360010541-f48722b34f7d?auto=format&fit=crop&w=900&q=85',
    health: ['Vacunas al día', 'Esterilizada'],
    personality: ['Curiosa', 'Tierna'],
    story: 'Ya encontró su hogar definitivo y vive felizmente con su nueva familia.',
    views: 520,
    applicationsCount: 6
  }
]

const INITIAL_APPLICATIONS: AdoptionApplication[] = [
  {
    id: 'sol-101',
    applicantName: 'Carolina Mendoza',
    applicantEmail: 'carolina.m@example.com',
    applicantPhone: '+52 55 1234 5678',
    petName: 'Milo',
    petId: 'pet-1',
    petImage: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=900&q=85',
    homeType: 'Casa',
    hasOtherPets: true,
    yard: true,
    status: 'Pendiente',
    dateSubmitted: '14 de Agosto, 2026',
    experience: 'He tenido perros mestizos antes durante 10 años. Busco un compañero activo.',
    customResponses: {
      'birth_date': '1994-06-15',
      'has_had_dogs': true,
      'hours_alone': '4 horas'
    }
  },
  {
    id: 'sol-102',
    applicantName: 'Rodrigo Torres',
    applicantEmail: 'rodrigo.t@example.com',
    applicantPhone: '+52 55 9876 5432',
    petName: 'Luna',
    petId: 'pet-2',
    petImage: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&w=900&q=85',
    homeType: 'Departamento',
    hasOtherPets: false,
    yard: false,
    status: 'En revisión',
    dateSubmitted: '13 de Agosto, 2026',
    experience: 'Vivo solo, trabajo desde casa y cuento con espacio tranquilo para un gatito.',
    customResponses: {
      'birth_date': '1998-11-20',
      'has_had_dogs': false,
      'hours_alone': '2 horas'
    }
  }
]

const INITIAL_FOSTER_HOMES: FosterHome[] = [
  {
    id: 'fh-1',
    name: 'Dra. Andrea Salgado',
    email: 'andrea.salgado@example.com',
    phone: '+52 55 4433 2211',
    address: 'Calle Duraznos 45, Col. Coyoacán',
    city: 'CDMX',
    homeType: 'Casa',
    yard: true,
    preferredSpecies: 'Gatos',
    maxCapacity: 3,
    currentPetsCount: 1,
    status: 'Activa',
    notes: 'Cuenta con habitación aislada especial para gatitos recién nacidos o post-operatorio.',
    registeredDate: '15 de Mayo, 2026',
    currentFosteredPet: 'Luna (Gato)'
  },
  {
    id: 'fh-2',
    name: 'Familia Ramírez Varela',
    email: 'contacto.ramirez@example.com',
    phone: '+52 55 8899 7766',
    address: 'Av. Paseo de las Palmas 210',
    city: 'Toluca',
    homeType: 'Finca',
    yard: true,
    preferredSpecies: 'Perros',
    maxCapacity: 2,
    currentPetsCount: 0,
    status: 'Disponible',
    notes: 'Jardín de más de 200m2 totalmente bardado. Excelente para perros de tamaño grande.',
    registeredDate: '02 de Junio, 2026'
  }
]

const INITIAL_THANKS: SponsorThank[] = [
  {
    id: 'th-1',
    name: 'Veterinaria San Antonio',
    role: 'Empresa Aliada',
    amountOrContribution: 'Campañas gratuitas de esterilización y vacunación',
    message: 'Gracias por brindar atención médica profesional y de corazón a más de 30 rescatados este año.',
    avatarUrl: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=300&q=80',
    date: '12 de Agosto, 2026',
    isPublic: true
  },
  {
    id: 'th-2',
    name: 'Gonzalo & Sofía',
    role: 'Donante',
    amountOrContribution: '$5,000 MXN en alimento ProPlan',
    message: 'Su aportación permitió alimentar a la camada de 6 cachorros rescatados durante dos meses completos.',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    date: '05 de Agosto, 2026',
    isPublic: true
  }
]

const INITIAL_SETTINGS: ShelterSettings = {
  name: 'Refugio Huellas',
  tagline: 'Rescate y Adopción Responsable',
  description: 'Somos una organización sin fines de lucro dedicada al rescate, rehabilitación médica y búsqueda de hogares definitivos para animales en situación de calle o abandono.',
  phone: '+52 55 8765 4321',
  email: 'contacto@huellasrefugio.org',
  address: 'Av. Insurgentes Sur 1230, Col. Del Valle',
  city: 'Ciudad de México',
  state: 'CDMX',
  country: 'México',
  zipCode: '03100',
  primaryColor: '#1d3f33',
  accentColor: '#dceebf',
  logoUrl: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=300&q=80',
  heroBannerUrl: 'https://images.unsplash.com/photo-1660535254205-b9f03a7b84dc?q=80&w=857&auto=format&fit=crop',
  adoptionContractTerms: `CONTRATO DE ADOPCIÓN RESPONSABLE...`,
  shelterRules: `REGLAMENTO Y POLITICAS DEL REFUGIO...`,
  visitingHours: 'Lunes a Sábado: 10:00 - 17:00 | Domingos: Solo con cita previa',
  adoptionFormFields: [
    { id: 'f-1', label: 'Fecha de Nacimiento', type: 'date', required: true },
    { id: 'f-2', label: '¿Has tenido perros o gatos previamente?', type: 'boolean', required: true },
    { id: 'f-3', label: '¿Cuántas horas al día pasará la mascota sola?', type: 'select', options: ['Menos de 3 horas', 'De 3 a 6 horas', 'Más de 6 horas'], required: true },
    { id: 'f-4', label: 'Teléfono alternativo de emergencia', type: 'tel', required: false }
  ],
  fosterFormFields: [
    { id: 'ff-1', label: 'Fecha disponible para iniciar hospedaje', type: 'date', required: true },
    { id: 'ff-2', label: '¿Tienes área aislada para cuarentena o post-operatorio?', type: 'boolean', required: true },
    { id: 'ff-3', label: 'Experiencia administrando medicamentos veterinarios', type: 'select', options: ['Sin experiencia', 'Básica (Pastillas/Gotas)', 'Avanzada (Inyecciones/Curaciones)'], required: true },
    { id: 'ff-4', label: 'Número de adultos y niños en casa', type: 'number', required: true }
  ],
  fosterRequirements: 'Patios bien bardados, compromiso mínimo de 2 semanas, disponibilidad para llevar a la mascota a revisiones o ferias de adopción y amor infinito.',
  socialLinks: {
    instagram: 'https://instagram.com/huellasrefugio',
    facebook: 'https://facebook.com/huellasrefugio',
    website: 'https://huellasrefugio.org'
  }
}

const ADMIN_EMAIL = 'admin@root.com'
const ADMIN_PASSWORD = '12345678A'
const SESSION_COOKIE = 'huellas_admin_session'

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<TabType>('overview')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    document.cookie = `${SESSION_COOKIE}=; path=/; max-age=0; SameSite=Lax`
    window.location.href = '/dashboard/login'
  }

  // Main Data States
  const [pets, setPets] = useState<Pet[]>(INITIAL_PETS)
  const [applications, setApplications] = useState<AdoptionApplication[]>(INITIAL_APPLICATIONS)
  const [fosterHomes, setFosterHomes] = useState<FosterHome[]>(INITIAL_FOSTER_HOMES)
  const [thanksList, setThanksList] = useState<SponsorThank[]>(INITIAL_THANKS)
  const [settings, setSettings] = useState<ShelterSettings>(INITIAL_SETTINGS)

  // Filters
  const [searchTerm, setSearchTerm] = useState('')
  const [filterSpecies, setFilterSpecies] = useState<string>('Todos')
  const [filterStatus, setFilterStatus] = useState<string>('Todos')
  const [appFilterStatus, setAppFilterStatus] = useState<string>('Todos')
  const [fosterFilterStatus, setFosterFilterStatus] = useState<string>('Todos')

  // Registration & Editing state for Pet
  const [editingPet, setEditingPet] = useState<Pet | null>(null)
  const [petFormActionSuccess, setPetFormActionSuccess] = useState<string | null>(null)
  const [newPet, setNewPet] = useState({
    name: '',
    species: 'Perro' as 'Perro' | 'Gato' | 'Otro',
    breed: '',
    age: '',
    gender: 'Macho' as 'Macho' | 'Hembra',
    size: 'Mediano' as 'Pequeño' | 'Mediano' | 'Grande',
    location: 'CDMX (Refugio Central)',
    image: '',
    story: '',
    healthInput: 'Vacunas al día, Esterilizado',
    personalityInput: 'Amigable, Cariñoso'
  })
  const [registerSuccess, setRegisterSuccess] = useState(false)
  const [settingsSuccess, setSettingsSuccess] = useState(false)

  // New Foster Home Modal State
  const [showAddFosterModal, setShowAddFosterModal] = useState(false)
  const [newFoster, setNewFoster] = useState({
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
    customResponses: {} as Record<string, string | boolean>
  })

  // New Thank Modal State
  const [showAddThankModal, setShowAddThankModal] = useState(false)
  const [newThank, setNewThank] = useState({
    name: '',
    role: 'Donante' as 'Donante' | 'Voluntario' | 'Empresa Aliada' | 'Padrino',
    amountOrContribution: '',
    message: '',
    avatarUrl: '',
    isPublic: true
  })

  // Settings Sub-tab state
  const [settingsSection, setSettingsSection] = useState<'general' | 'forms' | 'appearance' | 'location' | 'legal'>('general')

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
      story: pet.story,
      healthInput: pet.health.join(', '),
      personalityInput: pet.personality.join(', ')
    })
    setActiveTab('register-pet')
  }

  // Cancel Editing
  const handleCancelEdit = () => {
    setEditingPet(null)
    setNewPet({
      name: '',
      species: 'Perro',
      breed: '',
      age: '',
      gender: 'Macho',
      size: 'Mediano',
      location: 'CDMX (Refugio Central)',
      image: '',
      story: '',
      healthInput: 'Vacunas al día, Esterilizado',
      personalityInput: 'Amigable, Cariñoso'
    })
    setActiveTab('pets')
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
    setNewFoster({
      name: '',
      email: '',
      phone: '',
      address: '',
      city: 'CDMX',
      homeType: 'Casa',
      yard: true,
      preferredSpecies: 'Cualquiera',
      maxCapacity: 1,
      notes: '',
      customResponses: {}
    })
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
    setNewThank({
      name: '',
      role: 'Donante',
      amountOrContribution: '',
      message: '',
      avatarUrl: '',
      isPublic: true
    })
  }

  const handleToggleThankPublic = (id: string) => {
    setThanksList(prev => prev.map(t => t.id === id ? { ...t, isPublic: !t.isPublic } : t))
  }

  const handleDeleteThank = (id: string) => {
    if (confirm('¿Eliminar esta nota de agradecimiento?')) {
      setThanksList(prev => prev.filter(t => t.id !== id))
    }
  }

  // Save Shelter Settings
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault()
    setSettingsSuccess(true)
    setTimeout(() => {
      setSettingsSuccess(false)
    }, 2500)
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
        image: newPet.image || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=900&q=85',
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
        handleCancelEdit()
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

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row">
      {/* Mobile Top Header */}
      <header className="md:hidden sticky top-0 z-40 w-full border-b border-foreground/10 bg-card/90 backdrop-blur-md px-4 py-3 flex items-center justify-between shadow-xs">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight text-base">
          <span className="grid size-8 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <PawPrint className="size-4" />
          </span>
          <div className="flex flex-col">
            <span className="leading-tight font-bold truncate max-w-[150px]">{settings.name}</span>
            <span className="text-[9px] text-muted-foreground uppercase tracking-widest font-semibold">Panel Admin</span>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          {pendingApps > 0 && (
            <span className="bg-accent text-accent-foreground font-bold text-xs px-2 py-0.5 rounded-full">
              {pendingApps} sol.
            </span>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Abrir menú"
            className="p-2 rounded-xl border border-foreground/15 bg-background text-foreground hover:bg-secondary transition active:scale-95"
          >
            {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </header>

      {/* Backdrop for Mobile Overlay */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs md:hidden animate-in fade-in"
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-72 md:w-64 border-r border-foreground/10 bg-card/95 backdrop-blur-md p-5 flex flex-col justify-between shrink-0 transform transition-transform duration-300 ease-in-out md:transform-none ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div>
          {/* Logo / Brand Header */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-foreground/10">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 font-semibold tracking-tight text-lg"
            >
              <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                <PawPrint className="size-5" />
              </span>
              <div className="flex flex-col">
                <span className="leading-tight font-bold truncate max-w-[140px]">{settings.name}</span>
                <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">Panel Admin</span>
              </div>
            </Link>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="md:hidden p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground"
            >
              <X className="size-5" />
            </button>
          </div>

          {/* Nav Items */}
          <nav className="space-y-1.5">
            <button
              onClick={() => {
                setActiveTab('overview')
                setMobileMenuOpen(false)
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'overview'
                  ? 'bg-primary text-primary-foreground shadow-sm font-semibold'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
              }`}
            >
              <TrendingUp className="size-4" />
              Resumen General
            </button>

            <button
              onClick={() => {
                setActiveTab('pets')
                setMobileMenuOpen(false)
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'pets'
                  ? 'bg-primary text-primary-foreground shadow-sm font-semibold'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
              }`}
            >
              <div className="flex items-center gap-3">
                <List className="size-4" />
                Listado de Mascotas
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full ${activeTab === 'pets' ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-secondary text-muted-foreground'}`}>
                {totalPets}
              </span>
            </button>

            <button
              onClick={() => {
                setEditingPet(null)
                setNewPet({
                  name: '',
                  species: 'Perro',
                  breed: '',
                  age: '',
                  gender: 'Macho',
                  size: 'Mediano',
                  location: 'CDMX (Refugio Central)',
                  image: '',
                  story: '',
                  healthInput: 'Vacunas al día, Esterilizado',
                  personalityInput: 'Amigable, Cariñoso'
                })
                setActiveTab('register-pet')
                setMobileMenuOpen(false)
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'register-pet' && !editingPet
                  ? 'bg-primary text-primary-foreground shadow-sm font-semibold'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
              }`}
            >
              <PlusCircle className="size-4" />
              Registrar Mascota
            </button>

            <button
              onClick={() => {
                setActiveTab('applications')
                setMobileMenuOpen(false)
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'applications'
                  ? 'bg-primary text-primary-foreground shadow-sm font-semibold'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
              }`}
            >
              <div className="flex items-center gap-3">
                <FileText className="size-4" />
                Solicitudes
              </div>
              {pendingApps > 0 && (
                <span className="bg-accent text-accent-foreground font-bold text-xs px-2 py-0.5 rounded-full">
                  {pendingApps}
                </span>
              )}
            </button>

            {/* NAV: Casas Puente */}
            <button
              onClick={() => {
                setActiveTab('foster-homes')
                setMobileMenuOpen(false)
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'foster-homes'
                  ? 'bg-primary text-primary-foreground shadow-sm font-semibold'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
              }`}
            >
              <div className="flex items-center gap-3">
                <Home className="size-4" />
                Casas Puente
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full ${activeTab === 'foster-homes' ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-secondary text-muted-foreground'}`}>
                {activeFosters}
              </span>
            </button>

            {/* NAV: Agradecimientos */}
            <button
              onClick={() => {
                setActiveTab('thanks')
                setMobileMenuOpen(false)
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'thanks'
                  ? 'bg-primary text-primary-foreground shadow-sm font-semibold'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
              }`}
            >
              <Gift className="size-4" />
              Agradecimientos
            </button>

            <button
              onClick={() => {
                setActiveTab('settings')
                setMobileMenuOpen(false)
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'settings'
                  ? 'bg-primary text-primary-foreground shadow-sm font-semibold'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
              }`}
            >
              <Settings className="size-4" />
              Configuración Refugio
            </button>
          </nav>
        </div>

        {/* User Info / Footer in sidebar */}
        <div className="pt-5 border-t border-foreground/10 mt-6">
          <div className="flex items-center gap-3 px-2 py-1">
            <img
              src={settings.logoUrl}
              alt="Refugio"
              className="size-9 rounded-full object-cover border border-foreground/10 shrink-0"
            />
            <div className="flex flex-col truncate">
              <span className="text-sm font-semibold truncate">{settings.name}</span>
              <span className="text-xs text-muted-foreground truncate">{settings.email}</span>
            </div>
          </div>
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="mt-4 flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground px-2 py-1 transition"
          >
            <LogOut className="size-3.5" />
            Volver a la web pública
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-xs font-medium text-red-600 hover:text-red-700 px-2 py-1 transition"
          >
            <Lock className="size-3.5" />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        {/* Header bar inside Dashboard */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              {activeTab === 'overview' && 'Panel de Control del Refugio'}
              {activeTab === 'pets' && 'Listado de Mascotas'}
              {activeTab === 'register-pet' && (editingPet ? `Editar Perfil: ${editingPet.name}` : 'Registrar Nueva Mascota')}
              {activeTab === 'applications' && 'Solicitudes de Adopción'}
              {activeTab === 'foster-homes' && 'Red de Casas Puente (Hogares Temporales)'}
              {activeTab === 'thanks' && 'Módulo de Agradecimientos & Donantes'}
              {activeTab === 'settings' && 'Configuración General del Refugio'}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {activeTab === 'overview' && 'Administra perfiles de rescatados, aprueba solicitudes y monitorea el estado del refugio.'}
              {activeTab === 'pets' && 'Listado completo de animales. Puedes editar perfiles, cambiar su estado o eliminarlos.'}
              {activeTab === 'register-pet' && (editingPet ? 'Actualiza los datos, fotos e historial médico del rescatado.' : 'Llena la ficha para publicar un nuevo rescatado en la plataforma.')}
              {activeTab === 'applications' && 'Revisa los expedientes completos y respuestas de los posibles adoptantes.'}
              {activeTab === 'foster-homes' && 'Directorio de voluntarios registrados para dar alojamiento temporal a rescatados.'}
              {activeTab === 'thanks' && 'Reconoce públicamente a donantes, empresas y voluntarios que sostienen al refugio.'}
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

          {activeTab !== 'register-pet' && activeTab !== 'foster-homes' && activeTab !== 'thanks' && (
            <button
              onClick={() => {
                setEditingPet(null)
                setNewPet({
                  name: '',
                  species: 'Perro',
                  breed: '',
                  age: '',
                  gender: 'Macho',
                  size: 'Mediano',
                  location: 'CDMX (Refugio Central)',
                  image: '',
                  story: '',
                  healthInput: 'Vacunas al día, Esterilizado',
                  personalityInput: 'Amigable, Cariñoso'
                })
                setActiveTab('register-pet')
              }}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <PlusCircle className="size-4" />
              Nueva Mascota
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
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Quick Metrics */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border border-foreground/10 bg-card p-5 shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total Rescatados</span>
                  <div className="grid size-9 place-items-center rounded-xl bg-primary/10 text-primary">
                    <PawPrint className="size-5" />
                  </div>
                </div>
                <div className="mt-4">
                  <span className="text-3xl font-extrabold tracking-tight">{totalPets}</span>
                  <p className="text-xs text-muted-foreground mt-1">En el catálogo activo</p>
                </div>
              </div>

              <div className="rounded-2xl border border-foreground/10 bg-card p-5 shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Casas Puente</span>
                  <div className="grid size-9 place-items-center rounded-xl bg-primary/10 text-primary">
                    <Home className="size-5" />
                  </div>
                </div>
                <div className="mt-4">
                  <span className="text-3xl font-extrabold tracking-tight">{activeFosters}</span>
                  <p className="text-xs text-muted-foreground mt-1">Hogares temporales listos</p>
                </div>
              </div>

              <div className="rounded-2xl border border-foreground/10 bg-card p-5 shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Solicitudes Pendientes</span>
                  <div className="grid size-9 place-items-center rounded-xl bg-amber-500/10 text-amber-600">
                    <Clock className="size-5" />
                  </div>
                </div>
                <div className="mt-4">
                  <span className="text-3xl font-extrabold tracking-tight">{pendingApps}</span>
                  <p className="text-xs text-muted-foreground mt-1">Requieren atención o entrevista</p>
                </div>
              </div>

              <div className="rounded-2xl border border-foreground/10 bg-card p-5 shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Adopciones Exitosas</span>
                  <div className="grid size-9 place-items-center rounded-xl bg-emerald-500/10 text-emerald-600">
                    <CheckCircle2 className="size-5" />
                  </div>
                </div>
                <div className="mt-4">
                  <span className="text-3xl font-extrabold tracking-tight">{adoptedPets + 16}</span>
                  <p className="text-xs text-muted-foreground mt-1">Hogares encontrados</p>
                </div>
              </div>
            </div>

            {/* Quick Action & Recent Solicitudes preview grid */}
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Recent Applications Section */}
              <div className="lg:col-span-2 rounded-2xl border border-foreground/10 bg-card p-6 shadow-xs">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-semibold tracking-tight">Últimas Solicitudes de Adopción</h2>
                    <p className="text-xs text-muted-foreground">Personas interesadas en adoptar a un integrante del refugio</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('applications')}
                    className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                  >
                    Ver todas <ChevronRight className="size-3.5" />
                  </button>
                </div>

                <div className="space-y-4">
                  {applications.slice(0, 3).map((app) => (
                    <div
                      key={app.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-foreground/10 bg-background hover:border-foreground/20 transition-all"
                    >
                      <div className="flex items-center gap-3.5">
                        <img
                          src={app.petImage}
                          alt={app.petName}
                          className="size-12 rounded-xl object-cover"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-sm">{app.applicantName}</h3>
                            <span className="text-xs text-muted-foreground">para <strong className="text-foreground">{app.petName}</strong></span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {app.homeType} · {app.hasOtherPets ? 'Tiene otras mascotas' : 'Sin otras mascotas'} · {app.dateSubmitted}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-foreground/10">
                        <span
                          className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                            app.status === 'Pendiente'
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
                              : app.status === 'En revisión'
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300'
                              : app.status === 'Aprobada'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
                              : 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300'
                          }`}
                        >
                          {app.status}
                        </span>
                        <button
                          onClick={() => setActiveTab('applications')}
                          className="text-xs font-medium px-3 py-1.5 rounded-lg border border-foreground/15 hover:bg-secondary transition"
                        >
                          Revisar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Breakdown & Quick Links */}
              <div className="space-y-6">
                <div className="rounded-2xl border border-foreground/10 bg-card p-6 shadow-xs">
                  <h2 className="text-lg font-semibold tracking-tight mb-4">Estado del Catálogo</h2>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 text-muted-foreground">
                        <span className="size-2.5 rounded-full bg-emerald-500" /> Disponibles
                      </span>
                      <span className="font-semibold">{availablePets}</span>
                    </div>
                    <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full rounded-full transition-all"
                        style={{ width: `${(availablePets / (totalPets || 1)) * 100}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-sm pt-2">
                      <span className="flex items-center gap-2 text-muted-foreground">
                        <span className="size-2.5 rounded-full bg-amber-500" /> En Proceso
                      </span>
                      <span className="font-semibold">{inProcessPets}</span>
                    </div>
                    <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-amber-500 h-full rounded-full transition-all"
                        style={{ width: `${(inProcessPets / (totalPets || 1)) * 100}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-sm pt-2">
                      <span className="flex items-center gap-2 text-muted-foreground">
                        <span className="size-2.5 rounded-full bg-blue-500" /> Adoptados
                      </span>
                      <span className="font-semibold">{adoptedPets}</span>
                    </div>
                    <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-blue-500 h-full rounded-full transition-all"
                        style={{ width: `${(adoptedPets / (totalPets || 1)) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Refugio Card Summary */}
                <div className="rounded-2xl bg-card border border-foreground/10 p-6 shadow-xs">
                  <div className="flex items-center gap-3 mb-3">
                    <Building2 className="size-5 text-primary" />
                    <h3 className="font-bold text-base">{settings.name}</h3>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-4">{settings.description}</p>
                  <button
                    onClick={() => setActiveTab('settings')}
                    className="w-full text-center text-xs font-semibold py-2.5 px-4 rounded-xl border border-foreground/15 hover:bg-secondary transition"
                  >
                    Editar Inputs Web & Formularios
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PETS LIST TAB */}
        {activeTab === 'pets' && (
          <div className="space-y-6">
            {/* Filters Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-card border border-foreground/10 p-4 rounded-2xl">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Buscar por nombre o raza..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-foreground/15 bg-background outline-none focus:border-foreground"
                />
              </div>

              {/* Dropdown Filters */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground font-medium">Especie:</span>
                  <select
                    value={filterSpecies}
                    onChange={(e) => setFilterSpecies(e.target.value)}
                    className="text-xs py-2 px-3 rounded-xl border border-foreground/15 bg-background outline-none font-medium"
                  >
                    <option value="Todos">Todas</option>
                    <option value="Perro">Perros</option>
                    <option value="Gato">Gatos</option>
                    <option value="Otro">Otros</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground font-medium">Estado:</span>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="text-xs py-2 px-3 rounded-xl border border-foreground/15 bg-background outline-none font-medium"
                  >
                    <option value="Todos">Todos</option>
                    <option value="Disponible">Disponible</option>
                    <option value="En Proceso">En Proceso</option>
                    <option value="Adoptado">Adoptado</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Pets Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredPetsList.map((pet) => (
                <div
                  key={pet.id}
                  className="group rounded-2xl border border-foreground/10 bg-card overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Image & Status Tag */}
                    <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
                      <img
                        src={pet.image}
                        alt={pet.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 flex gap-2">
                        <span
                          className={`text-xs px-3 py-1 rounded-full font-semibold shadow-xs ${
                            pet.status === 'Disponible'
                              ? 'bg-emerald-500 text-white'
                              : pet.status === 'En Proceso'
                              ? 'bg-amber-500 text-white'
                              : 'bg-blue-600 text-white'
                          }`}
                        >
                          {pet.status}
                        </span>
                      </div>

                      {/* Floating Quick Action Buttons on Top Right */}
                      <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/40 backdrop-blur-md p-1 rounded-xl">
                        <Link
                          href={`/adopta/${pet.name.toLowerCase()}`}
                          title="Ver en web pública"
                          target="_blank"
                          className="p-1.5 rounded-lg bg-white/20 hover:bg-white/40 text-white transition"
                        >
                          <ExternalLink className="size-3.5" />
                        </Link>
                        <button
                          onClick={() => handleStartEditPet(pet)}
                          title="Editar Perfil"
                          className="p-1.5 rounded-lg bg-white/20 hover:bg-white/40 text-white transition"
                        >
                          <Edit className="size-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeletePet(pet.id, pet.name)}
                          title="Eliminar Perfil"
                          className="p-1.5 rounded-lg bg-rose-500/80 hover:bg-rose-600 text-white transition"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>

                      <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md text-white text-[11px] px-2.5 py-1 rounded-lg flex items-center gap-1">
                        <Eye className="size-3" /> {pet.views} vistas
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-xl font-bold">{pet.name}</h3>
                          <p className="text-xs text-muted-foreground font-medium mt-0.5">
                            {pet.species} · {pet.breed} · {pet.age}
                          </p>
                        </div>
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-secondary">
                          {pet.gender}
                        </span>
                      </div>

                      <p className="text-xs text-muted-foreground mt-3 line-clamp-2 leading-relaxed">
                        {pet.story}
                      </p>

                      {/* Health & Personality tags */}
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {pet.health.slice(0, 2).map((h, i) => (
                          <span key={i} className="text-[10px] bg-primary/10 text-primary font-medium px-2 py-0.5 rounded-md">
                            ✓ {h}
                          </span>
                        ))}
                        {pet.personality.slice(0, 2).map((p, i) => (
                          <span key={i} className="text-[10px] bg-secondary text-muted-foreground font-medium px-2 py-0.5 rounded-md">
                            • {p}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="p-4 border-t border-foreground/10 bg-background/50 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleStartEditPet(pet)}
                        className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-foreground/15 hover:bg-secondary transition flex items-center gap-1"
                      >
                        <Edit className="size-3" /> Editar
                      </button>
                      <button
                        onClick={() => handleDeletePet(pet.id, pet.name)}
                        className="text-xs font-semibold px-2.5 py-1.5 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition"
                      >
                        <Trash2 className="size-3" />
                      </button>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] text-muted-foreground">Estado:</span>
                      <select
                        value={pet.status}
                        onChange={(e) => handleUpdatePetStatus(pet.id, e.target.value as Pet['status'])}
                        className="text-xs font-medium py-1.5 px-2.5 rounded-lg border border-foreground/15 bg-background outline-none cursor-pointer"
                      >
                        <option value="Disponible">Disponible</option>
                        <option value="En Proceso">En Proceso</option>
                        <option value="Adoptado">Adoptado</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* REGISTER / EDIT PET FORM TAB */}
        {activeTab === 'register-pet' && (
          <div className="max-w-3xl mx-auto">
            {registerSuccess ? (
              <div className="p-8 text-center bg-card border border-foreground/10 rounded-2xl shadow-sm space-y-4">
                <div className="grid size-16 place-items-center rounded-full bg-emerald-500 text-white mx-auto">
                  <Check className="size-8" />
                </div>
                <h2 className="text-2xl font-bold">
                  {editingPet ? '¡Perfil actualizado con éxito!' : '¡Mascota registrada exitosamente!'}
                </h2>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  Los cambios han sido guardados en el catálogo y están visibles para los adoptantes.
                </p>
              </div>
            ) : (
              <form onSubmit={handleCreateOrUpdatePet} className="bg-card border border-foreground/10 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
                <div className="flex items-center justify-between border-b border-foreground/10 pb-3">
                  <h2 className="text-lg font-bold flex items-center gap-2">
                    <PawPrint className="size-5 text-primary" />
                    {editingPet ? `Editar Ficha: ${editingPet.name}` : 'Datos del Rescatado'}
                  </h2>
                  {editingPet && (
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="text-xs font-semibold text-muted-foreground hover:text-foreground"
                    >
                      Cancelar Edición
                    </button>
                  )}
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="grid gap-2 text-xs font-semibold uppercase tracking-wider">
                    Nombre de la Mascota *
                    <input
                      required
                      type="text"
                      placeholder="Ej. Toby, Canela..."
                      value={newPet.name}
                      onChange={(e) => setNewPet({ ...newPet, name: e.target.value })}
                      className="rounded-xl border border-foreground/15 bg-background px-4 py-2.5 text-sm font-normal outline-none focus:border-foreground"
                    />
                  </label>

                  <label className="grid gap-2 text-xs font-semibold uppercase tracking-wider">
                    Especie *
                    <select
                      value={newPet.species}
                      onChange={(e) => setNewPet({ ...newPet, species: e.target.value as any })}
                      className="rounded-xl border border-foreground/15 bg-background px-4 py-2.5 text-sm font-normal outline-none"
                    >
                      <option value="Perro">Perro</option>
                      <option value="Gato">Gato</option>
                      <option value="Otro">Otro</option>
                    </select>
                  </label>
                </div>

                <div className="grid gap-5 sm:grid-cols-3">
                  <label className="grid gap-2 text-xs font-semibold uppercase tracking-wider">
                    Raza / Mezcla
                    <input
                      type="text"
                      placeholder="Ej. Mestizo, Criollo"
                      value={newPet.breed}
                      onChange={(e) => setNewPet({ ...newPet, breed: e.target.value })}
                      className="rounded-xl border border-foreground/15 bg-background px-4 py-2.5 text-sm font-normal outline-none focus:border-foreground"
                    />
                  </label>

                  <label className="grid gap-2 text-xs font-semibold uppercase tracking-wider">
                    Edad estimada
                    <input
                      type="text"
                      placeholder="Ej. 1 año, 6 meses"
                      value={newPet.age}
                      onChange={(e) => setNewPet({ ...newPet, age: e.target.value })}
                      className="rounded-xl border border-foreground/15 bg-background px-4 py-2.5 text-sm font-normal outline-none focus:border-foreground"
                    />
                  </label>

                  <label className="grid gap-2 text-xs font-semibold uppercase tracking-wider">
                    Género
                    <select
                      value={newPet.gender}
                      onChange={(e) => setNewPet({ ...newPet, gender: e.target.value as any })}
                      className="rounded-xl border border-foreground/15 bg-background px-4 py-2.5 text-sm font-normal outline-none"
                    >
                      <option value="Macho">Macho</option>
                      <option value="Hembra">Hembra</option>
                    </select>
                  </label>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="grid gap-2 text-xs font-semibold uppercase tracking-wider">
                    Tamaño
                    <select
                      value={newPet.size}
                      onChange={(e) => setNewPet({ ...newPet, size: e.target.value as any })}
                      className="rounded-xl border border-foreground/15 bg-background px-4 py-2.5 text-sm font-normal outline-none"
                    >
                      <option value="Pequeño">Pequeño</option>
                      <option value="Mediano">Mediano</option>
                      <option value="Grande">Grande</option>
                    </select>
                  </label>

                  <label className="grid gap-2 text-xs font-semibold uppercase tracking-wider">
                    Ubicación / Refugio
                    <input
                      type="text"
                      placeholder="Ej. CDMX Refugio Central"
                      value={newPet.location}
                      onChange={(e) => setNewPet({ ...newPet, location: e.target.value })}
                      className="rounded-xl border border-foreground/15 bg-background px-4 py-2.5 text-sm font-normal outline-none focus:border-foreground"
                    />
                  </label>
                </div>

                <label className="grid gap-2 text-xs font-semibold uppercase tracking-wider">
                  URL de la Fotografía
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={newPet.image}
                    onChange={(e) => setNewPet({ ...newPet, image: e.target.value })}
                    className="rounded-xl border border-foreground/15 bg-background px-4 py-2.5 text-sm font-normal outline-none focus:border-foreground"
                  />
                </label>

                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="grid gap-2 text-xs font-semibold uppercase tracking-wider">
                    Salud (Separado por comas)
                    <input
                      type="text"
                      placeholder="Vacunas al día, Esterilizado, Desparasitado"
                      value={newPet.healthInput}
                      onChange={(e) => setNewPet({ ...newPet, healthInput: e.target.value })}
                      className="rounded-xl border border-foreground/15 bg-background px-4 py-2.5 text-sm font-normal outline-none focus:border-foreground"
                    />
                  </label>

                  <label className="grid gap-2 text-xs font-semibold uppercase tracking-wider">
                    Personalidad (Separado por comas)
                    <input
                      type="text"
                      placeholder="Cariñoso, Juguetón, Noble"
                      value={newPet.personalityInput}
                      onChange={(e) => setNewPet({ ...newPet, personalityInput: e.target.value })}
                      className="rounded-xl border border-foreground/15 bg-background px-4 py-2.5 text-sm font-normal outline-none focus:border-foreground"
                    />
                  </label>
                </div>

                <label className="grid gap-2 text-xs font-semibold uppercase tracking-wider">
                  Historia / Descripción
                  <textarea
                    rows={4}
                    placeholder="Escribe detalles del rescate, temperamento y tipo de hogar ideal..."
                    value={newPet.story}
                    onChange={(e) => setNewPet({ ...newPet, story: e.target.value })}
                    className="rounded-xl border border-foreground/15 bg-background px-4 py-2.5 text-sm font-normal outline-none focus:border-foreground resize-none"
                  />
                </label>

                <div className="pt-4 flex items-center justify-end gap-3 border-t border-foreground/10">
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="px-5 py-2.5 text-sm font-medium rounded-full border border-foreground/15 hover:bg-secondary transition"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 text-sm font-medium rounded-full bg-primary text-primary-foreground hover:scale-[1.02] active:scale-[0.98] transition-all shadow-sm"
                  >
                    {editingPet ? 'Guardar Cambios del Perfil' : 'Guardar y Publicar Mascota'}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* APPLICATIONS TAB */}
        {activeTab === 'applications' && (
          <div className="space-y-6">
            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-card border border-foreground/10 p-4 rounded-2xl">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Buscar por solicitante o mascota..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-foreground/15 bg-background outline-none focus:border-foreground"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground font-medium">Estado de Solicitud:</span>
                <select
                  value={appFilterStatus}
                  onChange={(e) => setAppFilterStatus(e.target.value)}
                  className="text-xs py-2 px-3 rounded-xl border border-foreground/15 bg-background outline-none font-medium"
                >
                  <option value="Todos">Todas</option>
                  <option value="Pendiente">Pendiente</option>
                  <option value="En revisión">En revisión</option>
                  <option value="Aprobada">Aprobada</option>
                  <option value="Rechazada">Rechazada</option>
                </select>
              </div>
            </div>

            {/* Applications List */}
            <div className="space-y-4">
              {filteredAppsList.map((app) => (
                <div
                  key={app.id}
                  className="rounded-2xl border border-foreground/10 bg-card p-5 sm:p-6 shadow-xs space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-foreground/10 pb-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={app.petImage}
                        alt={app.petName}
                        className="size-14 rounded-2xl object-cover border border-foreground/10"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold">{app.applicantName}</h3>
                          <span className="text-xs text-muted-foreground">interesado en <strong className="text-foreground">{app.petName}</strong></span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Enviado el {app.dateSubmitted} · ID: {app.id}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground font-medium">Estado actual:</span>
                      <span
                        className={`text-xs px-3 py-1 rounded-full font-semibold ${
                          app.status === 'Pendiente'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
                            : app.status === 'En revisión'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300'
                            : app.status === 'Aprobada'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300'
                        }`}
                      >
                        {app.status}
                      </span>
                    </div>
                  </div>

                  {/* Applicant Details */}
                  <div className="grid gap-4 sm:grid-cols-3 text-xs">
                    <div className="bg-background p-3.5 rounded-xl border border-foreground/10">
                      <span className="text-muted-foreground font-semibold uppercase tracking-wider block mb-1">Contacto</span>
                      <p className="font-medium text-sm">{app.applicantEmail}</p>
                      <p className="text-muted-foreground">{app.applicantPhone}</p>
                    </div>

                    <div className="bg-background p-3.5 rounded-xl border border-foreground/10">
                      <span className="text-muted-foreground font-semibold uppercase tracking-wider block mb-1">Vivienda & Entorno</span>
                      <p className="font-medium">{app.homeType} {app.yard ? 'con jardín' : 'sin jardín'}</p>
                      <p className="text-muted-foreground">{app.hasOtherPets ? 'Tiene otras mascotas actualmente' : 'No tiene mascotas'}</p>
                    </div>

                    <div className="bg-background p-3.5 rounded-xl border border-foreground/10">
                      <span className="text-muted-foreground font-semibold uppercase tracking-wider block mb-1">Experiencia / Motivo</span>
                      <p className="font-medium line-clamp-2">{app.experience}</p>
                    </div>
                  </div>

                  {/* Render Custom Dynamic Field Responses */}
                  {settings.adoptionFormFields.length > 0 && (
                    <div className="p-3.5 rounded-xl bg-secondary/50 border border-foreground/10 text-xs space-y-2">
                      <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block">
                        Respuestas a Campos Web Personalizados
                      </span>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {settings.adoptionFormFields.map((field) => {
                          const val = app.customResponses?.[field.id] ?? (field.type === 'boolean' ? 'Sí' : 'No especificado')
  return (
                            <div key={field.id} className="flex flex-col">
                              <span className="text-muted-foreground font-medium">{field.label}:</span>
                              <span className="font-semibold text-foreground">
                                {typeof val === 'boolean' ? (val ? 'Sí' : 'No') : String(val)}
                              </span>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {/* Quick Action Buttons for Shelter Manager */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <div className="flex items-center gap-2">
                      <a
                        href={`mailto:${app.applicantEmail}?subject=Solicitud de adopción para ${app.petName}`}
                        className="text-xs px-3.5 py-2 rounded-xl bg-secondary hover:bg-secondary/80 font-medium transition"
                      >
                        Enviar Correo
                      </a>
                      <a
                        href={`tel:${app.applicantPhone}`}
                        className="text-xs px-3.5 py-2 rounded-xl bg-secondary hover:bg-secondary/80 font-medium transition"
                      >
                        Llamar
                      </a>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleUpdateAppStatus(app.id, 'En revisión')}
                        className={`text-xs px-3 py-1.5 rounded-xl border border-foreground/15 font-medium hover:bg-secondary transition ${app.status === 'En revisión' ? 'bg-blue-50 text-blue-700 border-blue-300' : ''}`}
                      >
                        Marcar En Revisión
                      </button>

                      <button
                        onClick={() => handleUpdateAppStatus(app.id, 'Aprobada')}
                        className="text-xs px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition flex items-center gap-1"
                      >
                        <Check className="size-3.5" /> Aprobar
                      </button>

                      <button
                        onClick={() => handleUpdateAppStatus(app.id, 'Rechazada')}
                        className="text-xs px-3 py-1.5 rounded-xl bg-rose-100 text-rose-700 hover:bg-rose-200 font-medium transition flex items-center gap-1"
                      >
                        <XCircle className="size-3.5" /> Rechazar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FOSTER HOMES TAB */}
        {activeTab === 'foster-homes' && (
          <div className="space-y-6">
            {/* Filter & Actions Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-card border border-foreground/10 p-4 rounded-2xl">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Buscar casa puente por nombre o ciudad..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-foreground/15 bg-background outline-none focus:border-foreground"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground font-medium">Estado del Hogar:</span>
                <select
                  value={fosterFilterStatus}
                  onChange={(e) => setFosterFilterStatus(e.target.value)}
                  className="text-xs py-2 px-3 rounded-xl border border-foreground/15 bg-background outline-none font-medium"
                >
                  <option value="Todos">Todos</option>
                  <option value="Disponible">Disponible</option>
                  <option value="Activa">Activa (Con Mascota)</option>
                  <option value="En pausa">En pausa</option>
                </select>
              </div>
            </div>

            {/* Foster Homes Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredFosterList.map((foster) => (
                <div
                  key={foster.id}
                  className="rounded-2xl border border-foreground/10 bg-card p-5 shadow-xs flex flex-col justify-between space-y-4"
                >
                  <div>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary font-bold">
                          <Home className="size-5" />
                        </div>
                        <div>
                          <h3 className="font-bold text-base">{foster.name}</h3>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <MapPin className="size-3" /> {foster.city} · {foster.homeType}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`text-[11px] px-2.5 py-0.5 rounded-full font-semibold ${
                          foster.status === 'Disponible'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : foster.status === 'Activa'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        }`}
                      >
                        {foster.status}
                      </span>
                    </div>

                    <div className="mt-4 space-y-2 text-xs">
                      <div className="flex items-center justify-between p-2 rounded-lg bg-background">
                        <span className="text-muted-foreground font-medium">Especie preferida:</span>
                        <span className="font-semibold">{foster.preferredSpecies}</span>
                      </div>

                      <div className="flex items-center justify-between p-2 rounded-lg bg-background">
                        <span className="text-muted-foreground font-medium">Capacidad máxima:</span>
                        <span className="font-semibold">{foster.maxCapacity} animal(es)</span>
                      </div>

                      {foster.currentFosteredPet && (
                        <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-medium">
                          <span>Mascota actual:</span>
                          <strong>{foster.currentFosteredPet}</strong>
                        </div>
                      )}

                      <p className="text-muted-foreground pt-1 line-clamp-2 leading-relaxed">
                        {foster.notes}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-foreground/10 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1">
                      <a
                        href={`tel:${foster.phone}`}
                        className="text-xs p-2 rounded-lg bg-secondary hover:bg-secondary/80 text-foreground"
                        title="Llamar"
                      >
                        <Phone className="size-3.5" />
                      </a>
                      <a
                        href={`mailto:${foster.email}`}
                        className="text-xs p-2 rounded-lg bg-secondary hover:bg-secondary/80 text-foreground"
                        title="Enviar Correo"
                      >
                        <Mail className="size-3.5" />
                      </a>
                      <button
                        onClick={() => handleDeleteFoster(foster.id, foster.name)}
                        className="text-xs p-2 rounded-lg hover:bg-rose-50 text-rose-600 transition"
                        title="Eliminar registro"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>

                    <select
                      value={foster.status}
                      onChange={(e) => handleUpdateFosterStatus(foster.id, e.target.value as FosterHome['status'])}
                      className="text-xs font-medium py-1 px-2.5 rounded-lg border border-foreground/15 bg-background outline-none"
                    >
                      <option value="Disponible">Disponible</option>
                      <option value="Activa">Activa</option>
                      <option value="En pausa">En pausa</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* THANKS TAB */}
        {activeTab === 'thanks' && (
          <div className="space-y-6">
            <div className="bg-card border border-foreground/10 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <Gift className="size-5 text-primary" /> Muro Público de Reconocimiento
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Los agradecimientos marcados como "Públicos" aparecerán automáticamente en la página web pública.
                </p>
              </div>
              <button
                onClick={() => setShowAddThankModal(true)}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-primary text-primary-foreground shadow-sm hover:scale-[1.02] transition"
              >
                + Agregar Agradecimiento
              </button>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {thanksList.map((thank) => (
                <div
                  key={thank.id}
                  className="rounded-2xl border border-foreground/10 bg-card p-5 shadow-xs flex flex-col justify-between space-y-4"
                >
                  <div>
                    <div className="flex items-center gap-3">
                      <img
                        src={thank.avatarUrl}
                        alt={thank.name}
                        className="size-12 rounded-full object-cover border border-foreground/15"
                      />
                      <div>
                        <h3 className="font-bold text-sm">{thank.name}</h3>
                        <span className="text-[11px] text-primary font-semibold block">{thank.role}</span>
                        <span className="text-[10px] text-muted-foreground">{thank.date}</span>
                      </div>
                    </div>

                    <div className="mt-3 p-3 rounded-xl bg-background border border-foreground/10 space-y-1">
                      <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block">Aportación</span>
                      <p className="text-xs font-medium">{thank.amountOrContribution}</p>
                    </div>

                    <p className="text-xs text-muted-foreground mt-3 italic leading-relaxed">
                      "{thank.message}"
                    </p>
                  </div>

                  <div className="pt-3 border-t border-foreground/10 flex items-center justify-between">
                    <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                      <input
                        type="checkbox"
                        checked={thank.isPublic}
                        onChange={() => handleToggleThankPublic(thank.id)}
                        className="rounded border-foreground/20 text-primary focus:ring-primary size-3.5"
                      />
                      {thank.isPublic ? (
                        <span className="text-emerald-600 font-semibold">Público en Web</span>
                      ) : (
                        <span className="text-muted-foreground">Privado</span>
                      )}
                    </label>

                    <button
                      onClick={() => handleDeleteThank(thank.id)}
                      className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition"
                      title="Eliminar"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SHELTER SETTINGS TAB */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            {/* Sub-tab Navigation */}
            <div className="flex flex-wrap items-center gap-2 border-b border-foreground/10 pb-3">
              <button
                onClick={() => setSettingsSection('general')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition ${
                  settingsSection === 'general'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card text-muted-foreground hover:text-foreground'
                }`}
              >
                <Building2 className="size-3.5" /> Perfil y Contacto
              </button>

              <button
                onClick={() => setSettingsSection('forms')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition ${
                  settingsSection === 'forms'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card text-muted-foreground hover:text-foreground'
                }`}
              >
                <FileQuestion className="size-3.5" /> Inputs Web & Formularios Dinámicos
              </button>

              <button
                onClick={() => setSettingsSection('appearance')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition ${
                  settingsSection === 'appearance'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card text-muted-foreground hover:text-foreground'
                }`}
              >
                <Palette className="size-3.5" /> Identidad Visual & Fotos
              </button>

              <button
                onClick={() => setSettingsSection('location')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition ${
                  settingsSection === 'location'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card text-muted-foreground hover:text-foreground'
                }`}
              >
                <MapPin className="size-3.5" /> Ubicación y Horarios
              </button>

              <button
                onClick={() => setSettingsSection('legal')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition ${
                  settingsSection === 'legal'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card text-muted-foreground hover:text-foreground'
                }`}
              >
                <Scale className="size-3.5" /> Contrato & Reglamento
              </button>
            </div>

            {/* Notification Banner */}
            {settingsSuccess && (
              <div className="p-4 rounded-xl bg-emerald-500 text-white flex items-center justify-between shadow-sm animate-in fade-in">
                <div className="flex items-center gap-2.5 text-sm font-medium">
                  <CheckCircle2 className="size-5" />
                  ¡Configuración guardada exitosamente! Los cambios han sido aplicados.
                </div>
              </div>
            )}

            <form onSubmit={handleSaveSettings} className="space-y-6">
              {/* 1. General Profile Section */}
              {settingsSection === 'general' && (
                <div className="bg-card border border-foreground/10 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
                  <h2 className="text-lg font-bold border-b border-foreground/10 pb-3 flex items-center gap-2">
                    <Building2 className="size-5 text-primary" /> Datos Institucionales
                  </h2>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <label className="grid gap-2 text-xs font-semibold uppercase tracking-wider">
                      Nombre del Refugio *
                      <input
                        type="text"
                        required
                        value={settings.name}
                        onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                        className="rounded-xl border border-foreground/15 bg-background px-4 py-2.5 text-sm font-normal outline-none focus:border-foreground"
                      />
                    </label>

                    <label className="grid gap-2 text-xs font-semibold uppercase tracking-wider">
                      Lema / Eslogan
                      <input
                        type="text"
                        value={settings.tagline}
                        onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                        className="rounded-xl border border-foreground/15 bg-background px-4 py-2.5 text-sm font-normal outline-none focus:border-foreground"
                      />
                    </label>
                  </div>

                  <label className="grid gap-2 text-xs font-semibold uppercase tracking-wider">
                    Descripción de la Organización
                    <textarea
                      rows={3}
                      value={settings.description}
                      onChange={(e) => setSettings({ ...settings, description: e.target.value })}
                      className="rounded-xl border border-foreground/15 bg-background px-4 py-2.5 text-sm font-normal outline-none focus:border-foreground resize-none"
                    />
                  </label>

                  <h3 className="text-sm font-bold pt-2 border-t border-foreground/10 flex items-center gap-2">
                    <Phone className="size-4 text-primary" /> Canales de Contacto Directo
                  </h3>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <label className="grid gap-2 text-xs font-semibold uppercase tracking-wider">
                      Teléfono Móvil / WhatsApp
                      <input
                        type="text"
                        value={settings.phone}
                        onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                        className="rounded-xl border border-foreground/15 bg-background px-4 py-2.5 text-sm font-normal outline-none focus:border-foreground"
                      />
                    </label>

                    <label className="grid gap-2 text-xs font-semibold uppercase tracking-wider">
                      Correo Electrónico Oficial
                      <input
                        type="email"
                        value={settings.email}
                        onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                        className="rounded-xl border border-foreground/15 bg-background px-4 py-2.5 text-sm font-normal outline-none focus:border-foreground"
                      />
                    </label>
                  </div>
                </div>
              )}

              {/* DYNAMIC WEB INPUT BUILDER SECTION */}
              {settingsSection === 'forms' && (
                <div className="bg-card border border-foreground/10 rounded-2xl p-6 sm:p-8 space-y-8 shadow-xs">
                  {/* Selector of which form to configure */}
                  <div className="flex items-center justify-between border-b border-foreground/10 pb-4">
                    <div>
                      <h2 className="text-lg font-bold flex items-center gap-2">
                        <FileQuestion className="size-5 text-primary" /> Diseñador de Inputs Web para Formularios
                      </h2>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Agrega campos personalizados especificando su tipo HTML real (Texto, Email, Fecha, Booleano, Número, Selección).
                      </p>
                    </div>

                    <div className="flex items-center gap-2 bg-secondary p-1 rounded-xl">
                      <button
                        type="button"
                        onClick={() => setNewFieldTarget('adoption')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${newFieldTarget === 'adoption' ? 'bg-primary text-primary-foreground shadow-xs' : 'text-muted-foreground'}`}
                      >
                        Formulario Adopción
                      </button>
                      <button
                        type="button"
                        onClick={() => setNewFieldTarget('foster')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${newFieldTarget === 'foster' ? 'bg-primary text-primary-foreground shadow-xs' : 'text-muted-foreground'}`}
                      >
                        Formulario Casa Puente
                      </button>
                    </div>
                  </div>

                  {/* Add New Field Box */}
                  <div className="p-5 rounded-2xl bg-background border border-foreground/15 space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                      <Plus className="size-4" /> Crear nuevo Input Web para {newFieldTarget === 'adoption' ? 'Adopción' : 'Casa Puente'}
                    </h3>

                    <div className="grid gap-4 sm:grid-cols-3">
                      <label className="grid gap-1 text-xs font-semibold">
                        Etiqueta / Pregunta *
                        <input
                          type="text"
                          placeholder="Ej. Fecha de nacimiento, ¿Tiene perro?"
                          value={newFieldLabel}
                          onChange={(e) => setNewFieldLabel(e.target.value)}
                          className="rounded-xl border border-foreground/15 bg-card px-3 py-2 text-xs outline-none"
                        />
                      </label>

                      <label className="grid gap-1 text-xs font-semibold">
                        Tipo de Input Web *
                        <select
                          value={newFieldType}
                          onChange={(e) => setNewFieldType(e.target.value as CustomFieldType)}
                          className="rounded-xl border border-foreground/15 bg-card px-3 py-2 text-xs outline-none cursor-pointer"
                        >
                          <option value="text">Texto Corto (text)</option>
                          <option value="email">Correo Electrónico (email)</option>
                          <option value="tel">Teléfono (tel)</option>
                          <option value="date">Fecha (date / F.Nacimiento)</option>
                          <option value="number">Número (number)</option>
                          <option value="boolean">Booleano / Sí o No (checkbox/radio)</option>
                          <option value="select">Menú de Selección (select)</option>
                          <option value="textarea">Texto Largo / Área (textarea)</option>
                        </select>
                      </label>

                      <label className="grid gap-1 text-xs font-semibold">
                        Texto de Ayuda / Placeholder
                        <input
                          type="text"
                          placeholder="Ej. DD/MM/AAAA o Escribe aquí..."
                          value={newFieldPlaceholder}
                          onChange={(e) => setNewFieldPlaceholder(e.target.value)}
                          className="rounded-xl border border-foreground/15 bg-card px-3 py-2 text-xs outline-none"
                        />
                      </label>
                    </div>

                    {newFieldType === 'select' && (
                      <label className="grid gap-1 text-xs font-semibold">
                        Opciones para el Menú de Selección (Separadas por comas) *
                        <input
                          type="text"
                          placeholder="Ej. Menos de 3 horas, De 3 a 6 horas, Más de 6 horas"
                          value={newFieldOptionsRaw}
                          onChange={(e) => setNewFieldOptionsRaw(e.target.value)}
                          className="rounded-xl border border-foreground/15 bg-card px-3 py-2 text-xs outline-none"
                        />
                      </label>
                    )}

                    <div className="flex items-center justify-between pt-2">
                      <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                        <input
                          type="checkbox"
                          checked={newFieldRequired}
                          onChange={(e) => setNewFieldRequired(e.target.checked)}
                          className="rounded border-foreground/20 text-primary size-4"
                        />
                        <span>Campo Obligatorio (Required)</span>
                      </label>

                      <button
                        type="button"
                        onClick={() => handleAddCustomField(newFieldTarget)}
                        className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:scale-[1.02] transition"
                      >
                        + Agregar Input al Formulario
                      </button>
                    </div>
                  </div>

                  {/* Active Fields Preview */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-bold flex items-center justify-between">
                      <span>Inputs Web Configurados para {newFieldTarget === 'adoption' ? 'Adopción' : 'Casas Puente'}</span>
                      <span className="text-xs text-muted-foreground font-normal">
                        ({newFieldTarget === 'adoption' ? settings.adoptionFormFields.length : settings.fosterFormFields.length} campos)
                      </span>
                    </h3>

                    <div className="space-y-2.5">
                      {(newFieldTarget === 'adoption' ? settings.adoptionFormFields : settings.fosterFormFields).map((field, idx) => (
                        <div
                          key={field.id}
                          className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-foreground/10 bg-background hover:border-foreground/20 transition-all text-xs"
                        >
                          <div className="flex items-center gap-3">
                            <span className="grid size-7 place-items-center rounded-lg bg-primary/10 text-primary font-bold">
                              {getFieldTypeIcon(field.type)}
                            </span>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-sm">{field.label}</span>
                                {field.required && (
                                  <span className="text-[10px] bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full font-bold">
                                    Requerido
                                  </span>
                                )}
                              </div>
                              <p className="text-muted-foreground mt-0.5">
                                Tipo HTML: <strong className="text-foreground">{field.type}</strong>
                                {field.placeholder && ` · Placeholder: "${field.placeholder}"`}
                                {field.options && ` · Opciones: [${field.options.join(', ')}]`}
                              </p>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleRemoveCustomField(newFieldTarget, field.id)}
                            className="p-2 rounded-lg text-rose-600 hover:bg-rose-50 transition self-end sm:self-center"
                            title="Eliminar Input"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 3. Visual Identity & Images */}
              {settingsSection === 'appearance' && (
                <div className="bg-card border border-foreground/10 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
                  <h2 className="text-lg font-bold border-b border-foreground/10 pb-3 flex items-center gap-2">
                    <Palette className="size-5 text-primary" /> Personalización Visual & Imágenes
                  </h2>

                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-3 p-4 rounded-xl border border-foreground/10 bg-background">
                      <span className="text-xs font-semibold uppercase tracking-wider block">Logotipo del Refugio</span>
                      <div className="flex items-center gap-4">
                        <img
                          src={settings.logoUrl}
                          alt="Logo Preview"
                          className="size-16 rounded-2xl object-cover border border-foreground/15"
                        />
                        <div className="flex-1 space-y-2">
                          <input
                            type="url"
                            placeholder="URL del logo"
                            value={settings.logoUrl}
                            onChange={(e) => setSettings({ ...settings, logoUrl: e.target.value })}
                            className="w-full text-xs rounded-lg border border-foreground/15 p-2 bg-card outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 p-4 rounded-xl border border-foreground/10 bg-background">
                      <span className="text-xs font-semibold uppercase tracking-wider block">Imagen de Portada Principal</span>
                      <div className="space-y-2">
                        <img
                          src={settings.heroBannerUrl}
                          alt="Hero Banner Preview"
                          className="h-16 w-full rounded-xl object-cover border border-foreground/15"
                        />
                        <input
                          type="url"
                          placeholder="URL de imagen de portada"
                          value={settings.heroBannerUrl}
                          onChange={(e) => setSettings({ ...settings, heroBannerUrl: e.target.value })}
                          className="w-full text-xs rounded-lg border border-foreground/15 p-2 bg-card outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 4. Location & Schedule */}
              {settingsSection === 'location' && (
                <div className="bg-card border border-foreground/10 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
                  <h2 className="text-lg font-bold border-b border-foreground/10 pb-3 flex items-center gap-2">
                    <MapPin className="size-5 text-primary" /> Dirección Física y Horarios
                  </h2>

                  <label className="grid gap-2 text-xs font-semibold uppercase tracking-wider">
                    Calle y Número
                    <input
                      type="text"
                      value={settings.address}
                      onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                      className="rounded-xl border border-foreground/15 bg-background px-4 py-2.5 text-sm font-normal outline-none focus:border-foreground"
                    />
                  </label>
                </div>
              )}

              {/* 5. Contracts & Rules */}
              {settingsSection === 'legal' && (
                <div className="bg-card border border-foreground/10 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
                  <h2 className="text-lg font-bold border-b border-foreground/10 pb-3 flex items-center gap-2">
                    <Scale className="size-5 text-primary" /> Cláusulas de Adopción y Reglamento
                  </h2>

                  <label className="grid gap-2 text-xs font-semibold uppercase tracking-wider">
                    Contrato Oficial de Adopción Responsable (Términos legales)
                    <textarea
                      rows={8}
                      value={settings.adoptionContractTerms}
                      onChange={(e) => setSettings({ ...settings, adoptionContractTerms: e.target.value })}
                      className="rounded-xl border border-foreground/15 bg-background p-4 text-xs font-mono leading-relaxed outline-none focus:border-foreground resize-none"
                    />
                  </label>
                </div>
              )}

              {/* Save Bar */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-foreground/10">
                <button
                  type="submit"
                  className="px-6 py-2.5 text-sm font-medium rounded-full bg-primary text-primary-foreground hover:scale-[1.02] active:scale-[0.98] transition-all shadow-sm flex items-center gap-2"
                >
                  <Save className="size-4" /> Guardar Configuración de Formularios
                </button>
              </div>
            </form>
          </div>
        )}
      </main>

      {/* MODAL: REGISTRAR CASA PUENTE CON INPUTS DINÁMICOS */}
      {showAddFosterModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-foreground/10 rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-foreground/10 pb-3">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <Home className="size-5 text-primary" /> Registrar Nueva Casa Puente
              </h3>
              <button onClick={() => setShowAddFosterModal(false)} className="text-muted-foreground hover:text-foreground">
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleCreateFoster} className="space-y-4 text-xs">
              <label className="grid gap-1 font-semibold uppercase tracking-wider">
                Nombre de la Persona / Familia *
                <input
                  required
                  type="text"
                  placeholder="Ej. Dra. Andrea Salgado"
                  value={newFoster.name}
                  onChange={(e) => setNewFoster({ ...newFoster, name: e.target.value })}
                  className="rounded-xl border border-foreground/15 bg-background px-3.5 py-2 text-sm font-normal outline-none"
                />
              </label>

              <div className="grid gap-3 sm:grid-cols-2">
                <label className="grid gap-1 font-semibold uppercase tracking-wider">
                  Teléfono (tel) *
                  <input
                    required
                    type="tel"
                    placeholder="+52 55..."
                    value={newFoster.phone}
                    onChange={(e) => setNewFoster({ ...newFoster, phone: e.target.value })}
                    className="rounded-xl border border-foreground/15 bg-background px-3.5 py-2 text-sm font-normal outline-none"
                  />
                </label>

                <label className="grid gap-1 font-semibold uppercase tracking-wider">
                  Correo Electrónico (email) *
                  <input
                    required
                    type="email"
                    placeholder="correo@ejemplo.com"
                    value={newFoster.email}
                    onChange={(e) => setNewFoster({ ...newFoster, email: e.target.value })}
                    className="rounded-xl border border-foreground/15 bg-background px-3.5 py-2 text-sm font-normal outline-none"
                  />
                </label>
              </div>

              {/* RENDER DYNAMIC CUSTOM FIELDS FOR FOSTER */}
              {settings.fosterFormFields.map((field) => (
                <div key={field.id} className="grid gap-1 font-semibold uppercase tracking-wider">
                  <span>{field.label} {field.required && '*'}</span>

                  {field.type === 'boolean' ? (
                    <div className="flex items-center gap-4 py-1">
                      <label className="flex items-center gap-2 cursor-pointer text-xs font-normal">
                        <input
                          type="radio"
                          name={field.id}
                          checked={newFoster.customResponses[field.id] === true}
                          onChange={() => setNewFoster({
                            ...newFoster,
                            customResponses: { ...newFoster.customResponses, [field.id]: true }
                          })}
                          className="text-primary"
                        />
                        Sí
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer text-xs font-normal">
                        <input
                          type="radio"
                          name={field.id}
                          checked={newFoster.customResponses[field.id] === false}
                          onChange={() => setNewFoster({
                            ...newFoster,
                            customResponses: { ...newFoster.customResponses, [field.id]: false }
                          })}
                          className="text-primary"
                        />
                        No
                      </label>
                    </div>
                  ) : field.type === 'select' ? (
                    <select
                      required={field.required}
                      value={String(newFoster.customResponses[field.id] || '')}
                      onChange={(e) => setNewFoster({
                        ...newFoster,
                        customResponses: { ...newFoster.customResponses, [field.id]: e.target.value }
                      })}
                      className="rounded-xl border border-foreground/15 bg-background px-3 py-2 text-sm font-normal outline-none"
                    >
                      <option value="">Selecciona una opción...</option>
                      {field.options?.map((opt, i) => (
                        <option key={i} value={opt}>{opt}</option>
                      ))}
                    </select>
                  ) : field.type === 'textarea' ? (
                    <textarea
                      required={field.required}
                      rows={2}
                      placeholder={field.placeholder}
                      value={String(newFoster.customResponses[field.id] || '')}
                      onChange={(e) => setNewFoster({
                        ...newFoster,
                        customResponses: { ...newFoster.customResponses, [field.id]: e.target.value }
                      })}
                      className="rounded-xl border border-foreground/15 bg-background p-3 text-sm font-normal outline-none resize-none"
                    />
                  ) : (
                    <input
                      required={field.required}
                      type={field.type}
                      placeholder={field.placeholder}
                      value={String(newFoster.customResponses[field.id] || '')}
                      onChange={(e) => setNewFoster({
                        ...newFoster,
                        customResponses: { ...newFoster.customResponses, [field.id]: e.target.value }
                      })}
                      className="rounded-xl border border-foreground/15 bg-background px-3.5 py-2 text-sm font-normal outline-none"
                    />
                  )}
                </div>
              ))}

              <div className="pt-3 flex justify-end gap-2 border-t border-foreground/10">
                <button
                  type="button"
                  onClick={() => setShowAddFosterModal(false)}
                  className="px-4 py-2 rounded-xl border border-foreground/15 text-muted-foreground hover:bg-secondary font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-primary text-primary-foreground font-semibold"
                >
                  Guardar Casa Puente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: REGISTRAR AGRADECIMIENTO */}
      {showAddThankModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-foreground/10 rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-foreground/10 pb-3">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <Gift className="size-5 text-primary" /> Registrar Agradecimiento
              </h3>
              <button onClick={() => setShowAddThankModal(false)} className="text-muted-foreground hover:text-foreground">
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleCreateThank} className="space-y-4 text-xs">
              <label className="grid gap-1 font-semibold uppercase tracking-wider">
                Nombre del Donante / Aliado *
                <input
                  required
                  type="text"
                  placeholder="Ej. Veterinaria San Antonio, Juan Pérez..."
                  value={newThank.name}
                  onChange={(e) => setNewThank({ ...newThank, name: e.target.value })}
                  className="rounded-xl border border-foreground/15 bg-background px-3.5 py-2 text-sm font-normal outline-none"
                />
              </label>

              <div className="grid gap-3 sm:grid-cols-2">
                <label className="grid gap-1 font-semibold uppercase tracking-wider">
                  Rol / Categoría
                  <select
                    value={newThank.role}
                    onChange={(e) => setNewThank({ ...newThank, role: e.target.value as any })}
                    className="rounded-xl border border-foreground/15 bg-background px-3 py-2 text-sm font-normal outline-none"
                  >
                    <option value="Donante">Donante</option>
                    <option value="Voluntario">Voluntario</option>
                    <option value="Empresa Aliada">Empresa Aliada</option>
                    <option value="Padrino">Padrino</option>
                  </select>
                </label>

                <label className="grid gap-1 font-semibold uppercase tracking-wider">
                  Aportación / Donativo
                  <input
                    required
                    type="text"
                    placeholder="Ej. $2,000 MXN / 50kg Alimento"
                    value={newThank.amountOrContribution}
                    onChange={(e) => setNewThank({ ...newThank, amountOrContribution: e.target.value })}
                    className="rounded-xl border border-foreground/15 bg-background px-3.5 py-2 text-sm font-normal outline-none"
                  />
                </label>
              </div>

              <label className="grid gap-1 font-semibold uppercase tracking-wider">
                Mensaje de Reconocimiento
                <textarea
                  required
                  rows={3}
                  placeholder="Escribe unas palabras de agradecimiento..."
                  value={newThank.message}
                  onChange={(e) => setNewThank({ ...newThank, message: e.target.value })}
                  className="rounded-xl border border-foreground/15 bg-background p-3 text-sm font-normal outline-none resize-none"
                />
              </label>

              <div className="pt-3 flex justify-end gap-2 border-t border-foreground/10">
                <button
                  type="button"
                  onClick={() => setShowAddThankModal(false)}
                  className="px-4 py-2 rounded-xl border border-foreground/15 text-muted-foreground hover:bg-secondary font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-primary text-primary-foreground font-semibold"
                >
                  Publicar Agradecimiento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
