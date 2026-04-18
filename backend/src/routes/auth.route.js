import express from "express"
import authController from "../controllers/auth.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js"
const authRouter = express.Router()



authRouter.post("/register",authController.registerUserController)
authRouter.post("/login",authController.loginUserController)
authRouter.get("/logout",authController.logoutUserController)
authRouter.get("/getme",authMiddleware,authController.getMeController)
export default authRouter;