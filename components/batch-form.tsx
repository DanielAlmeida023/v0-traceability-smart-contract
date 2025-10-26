"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { useWallet } from "@/hooks/use-wallet"
import { getBatchId, registerBatchWithWallet } from "@/lib/blockchain"
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

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    const idPattern = /^ID_\d+$/
    if (!idPattern.test(formData.id)) {
      newErrors.id = "El ID debe tener el formato ID_NUMERO (ej: ID_123)"
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

      toast({
        title: "Firma requerida",
        description: "Por favor firma la transacción en MetaMask",
      })

      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()

      const txHash = await registerBatchWithWallet(batchId, metadata, signer)

      toast({
        title: "✅ Lote Registrado",
        description: `Transacción confirmada: ${txHash.slice(0, 10)}...`,
      })

      const qrResponse = await fetch("/api/generate-qr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          batchId,
          data: { ...formData, txHash },
        }),
      })

      if (!qrResponse.ok) {
        const errorText = await qrResponse.text()
        throw new Error(`Error al generar QR: ${errorText}`)
      }

      const qrData = await qrResponse.json()

      toast({
        title: "✅ QR Generado",
        description: "Código QR creado exitosamente",
      })

      const newBatch: BatchData = {
        ...formData,
        cantidad: Number.parseInt(formData.cantidad),
        estado: "Enviado",
        qrUrl: qrData.qrUrl,
        txHash: txHash,
        timestamp: Date.now(),
        emitter: account || undefined,
      }

      onBatchCreated(newBatch)

      setFormData({
        id: "",
        contenido: "",
        cantidad: "",
        fechaFabricacion: "",
        fechaVencimiento: "",
      })
    } catch (error: any) {
      console.error("[v0] Error during submission:", error)
      toast({
        title: "❌ Error",
        description: error.message || "Error al procesar el lote",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFieldChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value })
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" })
    }
  }

  const isFormValid = () => {
    return (
      formData.id &&
      formData.contenido &&
      formData.cantidad &&
      formData.fechaFabricacion &&
      formData.fechaVencimiento &&
      Object.keys(errors).length === 0
    )
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
