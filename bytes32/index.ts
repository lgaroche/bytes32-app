import { verifyTypedData } from 'ethers/lib/utils'
import { CID } from 'multiformats'

const domain = {
    name: "Bytes32",
    version: "1"
}
const types = {
    EIP712Domain: [
        { name: "name", type: "string" },
        { name: "version", type: "string" }
    ],
    Link: [
        { name: "/", type: "string" }
    ],
    Content: [
        { name: "type", type: "string" },
        { name: "text", type: "string" },
        { name: "data", type: "Link" }
    ],
    Entry: [
        { name: "content", type: "Content" },
        { name: "meta", type: "Link" },
        { name: "ref", type: "Link" },
    ]
}

const emptyLink = { "/": "" }

class IPLDLink {
    "/": string

    constructor(link: CID | string) {
        this["/"] = link.toString()
    }
}

interface EntryContent {
    type: string
    text: string
    data: IPLDLink
}

interface PartialEntry {
    content: EntryContent
    meta: IPLDLink
    ref: IPLDLink
}

interface Bytes32Signature {
    format: string,
    sig: string
    schema?: IPLDLink,
}

class SignableEntry implements PartialEntry {
    content: EntryContent
    meta: IPLDLink
    ref: IPLDLink

    constructor(text: string, ref?: CID | string, meta?: CID | string) {
        this.content = {
            type: "text/plain",
            data: emptyLink,
            text
        }
        this.meta = emptyLink
        this.ref = ref ? new IPLDLink(ref) : emptyLink
    }

    public toTypedData() {
        return { domain, types, value: this }
    }

    // TODO: better typing when ethers has a stable signTypedData API
    public async sign(signer: any): Promise<SignedEntry> {
        const from = await signer.getAddress()
        const typedData = {
            domain,
            types,
            primaryType: "Entry",
            message: this
        }
        let sig: string
        try {
            sig = await signer.provider.send("eth_signTypedData_v4", [from, typedData])
        } catch (e: any) {
            console.error(e)
            sig = await signer.provider.send("eth_signTypedData_v4", [from, JSON.stringify(typedData)])
        }
        const signature = {
            format: "eip712-bytes32-v1",
            schema: new IPLDLink("bafyreidsag4nrh3jf6qt634gnxu25eryxoonbamlggjes7a7pmkghu2gqa/"),
            sig
        }
        return {
            ...this,
            signature,
            signer: from,
        }

    }
}

interface SignedEntry extends PartialEntry {
    signature: Bytes32Signature
    signer: string
}

function verify(entry: PartialEntry, signature: Bytes32Signature): SignedEntry {
    // TODO: reject malleable signatures: 
    // https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/utils/cryptography/ECDSA.sol#L140
    return {
        ...entry,
        signature,
        signer: verifyTypedData(domain, types, entry, signature.sig)
    }
}

export { SignableEntry, verify }