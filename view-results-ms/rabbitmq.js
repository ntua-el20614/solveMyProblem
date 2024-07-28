const amqp = require('amqplib/callback_api');
const mongoose = require('mongoose');
const SolvedProblems = require('./Models/Results');

let channel = null;
const rabbitURI = process.env.RABBITMQ_URL;
//const queueName='solvedProblems';

/*exports.consumeFromQueue = (queueName) => {
    if (!channel) {
      console.error('Channel not set. Call connectRabbitMQ() first.');
      return;
    }
    channel.assertQueue(queueName, { durable: true });
    channel.consume(queueName, async (msg) => {
      if (msg !== null) {
        try {
          const messageContent = msg.content.toString();
          console.log("Received message:", messageContent);
  
          // Parse the message content
          const data = JSON.parse(messageContent);
          
          // Save data to MongoDB
          const newSolvedProblem = new SolvedProblems({ output_file: data.output_file, status: 'solved', createdBy: data.createdBy });
          await newSolvedProblem.save();
          console.log("Result saved to MongoDB");
        } catch (error) {
          console.error("Error processing message:", error);
        }
        
        // Acknowledge the message
        channel.ack(msg);
      }
    });
  };*/

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

      const problemQueue = 'solvedProblems';
      channel.assertQueue(problemQueue, { durable: true });

      channel.consume(problemQueue, (msg) => {
        if (msg !== null) {
          const messageContent = msg.content.toString();
          console.log('Received message:', messageContent);

          channel.ack(msg);
        }
      });
    });
  });
};

/*exports.publishToQueue = (queueName, message) => {
  if (!channel) {
    console.error('Channel not set. Call connectRabbitMQ() first.');
    return;
  }
  channel.assertQueue(queueName, { durable: true });
  channel.sendToQueue(queueName, Buffer.from(message));
};*/


