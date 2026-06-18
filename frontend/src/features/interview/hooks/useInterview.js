import { getAllInterviewReports, generateInterviewReport, getInterviewReportById, generateResumePdf } from "../services/interview.api"
import { useContext, useEffect } from "react"
import { InterviewContext } from "../interview.context"
import { useParams } from "react-router"


export const useInterview = () => {

    const context = useContext(InterviewContext)
    const { interviewId } = useParams()

    if (!context) {
        throw new Error("useInterview must be used within an InterviewProvider")
    }

    const {
        loading,
        setLoading,
        report,
        setReport,
        reports,
        setReports,
        downloadingResume,
        setDownloadingResume,
        downloadError,
        setDownloadError
    } = context

    const generateReport = async ({ jobDescription, selfDescription, resumeFile }) => {
        setLoading(true)
        try {
            const response = await generateInterviewReport({ jobDescription, selfDescription, resumeFile })
            setReport(response.interviewReport)
            return response.interviewReport
        } catch (error) {
            console.log(error)
            throw error
        } finally {
            setLoading(false)
        }
    }

    const getReportById = async (interviewId) => {
        setLoading(true)
        let response = null
        try {
            response = await getInterviewReportById(interviewId)
            setReport(response.interviewReport)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
        return response.interviewReport
    }

    const getReports = async () => {
        setLoading(true)
        let response = null
        try {
            response = await getAllInterviewReports()
            setReports(response.interviewReports)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }

        return response.interviewReports
    }

    const getResumePdf = async (interviewReportId) => {
        setDownloadError("")
        setDownloadingResume(true)
        try {
            const response = await generateResumePdf({ interviewReportId })
            const pdfBlob = response instanceof Blob ? response : new Blob([ response ], { type: "application/pdf" })
            const url = window.URL.createObjectURL(pdfBlob)
            const link = document.createElement("a")
            link.href = url
            link.download = `resume_${interviewReportId}.pdf`
            link.style.display = "none"
            document.body.appendChild(link)
            link.click()
            link.remove()
            window.setTimeout(() => {
                window.URL.revokeObjectURL(url)
            }, 1000)
        }
        catch (error) {
            console.log(error)
            setDownloadError(error?.message || "Unable to download the resume right now.")
        } finally {
            setDownloadingResume(false)
        }
    }

    useEffect(() => {
        if (interviewId) {
            getReportById(interviewId)
        } else {
            getReports()
        }
    }, [ interviewId ])

    return {
        loading,
        report,
        reports,
        downloadingResume,
        downloadError,
        generateReport,
        getReportById,
        getReports,
        getResumePdf
    }

}
