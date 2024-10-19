import React from 'react'
import { useState } from 'react'

const OrgButton = () => {
    const [value, setState] = useState(0)

    const Plus = () =>{
        setState(value + 1)
    }

    return (
        <div className="flex justify-center items-center">
            <button className="p-6  bg-white rounded-xl shadow-lg" onClick={Plus}>{value}</button>
        </div>
    )
}

export default OrgButton