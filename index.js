const express = require("express");
const db = require("./db.js")
const app = express();
const port = 4000






app.use(express.json());

app.get("/", (req, res) => {
  res.send('Hello World!')
});


app.use('/api/auth' , require('./routes/auth'))


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})   