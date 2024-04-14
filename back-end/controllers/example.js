const { query } = require('express');
const { pool } = require('../utils/database');


exports.getExampleEndpoint = (req, res, next) => {
    res.status(200).json({ message: 'Hello World!' });
}
