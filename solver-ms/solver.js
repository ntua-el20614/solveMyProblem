const amqp = require('amqplib');
require('dotenv').config();
const { exec } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const rabbitmq = process.env.RABBITMQ_URL;
let channel = null;

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
    const problemID = data._id;
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

    // Update the problem status
    publishToQueue("status_queue", { id: problemID, newStatus: "in-progress" });
    console.log("Status updated to \"In-Progress\"");

    console.log("Executing command:", command);

    // Execute the command
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing command: ${error.message}`);
      } else if (stderr) {
        console.error(`stderr: ${stderr}`);
      } else {
          try {
            output_file = stdout;
            publishToQueue("solvedProblems", { createdBy, output_file, problemID });
          } catch (error) {
              console.error('Error saving results:', error);
          } 
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
  for (let attempts = 1; attempts <= 5; attempts++) {
    try {
      const connection = await amqp.connect(rabbitmq);
      channel = await connection.createChannel();
      const queue = 'problem_queue';
      const queue1 = 'solvedProblems';
      const queue2 = 'status_queue';
  
      await channel.assertQueue(queue, { durable: true });
      await channel.assertQueue(queue1, { durable: true });
      await channel.assertQueue(queue2, { durable: true });
      console.log("Connected to RabbitMQ");
  
      channel.consume(queue, async (msg) => {
        if (msg !== null) {
          messageQueue.push(msg);
          if (!processing) {
            processMessage(channel);
          }
        }
      });
      return;
    } catch (error) {
      console.error(`Failed to connect to RabbitMQ (attempt ${attempts} of 5)`, error);
      if (attempts === 5) {
        console.error("Max retries reached. Exiting.");
        process.exit(1);
      } else {
        console.log(`Retrying in 5 seconds...`);
        await new Promise(res => setTimeout(res, 5000));
      }
  }
  }
}

async function publishToQueue (queueName, message) {
  if (!channel) {
    console.error('Channel not set. Call connectRabbitMQ() first.');
    return;
  }
  channel.assertQueue(queueName, { durable: true });
  channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)));
};

connectRabbitMQ();
