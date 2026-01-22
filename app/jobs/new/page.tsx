"use client"

import React from "react"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, Loader2, Briefcase, ArrowLeft, Plus, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const SECTORS = [
  "IT & Tecnologia",
  "Finance & Banking",
  "Marketing & Comunicazione",
  "Risorse Umane",
  "Vendite & Commerciale",
  "Design & Creatività",
  "Ingegneria",
  "Sanità & Healthcare",
  "Legal & Compliance",
  "Consulenza",
  "Operations & Logistica",
  "Altro"
]

const SOURCES = [
  "LinkedIn",
  "Indeed",
  "Glassdoor",
  "Sito Aziendale",
  "Referral",
  "Agenzia",
  "Altro"
]

const CONTACT_TYPES = [
  "HR / Recruiter",
  "Manager",
  "Ex Collega",
  "Direttore",
  "Team Lead",
  "Fondatore / CEO",
  "Altro"
]

const WORK_MODES = [
  "Remoto",
  "Ibrido",
  "In sede",
  "Da definire"
]

export default function NewJobPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  // Form state
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [halalReason, setHalalReason] = useState("")
  const [isPiva, setIsPiva] = useState<string>("")
  const [source, setSource] = useState("")
  const [sector, setSector] = useState("")
  const [contactType, setContactType] = useState("")
  const [interviewProcess, setInterviewProcess] = useState("")
  const [technologies, setTechnologies] = useState<string[]>([])
  const [techInput, setTechInput] = useState("")
  const [availability, setAvailability] = useState("")
  const [projectDuration, setProjectDuration] = useState("")
  const [workMode, setWorkMode] = useState("")
  const [workModeCustom, setWorkModeCustom] = useState("")
  const [salaryMin, setSalaryMin] = useState("")
  const [salaryMax, setSalaryMax] = useState("")
  const [dailyRateMin, setDailyRateMin] = useState("")
  const [dailyRateMax, setDailyRateMax] = useState("")
  const [notes, setNotes] = useState("")

  const addTechnology = () => {
    if (techInput.trim() && !technologies.includes(techInput.trim())) {
      setTechnologies([...technologies, techInput.trim()])
      setTechInput("")
    }
  }

  const removeTechnology = (tech: string) => {
    setTechnologies(technologies.filter(t => t !== tech))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      setError("Devi essere autenticato per pubblicare un annuncio")
      setLoading(false)
      return
    }

    const jobData = {
      user_id: user.id,
      title,
      description,
      halal_reason: halalReason,
      is_piva: isPiva === "true",
      source,
      sector,
      contact_type: contactType,
      interview_process: interviewProcess,
      technologies,
      availability_period: availability,
      project_duration: isPiva === "true" ? projectDuration : null,
      work_mode: workMode === "Altro" ? workModeCustom : workMode,
      salary_min: isPiva !== "true" && salaryMin ? parseInt(salaryMin) : null,
      salary_max: isPiva !== "true" && salaryMax ? parseInt(salaryMax) : null,
      daily_rate_min: isPiva === "true" && dailyRateMin ? parseInt(dailyRateMin) : null,
      daily_rate_max: isPiva === "true" && dailyRateMax ? parseInt(dailyRateMax) : null,
      notes,
    }

    const { error: insertError } = await supabase.from("jobs").insert(jobData)

    if (insertError) {
      setError(insertError.message)
      setLoading(false)
    } else {
      router.push("/dashboard")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Briefcase className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">Lavori Halal</span>
          </Link>
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Pubblica Annuncio</h1>
          <p className="text-muted-foreground mt-2">Condividi un&apos;opportunità di lavoro con la community</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {error && (
            <div className="flex items-center gap-2 p-4 text-sm text-destructive bg-destructive/10 rounded-lg">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-card-foreground">Informazioni Base</CardTitle>
              <CardDescription>Dettagli principali dell&apos;opportunità</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-card-foreground">Titolo Posizione *</Label>
                <Input
                  id="title"
                  placeholder="es. Senior Frontend Developer"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="bg-background"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-card-foreground">Descrizione *</Label>
                <Textarea
                  id="description"
                  placeholder="Descrivi l'opportunità, responsabilità e requisiti..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  rows={5}
                  className="bg-background"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="halalReason" className="text-card-foreground">Perché è Halal? *</Label>
                <Textarea
                  id="halalReason"
                  placeholder="Spiega perché questa opportunità rispetta i principi etici halal..."
                  value={halalReason}
                  onChange={(e) => setHalalReason(e.target.value)}
                  required
                  rows={3}
                  className="bg-background"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-card-foreground">Tipo Contratto *</Label>
                  <Select value={isPiva} onValueChange={setIsPiva} required>
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="Seleziona..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="false">Dipendente</SelectItem>
                      <SelectItem value="true">Partita IVA / Freelance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-card-foreground">Settore *</Label>
                  <Select value={sector} onValueChange={setSector} required>
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="Seleziona..." />
                    </SelectTrigger>
                    <SelectContent>
                      {SECTORS.map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Source & Contact */}
          <Card>
            <CardHeader>
              <CardTitle className="text-card-foreground">Fonte e Contatto</CardTitle>
              <CardDescription>Da dove proviene questa opportunità</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-card-foreground">Fonte *</Label>
                  <Select value={source} onValueChange={setSource} required>
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="Seleziona..." />
                    </SelectTrigger>
                    <SelectContent>
                      {SOURCES.map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-card-foreground">Tipo Contatto *</Label>
                  <Select value={contactType} onValueChange={setContactType} required>
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="Seleziona..." />
                    </SelectTrigger>
                    <SelectContent>
                      {CONTACT_TYPES.map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Interview Process */}
          <Card>
            <CardHeader>
              <CardTitle className="text-card-foreground">Processo di Selezione</CardTitle>
              <CardDescription>Come funziona il colloquio step by step</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="interviewProcess" className="text-card-foreground">Step del Colloquio *</Label>
                <Textarea
                  id="interviewProcess"
                  placeholder="1. Screening telefonico&#10;2. Colloquio tecnico&#10;3. Colloquio con il team&#10;4. Offerta finale"
                  value={interviewProcess}
                  onChange={(e) => setInterviewProcess(e.target.value)}
                  required
                  rows={5}
                  className="bg-background"
                />
              </div>
            </CardContent>
          </Card>

          {/* Technologies */}
          <Card>
            <CardHeader>
              <CardTitle className="text-card-foreground">Tecnologie e Competenze</CardTitle>
              <CardDescription>Cosa bisogna sapere per questa posizione</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Aggiungi tecnologia o competenza..."
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTechnology())}
                  className="bg-background"
                />
                <Button type="button" onClick={addTechnology} variant="secondary">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              {technologies.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {technologies.map((tech) => (
                    <Badge key={tech} variant="secondary" className="flex items-center gap-1">
                      {tech}
                      <button type="button" onClick={() => removeTechnology(tech)}>
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Availability & Work Mode */}
          <Card>
            <CardHeader>
              <CardTitle className="text-card-foreground">Disponibilità e Modalità</CardTitle>
              <CardDescription>Quando e dove lavorare</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="availability" className="text-card-foreground">Periodo Disponibilità *</Label>
                  <Input
                    id="availability"
                    placeholder="es. Da subito, Febbraio 2026..."
                    value={availability}
                    onChange={(e) => setAvailability(e.target.value)}
                    required
                    className="bg-background"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-card-foreground">Modalità Lavoro *</Label>
                  <Select value={workMode} onValueChange={setWorkMode} required>
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="Seleziona..." />
                    </SelectTrigger>
                    <SelectContent>
                      {WORK_MODES.map((w) => (
                        <SelectItem key={w} value={w}>{w}</SelectItem>
                      ))}
                      <SelectItem value="Altro">Altro (specifica)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {workMode === "Altro" && (
                <div className="space-y-2">
                  <Label htmlFor="workModeCustom" className="text-card-foreground">Specifica modalità</Label>
                  <Input
                    id="workModeCustom"
                    placeholder="Descrivi la modalità di lavoro..."
                    value={workModeCustom}
                    onChange={(e) => setWorkModeCustom(e.target.value)}
                    className="bg-background"
                  />
                </div>
              )}

              {isPiva === "true" && (
                <div className="space-y-2">
                  <Label htmlFor="projectDuration" className="text-card-foreground">Durata Progetto</Label>
                  <Input
                    id="projectDuration"
                    placeholder="es. 6 mesi, 1 anno, Indeterminato..."
                    value={projectDuration}
                    onChange={(e) => setProjectDuration(e.target.value)}
                    className="bg-background"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Compensation */}
          <Card>
            <CardHeader>
              <CardTitle className="text-card-foreground">Compenso</CardTitle>
              <CardDescription>
                {isPiva === "true" ? "Rate giornaliera per P.IVA" : isPiva === "false" ? "RAL per dipendente" : "Seleziona prima il tipo di contratto"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isPiva === "false" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="salaryMin" className="text-card-foreground">RAL Minima (EUR)</Label>
                    <Input
                      id="salaryMin"
                      type="number"
                      placeholder="es. 35000"
                      value={salaryMin}
                      onChange={(e) => setSalaryMin(e.target.value)}
                      className="bg-background"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="salaryMax" className="text-card-foreground">RAL Massima (EUR)</Label>
                    <Input
                      id="salaryMax"
                      type="number"
                      placeholder="es. 45000"
                      value={salaryMax}
                      onChange={(e) => setSalaryMax(e.target.value)}
                      className="bg-background"
                    />
                  </div>
                </div>
              )}

              {isPiva === "true" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dailyRateMin" className="text-card-foreground">Rate Giornaliera Min (EUR)</Label>
                    <Input
                      id="dailyRateMin"
                      type="number"
                      placeholder="es. 300"
                      value={dailyRateMin}
                      onChange={(e) => setDailyRateMin(e.target.value)}
                      className="bg-background"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dailyRateMax" className="text-card-foreground">Rate Giornaliera Max (EUR)</Label>
                    <Input
                      id="dailyRateMax"
                      type="number"
                      placeholder="es. 450"
                      value={dailyRateMax}
                      onChange={(e) => setDailyRateMax(e.target.value)}
                      className="bg-background"
                    />
                  </div>
                </div>
              )}

              {!isPiva && (
                <p className="text-muted-foreground text-sm">Seleziona il tipo di contratto per visualizzare i campi relativi al compenso.</p>
              )}
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-card-foreground">Note Aggiuntive</CardTitle>
              <CardDescription>Altre informazioni utili</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Aggiungi qualsiasi altra informazione rilevante..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="bg-background"
              />
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button type="submit" size="lg" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Pubblicazione...
                </>
              ) : (
                "Pubblica Annuncio"
              )}
            </Button>
            <Button type="button" variant="outline" size="lg" onClick={() => router.back()}>
              Annulla
            </Button>
          </div>
        </form>
      </main>
    </div>
  )
}
