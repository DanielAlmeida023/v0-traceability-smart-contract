"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { useWallet } from "@/hooks/use-wallet"
import { getBatchId, registerBatchWithWallet } from "@/lib/blockchain"
import { generateQRCode } from "@/lib/qr-generator"
import type { BatchData } from "@/lib/types"
import { Loader2, Package } from "lucide-react"
import { ethers } from "ethers"

interface BatchFormProps {
  onBatchCreated: (batch: BatchData) => void
}

export function BatchForm({ onBatchCreated }: BatchFormProps) {
  const { toast } = useToast()
  const { isConnected, account } = useWallet()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [formData, setFormData] = useState({
    id: "",
    contenido: "",
    cantidad: "",
    fechaFabricacion: "",
    fechaVencimiento: "",
  })

  useEffect(() => {
    if (formData.id || formData.fechaFabricacion || formData.fechaVencimiento) {
      validateFormRealTime()
    }
  }, [formData])

  const validateFormRealTime = () => {
    const newErrors: Record<string, string> = {}

    if (formData.id) {
      const idPattern = /^ID_\d+$/
      if (!idPattern.test(formData.id)) {
        newErrors.id = "El ID debe tener el formato ID_NUMERO (ej: ID_123)"
      }
    }

    if (formData.fechaFabricacion) {
      const fabricationDate = new Date(formData.fechaFabricacion)
      const today = new Date()
      const fiveYearsAgo = new Date()
      fiveYearsAgo.setFullYear(today.getFullYear() - 5)

      if (fabricationDate < fiveYearsAgo) {
        newErrors.fechaFabricacion = "La fecha de fabricación no puede tener más de 5 años de antigüedad"
      }

      if (fabricationDate > today) {
        newErrors.fechaFabricacion = "La fecha de fabricación no puede ser futura"
      }
    }

    if (formData.fechaVencimiento) {
      const expirationDate = new Date(formData.fechaVencimiento)
      const today = new Date()
      const fiveYearsFromNow = new Date()
      fiveYearsFromNow.setFullYear(today.getFullYear() + 5)

      if (expirationDate > fiveYearsFromNow) {
        newErrors.fechaVencimiento = "La fecha de vencimiento no puede ser mayor a 5 años desde hoy"
      }

      if (expirationDate < today) {
        newErrors.fechaVencimiento = "La fecha de vencimiento no puede ser anterior a hoy"
      }
    }

    if (formData.fechaFabricacion && formData.fechaVencimiento) {
      const fabricationDate = new Date(formData.fechaFabricacion)
      const expirationDate = new Date(formData.fechaVencimiento)

      if (expirationDate <= fabricationDate) {
        newErrors.fechaVencimiento = "La fecha de vencimiento debe ser posterior a la fecha de fabricación"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateForm = (): boolean => {
    return validateFormRealTime()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isConnected) {
      toast({
        title: "Error",
        description: "Debes conectar tu wallet primero",
        variant: "destructive",
      })
      return
    }

    if (!validateForm()) {
      toast({
        title: "Error de validación",
        description: "Por favor corrige los errores en el formulario",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      if (typeof window === "undefined" || !window.ethereum) {
        throw new Error("MetaMask no está disponible. Por favor instala MetaMask.")
      }

      const batchId = getBatchId(formData.id)

      const metadata = JSON.stringify({
        contenido: formData.contenido,
        cantidad: Number.parseInt(formData.cantidad),
        fechaFabricacion: formData.fechaFabricacion,
        fechaVencimiento: formData.fechaVencimiento,
      })

      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()

      const txHash = await registerBatchWithWallet(batchId, metadata, signer)

      const newBatch: BatchData = {
        ...formData,
        cantidad: Number.parseInt(formData.cantidad),
        estado: "Enviado",
        txHash: txHash,
        timestamp: Date.now(),
        emitter: account || undefined,
      }

      try {
        const qrData = JSON.stringify({
          batchId: formData.id,
          contenido: formData.contenido,
          cantidad: formData.cantidad,
          fechaFabricacion: formData.fechaFabricacion,
          fechaVencimiento: formData.fechaVencimiento,
          txHash: txHash,
          verifyUrl: `https://sepolia.scrollscan.com/tx/${txHash}`,
        })

        const qrUrl = await generateQRCode(qrData)
        newBatch.qrUrl = qrUrl
      } catch (qrError) {
        console.error("Error generating QR:", qrError)
        // Continue without QR
      }

      onBatchCreated(newBatch)

      toast({
        title: "✅ Registro Exitoso",
        description: newBatch.qrUrl
          ? "Lote registrado en blockchain y QR generado correctamente"
          : "Lote registrado en blockchain (QR no disponible)",
      })

      setFormData({
        id: "",
        contenido: "",
        cantidad: "",
        fechaFabricacion: "",
        fechaVencimiento: "",
      })
      setErrors({})
    } catch (error: any) {
      console.error("Error during submission:", error)

      toast({
        title: "❌ Error en la Transacción",
        description: error.message || "No se pudo completar el registro del lote",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFieldChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value })
  }

  const isFormValid = () => {
    const allFieldsFilled =
      formData.id && formData.contenido && formData.cantidad && formData.fechaFabricacion && formData.fechaVencimiento

    const noErrors = Object.keys(errors).length === 0

    return allFieldsFilled && noErrors
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Registrar Nuevo Lote
        </CardTitle>
        <CardDescription>
          Completa la información del lote para generar el QR y registrarlo en blockchain
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="id">ID del Lote *</Label>
              <Input
                id="id"
                placeholder="ID_123"
                value={formData.id}
                onChange={(e) => handleFieldChange("id", e.target.value)}
                required
                className={errors.id ? "border-destructive" : ""}
              />
              {errors.id && <p className="text-sm text-destructive">{errors.id}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="contenido">Contenido *</Label>
              <Input
                id="contenido"
                placeholder="Producto X"
                value={formData.contenido}
                onChange={(e) => handleFieldChange("contenido", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cantidad">Cantidad *</Label>
              <Input
                id="cantidad"
                type="number"
                placeholder="100"
                value={formData.cantidad}
                onChange={(e) => handleFieldChange("cantidad", e.target.value)}
                required
                min="1"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fechaFabricacion">Fecha de Fabricación *</Label>
              <Input
                id="fechaFabricacion"
                type="date"
                value={formData.fechaFabricacion}
                onChange={(e) => handleFieldChange("fechaFabricacion", e.target.value)}
                required
                className={errors.fechaFabricacion ? "border-destructive" : ""}
              />
              {errors.fechaFabricacion && <p className="text-sm text-destructive">{errors.fechaFabricacion}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="fechaVencimiento">Fecha de Vencimiento *</Label>
              <Input
                id="fechaVencimiento"
                type="date"
                value={formData.fechaVencimiento}
                onChange={(e) => handleFieldChange("fechaVencimiento", e.target.value)}
                required
                className={errors.fechaVencimiento ? "border-destructive" : ""}
              />
              {errors.fechaVencimiento && <p className="text-sm text-destructive">{errors.fechaVencimiento}</p>}
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting || !isConnected || !isFormValid()}>
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Procesando...
              </>
            ) : (
              "Firmar y Registrar Envío"
            )}
          </Button>

          {!isConnected && (
            <p className="text-sm text-muted-foreground text-center">Conecta tu wallet para registrar lotes</p>
          )}
        </form>
      </CardContent>
    </Card>
  )
}
