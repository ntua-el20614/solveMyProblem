// rabbitmq.js

const amqp = require('amqplib/callback_api');


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
      channel.assertQueue(queueName, { durable: true });
      console.log('Waiting for messages in %s', queueName);

      channel.consume(queueName, (msg) => {
        if (msg !== null) {
          const messageContent = msg.content.toString();
          console.log('Received message:', messageContent);
          exports.handleMessage(JSON.parse(messageContent));
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

/*module.exports = {
  connectRabbitMQ,
};*/
