"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import { gql, useMutation } from "@apollo/client";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { isTokenExpired } from "@/lib/auth-server";

const REFRESH_TOKEN = gql`
  mutation RefreshToken {
    refreshToken
  }
`;

const LOGOUT = gql`
  mutation Logout {
    logout
  }
`;

const LOGIN = gql`
  mutation Login($email: String!, $password: String!, $refresh: Boolean!) {
    login(email: $email, password: $password, refresh: $refresh)
  }
`;

interface AuthContextType {
  role: string | null;
  isLoggedIn: () => Promise<boolean>;
  login: (email: string, password: string, refresh: boolean) => void;
  logout: () => void;
  logoutLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type JwtPayload = {
  exp: number;
  role: string;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [logoutLoading, setlogoutLoading] = useState(false);
  const [loginMutation, { loading, error: mutationError }] = useMutation(LOGIN);
  const [refreshTokenMutation] = useMutation(REFRESH_TOKEN);
  const [logoutMutation] = useMutation(LOGOUT);
  const [role, setRole] = useState<string | null>(null);
  const router = useRouter();

  const setAccessToken = (token: string | null) => {
    //console.log(token);
    localStorage.setItem("accessToken", token||"");
    if (token) {
      try {
        const decoded = jwtDecode<JwtPayload>(token);
        setRole(decoded.role);
      } catch (err) {
        console.error("Invalid token", err);
        setRole(null);
      }
    } else {
      setRole(null);
    }
  };

  const login = async (email: string, password: string, refresh: boolean) => {
    const { data } = await loginMutation({ variables: { email, password, refresh } });
    //console.log(data);
    if (data?.login) {
      const parsed =  await JSON.parse(data.login);
      await setAccessToken(parsed);
      router.push("/dashboard");
    }
  };

  const logout = async () => {
    setlogoutLoading(true);
    const currentPath = window.location.pathname;
    if (currentPath === "/signin") return;
    try {
      await logoutMutation();
    } catch (err) {
      console.warn("Logout mutation failed", err);
    }
    localStorage.removeItem("accessToken");
    router.push("/signin");
    setTimeout(() => {
      setlogoutLoading(false);
    }, 2000);
  };

  const tryRefresh = async () => {
    try {
      const { data } = await refreshTokenMutation();

      if (data?.refreshToken) {
        setAccessToken(data.refreshToken);
        return true;
      }
      return false;
    } catch {
      setAccessToken(null);
      return false;
    }
  };

  const isLoggedIn = async () => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) return false;
  
    const expired = await isTokenExpired(accessToken);
    if (!expired) return true;
  
    const isRefreshed = await tryRefresh();
    if (!isRefreshed) {
      return false;
    }
  
    return true;
  };

  return (
    <AuthContext.Provider value={{
      isLoggedIn,
      login,
      logout,
      role,
      logoutLoading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
