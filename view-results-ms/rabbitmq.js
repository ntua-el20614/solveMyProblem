const amqp = require('amqplib/callback_api');
const mongoose = require('mongoose');
const SolvedProblems = require('./Models/Results');

let channel = null;
let connection = null;
const rabbitURI = process.env.RABBITMQ_URL;

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

    // Handle connection errors
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
        return;
      }
      channel = ch;
      console.log('Connected to RabbitMQ');

      const problemQueue = 'solvedProblems';
      const statusQueue = 'status_queue';

      channel.assertQueue(problemQueue, { durable: true });
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
    const { output_file, createdBy, problemID, param1, param2, param3, name } = messageContent;
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
      status: 'solved', // Ensure the status is set to 'solved'
      param1,
      param2,
      param3,
      name,
      executedOn: new Date()
    });
    console.log('New result:', newResult);

    // Save the result to the database
    await newResult.save();
    console.log('Result saved to the database:', newResult);

    // Send the _id and status to the status queue
    await publishToQueue("status_queue", { id: objectId, newStatus: "solved" });

  } catch (error) {
    console.error('Failed to handle message:', error);
  }
};

async function publishToQueue(queueName, message) {
  if (!channel) {
    console.error('Channel not set. Call connectRabbitMQ() first.');
    return;
  }

  try {
    channel.assertQueue(queueName, { durable: true });
    channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)), {
      persistent: true
    });
    console.log(`Message sent to ${queueName} queue:`, message);
  } catch (error) {
    console.error(`Failed to publish message to ${queueName}:`, error);
  }
}