import express  from "express";
import cors from "cors"
import mongoose from "mongoose";

const app =express()
 app.use(express.json())
 app.use(express.urlencoded())
 app.use(cors())

 mongoose.connect('mongodb+srv://vijender:vijender250714@cluster0.utozryt.mongodb.net/myLoginRegisterDB?retryWrites=true&w=majority',{
    useNewUrlParser:true,
    useUnifiedTopology:true
 },()=>{
       console.log("db connect")
 })

 const PORT =process.env.PORT || 9002;

const userSchema= new mongoose.Schema({
    name:String,
    number:String,
    email:String,
    password:String,
    cpassword:String,
    balance:Number,
    rechargeAmount:String,
    refnumber:String,
    purchaseTime:String,
    productName:String,
    withdrawAmount:String,
    accountNumber:String,
    ifsc:String,
    referral:String
})
const User =new mongoose.model("User",userSchema)
//  routes

app.post("/login",(req,res)=>{
    const {number,password}=req.body
    User.findOne({number:number},(err,user)=>{
        if(user){
          if(password===user.password){
            res.send({message:"login successfully",user:user})
          }else{
            res.send({message:"password dont match"})
          }
        }else{
          res.send({message:"user not registered"})
     
        }
    })
})
app.post("/register",(req,res)=>{

    const {name,number,email,password,balance,referral}=req.body

    User.findOne({email:email},(err,user)=>{
        if(user){
            res.send({message:"User already registered"})
        }else{
            const user =new User({
                name,
                number,email,password,balance,referral
            })
       
        user.save(err =>{
            if(err){
                res.send(err)
            }else{
                res.send({message:"successfully registered"})
            }
        })
        }
    })

})
app.post("/payment",(req,res)=>{
    const {rechargeAmount,refnumber,number}=req.body

    console.log(req.body)
    User.findOne({number:number},(err,user)=>{
        if(user){
            const user =new User({  
                number,rechargeAmount,refnumber
            })
            user.save(err =>{
                if(err){
                    res.send(err)
                }else{
                    res.send({message:"Your amount will be added in your wallet within 1hour "})
                }
            })
        }else{
            res.send({message:"found not user"})

        }
    })
})
app.post("/withdraw",(req,res)=>{
    const {number,name,withdrawAmount,accountNumber,ifsc}=req.body

    // console.log(req.body)
    User.findOne({number:number},(err,user)=>{
        if(user){
            const user =new User({  
                number,name,withdrawAmount,accountNumber,ifsc
            })
            user.save(err =>{
                if(err){
                    res.send(err)
                }else{
                    res.send({message:"withdraw succesfully done amount will be tranfer in your account within 24hours"})
                }
            })
        }else{
            res.send({message:"found not user"})

        }
    })
})

app.post("/balance",(req,res)=>{
    const {id,name,number,email,password,balance,purchaseTime,productName,referral}=req.body
//   console.log(req.body)
User.updateOne({number:number},
        {$set:{_id:id,name:name,number:number,email:email,password:password,balance:balance,purchaseTime:purchaseTime,productName:productName,referral:referral}},(err,doc)=>{
            if(err){
                res.send({message:"error found"})
            }else if(doc){
                res.send({message:"Purchased Successfully"})
            }
        })                 
    
})

if(process.env.NODE_ENV == "production"){
    app.use(express.static("client/build"));
}

app.listen(PORT,'0.0.0.0',()=>{
    console.log(`be started at port ${PORT}`)
})