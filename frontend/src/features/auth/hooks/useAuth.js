import { useContext } from "react";
import {AuthContext} from "../auth.context.jsx"
import {login,register,logout} from "../services/auth.api.js"


export const useAuth =()=>{
   
    const context = useContext(AuthContext)
      
    const {user,setUser,loading,setLoading}= context



  const handleLogin = async ({ email, password }) => {
    try {
      setLoading(true);

      const data = await login({ email, password });

      if (data?.user) {
        setUser(data.user);
        return { ok: true };
      } else {
        setUser(null);
        return { ok: false, message: "Unable to log in." };
      }
    } catch (err) {
      setUser(null);
      return { ok: false, message: err.message || "Unable to log in." };
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async ({ username, email, password }) => {
    try {
      setLoading(true);

      await register({ username, email, password });
      setUser(null);
      return { ok: true };
    } catch (err) {
      setUser(null);
      return { ok: false, message: err.message || "Unable to register." };
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setLoading(true);

      await logout();
      setUser(null);

      return { ok: true };
    } catch (err) {
      return { ok: false, message: err.message || "Unable to log out." };
    } finally {
      setLoading(false);
    }
  };

return {user ,loading,handleLogin,handleRegister,handleLogout}
}
