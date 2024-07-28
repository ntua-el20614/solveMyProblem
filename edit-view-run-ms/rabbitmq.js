// rabbitmq.js

const amqp = require('amqplib/callback_api');
const mongoose = require('mongoose');
const SubmitedProblems = require('./models/Problem');


let channel = null;
const rabbitURI = process.env.RABBITMQ_URL;
let latestUsername = null;

exports.connectRabbitMQ = (retries = 5) => {
  amqp.connect(rabbitURI, (err, conn) => {
    if (err) {
      console.error('Failed to connect to RabbitMQ', err);
      if (retries > 0) {
        console.log(`Retrying... (${retries} attempts left)`);
        setTimeout(() => exports.connectRabbitMQ(retries - 1), 5000); // Retry after 5 seconds
      }
      return;
    }
    conn.createChannel((err, ch) => {
      if (err) {
        console.error('Failed to create a channel', err);
        return;
      }
      channel = ch;
      console.log('Connected to RabbitMQ');

      const queueName = 'user_actions';
      const statusQueue = 'status_queue';
      
      channel.assertQueue(queueName, { durable: true });
      console.log('Waiting for messages in %s', queueName);

      channel.assertQueue(statusQueue, { durable: true });
      console.log('Waiting for messages in %s', statusQueue);

      const problemQueue = 'problem_queue';
      channel.assertQueue(problemQueue, { durable: true });

      channel.consume(queueName, (msg) => {
        if (msg !== null) {
          const messageContent = msg.content.toString();
          console.log('Received message:', messageContent);
          exports.handleMessage(JSON.parse(messageContent));
          channel.ack(msg);
        }
      });

      channel.consume(statusQueue, (msg) => {
        if (msg !== null) {
          const messageContent = msg.content.toString();
          console.log('Received status update message:', messageContent);
          const { id, newStatus } = JSON.parse(messageContent);
          updateProblemStatus(id, newStatus);
          channel.ack(msg);
        }
      });

    });
  });
};

exports.handleMessage = (message) => {
  console.log('Handling message:', message);

  if (message.username) {
    console.log(`User ${message.username} logged in.`);
    latestUsername = message.username;
  }
};

exports.getLatestUsername = () => latestUsername;


exports.submitProblemToQueue = (problem) => {
  if (channel) {
    channel.sendToQueue('problem_queue', Buffer.from(JSON.stringify(problem)), {
      persistent: true
    });
    console.log('Problem submitted to problem_queue:', problem);
  } else {
    console.error('Channel is not available');
  }
};

const updateProblemStatus = async (problemId, newStatus) => {
  try {
    const updatedProblem = await SubmitedProblems.findByIdAndUpdate(problemId, { status: newStatus }, { new: true });
    if (updatedProblem) {
      console.log(`Problem ${problemId} status updated to ${newStatus}`);
    } else {
      console.error(`Problem ${problemId} not found`);
    }
  } catch (error) {
    console.error('Failed to update problem status', error);
  }
};
