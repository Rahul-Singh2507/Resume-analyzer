import mongoose from "mongoose";



const blacklistTokenSchema = new mongoose.Schema({

    token:{
        type:String,
        required:[true,"token is reaquired  "]
    }
},{
    timestamps:true
})


const tokenModel =mongoose.model("blacklistTokens",blacklistTokenSchema)

export default tokenModel