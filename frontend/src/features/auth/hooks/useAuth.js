import { useContext } from "react";
import {AuthContext} from "../auth.context.jsx"
import {login,register,logout,getME} from "../services/auth.api.js"


export const useAuth =()=>{
   
    const context = useContext(AuthContext)
      
    const {user,setUser,loading,setLoading}= context



  // 🔐 LOGIN
  const handleLogin = async ({ email, password }) => {
    try {
      setLoading(true);

     const data = await login({ email, password });;

      if (data?.user) {
        setUser(data.user);
        return true; // success
      } else {
        setUser(null);
        return false;
      }
    } catch (err) {
      console.log(err);
      setUser(null);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // 📝 REGISTER
  const handleRegister = async ({ username, email, password }) => {
    try {
      setLoading(true);

      const data = await register({ username, email, password });;

      if (data?.user) {
        setUser(data.user);
        return true;
      } else {
        setUser(null);
        return false;
      }
    } catch (err) {
      console.log(err);
      setUser(null);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // 🚪 LOGOUT
  const handleLogout = async () => {
    try {
      setLoading(true);

      await logout();
      setUser(null);

      return true;
    } catch (err) {
      console.log(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

return {user ,loading,handleLogin,handleRegister,handleLogout}
}
