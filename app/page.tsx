"use client"

import { useState, useEffect } from "react"
import { WalletConnect } from "@/components/wallet-connect"
import { BatchForm } from "@/components/batch-form"
import { BatchTable } from "@/components/batch-table"
import type { BatchData } from "@/lib/types"
import { Toaster } from "@/components/ui/toaster"

export default function Home() {
  const [batches, setBatches] = useState<BatchData[]>([])

  // Cargar batches del localStorage al iniciar
  useEffect(() => {
    const savedBatches = localStorage.getItem("batches")
    if (savedBatches) {
      setBatches(JSON.parse(savedBatches))
    }
  }, [])

  // Guardar batches en localStorage cuando cambien
  useEffect(() => {
    if (batches.length > 0) {
      localStorage.setItem("batches", JSON.stringify(batches))
    }
  }, [batches])

  const handleBatchCreated = (newBatch: BatchData) => {
    setBatches((prev) => [newBatch, ...prev])
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Sistema de Trazabilidad</h1>
            <p className="text-sm text-muted-foreground">Emisor - Scroll Sepolia</p>
          </div>
          <WalletConnect />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <BatchForm onBatchCreated={handleBatchCreated} />
          <BatchTable batches={batches} />
        </div>
      </main>

      <Toaster />
    </div>
  )
}
