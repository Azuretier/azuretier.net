import React from "react"

//componentとfuncの違い: componentはuiを, funcは動作を提供
const Center = ({children}: {children: React.ReactNode}) => {

    // items-center = vertical
    // justify-center = horizontal
    return (
        <div className={"p-10 rounded-xl bg-white font-semibold text-2xl text-orange-400"}>{children}</div>
    )
}

export default Center