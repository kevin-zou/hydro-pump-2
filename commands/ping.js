const config = require('../config');

module.exports = {
  name: 'ping',
  description: 'Ping!',
  execute(msg, args) {
    msg.channel.send('Pong!');
    console.log(config); // For debugging
  },
};
