const amqp = require('amqplib/callback_api');
const mongoose = require('mongoose');
const User = require('./models/User');

let channel = null;
let connection = null;
const rabbitURI = process.env.RABBITMQ_URL;

exports.connectRabbitMQ = (retries = 1) => {
  amqp.connect(rabbitURI, (err, conn) => {
    if (err) {
      console.error('Failed to connect to RabbitMQ', err);
      //if (retries > 0) {
        //console.log(`Retrying... (${retries} attempts left)`);
        //setTimeout(() => exports.connectRabbitMQ(retries - 1), 5000); // Retry after 5 seconds
      //} else {
        //console.error('Max retries reached. Exiting.');
      process.exit(1);
      //}
    }

    connection = conn;

    conn.on('error', (err) => {
      console.error('Connection error', err);
      process.exit(1);
    });

    conn.on('close', () => {
      console.error('Connection to RabbitMQ closed. Exiting.');
      process.exit(1);
    });

    conn.createChannel((err, ch) => {
      if (err) {
        console.error('Failed to create a channel', err);
        process.exit(1);
      }
      channel = ch;
      console.log('Connected to RabbitMQ');

      const creditQueue = 'credit_queue';
      channel.assertQueue(creditQueue, { durable: true });

      // Consume from credit_queue
      channel.consume(creditQueue, async (msg) => {
        if (msg !== null) {
          console.log('Received message from credit_queue:', msg.content.toString());
          try {
            await exports.handleCreditMessage(msg);  // Await the message handling
            channel.ack(msg);  // Acknowledge the message only after processing
          } catch (error) {
            console.error('Error processing message:', error);
            // Optionally, you might decide to not acknowledge the message,
            // which could result in the message being re-delivered depending on your setup.
          }
        }
      });
    });
  });
};

// Function to handle messages from credit_queue
exports.handleCreditMessage = async (message) => {
  const messageContent = JSON.parse(message.content.toString());
  const { createdBy } = messageContent;

  try {
    // Use $inc to atomically update the user's tokens
    const result = await User.findOneAndUpdate(
      { username: createdBy },
      { $inc: { actual_tokens: -1 } },  // Decrement tokens by 1
      { new: true }  // Return the updated document
    );

    if (result) {
      console.log(`Credits updated successfully for ${createdBy}: ${result.actual_tokens} tokens remaining`);
    } else {
      console.log(`${createdBy} not found`);
    }
  } catch (error) {
    console.error('Error updating credits:', error);
    throw error;  // Re-throw the error to be caught in the consume block
  }
};
