import AppProvider from "../components/Provider";
import 'react-toastify/dist/ReactToastify.css';

export default function App({ Component, pageProps }) {

    return (
        <AppProvider>
            <Component {...pageProps} />
        </AppProvider>
    );
}
