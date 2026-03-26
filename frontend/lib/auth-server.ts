'use server'
import { JwtPayload, jwtDecode } from "jwt-decode";

export const isTokenExpired = async (token: string) => {
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    //console.log("----------------------------------------------")
    //console.log(decoded.exp);
    if(!decoded.exp) return true;
    const currentTime = Math.floor(Date.now() / 1000);
    //console.log(currentTime);
    return decoded.exp < currentTime;
  } catch (error) {
    //console.log("TokenCheck Error:", error);
    return true;
  }
}