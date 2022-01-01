import { ApolloClient, ApolloLink, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { createUploadLink } from "apollo-upload-client";
import axios from "axios";
import { toast } from "react-toastify";
import { token } from "../stores/auth";

const uploadLink = createUploadLink({
    uri: process.env.NEXT_PUBLIC_GRAPHQL_URL
        || "http://localhost:4000/graphql",
});

const authLink = setContext((_, { headers }) => {
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
                toast.error(
                    "Terdeteksi kesalahan autentikasi di akun anda mohon login ulang"
                );
            }
        });
    if (networkError) console.log(`[Network error]: ${networkError}`);
});


export const client = new ApolloClient({
    link: authLink.concat(errorLink).concat(uploadLink as unknown as ApolloLink),
    cache: new InMemoryCache(),
});


   
export const httpClient = axios.create({
     headers: {
            authorization: token ? token : "",
        },
})


import io from "socket.io-client"

export const socketIo = io("http://localhost:4000", {
  query: {token}
})

