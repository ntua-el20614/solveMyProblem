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

      const statusQueue = 'status_queue';
      channel.assertQueue(statusQueue, { durable: true });

      channel.consume(problemQueue, (msg) => {
        if (msg !== null) {
          const messageContent = msg.content.toString();
          console.log('Received message:', messageContent);
          exports.handleMessage(msg);
          channel.ack(msg);
        }
      });
    });
  });
};

exports.handleMessage = async (message) => {
  try {
    const messageContent = JSON.parse(message.content.toString());
    const { output_file, createdBy, problemID } = messageContent;
    console.log('Message content:', messageContent);

    // Validate problemID
    if (!mongoose.Types.ObjectId.isValid(problemID)) {
      console.error(`Invalid ObjectId: ${problemID}`);
      return; // Exit if ID is invalid
    }

    const objectId = new mongoose.Types.ObjectId(problemID);

    // Create a new SolvedProblems object
    const newResult = new SolvedProblems({
      _id: objectId, // Use the validated ObjectId
      output_file,
      createdBy,
      status: 'solved' // Ensure the status is set to 'solved'
    });
    console.log('New result:', newResult);

    // Save the result to the database
    await newResult.save();
    console.log('Result saved to the database:', newResult);

    // Send the _id and status to update
    publishToQueue("status_queue", { id: objectId, newStatus: "solved" });

  } catch (error) {
    console.error('Failed to handle message', error);
  }
};


async function publishToQueue (queueName, message) {
  if (!channel) {
    console.error('Channel not set. Call connectRabbitMQ() first.');
    return;
  }
  channel.assertQueue(queueName, { durable: true });
  channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)));
};