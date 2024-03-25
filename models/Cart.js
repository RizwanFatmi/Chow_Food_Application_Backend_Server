const mongoose = require("mongoose");
const { Schema } = mongoose;


const cartSchema = new Schema({
    username : {type: String , required:true},
    email : {type: String , required:true},
    productname : {type: String , required:true},
    quantity : {type: String , required:true},
    price : {type: String , required:true},
    value : {type: String , required:true},
    image :{type: String , required:true},
});

const Cart = mongoose.model('carts' ,cartSchema); 
Cart.createIndexes();
module.exports = Cart;

