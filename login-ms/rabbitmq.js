/*const amqp = require('amqplib/callback_api');

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
    });
  });
};

exports.publishToQueue = (queueName, message) => {
  if (!channel) {
    console.error('Channel not set. Call connectRabbitMQ() first.');
    return;
  }
  channel.assertQueue(queueName, { durable: true });
  channel.sendToQueue(queueName, Buffer.from(message));
};

exports.consumeFromQueue = (queueName, callback) => {
  if (!channel) {
    console.error('Channel not set. Call connectRabbitMQ() first.');
    return;
  }
  channel.assertQueue(queueName, { durable: true });
  channel.consume(queueName, (msg) => {
    if (msg !== null) {
      callback(msg.content.toString());
      channel.ack(msg);
    }
  });
};
*/