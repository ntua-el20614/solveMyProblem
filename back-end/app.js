const express = require('express');
const cors = require('cors');
const multer = require('multer');

/* Import routes */
const exampleRoutes = require('./routes/example');

const app = express();
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


/* Routes used */
app.use('/example',exampleRoutes);

//app.use('/',(req,res,next)=> {res.status(404).json({message: 'Hello and welcome to the backend server of ntuaflix'})})
app.use((req, res, next) => { res.status(404).json({ message: 'Endpoint not found' }) });

module.exports = app;