const mongoose = require('mongoose');

const problemSchema = new mongoose.Schema({
  output_file: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['submitted', 'in-progress', 'solved'],
    default: 'solved'
  },
  createdBy: { type: String, required: true }
}, { collection: 'solvedProblem' });

module.exports = mongoose.model('SolvedProblems', problemSchema);
