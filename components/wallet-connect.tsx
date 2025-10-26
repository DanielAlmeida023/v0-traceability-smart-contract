"use client"

import { Button } from "@/components/ui/button"
import { useWallet } from "@/hooks/use-wallet"
import { Wallet, LogOut } from "lucide-react"

export function WalletConnect() {
  const { account, isConnecting, error, connect, disconnect, isConnected } = useWallet()

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  return (
    <div className="flex items-center gap-2">
      {error && <p className="text-sm text-destructive">{error}</p>}

      {isConnected ? (
        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 bg-secondary rounded-md text-sm font-mono">{formatAddress(account!)}</div>
          <Button variant="outline" size="sm" onClick={disconnect}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <Button onClick={connect} disabled={isConnecting}>
          <Wallet className="h-4 w-4 mr-2" />
          {isConnecting ? "Conectando..." : "Conectar MetaMask"}
        </Button>
      )}
    </div>
  )
}
