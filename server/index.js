const express = require('express')

const app = express();
const reg = require('./router/router')
const sud = require('./router/sud')
const corsMiddleware = require('./middleware/cors.middleware')

app.use(corsMiddleware)


app.use(express.json())
// simple route

app.use("/api/auth", reg)
app.use("/sudoku", sud)


// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});