const Problem = require('../models/Problem');
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;
const { submitProblemToQueue } = require('../rabbitmq');
const fs = require('fs');
 

exports.submitProblem = async (req, res, next) => {
  const { param1, param2, param3, username } = req.body;
  const inputFilePath = req.file ? req.file.path : null;

  if (!inputFilePath) {
    return res.status(400).json({ message: 'Input file is required' });
  }

  try {
    const latestUsername = username;
    const inputFileContent = fs.readFileSync(inputFilePath, 'utf8');

    const newProblem = new Problem({
      param1,
      param2,
      param3,
      input_file: inputFileContent,
      createdBy: latestUsername
    });

    await newProblem.save();
    console.log(newProblem);
    //submitProblemToQueue(savedProblem);

    res.status(201).json({ message: 'Problem saved successfully' });
  } catch (error) {
    console.error('Error saving problem:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};

exports.finalSubmition = async (req, res, next) => {
  const { id } = req.body;
  
  // console.log('Request body:', req.body);
  // console.log('Received problemId:', id);

  try {
    // Ensure problemId is an ObjectId
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid problem ID format' });
    }

    const problem = await Problem.findById(id);
    console.log('Found problem:', problem);

    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    submitProblemToQueue(problem);

    res.status(200).json({ message: 'Problem submitted to queue successfully' });
  } catch (error) {
    console.error('Error submitting problem to queue:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};



exports.viewProblems = async (req, res, next) => {
  const { username } = req.body; // Destructure username from the request body
  const createdBy = username;

  try {
    const problems = await Problem.find({ createdBy });
    if (problems.length > 0) {
      console.log('Problems found:', problems);
      res.status(200).json(problems); // Send the problems as a JSON response
    } else {
      console.log('No problems found');
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
      console.log('Problems found:', problems);
      res.status(200).json(problems); // Send the problems as a JSON response
    } else {
      console.log('No problems found');
      res.status(200).json([]); // Send an empty array if no problems found
    }
  } catch (error) {
    console.error('Error finding problems:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};

exports.editProblem = async (req, res, next) => {
  const { id, param1, param2, param3, deleteProblem } = req.body;
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

