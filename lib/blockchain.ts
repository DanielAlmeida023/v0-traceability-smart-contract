import { ethers } from "ethers"
import { TRACEABILITY_ABI, CONTRACT_ADDRESS, SCROLL_SEPOLIA_RPC } from "./contract-abi"

export function getBatchId(loteId: string): string {
  return ethers.id(loteId)
}

export function getProvider() {
  return new ethers.JsonRpcProvider(SCROLL_SEPOLIA_RPC)
}

export function getContract(signerOrProvider: ethers.Signer | ethers.Provider) {
  return new ethers.Contract(CONTRACT_ADDRESS, TRACEABILITY_ABI, signerOrProvider)
}

export async function getBatchStatus(batchId: string) {
  const provider = getProvider()
  const contract = getContract(provider)

  try {
    const result = await contract.estadoBatch(batchId)
    return {
      state: Number(result[0]), // 0: CREADO, 1: ENVIADO, 2: RECIBIDO
      emitter: result[1],
      receiver: result[2],
      sentTimestamp: Number(result[3]),
      recvTimestamp: Number(result[4]),
      metadata: result[5],
      exists: result[6],
    }
  } catch (error) {
    console.error("Error getting batch status:", error)
    return null
  }
}

export function getStateLabel(state: number): "Pendiente" | "Enviado" | "Recibido" {
  switch (state) {
    case 0:
      return "Pendiente"
    case 1:
      return "Enviado"
    case 2:
      return "Recibido"
    default:
      return "Pendiente"
  }
}

export async function registerBatchWithWallet(
  batchId: string,
  metadata: string,
  signer: ethers.Signer,
): Promise<string> {
  const contract = getContract(signer)

  try {
    const tx = await contract.registrarEnviado(batchId, metadata)
    await tx.wait()
    return tx.hash
  } catch (error: any) {
    console.error("Error registering batch:", error)

    // Parse common contract errors
    if (error.message.includes("AccessControlUnauthorizedAccount")) {
      throw new Error("Tu wallet no tiene el rol EMITTER_ROLE necesario")
    }
    if (error.message.includes("BatchYaEnviado")) {
      throw new Error("Este lote ya fue enviado anteriormente")
    }
    if (error.message.includes("user rejected")) {
      throw new Error("Transacción rechazada por el usuario")
    }

    throw new Error(error.message || "Error al registrar en blockchain")
  }
}
