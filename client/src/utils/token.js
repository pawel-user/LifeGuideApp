import { jwtDecode } from "jwt-decode";

export function isTokenExpired(token) {
  if (!token || typeof token !== "string") return true;
  try {
    const decoded = jwtDecode(token);
    return decoded.exp * 1000 < Date.now();
  } catch (err) {
    console.error("Token decode error:", err);
    return true;
  }
}
