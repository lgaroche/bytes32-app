import { ContainerTargetContext } from 'grommet'
import type { NextApiRequest, NextApiResponse } from 'next'
import { verify } from '../../bytes32'

interface RelayResponse {
    cid: string
}

interface ErrorResponse {
    error: unknown
}

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<RelayResponse | ErrorResponse>
) {
    const { content, meta, ref } = req.body
    try {
        const signed = verify({ content, meta, ref }, req.body.signature)

        fetch("http://localhost:8000/publish", {
            method: "POST",
            "headers": { "Content-Type": "application/json" },
            body: JSON.stringify(req.body)
        })
            .then(r => r.json())
            .then(r => res.status(200).json(r))
    } catch (e: unknown) {
        console.log(e)
        res.status(403).json({ error: e })
    }

}
