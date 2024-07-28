const amqp = require('amqplib/callback_api');
const mongoose = require('mongoose');
const SolvedProblems = require('./Models/Results');

let channel = null;
const rabbitURI = process.env.RABBITMQ_URL;

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