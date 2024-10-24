import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import useBoundStore from "~/store/useStore";

interface AuthGuardProps {
  Page: React.ComponentType;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ Page }) => {
  const navigate = useNavigate();
  const { isLoggedIn } = useBoundStore();
  useEffect(() => {
    if (isLoggedIn) {
      if (
        location.pathname === "/login" ||
        location.pathname === "/registration"
      ) {
        navigate("/profile", { replace: true });
      }
    }
    if (!isLoggedIn) {
      if (
        location.pathname !== "/registration" &&
        location.pathname !== "/login"
      ) {
        navigate("/login", { replace: true });
      }
    }
  }, [isLoggedIn, navigate]);

  return <Page />;
};
