import '../styles/globals.css'

import { WagmiConfig, createClient, defaultChains, configureChains } from 'wagmi'

import { alchemyProvider } from 'wagmi/providers/alchemy'
import { publicProvider } from 'wagmi/providers/public'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { InjectedConnector } from 'wagmi/connectors/injected'

const alchemyId = process.env.ALCHEMY_ID;

function MyApp({ Component, pageProps }) {
  // Configure chains & providers with the Alchemy provider.
  // Two popular providers are Alchemy (alchemy.com) and Infura (infura.io)
  const { chains, provider, webSocketProvider } = configureChains(defaultChains, [
    alchemyProvider({ alchemyId }),
    publicProvider(),
  ])

  const client = createClient({
    autoConnect: true,
    connectors: [
      new MetaMaskConnector({ chains }),
      new InjectedConnector({ chains, options: {name: "Injected"} }),
    ],
    provider,
    webSocketProvider,
  })

  
  return (
    <WagmiConfig client={client}>
      <Component {...pageProps} />
    </WagmiConfig>
  )

}

export default MyApp
