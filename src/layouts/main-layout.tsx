import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Outlet } from "react-router-dom";
import { Container } from "@/components/container";

export const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />

      {/* This main section will grow to fill the space between the header and footer */}
      <main className="flex-1 py-8">
        <Container>
          <Outlet />
        </Container>
      </main>

      <Footer />
    </div>
  );
};