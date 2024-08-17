const mongoose = require('mongoose');

const problemSchema = new mongoose.Schema({
  id: {
    type: mongoose.Schema.Types.ObjectId,
    unique: true
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