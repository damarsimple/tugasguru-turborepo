import gql from "graphql-tag";
import { CoreUserInfoMinimalField } from "../fragments/fragments";
import { client } from "../pages/_app";
import { useUserStore } from "../store/user";

export const getMyCredentials = async () => {
  const { setState } = useUserStore;
  const { data } = await client.query({
    query: gql`
      ${CoreUserInfoMinimalField}
      query Me {
        me {
          ...CoreUserInfoMinimalField
        }
      }
    `,
  });

  const user = data.me;

  setState({ user });
};
