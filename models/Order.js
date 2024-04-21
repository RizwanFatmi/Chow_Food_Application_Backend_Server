const mongoose = require("mongoose");
const { Schema } = mongoose;

const productSchema = new Schema({
    productname: { type: String, required: true },
    description: { type: String, required: true },
    quantity: { type: String, required: true },
    price: { type: String, required: true },
    value: { type: String, required: true },
    image: { type: String, required: true }
});

const orderSchema = new Schema({
    orderNumber: { type: String, required: true },
    orderDate: { type: Date, default: Date.now },
    username: { type: String, required: true },
    address: { type: String, required: true },
    mobile: { type: String, required: true },
    email: { type: String, required: true },
    products: [productSchema],
    totalValue: { type: String, required: true } // Total value of the order
});

const Order = mongoose.model('orders', orderSchema);

// Generate order number function
function generateOrderNumber() {
  const prefix = "ODIN1504";
  const randomSixDigitNumber = Math.floor(100000 + Math.random() * 900000).toString();
  return prefix + randomSixDigitNumber;
}

// Pre-save hook to generate order number and calculate total value
orderSchema.pre('save', function(next) {
  if (!this.orderNumber) {
    this.orderNumber = generateOrderNumber();
  }
  if (this.products && this.products.length > 0) {
    this.totalValue = this.products.reduce((total, product) => total + parseFloat(product.value), 0).toString();
  } else {
    this.totalValue = "0";
  }
  next();
});

Order.createIndexes();
module.exports = Order;
