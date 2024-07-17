require('dotenv').config();
const app = require('./app');
const { connectRabbitMQ } = require('./rabbitmq');
const PORT = process.env.PORT || 7000;

connectRabbitMQ();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
