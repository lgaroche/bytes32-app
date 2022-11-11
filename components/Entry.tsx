import React from "react"
import { Anchor, Box, Card, CardBody, CardHeader, Text } from "grommet"
import { DateTime } from "luxon"

interface EntryProps {
  content: String
  author: String
  date: Date
}

const Entry = ({ content, author, date }: EntryProps) => {
  const blockTime = DateTime.fromJSDate(date)

  return (
    <Card background="dark-1" width="medium" margin="small">
      <CardHeader pad="small" fill="horizontal">
        <Box
          direction="row"
          justify="between"
          fill="horizontal"
          overflow="hidden"
        >
          <Anchor
            weight="bold"
            style={{ textOverflow: "ellipsis", overflow: "hidden" }}
            size="small"
          >
            {author}
          </Anchor>
          <Text
            weight="lighter"
            style={{ whiteSpace: "nowrap", paddingLeft: "20px" }}
            size="small"
          >
            {blockTime.toRelative()}
          </Text>
        </Box>
      </CardHeader>
      <CardBody pad="small">{content}</CardBody>
    </Card>
  )
}

export default Entry
