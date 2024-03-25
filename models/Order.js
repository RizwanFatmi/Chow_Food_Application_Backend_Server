const mongoose = require("mongoose");
const { Schema } = mongoose;


const orderSchema = new Schema({

    date : {type:String , required:true},
    username : {type: String , required:true},
    address : {type: String , required:true},
    mobile : {type: String , required:true},
    email : {type: String , required:true},
    productname : {type: String , required:true},
    quantity : {type: String , required:true},
    price : {type: String , required:true},
    value : {type: String , required:true},
    image :{type: String , required:true},
});

const Order = mongoose.model('orders' ,orderSchema); 
Order.createIndexes();
module.exports = Order;


