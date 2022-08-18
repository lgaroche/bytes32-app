import React, { BaseSyntheticEvent, useCallback, useState } from "react";
import { Box, Button, Page, TextArea } from "grommet";
import { Close, Send } from "grommet-icons";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useAccount, useSigner, useSignMessage } from "wagmi";
import { SignableEntry } from "../bytes32";

const Write: NextPage = () => {

    const router = useRouter()
    const [text, setText] = useState<string>("")

    const { address, isConnected } = useAccount()
    const { data: signer } = useSigner()
    const { data, error, isLoading, signMessage } = useSignMessage({
        onSuccess(data, variables) {
            console.log(variables)
            console.log(data)
        },
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
        const partial = new SignableEntry(text)
        const signed = await partial.sign(signer)
        const r = await fetch("/api/relay", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(signed)
        })
        const response = await r.json()
        console.log(response.cid)
        router.push("/")
    }, [text, address, isConnected])

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
        </Page>
    )
}

export default Write