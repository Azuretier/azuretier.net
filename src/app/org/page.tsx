"use client"

//import Center from "@/components/org/c"
//import {FadeUpDiv, FadeUpStagger} from "@/components/animation"
import {useEffect} from 'react'
import {animate} from 'framer-motion/dom'

const fadeUpElement = document.getElementById("fadeUpElement")

const Gatiiku = () => {

    useEffect(() => {
        // ページが読み込まれた時に isLoaded を true に設定
        if (fadeUpElement !== null) {
            animate(fadeUpElement, { y: [10, 0], opacity: [0, 1] }, { type: "spring" })
        }
    }, []); // 空の依存配列で初回レンダリング時にのみ実行

    return (
        <main className="flex items-center justify-center h-screen">    
            <div id="fadeUpElement">gatiiku</div>
        </main>
    )
}

export default Gatiiku