import React, { BaseSyntheticEvent, useCallback, useRef, useState } from "react";
import { Box, Button, Page, TextArea, Text, Layer, Spinner } from "grommet";
import { Close, Send } from "grommet-icons";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useAccount, useContractReads, useSigner } from "wagmi";
import { SignableEntry } from "../bytes32";
import { abi } from "../bytes32/abi";
import { Result } from "ethers/lib/utils";
import { CID } from "multiformats";
import { ethers } from "ethers";
import * as hasher from 'multiformats/hashes/hasher'

const Write: NextPage = () => {

    const router = useRouter()
    const [text, setText] = useState<string>("")
    const [progress, setProgress] = useState<number>(0)
    const [relayerSigner, setRelayerSigner] = useState<string>("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266")
    const closeProgress = useCallback(() => {
        setProgress(0)
    }, [setProgress])

    const { address, isConnected } = useAccount()
    const { data: signer } = useSigner()
    const bytes32ContractReadHeads = {
        addressOrName: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
        contractInterface: abi,
        functionName: 'heads',
    }
    const heads = useRef<Result[]>()
    const [currentAggregate, setCurrentAggregate] = useState<string>("")
    const { data: headReads } = useContractReads({
        contracts: [
            {
                ...bytes32ContractReadHeads,
                args: [relayerSigner]
            },
            {
                ...bytes32ContractReadHeads,
                args: [address]
            }
        ],
        onSuccess: async data => {
            if (data && data !== heads.current) {
                const array = ethers.utils.arrayify(data[0])
                const sha256 = hasher.from({
                    name: "sha2-256",
                    code: 0x12,
                    encode: ethers.utils.arrayify
                })
                const digest = await sha256.digest(array)
                const newAggrCid = CID.create(1, 0x71, digest).toString()
                if (currentAggregate != newAggrCid && progress === 3) {
                    setProgress(0)
                    router.push("/")
                }
            }
            heads.current = data
        },
        watch: true
    })
    const handleClose = useCallback(() => {
        router.back()
    }, [router])

    const handleTextChange = useCallback((e: BaseSyntheticEvent) => {
        setText(e.target.value)
    }, [])

    const handleSend = useCallback(async () => {
        if (text === "" || !isConnected) {
            return
        }
        if (!signer) {
            console.log("no signer")
            return
        }
        if (!heads.current) {
            console.log("no heads read yet")
            return
        }

        // check if delegate is set
        console.log(headReads)
        const relayResponse = await fetch("/api/relay")
        if (relayResponse.status !== 200) {
            console.log("relayer error")
            return
        }
        const { signer: relaySigner } = await relayResponse.json()
        console.log(`relay signer: ${relaySigner}`)
        setRelayerSigner(relaySigner)

        console.log(heads.current[1])
        if (heads.current[1] !== relaySigner) {
            console.log("delegate not set")
            /* for now, consider 0x00 as relayed
            const signature = await signer.signMessage(ethers.utils.arrayify(relaySigner))
            const r = await fetch("/api/delegate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    signer: address,
                    delegate: relaySigner,
                    signature
                })
            })
            
            if (r.status !== 200) {
                console.log(`got ${r.status}`)
                return
            }*/
        }

        setProgress(1) // wait for signature
        const partial = new SignableEntry(text)
        const signed = await partial.sign(signer)

        setProgress(2) // publishing
        const r = await fetch("/api/relay", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(signed)
        })
        const response = await r.json()

        setProgress(3) // wait for commit
        console.log(response)
        setRelayerSigner(response.signer)
        setCurrentAggregate(response.current_aggregate)

    }, [text, isConnected, headReads, signer])

    return (
        <Page>
            <Box width="medium" align="center" fill="horizontal">
                <Box direction="row" pad="medium">
                    <Button icon={<Send />} onClick={handleSend} />
                    <Button icon={<Close />} onClick={handleClose} />
                </Box>
                <Box height="medium">
                    <TextArea
                        placeholder="Write something"
                        size="large"
                        fill={true}
                        onChange={handleTextChange}
                    />
                </Box>
            </Box>
            {progress > 0 &&
                <Layer
                    onEsc={closeProgress}
                    onClickOutside={closeProgress}
                    position="center"
                    modal={true}
                    plain={true}
                >
                    <Box pad="medium" gap="small" width="medium" background="dark-1" align="center">
                        <Spinner />
                        {progress > 0 &&
                            <Text>Waiting for signature...</Text>
                        }
                        {progress > 1 &&
                            <Text>Publishing...</Text>
                        }
                        {progress > 2 &&
                            <Text>Waiting for commit...</Text>
                        }
                    </Box>
                </Layer>
            }
        </Page>
    )
}

export default Write