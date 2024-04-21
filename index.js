const express = require("express");
const db = require("./db.js")
const app = express();


const port = 4000





app.use(express.json());

app.get("/", (req, res) => {
  res.send('Welcome to the Backend')
});


app.use('/api/auth' , require('./routes/auth'))


app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})   