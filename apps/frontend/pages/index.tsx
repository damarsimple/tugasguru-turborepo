import { useUserStore } from "ui/stores/user";
import { useEffect } from "react";
import { useRouter } from "next/router";
import Navbar from "../components/Navbar";

export default function Account(): JSX.Element {
  const { push } = useRouter()
  const { user } = useUserStore()

  useEffect(() => {

    if (!user) {
      push("/login")
    }

  }, [user, push])

  return <>

    <Navbar />

  </>
}
