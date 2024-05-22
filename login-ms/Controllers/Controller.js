const test_endpoint = async (req, res) => {
  try {
    res.status(200).json({ message: 'Test endpoint' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { test_endpoint };
