const mongoose = require("mongoose");
const { Schema } = mongoose;



const userSchema = new  Schema({
    name : {type: String , required:true},
    address : {type: String , required:true},
    mobile : {type: String , required:true},
    email : {type: String , required:true, unique: true},
    password : {type: String , required:true},
    role: {type: String, default: "User"},
    dateCreated: { type: Date, default: Date.now }, 
    active:  { type: Boolean, default: true }, 
});


const User = mongoose.model('users' ,userSchema); 
User.createIndexes();
module.exports = User;