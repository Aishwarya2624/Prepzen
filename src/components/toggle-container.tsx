import { useAuth } from "@/contexts/AuthContext";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { NavigationRoutes } from "./navigation-routes";
import { ProfileContainer } from "./profile-container";

export const ToggleContainer = () => {
  const { user } = useAuth();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="mr-2 px-0 text-base hover:bg-transparent hover:text-foreground focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pr-0">
        <NavigationRoutes className="flex flex-col gap-4" />
        {user && <ProfileContainer />}
      </SheetContent>
    </Sheet>
  );
};