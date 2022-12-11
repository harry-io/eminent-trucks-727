const express=require('express');
const jwt=require('jsonwebtoken')
const cors=require('cors')

const {connection}=require('./config/db');
const {userRouter}=require('./routes/user.router')
const {UserModel}=require('./models/Model.user')
const {DataModel}=require('./models/Model.data')

require('dotenv').config();
const app=express();
app.use(express.json());

app.use(cors({
    origin:"*"
}))

app.post('/signup', userRouter)
app.post('/login',userRouter)
app.post('/post',userRouter)
app.get('/getUser',userRouter)
app.get('/getpost',userRouter)
app.patch('/edit/:userId',userRouter)
app.delete('/delete/:userId',userRouter)


app.listen(process.env.port,async()=>{
    try{
        await connection;
        console.log("connected to data base")
        console.log(`listening in port no ${process.env.port}`)
    }
    catch(eerr){
        console.log(eerr)
    }
})