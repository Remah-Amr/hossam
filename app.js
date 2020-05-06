const path = require('path');
const express = require('express')
const mongoose = require('mongoose')
const multer = require('multer');
const bodyParser = require('body-parser')
const feedRouter = require('./routes/feed')


const app = express();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    cb(null,file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// app.use(bodyParser.urlencoded())//this for x-www-form-urlencoded<form>
app.use(bodyParser.json()); // application/json
// app.use(
//   multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
// );
app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).any())
app.use('/images', express.static(path.join(__dirname, 'images')));


// to solve corse error 
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use('/feed', feedRouter)

app.use((error, req, res, next) => {
  console.log(error)
  const status = error.statusCode || 500;
  const message = error.message
  res.status(status).json({ message: message, statusCode: status });
})

mongoose.connect("mongodb+srv://AhmedHossam:01008453103@onlineshoping-iso7v.mongodb.net/API_Shop", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected..'))
  .catch(err => console.log(err));


app.listen(8080, () => {
  console.log('Application Connected')
})