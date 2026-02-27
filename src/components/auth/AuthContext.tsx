"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import type { AppUser, UserRole } from "@/lib/auth/roles";

interface AuthContextType {
  appUser: AppUser | null;
  authUser: User | null;
  isLoading: boolean;
  isAdmin: boolean;
  isProvider: boolean;
  isShopOwner: boolean;
  hasRole: (role: UserRole) => boolean;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  appUser: null,
  authUser: null,
  isLoading: true,
  isAdmin: false,
  isProvider: false,
  isShopOwner: false,
  hasRole: () => false,
  logout: async () => {},
  refresh: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

// Also export aliased hooks for backward compatibility
export function useProviderAuth() {
  const ctx = useAuth();
  return {
    provider: ctx.appUser && ctx.isProvider ? {
      id: ctx.appUser.providerId || ctx.appUser.id,
      authId: ctx.appUser.authId,
      name: ctx.appUser.name,
      email: ctx.appUser.email,
    } : ctx.isAdmin ? {
      id: "admin",
      authId: ctx.appUser?.authId || "",
      name: "Admin",
      email: ctx.appUser?.email || "",
    } : null,
    user: ctx.authUser,
    isAdmin: ctx.isAdmin,
    isLoading: ctx.isLoading,
    logout: ctx.logout,
    refreshProvider: ctx.refresh,
  };
}

export function useShopAuth() {
  const ctx = useAuth();
  return {
    shop: ctx.appUser && ctx.isShopOwner ? {
      id: ctx.appUser.shopId || ctx.appUser.id,
      authId: ctx.appUser.authId,
      name: ctx.appUser.name,
      email: ctx.appUser.email,
    } : ctx.isAdmin ? {
      id: "admin",
      authId: ctx.appUser?.authId || "",
      name: "Admin",
      email: ctx.appUser?.email || "",
    } : null,
    user: ctx.authUser,
    isAdmin: ctx.isAdmin,
    isLoading: ctx.isLoading,
    logout: ctx.logout,
    refreshShop: ctx.refresh,
  };
}

// Public paths that don't require auth
const PUBLIC_PATHS = [
  "/dashboard/login",
  "/dashboard/signup",
  "/shop-dashboard/login",
  "/shop-dashboard/signup",
  "/login",
  "/signup",
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();

  const fetchUser = useCallback(async (user: User) => {
    try {
      const res = await fetch("/api/auth/unified-me");
      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          setAppUser(data.user as AppUser);
          return;
        }
      }
    } catch (err) {
      console.error("Failed to fetch user:", err);
    }
    setAppUser(null);
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setAuthUser(session.user);
        await fetchUser(session.user);
      }
      setIsLoading(false);
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          setAuthUser(session.user);
          await fetchUser(session.user);
        } else {
          setAuthUser(null);
          setAppUser(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [fetchUser]);

  // Redirect to login if accessing protected paths without auth
  useEffect(() => {
    if (isLoading) return;
    if (!authUser && !PUBLIC_PATHS.some(p => pathname.startsWith(p))) {
      // Only redirect if in a dashboard area
      if (pathname.startsWith("/dashboard") && !PUBLIC_PATHS.includes(pathname)) {
        router.replace("/dashboard/login");
      }
      if (pathname.startsWith("/shop-dashboard") && !PUBLIC_PATHS.includes(pathname)) {
        router.replace("/shop-dashboard/login");
      }
    }
  }, [isLoading, authUser, pathname, router]);

  const checkRole = useCallback((role: UserRole) => appUser?.roles?.includes(role) || false, [appUser]);

  const logout = async () => {
    await supabase.auth.signOut();
    setAuthUser(null);
    setAppUser(null);
    router.push("/");
  };

  const refresh = async () => {
    if (authUser) await fetchUser(authUser);
  };

  return (
    <AuthContext.Provider
      value={{
        appUser,
        authUser,
        isLoading,
        isAdmin: checkRole("admin"),
        isProvider: checkRole("provider"),
        isShopOwner: checkRole("shop_owner"),
        hasRole: checkRole,
        logout,
        refresh,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
