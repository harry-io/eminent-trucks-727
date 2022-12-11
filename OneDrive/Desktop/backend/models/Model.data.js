const mongoose=require('mongoose')
require('dotenv').config();

const dataSchema=mongoose.Schema({
    name:String,
    city:String,
    id:Number
})

const DataModel=mongoose.model('data',dataSchema);

module.exports={
    DataModel
}