const mongoose = require("mongoose");
const { Schema } = mongoose;


const foodSchema = new  Schema({
    name : {type: String , required:true},
    description : {type: String , required:true},
    price : {type: String , required:true},
    image : {type: String , required:true},
});

const Food = mongoose.model('foods' ,foodSchema); 
Food.createIndexes();
module.exports = Food;

