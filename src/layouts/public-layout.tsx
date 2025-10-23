import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Outlet } from "react-router-dom";

export const PublicLayout = () => {
  return (
    <div className="w-full bg-background">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};