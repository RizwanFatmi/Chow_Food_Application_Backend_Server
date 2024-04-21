const mongoose = require("mongoose");
var mongoURL = "mongodb+srv://rizwanfatmi:2232223212@cluster0.jjxcm3w.mongodb.net/chowfood?retryWrites=true&w=majority";
 

mongoose.connect(mongoURL,{
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
)
.then(()=>console.log("Database connected"))
.catch((err)=>console.log(err+"  Not connected"));


module.exports = mongoose.connection;
