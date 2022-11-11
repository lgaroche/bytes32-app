import type { NextApiRequest, NextApiResponse } from "next"

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<void>
) {
  const { signer, delegate, signature } = req.body
  fetch(`${process.env.RELAYER_URI}/delegate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ signer, delegate, signature }),
  })
    .then((r) => {
      if (r.status !== 200) {
        res.status(500).json()
      } else {
        res.status(200).json()
      }
    })
    .catch((e) => {
      res.status(500).json()
    })
}
