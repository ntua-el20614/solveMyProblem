exports.test_endpoint = async (req, res) => {
  try {
    res.status(200).json({ message: 'Test endpoint' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.submitProblem = async (req, res, next) => {
  const { title, description } = req.body;

  try {
    const latestUsername = getLatestUsername();
    const newProblem = new Problem({ title, description, createdBy: latestUsername });
    await newProblem.save();
    submitProblemToQueue(newProblem);

    res.status(201).json({ message: 'Problem submitted successfully' });
  } catch (error) {
    console.error('Error submitting problem:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }


};

//module.exports = { test_endpoint };
