import AppProvider from "../components/Provider";
import 'react-toastify/dist/ReactToastify.css';
import { useEffect } from "react";
import { socketIo } from "../common/client";

export default function App({ Component, pageProps }) {

    useEffect(() => {
        console.log('emit-meeting-join');

        socketIo.emit("meeting-join", { meetingId: 1 }).emit("setupRequestHandler").emit("join")

        socketIo.emit("createWebRtcTransport", {
            forceTcp: true,
            producing: true,
            consuming: true
        })

        socketIo.on("createWebRtcTransport", () => {

        })

        socketIo.onAny(console.log)
    }, [])

    return (
        <AppProvider>
            <Component {...pageProps} />
        </AppProvider>
    );
}
