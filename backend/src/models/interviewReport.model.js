import mongoose from "mongoose"

const technicalQuestionSchema = new mongoose.Schema({
    question: { type: String, required: [true, "question is required"] },
    intention: { type: String, required: [true, "intention is required"] },
    answer: { type: String, required: [true, "answer is required"] }
}, { _id: false })

const behavioralQuestionSchema = new mongoose.Schema({
    question: { type: String, required: [true, "question is required"] },
    intention: { type: String, required: [true, "intention is required"] },
    answer: { type: String, required: [true, "answer is required"] }
}, { _id: false })

const skillGapSchema = new mongoose.Schema({
    skill: { type: String, required: [true, "skill is required"] },
    severity: { type: String, enum: ["low", "medium", "high"], required: [true, "severity is required"] }
}, { _id: false })

const preparationPlanSchema = new mongoose.Schema({
    day: { type: Number, required: [true, "day is required"] },
    focus: { type: String, required: [true, "focus is required"] },
    tasks: [{ type: String, required: [true, "tasks are required"] }]
})

const interviewReportSchema = new mongoose.Schema({
    jobDescription: { type: String, required: [true, "jobdescription is required"] },
    resume: { type: String },
    selfDescription: { type: String },
    matchScore: { type: Number, min: 0, max: 100 },
    technicalQuestions: [technicalQuestionSchema],
    behavioralQuestions: [behavioralQuestionSchema],
    skillGaps: [skillGapSchema],
    preparationPlans: [preparationPlanSchema],
    user: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    title: { type: String, default: "Untitled Position" }
}, { timestamps: true })

const interviewReportModel = mongoose.model("interviewReport", interviewReportSchema)

export default interviewReportModel