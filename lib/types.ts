export interface BatchData {
  id: string
  contenido: string
  cantidad: number
  fechaFabricacion: string
  fechaVencimiento: string
  estado: "Pendiente" | "Enviado" | "Recibido"
  qrUrl?: string
  txHash?: string
  timestamp?: number
  emitter?: string
}

export interface BatchMetadata {
  contenido: string
  cantidad: number
  fechaFabricacion: string
  fechaVencimiento: string
}
