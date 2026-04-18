import express from "express"
import authMiddleware from "../middlewares/auth.middleware.js"
import interviewController from "../controllers/interview.controller.js";
import upload from "../middlewares/file.middleware.js"
const interviewRouter = express.Router()


interviewRouter.post("/",authMiddleware,upload.single("resume"),interviewController.generateInterviewReportController)

/**
 * @route GET /api/interview/report/:interviewId
 * @description get interview report by interviewId.
 * @access private
 */
interviewRouter.get("/report/:interviewId", authMiddleware, interviewController.getInterviewReportByIdController)


/**
 * @route GET /api/interview/
 * @description get all interview reports of logged in user.
 * @access private
 */
interviewRouter.get("/", authMiddleware, interviewController.getAllInterviewReportsController)


 
interviewRouter.post("/resume/pdf/:interviewReportId", authMiddleware, interviewController.generateResumePdfController)


export default interviewRouter