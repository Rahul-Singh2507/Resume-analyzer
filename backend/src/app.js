import express from "express"
import authRouter from "./routes/auth.route.js"
import cookieParser from "cookie-parser";
import cors from "cors"
import interviewRouter from "./routes/interview.routes.js";

const app = express()
const allowedOrigins = [
    process.env.FRONTEND_URL,
    "http://localhost:5173",
    "http://localhost:5174"
].filter(Boolean)

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true)
        }

        return callback(new Error(`Origin ${origin} is not allowed by CORS`))
    },
    credentials:true
}))
app.use("/api/auth",authRouter)
app.use("/api/interview",interviewRouter)

export default app
