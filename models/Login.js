const mongoose = require("mongoose");
const { Schema } = mongoose;



const loginSchema = new  Schema({
    name : {type: String , required:true},
    address : {type: String , required:true},
    mobile : {type: String , required:true},
    email : {type: String , required:true},
    password : {type: String , required:true},
});


const Login = mongoose.model('logs' ,loginSchema); 
Login.createIndexes();
module.exports = Login;