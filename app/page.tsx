import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Briefcase, MapPin, Clock, Building2, ArrowRight, Users, Shield, MessageCircle } from "lucide-react"
import { Header } from "@/components/header"

export default async function HomePage() {
  let jobs: any[] = []
  
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("jobs")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(6)
    
    if (!error && data) {
      jobs = data
    }
  } catch (e) {
    console.error("Error fetching jobs:", e)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-b from-primary/5 to-background">
        <div className="max-w-6xl mx-auto text-center">
          <Badge variant="secondary" className="mb-4">
            Opportunità di lavoro etiche
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance">
            Trova il tuo prossimo lavoro in modo <span className="text-primary">halal</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8 text-pretty">
            Una piattaforma dove la trasparenza e l&apos;etica sono al primo posto. 
            Connettiti direttamente con chi pubblica le opportunità.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/jobs">
              <Button size="lg" className="w-full sm:w-auto">
                Esplora Annunci
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link href="/auth/sign-up">
              <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent">
                Registrati Gratis
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">Perché Lavori Halal?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Trasparenza Totale</h3>
              <p className="text-muted-foreground">
                Ogni annuncio include tutti i dettagli: compenso, processo di selezione, tecnologie richieste.
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Chat Diretta</h3>
              <p className="text-muted-foreground">
                Contatta direttamente chi pubblica l&apos;annuncio senza intermediari.
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Community Etica</h3>
              <p className="text-muted-foreground">
                Una community di professionisti che condividono valori e opportunità.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Jobs Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-foreground">Ultimi Annunci</h2>
            <Link href="/jobs">
              <Button variant="ghost">
                Vedi tutti
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>

          {jobs && jobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map((job) => (
                <Link key={job.id} href={`/jobs/${job.id}`}>
                  <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer border-border">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg text-card-foreground line-clamp-1">{job.title}</CardTitle>
                          <CardDescription className="flex items-center gap-1 mt-1">
                            <Building2 className="w-3 h-3" />
                            {job.sector}
                          </CardDescription>
                        </div>
                        <Badge variant={job.contract_type === "piva" ? "outline" : "secondary"}>
                          {job.contract_type === "piva" ? "P.IVA" : job.contract_type === "dipendente" ? "Dipendente" : "Altro"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                        {job.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {job.technologies?.slice(0, 3).map((tech: string) => (
                          <Badge key={tech} variant="secondary" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                        {job.technologies?.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{job.technologies.length - 3}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {job.work_mode}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(job.created_at).toLocaleDateString("it-IT")}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <Card className="text-center py-12">
              <CardContent>
                <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-card-foreground mb-2">Nessun annuncio ancora</h3>
                <p className="text-muted-foreground mb-4">Sii il primo a pubblicare un&apos;opportunità!</p>
                <Link href="/jobs/new">
                  <Button>Pubblica Annuncio</Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Hai un&apos;opportunità da condividere?</h2>
          <p className="text-xl opacity-90 mb-8">
            Aiuta altri professionisti a trovare il loro prossimo lavoro etico.
          </p>
          <Link href="/jobs/new">
            <Button size="lg" variant="secondary">
              Pubblica Gratis
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Briefcase className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-foreground">Lavori Halal</span>
          </div>
          <p className="text-sm text-muted-foreground">
            2026 Lavori Halal. Tutti i diritti riservati.
          </p>
        </div>
      </footer>
    </div>
  )
}
