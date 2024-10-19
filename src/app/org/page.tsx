import Center from "@/components/org/c"
import {FadeUpDiv, FadeUpStagger} from "@/components/animation"

export default function gatiiku() {
    return (
        <main className="flex items-center justify-center h-screen">
            <FadeUpStagger>
                <div></div>
                <div>
                    <FadeUpDiv>
                        <Center>Hello how are yo&apos; doing bro</Center>
                    </FadeUpDiv>
                </div>
            </FadeUpStagger>
        </main>
    )
}