import React, { useEffect, useState } from "react"
import {
    useWeb3Contract,
    useMoralis,
    useMoralisSubscription,
    useMoralisQuery,
} from "react-moralis"
import { abi, contractAddresses } from "../constants"
import { ethers } from "ethers"
import { useNotification } from "web3uikit"
import { text } from "node:stream/consumers"
import { AiOutlineBell } from "react-icons/ai"

const LotteryEntrance = () => {
    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis()
    const chainId = parseInt(chainIdHex!).toString()
    const raffleAddress =
        // @ts-ignore
        chainId! in contractAddresses ? contractAddresses[chainId][0] : null
    const [entranceFee, setEntranceFee] = useState("0") as any
    const [numPlayers, setNumPlayers] = useState("0") as any
    const [recentWinner, setRecentWinner] = useState("0") as any

    const dispatch = useNotification()

    const {
        runContractFunction: enterRaffle,
        isLoading,
        isFetching,
    } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress!,
        functionName: "enterRaffle",
        params: {},
        msgValue: entranceFee,
    })

    // const { data, error, isLoading } = useMoralisQuery("RaffleEnter")

    // console.log("data", data)

    // useMoralisSubscription("RaffleEnter", (q) => q, [], {
    //     onEnter: (data) => console.log("data", data),
    // })

    const { runContractFunction: getEntranceFee } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getEntranceFee",
    })

    const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getNumberOfPlayers",
    })

    const { runContractFunction: getRecentWinner } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getRecentWinner",
    })

    async function updateUi() {
        const entranceFeeFromCall = await getEntranceFee({
            onError: (error) => console.log(error),
        })
        const numPlayersFromCall = await getNumberOfPlayers({
            onError: (error) => console.log(error),
        })
        const recentWinnerFromCall = await getRecentWinner({
            onError: (error) => console.log(error),
        })
        console.log(recentWinner)
        entranceFeeFromCall && setEntranceFee(entranceFeeFromCall)
        numPlayersFromCall && setNumPlayers(numPlayersFromCall)
        recentWinnerFromCall && setRecentWinner(recentWinnerFromCall)
    }

    useEffect(() => {
        updateUi()
    }, [isWeb3Enabled])

    console.log("numPlayers", numPlayers.toString())

    const handleSuccess = async (tx: any) => {
        await tx.wait(1)
        handleNewNotification(tx)
        updateUi()
    }

    const handleNewNotification = (tx: any) => {
        dispatch({
            type: "info",
            message: "Transaction Complete!",
            title: "Tx Notification",
            position: "topR",
            icon: <AiOutlineBell />,
        })
    }

    return (
        <div className="p-5">
            <div>
                Hi from lottery entrance!
                {raffleAddress ? (
                    <div>
                        <button
                            disabled={isLoading || isFetching}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
                            onClick={async () => {
                                await enterRaffle({
                                    onSuccess: handleSuccess,
                                    onError: (error) => console.log(error),
                                })
                            }}
                        >
                            {isLoading || isFetching ? (
                                <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
                            ) : (
                                "Enter Raffle"
                            )}
                        </button>
                        <p>Entrance Fee: {ethers.formatEther(entranceFee.toString())} ETH</p>
                        <p>Players: {numPlayers.toString()}</p>
                        <p>Recent Winner: {recentWinner}</p>
                    </div>
                ) : (
                    <p>No Raffle Address Detected</p>
                )}
            </div>
        </div>
    )
}

//{ethers.formatEther(entranceFee.toString())

export default LotteryEntrance
