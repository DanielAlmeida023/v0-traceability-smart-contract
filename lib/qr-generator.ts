import QRCode from "qrcode"

export async function generateQRCode(data: string): Promise<string> {
  try {
    // Generate QR code as data URL
    const qrDataUrl = await QRCode.toDataURL(data, {
      width: 300,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
    })

    return qrDataUrl
  } catch (error) {
    console.error("[v0] Error generating QR code:", error)
    throw new Error("Failed to generate QR code")
  }
}
