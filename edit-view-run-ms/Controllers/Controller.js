const Problem = require('../models/Problem');
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;
const { submitProblemToQueue } = require('../rabbitmq');
const fs = require('fs');
 

exports.submitProblem = async (req, res, next) => {
  const { param1, param2, param3, username, name } = req.body;
  const inputFilePath = req.file ? req.file.path : null;

  if (!inputFilePath) {
    return res.status(400).json({ message: 'Input file is required' });
  }

  try {
    const latestUsername = username;
    const inputFileContent = fs.readFileSync(inputFilePath, 'utf8');
    const createdOn = new Date();

    const newProblem = new Problem({
      param1,
      param2,
      param3,
      name,
      createdOn,
      input_file: inputFileContent,
      createdBy: latestUsername
    });

    await newProblem.save();

    res.status(201).json({ message: 'Problem saved successfully' });
  } catch (error) {
    console.error('Error saving problem:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};

exports.finalSubmition = async (req, res, next) => {
  const { id } = req.body;
  
  try {
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid problem ID format' });
    }

    const problem = await Problem.findById(id);

    
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    updateProblemStatus(problem._id, 'in-queue');  
    submitProblemToQueue(problem);

    res.status(200).json({ message: 'Problem submitted to queue successfully' });
  } catch (error) {
    console.error('Error submitting problem to queue:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};

exports.deleteProblem = async (req, res, next) => {
  const { id } = req.query;
  try{
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid problem ID format' });
    }

    const deletedProblem = await Problem.findByIdAndDelete(id);

    if (!deletedProblem) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    res.status(200).json({ message: 'Problem deleted successfully' });
  }
  catch (error) {
    console.error('Error deleting problem:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};

exports.viewProblems = async (req, res, next) => {
  const { username } = req.query;  // Accessing username from query parameters correctly
  // Correctly construct a query object that uses a regex for case-insensitive matching
  const query = username ? { createdBy: { $regex: new RegExp(username, 'i') } } : {};
  
  try {
    const problems = await Problem.find(query);
    if (problems.length > 0) {
      res.status(200).json(problems); // Send the problems as a JSON response
    } else {

      res.status(200).json([]); // Send an empty array if no problems found
    }
  } catch (error) {
    console.error('Error finding problems:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};




exports.viewAllProblems = async (req, res, next) => {
  const { username } = req.body;

  try {
    let query = {};

    if (username) {
      query.createdBy = { $regex: username, $options: 'i' }; // Case-insensitive search
    }

    const problems = await Problem.find(query);
    if (problems.length > 0) {
      res.status(200).json(problems); // Send the problems as a JSON response
    } else {

      res.status(200).json([]); // Send an empty array if no problems found
    }
  } catch (error) {
    console.error('Error finding problems:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};

exports.editProblem = async (req, res, next) => {
  const { id, param1, param2, param3, name, deleteProblem } = req.body;
  const inputFile = req.file; // Assuming the file is uploaded with a field name 'file'

  try {
    if (deleteProblem) {
      // Delete the problem
      const deletedProblem = await Problem.findByIdAndDelete(id);

      if (!deletedProblem) {
        return res.status(404).json({ message: 'Problem not found' });
      }

      return res.status(200).json({ message: 'Problem deleted successfully' });
    }

    // Prepare the update object
    const update = {};
    if (param1) update.param1 = param1;
    if (param2) update.param2 = param2;
    if (param3) update.param3 = param3;
    if (name) update.name = name;
    if (inputFile) {
      const inputFileContent = fs.readFileSync(inputFile.path, 'utf8');
      update.input_file = inputFileContent;
    }

    // Find the problem by ID and update it
    const updatedProblem = await Problem.findByIdAndUpdate(
      id,
      update,
      { new: true } // Return the updated document
    );

    if (!updatedProblem) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    res.status(200).json({ message: 'Problem updated successfully', updatedProblem });
  } catch (error) {
    console.error('Error updating problem:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};

