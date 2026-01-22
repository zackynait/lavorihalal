import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock, Building2, Briefcase, Euro } from "lucide-react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"

export default async function JobsPage() {
  let jobs: any[] = []
  
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("jobs")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
    
    if (!error && data) {
      jobs = data
    }
  } catch (e) {
    console.error("Error fetching jobs:", e)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Tutti gli Annunci</h1>
            <p className="text-muted-foreground mt-1">
              {jobs?.length || 0} opportunità disponibili
            </p>
          </div>
          <Link href="/jobs/new">
            <Button>Pubblica Annuncio</Button>
          </Link>
        </div>

        {jobs && jobs.length > 0 ? (
          <div className="space-y-4">
            {jobs.map((job) => (
              <Link key={job.id} href={`/jobs/${job.id}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer border-border">
                  <CardHeader className="pb-3">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                      <div>
                        <CardTitle className="text-xl text-card-foreground">{job.title}</CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-1">
                          <Building2 className="w-4 h-4" />
                          {job.sector}
                          <span className="text-border">|</span>
                          {job.source}
                        </CardDescription>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant={job.contract_type === "piva" ? "outline" : "secondary"}>
                          {job.contract_type === "piva" ? "P.IVA" : job.contract_type === "dipendente" ? "Dipendente" : "Altro"}
                        </Badge>
                        <Badge variant="secondary">{job.work_mode}</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                      {job.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {job.technologies?.slice(0, 5).map((tech: string) => (
                        <Badge key={tech} variant="secondary" className="text-xs bg-primary/10 text-primary border-0">
                          {tech}
                        </Badge>
                      ))}
                      {job.technologies?.length > 5 && (
                        <Badge variant="secondary" className="text-xs">
                          +{job.technologies.length - 5}
                        </Badge>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {job.work_mode}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {job.availability_period}
                      </span>
                      {job.contract_type === "piva" && job.daily_rate_min && (
                        <span className="flex items-center gap-1">
                          <Euro className="w-4 h-4" />
                          {job.daily_rate_min}-{job.daily_rate_max}/giorno
                        </span>
                      )}
                      {job.contract_type === "dipendente" && job.ral_min && (
                        <span className="flex items-center gap-1">
                          <Euro className="w-4 h-4" />
                          {(job.ral_min / 1000).toFixed(0)}k-{(job.ral_max / 1000).toFixed(0)}k RAL
                        </span>
                      )}
                      <span className="ml-auto text-xs">
                        {new Date(job.created_at).toLocaleDateString("it-IT")}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card className="text-center py-16">
            <CardContent>
              <Briefcase className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-card-foreground mb-2">Nessun annuncio disponibile</h3>
              <p className="text-muted-foreground mb-6">Sii il primo a pubblicare un&apos;opportunità!</p>
              <Link href="/jobs/new">
                <Button size="lg">Pubblica Annuncio</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
