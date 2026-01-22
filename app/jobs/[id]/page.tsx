import { notFound } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  MapPin, Clock, Building2, Euro, User, ExternalLink, 
  CheckCircle, ArrowLeft, MessageCircle, Briefcase
} from "lucide-react"
import { Header } from "@/components/header"
import { StartChatButton } from "@/components/start-chat-button"

interface JobPageProps {
  params: Promise<{ id: string }>
}

export default async function JobPage({ params }: JobPageProps) {
  const { id } = await params
  const supabase = await createClient()
  
  const { data: job, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("id", id)
    .single()

  // Fetch the profile separately
  let profileName = "Anonimo"
  if (job?.user_id) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", job.user_id)
      .single()
    if (profile?.full_name) {
      profileName = profile.full_name
    }
  }

  if (error || !job) {
    notFound()
  }

  const { data: { user } } = await supabase.auth.getUser()
  const isOwner = user?.id === job.user_id

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <Link href="/jobs" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Torna agli annunci
        </Link>

        <div className="grid gap-6">
          {/* Header Card */}
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge variant={job.is_piva ? "outline" : "secondary"}>
                      {job.is_piva ? "Partita IVA" : "Dipendente"}
                    </Badge>
                    <Badge variant="secondary">{job.work_mode}</Badge>
                    <Badge variant="secondary">{job.sector}</Badge>
                  </div>
                  <CardTitle className="text-2xl md:text-3xl text-card-foreground">{job.title}</CardTitle>
                  <CardDescription className="flex flex-wrap items-center gap-3 mt-2">
                    <span className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {profileName}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {new Date(job.created_at).toLocaleDateString("it-IT", { 
                        day: "numeric", 
                        month: "long", 
                        year: "numeric" 
                      })}
                    </span>
                  </CardDescription>
                </div>
                {!isOwner && user && (
                  <StartChatButton jobId={job.id} jobOwnerId={job.user_id} jobTitle={job.title} />
                )}
                {!user && (
                  <Link href="/auth/login">
                    <Button>
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Accedi per contattare
                    </Button>
                  </Link>
                )}
              </div>
            </CardHeader>
          </Card>

          {/* Halal Badge */}
          <Card className="border-primary/30 bg-primary/5">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-primary">
                <CheckCircle className="w-5 h-5" />
                Perché è Halal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground whitespace-pre-wrap">{job.halal_reason}</p>
            </CardContent>
          </Card>

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle className="text-card-foreground">Descrizione</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground whitespace-pre-wrap">{job.description}</p>
            </CardContent>
          </Card>

          {/* Quick Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-card-foreground flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-primary" />
                  Dettagli
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Settore</span>
                  <span className="font-medium text-foreground">{job.sector}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Fonte</span>
                  <span className="font-medium text-foreground">{job.source}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Contatto</span>
                  <span className="font-medium text-foreground">{job.contact_type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Modalità</span>
                  <span className="font-medium text-foreground">{job.work_mode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Disponibilità</span>
                  <span className="font-medium text-foreground">{job.availability_period}</span>
                </div>
                {job.is_piva && job.project_duration && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Durata Progetto</span>
                    <span className="font-medium text-foreground">{job.project_duration}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-card-foreground flex items-center gap-2">
                  <Euro className="w-5 h-5 text-primary" />
                  Compenso
                </CardTitle>
              </CardHeader>
              <CardContent>
                {job.is_piva ? (
                  <div>
                    {job.daily_rate_min && job.daily_rate_max ? (
                      <>
                        <p className="text-3xl font-bold text-foreground">
                          {job.daily_rate_min} - {job.daily_rate_max}
                        </p>
                        <p className="text-muted-foreground">EUR / giorno</p>
                      </>
                    ) : (
                      <p className="text-muted-foreground">Da definire</p>
                    )}
                  </div>
                ) : (
                  <div>
                    {job.salary_min && job.salary_max ? (
                      <>
                        <p className="text-3xl font-bold text-foreground">
                          {(job.salary_min / 1000).toFixed(0)}k - {(job.salary_max / 1000).toFixed(0)}k
                        </p>
                        <p className="text-muted-foreground">RAL annua</p>
                      </>
                    ) : (
                      <p className="text-muted-foreground">Da definire</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Technologies */}
          {job.technologies && job.technologies.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-card-foreground">Tecnologie e Competenze</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {job.technologies.map((tech: string) => (
                    <Badge key={tech} variant="secondary" className="text-sm bg-primary/10 text-primary border-0">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Interview Process */}
          <Card>
            <CardHeader>
              <CardTitle className="text-card-foreground">Processo di Selezione</CardTitle>
              <CardDescription>Come funziona il colloquio step by step</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground whitespace-pre-wrap">{job.interview_process}</p>
            </CardContent>
          </Card>

          {/* Notes */}
          {job.notes && (
            <Card>
              <CardHeader>
                <CardTitle className="text-card-foreground">Note Aggiuntive</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground whitespace-pre-wrap">{job.notes}</p>
              </CardContent>
            </Card>
          )}

          {/* CTA */}
          {!isOwner && (
            <Card className="bg-primary text-primary-foreground">
              <CardContent className="py-8 text-center">
                <h3 className="text-xl font-bold mb-2">Interessato a questa opportunità?</h3>
                <p className="opacity-90 mb-4">Contatta direttamente chi ha pubblicato l&apos;annuncio</p>
                {user ? (
                  <StartChatButton 
                    jobId={job.id} 
                    jobOwnerId={job.user_id} 
                    jobTitle={job.title}
                    variant="secondary"
                  />
                ) : (
                  <Link href="/auth/login">
                    <Button variant="secondary">
                      Accedi per contattare
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
