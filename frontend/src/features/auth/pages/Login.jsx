import React from 'react'
import { useState } from 'react'
import "../auth.form.scss"
import {useNavigate,Link} from "react-router"
import { useAuth } from '../hooks/useAuth'

const Login = () => {
  const {loading,handleLogin}= useAuth()
const navigate = useNavigate();

const [email, setEmail] = useState("")
const [password, setPassword] = useState("")
const [error, setError] = useState("")
const handleSubmit=async(e)=>{
e.preventDefault()
setError("")

const result = await handleLogin({email,password})
if(result.ok){
  navigate('/dashboard')
  return
}

setError(result.message)

}
if(loading){
  return <main className="auth-page"><h1>loading</h1></main>
}
  return (
    <main className="auth-page">
      <div className="auth-page__glow auth-page__glow--left" />
      <div className="auth-page__glow auth-page__glow--right" />

      <div className="form-container">
        <Link className="auth-brand" to="/">
          <span className="auth-brand__mark">RA</span>
          <span className="auth-brand__text">Resume Analyzer</span>
        </Link>

        <span className="auth-eyebrow">Welcome back</span>
        <h1>Log in to your interview workspace</h1>
        <p className="auth-intro">Pick up your saved plans, create new strategies, and keep your prep focused on the role you want.</p>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input onChange={(e)=>setEmail(e.target.value)}
              type="email"
              id="email"
              name="email"
              placeholder="Enter email address"
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input onChange={(e)=>setPassword(e.target.value)}
              type="password"
              id="password"
              name="password"
              placeholder="Enter password"
            />
          </div>

          {error ? <p className="auth-error">{error}</p> : null}

          <button className="button primary-button">
            Login
          </button>
        </form>

        <div className="auth-links">
          <p>Don't have an account? <Link to={"/register"} >Register</Link></p>
          <p><Link to={"/"}>Back to home</Link></p>
        </div>
      </div>
    </main>
)}

export default Login
