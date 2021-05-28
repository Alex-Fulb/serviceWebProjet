const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose')

var dotenv = require('dotenv').config();
var cookieParser = require('cookie-parser')
var path = require('path');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded())
app.use(cookieParser())

//

app.use(express.static(path.join(__dirname, 'public')));
//

app.set('view engine', 'ejs');

const uri = process.env.ATLAS_URI;
mongoose.connect(
  uri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
}
);

const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
})

const userRouter = require('./routes/userRoutes');
const webSiteRouter = require('./routes/webSiteRoutes');

app.use('/', userRouter);
app.use('/home', webSiteRouter);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});