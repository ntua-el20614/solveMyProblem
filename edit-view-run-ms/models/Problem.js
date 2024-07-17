const mongoose = require('mongoose');

const problemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['submitted', 'in-progress', 'solved'],
    default: 'submitted'
  }
}, { collection: 'submitedProblem' });

module.exports = mongoose.model('SubmitedProblems', problemSchema);
