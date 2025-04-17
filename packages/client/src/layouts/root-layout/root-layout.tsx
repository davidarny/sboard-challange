import { GlobalSpinner } from "@/components/global-spinner";
import { AuthProvider } from "@/hooks/use-auth";
import { Outlet, useNavigation } from "react-router";

export function RootLayout() {
  const navigation = useNavigation();
  const isNavigating = Boolean(navigation.location);

  return (
    <AuthProvider>
      <div className="flex min-h-screen w-screen flex-col">
        {isNavigating && <GlobalSpinner />}
        <Outlet />
      </div>
    </AuthProvider>
  );
}
