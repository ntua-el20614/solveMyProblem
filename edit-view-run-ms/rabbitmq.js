const amqp = require('amqplib/callback_api');
const mongoose = require('mongoose');
const SubmitedProblems = require('./models/Problem');

let channel = null;
let connection = null;
const rabbitURI = process.env.RABBITMQ_URL;
let latestUsername = null;

exports.connectRabbitMQ = (retries = 1) => {
  amqp.connect(rabbitURI, (err, conn) => {
    if (err) {
      console.error('Failed to connect to RabbitMQ:', err);
      //if (retries > 0) {
      //  console.log(`Retrying... (${retries} attempts left)`);
      //  setTimeout(() => exports.connectRabbitMQ(retries - 1), 5000); // Retry after 5 seconds
      //} else {
      //  console.error('Max retries reached. Exiting.');
      process.exit(1);
      //}
      //return;
    }

    connection = conn;

    connection.on('error', (err) => {
      console.error('Connection error:', err);
      process.exit(1);
    });

    connection.on('close', () => {
      console.error('Connection to RabbitMQ closed. Exiting.');
      process.exit(1);
    });

    conn.createChannel((err, ch) => {
      if (err) {
        console.error('Failed to create a channel:', err);
        process.exit(1);
      }

      channel = ch;
      console.log('Connected to RabbitMQ');

      const queueName = 'user_actions';
      const statusQueue = 'status_queue';
      const problemQueue = 'problem_queue';

      channel.assertQueue(queueName, { durable: true });
      channel.assertQueue(statusQueue, { durable: true });
      channel.assertQueue(problemQueue, { durable: true });

      channel.consume(queueName, (msg) => {
        if (msg !== null) {
          const messageContent = msg.content.toString();
          exports.handleMessage(JSON.parse(messageContent));
          channel.ack(msg);
        }
      });

      channel.consume(statusQueue, (msg) => {
        if (msg !== null) {
          const messageContent = msg.content.toString();
          const { id, newStatus } = JSON.parse(messageContent);
          updateProblemStatus(id, newStatus);
          channel.ack(msg);
        }
      });
    });
  });
};

exports.handleMessage = (message) => {
  if (message.username) {
    console.log(`User ${message.username} logged in.`);
    latestUsername = message.username;
  }
};

exports.getLatestUsername = () => latestUsername;

exports.submitProblemToQueue = async (problem) => {
  if (channel) {
    try {
      await updateProblemStatus(problem._id, 'in-queue');
      channel.sendToQueue('problem_queue', Buffer.from(JSON.stringify(problem)), {
        persistent: true
      });
      console.log(`Problem ${problem._id} submitted to queue.`);
    } catch (error) {
      console.error('Failed to submit problem to queue', error);
    }
  } else {
    console.error('Channel is not available');
  }
};

const updateProblemStatus = async (problemId, newStatus) => {
  try {
    const updatedProblem = await SubmitedProblems.findByIdAndUpdate(problemId, { status: newStatus }, { new: true });
    if (updatedProblem) {
      console.log(`Problem ${problemId} updated with status ${newStatus}`);
    } else {
      console.error(`Problem ${problemId} not found`);
    }
  } catch (error) {
    console.error('Failed to update problem status', error);
  }
};