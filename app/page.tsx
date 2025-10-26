"use client"

import { useState, useEffect } from "react"
import { WalletConnect } from "@/components/wallet-connect"
import { BatchForm } from "@/components/batch-form"
import { BatchTable } from "@/components/batch-table"
import type { BatchData } from "@/lib/types"
import { Toaster } from "@/components/ui/toaster"
import { getBatchId, getBatchStatus, getStateLabel } from "@/lib/blockchain"

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
    setBatches((prev) => {
      const updated = [newBatch, ...prev]
      localStorage.setItem("batches", JSON.stringify(updated))
      return updated
    })
  }

  const handleRefreshStates = async () => {
    const updatedBatches = await Promise.all(
      batches.map(async (batch) => {
        try {
          const batchId = getBatchId(batch.id)
          const status = await getBatchStatus(batchId)

          if (status && status.exists) {
            return {
              ...batch,
              estado: getStateLabel(status.state),
            }
          }
          return batch
        } catch (error) {
          console.error(`Error fetching status for batch ${batch.id}:`, error)
          return batch
        }
      }),
    )

    setBatches(updatedBatches)
    localStorage.setItem("batches", JSON.stringify(updatedBatches))
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
          <BatchTable batches={batches} onRefresh={handleRefreshStates} />
        </div>
      </main>

      <Toaster />
    </div>
  )
}
