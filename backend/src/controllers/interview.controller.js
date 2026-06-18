import { PDFParse } from "pdf-parse";
import {generateInterviewReport,generateResumePdf} from "../services/ai.service.js"

import interviewReportModel from "../models/interviewReport.model.js"

async function extractResumeText(file) {
  if (!file) {
    return ""
  }

  const parser = new PDFParse({ data: file.buffer })

  try {
    const result = await parser.getText()
    return result.text?.trim() || ""
  } finally {
    await parser.destroy()
  }
}

async function generateInterviewReportController(req, res) {
  const selfDescription = req.body.selfDescription?.trim() || ""
  const jobDescription = req.body.jobDescription?.trim() || ""

  if (!jobDescription) {
    return res.status(400).json({
      message: "Job description is required."
    })
  }

  if (!req.file && !selfDescription) {
    return res.status(400).json({
      message: "Upload a resume PDF or add a self description."
    })
  }

  if (req.file && req.file.mimetype !== "application/pdf") {
    return res.status(400).json({
      message: "Only PDF resumes are supported right now."
    })
  }

  const resumeText = await extractResumeText(req.file)

  const interviewReportByAi = await generateInterviewReport({
    resume: resumeText,
    selfDescription,
    jobDescription
    
  })

  const interviewReport = await interviewReportModel.create({
    user: req.user.id,
    resume: resumeText,
    selfDescription,
    jobDescription,
    ...interviewReportByAi  
 
})


res.status(200).json({
    message:"Interview report created successfully.",
    interviewReport
})
}

/**
 * @description Controller to get interview report by interviewId.
 */
async function getInterviewReportByIdController(req, res) {

    const { interviewId } = req.params

    const interviewReport = await interviewReportModel.findOne({ _id: interviewId, user: req.user.id })

    if (!interviewReport) {
        return res.status(404).json({
            message: "Interview report not found."
        })
    }

    res.status(200).json({
        message: "Interview report fetched successfully.",
        interviewReport
    })
}


/** 
 * @description Controller to get all interview reports of logged in user.
 */
async function getAllInterviewReportsController(req, res) {
    const interviewReports = await interviewReportModel.find({ user: req.user.id }).sort({ createdAt: -1 }).select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlans")

    res.status(200).json({
        message: "Interview reports fetched successfully.",
        interviewReports
    })
}


/**
 * @description Controller to generate resume PDF based on user self description, resume and job description.
 */
async function generateResumePdfController(req, res) {
    try {
        const { interviewReportId } = req.params

        const interviewReport = await interviewReportModel.findOne({ _id: interviewReportId, user: req.user.id })

        if (!interviewReport) {
            return res.status(404).json({
                message: "Interview report not found."
            })
        }

        const { resume, jobDescription, selfDescription } = interviewReport

        if (!resume && !selfDescription) {
            return res.status(400).json({
                message: "There is not enough profile information to generate a resume."
            })
        }

        const pdfBuffer = await generateResumePdf({ resume, jobDescription, selfDescription })

        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`
        })

        res.send(pdfBuffer)
    } catch (error) {
        console.error("Resume PDF generation failed:", error)
        res.status(500).json({
            message: "Unable to generate the resume PDF right now. Please try again."
        })
    }
}




export default { generateInterviewReportController, getInterviewReportByIdController, getAllInterviewReportsController, generateResumePdfController }
