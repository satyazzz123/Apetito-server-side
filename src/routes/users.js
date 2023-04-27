import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { userModel } from '../models/Users.js';

const router=express.Router();

router.post("/register",async(req,res)=>{
const{username,password}=req.body;

const user=await userModel.findOne({ username});
if(user){
    return res.json({message:"User already exists",user})
}
const hashedPassword= await bcrypt.hash(password,10)
const newuser=new userModel({username,password:hashedPassword})
await newuser.save()
res.json({message:"User registered Successfully",user})

})

router.get("/:userId",async(req,res)=>{
    const user=await userModel.findById(req.params.userId)
    res.json(user)
})

router.post("/login",async(req,res)=>{
    const{username,password}=req.body;
    const user=await userModel.findOne({ username});
    if(!user){
        return res.json({message:"User doesnt exist"})
    }
    const ispasswordvalid= await bcrypt.compare(password,user.password)
    if(!ispasswordvalid){
        return res.json({message:"Please give correct credentials"})
    }
    const token=jwt.sign({id:user._id},"secret")
    res.json({token,userId:user._id})
})
 






export {router as userRouter}

export const verifytoken=(req,res,next)=>{
        const token=req.headers.authorization;
        if(token){
            jwt.verify(token,"secret",(err)=>{
                if(err){
                    return res.send(403)
                }
                next()
            })
        }
        else{
            res.send(401)
        }
}