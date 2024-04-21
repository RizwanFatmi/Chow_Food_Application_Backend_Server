const express = require('express');
const User = require('../models/UsersList');
const Food = require('../models/FoodList');
const Cart = require("../models/Cart");
const Order = require("../models/Order")
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET="$ad@!hddd@jkh%&JJJ#";






// ADD USER 

router.post('/adduser', [
  body('name', 'Enter a valid name').isLength({ min: 4 }),
  body('address', 'Enter a valid address').isLength({ min: 10 }),
  body('mobile', 'Enter a valid mobile number').isLength({ min: 10 }),
  body('email', 'Enter a valid Email').isEmail(),
  body('password', 'Password must be atleast 6 characters').isLength({ min: 6 }),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  try {
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(404).json({ errors: "This email is already used by another user" });
    }
    
    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(req.body.password, 10); // 10 is the salt rounds
    
    user = await User.create({
      name: req.body.name,
      address: req.body.address,
      mobile: req.body.mobile,
      email: req.body.email,
      password: hashedPassword, // Save the hashed password
    });
    
   return res.status(200).send({success: true});
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

/****************************END************************************/


// ACTIVE/DE-ACTIVE USER 
router.post('/changeuserstatus', async (req, res) => {
  
  const { _id, status } = req.body;
  try {
    const user = await User.updateOne(
      { _id },
      { $set: { active: status === "Active" ? true : false } }
    );
   return res.status(200).send({success: true});
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error")
  }
})
/****************************END************************************/

// DELETE USER 
router.post('/deleteuser', async (req, res) => {
  
  const { _id } = req.body;
  try {
  
    let user= await User.findOneAndRemove({_id});
   return res.status(200).send({success: true});
  } catch (error) {
    console.error(error.message);
    res.status(500).send(" Cannot Delete!! Server Error")
  }
})
/****************************END************************************/



// LOGIN
router.post('/login', async (req, res) => {
  const { email, password } = req.body.user;
  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials",  success: false  });
    }
    if (user && user.active == false) {
      return res.status(404).json({ error: "User is not active",  success: false  });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(400).json({ error: "Invalid credentials",  success: false  });
    }

    const data = {
      user: {
        id: user.id,
      },
    };
    const token = jwt.sign(data, JWT_SECRET);
    // Combine the token and success message in the response
    res.status(200).json({ token, success: true });
    
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

/****************************END************************************/




// LOG DATA 
router.get('/logdata', async (req, res) => {
  try {
    const token = req.header('token');
    if (!token){
      return res.status(404).json({ message: 'Please Login to Continue!' });
    } 
    const data = jwt.verify(token,JWT_SECRET);
    const _id = data.user.id;
    const logdata = await User.findById(_id, { password: 0 });
    if (!logdata) {
      return res.status(404).json({ message: 'User data not found' });
    }
    res.json(logdata);
  } catch (error) {
    // Handle the error appropriately, don't send a response here
    return res.status(500).json({ message: "Server Error" });
  }
});


/****************************END************************************/



// USER LIST
router.post('/userlist', async (req, res) => {
  const {  currentPage = 1, pageSize = 10 } = req.body;
  const skip = (currentPage - 1) * pageSize;
  try {
    const user = await User.find({ role: "User" }).select("-password").sort({ dateCreated: -1 }).skip(skip).limit(pageSize);
    const totalItems = await User.countDocuments(); 
    const totalPages = Math.ceil(totalItems / pageSize); 
    res.status(200).json({
      currentPage,
      pageSize,
      totalItems,
      totalPages,
      user,
    });
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
 return res.status(200).send({success: true});
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
 
   return res.status(200).send({success: true});
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
   return res.status(200).send({success: true});
  } catch (error) {
    console.error(error.message);
    res.status(500).send(" Cannot Delete!! Server Error")
  }
})
/****************************END************************************/

// FOOD LIST
router.get('/foodlist', async (req, res) => {
  try {
    let food = await Food.find().sort({ dateCreated: -1 });

    res.json(food)
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
})
/****************************END************************************/




// ADD TO CART
router.post('/addtocart', async (req, res) => {
  
  const { userId, foodId, quantity } = req.body;
  try {
    cart = await Cart.create({userId,foodId,quantity});
   return res.status(200).send({success: true});
 } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error")
  }
});
/****************************END************************************/




// CART DATA
router.post('/cartdata', async (req, res) => {
  try{
  let cart= await Cart.find({userId: req.body.userId}).sort({_id:-1}).populate('userId').populate('foodId');
  res.json(cart) 
} catch (error) {
  console.error(error.message);
  res.status(500).send("Server error")
}
})
/****************************END************************************/


// DELETE CART 
router.post('/deletecart', async (req, res) => {
  
  const { _id } = req.body;
  try {
  
    let food= await Cart.findOneAndRemove({_id});
   return res.status(200).send({success: true});
  } catch (error) {
    console.error(error.message);
    res.status(500).send(" Cannot Delete!! Server Error")
  }
})
/****************************END************************************/

// ORDER FOOD 
router.post('/orderfood', async (req, res) => {
  const userId = req.body.userId;

  try {
    // Find the cart items for the user
    const cartItems = await Cart.find({ userId });

    // Find user details
    const user = await User.findOne({ _id: userId });

    // Construct an array of products for the order
    const products = await Promise.all(cartItems.map(async (cartItem) => {
      // Fetch food details for each cart item
      const foodDetails = await Food.findOne({ _id: cartItem.foodId });

      // Calculate value
      const value = (parseFloat(cartItem.quantity) * parseFloat(foodDetails.price)).toString();

      return {
        productname: foodDetails.name,
        description: foodDetails.description,
        quantity: cartItem.quantity,
        price: foodDetails.price,
        value,
        image: foodDetails.image
      };
    }));

    // Generate a unique order number
    const orderNumber = generateOrderNumber();

    // Calculate total order value
    const totalOrderValue = products.reduce((total, product) => total + parseFloat(product.value), 0).toString();

    // Create the order
    const order = await Order.create({
      orderNumber,
      username: user.name,
      address: user.address,
      mobile: user.mobile,
      email: user.email,
      products, 
      totalValue: totalOrderValue,
    });

    // Delete cart items after order is placed
    await Cart.deleteMany({ userId });

   return res.status(200).send({success: true});
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error!!");
  }
});

// Function to generate a unique order number (you can replace this with your own logic)
function generateOrderNumber() {
  const prefix = "ODIN1504";
  const randomSixDigitNumber = Math.floor(100000 + Math.random() * 900000).toString();
  return prefix + randomSixDigitNumber;
}







/****************************END************************************/


// ORDER LIST
router.post('/orderlist', async (req, res) => {
  const {  currentPage = 1, pageSize = 10 } = req.body;
  const skip = (currentPage - 1) * pageSize;
  try {
    const order = await Order.find().sort({orderDate:-1}).skip(skip).limit(pageSize);
    const totalItems = await Order.countDocuments(); 
    const totalPages = Math.ceil(totalItems / pageSize); 
    res.status(200).json({
      currentPage,
      pageSize,
      totalItems,
      totalPages,
      order,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error")
  }
})
/****************************END************************************/

// MY ORDER DATA
router.post('/myorder', async (req, res) => {
  const userEmail = req.body.userEmail;
  let myorder= await Order.find({email: userEmail}).sort({orderDate:-1});
  res.json(myorder);
})
/****************************END************************************/






module.exports = router 