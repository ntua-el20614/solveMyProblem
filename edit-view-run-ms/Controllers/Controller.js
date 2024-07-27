const Problem = require('../models/Problem');
const { getLatestUsername } = require('../rabbitmq');
const { submitProblemToQueue } = require('../rabbitmq');
const fs = require('fs');

exports.test_endpoint = async (req, res) => {
  try {
    const latestUsername = getLatestUsername();
    if (latestUsername) {
      res.status(200).json({ message: 'Test endpoint', username: latestUsername });
    } else {
      res.status(200).json({ message: 'Test endpoint', info: 'No username available.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.submitProblem = async (req, res, next) => {
  //const { title, description } = req.body;

  const { param1, param2, param3 } = req.body;
  const inputFilePath = req.file.path;

  

  try {
    const latestUsername = getLatestUsername();
    const inputFileContent = fs.readFileSync(inputFilePath, 'utf8');

    const newProblem = new Problem({
      param1,
      param2,
      param3,
      input_file: inputFileContent,
      createdBy: latestUsername
    });

    await newProblem.save();
    submitProblemToQueue(newProblem);

    res.status(201).json({ message: 'Problem submitted successfully' });
  } catch (error) {
    console.error('Error submitting problem:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }


};
/*
module.exports = {
  test_endpoint,
  submitProblem,
};*/
