import Link from "next/link"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Briefcase, MessageCircle, Plus, Eye, Clock, MoreVertical, Trash2, Edit } from "lucide-react"
import { Header } from "@/components/header"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DeleteJobButton } from "@/components/delete-job-button"

export default async function DashboardPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect("/auth/login")
  }

  // Fetch user's jobs
  const { data: myJobs } = await supabase
    .from("jobs")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  // Fetch conversations
  const { data: conversations } = await supabase
    .from("conversations")
    .select(`
      *,
      jobs (title),
      participant1:participant1_id (full_name),
      participant2:participant2_id (full_name)
    `)
    .or(`participant1_id.eq.${user.id},participant2_id.eq.${user.id}`)
    .order("updated_at", { ascending: false })
    .limit(5)

  const activeJobs = myJobs?.filter(j => j.status === "active") || []
  const closedJobs = myJobs?.filter(j => j.status === "closed") || []

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Ciao, {user.user_metadata?.full_name || user.email}
            </p>
          </div>
          <Link href="/jobs/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Pubblica Annuncio
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Annunci Attivi</CardTitle>
              <Briefcase className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-card-foreground">{activeJobs.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Conversazioni</CardTitle>
              <MessageCircle className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-card-foreground">{conversations?.length || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Annunci Chiusi</CardTitle>
              <Clock className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-card-foreground">{closedJobs.length}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Jobs Section */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="active" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="active">Attivi ({activeJobs.length})</TabsTrigger>
                <TabsTrigger value="closed">Chiusi ({closedJobs.length})</TabsTrigger>
              </TabsList>
              <TabsContent value="active" className="space-y-4 mt-4">
                {activeJobs.length > 0 ? (
                  activeJobs.map((job) => (
                    <Card key={job.id} className="border-border">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg text-card-foreground">{job.title}</CardTitle>
                            <CardDescription>{job.sector}</CardDescription>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link href={`/jobs/${job.id}`}>
                                  <Eye className="w-4 h-4 mr-2" />
                                  Visualizza
                                </Link>
                              </DropdownMenuItem>
                              <DeleteJobButton jobId={job.id} />
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2 mb-3">
                          <Badge variant={job.is_piva ? "outline" : "secondary"}>
                            {job.is_piva ? "P.IVA" : "Dipendente"}
                          </Badge>
                          <Badge variant="secondary">{job.work_mode}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Pubblicato il {new Date(job.created_at).toLocaleDateString("it-IT")}
                        </p>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Card className="text-center py-12">
                    <CardContent>
                      <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-card-foreground mb-2">Nessun annuncio attivo</h3>
                      <p className="text-muted-foreground mb-4">Pubblica il tuo primo annuncio</p>
                      <Link href="/jobs/new">
                        <Button>Pubblica Annuncio</Button>
                      </Link>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              <TabsContent value="closed" className="space-y-4 mt-4">
                {closedJobs.length > 0 ? (
                  closedJobs.map((job) => (
                    <Card key={job.id} className="border-border opacity-60">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg text-card-foreground">{job.title}</CardTitle>
                            <CardDescription>{job.sector}</CardDescription>
                          </div>
                          <Badge variant="outline">Chiuso</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-xs text-muted-foreground">
                          Chiuso il {new Date(job.updated_at).toLocaleDateString("it-IT")}
                        </p>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Card className="text-center py-12">
                    <CardContent>
                      <p className="text-muted-foreground">Nessun annuncio chiuso</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Messages Section */}
          <div>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-card-foreground">Messaggi Recenti</CardTitle>
                  <Link href="/chat">
                    <Button variant="ghost" size="sm">Vedi tutti</Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {conversations && conversations.length > 0 ? (
                  <div className="space-y-4">
                    {conversations.map((conv) => {
                      const otherUser = conv.participant1_id === user.id 
                        ? conv.participant2 
                        : conv.participant1
                      return (
                        <Link key={conv.id} href={`/chat/${conv.id}`}>
                          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="text-primary font-medium">
                                {otherUser?.full_name?.[0] || "?"}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-foreground truncate">
                                {otherUser?.full_name || "Utente"}
                              </p>
                              <p className="text-xs text-muted-foreground truncate">
                                {conv.jobs?.title}
                              </p>
                            </div>
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <MessageCircle className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground text-sm">Nessun messaggio</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
