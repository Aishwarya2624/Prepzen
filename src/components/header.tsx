import { useAuth } from "@/contexts/AuthContext";
import { NavigationRoutes } from "./navigation-routes";
import { ProfileContainer } from "./profile-container";
import { ToggleContainer } from "./toggle-container";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { LogIn, UserPlus } from "lucide-react";

export const Header = () => {
  const { user, loading } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <NavigationRoutes />
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <ToggleContainer />
          {!loading && (
            <div className="flex items-center gap-2">
              {user ? (
                <ProfileContainer />
              ) : (
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/sign-in" className="flex items-center gap-2">
                      <LogIn className="h-4 w-4" />
                      Sign In
                    </Link>
                  </Button>
                  <Button variant="default" size="sm" asChild>
                    <Link to="/sign-up" className="flex items-center gap-2">
                      <UserPlus className="h-4 w-4" />
                      Sign Up
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};