const express = require('express')
const battleshipRoute = require ("./routes/battleship.route.js");
// const cors = require('cors');

const app = express()
const port = 3001

count = 0

// app.use(cors());
app.use(express.json());
app.use ("/api/battleship", battleshipRoute);

app.get('/', (req, res) => {
  count++   
  console.log(count)
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
  console.log(count)
})
