import '../styles/globals.css'
import type { AppProps } from 'next/app'

import {
  RainbowKitProvider,
  darkTheme,
  connectorsForWallets,
  wallet
} from '@rainbow-me/rainbowkit';
import {
  chain,
  configureChains,
  createClient,
  WagmiConfig,
} from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';

import '@rainbow-me/rainbowkit/styles.css';
import { Grommet } from 'grommet';
import { magic } from '../components/MagicConnector';


const { chains, provider } = configureChains(
  [chain.goerli, chain.localhost],
  [
    publicProvider()
  ]
);

const connectors = connectorsForWallets([
  {
    groupName: "Apps & extensions",
    wallets: [
      wallet.rainbow({ chains }),
      wallet.metaMask({ chains })
    ]
  },
  {
    groupName: "Mail or Google",
    wallets: [
      magic({ chains })
    ]
  }
])

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider
})

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains} theme={darkTheme()}>
        <Grommet plain>
          <Component {...pageProps} />
        </Grommet>
      </RainbowKitProvider>
    </WagmiConfig>
  )
}

export default MyApp
