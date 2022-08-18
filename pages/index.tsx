import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Box } from 'grommet'
import type { NextPage } from 'next'

import Toolbar from '../components/Toolbar';
import Feed from '../components/Feed';

const Home: NextPage = () => {
  return (
    <Box align='center' pad="large">
      <ConnectButton />
      <Toolbar />
      <Feed />
    </Box>
  )
}

export default Home
