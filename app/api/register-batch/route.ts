import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { batchId, metadata } = body

    if (!batchId || !metadata) {
      return NextResponse.json({ error: "Missing batchId or metadata" }, { status: 400 })
    }

    // Validar formato del batchId
    const batchIdRegex = /^ID_\d+$/
    if (!batchIdRegex.test(batchId)) {
      return NextResponse.json({ error: "Invalid batch ID format. Use ID_NUMBER" }, { status: 400 })
    }

    // Solo validamos los datos aquí
    // La transacción se firma desde el frontend con la wallet del usuario
    return NextResponse.json({
      success: true,
      message: "Data validated successfully",
    })
  } catch (error: any) {
    console.error("Error validating batch:", error)
    return NextResponse.json({ error: "Failed to validate batch data", details: error.message }, { status: 500 })
  }
}
