const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { publishToQueue } = require('../rabbitmq');
const { consumeFromQueue } = require('../rabbitmq');

exports.test_endpoint = async (req, res) => {
  try {
    consumeFromQueue('user_actions', (message) => {
      console.log('Received message from queue:', message);
      res.status(200).json({ message: 'Test endpoint', queueMessage: message });
    });
  } catch (error) {
    console.error('Error in test_endpoint:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};

exports.registerUser = async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      password: hashedPassword
    });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};


exports.authenticateUser = async (req, res, next) => {
  const { username, password } = req.body;

  try {
    // Find the user by username
    const user = await User.findOne({ username });

    // If the user is not found, return a 401 status with an error message
    if (!user) {
      return res.status(401).json({ message: 'Authentication failed: User not found' });
    }

    // Compare the provided password with the hashed password stored in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log('Is password valid:', isPasswordValid);

    // If the password is incorrect, return a 401 status with an error message
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Authentication failed: Incorrect password' });
    }

    // If the password is correct, generate a JWT token
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' } // Token expires in 1 hour
    );
    console.log('Generated token:', token);

    // Publish the token to the RabbitMQ queue
    const message = JSON.stringify({ username: user.username, action: 'login' });
    publishToQueue('user_actions', message);
    console.log('Published message to queue:', message);
    // Respond with a 200 status and include the token
    res.status(200).json({ message: 'Authentication successful', token });
  } catch (error) {
    console.error('Error authenticating user:', error);
    // Handle any errors that occur during the authentication process
    res.status(500).json({ message: 'Internal server error', error });
  }
};

