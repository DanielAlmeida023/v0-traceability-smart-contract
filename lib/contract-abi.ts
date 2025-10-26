// ABI del contrato TraceabilityV1
export const TRACEABILITY_ABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "admin",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "AlreadyReceived",
    type: "error",
  },
  {
    inputs: [],
    name: "AlreadySent",
    type: "error",
  },
  {
    inputs: [],
    name: "BatchNotExist",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidSignature",
    type: "error",
  },
  {
    inputs: [],
    name: "NotEmitter",
    type: "error",
  },
  {
    inputs: [],
    name: "NotReceiver",
    type: "error",
  },
  {
    inputs: [],
    name: "NotSent",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "batchId",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "emitter",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "string",
        name: "metadata",
        type: "string",
      },
    ],
    name: "Enviado",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "batchId",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "receiver",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
    name: "Recibido",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "batchId",
        type: "bytes32",
      },
    ],
    name: "estadoBatch",
    outputs: [
      {
        internalType: "enum TraceabilityV1.State",
        name: "state",
        type: "uint8",
      },
      {
        internalType: "address",
        name: "emitter",
        type: "address",
      },
      {
        internalType: "address",
        name: "receiver",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "sentTimestamp",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "recvTimestamp",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "metadata",
        type: "string",
      },
      {
        internalType: "bool",
        name: "exists",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "batchId",
        type: "bytes32",
      },
      {
        internalType: "string",
        name: "metadata",
        type: "string",
      },
    ],
    name: "registrarEnviado",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "batchId",
        type: "bytes32",
      },
      {
        internalType: "string",
        name: "metadata",
        type: "string",
      },
      {
        internalType: "address",
        name: "signer",
        type: "address",
      },
      {
        internalType: "bytes",
        name: "signature",
        type: "bytes",
      },
    ],
    name: "registrarEnviadoConFirma",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "batchId",
        type: "bytes32",
      },
    ],
    name: "registrarRecibido",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const

export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || ""
export const SCROLL_SEPOLIA_RPC = "https://sepolia-rpc.scroll.io"
export const SCROLL_SEPOLIA_CHAIN_ID = 534351
