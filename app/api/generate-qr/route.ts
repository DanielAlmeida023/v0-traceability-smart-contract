import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] QR generation API called")

    const body = await request.json()
    console.log("[v0] Request body:", body)

    const { batchId, data } = body

    if (!batchId || !data) {
      console.log("[v0] Missing batchId or data")
      return NextResponse.json({ error: "Missing batchId or data" }, { status: 400 })
    }

    // Crear el contenido del QR con los datos del lote
    const qrContent = JSON.stringify({
      batchId,
      ...data,
      verifyUrl: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/verify/${batchId}`,
    })

    console.log("[v0] QR content:", qrContent)

    // Usar QR Server API (alternativa gratuita a QR.io)
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrContent)}`

    console.log("[v0] QR URL generated:", qrUrl)

    return NextResponse.json({
      success: true,
      qrUrl,
      qrContent,
    })
  } catch (error) {
    console.error("[v0] Error generating QR:", error)
    return NextResponse.json({ error: "Failed to generate QR code" }, { status: 500 })
  }
}
