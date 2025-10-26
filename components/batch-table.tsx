"use client"

import { useState } from "react"
import type { BatchData } from "@/lib/types"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ExternalLink, QrCode, Package, Download, RefreshCw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface BatchTableProps {
  batches: BatchData[]
  onRefresh: () => Promise<void>
}

export function BatchTable({ batches, onRefresh }: BatchTableProps) {
  const [selectedBatch, setSelectedBatch] = useState<BatchData | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const { toast } = useToast()

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case "Enviado":
        return "default"
      case "Recibido":
        return "secondary"
      case "Pendiente":
        return "outline"
      default:
        return "outline"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES")
  }

  const downloadQR = (batch: BatchData) => {
    if (!batch.qrUrl) return

    const link = document.createElement("a")
    link.href = batch.qrUrl
    link.download = `QR_${batch.id}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      await onRefresh()
      toast({
        title: "Estados actualizados",
        description: "Los estados de los lotes se han sincronizado con la blockchain",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error al actualizar",
        description: "No se pudieron actualizar los estados desde la blockchain",
      })
    } finally {
      setIsRefreshing(false)
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              <CardTitle>Historial de Envíos</CardTitle>
            </div>
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing || batches.length === 0}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
              Actualizar Estados
            </Button>
          </div>
          <CardDescription>Lista de todos los lotes registrados y su estado actual</CardDescription>
        </CardHeader>
        <CardContent>
          {batches.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No hay lotes registrados aún</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID Lote</TableHead>
                    <TableHead>Contenido</TableHead>
                    <TableHead>Cantidad</TableHead>
                    <TableHead>Fabricación</TableHead>
                    <TableHead>Vencimiento</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {batches.map((batch, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-mono text-sm">{batch.id}</TableCell>
                      <TableCell>{batch.contenido}</TableCell>
                      <TableCell>{batch.cantidad}</TableCell>
                      <TableCell>{formatDate(batch.fechaFabricacion)}</TableCell>
                      <TableCell>{formatDate(batch.fechaVencimiento)}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(batch.estado)}>{batch.estado}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {batch.qrUrl && (
                            <Button variant="outline" size="sm" onClick={() => setSelectedBatch(batch)}>
                              <QrCode className="h-4 w-4" />
                            </Button>
                          )}
                          {batch.txHash && (
                            <Button variant="outline" size="sm" asChild>
                              <a
                                href={`https://sepolia.scrollscan.com/tx/${batch.txHash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!selectedBatch} onOpenChange={() => setSelectedBatch(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Código QR - {selectedBatch?.id}</DialogTitle>
            <DialogDescription>Escanea este código para verificar el lote</DialogDescription>
          </DialogHeader>
          {selectedBatch?.qrUrl && (
            <div className="flex flex-col items-center gap-4 py-4">
              <img
                src={selectedBatch.qrUrl || "/placeholder.svg"}
                alt={`QR Code for ${selectedBatch.id}`}
                className="w-64 h-64 border rounded-lg"
              />
              <div className="text-sm text-muted-foreground text-center">
                <p>
                  <strong>Contenido:</strong> {selectedBatch.contenido}
                </p>
                <p>
                  <strong>Cantidad:</strong> {selectedBatch.cantidad}
                </p>
                <p>
                  <strong>Estado:</strong> {selectedBatch.estado}
                </p>
              </div>
              <Button variant="outline" onClick={() => downloadQR(selectedBatch)}>
                <Download className="h-4 w-4 mr-2" />
                Descargar QR
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
