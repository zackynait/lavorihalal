import Link from "next/link"
import { Briefcase, Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Briefcase className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">Lavori Halal</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Piattaforma italiana per opportunità di lavoro etiche e trasparenti.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Piattaforma</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/jobs" className="text-muted-foreground hover:text-foreground transition-colors">
                  Annunci di lavoro
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-muted-foreground hover:text-foreground transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                  Chi siamo
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Supporto</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                  Contatti
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                  Termini di servizio
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Contatti</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>info@lavorihalal.it</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>+39 02 12345678</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>Milano, Italia</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 Lavori Halal. Tutti i diritti riservati.</p>
        </div>
      </div>
    </footer>
  )
}
