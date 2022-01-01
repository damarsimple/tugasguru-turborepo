import { createTheme, ThemeProvider as BaseThemeProvider } from '@mui/material/styles';

import {
    ApolloProvider,
    gql,
} from "@apollo/client";
``
import create from "zustand";
import moment from "moment-timezone";
import { ToastContainer } from "react-toastify";
import { useEffect, useState } from "react";
import { useUserStore } from '../stores/user';
import { useAuthStore } from '../stores/auth';
import { Model } from 'ts-types';
import { WithChildren } from '../types';
import NextNProgress from 'nextjs-progressbar';
import { client } from '../common/client';

moment.tz.setDefault("Asia/Jakarta");


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



