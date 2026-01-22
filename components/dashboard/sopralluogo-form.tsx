"use client"

import { useState, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import SignatureCanvas from "./signature-canvas"
import PhotoUpload from "./photo-upload"

export default function SopralluogoForm({ praticaId }) {
  const [step, setStep] = useState("info")
  const [loading, setLoading] = useState(false)
  const signatureRef = useRef(null)

  const [formData, setFormData] = useState({
    scheduled_at: new Date().toISOString().split("T")[0],
    condominio_name: "",
    condominio_email: "",
    details: {},
    photos: [],
  })

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handlePhotosUpdate = (photos) => {
    setFormData((prev) => ({ ...prev, photos }))
  }

  const handleSignatureCapture = (signatureData) => {
    handleSubmit(signatureData)
  }

  const handleSubmit = async (signatureData) => {
    setLoading(true)

    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      const { data: siteVisit } = await supabase
        .from("site_visits")
        .insert([
          {
            practice_id: praticaId,
            explorer_id: user?.id,
            completed_at: new Date().toISOString(),
            condominio_name: formData.condominio_name,
            condominio_email: formData.condominio_email,
            details: formData.details,
          },
        ])
        .select()

      await supabase.from("site_visit_forms").insert([
        {
          site_visit_id: siteVisit[0].id,
          signature_data: signatureData,
          photos_urls: formData.photos,
          submitted_at: new Date().toISOString(),
        },
      ])

      alert("Sopralluogo completato con successo!")
      setStep("info")
      setFormData({
        scheduled_at: new Date().toISOString().split("T")[0],
        condominio_name: "",
        condominio_email: "",
        details: {},
        photos: [],
      })
    } catch (error) {
      console.error("Error submitting form:", error)
      alert("Errore nella sottomissione del modulo")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-8 max-w-2xl">
      {/* Progress Indicator */}
      <div className="flex justify-between mb-8">
        {["info", "photos", "signature", "review"].map((s, i) => (
          <div key={s} className={`flex items-center ${i < 3 ? "flex-1" : ""}`}>
            <button
              onClick={() => setStep(s)}
              className={`w-10 h-10 rounded-full font-bold transition ${
                step === s
                  ? "bg-indigo-600 text-white"
                  : ["info", "photos", "signature", "review"].indexOf(s) <
                      ["info", "photos", "signature", "review"].indexOf(step)
                    ? "bg-green-500 text-white"
                    : "bg-gray-300 text-gray-600"
              }`}
            >
              {i + 1}
            </button>
            {i < 3 && <div className="flex-1 h-1 bg-gray-300 mx-2"></div>}
          </div>
        ))}
      </div>

      {/* Step: Info */}
      {step === "info" && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">Informazioni Sopralluogo</h2>

          <input
            type="date"
            value={formData.scheduled_at}
            onChange={(e) => handleInputChange("scheduled_at", e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <input
            type="text"
            placeholder="Nome Condòmino"
            value={formData.condominio_name}
            onChange={(e) => handleInputChange("condominio_name", e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <input
            type="email"
            placeholder="Email Condòmino"
            value={formData.condominio_email}
            onChange={(e) => handleInputChange("condominio_email", e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <button
            onClick={() => setStep("photos")}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition"
          >
            Continua → Foto
          </button>
        </div>
      )}

      {/* Step: Photos */}
      {step === "photos" && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">Carica Foto</h2>
          <PhotoUpload onPhotosUpdate={handlePhotosUpdate} />

          <div className="flex gap-4">
            <button
              onClick={() => setStep("info")}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-900 font-bold py-3 rounded-lg transition"
            >
              ← Indietro
            </button>
            <button
              onClick={() => setStep("signature")}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition"
            >
              Continua → Firma
            </button>
          </div>
        </div>
      )}

      {/* Step: Signature */}
      {step === "signature" && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">Firma Digitale</h2>
          <SignatureCanvas ref={signatureRef} onCapture={handleSignatureCapture} />

          <div className="flex gap-4">
            <button
              onClick={() => setStep("photos")}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-900 font-bold py-3 rounded-lg transition"
            >
              ← Indietro
            </button>
            <button
              onClick={() => setStep("review")}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition"
            >
              Continua → Riepilogo
            </button>
          </div>
        </div>
      )}

      {/* Step: Review */}
      {step === "review" && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">Riepilogo</h2>

          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <p>
              <strong>Data:</strong> {formData.scheduled_at}
            </p>
            <p>
              <strong>Condòmino:</strong> {formData.condominio_name}
            </p>
            <p>
              <strong>Email:</strong> {formData.condominio_email}
            </p>
            <p>
              <strong>Foto caricate:</strong> {formData.photos.length}
            </p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setStep("signature")}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-900 font-bold py-3 rounded-lg transition"
            >
              ← Indietro
            </button>
            <button
              onClick={() => handleSignatureCapture(signatureRef.current?.toDataURL())}
              disabled={loading}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition disabled:opacity-50"
            >
              {loading ? "Invio..." : "Invia Sopralluogo"}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
