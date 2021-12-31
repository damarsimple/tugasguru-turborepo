import { AppProvider } from "../components/Provider";

export default function Docs({ Component, pageProps }) {

    return (
        <AppProvider>
            <Component {...pageProps} />
        </AppProvider>
    );
}
