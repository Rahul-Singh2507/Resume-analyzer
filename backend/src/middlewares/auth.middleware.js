import jwt from "jsonwebtoken"
import config from "../config/config.js"
import tokenModel from "../models/blacklist.model.js"


 async function authUser(req,res,next){

    const token = req.cookies.token

    if(!token){
       return res.status(401).json({
            message:"token not found"
        })
    }

    const isTokenBlackListed = await tokenModel.findOne({
        token
    }) 

    if(isTokenBlackListed){
        return res.status(400).json({
            message:"ivalid token"
        })
    }
try{ 
    
    const decoded = jwt.verify(token,config.JWT_SECRET)

    req.user = decoded
    return next()

}catch(err){
    return res.status(401).json({
        message:"invalid token"
    })
}
   

}
export default authUser
