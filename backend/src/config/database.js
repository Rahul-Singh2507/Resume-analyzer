import mongoose from "mongoose"
import config from "./config.js"

 async function connectToDB() {
    await mongoose.connect(config.MONGO_URI)
    console.log("connected to db")
}
export default connectToDB
