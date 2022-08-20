import { Box, Button } from "grommet";
import { Article, Refresh } from "grommet-icons";
import { useRouter } from "next/router";
import React, { BaseSyntheticEvent, useCallback } from "react";

interface ToolbarProps {
    refresh: () => void
}

const Toolbar = ({ refresh }: ToolbarProps) => {

    const router = useRouter()

    const onWriteClick = useCallback((e: BaseSyntheticEvent) => {
        e.preventDefault()
        router.push("/write")
    }, [router])

    const onRefreshClick = useCallback((e: BaseSyntheticEvent) => {
        e.preventDefault()
        refresh()
    }, [])

    return (
        <Box direction="row" pad="medium">
            <Button
                label="Write"
                icon={<Article />}
                onClick={onWriteClick}
            />
            <Button
                icon={<Refresh />}
                onClick={onRefreshClick}
            />
        </Box>
    )
}

export default Toolbar