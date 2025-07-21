import { useQuery } from "@tanstack/react-query";

export function useAuth() {
  const { data: user, isLoading } = useQuery({
    queryKey: ["/api/auth/user"],
    retry: false,
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
  };
}

export function useAdmin() {
  const { data: adminData, isLoading, error } = useQuery({
    queryKey: ["/api/auth/admin"],
    retry: false,
  });

  return {
    user: adminData?.user,
    isAdmin: !!adminData?.isAdmin,
    isLoading,
    error,
  };
}