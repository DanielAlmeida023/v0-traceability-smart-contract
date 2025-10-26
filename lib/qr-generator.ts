import QRCode from "qrcode"

export async function generateQRCode(data: string): Promise<string> {
  try {
    console.log("[v0] QR Generator: Starting generation...")
    console.log("[v0] QR Generator: Data length:", data.length)

    // Generate QR code as data URL
    const qrDataUrl = await QRCode.toDataURL(data, {
      width: 300,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
    })

    console.log("[v0] QR Generator: Generated successfully")
    console.log("[v0] QR Generator: Data URL length:", qrDataUrl.length)
    console.log("[v0] QR Generator: Data URL preview:", qrDataUrl.substring(0, 50) + "...")

    return qrDataUrl
  } catch (error) {
    console.error("[v0] QR Generator: Error occurred:", error)
    console.error("[v0] QR Generator: Error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    })
    throw new Error("Failed to generate QR code")
  }
}
