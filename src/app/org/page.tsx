import Center from "@/components/org/c"
import {FadeUpDiv, FadeUpStagger} from "@/components/animation"

export default function gatiiku() {
    return (
        <main className="flex items-center justify-center h-screen">
            <FadeUpStagger>
                <FadeUpDiv>
                    <Center>Hello how are you doing bro</Center>
                </FadeUpDiv>
            </FadeUpStagger> 
        </main>
    )
}