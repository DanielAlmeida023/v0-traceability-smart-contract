"use client"

import { useState, useEffect } from "react"
import { ethers } from "ethers"
import { SCROLL_SEPOLIA_CHAIN_ID } from "@/lib/contract-abi"

declare global {
  interface Window {
    ethereum?: any
  }
}

export function useWallet() {
  const [account, setAccount] = useState<string | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    checkConnection()

    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged)
      window.ethereum.on("chainChanged", () => window.location.reload())
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged)
      }
    }
  }, [])

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      setAccount(null)
    } else {
      setAccount(accounts[0])
    }
  }

  const checkConnection = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum)
        const accounts = await provider.listAccounts()
        if (accounts.length > 0) {
          setAccount(accounts[0].address)
        }
      } catch (err) {
        console.error("Error checking connection:", err)
      }
    }
  }

  const connect = async () => {
    if (typeof window.ethereum === "undefined") {
      setError("MetaMask no está instalado")
      return
    }

    setIsConnecting(true)
    setError(null)

    try {
      const provider = new ethers.BrowserProvider(window.ethereum)

      // Solicitar cuentas
      const accounts = await provider.send("eth_requestAccounts", [])
      setAccount(accounts[0])

      // Verificar/cambiar a Scroll Sepolia
      const network = await provider.getNetwork()
      if (Number(network.chainId) !== SCROLL_SEPOLIA_CHAIN_ID) {
        try {
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: `0x${SCROLL_SEPOLIA_CHAIN_ID.toString(16)}` }],
          })
        } catch (switchError: any) {
          // Si la red no está agregada, agregarla
          if (switchError.code === 4902) {
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: `0x${SCROLL_SEPOLIA_CHAIN_ID.toString(16)}`,
                  chainName: "Scroll Sepolia",
                  nativeCurrency: {
                    name: "ETH",
                    symbol: "ETH",
                    decimals: 18,
                  },
                  rpcUrls: ["https://sepolia-rpc.scroll.io"],
                  blockExplorerUrls: ["https://sepolia.scrollscan.com"],
                },
              ],
            })
          } else {
            throw switchError
          }
        }
      }
    } catch (err: any) {
      setError(err.message || "Error al conectar con MetaMask")
      console.error("Error connecting wallet:", err)
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnect = () => {
    setAccount(null)
  }

  return {
    account,
    isConnecting,
    error,
    connect,
    disconnect,
    isConnected: !!account,
  }
}
