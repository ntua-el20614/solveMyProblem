require('dotenv').config();
const { connect } = require('mongoose');
const app = require('./app');
const { connectRabbitMQ } = require('./rabbitmq');
const PORT = process.env.PORT || 7002

connectRabbitMQ();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
