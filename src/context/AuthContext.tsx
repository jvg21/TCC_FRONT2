import { createContext, useState, useEffect, useContext } from "react";
import { eraseCookie, getCookie } from "../utils/Cookies";
import type { User } from "../features/user/types";
import { jwtDecode } from "jwt-decode";
import type { TokenPayload } from "../features/login/types";

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = getCookie("authToken");

    if (token) {
      try {
        const tokenPayload: TokenPayload = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (tokenPayload.exp < currentTime) {
          eraseCookie("authToken");
          setIsAuthenticated(false);
          setUser(null);
        } else {
          const userData: User = {
            UserId: parseInt(tokenPayload.nameid),
            Email: "",
            Name: tokenPayload.unique_name,
            Profile: parseInt(tokenPayload.role),
            CompanyId: parseInt(tokenPayload.CompanyId),
          };

          setUser(userData);
          setIsAuthenticated(true);
        }
      } catch (error) {
        eraseCookie("authToken");
        setIsAuthenticated(false);
        setUser(null);
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () =>{
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuthContext must be used within an AuthProvider");
    }
    return context;
}