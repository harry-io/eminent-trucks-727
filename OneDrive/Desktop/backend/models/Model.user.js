const mongoose=require('mongoose');

const UserShema=mongoose.Schema({
    email:String,
    password:String,
})

const UserModel=mongoose.model('user',UserShema);

module.exports={
    UserModel
}