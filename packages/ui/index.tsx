import { createTheme, ThemeProvider as BaseThemeProvider } from '@mui/material/styles';
import { WithChildren } from "./types";

import {
    ApolloClient,
    InMemoryCache,
    ApolloProvider,
    ApolloLink,
    gql,
} from "@apollo/client";

import create from "zustand";
import { onError } from "@apollo/client/link/error";
import moment from "moment-timezone";
import { createUploadLink } from "apollo-upload-client";
import { setContext } from "@apollo/client/link/context";
import { useAuthStore } from "./stores/auth";
import { toast as toastObj, ToastContainer } from "react-toastify";
import { useNProgress } from "@tanem/react-nprogress";
import { useUserStore } from "./stores/user";
import { useEffect, useState } from "react";
import { Model } from "ts-types";

moment.tz.setDefault("Asia/Jakarta");


const uploadLink = createUploadLink({
    uri: process.env.NEXT_PUBLIC_GRAPHQL_URL
        || "http://localhost:4000/graphql",
});

const authLink = setContext((_, { headers }) => {
    // get the authentication token from local storage if it exists
    const { token } = useAuthStore.getState();
    // return the headers to the context so httpLink can read them

    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : "",
        },
    };
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors)
        graphQLErrors.forEach(({ message }) => {
            if (message == "Unauthenticated.") {
                window.alert(
                    "Terdeteksi kesalahan autentikasi di akun anda mohon login ulang"
                );
                toastObj.error(
                    "Terdeteksi kesalahan autentikasi di akun anda mohon login ulang"
                );
            }
        });
    if (networkError) console.log(`[Network error]: ${networkError}`);
});


const client = new ApolloClient({
    link: authLink.concat(errorLink).concat(uploadLink as unknown as ApolloLink),
    cache: new InMemoryCache(),
});


export const useProgressStore = create<{
    isAnimating: boolean;
    setIsAnimating: (by: boolean) => void;
}>((set) => ({
    isAnimating: false,
    setIsAnimating: (isAnimating: boolean) => set(() => ({ isAnimating })),
}));

export const Bar = ({
    animationDuration,
    progress,
}: {
    animationDuration: number;
    progress: number;
}) => (
    <div
        className="bg-indigo-600 h-1 w-full left-0 top-0 fixed z-50"
        style={{
            marginLeft: `${(-1 + progress) * 100}%`,
            transition: `margin-left ${animationDuration}ms linear`,
        }}
    ></div>
);


export const Progress = ({ isAnimating }: { isAnimating: boolean }) => {
    const { animationDuration, isFinished, progress } = useNProgress({
        isAnimating,
    });

    return (
        <Container animationDuration={animationDuration} isFinished={isFinished}>
            <Bar animationDuration={animationDuration} progress={progress} />
        </Container>
    );
};


export const Container = ({
    animationDuration,
    children,
    isFinished,
}: {
    animationDuration: number;
    isFinished: boolean;
    children: JSX.Element;
}) => (
    <div
        className="pointer-events-none"
        style={{
            opacity: isFinished ? 0 : 1,
            transition: `opacity ${animationDuration}ms linear`,
        }}
    >
        {children}
    </div>
);


const theme = createTheme({

});

export function AppProvider({ children }: WithChildren) {

    const { user, setUser } = useUserStore();
    const [ready, setReady] = useState(false);
    useEffect(() => {

        client.query<{ me: Model["User"] }>({
            query: gql`
       query Query {
  me {
    id
    email
    name
    username
    balance
    phone
    address
    coverId
    updatedAt
    createdAt
  }
}`
        }).then(({ data: { me } }) => {
            setUser(me)
            setReady(true);
        }).catch(() => { setUser(null); setReady(true); })

    }, [])

    return (
        <ApolloProvider client={client}>
            <BaseThemeProvider theme={theme}>
                test
                {/* {ready && children} */}
            </BaseThemeProvider>
            <ToastContainer position="bottom-right" />
        </ApolloProvider>
    )
}
