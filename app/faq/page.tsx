import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { HelpCircle } from "lucide-react"

const faqData = [
  {
    question: "Cos'è Lavori Halal?",
    answer: "Lavori Halal è una piattaforma italiana che connette professionisti e aziende con opportunità di lavoro etiche e trasparenti, rispettando i principi halal nelle pratiche lavorative."
  },
  {
    question: "Come funziona la piattaforma?",
    answer: "Puoi cercare annunci di lavoro, creare il tuo profilo professionale, applicare alle posizioni interessanti e pubblicare offerte di lavoro se sei un'azienda. Tutto in modo semplice e sicuro."
  },
  {
    question: "È gratuito usare Lavori Halal?",
    answer: "Sì, la ricerca di lavoro e la creazione del profilo sono completamente gratuiti. Per le aziende che pubblicano annunci sono disponibili piani flessibili con diverse opzioni."
  },
  {
    question: "Quali tipi di lavoro trovo sulla piattaforma?",
    answer: "Trovi opportunità in vari settori: tecnologia, finanza, sanità, istruzione, servizi e molto altro. Tutte le offerte verificati per garantire standard etici."
  },
  {
    question: "Come creo un profilo?",
    answer: "Clicca su 'Registrati', compila i tuoi dati professionali, aggiungi la tua esperienza e le competenze. Il profilo sarà visibile alle aziende che cercano talenti come te."
  },
  {
    question: "Posso applicare a più offerte contemporaneamente?",
    answer: "Sì, puoi applicare a tutte le offerte che ti interessano. Ti consigliamo di personalizzare ogni candidatura per aumentare le possibilità di successo."
  },
  {
    question: "Come pubblico un annuncio di lavoro?",
    answer: "Dopo aver effettuato l'accesso, clicca su 'Pubblica' e segui la procedura guidata. Potrai descrivere la posizione, i requisiti e i benefici offerti."
  },
  {
    question: "Come vengono verificati gli annunci?",
    answer: "Il nostro team revisiona ogni annuncio per garantire autenticità e conformità con i principi etici della piattaforma. Questo processo richiede solitamente 24-48 ore."
  },
  {
    question: "Posso modificare il mio profilo dopo la registrazione?",
    answer: "Certamente! Puoi aggiornare il tuo profilo in qualsiasi momento dalla tua dashboard personale, aggiungendo nuove esperienze o competenze."
  },
  {
    question: "Come contatto il supporto?",
    answer: "Puoi contattarci tramite la sezione contatti del sito o scrivendo a supporto@lavorihalal.it. Rispondiamo entro 24 ore lavorative."
  }
]

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <HelpCircle className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">Domande Frequenti</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Trova risposte alle domande più comuni su Lavori Halal
          </p>
        </div>

        <div className="bg-card rounded-lg border p-6">
          <Accordion type="single" collapsible className="space-y-4">
            {faqData.map((item, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="border-b last:border-b-0 pb-4 last:pb-0"
              >
                <AccordionTrigger className="text-left hover:no-underline">
                  <span className="font-medium text-foreground">{item.question}</span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground mt-2">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="mt-12 text-center p-6 bg-muted/50 rounded-lg">
          <h2 className="text-xl font-semibold text-foreground mb-3">
            Non hai trovato la risposta che cercavi?
          </h2>
          <p className="text-muted-foreground mb-6">
            Il nostro team è qui per aiutarti. Contattaci direttamente per qualsiasi domanda.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a 
              href="/contact" 
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
            >
              Contattaci
            </a>
            <a 
              href="/jobs" 
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
            >
              Cerca Lavoro
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
