"use client"

import React from "react"
import { MoralisProvider } from "react-moralis"
import { NotificationProvider } from "web3uikit"

const Provider = ({ children }: { children: React.ReactNode }) => {
    return (
        <MoralisProvider
            initializeOnMount={false}
            appId="62e8618d-c13a-4078-bdf4-1e7efee21cc6"
            serverUrl=""
        >
            <NotificationProvider>{children}</NotificationProvider>
        </MoralisProvider>
    )
}

export default Provider
