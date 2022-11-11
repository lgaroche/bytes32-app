import type { NextApiRequest, NextApiResponse } from "next"

export type SolrEntry = {
  id: string
  signer: string
  "signature.sig": string
  "content.type": string
  "content.text": string
  "block.time": Date
  "block.number": number
  _version_: number
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<SolrEntry>
) {
  fetch(
    `${process.env.SOLR_URI}/select?q=*%3A*&rows=10&sort=block.time%20desc&start=0`
  )
    .then((r) => r.json())
    .then((r) => {
      res.status(200).json(r["response"]["docs"])
    })
    .catch((e) => {
      res.status(500).json(e)
    })
}
