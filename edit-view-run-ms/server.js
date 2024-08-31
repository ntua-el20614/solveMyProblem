require('dotenv').config();
const app = require('./app');
const { connectRabbitMQ } = require('./rabbitmq');
const PORT = process.env.PORT || 7000;

try {
  connectRabbitMQ();
} catch (error) {
  console.error('Failed to connect to RabbitMQ:', error);
  process.exit(1);
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
