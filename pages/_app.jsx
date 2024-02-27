import '../styles/globals.css'
import { GlobalContextProvider } from '../app/Context/UserContext';
import { Provider, } from "react-redux";
import { store } from "../redux/store";
import Layout from './layout';

function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <GlobalContextProvider>
        <Layout Component={Component} pageProps={pageProps} />
      </GlobalContextProvider>
    </Provider>
  )
}

export default MyApp;