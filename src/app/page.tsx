import Link from 'next/link';
import { Building2, Briefcase, MapPin, DollarSign, Clock, Search } from 'lucide-react';

// Mock data - in a real app, this would come from an API
type JobType = 'Full-time' | 'Part-time' | 'Freelance' | 'Stage' | 'Apprendistato';
type JobCategory = 'Sviluppo' | 'Design' | 'Marketing' | 'Vendite' | 'Risorse Umane' | 'Amministrazione';

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  type: JobType;
  category: JobCategory;
  salary: string;
  description: string;
  isHalalCertified: boolean;
  postedAt: string;
}

const jobs: Job[] = [
  {
    id: 1,
    title: 'Sviluppatore Frontend',
    company: 'TechHalal SRL',
    location: 'Milano, Italia',
    type: 'Full-time',
    category: 'Sviluppo',
    salary: '35K - 45K',
    description: 'Cerchiamo uno sviluppatore frontend con esperienza in React e Next.js.',
    isHalalCertified: true,
    postedAt: '2 giorni fa'
  },
  {
    id: 2,
    title: 'Graphic Designer',
    company: 'Creative Halal',
    location: 'Roma, Italia',
    type: 'Part-time',
    category: 'Design',
    salary: '20K - 28K',
    description: 'Cerchiamo un graphic designer creativo con esperienza in UI/UX.',
    isHalalCertified: true,
    postedAt: '1 settimana fa'
  }
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-green-600 to-emerald-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Trova il tuo lavoro Halal ideale</h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">Connettiamo professionisti musulmani con opportunità di lavoro etiche e rispettose dei tuoi valori</p>
          
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input 
                  type="text" 
                  placeholder="Cerca per parola chiave, competenza o azienda" 
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800"
                />
              </div>
              <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
                Cerca lavoro
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <section className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800">Ultime opportunità</h2>
            <Link href="/lavori" className="text-green-600 hover:underline">Vedi tutti</Link>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {jobs.map((job) => (
              <div key={job.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">{job.title}</h3>
                      <p className="text-gray-600 flex items-center mt-1">
                        <Building2 className="mr-2" size={16} />
                        {job.company}
                      </p>
                    </div>
                    {job.isHalalCertified && (
                      <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                        Halal Certified
                      </span>
                    )}
                  </div>
                  
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="inline-flex items-center bg-blue-100 text-blue-800 text-xs px-2.5 py-0.5 rounded">
                      <Briefcase className="mr-1" size={12} /> {job.type}
                    </span>
                    <span className="inline-flex items-center bg-purple-100 text-purple-800 text-xs px-2.5 py-0.5 rounded">
                      {job.category}
                    </span>
                  </div>
                  
                  <div className="mt-4 text-sm text-gray-600">
                    <p className="flex items-center">
                      <MapPin className="mr-2" size={14} /> {job.location}
                    </p>
                    <p className="flex items-center mt-1">
                      <DollarSign className="mr-2" size={14} /> RAL: {job.salary} €
                    </p>
                  </div>
                  
                  <p className="mt-3 text-gray-700 line-clamp-2">{job.description}</p>
                  
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-xs text-gray-500 flex items-center">
                      <Clock className="mr-1" size={12} /> {job.postedAt}
                    </span>
                    <Link 
                      href={`/lavori/${job.id}`} 
                      className="text-green-600 hover:text-green-800 text-sm font-medium"
                    >
                      Vedi dettagli →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white rounded-lg shadow-md p-8 mb-12">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Perché scegliere LavoriHalal?</h2>
            <p className="text-gray-600 mb-8">
              Offriamo opportunità di lavoro che rispettano i valori islamici, con aziende che condividono i tuoi principi etici e morali.
            </p>
            
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="text-green-600" size={24} />
                </div>
                <h3 className="font-semibold text-lg mb-2">Lavoro Etico</h3>
                <p className="text-gray-600 text-sm">Offriamo solo posizioni che rispettano i principi islamici</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="text-green-600" size={24} />
                </div>
                <h3 className="font-semibold text-lg mb-2">Trasparenza Salariale</h3>
                <p className="text-gray-600 text-sm">RAL chiare e competitive per ogni posizione</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Building2 className="text-green-600" size={24} />
                </div>
                <h3 className="font-semibold text-lg mb-2">Aziende Verificate</h3>
                <p className="text-gray-600 text-sm">Tutte le aziende sono attentamente selezionate</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">LavoriHalal</h3>
              <p className="text-gray-400 text-sm">La piattaforma di riferimento per trovare opportunità di lavoro halal in Italia.</p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Per Candidati</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">Crea il tuo profilo</a></li>
                <li><a href="#" className="hover:text-white">Cerca lavoro</a></li>
                <li><a href="#" className="hover:text-white">Consigli per il CV</a></li>
                <li><a href="#" className="hover:text-white">Preparazione al colloquio</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Per Aziende</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">Pubblica un annuncio</a></li>
                <li><a href="#" className="hover:text-white">Piani e prezzi</a></li>
                <li><a href="#" className="hover:text-white">Verifica Halal</a></li>
                <li><a href="#" className="hover:text-white">Contattaci</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Contatti</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Email: info@lavorihalal.it</li>
                <li>Telefono: +39 123 456 7890</li>
                <li>Milano, Italia</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-12 pt-8 text-center text-sm text-gray-400">
            <p> 2024 LavoriHalal. Tutti i diritti riservati.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
