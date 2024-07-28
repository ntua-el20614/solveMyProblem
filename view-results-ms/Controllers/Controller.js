const SolvedProblems = require('../Models/Results'); 

exports.test_endpoint = async (req, res) => {
  try {
    res.status(200).json({ message: 'Test endpoint' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.viewResults = async (req, res, next) => {
  const { username } = req.body;

  try {
    const results = await SolvedProblems.find({ createdBy: username });

    if (results.length > 0) {
      console.log('Results found:', results);
      res.status(200).json(results);
    } else {
      console.log('No results found');
      res.status(404).json({ message: 'No results found' });
    }
  } catch (error) {
    console.error('Error finding results:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};