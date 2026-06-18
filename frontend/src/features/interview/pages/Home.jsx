import React, { useEffect, useRef, useState } from 'react'
import "../styles/home.scss"
import { useInterview } from '../hooks/useInterview.js'
import { useAuth } from '../../auth/hooks/useAuth'
import { useNavigate } from 'react-router'

const Home = () => {

    const { loading, generateReport,reports } = useInterview()
    const [ jobDescription, setJobDescription ] = useState("")
    const [ selfDescription, setSelfDescription ] = useState("")
    const [ resumeFile, setResumeFile ] = useState(null)
    const [ resumePreviewUrl, setResumePreviewUrl ] = useState("")
    const [ errorMessage, setErrorMessage ] = useState("")
    const resumeInputRef = useRef()

    const navigate = useNavigate()
const { handleLogout } = useAuth()

const onLogout = async () => {
    await handleLogout()
    navigate('/login')
}

    useEffect(() => {
        if (!resumeFile) {
            setResumePreviewUrl("")
            return undefined
        }

        const objectUrl = URL.createObjectURL(resumeFile)
        setResumePreviewUrl(objectUrl)

        return () => {
            URL.revokeObjectURL(objectUrl)
        }
    }, [ resumeFile ])

    const handleResumeChange = (event) => {
        const selectedFile = event.target.files?.[ 0 ] ?? null
        setResumeFile(selectedFile)
        setErrorMessage("")
    }

    const clearSelectedResume = () => {
        setResumeFile(null)
        setResumePreviewUrl("")
        setErrorMessage("")

        if (resumeInputRef.current) {
            resumeInputRef.current.value = ""
        }
    }

    const handleGenerateReport = async () => {
        const trimmedJobDescription = jobDescription.trim()
        const trimmedSelfDescription = selfDescription.trim()

        setErrorMessage("")

        if (!trimmedJobDescription) {
            setErrorMessage("Add the target job description before generating a report.")
            return
        }

        if (!resumeFile && !trimmedSelfDescription) {
            setErrorMessage("Upload a resume PDF or add a self description to continue.")
            return
        }

        try {
            const data = await generateReport({
                jobDescription: trimmedJobDescription,
                selfDescription: trimmedSelfDescription,
                resumeFile
            })

            if (!data?._id) {
                setErrorMessage("We could not generate your interview plan right now. Please try again.")
                return
            }

            navigate(`/interview/${data._id}`)
        } catch (error) {
            setErrorMessage(error?.response?.data?.message || "We could not generate your interview plan right now. Please try again.")
        }
    }

if (loading) {
    return (
        <div className='home-page'>
            <header className='page-header'>
                <div className='skeleton skeleton--title' style={{ width: '400px', height: '36px', margin: '0 auto 1rem' }} />
                <div className='skeleton skeleton--text' style={{ width: '300px', height: '14px', margin: '0 auto' }} />
            </header>

            <div className='interview-card'>
                <div className='interview-card__body'>

                    {/* Left Panel Skeleton */}
                    <div className='panel panel--left'>
                        <div className='skeleton skeleton--text' style={{ width: '160px', height: '20px', marginBottom: '1rem' }} />
                        <div className='skeleton' style={{ width: '100%', height: '320px', borderRadius: '10px' }} />
                    </div>

                    <div className='panel-divider' />

                    {/* Right Panel Skeleton */}
                    <div className='panel panel--right'>
                        <div className='skeleton skeleton--text' style={{ width: '120px', height: '20px', marginBottom: '1rem' }} />
                        <div className='skeleton' style={{ width: '100%', height: '130px', borderRadius: '10px', marginBottom: '1rem' }} />
                        <div className='skeleton skeleton--text' style={{ width: '40px', height: '14px', margin: '0 auto 1rem' }} />
                        <div className='skeleton skeleton--text' style={{ width: '140px', height: '16px', marginBottom: '0.5rem' }} />
                        <div className='skeleton' style={{ width: '100%', height: '100px', borderRadius: '10px', marginBottom: '1rem' }} />
                        <div className='skeleton' style={{ width: '100%', height: '60px', borderRadius: '10px' }} />
                    </div>
                </div>

                <div className='interview-card__footer'>
                    <div className='skeleton skeleton--text' style={{ width: '200px', height: '14px' }} />
                    <div className='skeleton' style={{ width: '220px', height: '44px', borderRadius: '8px' }} />
                </div>
            </div>
        </div>
    )
}

    return (
        <div className='home-page'>

            {/* Page Header */}
    <header className='page-header'>
    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
        <button onClick={onLogout} className='button' style={{
            background: 'transparent',
            border: '1px solid #2a3042',
            color: '#8892a4',
            padding: '0.5rem 1.2rem',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '0.85rem',
        }}>
            Logout
        </button>
    </div>
    <h1>Create Your Custom <span className='highlight'>Interview Plan</span></h1>
    <p>Let our AI analyze the job requirements and your unique profile to build a winning strategy.</p>
</header>
            {/* Main Card */}
            <div className='interview-card'>
                <div className='interview-card__body'>

                    {/* Left Panel - Job Description */}
                    <div className='panel panel--left'>
                        <div className='panel__header'>
                            <span className='panel__icon'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>
                            </span>
                            <h2>Target Job Description</h2>
                            <span className='badge badge--required'>Required</span>
                        </div>
                        <textarea
                            onChange={(e) => {
                                setJobDescription(e.target.value)
                                setErrorMessage("")
                            }}
                            className='panel__textarea'
                            placeholder={`Paste the full job description here...\ne.g. 'Senior Frontend Engineer at Google requires proficiency in React, TypeScript, and large-scale system design...'`}
                            maxLength={5000}
                        />
                        <div className='char-counter'>{jobDescription.length} / 5000 chars</div>
                    </div>

                    {/* Vertical Divider */}
                    <div className='panel-divider' />

                    {/* Right Panel - Profile */}
                    <div className='panel panel--right'>
                        <div className='panel__header'>
                            <span className='panel__icon'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                            </span>
                            <h2>Your Profile</h2>
                        </div>

                        {/* Upload Resume */}
                        <div className='upload-section'>
                            <label className='section-label'>
                                Upload Resume
                                <span className='badge badge--best'>Best Results</span>
                            </label>
                            <label className={`dropzone ${resumeFile ? 'dropzone--filled' : ''}`} htmlFor='resume'>
                                <span className='dropzone__icon'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" /><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" /></svg>
                                </span>
                                <p className='dropzone__title'>{resumeFile ? 'Resume selected. Click to replace it.' : 'Click to upload your resume PDF'}</p>
                                <p className='dropzone__subtitle'>PDF only (Max 5MB)</p>
                                <input ref={resumeInputRef} hidden type='file' id='resume' name='resume' accept='.pdf,application/pdf' onChange={handleResumeChange} />
                            </label>
                            {resumeFile && resumePreviewUrl && (
                                <div className='resume-preview'>
                                    <div className='resume-preview__header'>
                                        <div>
                                            <p className='resume-preview__name'>{resumeFile.name}</p>
                                            <p className='resume-preview__meta'>{(resumeFile.size / (1024 * 1024)).toFixed(2)} MB | Preview ready</p>
                                        </div>
                                        <button type='button' className='resume-preview__clear' onClick={clearSelectedResume}>
                                            Remove
                                        </button>
                                    </div>
                                    <iframe className='resume-preview__frame' src={resumePreviewUrl} title='Resume preview' />
                                </div>
                            )}
                        </div>

                        {/* OR Divider */}
                        <div className='or-divider'><span>OR</span></div>

                        {/* Quick Self-Description */}
                        <div className='self-description'>
                            <label className='section-label' htmlFor='selfDescription'>Quick Self-Description</label>
                            <textarea
                                onChange={(e) => {
                                    setSelfDescription(e.target.value)
                                    setErrorMessage("")
                                }}
                                id='selfDescription'
                                name='selfDescription'
                                className='panel__textarea panel__textarea--short'
                                placeholder="Briefly describe your experience, key skills, and years of experience if you don't have a resume handy..."
                            />
                        </div>

                        {/* Info Box */}
                        <div className='info-box'>
                            <span className='info-box__icon'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" stroke="#1a1f27" strokeWidth="2" /><line x1="12" y1="16" x2="12.01" y2="16" stroke="#1a1f27" strokeWidth="2" /></svg>
                            </span>
                            <p>Either a <strong>Resume</strong> or a <strong>Self Description</strong> is required to generate a personalized plan.</p>
                        </div>
                        {errorMessage && <p className='form-error'>{errorMessage}</p>}
                    </div>
                </div>

                {/* Card Footer */}
                <div className='interview-card__footer'>
                    <span className='footer-info'>AI-Powered Strategy Generation &bull; Approx 30s</span>
                    <button
                        onClick={handleGenerateReport}
                        className='generate-btn'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" /></svg>
                        Generate My Interview Strategy
                    </button>
                </div>
            </div>

            {/* Recent Reports List */}
            {reports.length > 0 && (
                <section className='recent-reports'>
                    <h2>My Recent Interview Plans</h2>
                    <ul className='reports-list'>
                        {reports.map(report => (
                            <li key={report._id} className='report-item' onClick={() => navigate(`/interview/${report._id}`)}>
                                <h3>{report.title || 'Untitled Position'}</h3>
                                <p className='report-meta'>Generated on {new Date(report.createdAt).toLocaleDateString()}</p>
                                <p className={`match-score ${report.matchScore >= 80 ? 'score--high' : report.matchScore >= 60 ? 'score--mid' : 'score--low'}`}>Match Score: {report.matchScore}%</p>
                            </li>
                        ))}
                    </ul>
                </section>
            )}

            {/* Page Footer */}
            <footer className='page-footer'>
                <a href='#'>Privacy Policy</a>
                <a href='#'>Terms of Service</a>
                <a href='#'>Help Center</a>
            </footer>
        </div>
    )
}

export default Home
