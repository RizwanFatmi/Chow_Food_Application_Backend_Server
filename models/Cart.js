const mongoose = require("mongoose");
const { Schema } = mongoose;


const cartSchema = new Schema({
    userId : { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
    },
    foodId : { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "foods",
    },
    quantity : {type: String , required:true},
});

const Cart = mongoose.model('carts' ,cartSchema); 
Cart.createIndexes();
module.exports = Cart;

