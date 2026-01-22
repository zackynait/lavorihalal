"use client"

import { useRef, useEffect, forwardRef } from "react"

const SignatureCanvas = forwardRef(({ onCapture }, ref) => {
  const canvasRef = useRef(null)
  const isDrawing = useRef(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Set canvas size
    canvas.width = canvas.offsetWidth
    canvas.height = 300

    const ctx = canvas.getContext("2d")
    if (ctx) {
      ctx.fillStyle = "white"
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.strokeStyle = "#000"
      ctx.lineWidth = 2
    }

    // Forward ref
    Object.assign(ref || {}, {
      toDataURL: () => canvas.toDataURL(),
    })
  }, [ref])

  const startDrawing = (e) => {
    isDrawing.current = true
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    ctx.beginPath()
    ctx.moveTo(x, y)
  }

  const draw = (e) => {
    if (!isDrawing.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    ctx.lineTo(x, y)
    ctx.stroke()
  }

  const stopDrawing = () => {
    isDrawing.current = false
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    ctx.fillStyle = "white"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600">Firma nel riquadro sottostante</p>
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        className="w-full border-2 border-gray-300 rounded-lg cursor-crosshair bg-white"
      />
      <button
        onClick={clearCanvas}
        className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-900 font-semibold rounded-lg transition"
      >
        Cancella Firma
      </button>
    </div>
  )
})

SignatureCanvas.displayName = "SignatureCanvas"

export default SignatureCanvas
