import React from "react"
import { useMoralis } from "react-moralis"
import { useEffect } from "react"

const ManualHeader = () => {
    const {
        authenticate,
        isAuthenticated,
        user,
        enableWeb3,
        account,
        isWeb3Enabled,
        Moralis,
        deactivateWeb3,
        isWeb3EnableLoading,
    } = useMoralis()

    useEffect(() => {
        if (isWeb3Enabled) return

        typeof window !== "undefined" && window.localStorage.getItem("connected")
            ? enableWeb3()
            : null
    }, [isWeb3Enabled])

    useEffect(() => {
        Moralis.onAccountChanged((account) => {
            console.log(`Account changed to ${account}`)
            if (!account) {
                window.localStorage.removeItem("connected")
                deactivateWeb3()
                console.log("Null account found")
            }
        })
    }, [])

    return (
        <div>
            {account ? (
                <p>
                    Connected to {account.slice(0, 6)}...{account.slice(account.length - 4)}
                </p>
            ) : (
                <button
                    disabled={isWeb3EnableLoading}
                    style={{ padding: "5px 10px" }}
                    onClick={async () => {
                        await enableWeb3()

                        typeof window !== "undefined" &&
                            window.localStorage.setItem("connected", "injected")
                    }}
                >
                    Connect
                </button>
            )}
        </div>
    )
}

export default ManualHeader
