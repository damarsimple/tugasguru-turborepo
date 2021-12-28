import { AppProvider, Button } from "ui";
import { useAuthStore } from "ui/stores/auth";
import { useUserStore } from "ui/stores/user";

export default function Docs() {
  const { user } = useUserStore();
  return (
    <AppProvider>
      <Button>Hello {user.name}</Button>
    </AppProvider>
  );
}
