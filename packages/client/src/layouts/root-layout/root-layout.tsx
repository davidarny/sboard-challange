import { GlobalSpinner } from "@/components/global-spinner";
import { Toaster } from "@/components/ui/sonner";
import { Outlet, useNavigation } from "react-router";

export function RootLayout() {
  const navigation = useNavigation();
  const isNavigating = Boolean(navigation.location);

  return (
    <div className="flex min-h-screen w-screen flex-col">
      {isNavigating && <GlobalSpinner />}
      <Outlet />
      <Toaster />
    </div>
  );
}
