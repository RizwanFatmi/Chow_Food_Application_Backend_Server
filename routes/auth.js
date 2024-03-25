const express = require('express');
const User = require('../models/UsersList');
const Food = require('../models/FoodList');
const Login = require("../models/Login");
const Cart = require("../models/Cart");
const Order = require("../models/Order")
const router = express.Router();
const { body, validationResult } = require('express-validator');






// ADD USER 
router.post('/adduser', [
  body('name', 'Enter a valid name').isLength({ min: 4 }),
  body('address', 'Enter a valid address').isLength({ min: 10 }),
  body('mobile', 'Enter a valid mobile number').isLength({ min: 10 }),
  body('email', 'Enter a valid Email').isEmail(),
  body('password', 'Password must be atleast 5 characters').isLength({ min: 5 }),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  let user = await User.findOne({ email: req.body.email });
  if (user) {
    return res.status(404).json({ errors: "This email is alredy used by another user" })
  }
  user = await User.create({
    name: req.body.name,
    address: req.body.address,
    mobile: req.body.mobile,
    email: req.body.email,
    password: req.body.password,

  })

  res.json(user)
})
/****************************END************************************/


// DELETE USER 
router.post('/deleteuser', async (req, res) => {
  
  const { _id } = req.body;
  try {
  
    let user= await User.findOneAndRemove({_id});
    res.json('Deleted succesfully')
  } catch (error) {
    console.error(error.message);
    res.status(500).send(" Cannot Delete!! Server Error")
  }
})
/****************************END************************************/



// LOGIN
router.post('/login', [
  body('email', 'Enter a valid Email').isEmail(),
  body('password', 'Password cannot be blank').exists(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (password != user.password) {
      return res.status(400).json({ error: "Please try to login with correct credentials" })
    }
    const payload = {
      user: {
        id: user.id
      }
    }
    
    login = await Login.create({
      
      name: user.name,
      address: user.address,
      mobile: user.mobile,
      email: user.email,
      password: user.password,
  })
  res.json(login)
  
    

  } catch (error) {
    console.error(error.message);
    res.status(500).send("Please try to login with correct credentials")
  }
})
/****************************END************************************/



// LOGOUT 
router.get('/logout', async (req, res) => {

try{
    let logout= await Login.findOneAndRemove();
    res.json('Logout succesfully')
}
catch (error) {
  console.error(error.message);
  res.status(500).send("Please try to login with correct credentials")
}
  
})
/****************************END************************************/

// LOG DATA 
router.get('/logdata', async (req, res) => {

 
  let logdata= await Login.findOne();
  res.json(logdata)

})
/****************************END************************************/



// USER LIST
router.get('/userlist', async (req, res) => {

  try {
    let user = await User.find();
    res.json(user)

  } catch (error) {

    console.error(error.message);
    res.status(500).send("Server error")

  }
})
/****************************END************************************/


// ADD FOOD 
router.post('/addfood', [
  body('name', 'Enter a valid  food name').isLength({ min: 3 }),
  body('description', 'Enter a valid description').isLength({ min: 5 }),
  body('price', 'Enter a valid price').isLength({ min: 1 }),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  food = await Food.create({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    image: req.body.image,
  })

  res.json(food)
})
/****************************END************************************/

// UPDATE FOOD 
router.post('/updatefood',[
  body('name', 'Enter a valid  food name').isLength({ min: 3 }),
  body('description', 'Enter a valid description').isLength({ min: 5 }),
  body('price', 'Enter a valid price').isLength({ min: 1 }),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { _id,name,description,price,image } = req.body;
  try {
  
    let food= await Food.updateOne({_id},{
      $set : {name,description,price,image}
    });
 
    res.json('Updated succesfully')
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Cannot Update!! Server Error")
  }
})
/****************************END************************************/


// DELETE FOOD 
router.post('/deletefood', async (req, res) => {
  
  const { _id } = req.body;
  try {
  
    let food= await Food.findOneAndRemove({_id});
    res.json('Deleted succesfully')
  } catch (error) {
    console.error(error.message);
    res.status(500).send(" Cannot Delete!! Server Error")
  }
})
/****************************END************************************/


// GET FOOD 
router.post('/getfood', async (req, res) => {
  
  const { name } = req.body;
  try {
    let food = await Food.findOne({ name });
    
    const payload = {
      food: {
        id: food.id
      }
    }
    res.json(food)

  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error")
  }
})
/****************************END************************************/

// FOOD LIST
router.get('/foodlist', async (req, res) => {

  try {
    let food = await Food.find();

    
    res.json(food)

  } catch (error) {

    console.error(error.message);
    res.status(500).send("Server error")

  }
})
/****************************END************************************/




// ADD TO CART
router.post('/addtocart', async (req, res) => {
  
  const { _id, quantity } = req.body;
  try {

    let login= await Login.findOne();
    if(login){
    let food= await Food.findOne({_id});
    let val = parseInt(quantity)*parseInt(food.price)
    let v = val.toString();
    cart = await Cart.create({

    username : login.name,
    email : login.email,
    productname : food.name,
    quantity : req.body.quantity,
    price : food.price,
    value : v,
    image : food.image
  })
  res.json(cart)
  
}


  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error")
  }
})
/****************************END************************************/




// CART DATA
router.get('/cartdata', async (req, res) => {

    let login= await Login.findOne();
    if(login){
    let cart= await Cart.find({email: login.email});
  res.json(cart)
  
}


  
})
/****************************END************************************/


// DELETE CART 
router.post('/deletecart', async (req, res) => {
  
  const { _id } = req.body;
  try {
  
    let food= await Cart.findOneAndRemove({_id});
    res.json('Deleted succesfully')
  } catch (error) {
    console.error(error.message);
    res.status(500).send(" Cannot Delete!! Server Error")
  }
})
/****************************END************************************/

// ORDER FOOD 
router.post('/orderfood', async (req, res) => {
  
  const { _id } = req.body;
  try {
   let currentdate = new Date();
    let d =  currentdate.getDate()  +"-" + (currentdate.getMonth()+1)
    + "-" + currentdate.getFullYear();

    let login= await Login.findOne();
  
    let cart= await Cart.findOne({_id});

    order = await Order.create({

      date : d,
      username : login.name,
      address  : login.address,
      mobile : login.mobile,
      email : login.email,
      productname : cart.productname,
      quantity : cart.quantity,
      price : cart.price,
      value : cart.value,
      image : cart.image
    })
    res.json(order)

  
   
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error!!")
  }
})





/****************************END************************************/


// ORDER LIST
router.get('/orderlist', async (req, res) => {

  try {
    let order = await Order.find();

    
    res.json(order)

  } catch (error) {

    console.error(error.message);
    res.status(500).send("Server error")

  }
})
/****************************END************************************/

// MY ORDER DATA
router.get('/myorder', async (req, res) => {

  let login= await Login.findOne();
  if(login){
  let myorder= await Order.find({email: login.email});
res.json(myorder)

}



})
/****************************END************************************/






module.exports = router 