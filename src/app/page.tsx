export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <div className="text-center py-20">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Benvenuto su LavoriHalal</h1>
        <p className="text-xl text-gray-600 mb-8">La piattaforma per trovare opportunità di lavoro etiche</p>
        
        <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Cerca lavoro</h2>
          <div className="flex flex-col space-y-4">
            <input 
              type="text" 
              placeholder="Cosa stai cercando?" 
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <input 
              type="text" 
              placeholder="Dove?" 
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button className="bg-green-600 text-white py-2 px-6 rounded-lg hover:bg-green-700 transition-colors">
              Cerca
            </button>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold text-center mb-8">Ultime offerte</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Job Card 1 */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold">Sviluppatore Frontend</h3>
            <p className="text-gray-600">TechHalal SRL - Milano</p>
            <p className="text-green-600 font-medium mt-2">35K - 45K €/anno</p>
            <p className="mt-2 text-sm text-gray-500">Pubblicato 2 giorni fa</p>
          </div>
          
          {/* Job Card 2 */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold">Graphic Designer</h3>
            <p className="text-gray-600">Creative Halal - Roma</p>
            <p className="text-green-600 font-medium mt-2">20K - 28K €/anno</p>
            <p className="mt-2 text-sm text-gray-500">Pubblicato 1 settimana fa</p>
          </div>
        </div>
      </div>
    </main>
  );
}
