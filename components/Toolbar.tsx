import { Box, Button } from "grommet";
import { Article } from "grommet-icons";
import { useRouter } from "next/router";
import React, { BaseSyntheticEvent, useCallback } from "react";

interface ToolbarProps {
}

const Toolbar = () => {

    const router = useRouter()

    const onWriteClick = useCallback((e: BaseSyntheticEvent) => {
        e.preventDefault()
        router.push("/write")
    }, [router])


    return (
        <Box direction="row" pad="medium">
            <Button
                label="Write"
                icon={<Article />}
                onClick={onWriteClick}
            />
        </Box>
    )
}

export default Toolbar