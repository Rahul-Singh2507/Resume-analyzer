import { Children, createContext,useEffect,useState } from "react";
import { getME } from "./services/auth.api";

export const AuthContext = createContext()
export const AuthProvider = ({children})=>{
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
useEffect(() => {
  const getSetUser = async () => {
    const data = await getME()
    
    if (data?.user) {
      setUser(data.user)
    } else {
      setUser(null)
    }
    
    setLoading(false)
  }

  getSetUser()
}, [])


    return(

        <AuthContext.Provider value ={{user,setUser,loading,setLoading}}>
{children}

        </AuthContext.Provider>
    )
}