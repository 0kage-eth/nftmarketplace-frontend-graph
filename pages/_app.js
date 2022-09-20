import Head from "next/head"
import { Header } from "../components/Header"
import { NotificationProvider } from "web3uikit"
import { MoralisProvider } from "react-moralis"
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client"

const client = new ApolloClient({
  cache: new InMemoryCache(),
  uri: "https://api.studio.thegraph.com/query/34697/nft-market/v0.0.5",
})
function MyApp({ Component, pageProps }) {
  return (
    <div>
      <Head>
        <title>NFT MarketPlace</title>
        <meta
          name="description"
          content="A marketplace to buy/sell and list NFTs"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <MoralisProvider initializeOnMount={false}>
        <ApolloProvider client={client}>
          <NotificationProvider>
            <Header />
            <Component {...pageProps} />
          </NotificationProvider>
        </ApolloProvider>
      </MoralisProvider>
    </div>
  )
}

export default MyApp
