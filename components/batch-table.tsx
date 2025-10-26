"use client"

import { useState } from "react"
import type { BatchData } from "@/lib/types"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ExternalLink, QrCode, Package } from "lucide-react"

interface BatchTableProps {
  batches: BatchData[]
}

export function BatchTable({ batches }: BatchTableProps) {
  const [selectedBatch, setSelectedBatch] = useState<BatchData | null>(null)

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case "Enviado":
        return "default"
      case "Recibido":
        return "secondary"
      default:
        return "outline"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES")
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Historial de Envíos
          </CardTitle>
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
              <Button variant="outline" onClick={() => window.open(selectedBatch.qrUrl, "_blank")}>
                Descargar QR
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
