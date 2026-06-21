import React,{useState} from 'react'
import { useNavigate, Link } from 'react-router'
import { useAuth } from '../hooks/useAuth'
import "../auth.form.scss"
const Register = () => {

    const navigate = useNavigate()
    const [ username, setUsername ] = useState("")
    const [ email, setEmail ] = useState("")
    const [ password, setPassword ] = useState("")
    const [ error, setError ] = useState("")

    const {loading,handleRegister} = useAuth()
    
    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")

        const result = await handleRegister({username,email,password})
        if(result.ok){
            navigate("/login")
            return
        }

        setError(result.message)
    }

    if(loading){
        return (<main className="auth-page"><h1>Loading.......</h1></main>)
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

                <span className="auth-eyebrow">Create your account</span>
                <h1>Start building role-specific interview plans</h1>
                <p className="auth-intro">Set up your workspace, bring in your resume, and turn any job description into a sharper prep strategy.</p>

                <form onSubmit={handleSubmit}>

                    <div className="input-group">
                        <label htmlFor="username">Username</label>
                        <input
                            onChange={(e) => { setUsername(e.target.value) }}
                            type="text" id="username" name='username' placeholder='Enter username' />
                    </div>
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input
                            onChange={(e) => { setEmail(e.target.value) }}
                            type="email" id="email" name='email' placeholder='Enter email address' />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input
                            onChange={(e) => { setPassword(e.target.value) }}
                            type="password" id="password" name='password' placeholder='Enter password' />
                    </div>

                    {error ? <p className="auth-error">{error}</p> : null}

                    <button className='button primary-button' >Register</button>

                </form>

                <div className="auth-links">
                    <p>Already have an account? <Link to={"/login"} >Login</Link></p>
                    <p><Link to={"/"}>Back to home</Link></p>
                </div>
            </div>
        </main>
    )
}

export default Register
