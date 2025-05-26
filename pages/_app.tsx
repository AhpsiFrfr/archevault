import type { AppProps } from 'next/app'
import { UserProvider } from '@/context/UserContext'
import { WalletContextProvider } from '@/components/WalletProvider'
import '@/styles/globals.css'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WalletContextProvider>
      <UserProvider>
        <Component {...pageProps} />
      </UserProvider>
    </WalletContextProvider>
  )
} 