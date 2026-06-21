import axios from "axios"

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000"

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true
})

function getErrorMessage(err) {
    return err.response?.data?.message || "Something went wrong"
}

export async function register({username,email,password}) {
    try{
        const response = await api.post('/api/auth/register',{
            username, email ,password
        })

        return response.data
    }catch(err){
        throw new Error(getErrorMessage(err))
    }
}

export async function login({email,password}) {
    try{
        const response = await api.post('/api/auth/login',{
            email ,password
        })

        return response.data
    }catch(err){
        throw new Error(getErrorMessage(err))
    }
}

export async function logout() {
    try{
        const response = await api.get('/api/auth/logout')

        return response.data
    }catch(err){
        throw new Error(getErrorMessage(err))
    }
}

export const getME = async () => {
  try {
    const res = await api.get("/api/auth/getme")
    return res.data
  } catch (err) {
    return null
  }
}
