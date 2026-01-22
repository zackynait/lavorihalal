"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"

export default function PhotoUpload({ onPhotosUpdate }) {
  const [photos, setPhotos] = useState([])
  const [uploading, setUploading] = useState(false)

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files || [])
    setUploading(true)

    try {
      const supabase = createClient()
      const uploadedPhotos = []

      for (const file of files) {
        const filename = `${Date.now()}-${file.name}`
        const { data, error } = await supabase.storage.from("sopralluogo-photos").upload(filename, file)

        if (!error && data) {
          const { data: urlData } = supabase.storage.from("sopralluogo-photos").getPublicUrl(filename)

          uploadedPhotos.push({
            id: filename,
            url: urlData.publicUrl,
            name: file.name,
          })
        }
      }

      const newPhotos = [...photos, ...uploadedPhotos]
      setPhotos(newPhotos)
      onPhotosUpdate(newPhotos)
    } catch (error) {
      console.error("Error uploading photos:", error)
      alert("Errore nell'upload delle foto")
    } finally {
      setUploading(false)
    }
  }

  const removePhoto = (id) => {
    const newPhotos = photos.filter((p) => p.id !== id)
    setPhotos(newPhotos)
    onPhotosUpdate(newPhotos)
  }

  return (
    <div className="space-y-4">
      <label className="block">
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          disabled={uploading}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-lg file:border-0
            file:text-sm file:font-semibold
            file:bg-indigo-600 file:text-white
            hover:file:bg-indigo-700"
        />
      </label>

      {uploading && <p className="text-sm text-blue-600">Caricamento in corso...</p>}

      {photos.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {photos.map((photo) => (
            <div key={photo.id} className="relative group">
              <img
                src={photo.url || "/placeholder.svg"}
                alt={photo.name}
                className="w-full h-32 object-cover rounded-lg"
              />
              <button
                onClick={() => removePhoto(photo.id)}
                className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-6 h-6 opacity-0 group-hover:opacity-100 transition flex items-center justify-center"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <p className="text-sm text-gray-500">{photos.length} foto caricate</p>
    </div>
  )
}
