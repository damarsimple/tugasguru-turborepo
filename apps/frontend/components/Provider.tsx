import { createTheme, ThemeProvider as BaseThemeProvider } from '@mui/material/styles';

import {
    ApolloClient,
    InMemoryCache,
    ApolloProvider,
    ApolloLink,
    gql,
} from "@apollo/client";
``
import create from "zustand";
import { onError } from "@apollo/client/link/error";
import moment from "moment-timezone";
import { createUploadLink } from "apollo-upload-client";
import { setContext } from "@apollo/client/link/context";
import { toast as toastObj, ToastContainer } from "react-toastify";
import { useEffect, useState } from "react";
import { useUserStore } from '../stores/user';
import { useAuthStore } from '../stores/auth';
import { Model } from 'ts-types';
import { WithChildren } from '../types';
import NextNProgress from 'nextjs-progressbar';

moment.tz.setDefault("Asia/Jakarta");


const uploadLink = createUploadLink({
    uri: process.env.NEXT_PUBLIC_GRAPHQL_URL
        || "http://localhost:4000/graphql",
});

const authLink = setContext((_, { headers }) => {
    // get the authentication token from local storage if it exists
    const { token } = useAuthStore();
    // return the headers to the context so httpLink can read them

    return {
        headers: {
            ...headers,
            authorization: token ? token : "",
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


const theme = createTheme({

});

export default function AppProvider({ children }: WithChildren) {

    const { user, setUser } = useUserStore();
    const { token } = useAuthStore();
    const [ready, setReady] = useState(false);
    useEffect(() => {

        if (token) {
            client.query<{ me: Model["User"] }>({
                query: gql`
                    query GetUserInfo {
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
                            roles
                        }
                    }`
            }).then(({ data: { me } }) => {
                setUser(me)
                setReady(true);
            }).catch(() => { setUser(null); setReady(true); })
        } else {
            setReady(true)
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token])

    return (
        <ApolloProvider client={client}>
            <BaseThemeProvider theme={theme}>
                <NextNProgress />
                {ready && children}
            </BaseThemeProvider>
            <ToastContainer position="bottom-right" />
        </ApolloProvider>
    )
}



