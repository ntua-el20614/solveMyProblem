//parameters
//json file
const mongoose = require('mongoose');

const problemSchema = new mongoose.Schema({
  param1: {
    type: String,
    required: true
  },
  param2: {
    type: String,
    required: true
  },
  param3: {
    type: String,
    required: true
  },
  input_file: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['submitted', 'in-progress', 'solved'],
    default: 'submitted'
  },
  createdBy: { type: String, required: true }
}, { collection: 'submitedProblem' });

module.exports = mongoose.model('SubmitedProblems', problemSchema);
