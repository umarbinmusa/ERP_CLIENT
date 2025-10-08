import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
  id: number;
  username: string;
  fullName: string;
  role: "ADMIN" | "FINANCE" | "MANAGER" | "LABORATORY" | "DIRECTOR";
  email: string;
  permissions?: string[]; // optional, for custom permissions
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (userData: User) => void;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Load user session if stored
  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    const savedUser = localStorage.getItem("user_data");

    if (token && savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Error parsing saved user data:", error);
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user_data");
      }
    }
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem("user_data", JSON.stringify(userData));
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      if (token) {
        await fetch("https://bottling.com/database/erp.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ action: "logout" }),
        });
      }
    } catch (error) {
      console.error("Logout API error:", error);
    } finally {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user_data");
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;

    const userPermissions = user.permissions ?? [];

    // Define base permissions for each role
    // AuthContext.tsx

const rolePermissions: Record<string, string[]> = {
  ADMIN: [
    "dashboard",
    "inventory",
    "finance",
    "sales",
    "procurement",
    "production",
    "logistics",
    "laboratory",
    "user_management",
    "activity_logs",
    "reports",
    "settings",
  ],

  DIRECTOR: [
    "dashboard",
    "reports",
    "finance",
    "laboratory",
    "activity_logs",
  ],

  FINANCE: [
    "dashboard",
    "finance",
    "reports",
  ],

  MANAGER: [
    "dashboard",
    "inventory",
    "production",
    "procurement",
    "reports",
  ],

  LABORATORY: [
    "dashboard",
    "laboratory",
    "reports",
  ],
};


    // Admin and “all” permission override
    if (user.role === "ADMIN" || userPermissions.includes("all")) {
      return true;
    }

    // Combine role-based and user-specific permissions
    const allPermissions = [
      ...(rolePermissions[user.role] || []),
      ...userPermissions,
    ];

    return allPermissions.includes(permission);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        logout,
        hasPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
