import Head from 'next/head'
import { MoralisProvider } from 'react-moralis'
import Header from '../components/Header'
import '../styles/globals.css'
import {NotificationProvider} from "web3uikit"
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client"


const client = new ApolloClient({
  cache: new InMemoryCache(),
  uri: process.env.NEXT_PUBLIC_SUBGRAPH_URL,
})

function MyApp({ Component, pageProps }) {
  return (
    <div>
      <Head>    
          <title>Collateral Lever</title>
          <meta name="description" content="Collateral Lever" />
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
