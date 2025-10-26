import { type NextRequest, NextResponse } from "next/server"
import { ethers } from "ethers"
import { TRACEABILITY_ABI, CONTRACT_ADDRESS, SCROLL_SEPOLIA_RPC } from "@/lib/contract-abi"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { batchId, metadata, signerAddress } = body

    if (!batchId || !metadata) {
      return NextResponse.json({ error: "Missing batchId or metadata" }, { status: 400 })
    }

    // Verificar que tenemos la private key del backend (para relayer)
    const privateKey = process.env.BACKEND_PRIVATE_KEY

    if (!privateKey) {
      return NextResponse.json({ error: "Backend wallet not configured" }, { status: 500 })
    }

    // Conectar al contrato con el wallet del backend
    const provider = new ethers.JsonRpcProvider(SCROLL_SEPOLIA_RPC)
    const wallet = new ethers.Wallet(privateKey, provider)
    const contract = new ethers.Contract(CONTRACT_ADDRESS, TRACEABILITY_ABI, wallet)

    // Registrar el envío en el contrato
    const metadataString = JSON.stringify(metadata)
    const tx = await contract.registrarEnviado(batchId, metadataString)

    // Esperar confirmación
    const receipt = await tx.wait()

    return NextResponse.json({
      success: true,
      txHash: receipt.hash,
      blockNumber: receipt.blockNumber,
    })
  } catch (error: any) {
    console.error("Error registering batch:", error)

    let errorMessage = "Failed to register batch on blockchain"

    if (error.message?.includes("NotEmitter")) {
      errorMessage = "Backend wallet does not have EMITTER_ROLE"
    } else if (error.message?.includes("AlreadySent")) {
      errorMessage = "Batch already sent"
    }

    return NextResponse.json({ error: errorMessage, details: error.message }, { status: 500 })
  }
}
