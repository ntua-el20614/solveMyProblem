const mongoose = require('mongoose');

const problemSchema = new mongoose.Schema({
  id: {
    type: mongoose.Schema.Types.ObjectId,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
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
  executedOn: {
    type: Date,
    required: true
  },
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

module.exports = mongoose.model('Results', problemSchema);