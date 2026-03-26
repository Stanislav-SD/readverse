'use client'
import { gql, useMutation } from "@apollo/client";
import { isTokenExpired } from "@/lib/auth-server";
import { useCallback } from "react";
const RefreshToken = gql`
  mutation RefreshToken($refreshToken: String!) {
    refreshToken(token: $refreshToken)
  }
`;

export const logout = async () => {
  //console.log("Logging out");
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  window.location.href = "/signin";
};

const useRefreshToken = () => {
  const [refreshTokenMutation] = useMutation(RefreshToken);

  const refreshToken = async () => {
    const storedRefreshToken = localStorage.getItem("refreshToken");
    if (!storedRefreshToken) return false;

    try {
      const { data } = await refreshTokenMutation({
        variables: { refreshToken: storedRefreshToken },
      });

      if (data?.refreshToken) {
        // Save the new token in localStorage
        localStorage.setItem("accessToken", data.refreshToken);

        return true; // Return success
      }
    } catch (error) {
      console.error("Failed to refresh token:", error);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      throw error;
    }
  };

  return { refreshToken };
};

export const useAuthToken = () => {
  const { refreshToken } = useRefreshToken();

  const checkAuthToken = useCallback(async () => {
    //console.log("Checking---------");
    const accessToken = localStorage.getItem("accessToken");

    if (accessToken && !await isTokenExpired(accessToken)) {
      //console.log("Token is valid");
      return true;
    }

    //console.log("Token expired, refreshing...");
    const refreshedToken = await refreshToken();
    return refreshedToken;
  }, [refreshToken]);

  return { checkAuthToken };
};