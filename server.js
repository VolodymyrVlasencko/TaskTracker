const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const user = require('./routes/user');
const task = require('./routes/task');

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:true }));

app.use('/user', user);
app.use('/task', task);

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server listening ${process.env.PORT}`);
})
