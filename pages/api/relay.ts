import type { NextApiRequest, NextApiResponse } from 'next'
import { verify } from '../../bytes32'

interface RelayResponse {
    cid?: string,
    current_aggregate?: string,
    signer: string
}

interface ErrorResponse {
    error: unknown
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<RelayResponse | ErrorResponse>
) {
    if (req.method === "GET") {
        const r = await fetch(`${process.env.RELAYER_URI}/signer`)
        if (r.status !== 200) {
            res.status(500).json({ error: new Error("failed to get relay signer") })
            return
        }
        const { signer } = await r.json()
        res.status(200).json({ signer })
        return
    }
    const { content, meta, ref } = req.body
    try {
        const signed = verify({ content, meta, ref }, req.body.signature)

        const r = await fetch(`${process.env.RELAYER_URI}/publish`, {
            method: "POST",
            "headers": { "Content-Type": "application/json" },
            body: JSON.stringify(req.body)
        })
        res.status(200).json(await r.json())
    } catch (e: unknown) {
        console.log(e)
        res.status(403).json({ error: e })
    }
}
