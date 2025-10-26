import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { batchId, data } = body

    if (!batchId || !data) {
      return NextResponse.json({ error: "Missing batchId or data" }, { status: 400 })
    }

    // Crear el contenido del QR con los datos del lote
    const qrContent = JSON.stringify({
      batchId,
      ...data,
      verifyUrl: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/verify/${batchId}`,
    })

    // Usar QR Server API (alternativa gratuita a QR.io)
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrContent)}`

    return NextResponse.json({
      success: true,
      qrUrl,
      qrContent,
    })
  } catch (error) {
    console.error("Error generating QR:", error)
    return NextResponse.json({ error: "Failed to generate QR code" }, { status: 500 })
  }
}
