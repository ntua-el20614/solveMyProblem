const amqp = require('amqplib');
const { exec } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const rabbitmq = process.env.RABBITMQ_URL || "amqp://user:password@rabbitmq";

async function connectRabbitMQ() {
  try {
    const connection = await amqp.connect(rabbitmq);
    const channel = await connection.createChannel();
    const queue = 'problem_queue';

    await channel.assertQueue(queue, { durable: false });
    console.log(" [*] Waiting for messages. To exit press CTRL+C");

    channel.consume(queue, async (msg) => {
      if (msg !== null) {
        const content = msg.content.toString();
        console.log(" [x] Received %s", content);

        // Parse the JSON message
        const data = JSON.parse(content);
        const inputFileContent = data.input_file;
        const param1 = data.param1;
        const param2 = data.param2;
        const param3 = data.param3;

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
            return;
          }
          if (stderr) {
            console.error(`stderr: ${stderr}`);
            return;
          }
          // Anti console log na pienni sti vasi os result
          console.log(`stdout: ${stdout}`);
        });

        // Acknowledge the message
        channel.ack(msg);
      }
    });
  } catch (error) {
    console.error("Failed to connect to RabbitMQ", error);
    process.exit(1);
  }
}

connectRabbitMQ();