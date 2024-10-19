import React from 'react'
import { useState } from 'react'

const OrgButton = () => {
    const [value, setState] = useState(0)

    const Plus = () =>{
        setState(value + 1)
    }

    return (
        <button className="square" onClick={Plus}>{value}</button>
    )
}

export default OrgButton