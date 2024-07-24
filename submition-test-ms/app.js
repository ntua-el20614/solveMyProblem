const express = require('express');
const amqp = require('amqplib/callback_api');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const upload = multer({ dest: 'uploads/' }); // Files will be saved in 'uploads' directory

const RABBITMQ_URL = 'amqp://user:password@rabbitmq';

app.post('/submit', upload.single('input_file'), (req, res) => {
  const { param1, param2, param3 } = req.body;
  const inputFilePath = req.file.path;

  // Read the uploaded JSON file
  fs.readFile(inputFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error reading the uploaded file');
    }

    const problemData = {
      input_file: data,  // The content of the JSON file
      param1: parseInt(param1, 10),
      param2: parseInt(param2, 10),
      param3: parseInt(param3, 10)
    };

    amqp.connect(RABBITMQ_URL, (err, connection) => {
      if (err) {
        console.error('Failed to connect to RabbitMQ', err);
        if (retries > 0) {
          console.log(`Retrying... (${retries} attempts left)`);
          setTimeout(() => exports.connectRabbitMQ(retries - 1), 5000); // Retry after 5 seconds
        }
        return;
      }

      connection.createChannel((err, channel) => {
        if (err) {
          console.error(err);
          return res.status(500).send('Failed to create RabbitMQ channel');
        }

        const queue = 'problem_queue';
        const msg = JSON.stringify(problemData);

        channel.assertQueue(queue, { durable: false });
        channel.sendToQueue(queue, Buffer.from(msg));

        console.log(" [x] Sent %s", msg);
        res.status(200).send('Problem submitted');
      });
    });
  });
});

app.listen(7003, () => {
  console.log('Server is running on port 3000');
});