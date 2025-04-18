import { StarsBackground } from "@/components/animate-ui/stars-background";
import { Header } from "@/components/header";
import { Outlet } from "react-router-dom";

export function UserLayout() {
  return (
    <div className="grid h-full grid-rows-[auto_1fr] isolate overflow-hidden">
      <StarsBackground factor={0.1} speed={200} className="absolute inset-0 z-0" />
      <Header className="z-10" />
      <main className="h-full z-10 overflow-auto">
        <div className="container mx-auto h-full py-4 px-4">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
