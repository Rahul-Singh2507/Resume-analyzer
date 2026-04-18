import config from "../config/config.js";
import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import tokenModel from "../models/blacklist.model.js";
 async function registerUserController(req,res) {


    const {username ,email,password}=req.body

    if(!username||!email||!password){
        res.status(401).json({
            message:"provide all the credential"
        })
    }
    const isAlreadyExist = await userModel.findOne({

        $or:[ {username},
            {email}]
           
    
    })
    if(isAlreadyExist){
        res.status(400).json({
            message:"user already exist "
        })
    }

const hash = await bcrypt.hash(password,10)
const user = await userModel.create({
    username ,
    email,
    password:hash
})

const token = jwt.sign({
    id:user._id,username:user.username
},config.JWT_SECRET,{expiresIn:"1d"})
console.log(config.JWT_SECRET);
res.cookie("token", token, {
  httpOnly: true,
  secure: false,        // keep false (you are on localhost)
  sameSite: "lax"
})
res.status(201).json({
    message:"user registered sucessfully"
})

}

 async function loginUserController(req,res){

    const {email,password}=req.body 

    const user = await userModel.findOne({
        email
    })
    if(!user){
        return res.status(400).json({
            message:"user not found"
        })
        }
   const isPasswordValid = await bcrypt.compare(password,user.password)

   if(!isPasswordValid){
    return res.status(400).json({
        message:"invalid password"
    })
   }
const token = jwt.sign({
    id:user._id,username:user.username
},config.JWT_SECRET,{expiresIn:"1d"})


res.cookie("token", token, {
  httpOnly: true,
  secure: false,        // keep false (you are on localhost)
  sameSite: "lax"
})
res.status(201).json({
    message:"user login sucessfully",
    user:{
        id:user._id,
        username:user.username,
        email:user.email
    }
})


}

async function logoutUserController(req,res) {
    const token = req.cookies.token

    if(token){
        await tokenModel.create({
            token
        })
    }
    res.clearCookie("token")
    res.status(200).json({
        message:"user logout sucessfully"
    })
}

async function getMeController(req,res){


    const user = await userModel.findById(req.user.id)

    res.status(201).json({
        message:"user fetched successfully",
        user:{
            id:user._id,
            username: user.username ,
            email: user.email
        }
    })

}
export default {
    registerUserController,
    loginUserController,
    logoutUserController,
     getMeController
}