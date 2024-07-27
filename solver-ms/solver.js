const amqp = require('amqplib');
require('dotenv').config();
const { exec } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const rabbitmq = process.env.RABBITMQ_URL;

let processing = false;
const messageQueue = [];

async function processMessage(channel) {
  if (messageQueue.length === 0) {
    processing = false;
    return;
  }

  processing = true;
  const msg = messageQueue.shift();

  if (msg !== null) {
    const content = msg.content.toString();
    console.log(" [x] Received %s", content);

    // Parse the JSON message
    const data = JSON.parse(content);
    const inputFileContent = data.input_file;
    const param1 = data.param1;
    const param2 = data.param2;
    const param3 = data.param3;
    const createdBy = data.createdBy;

    // Create a temporary file for the input JSON
    const tempFilePath = path.join(os.tmpdir(), 'input_data.json');
    fs.writeFileSync(tempFilePath, inputFileContent);

    // Construct the command
    const command = `python vrpSolver.py ${tempFilePath} ${param1} ${param2} ${param3}`;
    console.log("Executing command:", command);

    // Execute the command
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing command: ${error.message}`);
      } else if (stderr) {
        console.error(`stderr: ${stderr}`);
      } else {
        // Log the result or store it in a database as needed
        console.log(`Mr/Mrs ${createdBy} here are your results: ${stdout}`);
      }

      // Acknowledge the message
      channel.ack(msg);

      // Process the next message in the queue
      processMessage(channel);
    });
  } else {
    processing = false;
  }
}

async function connectRabbitMQ() {
  try {
    const connection = await amqp.connect(rabbitmq);
    const channel = await connection.createChannel();
    const queue = 'problem_queue';

    await channel.assertQueue(queue, { durable: true });
    console.log(" [*] Waiting for messages. To exit press CTRL+C");

    channel.consume(queue, async (msg) => {
      if (msg !== null) {
        messageQueue.push(msg);
        if (!processing) {
          processMessage(channel);
        }
      }
    });
  } catch (error) {
    console.error("Failed to connect to RabbitMQ", error);
    process.exit(1);
  }
}

connectRabbitMQ();
