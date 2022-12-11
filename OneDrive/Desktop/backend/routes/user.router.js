const express=require('express');
var jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const {UserModel}=require('../models/Model.user');
const {DataModel}=require('../models/Model.data');

const userRouter=express.Router();

//signing up
userRouter.post('/signup',async(req,res)=>{
    let {email,password}=req.body;
   bcrypt.hash(password,5,async function(err,hash){
     if(err){
          console.log(err);
          res.send({"ERR":"Please try again"})
     } 
     else{
        try{
            let data= new UserModel({email,password:hash});
            await data.save()
            res.send("signup succesfull")
          }
          catch(err){
              console.log(err);
              res.send({"ERR":"Some error in posting"})
          }
     }
   })
})

//login
userRouter.post('/login',async(req,res)=>{
    let {email,password}=req.body;
    let data=await UserModel.find({email});
    console.log(data)
    if(data.length>0){
    console.log(data[0].password)

        bcrypt.compare(password,data[0].password,async function(err,result){
             if(err){
                console.log(err);
             }
             else if(result){
                var token = jwt.sign({'course':"NXM" }, 'so');
                res.send({"Msg":"Login succefully","token":token})
             }
             else{
                res.send({"ERR":"Incorrect password"})
             }
        })
       
    }else{
        res.send({"ERR":"Please try again later"})
    }
})

//post
userRouter.post('/post',async(req,res)=>{
    let token=req.headers.authorization?.split(' ')[1]
    let {name,city,id}=req.body;
    console.log(name,city,id)
    try{
       let decoded= jwt.verify(token,'so',async function(err,decoded){
        if(err){
            console.log(err)
            res.send({"ERR":"Please login"})
        }else if(decoded){
            let data=new DataModel({name,city,id});
            await data.save();
            res.send({"MSG":"Data Added Succesfully"})
        }
       })
        
    }
    catch(err){
        console.log(err);
        res.send({"ERR":"Some error in posting"})
    }
})

//updating the post
userRouter.patch('/edit/:userId',async (req,res)=>{
     let userId=req.params.userId;
     console.log(userId)
     let new_data=req.body;
     let token=req.headers.authorization?.split(' ')[1];
     let decoded=jwt.verify(token,'so',async function(err,decoded){
        if(err){
            console.log(err);
            res.send({"ERR":"Some error occure"})
        }
        else if(decoded){
            try{
                await DataModel.findByIdAndUpdate({_id:userId},new_data);
                res.send({"MSG":"Post updated"})
             }
             catch(err){
                console.log(err);
                res.send({"ERR":"Some error"})
             }
        }
     })
})


//delete post
userRouter.delete('/delete/:userId',async(req,res)=>{
    let token=req.headers.authorization?.split(' ')[1];
    let userId=req.params.userId;
    console.log(userId)
    let decoded=jwt.verify(token,'so',async function(err,decoded){
        if(err){
            console.log(err);
            res.send({'ERR':'Some error'})
        }
        else if(decoded){
            try{
                    await DataModel.findByIdAndDelete({_id:userId});
                    res.send("Deleted successfully")
            }catch(err){
                console.log(err);
                res.send({"ERR":"some error"})
            }
        }
    })
})

//getting all posts
userRouter.get('/getpost',async(req,res)=>{
    try{
       let data=await DataModel.find();
       res.send(data)
    }
    catch(err){
        console.log(err);
        res.send(err)
    }
})

//geting all users
userRouter.get('/getUser',async(req,res)=>{
    try{
      let data=await UserModel.find();
      res.send(data)
    }
    catch(err){
        console.log(err);
        res.send({"ERR":"Some err in getting users"})
    }
})


module.exports={
    userRouter
}