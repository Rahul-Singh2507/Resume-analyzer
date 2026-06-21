import React from 'react'
import { Link, useNavigate } from 'react-router'
import "../styles/landing.scss"
import { useAuth } from '../../auth/hooks/useAuth'

const steps = [
    {
        title: "Drop in the role",
        description: "Paste a real job description and we pull out the skills, expectations, and likely interview themes."
    },
    {
        title: "Add your story",
        description: "Upload your resume or type a short profile so the plan matches your background instead of generic advice."
    },
    {
        title: "Train with a plan",
        description: "Get a focused interview strategy with strengths, gaps, talking points, and tailored prep direction."
    }
]

const highlights = [
    "Resume upload with instant preview",
    "AI-generated match score and prep direction",
    "Recent plans saved in your workspace"
]

const Landing = () => {
    const navigate = useNavigate()
    const { user, loading, handleLogout } = useAuth()

    const handleLandingLogout = async () => {
        const result = await handleLogout()

        if (result.ok) {
            navigate("/")
        }
    }

    const primaryCta = user ? { to: "/dashboard", label: "Open dashboard" } : { to: "/register", label: "Create free account" }
    const secondaryCta = user ? { to: "/dashboard", label: "Continue building" } : { to: "/login", label: "I already have an account" }

    return (
        <div className='landing-page'>
            <div className='landing-page__glow landing-page__glow--left' />
            <div className='landing-page__glow landing-page__glow--right' />

            <header className='landing-nav'>
                <Link to='/' className='landing-brand'>
                    <span className='landing-brand__mark'>RA</span>
                    <span className='landing-brand__text'>Resume Analyzer</span>
                </Link>

                <div className='landing-nav__actions'>
                    {loading ? (
                        <span className='landing-nav__status'>Checking session...</span>
                    ) : user ? (
                        <>
                            <Link to='/dashboard' className='landing-link-button'>Dashboard</Link>
                            <button type='button' className='landing-link-button landing-link-button--ghost' onClick={handleLandingLogout}>
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to='/login' className='landing-link-button landing-link-button--ghost'>Login</Link>
                            <Link to='/register' className='landing-link-button'>Get Started</Link>
                        </>
                    )}
                </div>
            </header>

            <main className='landing-hero'>
                <section className='landing-copy'>
                    <span className='landing-eyebrow'>Interview prep, tuned to the role you actually want</span>
                    <h1>Walk into interviews with a sharper story than your resume alone can tell.</h1>
                    <p>
                        Resume Analyzer turns a job description plus your background into a focused prep plan,
                        so you know what to study, what to emphasize, and where you need stronger examples.
                    </p>

                    <div className='landing-hero__actions'>
                        <Link to={primaryCta.to} className='landing-cta landing-cta--primary'>{primaryCta.label}</Link>
                        <Link to={secondaryCta.to} className='landing-cta landing-cta--secondary'>{secondaryCta.label}</Link>
                    </div>

                    <div className='landing-proof'>
                        <div>
                            <strong>Role-aware</strong>
                            <span>Built around the actual job post, not a template checklist.</span>
                        </div>
                        <div>
                            <strong>Profile-aware</strong>
                            <span>Uses your resume or summary to personalize your prep angle.</span>
                        </div>
                    </div>
                </section>

                <aside className='landing-preview'>
                    <div className='landing-preview__card landing-preview__card--accent'>
                        <p className='landing-preview__label'>Preview</p>
                        <h2>Interview strategy for Senior Frontend Engineer</h2>
                        <div className='landing-score'>
                            <span className='landing-score__value'>84%</span>
                            <span className='landing-score__copy'>match score</span>
                        </div>
                        <ul className='landing-checklist'>
                            {highlights.map((item) => (
                                <li key={item}>{item}</li>
                            ))}
                        </ul>
                    </div>

                    <div className='landing-preview__card'>
                        <p className='landing-preview__label'>What you get</p>
                        <div className='landing-mini-grid'>
                            <article>
                                <strong>Strengths to lean on</strong>
                                <span>Surface the experience that best fits the role.</span>
                            </article>
                            <article>
                                <strong>Gaps to close</strong>
                                <span>Know where to prepare before interview day.</span>
                            </article>
                            <article>
                                <strong>Talking points</strong>
                                <span>Turn your raw background into clear interview stories.</span>
                            </article>
                            <article>
                                <strong>Saved history</strong>
                                <span>Reopen older plans from your dashboard anytime.</span>
                            </article>
                        </div>
                    </div>
                </aside>
            </main>

            <section className='landing-steps'>
                {steps.map((step, index) => (
                    <article key={step.title} className='landing-step'>
                        <span className='landing-step__index'>0{index + 1}</span>
                        <h3>{step.title}</h3>
                        <p>{step.description}</p>
                    </article>
                ))}
            </section>
        </div>
    )
}

export default Landing
