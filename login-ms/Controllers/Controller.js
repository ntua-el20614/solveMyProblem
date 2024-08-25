const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
//const { publishToQueue } = require('../rabbitmq');
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
    const currentUser = await User.find( { username } );


    const token = jwt.sign(
      { userId: currentUser._id, username: currentUser.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' } // Token expires in 1 hour
    );

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};


exports.authenticateUser = async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: 'Authentication failed: User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Authentication failed: Incorrect password' });
    }

    const token = jwt.sign(
      { userId: user._id, username: user.username, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: '1h' } 
    );

    res.status(200).json({ message: 'Authentication successful', token });
  } catch (error) {
    console.error('Error authenticating user:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};

exports.logout = async (req, res, next) => {
  res.status(200).json({ message: 'Logout Successfull'});
};

exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    if (users.length > 0) {
      console.log('Users found:', users);
      res.status(200).json(users);
    } else {
      console.log('No users found');
      res.status(404).json({ message: 'No users found' });
    }
  } catch (error) {
    console.error('Error finding users:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};

exports.getHealth = async (req, res, next) => {
  res.status(200).json({ message: 'Login microservice is healthy' });
};

exports.viewTempCredits = async (req, res) => {
  const { username } = req.params;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ username: user.username, tempCredits: user.using_tokens });
  } catch (error) {
    console.error('Error retrieving temp credits:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};

exports.viewCredits = async (req, res) => {
  const { username } = req.params;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ username: user.username, credits: user.actual_tokens });
  } catch (error) {
    console.error('Error retrieving credits:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};

exports.addTempCredits = async (req, res) => {
  const { username, value } = req.params;  // Value from URL parameter (+1 or -1)

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Convert value to a number and update the user's temporary credits (using_tokens)
    const creditChange = parseInt(value, 10);
    if (isNaN(creditChange)) {
      return res.status(400).json({ message: 'Invalid value. Must be +1 or -1' });
    }

    user.using_tokens += creditChange;

    await user.save();

    res.status(200).json({ message: 'Temporary credits updated successfully', tempCredits: user.using_tokens });
  } catch (error) {
    console.error('Error updating temporary credits:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};

exports.addCredits = async (req, res) => {
  const { username, value } = req.params;  // Value from URL parameter (+1 or -1)

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Convert value to a number and update the user's actual credits (actual_tokens)
    const creditChange = parseInt(value, 10);
    if (isNaN(creditChange)) {
      return res.status(400).json({ message: 'Invalid value. Must be +1 or -1' });
    }

    user.actual_tokens += creditChange;

    await user.save();

    res.status(200).json({ message: 'Credits updated successfully', credits: user.actual_tokens });
  } catch (error) {
    console.error('Error updating credits:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};

