const config = require('../config');
const Guild = require('../models/Guild');

module.exports = {
  name: 'setPrefix',
  description: 'User command to change prefix for this bot',
  async execute(msg, args) {
    // TODO: Add validation, the prefix should be max length of 1
    const newPrefix = args[0];

    // Update the databse
    await Guild.findByIdAndUpdate(msg.guild.id, { prefix: newPrefix }, async (err, guild) => {
      if (err) {
        console.error(err);
      }
      if (!guild) {
        await Guild.create({ _id: msg.guild.id, prefix: newPrefix });
      }
    });

    // Update local config
    config.guilds[msg.guild.id] = config.guilds[msg.guild.id] || {};
    config.guilds[msg.guild.id].prefix = newPrefix;

    msg.channel.send(`Hydro Pump prefix changed to ${newPrefix}`);
  },
};
