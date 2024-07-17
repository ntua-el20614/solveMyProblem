// rabbitmq.js

const amqp = require('amqplib/callback_api');

exports.connectRabbitMQ = () => {
  amqp.connect('amqp://localhost', (err, conn) => {
    if (err) {
      console.error('Failed to connect to RabbitMQ', err);
      return;
    }
    conn.createChannel((err, ch) => {
      if (err) {
        console.error('Failed to create a channel', err);
        return;
      }
      const queueName = 'user_actions';
      ch.assertQueue(queueName, { durable: true });
      console.log('Waiting for messages in %s', queueName);

      ch.consume(queueName, (msg) => {
        if (msg !== null) {
          const messageContent = msg.content.toString();
          console.log('Received message:', messageContent);
          handleMessage(JSON.parse(messageContent));
          ch.ack(msg);
        }
      });
    });
  });
};

exports.handleMessage = (message) => {
  // Handle the message (e.g., save to database)
  console.log('Handling message:', message);

  if (message.action === 'login') {
    // Logic to handle login action
    console.log(`User ${message.username} logged in.`);
    // You can save the message to the database or perform other actions
  }
};

/*module.exports = {
  connectRabbitMQ,
};*/
