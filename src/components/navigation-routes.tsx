import { MainRoutes } from "@/lib/helpers";
import { cn } from "@/lib/utils";
import { NavLink } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";


interface NavigationRoutesProps {
  isMobile?: boolean;
  className?: string;
}

export const NavigationRoutes = ({
  isMobile = false,
  className,
}: NavigationRoutesProps) => {
  const { user, signOut } = useAuth();
  return (
    <ul
      className={cn(
        "flex items-center gap-6",
        isMobile && "items-start flex-col gap-8",
        className
      )}
    >
      {MainRoutes.map((route) => (
        <NavLink
          key={route.href}
          to={route.href}
          className={({ isActive }) =>
            cn(
              "text-base text-muted-foreground transition-colors hover:text-foreground flex items-center gap-2",
              isActive && "text-foreground font-semibold"
            )
          }
        >
          {route.label === "Home" && (
            <img
              src="/logo2.png"
              alt="Logo"
              className="w-10 h-10 object-contain rounded-sm"
            />
          )}
          {route.label}
        </NavLink>
      ))}
    </ul>
  );
};