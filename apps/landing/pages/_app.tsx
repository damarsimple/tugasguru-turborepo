import { AppProvider } from "ui";

export default function Docs({ Component, pageProps }) {

    return (
        <AppProvider >
            <Component {...pageProps} />
        </AppProvider>
    );
}
