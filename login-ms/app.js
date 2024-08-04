const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const routes = require('./Routes/Routes');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB using the URI from the .env file
const mongoUri = process.env.MONGO_URI;

mongoose.connect(mongoUri)
  .then(() => {
    console.log('Connected to Database');
  })
  .catch(err => {
    console.error('Failed to connect to Database', err);
  });

// Routes
app.use('/', routes);

// Handle 404
app.use((req, res, next) => {
  res.status(404).json({ message: 'Endpoint not found' });
});

module.exports = app;
