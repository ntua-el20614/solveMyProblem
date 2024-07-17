const amqp = require('amqplib/callback_api');

let channel = null;
//const queue = 'login-ms';
const rabbituri = 'amqp://localhost';//process.env.RABBITMQ_URL;

exports.connectRabbitMQ = (retries = 5) => {
  amqp.connect(rabbituri, (err, conn) => {
    if (err) {
      console.error('Failed to connect to RabbitMQ', err);
      if (retries > 0) {
        console.log(`Retrying... (${retries} attempts left)`);
        setTimeout(() => connectRabbitMQ(retries - 1), 5000); // Retry after 5 seconds
      }
      return;
    }
    conn.createChannel((err, ch) => {
      console.log('Creating channel');
      if (err) {
        console.error('Failed to create a channel', err);
        return;
      }
      channel = ch;
      console.log('Connected to RabbitMQ');
    });
  });
};

exports.publishToQueue = (queueName, message) => {
  console.log('Publishing message to queue');
  if (!channel) {
    console.error('Channel not set. Call connectRabbitMQ() first.');
    return;
  }
  channel.assertQueue(queueName, { durable: true });
  channel.sendToQueue(queueName, Buffer.from(message));
};

/*module.exports = {
  connectRabbitMQ,
  publishToQueue,
};*/
