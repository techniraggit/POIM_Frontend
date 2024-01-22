import '../styles/globals.css'
import { GlobalContextProvider } from '../app/Context/UserContext';

function MyApp({ Component, pageProps }) {
  return (
    <GlobalContextProvider>
      <Component {...pageProps} />
    </GlobalContextProvider>
  )
}

export default MyApp;