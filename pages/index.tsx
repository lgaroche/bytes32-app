import { ConnectButton } from "@rainbow-me/rainbowkit"
import { Box } from "grommet"
import type { NextPage } from "next"

import Feed from "../components/Feed"

const Home: NextPage = () => {
  return (
    <Box align="center" pad="large">
      <ConnectButton />
      <Feed />
    </Box>
  )
}

export default Home
