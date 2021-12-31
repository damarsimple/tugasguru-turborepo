import { useEffect } from "react";
import { useRouter } from "next/router";
import { useUserStore } from "../stores/user";

export default function Account(): JSX.Element {
  const { push } = useRouter()
  const { user } = useUserStore()

  useEffect(() => {

    if (!user) {
      push("/login")
    }

  }, [user, push])

  return <>


  </>
}
