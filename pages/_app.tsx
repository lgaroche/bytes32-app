import '../styles/globals.css'
import type { AppProps } from 'next/app'

import {
  getDefaultWallets,
  RainbowKitProvider,
  darkTheme
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

const { chains, provider } = configureChains(
  [chain.goerli, chain.localhost],
  [
    publicProvider()
  ]
);

const { connectors } = getDefaultWallets({
  appName: 'Bytes32',
  chains
});

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
