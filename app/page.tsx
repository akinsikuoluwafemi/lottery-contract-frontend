"use client"

import Header from "@/components/Header"
import LotteryEntrance from "@/components/LotteryEntrance"
import ManualHeader from "@/components/ManualHeader"
import Image from "next/image"
import styles from "./page.module.css"

export default function Home() {
    return (
        <main style={{ padding: "10px" }}>
            {/* <ManualHeader /> */}
            <Header />
            <LotteryEntrance />
        </main>
    )
}
